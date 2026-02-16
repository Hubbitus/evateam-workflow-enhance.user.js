// src/main.js - Entry point for the Tampermonkey script

// Import the main classes
import { HuEvaApi } from './HuEvaApi.js';

// Make classes available globally for Tampermonkey environment
if (typeof window !== 'undefined') {
  window.HuEvaApi = HuEvaApi;
}

// Initialize the enhancer when the page loads
if (typeof window !== 'undefined') {
  // TODO: Add new initialization logic here, if needed.
}