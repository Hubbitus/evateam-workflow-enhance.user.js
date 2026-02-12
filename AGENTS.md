# EvaTeam Workflow Enhancer Project Analysis

## Project Overview

The project is a **UserScript for Tampermonkey** designed to improve the visualization of workflow diagrams in the EvaTeam project management system. The main goal is to replace the standard business process display with a more modern and interactive solution using ReactFlow.

### Purpose
- **UI Modernization**: Transform static workflow diagrams into interactive ones
- **UX Improvement**: Add drag-and-drop functionality for elements
- **Persistence**: Save user settings in localStorage
- **Compatibility**: Support switching between old and new versions

## Technology Stack

### Core Technologies
- **JavaScript/ES6+**: Programming language
- **React 18**: User interface library
- **ReactFlow**: Interactive diagrams and graphs library
- **DOM API**: For interaction with existing EvaTeam DOM
- **localStorage**: For saving user settings
- **MutationObserver**: For tracking DOM changes

### Architectural Solutions
- **Tampermonkey UserScript**: Execution environment with @require support
- **CDN Dependencies**: React and ReactFlow loaded from unpkg.com
- **Modular Structure**: Logic divided into functions
- **Reactive Programming**: Using React hooks for state management

## Project Structure

```
├── .qwen/                              # Qwen AI internal files
├── AGENTS.md                           # Project analysis (this file)
├── evateam-workflow-enhance.user.js   # Main UserScript for Tampermonkey
├── HuEvaFlowEnhancer.js               # Main handler class
├── KODA.md                            # Symlink to AGENTS.md
├── Makefile                           # Make file for automation
├── README.md                          # Project documentation
└── makets/                            # Directory with mockups and tests
    ├── dev.html                       # Development page
    └── maket.as-is.html              # Original workflow data
├── watch-run.sh                       # Dev server launch script
```

### Main Components

#### 1. **HuEvaFlowEnhancer.js**
- Central class for workflow data processing
- HTML parsing and node/edge extraction
- ReactFlow integration
- Application state management

#### 2. **evateam-workflow-enhance.user.js**
- Main UserScript for Tampermonkey
- Entry point for end users
- Dependency loading via @require
- Application initialization on EvaTeam pages

#### 3. **makets/dev.html**
- Development and debugging page
- Tampermonkey environment emulation
- Developer tools
- Functionality testing

#### 4. **Makefile**
- Project build automation via make
- Embedding HuEvaFlowEnhancer.js into main UserScript
- Final evateam-workflow-enhance.user.js generation
- Development and build process management

#### 5. **watch-run.sh**
- Local development server launch script
- Automatic updates on file changes
- Uses browser-sync for hot reload

## Development Commands

### Development Mode
```bash
# Development server launch
./watch-run.sh

# Server will be available at:
# http://localhost:3000/makets/dev.html
```

### Project Build
```bash
# UserScript build via Make
make build

# Result: evateam-workflow-enhance.user.js (ready for installation)
```

### Installation and Testing

#### For Developers
```bash
# 1. Project build
make build

# 2. Open makets/dev.html in browser
# 3. Check functionality in dev mode
# 4. Open developer console (F12)
# 5. Check logs: "Hu: EvaTeam Workflow Enhancer:"
```

#### For Users
```bash
# Installation in Tampermonkey
# 1. Open Tampermonkey Dashboard
# 2. Create new script
# 3. Copy contents of evateam-workflow-enhance.user.js
# 4. Save and activate

# Testing on EvaTeam
# 1. Open task page in EvaTeam
# 2. URL: https://eva.gid.team/project/Task/*
# 3. Check for "Workflow" button presence
# 4. Ensure correct tab switching operation
```

### Debugging and Diagnostics
```bash
# JavaScript syntax check
node -c HuEvaFlowEnhancer.js
node -c evateam-workflow-enhance.user.js

# Logging in browser console
console.log('Hu: EvaTeam Workflow Enhancer: ...');
// Library loading check
// DOM changes monitoring via MutationObserver

# Debugging in dev.html
# - Open "Debug Console" tab
# - Use buttons: Reset Demo, Clear Console, Show Info
# - Copy logs to clipboard
```

### Make Automation
```bash
# Main commands:
make build        # Production UserScript build
make dev          # Development HTTP server on port 3002
make clean        # Temporary files cleanup (if any)
make install      # Dependencies installation (if required)

# Additional commands:
make help         # Show help on commands
```

## Development Rules

### Coding Style
- **Comments**: Detailed logs with "Hu: EvaTeam Workflow Enhancer:" prefix. All comments in code and documentation in English! Russian possible only in interface.
- **Naming**: camelCase for variables and functions
- **Structure**: OOP approach with modular organization
- **Erros**: exceptions for errors must be checked and detailedreported

## Code Analysis

### Script Architecture

#### 1. Initialization and dependency loading
```javascript
// Wait for React and ReactFlow libraries to load
function waitForLibraries(callback, retries = 50, delay = 200)
```

#### 2. Original data parsing
```javascript
// Extract nodes and connections from EvaTeam HTML
function parseOriginalWorkflow(htmlContent)
```

#### 3. React component
```javascript
function WorkflowEnhancerApp() {
    // Node and edge state management
    // Tab switching
    // ReactFlow integration
}
```

#### 4. Application initialization
```javascript
// Target DOM element search
// React application rendering
// MutationObserver usage
```

### Key Implementation Features

#### Workflow parsing
- Extracts nodes from HTML elements with IDs starting with `CmfStatus:`
- Determines connections via overlay elements with `jtk-overlay-id` attribute
- Preserves styles and positioning from original HTML

#### State management
- Uses React hooks: `useNodesState`, `useEdgesState`
- Supports interactive editing via ReactFlow
- Saves changes to localStorage (TODO)

#### Error handling
- Graceful degradation when libraries are missing
- Target DOM element validation
- Fallback to original display

# Important notes
- `make build` should be run **only** for the release, do not call it in normal development mode!
- Never "embed" external dependencied like JS or CSS into project files (until it was explicitly stated)! Use CDN and loading.
- When doung screenshot (e.g. over MCP), place it into _screenshots directory. File name musb be started with date-time in iso-8601 format with millisecond precision.
- For testing made changes use MCP and real brawser!
- Speak in Russian for chats, but all code comments and documentation must be in English!
