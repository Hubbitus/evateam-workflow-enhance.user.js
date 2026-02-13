// src/main.js
import { SvelteFlow } from '@xyflow/svelte';

// Export SvelteFlow globally for use in Tampermonkey script
if (typeof window !== 'undefined') {
  window.SvelteFlow = SvelteFlow;
}

// Export the main enhancer class
export { HuEvaFlowEnhancer } from './HuEvaFlowEnhancer.js';
export { HuEvaApi } from './HuEvaApi.js';

// In development mode, initialize the enhancer automatically
if (typeof window !== 'undefined' && location.hostname.includes('localhost')) {
  // Load the original workflow HTML for development
  fetch('../makets/maket.as-is.html')
    .then(response => response.text())
    .then(html => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      const workflowElement = 
        tempDiv.querySelector('.cmf-dialog__content app-cmf-workflow-auto') ||
        tempDiv.querySelector('#cdk-overlay-1 app-cmf-workflow-auto') ||
        tempDiv.querySelector('.chart-container') ||
        tempDiv.firstElementChild;

      if (workflowElement) {
        // Store the workflow element for later use by the enhancer
        window.storedWorkflowElement = workflowElement;

        // Initialize the enhancer
        const enhancer = new window.HuEvaFlowEnhancer();
        window.enhancer = enhancer; // Save for debugging
        enhancer.initialize();
      }
    })
    .catch(error => {
      console.error('Error loading original workflow HTML:', error);

      // Initialize the enhancer even if we couldn't load the HTML
      const enhancer = new window.HuEvaFlowEnhancer();
      window.enhancer = enhancer; // Save for debugging
      enhancer.initialize();
    });
}