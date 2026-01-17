#!/bin/bash
set -e

echo "===================================="
echo "Enterprise Task Manager - Environment Setup"
echo "===================================="

# Navigate to task-manager directory
cd "$(dirname "$0")/../../../task-manager" || exit 1

echo ""
echo "[1/5] Checking Node.js and npm installation..."
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✓ Node.js version: $NODE_VERSION"

if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm and try again."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✓ npm version: $NPM_VERSION"

echo ""
echo "[2/5] Installing dependencies..."
npm install

echo ""
echo "[3/5] Installing required dependencies for this feature..."
npm install date-fns @hello-pangea/dnd

echo ""
echo "[4/5] Verifying TypeScript configuration..."
if [ ! -f "tsconfig.app.json" ]; then
    echo "Error: tsconfig.app.json not found"
    exit 1
fi
echo "✓ TypeScript configuration found"

echo ""
echo "[5/5] Starting development server..."
echo ""
echo "📦 Development server starting on http://localhost:5173"
echo "📝 Press Ctrl+C to stop the server"
echo ""

# Start dev server (this will block)
npm run dev
