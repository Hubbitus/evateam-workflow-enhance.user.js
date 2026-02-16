// dev/main.js - Development entry point
import { mount } from 'svelte';
import WorkflowApp from '../src/components/WorkflowApp.svelte';
import { HuEvaApi } from '../src/HuEvaApi.js';

console.log('HuEva Enhancer: Development script loaded.');

function initialize_enhancer(originalWorkflowElement) {
    if (document.getElementById('hu-workflow-enhancer-container')) {
        console.log('HuEva Enhancer: Already initialized.');
        return;
    }
    console.log('HuEva Enhancer: Initializing...');

    // --- 1. Create a new container for our Svelte App ---
    // We will insert our app right before the original element's parent,
    // which is usually the 'mat-dialog-container' or similar.
    const appContainer = document.createElement('div');
    appContainer.id = 'hu-workflow-enhancer-container';
    appContainer.style.width = '100%';
    appContainer.style.height = '100%'; // Ensure it takes full height of its parent
    appContainer.style.display = 'flex'; // Use flex to manage inner layout
    appContainer.style.flexDirection = 'column'; // Stack children vertically
    appContainer.style.position = 'relative'; // For absolute positioning of children
    appContainer.style.boxSizing = 'border-box'; // Include padding/border in element's total width and height
    appContainer.style.border = '2px solid #ddd'; // Add a border to see its bounds
    appContainer.style.borderRadius = '8px'; // Rounded corners
    appContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'; // Add a subtle shadow
    appContainer.style.overflow = 'hidden'; // Hide overflowing content
    appContainer.style.backgroundColor = '#fafafa'; // Light background

    // Insert our app container before the original workflow element.
    // The original workflow element is now the full dialog body, so we insert our
    // app container as a sibling to it.
    originalWorkflowElement.parentNode.insertBefore(appContainer, originalWorkflowElement);
    
    // Hide the original element now, as the Svelte app will manage it
    originalWorkflowElement.style.display = 'none';


    // --- 2. Create API instance for the Svelte app ---
    const api = new HuEvaApi({
        useMock: true,
        mockUrls: {
            'CmfWorkflow.get': '/api/api_CmfWorkflow_get_response.json',
            'CmfTrans.list': '/api/api_CmfTrans_list_response.json',
            'CmfStatus.list': '/api/api_CmfStatus_list_response.json'
        }
    });

    // --- 3. Mount the Svelte App ---
    const app = mount(WorkflowApp, {
        target: appContainer,
        props: {
            api: api,
            originalWorkflowElement: originalWorkflowElement
        }
    });

    console.log('HuEva Enhancer: Svelte application mounted.');
}


// --- Observer Logic to find the workflow element ---
const observer = new MutationObserver((mutations, obs) => {
    // In dev, the element is inside `.cdk-global-overlay-wrapper`
    // Target the full dialog body which includes header and content
    const workflowElement = document.querySelector('.cdk-global-overlay-wrapper .cmf-dialog.dialog__body');
    
    if (workflowElement) {
        console.log('HuEva Enhancer: Target workflow element found!');
        initialize_enhancer(workflowElement);
        obs.disconnect(); // Stop observing once found
    }
});

console.log('HuEva Enhancer: Starting MutationObserver to find workflow element.');
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Also check if the element is already there on script load
const existingElement = document.querySelector('.cdk-global-overlay-wrapper .cmf-dialog.dialog__body');
if (existingElement) {
    console.log('HuEva Enhancer: Target workflow element already exists.');
    // A small delay to ensure other scripts on the page have finished.
    setTimeout(() => initialize_enhancer(existingElement), 100);
    observer.disconnect();
}
