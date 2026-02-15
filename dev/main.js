// dev/main.js - Development entry point
import { HuEvaApi } from '../src/HuEvaApi.js';
import { HuEvaFlowEnhancer } from '../src/HuEvaFlowEnhancer.js';

// Create a custom API configuration for development with correct paths
class CustomHuEvaApi extends HuEvaApi {
  constructor(config = {}) {
    super({
      ...config,
      useMock: true,
      mockUrls: {
        'CmfWorkflow.get': './api/api_CmfWorkflow_get_response.json',
        'CmfTrans.list': './api/api_CmfTrans_list_response.json',
        'CmfStatus.list': './api/api_CmfStatus_list_response.json'
      }
    });
  }
}

// Initialize the enhancer with custom API
const enhancer = new HuEvaFlowEnhancer();
enhancer.api = new CustomHuEvaApi({
  useMock: true,
  mockUrls: {
    'CmfWorkflow.get': '/api/api_CmfWorkflow_get_response.json',
    'CmfTrans.list': '/api/api_CmfTrans_list_response.json',
    'CmfStatus.list': '/api/api_CmfStatus_list_response.json'
  }
});

// Save enhancer to window for debugging purposes
window.enhancer = enhancer;

// Set up the observer as soon as possible
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupObserver);
} else {
  setupObserver();
}

function setupObserver() {
  // Set up MutationObserver to track the workflow element
  const observer = new MutationObserver((mutations) => {
    const workflowElement = document.querySelector('.cmf-dialog__content app-cmf-workflow-auto, #cdk-overlay-1 app-cmf-workflow-auto, .chart-container');
    
    if (workflowElement) {
      console.log('HuEvaFlowEnhancer: Workflow element detected, initializing enhancer');
      enhancer.initialize();
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  console.log('HuEvaFlowEnhancer: MutationObserver setup complete');

  // Check immediately
  const existingWorkflow = document.querySelector('.cmf-dialog__content app-cmf-workflow-auto, #cdk-overlay-1 app-cmf-workflow-auto, .chart-container');
  if (existingWorkflow) {
    console.log('HuEvaFlowEnhancer: Workflow element already present, initializing enhancer');
    setTimeout(() => enhancer.initialize(), 100);
    observer.disconnect();
  }
}