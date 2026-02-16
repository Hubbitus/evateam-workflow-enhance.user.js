# EvaTeam Workflow Enhancer Project Analysis

## Important notes
- Do conversation in chat in Russian language, all comments and documentation in project should be in English.
- `make build` should be run **only** for the release, do not call it in normal development mode!
- Never "embed" external dependencies like JS or CSS into project files (until it was explicitly stated)! Use CDN and loading.
- Speak in Russian for chats, but all code comments and documentation must be in English!
- After each change and report to user about success:
    * Check if it works!
    * For testing use MCP and real browser!
    * Check browser console do not have errors!
    * In workflow diagram area present desired structure!
    * Make screenshot and place it into `_screenshots` directory. File name must be like: `<date-time in ISO 8601 format with milliseconds>.png`
- All dependencies must be listed in single place: package.json.
- Application bundle file `bundle.js` **must** be the single build used and tested in `dev.html`.
    * That bundle then embedded unto UserScript file on final build!
    * No other separate dependencies possible to include in any other way, including CDN.

## Project Overview

The project is a **UserScript for Tampermonkey** designed to improve the visualization of workflow diagrams in the EvaTeam project management system. The main goal is to replace the standard business process display with a more modern and interactive solution using SvelteFlow.

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
- **Vite**: Build tool for development and production
- **pnpm**: Package manager for faster and more efficient dependency installation
- **DOM API**: For interaction with existing EvaTeam DOM
- **localStorage**: For saving user settings
- **MutationObserver**: For tracking DOM changes

### Architectural Solutions
- **Tampermonkey UserScript**: Execution environment with @require support
- **CDN Dependencies**: Svelte and SvelteFlow loaded via CDN
- **Modular Structure**: Logic divided into functions
- **Reactive Programming**: Using Svelte runes for state management

## Project Structure

```
├── .qwen/                             # Qwen AI internal files
├── AGENTS.md                          # Project analysis (this file)
├── evateam-workflow-enhance.user.js   # Main UserScript for Tampermonkey
├── dist/                              # Build artifacts directory
│   └── evateam-workflow-enhance.user.js # Built Tampermonkey script
├── dev/                               # Development directory
│   ├── index.html                     # Development page
│   └── main.js                        # Development entry point
├── src/                               # Source code directory
│   ├── HuEvaApi.js                    # API interaction class
│   └── main.js                        # Production entry point
├── plugins/                           # Vite plugins
│   └── tampermonkey-header-plugin.js  # Plugin to add TM headers
├── makets/                            # Directory with mockups and tests
├── tests/                             # Test files (removed)
├── _screenshots/                      # Screenshots directory
├── package.json                       # Project configuration
├── vite.config.js                     # Configuration for development mode, serves from 'dev' directory
├── vite.test.config.mjs               # Configuration for testing, serves from project root
├── vite.build.config.mjs              # Vite configuration for userscript build
├── README.md                          # Project documentation
└── favicon.ico                        # Project icon
```

### Main Components

#### 1. **HuEvaApi.js**
- Class for interacting with EvaTeam API
- Data fetching for workflows, statuses, and transitions
- Located in `src/` directory as API layer.

#### 2. **evateam-workflow-enhance.user.js**
- Main UserScript for Tampermonkey
- Entry point for end users
- Dependency loading via @require
- Application initialization on EvaTeam pages
- Located in `dist/` directory as build artifact.

#### 3. **dev/index.html**
- Development and debugging page
- Tampermonkey environment emulation
- Developer tools
- Functionality testing

##### 4.1. Use for developers
1. Open http://localhost:3003 in browser (after `pnpm run dev`)
2. Check functionality in dev mode
3. Open developer console (F12)

#### 4. **vite.config.js**
- Configuration for development mode
- Uses 'dev' directory as root for development
- Runs dev server on port 3003
- Compiles files to ../dist directory
- Allows isolated development environment

#### 5. **vite.test.config.mjs**
- Configuration for testing
- Serves files from project root for testing purposes
- Runs test server on port 3004
- Uses same output directory (./dist) as main build
- Enables testing of the final bundle in an isolated environment

#### 6. **vite.build.config.mjs**
- Vite configuration for Tampermonkey script build
- Creates IIFE bundle with Tampermonkey headers
- Includes Svelte plugin with dev: false
- Uses terser for minification

#### 7. **plugins/tampermonkey-header-plugin.js**
- Custom Vite plugin to inject Tampermonkey headers
- Adds required @match, @name, @namespace, etc. headers
- Ensures proper Tampermonkey script format

## Development Commands

### Development Mode

* For the development purpose use `pnpm run dev` which starts Vite dev server.
* All assets must be added from CDN and must not require any build and server!
* Server run with command: `pnpm run dev`. Once! Do not restart it on file changes! Result will be in http://localhost:3003/
* Server watches changes and automatically performs page reload - no need to refresh page or trigger something on the page.

```bash
# Development server launch
pnpm run dev

# Server will be available at:
# http://localhost:3003/
```

### Project Build
```bash
# UserScript build via Vite
pnpm run build-userscript
```

Result: dist/evateam-workflow-enhance.user.js (ready for installation)

## Development Rules

### Coding Style
- **Comments**: Detailed logs with "HuEvaFlowEnhancer:" prefix. All comments in code and documentation in English! Russian possible only in interface.
- **Naming**: camelCase for variables and functions
- **Structure**: OOP approach with modular organization
- **Errors**: exceptions for errors must be checked and detailed reported