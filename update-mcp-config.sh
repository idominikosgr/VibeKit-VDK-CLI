#!/bin/sh
# Update MCP Configuration Helper Script
# A simple wrapper around the update-mcp-config.js tool

# Get directory of the script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Ensure we have the expected directory structure
if [ ! -f "$SCRIPT_DIR/src/utils/update-mcp-config.js" ]; then
  echo "❌ Error: update-mcp-config.js not found at expected location."
  echo "Expected: $SCRIPT_DIR/src/utils/update-mcp-config.js"
  echo "Please ensure you're running this script from the correct directory."
  exit 1
fi

# Check if Node.js is installed
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Error: Node.js is required to run this script."
  echo "Please install Node.js from https://nodejs.org and try again."
  exit 1
fi

# Set default path to current directory
PROJECT_PATH="$(pwd)"
FORCE=false
QUIET=false

# Parse arguments
while [ "$#" -gt 0 ]; do
  case "$1" in
    --path=*)
      PROJECT_PATH="${1#*=}"
      ;;
    --force)
      FORCE=true
      ;;
    --quiet)
      QUIET=true
      ;;
    --help)
      echo "Usage: ./update-mcp-config.sh [options]"
      echo ""
      echo "Options:"
      echo "  --path=DIR     Path to the project root (default: current directory)"
      echo "  --force        Update configuration even if no editors are detected"
      echo "  --quiet        Reduce output verbosity"
      echo "  --help         Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Run with --help for usage information."
      exit 1
      ;;
  esac
  shift
done

# Build the command
CMD="node \"$SCRIPT_DIR/src/utils/update-mcp-config.js\" --path=\"$PROJECT_PATH\""

if [ "$FORCE" = true ]; then
  CMD="$CMD --force"
fi

if [ "$QUIET" = true ]; then
  CMD="$CMD --quiet"
fi

# Validate project path exists
if [ ! -d "$PROJECT_PATH" ]; then
  echo "❌ Error: Project path does not exist: $PROJECT_PATH"
  exit 1
fi

# Run the tool
echo "🔧 Running MCP configuration update tool..."
echo "📂 Project path: $PROJECT_PATH"

eval $CMD

EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
  echo "❌ Error: MCP configuration update failed with exit code $EXIT_CODE."
  exit $EXIT_CODE
fi

echo "✅ MCP configuration update completed successfully."
