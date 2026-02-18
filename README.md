# EvaTeam Workflow Enhancer

EvaTeam workflow visualization is static and lacks interactivity. This [userscript](http://kb.mozillazine.org/User.js_file) replaces the built-in process view with an advanced interactive visualization using SvelteFlow.

## Features

- **Interactive Diagrams**: Transform static workflow diagrams into interactive graphs with drag-and-drop
- **Modern UI**: Clean and modern interface using SvelteFlow
- **Settings Persistence**: User preferences saved in localStorage
- **Compatibility**: Toggle between original and enhanced views
- **Real-time Updates**: Automatically detects workflow dialog changes via MutationObserver

## Technologies

- **JavaScript/ES6+**
- **SvelteFlow**: Interactive graph library
- **Svelte 5**: UI framework
- **Vite**: Build tool
- **pnpm**: Package manager

Installation [link](https://github.com/Hubbitus/evateam-workflow-enhance.user.js/releases/latest/download/evateam-workflow-enhance.user.js) for the impatient (please read section [installation](#installation) for the prerequisites and detailed instructions).

# Installation

## Prerequisites

### Requires browser extension like `tampermonkey`
- [Chrome, chromium](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

## Script installation
Just follow the [link](https://github.com/Hubbitus/evateam-workflow-enhance.user.js/releases/latest/download/evateam-workflow-enhance.user.js).

> **TIP** Script configured for auto-updates, just allow that in extension settings!

# CI/CD

| Trigger | Version | Release | Description |
|---------|---------|---------|-------------|
| Push to main | `vYYYYMMDDHHmmss` | Yes | Automated release |
| Push tag `v*` | Tag name (e.g., `v1.2.3`) | Yes | Release from tag |
| Comment `/release` in PR | `vYYYYMMDDHHmmss.pr.{N}` | Pre-release | Manual pre-release from PR comment |
| Workflow dispatch with PR | `vYYYYMMDDHHmmss.pr.{N}` | Pre-release | Manual pre-release with PR link |
| Push to other branches / PR | `0.1.0-dev` | No | Build only |

# Development

### Setup
```bash
pnpm install
```

### Dev server
```bash
pnpm dev
```
Open http://localhost:3003

### Build
```bash
pnpm build
```
Output: dist/evateam-workflow-enhance.user.js

# Ideas and bug-reports are welcome!

Please report issues in this repository and ping me directly for any bugreports or needed enhancements!

# Licensed under MIT License