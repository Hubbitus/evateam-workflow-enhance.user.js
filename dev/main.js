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

// Load the original workflow HTML for development
fetch('../makets/maket.as-is.html')
  .then(response => response.text())
  .then(html => {
    // Store the original HTML to access style tags later
    window.storedWorkflowHTML = html;
    
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

      // Initialize the enhancer with custom API
      const enhancer = new HuEvaFlowEnhancer();
      enhancer.api = new CustomHuEvaApi({
        useMock: true,
        mockUrls: {
          'CmfWorkflow.get': './api/api_CmfWorkflow_get_response.json',
          'CmfTrans.list': './api/api_CmfTrans_list_response.json',
          'CmfStatus.list': './api/api_CmfStatus_list_response.json'
        }
      });

      window.enhancer = enhancer; // Save for debugging
      enhancer.initialize();
    }
  })
  .catch(error => {
    console.error('Error loading original workflow HTML:', error);

    // Initialize the enhancer even if we couldn't load the HTML
    const enhancer = new HuEvaFlowEnhancer();
    enhancer.api = new CustomHuEvaApi({
      useMock: true,
      mockUrls: {
        'CmfWorkflow.get': './api/api_CmfWorkflow_get_response.json',
        'CmfTrans.list': './api/api_CmfTrans_list_response.json',
        'CmfStatus.list': './api/api_CmfStatus_list_response.json'
      }
    });

    window.enhancer = enhancer; // Save for debugging
    enhancer.initialize();
  });