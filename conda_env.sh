#!/bin/bash

# AI Writing Platform - Conda Environment Setup
# This script creates and activates a conda environment with Node.js

set -e  # Exit on error

echo "🚀 Setting up Conda environment for AI Writing Platform..."
echo ""

# 1. Create conda environment with Node.js
echo "📦 Creating conda environment 'notebooks-creation' with Node.js..."
conda create -n notebooks-creation nodejs -y

echo ""
echo "✓ Environment created"
echo ""

# 2. Activate the environment
echo "🔧 Activating environment..."
eval "$(conda shell.bash hook)"
conda activate notebooks-creation

echo "✓ Environment activated: $(conda info --envs | grep notebooks-creation)"
echo ""

# 3. Install npm dependencies
echo "📥 Installing npm dependencies..."
npm install

echo "✓ Dependencies installed"
echo ""

# 4. Check .env
echo "🔐 Checking .env file..."
if [ ! -f .env ]; then
    echo "⚠️  .env not found. Creating from .env.public..."
    cp .env.public .env
    echo "✓ Created .env (update OPENAI_API_KEY before running)"
else
    echo "✓ .env already exists"
    if grep -q "OPENAI_API_KEY=sk-" .env; then
        echo "✓ OPENAI_API_KEY is set"
    else
        echo "⚠️  OPENAI_API_KEY not set in .env. Please add it:"
        echo "   Edit .env and set: OPENAI_API_KEY=sk-..."
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "To start the server:"
echo ""
echo "  1. Activate the environment:"
echo "     conda activate notebooks-creation"
echo ""
echo "  2. Start the development server:"
echo "     npm run dev"
echo ""
echo "  3. Open in your browser:"
echo "     http://localhost:3001"
echo ""
echo "To deactivate the environment:"
echo "  conda deactivate"
echo ""
