"""
Local Embedding Functions for ChromaDB
=======================================
Custom embedding functions using local ONNX/OpenVINO models instead of
auto-downloading from HuggingFace. Addresses enterprise air-gapped deployment
requirements.

Supports dual-mode inference:
  - ONNX via onnxruntime (cross-platform, good performance)
  - OpenVINO via openvino-runtime (Intel CPU optimized, 2-3x faster)

Configuration via environment variables:
  - AMF_LOCAL_MODEL_PATH: Path to model directory (required)
  - AMF_EMBEDDING_BACKEND: 'auto', 'onnx', or 'openvino' (default: auto)
  - AMF_ALLOW_MODEL_DOWNLOAD: 'true' or 'false' (default: false, strict mode)

Model Directory Structure (example for all-MiniLM-L6-v2):
  {AMF_LOCAL_MODEL_PATH}/
    onnx/
      model.onnx
    openvino/          # Optional but recommended for Intel CPUs
      model.xml
      model.bin
    tokenizer.json
    tokenizer_config.json
    config.json

Usage:
    from models.embeddings import create_embedding_function
    import chromadb
    
    client = chromadb.PersistentClient(path="./my_db")
    emb_fn = create_embedding_function()
    
    collection = client.get_or_create_collection(
        name="my_collection",
        embedding_function=emb_fn,
        metadata={'hnsw:space': 'cosine'},
    )

Standalone testing:
    python models/embeddings.py --test
"""
from __future__ import annotations

import json
import logging
import os
import platform
import time
import warnings
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np

# ChromaDB's EmbeddingFunction protocol
try:
    from chromadb import Documents, EmbeddingFunction, Embeddings
except ImportError:
    # Graceful fallback for type hints if chromadb not installed
    Documents = List[str]  # type: ignore
    Embeddings = List[List[float]]  # type: ignore
    
    class EmbeddingFunction(ABC):  # type: ignore
        """Minimal stub for type checking when chromadb unavailable."""
        @abstractmethod
        def __call__(self, input: Documents) -> Embeddings:
            pass


logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Configuration & Validation
# ─────────────────────────────────────────────────────────────────────────────

def _get_model_path() -> Path:
    """Reads AMF_LOCAL_MODEL_PATH from environment, validates directory exists.
    
    Returns:
        Path to model directory
        
    Raises:
        ValueError: If AMF_LOCAL_MODEL_PATH not set or path doesn't exist
    """
    path_str = os.environ.get('AMF_LOCAL_MODEL_PATH', '').strip()
    if not path_str:
        raise ValueError(
            "AMF_LOCAL_MODEL_PATH environment variable not set. "
            "Set it to the directory containing your local embedding model files. "
            "Example: AMF_LOCAL_MODEL_PATH=D:/amf_models/all-MiniLM-L6-v2"
        )
    
    path = Path(path_str)
    if not path.exists():
        raise ValueError(
            f"AMF_LOCAL_MODEL_PATH points to non-existent directory: {path}\n"
            f"Run: python utils/setup_local_models.py --download --path {path}"
        )
    
    if not path.is_dir():
        raise ValueError(
            f"AMF_LOCAL_MODEL_PATH must be a directory, got file: {path}"
        )
    
    return path


def _get_backend_preference() -> str:
    """Reads AMF_EMBEDDING_BACKEND from environment.
    
    Returns:
        'auto', 'onnx', or 'openvino' (default: 'auto')
    """
    backend = os.environ.get('AMF_EMBEDDING_BACKEND', 'auto').lower().strip()
    if backend not in {'auto', 'onnx', 'openvino'}:
        logger.warning(
            f"Invalid AMF_EMBEDDING_BACKEND='{backend}', defaulting to 'auto'. "
            f"Valid values: auto, onnx, openvino"
        )
        return 'auto'
    return backend


def _validate_model_files(model_path: Path, backend: str) -> Dict[str, Path]:
    """Validates required model files exist, returns paths.
    
    Args:
        model_path: Root model directory
        backend: 'onnx' or 'openvino'
        
    Returns:
        Dict with keys: 'model', 'tokenizer', 'tokenizer_config', 'config'
        
    Raises:
        FileNotFoundError: If required files missing (strict mode)
    """
    required_files = {
        'tokenizer': model_path / 'tokenizer.json',
        'tokenizer_config': model_path / 'tokenizer_config.json',
        'config': model_path / 'config.json',
    }
    
    if backend == 'onnx':
        required_files['model'] = model_path / 'onnx' / 'model.onnx'
    elif backend == 'openvino':
        required_files['model_xml'] = model_path / 'openvino' / 'openvino_model.xml'
        required_files['model_bin'] = model_path / 'openvino' / 'openvino_model.bin'
        required_files['model'] = required_files['model_xml']  # Primary reference
    
    missing = [str(p) for p in required_files.values() if not p.exists()]
    if missing:
        raise FileNotFoundError(
            f"Missing required model files for backend '{backend}':\n" +
            '\n'.join(f"  - {f}" for f in missing) +
            f"\n\nExpected model files in: {model_path}\n"
            f"Run: python utils/setup_local_models.py --download --path {model_path}"
        )
    
    return required_files


def _is_intel_cpu() -> bool:
    """Detects if running on Intel CPU for OpenVINO optimization."""
    try:
        cpu_info = platform.processor().lower()
        # Check common Intel identifiers
        return 'intel' in cpu_info or 'core' in cpu_info or 'xeon' in cpu_info
    except Exception:
        return False


# ─────────────────────────────────────────────────────────────────────────────
# Base Embedding Function with Tokenizer
# ─────────────────────────────────────────────────────────────────────────────

class BaseLocalEmbeddingFunction(EmbeddingFunction, ABC):
    """Abstract base for local embedding functions with shared tokenizer logic.
    
    Handles tokenization and mean pooling, delegates inference to subclasses.
    """
    
    def __init__(self, model_path: Path, backend: str):
        """Initialize tokenizer from local files.
        
        Args:
            model_path: Path to model directory
            backend: 'onnx' or 'openvino'
        """
        self.model_path = model_path
        self.backend = backend
        
        # Validate all required files exist (strict mode)
        self.files = _validate_model_files(model_path, backend)
        
        # Initialize tokenizer from local files
        self._init_tokenizer()
        
        logger.info(
            f"[EMBEDDING] Initialized {self.__class__.__name__} with model: "
            f"{self.files['model']}"
        )
    
    def _init_tokenizer(self) -> None:
        """Load tokenizer from local JSON files (no network access)."""
        try:
            # Suppress PyTorch/TF advisory - we use ONNX/OpenVINO, not torch
            os.environ.setdefault("TRANSFORMERS_NO_ADVISORY_WARNINGS", "1")
            with warnings.catch_warnings():
                warnings.filterwarnings("ignore", message=".*PyTorch.*not found.*")
                warnings.filterwarnings("ignore", message=".*TensorFlow.*not found.*")
                from transformers import AutoTokenizer
        except ImportError:
            raise ImportError(
                "transformers library required for tokenizer. "
                "Install: pip install transformers>=4.46.0"
            )
        
        # Load from local directory (no download)
        # transformers will use local tokenizer.json if present
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(
                str(self.model_path),
                local_files_only=True,  # Critical: no network access
            )
            logger.debug(f"[EMBEDDING] Loaded tokenizer from: {self.model_path}")
        except Exception as e:
            raise RuntimeError(
                f"Failed to load tokenizer from {self.model_path}. "
                f"Ensure tokenizer.json, tokenizer_config.json, config.json exist. "
                f"Error: {e}"
            )
    
    def __call__(self, input: Documents) -> Embeddings:
        """Embed documents using local model.
        
        Args:
            input: List of text strings to embed
            
        Returns:
            List of embedding vectors (each 384-dim for all-MiniLM-L6-v2)
        """
        if not input:
            return []
        
        start_time = time.time()
        
        # Tokenize (CPU operation, ~1-5ms per batch)
        tokens = self.tokenizer(
            input,
            padding=True,
            truncation=True,
            max_length=512,
            return_tensors='np',  # NumPy arrays for ONNX/OpenVINO
        )
        
        # Run inference (subclass implements backend-specific logic)
        embeddings = self._infer(tokens)
        
        # Mean pooling with attention mask (matches sentence-transformers)
        embeddings = self._mean_pool(embeddings, tokens['attention_mask'])
        
        # L2 normalization (cosine similarity requirement)
        embeddings = self._normalize(embeddings)
        
        elapsed = time.time() - start_time
        logger.debug(
            f"[EMBEDDING] Embedded {len(input)} docs in {elapsed*1000:.1f}ms "
            f"({len(input)/elapsed:.1f} docs/sec) using {self.backend}"
        )
        
        return embeddings.tolist()
    
    @abstractmethod
    def _infer(self, tokens: Dict[str, np.ndarray]) -> np.ndarray:
        """Run inference on tokenized input (subclass implements).
        
        Args:
            tokens: Dict with 'input_ids', 'attention_mask', 'token_type_ids'
            
        Returns:
            Raw model output (token embeddings, shape: [batch, seq_len, hidden_dim])
        """
        pass
    
    @staticmethod
    def _mean_pool(
        token_embeddings: np.ndarray,
        attention_mask: np.ndarray,
    ) -> np.ndarray:
        """Mean pooling with attention mask (sentence-transformers strategy).
        
        Args:
            token_embeddings: Shape [batch, seq_len, hidden_dim]
            attention_mask: Shape [batch, seq_len]
            
        Returns:
            Sentence embeddings: Shape [batch, hidden_dim]
        """
        # Expand mask to match embedding dimensions
        mask_expanded = np.expand_dims(attention_mask, axis=-1)
        mask_expanded = np.broadcast_to(
            mask_expanded,
            token_embeddings.shape,
        )
        
        # Apply mask and compute mean
        summed = np.sum(token_embeddings * mask_expanded, axis=1)
        counts = np.clip(np.sum(mask_expanded, axis=1), a_min=1e-9, a_max=None)
        
        return summed / counts
    
    @staticmethod
    def _normalize(embeddings: np.ndarray) -> np.ndarray:
        """L2 normalize embeddings for cosine similarity.
        
        Args:
            embeddings: Shape [batch, hidden_dim]
            
        Returns:
            Normalized embeddings (unit vectors)
        """
        norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
        norms = np.clip(norms, a_min=1e-9, a_max=None)  # Avoid division by zero
        return embeddings / norms


# ─────────────────────────────────────────────────────────────────────────────
# ONNX Backend
# ─────────────────────────────────────────────────────────────────────────────

class ONNXEmbeddingFunction(BaseLocalEmbeddingFunction):
    """ONNX Runtime inference backend (cross-platform)."""
    
    def __init__(self, model_path: Path):
        """Initialize ONNX Runtime session.
        
        Args:
            model_path: Path to model directory containing onnx/model.onnx
        """
        super().__init__(model_path, backend='onnx')
        
        try:
            import onnxruntime as ort
        except ImportError:
            raise ImportError(
                "onnxruntime required for ONNX backend. "
                "Install: pip install onnxruntime>=1.19.0"
            )
        
        # Initialize session with CPU execution provider
        onnx_path = self.files['model']
        self.session = ort.InferenceSession(
            str(onnx_path),
            providers=['CPUExecutionProvider'],
        )
        
        # Cache input names for efficiency
        self.input_names = [inp.name for inp in self.session.get_inputs()]
        
        logger.info(
            f"[EMBEDDING] ONNX session created with inputs: {self.input_names}"
        )
    
    def _infer(self, tokens: Dict[str, np.ndarray]) -> np.ndarray:
        """Run ONNX inference.
        
        Args:
            tokens: Tokenizer output with input_ids, attention_mask, token_type_ids
            
        Returns:
            Token embeddings from last hidden state
        """
        # Map tokens to ONNX input names (model-specific, usually matches keys)
        onnx_inputs = {}
        for name in self.input_names:
            if name in tokens:
                # Convert to int64 for input_ids, attention_mask
                tensor = tokens[name]
                if name in {'input_ids', 'attention_mask', 'token_type_ids'}:
                    tensor = tensor.astype(np.int64)
                onnx_inputs[name] = tensor
        
        # Run inference (returns tuple of outputs)
        outputs = self.session.run(None, onnx_inputs)
        
        # First output is typically last_hidden_state (token embeddings)
        return outputs[0]


# ─────────────────────────────────────────────────────────────────────────────
# OpenVINO Backend
# ─────────────────────────────────────────────────────────────────────────────

class OpenVINOEmbeddingFunction(BaseLocalEmbeddingFunction):
    """OpenVINO Runtime inference backend (Intel CPU optimized)."""
    
    def __init__(self, model_path: Path):
        """Initialize OpenVINO compiled model.
        
        Args:
            model_path: Path to model directory containing openvino/model.xml
        """
        super().__init__(model_path, backend='openvino')
        
        try:
            from openvino.runtime import Core
        except ImportError:
            raise ImportError(
                "openvino required for OpenVINO backend. "
                "Install: pip install openvino>=2024.5.0"
            )
        
        # Initialize OpenVINO runtime
        core = Core()
        model_xml = self.files['model_xml']
        
        # Read and compile model for CPU
        model = core.read_model(model=str(model_xml))
        self.compiled_model = core.compile_model(model, device_name='CPU')
        
        # Get input/output ports
        self.input_keys = [inp.any_name for inp in self.compiled_model.inputs]
        self.output_port = self.compiled_model.output(0)
        
        logger.info(
            f"[EMBEDDING] OpenVINO model compiled with inputs: {self.input_keys}"
        )
    
    def _infer(self, tokens: Dict[str, np.ndarray]) -> np.ndarray:
        """Run OpenVINO inference.
        
        Args:
            tokens: Tokenizer output with input_ids, attention_mask, token_type_ids
            
        Returns:
            Token embeddings from last hidden state
        """
        # Map tokens to OpenVINO inputs (typically same keys as ONNX)
        ov_inputs = {}
        for key in self.input_keys:
            if key in tokens:
                tensor = tokens[key]
                if key in {'input_ids', 'attention_mask', 'token_type_ids'}:
                    tensor = tensor.astype(np.int64)
                ov_inputs[key] = tensor
        
        # Run inference
        results = self.compiled_model(ov_inputs)
        
        # Extract output (last_hidden_state)
        return results[self.output_port]


# ─────────────────────────────────────────────────────────────────────────────
# Factory Function
# ─────────────────────────────────────────────────────────────────────────────

def create_embedding_function() -> EmbeddingFunction:
    """Factory to create optimal local embedding function based on environment.
    
    Auto-detection logic (when AMF_EMBEDDING_BACKEND='auto'):
      - Detects Intel CPU → tries OpenVINO (if available + model files exist)
      - Falls back to ONNX if OpenVINO unavailable or model files missing
      - Non-Intel CPU → uses ONNX
    
    Explicit backend selection:
      - AMF_EMBEDDING_BACKEND='onnx' → forces ONNX (even on Intel)
      - AMF_EMBEDDING_BACKEND='openvino' → forces OpenVINO (fails if unavailable)
    
    Returns:
        Configured embedding function instance
        
    Raises:
        ValueError: If AMF_LOCAL_MODEL_PATH not set or invalid
        FileNotFoundError: If required model files missing (strict mode)
        ImportError: If required backend library not installed
    """
    model_path = _get_model_path()
    backend_pref = _get_backend_preference()
    
    # Explicit backend selection
    if backend_pref == 'onnx':
        logger.info("[EMBEDDING] Using ONNX backend (explicit)")
        return ONNXEmbeddingFunction(model_path)
    
    if backend_pref == 'openvino':
        logger.info("[EMBEDDING] Using OpenVINO backend (explicit)")
        return OpenVINOEmbeddingFunction(model_path)
    
    # Auto-detection logic
    is_intel = _is_intel_cpu()
    logger.debug(f"[EMBEDDING] Auto-detect: Intel CPU = {is_intel}")
    
    if is_intel:
        # Try OpenVINO first (optimal for Intel)
        try:
            import openvino.runtime
            openvino_model_xml = model_path / 'openvino' / 'openvino_model.xml'
            
            if openvino_model_xml.exists():
                logger.info(
                    "[EMBEDDING] Auto-selected OpenVINO backend "
                    "(Intel CPU + model files present)"
                )
                return OpenVINOEmbeddingFunction(model_path)
            else:
                logger.info(
                    "[EMBEDDING] OpenVINO model files not found, "
                    "falling back to ONNX"
                )
        except ImportError:
            logger.info(
                "[EMBEDDING] OpenVINO not installed, falling back to ONNX. "
                "Install for 2-3x speedup: pip install openvino>=2024.5.0"
            )
    
    # Default fallback: ONNX
    logger.info("[EMBEDDING] Using ONNX backend (auto-selected)")
    return ONNXEmbeddingFunction(model_path)


# ─────────────────────────────────────────────────────────────────────────────
# Testing & Validation
# ─────────────────────────────────────────────────────────────────────────────

def _test_embedding_function() -> None:
    """Standalone test for embedding function (run with --test flag)."""
    print("=" * 70)
    print("Local Embedding Function Test")
    print("=" * 70)
    
    # Check environment
    model_path_str = os.environ.get('AMF_LOCAL_MODEL_PATH', '')
    print(f"\n[Config] AMF_LOCAL_MODEL_PATH = {model_path_str}")
    print(f"[Config] AMF_EMBEDDING_BACKEND = {_get_backend_preference()}")
    
    if not model_path_str:
        print("\n[ERROR] AMF_LOCAL_MODEL_PATH not set.")
        print("Set it before running test:")
        print("  export AMF_LOCAL_MODEL_PATH=/path/to/models/all-MiniLM-L6-v2")
        print("  python models/embeddings.py --test")
        return
    
    # Create embedding function
    try:
        print("\n[Step 1] Creating embedding function...")
        emb_fn = create_embedding_function()
        print(f"[✓] Created: {emb_fn.__class__.__name__}")
    except Exception as e:
        print(f"[✗] Failed to create embedding function: {e}")
        return
    
    # Test embedding
    test_docs = [
        "This is a test sentence.",
        "Another example document for embedding.",
        "Machine learning models process text data.",
    ]
    
    try:
        print(f"\n[Step 2] Embedding {len(test_docs)} test documents...")
        embeddings = emb_fn(test_docs)
        print(f"[✓] Generated {len(embeddings)} embeddings")
        
        # Validate shape
        expected_dim = 384  # all-MiniLM-L6-v2
        for i, emb in enumerate(embeddings):
            if len(emb) != expected_dim:
                print(f"[✗] Embedding {i} has wrong dimension: {len(emb)} (expected {expected_dim})")
                return
        print(f"[✓] All embeddings have correct dimension: {expected_dim}")
        
        # Validate normalization (should be unit vectors)
        for i, emb in enumerate(embeddings):
            norm = np.linalg.norm(emb)
            if not (0.99 < norm < 1.01):  # Allow small floating point error
                print(f"[✗] Embedding {i} not normalized: norm={norm:.4f}")
                return
        print("[✓] All embeddings are normalized (unit vectors)")
        
        # Sample output
        print(f"\n[Sample] First embedding (first 10 dims):")
        print(f"  {embeddings[0][:10]}")
        
        print("\n" + "=" * 70)
        print("[SUCCESS] All tests passed!")
        print("=" * 70)
        
    except Exception as e:
        print(f"[✗] Embedding failed: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    import sys
    
    # Enable debug logging
    logging.basicConfig(
        level=logging.DEBUG,
        format='%(asctime)s [%(levelname)s] %(message)s',
    )
    
    if '--test' in sys.argv:
        _test_embedding_function()
    else:
        print(__doc__)
        print("\nRun with --test flag to validate setup:")
        print("  python models/embeddings.py --test")
