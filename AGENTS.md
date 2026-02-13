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
- **Svelte**: User interface library
- **SvelteFlow**: Interactive diagrams and graphs library
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
├── .qwen/                             # Qwen AI internal files
├── AGENTS.md                          # Project analysis (this file)
├── evateam-workflow-enhance.user.js   # Main UserScript for Tampermonkey
├── HuEvaFlowEnhancer.js               # Main handler class
├── Makefile                           # Make file for automation
├── README.md                          # Project documentation
└── makets/                            # Directory with mockups and tests
    ├── dev.html                       # Development page
    └── maket.as-is.html               # Original workflow data
├── watch-run.sh                       # Dev server launch script
```

### Main Components

#### 1. **HuEvaFlowEnhancer.js**
- Central class for workflow data processing
- HTML parsing and node/edge extraction
- Application state management
- Must be used in `dev.html` and `evateam-workflow-enhance.user.js` version as core logic implementation.

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

##### 3.1. Use foror developers
1. Open makets/dev.html in browser
2. Check functionality in dev mode
3. Open developer console (F12)
4. Check logs: "HuEvaFlowEnhancer: ..."

#### 4. **Makefile**
- Project build automation via make
- Embedding HuEvaFlowEnhancer.js and othere resourses into main UserScript
- Final `evateam-workflow-enhance.user.js` generation
- Development and build process management

#### 5. **watch-run.sh**
- Local development server launch script
- Automatic pages updates on file changes (no need to reload)
- Uses browser-sync for hot reload

## Development Commands

### Development Mode

* For the development purpose use makets/dev.html as emulation of userscript action!
* All asset must be added fom CDN and must not require any build and server!
* Server run with command: `./watch-run.sh`. Once! Do not restart it on file changes! Result will be in http://localhost:3000/makets/dev.html
* Server watches changes and automatically perform page reload - no need to refresh page or trigger something on the page.


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
```

Result: evateam-workflow-enhance.user.js (ready for installation)

## Development Rules

### Coding Style
- **Comments**: Detailed logs with "HuEvaFlowEnhancer:" prefix. All comments in code and documentation in English! Russian possible only in interface.
- **Naming**: camelCase for variables and functions
- **Structure**: OOP approach with modular organization
- **Erros**: exceptions for errors must be checked and detailedreported

# Important notes
- `make build` should be run **only** for the release, do not call it in normal development mode!
- Never "embed" external dependencied like JS or CSS into project files (until it was explicitly stated)! Use CDN and loading.
- Speak in Russian for chats, but all code comments and documentation must be in English!
- After each change and report to user about success:
    * Check if it works!
    * For testing use MCP and real brawser!
    * Check browser console do not have errors!
    * In workflow diagram area present desired structure!
    * Make screenshot and place it into `_screenshots` directory. File name must be like: `<date-time in ISO 8601 format with milliseconds>.png`
