# Project Summary

## Overall Goal
Create a Tampermonkey userscript that enhances EvaTeam workflow visualization by adding an "Улучшить схему" button that opens an improved interactive workflow diagram when clicked.

## Key Knowledge
- **Technology Stack**: Uses React, ReactDOM, and ReactFlow for interactive diagram visualization
- **Library Loading**: Uses single IIFE build of ReactFlow (`reactflow/dist/reactflow.iife.js`) to avoid loading issues
- **Target Element**: Adds button to `dlg-cmf-workflow-task[_nghost-ng-c2682208480].ng-star-inserted` element
- **Mutation Observer**: Monitors DOM changes to detect when workflow dialog appears
- **Fallback Strategy**: Creates SVG visualization when ReactFlow libraries fail to load
- **Data Extraction**: Parses workflow nodes and edges from existing jsPlumb-based diagram
- **Version**: Currently at v0.5

## Recent Actions
- [DONE] Simplified initial script to add button without relying on mutations
- [DONE] Added MutationObserver to properly detect dynamically loaded workflow dialog
- [DONE] Implemented functionality to extract workflow data from current view
- [DONE] Created HTML generation for enhanced workflow view with ReactFlow
- [DONE] Added fallback SVG visualization when ReactFlow libraries don't load
- [DONE] Fixed library loading by switching to single IIFE build of ReactFlow
- [DONE] Updated library detection to properly identify ReactFlow availability

## Current Plan
- [DONE] Use single ReactFlow IIFE build for reliable loading
- [DONE] Implement proper library detection for ReactFlow
- [DONE] Maintain fallback SVG visualization
- [TODO] Test functionality in browser with actual EvaTeam workflow
- [TODO] Fine-tune workflow data extraction from jsPlumb elements
- [TODO] Optimize performance and error handling

---

## Summary Metadata
**Update time**: 2026-02-03T16:19:46.846Z 
