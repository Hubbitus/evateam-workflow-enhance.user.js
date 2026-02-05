# EvaTeam Workflow Enhancer

## Overview
This project enhances the workflow visualization in EvaTeam by replacing the basic jsPlumb-based diagrams with interactive ReactFlow diagrams.

## Architecture

### Development Mode
For development purposes, we use a separate `dev.html` file that simulates the loading and operation of the Tampermonkey script without requiring installation.

### File Structure
- `evateam-workflow-enhance.user.js` - Main Tampermonkey script
- `HuEvaFlowEnhancer.js` - Core functionality class
- `makets/dev.html` - Development simulation environment
- `makets/maket.as-is.html` - Original workflow HTML structure

### Core Components
All main logic (parsing original HTML, building diagrams, events, business logic) is contained in the `HuEvaFlowEnhancer` class in `HuEvaFlowEnhancer.js`.

## Development Workflow

### Development Mode
1. The `dev.html` file includes `HuEvaFlowEnhancer.js` as a script tag
2. The Tampermonkey script uses `@require` to load the same file from a local server

### Production Build
Use the build script to embed the `HuEvaFlowEnhancer` class directly into the Tampermonkey script.

## Build Process

### Build Script
Run the build script to embed the class in the Tampermonkey script:

```bash
make build
```

The build script will:
1. Read the content of `HuEvaFlowEnhancer.js`
2. Append it to the end of `evateam-workflow-enhance.user.js`
3. This creates a standalone Tampermonkey script without external dependencies

### Development server
To run the development server:

```bash
make dev
```

This starts a local server on port 3002 to serve the `HuEvaFlowEnhancer.js` file.

### Other commands
- `make clean` - Clean build artifacts (if any)
- `make install` - Install dependencies (if any)

## How it works

1. The script detects workflow dialogs in EvaTeam
2. Adds an "Improve Schema" button to enhance the visualization
3. Parses the original HTML structure to extract workflow data
4. Renders an enhanced interactive diagram using ReactFlow
5. Provides functionality to switch between original and enhanced views

## Dependencies

The script requires the following libraries:
- React (from unpkg.com)
- React DOM (from unpkg.com)
- ReactFlow (from cdn.jsdelivr.net)

These are loaded via `@require` directives in the Tampermonkey script header.


## Useful Debug Commands
```javascript
// Clear all saved layouts
Object.keys(localStorage).filter(key => key.startsWith('evateam_workflow_layout_')).forEach(key => localStorage.removeItem(key));

// Show saved layouts
Object.keys(localStorage).filter(key => key.startsWith('evateam_workflow_layout_')).forEach(key => console.log(key, JSON.parse(localStorage.getItem(key))));

// Force recalculate layout
localStorage.removeItem(`evateam_workflow_layout_${getWorkflowIdFromUrl()}`);
location.reload();
```

# License
This project is licensed under the MIT License.
