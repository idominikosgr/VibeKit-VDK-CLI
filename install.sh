#!/bin/sh
# CodePilotRules Installer
# A universal shell script to install CodePilotRules into any project with interactive setup
# Usage: curl -fsSL https://raw.githubusercontent.com/idominikosgr/CodePilotRules/main/install.sh | sh

set -e

# Default values
REPO_URL="https://github.com/idominikosgr/CodePilotRules"
TEMP_DIR="/tmp/CodePilotRules-$(date +%s)"
BRANCH="main"
METHOD="git"
UPGRADE=false
RUN_WIZARD=true
QUIET=false
TARGET_DIR=".ai/rules"

# Banner
echo "=====================================" 
echo "CodePilotRules Installer"
echo "Interactive AI Rules Setup"
echo "=====================================" 
echo "A comprehensive collection of AI prompt engineering rules"
echo "=====================================" 

# Parse arguments
while [ "$#" -gt 0 ]; do
  case "$1" in
    --target=*)
      TARGET_DIR="${1#*=}"
      ;;
    --repo=*)
      REPO_URL="${1#*=}"
      ;;
    --branch=*)
      BRANCH="${1#*=}"
      ;;
    --method=*)
      METHOD="${1#*=}"
      ;;
    --upgrade|--update)
      UPGRADE=true
      echo "⬆️ Upgrade mode: Will preserve existing customizations"
      ;;
    --direct)
      RUN_WIZARD=false
      echo "🔄 Direct mode: Will install to $TARGET_DIR without wizard"
      ;;
    --quiet)
      QUIET=true
      ;;
    --help)
      echo "Usage: ./install.sh [options]"
      echo ""
      echo "Options:"
      echo "  --target=DIR     Install rules to this directory (default: .ai/rules)"
      echo "  --repo=URL       Use this repository URL (default: $REPO_URL)"
      echo "  --branch=BRANCH  Use this branch (default: main)"
      echo "  --method=METHOD  Download method: git or curl (default: git)"
      echo "  --upgrade        Preserve user customizations when installing"
      echo "  --direct         Skip the setup wizard and install directly to .ai/rules"
      echo "  --quiet          Reduce output verbosity"
      echo "  --help           Show this help message"
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

# Set verbosity
if [ "$QUIET" = true ]; then
  # Save original stdout/stderr
  exec 3>&1 4>&2
  # Redirect to /dev/null
  exec 1>/dev/null 2>/dev/null
fi

# Download the repository
echo "📦 Downloading CodePilotRules..."

rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

if [ "$METHOD" = "git" ]; then
  if ! command -v git >/dev/null 2>&1; then
    echo "⚠️ git not found, falling back to curl method"
    METHOD="curl"
  fi
fi

if [ "$METHOD" = "git" ]; then
  # Git method
  git clone --depth=1 --branch="$BRANCH" "$REPO_URL" "$TEMP_DIR"
  rm -rf "$TEMP_DIR/.git"
else
  # Curl method
  curl -L "$REPO_URL/archive/$BRANCH.tar.gz" | tar -xz -C "$TEMP_DIR" --strip-components=1
fi

# Check for Node.js if running the wizard
if [ "$RUN_WIZARD" = true ]; then
  if ! command -v node >/dev/null 2>&1; then
    echo "⚠️ Node.js not found, falling back to direct installation"
    RUN_WIZARD=false
  fi
fi

# Installation approach based on user preference
if [ "$RUN_WIZARD" = true ]; then
  echo "🧙 Running interactive setup wizard..."
  
  # Make setup wizard executable
  if [ -f "$TEMP_DIR/setup-wizard.js" ]; then
    chmod +x "$TEMP_DIR/setup-wizard.js"
    
    # Run the setup wizard from the temporary directory
    # The wizard will determine the target directory based on IDE selection
    # and copy the appropriate files
    cd "$TEMP_DIR"
    node setup-wizard.js
    
    WIZARD_EXIT=$?
    if [ $WIZARD_EXIT -ne 0 ]; then
      echo "⚠️ Setup wizard encountered an error, falling back to direct installation"
      RUN_WIZARD=false
    else
      echo "✅ CodePilotRules installed successfully via setup wizard"
    fi
  else
    echo "⚠️ Setup wizard not found in repository, falling back to direct installation"
    RUN_WIZARD=false
  fi
fi

# Perform direct installation if wizard was skipped or failed
if [ "$RUN_WIZARD" = false ]; then
  echo "📋 Installing CodePilotRules directly to $TARGET_DIR..."
  
  # Create the target directory if it doesn't exist
  mkdir -p "$TARGET_DIR"
  
  if [ "$UPGRADE" = true ]; then
    # Upgrade mode - preserve user customizations
    echo "🔄 Upgrade mode: Preserving user customizations..."
    
    # Copy core agent without overwriting user customizations
    if [ -f "$TEMP_DIR/.ai/rules/00-core-agent.mdc" ]; then
      cp -f "$TEMP_DIR/.ai/rules/00-core-agent.mdc" "$TARGET_DIR/"
    fi
    
    # Skip user customization files if they already exist
    if [ ! -f "$TARGET_DIR/01-project-context.mdc" ] && [ -f "$TEMP_DIR/.ai/rules/01-project-context.mdc" ]; then
      cp "$TEMP_DIR/.ai/rules/01-project-context.mdc" "$TARGET_DIR/"
    fi
    
    if [ ! -f "$TARGET_DIR/02-common-errors.mdc" ] && [ -f "$TEMP_DIR/.ai/rules/02-common-errors.mdc" ]; then
      cp "$TEMP_DIR/.ai/rules/02-common-errors.mdc" "$TARGET_DIR/"
    fi
    
    if [ ! -f "$TARGET_DIR/03-mcp-configuration.mdc" ] && [ -f "$TEMP_DIR/.ai/rules/03-mcp-configuration.mdc" ]; then
      cp "$TEMP_DIR/.ai/rules/03-mcp-configuration.mdc" "$TARGET_DIR/"
    fi
    
    # Create directories if they don't exist
    mkdir -p "$TARGET_DIR/tasks"
    mkdir -p "$TARGET_DIR/languages"
    mkdir -p "$TARGET_DIR/technologies"
    mkdir -p "$TARGET_DIR/stacks"
    mkdir -p "$TARGET_DIR/assistants"
    mkdir -p "$TARGET_DIR/tools"
    
    # Copy other directories, overwriting existing files
    if [ -d "$TEMP_DIR/.ai/rules/tasks" ]; then
      cp -rf "$TEMP_DIR/.ai/rules/tasks/"* "$TARGET_DIR/tasks/"
    fi
    if [ -d "$TEMP_DIR/.ai/rules/languages" ]; then
      cp -rf "$TEMP_DIR/.ai/rules/languages/"* "$TARGET_DIR/languages/"
    fi
    if [ -d "$TEMP_DIR/.ai/rules/technologies" ]; then
      cp -rf "$TEMP_DIR/.ai/rules/technologies/"* "$TARGET_DIR/technologies/"
    fi
    if [ -d "$TEMP_DIR/.ai/rules/stacks" ]; then
      cp -rf "$TEMP_DIR/.ai/rules/stacks/"* "$TARGET_DIR/stacks/"
    fi
    if [ -d "$TEMP_DIR/.ai/rules/assistants" ]; then
      cp -rf "$TEMP_DIR/.ai/rules/assistants/"* "$TARGET_DIR/assistants/"
    fi
    if [ -d "$TEMP_DIR/.ai/rules/tools" ]; then
      cp -rf "$TEMP_DIR/.ai/rules/tools/"* "$TARGET_DIR/tools/"
    fi
  else
    # Fresh install - copy everything
    cp -r "$TEMP_DIR/.ai/rules/"* "$TARGET_DIR/"
  fi
  
  echo "✅ CodePilotRules installed successfully to $TARGET_DIR"
fi

# Clean up
rm -rf "$TEMP_DIR"
echo "🧹 Cleaned up temporary files"

# Restore stdout/stderr if quiet mode was enabled
if [ "$QUIET" = true ]; then
  exec 1>&3 2>&4
fi

echo ""
echo "=====================================" 
echo "🚀 Ready for AI-assisted development!"
echo ""
echo "📚 Next steps:"
echo "1. Customize project context with your details"
echo "2. Add project-specific anti-patterns if needed"
echo "3. Start using the specialized rules in your development"
echo ""
echo "For updates, run:"
echo "curl -fsSL https://raw.githubusercontent.com/idominikosgr/CodePilotRules/main/install.sh | sh -s -- --upgrade"
echo "=====================================" 