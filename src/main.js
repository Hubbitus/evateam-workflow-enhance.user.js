// src/main.js - Entry point for the Tampermonkey script

// Import the main classes
import { HuEvaFlowEnhancer } from './HuEvaFlowEnhancer.js';
import { HuEvaApi } from './HuEvaApi.js';

// Make classes available globally for Tampermonkey environment
if (typeof window !== 'undefined') {
  window.HuEvaFlowEnhancer = HuEvaFlowEnhancer;
  window.HuEvaApi = HuEvaApi;
}

// Initialize the enhancer when the page loads
if (typeof window !== 'undefined') {
  // Wait for the DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const enhancer = new HuEvaFlowEnhancer();
      window.enhancer = enhancer; // Save for debugging/development
      enhancer.initialize();
    });
  } else {
    // DOM is already loaded, initialize immediately
    const enhancer = new HuEvaFlowEnhancer();
    window.enhancer = enhancer; // Save for debugging/development
    enhancer.initialize();
  }
}