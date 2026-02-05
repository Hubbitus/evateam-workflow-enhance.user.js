.PHONY: build dev clean install help

# Build the production version of the Tampermonkey script
build:
	@echo "Building production version..."
	@mkdir -p build
	@# Remove the @require line for HuEvaFlowEnhancer.js and embed its content
	@sed '/@require.*HuEvaFlowEnhancer\.js/d' evateam-workflow-enhance.dev.user.js > build/evateam-workflow-enhance.user.js
	@echo "" >> build/evateam-workflow-enhance.user.js
	@echo "/* Embedded HuEvaFlowEnhancer.js */" >> build/evateam-workflow-enhance.user.js
	@cat HuEvaFlowEnhancer.js >> build/evateam-workflow-enhance.user.js
	@echo "Build completed: HuEvaFlowEnhancer.js embedded into build/evateam-workflow-enhance.user.js"

# Start development server
dev:
	@echo "Starting development server on port 3002..."
	./watch-run.sh

# Clean build artifacts (if any)
clean:
	@echo "Cleaning build artifacts..."
	# No build artifacts to clean in this project

# Install dependencies (if any)
install:
	@echo "Installing dependencies..."
	# No dependencies to install in this project

# Show help
help:
	@echo "Available commands:"
	@echo "  make build   - Build production version of UserScript"
	@echo "  make dev     - Start HTTP development server on port 3002"
	@echo "  make clean   - Clean temporary files"
	@echo "  make install - Install dependencies (if required)"
	@echo "  make help    - Show this help"
