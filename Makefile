.PHONY: build build-svelte dev clean install help

# Build the production version of the original Tampermonkey script
build:
	@echo "Building original React version..."
	@mkdir -p build
	@# Remove the @require line for HuEvaFlowEnhancer.js and embed its content
	@sed '/@require.*HuEvaFlowEnhancer\.js/d' evateam-workflow-enhance.dev.user.js > build/evateam-workflow-enhance.user.js
	@echo "" >> build/evateam-workflow-enhance.user.js
	@echo "/* Embedded HuEvaFlowEnhancer.js */" >> build/evateam-workflow-enhance.user.js
	@cat HuEvaFlowEnhancer.js >> build/evateam-workflow-enhance.user.js
	@echo "Build completed: HuEvaFlowEnhancer.js embedded into build/evateam-workflow-enhance.user.js"

# Start development server
dev:
	@echo "Starting development server..."
	./watch-run.sh

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf build/

# Show help
help:
	@echo "Available commands:"
	@echo "  make build         - Build production version of UserScript"
	@echo "  make dev           - Start HTTP development server"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make help          - Show this help"
