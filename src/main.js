// src/main.js - Entry point for the Tampermonkey script

import { mount } from 'svelte';
import WorkflowApp from './components/WorkflowApp.svelte';
import { HuEvaApi } from './HuEvaApi.js';

console.log('HuEvaFlowEnhancer: script loaded');

// Add global styles using GM_addStyle
GM_addStyle(`
  #hu-workflow-enhancer-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    box-sizing: border-box;
    border: 2px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    background-color: #fafafa;
    z-index: auto;
  }
`);

function initializeApp(originalWorkflowElement) {
    // Check if this element is already enhanced
    if (originalWorkflowElement.dataset.huEnhanced === 'true') {
        return;
    }

    // Mark this element as enhanced
    originalWorkflowElement.dataset.huEnhanced = 'true';

    const appContainer = document.createElement('div');
    appContainer.id = 'hu-workflow-enhancer-container';

    originalWorkflowElement.parentNode.insertBefore(appContainer, originalWorkflowElement);
    originalWorkflowElement.style.display = 'none';

    const api = new HuEvaApi({
        useMock: false, // Use real API for production
    });

    mount(WorkflowApp, {
        target: appContainer,
        props: {
            api: api,
            originalWorkflowElement: originalWorkflowElement
        }
    });

    console.log('HuEvaFlowEnhancer: App initialized for element', originalWorkflowElement);
}

const observer = new MutationObserver((mutations) => {
    // Look for all workflow dialog elements that are not yet enhanced
    const workflowElements = document.querySelectorAll('.cdk-global-overlay-wrapper .cmf-dialog.dialog__body');

    workflowElements.forEach(element => {
        if (element.dataset.huEnhanced !== 'true') {
            initializeApp(element);
        }
    });
});

// Start observing immediately
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Check for existing elements on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const existingElements = document.querySelectorAll('.cdk-global-overlay-wrapper .cmf-dialog.dialog__body');
        existingElements.forEach(element => {
            if (element.dataset.huEnhanced !== 'true') {
                setTimeout(() => initializeApp(element), 100);
            }
        });
    });
} else {
    const existingElements = document.querySelectorAll('.cdk-global-overlay-wrapper .cmf-dialog.dialog__body');
    existingElements.forEach(element => {
        if (element.dataset.huEnhanced !== 'true') {
            setTimeout(() => initializeApp(element), 100);
        }
    });
}