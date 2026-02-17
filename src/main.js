// src/main.js - Entry point for the Tampermonkey script

import { mount } from 'svelte';
import WorkflowApp from './components/WorkflowApp.svelte';
import { HuEvaApi } from './HuEvaApi.js';

function initializeApp(originalWorkflowElement) {
    if (document.getElementById('hu-workflow-enhancer-container')) {
        return;
    }

    const appContainer = document.createElement('div');
    appContainer.id = 'hu-workflow-enhancer-container';
    appContainer.style.width = '100%';
    appContainer.style.height = '100%';
    appContainer.style.display = 'flex';
    appContainer.style.flexDirection = 'column';
    appContainer.style.position = 'relative';
    appContainer.style.boxSizing = 'border-box';
    appContainer.style.border = '2px solid #ddd'; // Возвращаем исходную рамку
    appContainer.style.borderRadius = '8px';
    appContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    appContainer.style.overflow = 'hidden';
    appContainer.style.backgroundColor = '#fafafa';
    appContainer.style.zIndex = 'auto'; // Возвращаем исходный z-index

    originalWorkflowElement.parentNode.insertBefore(appContainer, originalWorkflowElement); // Возвращаем вставку перед оригинальным элементом
    originalWorkflowElement.style.display = 'none';

    const api = new HuEvaApi({
        useMock: true, // Use mock for development
        mockUrls: {
            'CmfWorkflow.get': '/api/api_CmfWorkflow_get_response.json',
            'CmfTrans.list': '/api/api_CmfTrans_list_response.json',
            'CmfStatus.list': '/api/api_CmfStatus_list_response.json'
        }
    });

    mount(WorkflowApp, {
        target: appContainer,
        props: {
            api: api,
            originalWorkflowElement: originalWorkflowElement
        }
    });
}

const observer = new MutationObserver((mutations, obs) => {
    const workflowElement = document.querySelector('.cdk-global-overlay-wrapper .cmf-dialog.dialog__body');
    
    if (workflowElement) {
        initializeApp(workflowElement);
        obs.disconnect();
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const existingElement = document.querySelector('.cdk-global-overlay-wrapper .cmf-dialog.dialog__body');
        if (existingElement) {
            setTimeout(() => initializeApp(existingElement), 100);
            observer.disconnect();
        } else {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    });
} else {
    const existingElement = document.querySelector('.cdk-global-overlay-wrapper .cmf-dialog.dialog__body');
    if (existingElement) {
        setTimeout(() => initializeApp(existingElement), 100);
        observer.disconnect();
    } else {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}