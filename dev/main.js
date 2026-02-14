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
    'CmfWorkflow.get': './api/api_CmfWorkflow_get_response.json',
    'CmfTrans.list': './api/api_CmfTrans_list_response.json',
    'CmfStatus.list': './api/api_CmfStatus_list_response.json'
  }
});

window.enhancer = enhancer; // Save for debugging
enhancer.initialize();