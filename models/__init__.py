"""
Local Embedding Models Package
================================
Custom embedding functions for ChromaDB using local ONNX/OpenVINO models.

Main exports:
  - create_embedding_function() - Factory function (auto-detects best backend)
  - ONNXEmbeddingFunction - ONNX Runtime backend
  - OpenVINOEmbeddingFunction - OpenVINO backend (Intel CPU optimized)
  - BaseLocalEmbeddingFunction - Abstract base class

Usage:
    from models.embeddings import create_embedding_function
    
    emb_fn = create_embedding_function()
    embeddings = emb_fn(["text 1", "text 2"])
"""

from models.embeddings import (
    BaseLocalEmbeddingFunction,
    ONNXEmbeddingFunction,
    OpenVINOEmbeddingFunction,
    create_embedding_function,
)

__all__ = [
    "create_embedding_function",
    "ONNXEmbeddingFunction",
    "OpenVINOEmbeddingFunction",
    "BaseLocalEmbeddingFunction",
]
