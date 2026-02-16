/**
 * Class for enhancing EvaTeam workflow visualization using SvelteFlow
 */
import { HuEvaApi } from './HuEvaApi.js';
import { SvelteFlow } from '@xyflow/svelte';
import { mount } from 'svelte';
import ColoredNode from './components/ColoredNode.svelte';
import '@xyflow/svelte/dist/style.css';

export class HuEvaFlowEnhancer {
    /**
     * Constructor for HuEvaFlowEnhancer
     */
    constructor() {
        this.api = new HuEvaApi({
            useMock: typeof window !== 'undefined' && window.location.hostname.includes('localhost')
        });
        this.container = null;
        this.originalWorkflowElement = null;
        this.currentView = 'enhanced'; // Set to 'enhanced' by default
        this.workflowData = null;

        console.log('HuEvaFlowEnhancer: Initialized');
    }

    /**
     * Initialize the enhancer
     */
    initialize() {
        console.log('HuEvaFlowEnhancer: Starting initialization');

        this.waitForWorkflowElement().then(() => {
            console.log('HuEvaFlowEnhancer: Workflow element found, proceeding with initialization');
            this.setupContainer();
            this.loadAndDisplayWorkflow();
        }).catch(error => {
            console.error('HuEvaFlowEnhancer: Error during initialization:', error);
        });
    }

    /**
     * Wait for the workflow element to be available in the DOM
     * @returns {Promise<HTMLElement>} Promise that resolves with the workflow element
     */
    waitForWorkflowElement() {
        return new Promise((resolve, reject) => {
            // Check if we're in dev mode and have a stored workflow element
            if (typeof window !== 'undefined' && window.storedWorkflowElement) {
                this.originalWorkflowElement = window.storedWorkflowElement;
                resolve(this.originalWorkflowElement);
                return;
            }

            const checkForElement = () => {
                // Look for the entire workflow dialog/element that contains the full workflow UI
                const workflowElement = document.querySelector('mat-dialog-container .cmf-dialog, .cdk-overlay-pane .cmf-dialog, app-cmf-workflow-auto, .chart-container');

                if (workflowElement) {
                    this.originalWorkflowElement = workflowElement;
                    resolve(workflowElement);
                } else {
                    setTimeout(checkForElement, 500);
                }
            };

            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        const workflowElement = document.querySelector('mat-dialog-container .cmf-dialog, .cdk-overlay-pane .cmf-dialog, app-cmf-workflow-auto, .chart-container');

                        if (workflowElement) {
                            this.originalWorkflowElement = workflowElement;
                            observer.disconnect();
                            resolve(workflowElement);
                            return;
                        }
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            checkForElement();

            setTimeout(() => {
                observer.disconnect();
                reject(new Error('Workflow element not found after timeout'));
            }, 10000);
        });
    }

    /**
     * Set up the container for our enhanced workflow
     */
    setupContainer() {
        this.container = document.createElement('div');
        this.container.id = 'hu-evateam-workflow-enhancer';
        this.container.style.width = '100%';
        this.container.style.minHeight = '800px';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.position = 'relative';
        this.container.style.boxSizing = 'border-box';
        this.container.style.border = '2px solid #ddd';
        this.container.style.borderRadius = '8px';
        this.container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        this.container.style.overflow = 'hidden';
        this.container.style.backgroundColor = '#fafafa';

        // Insert after the original workflow element
        this.originalWorkflowElement.parentNode.insertBefore(this.container, this.originalWorkflowElement.nextSibling);

        // Create tabs interface
        const tabContainer = document.createElement('div');
        tabContainer.className = 'workflow-tabs-container';
        tabContainer.style.display = 'flex';
        tabContainer.style.marginBottom = '10px';
        tabContainer.style.flexShrink = '0';

        const enhancedTab = document.createElement('button');
        enhancedTab.id = 'enhanced-workflow-tab';
        enhancedTab.textContent = 'Улучшенная схема';
        enhancedTab.style.flex = '1';
        enhancedTab.style.padding = '10px';
        enhancedTab.style.border = '2px solid #2e7d32'; // Green border for active tab
        enhancedTab.style.borderRadius = '4px 0 0 4px';
        enhancedTab.style.cursor = 'pointer';
        enhancedTab.style.backgroundColor = '#e8f5e9'; // Light green background
        enhancedTab.style.color = '#1b5e20'; // Dark green text
        enhancedTab.style.fontWeight = 'bold';
        enhancedTab.style.transition = 'all 0.2s';
        enhancedTab.addEventListener('click', () => this.switchView('enhanced'));

        const originalTab = document.createElement('button');
        originalTab.id = 'original-workflow-tab';
        originalTab.textContent = 'Исходный workflow';
        originalTab.style.flex = '1';
        originalTab.style.padding = '10px';
        originalTab.style.border = '2px solid #ccc'; // Gray border for inactive
        originalTab.style.borderLeft = 'none';
        originalTab.style.borderRadius = '0 4px 4px 0';
        originalTab.style.cursor = 'pointer';
        originalTab.style.backgroundColor = '#f5f5f5'; // Light gray background
        originalTab.style.color = '#666';
        originalTab.style.fontWeight = 'normal';
        originalTab.style.transition = 'all 0.2s';
        originalTab.addEventListener('click', () => this.switchView('original'));

        tabContainer.appendChild(enhancedTab);
        tabContainer.appendChild(originalTab);
        this.container.appendChild(tabContainer);

        // Move the original workflow element into our container's original view tab
        const originalViewContainer = document.createElement('div');
        originalViewContainer.id = 'original-workflow-view';
        originalViewContainer.style.display = 'none'; // Hidden by default
        originalViewContainer.style.flex = '1';
        originalViewContainer.style.overflow = 'auto';
        
        this.container.appendChild(originalViewContainer);
        originalViewContainer.appendChild(this.originalWorkflowElement);

        // Create enhanced view container
        const enhancedViewContainer = document.createElement('div');
        enhancedViewContainer.id = 'enhanced-workflow-view';
        enhancedViewContainer.style.display = 'block'; // Show by default
        enhancedViewContainer.style.flex = '1';
        enhancedViewContainer.style.minHeight = '400px';
        this.container.appendChild(enhancedViewContainer);

        this.currentView = 'enhanced';

        console.log('HuEvaFlowEnhancer: Container set up');
    }

    /**
     * Switch between original and enhanced views
     * @param {'original'|'enhanced'} view - View to switch to
     */
    switchView(view) {
        const originalView = document.getElementById('original-workflow-view');
        const enhancedView = document.getElementById('enhanced-workflow-view');
        const originalTab = document.getElementById('original-workflow-tab');
        const enhancedTab = document.getElementById('enhanced-workflow-tab');

        if (view === 'original') {
            originalView.style.display = 'block';
            enhancedView.style.display = 'none';
            originalTab.style.backgroundColor = '#e0e0e0'; // Active tab background
            originalTab.style.fontWeight = 'bold'; // Make active tab visually distinct
            enhancedTab.style.backgroundColor = '#f0f0f0'; // Inactive tab background
            enhancedTab.style.fontWeight = 'normal'; // Normal weight for inactive tab
            this.currentView = 'original';
        } else if (view === 'enhanced') {
            originalView.style.display = 'none';
            enhancedView.style.display = 'block';

            if (!enhancedView.hasChildNodes()) {
                this.renderEnhancedWorkflow(enhancedView);
            }

            originalTab.style.backgroundColor = '#f0f0f0'; // Inactive tab background
            originalTab.style.fontWeight = 'normal'; // Normal weight for inactive tab
            enhancedTab.style.backgroundColor = '#e0e0e0'; // Active tab background
            enhancedTab.style.fontWeight = 'bold'; // Make active tab visually distinct
            this.currentView = 'enhanced';
        }

        console.log(`HuEvaFlowEnhancer: Switched to ${view} view`);
    }

    /**
     * Load and display the workflow data
     */
    async loadAndDisplayWorkflow() {
        try {
            console.log('HuEvaFlowEnhancer: Loading workflow data...');

            const workflowId = this.extractWorkflowId();

            if (!workflowId) {
                throw new Error('Could not extract workflow ID from the page');
            }

            this.workflowData = await this.api.getCompleteWorkflowData(workflowId);

            console.log('HuEvaFlowEnhancer: Workflow data loaded successfully', this.workflowData);

            if (this.currentView === 'enhanced') {
                const enhancedView = document.getElementById('enhanced-workflow-view');
                this.renderEnhancedWorkflow(enhancedView);
            }
        } catch (error) {
            console.error('HuEvaFlowEnhancer: Error loading workflow data:', error);

            const enhancedView = document.getElementById('enhanced-workflow-view');
            if (enhancedView) {
                enhancedView.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: red;">
                        <div>
                            <h3>Error loading workflow</h3>
                            <p>${error.message}</p>
                            <p>Please check the console for more details.</p>
                        </div>
                    </div>
                `;
            }
        }
    }

    /**
     * Extract workflow ID from the page
     * @returns {string|null} Workflow ID or null if not found
     */
    extractWorkflowId() {
        const possibleElements = [
            document.querySelector('[data-workflow-id]'),
            document.querySelector('[id*="workflow"]'),
            document.querySelector('.cmf-dialog__header .title'),
            document.querySelector('#cdk-overlay-1 .title')
        ];

        for (const element of possibleElements) {
            if (element) {
                const idAttr = element.getAttribute('data-workflow-id') ||
                              element.getAttribute('id') ||
                              element.getAttribute('data-id');

                if (idAttr && idAttr.includes('CmfWorkflow')) {
                    return idAttr;
                }

                const text = element.textContent || element.innerText;
                const workflowIdMatch = text.match(/CmfWorkflow:[a-f0-9-]+/i);
                if (workflowIdMatch) {
                    return workflowIdMatch[0];
                }
            }
        }

        if (this.originalWorkflowElement) {
            let parent = this.originalWorkflowElement.parentElement;
            while (parent && parent !== document.body) {
                const parentId = parent.getAttribute('id');
                if (parentId && parentId.includes('CmfWorkflow')) {
                    return parentId;
                }

                const dataWorkflowId = parent.getAttribute('data-workflow-id');
                if (dataWorkflowId) {
                    return dataWorkflowId;
                }

                parent = parent.parentElement;
            }
        }

        if (this.api.config.useMock) {
            return 'CmfWorkflow:f3d3e174-cb06-11f0-9799-eeb7fce6ef9e';
        }

        return null;
    }

    /**
     * Render the enhanced workflow using SvelteFlow
     * @param {HTMLElement} container - Container element to render the workflow in
     */
    renderEnhancedWorkflow(container) {
        // Clear the container
        container.innerHTML = '';

        try {
            console.log('HuEvaFlowEnhancer: renderEnhancedWorkflow called with container:', container);
            console.log('HuEvaFlowEnhancer: workflowData available:', !!this.workflowData);
            
            if (!this.workflowData) {
                throw new Error('Workflow data is not available');
            }
            
            console.log('HuEvaFlowEnhancer: Workflow data structure:', {
                workflow: this.workflowData.workflow,
                statusesCount: this.workflowData.statuses?.length || 0,
                transitionsCount: this.workflowData.transitions?.length || 0
            });

            const { nodes, edges } = this.prepareSvelteFlowData();
            console.log('HuEvaFlowEnhancer: Prepared data', { nodes: nodes.length, edges: edges.length });
            
            if (nodes.length === 0) {
                console.warn('HuEvaFlowEnhancer: No nodes to render!');
                container.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: orange;">
                        <div>
                            <h3>No workflow nodes found</h3>
                            <p>Workflow data was loaded, but no statuses/nodes were generated.</p>
                            <p>Check console for details about statuses and transitions.</p>
                        </div>
                    </div>
                `;
                return;
            }

            console.log('HuEvaFlowEnhancer: Rendering with SvelteFlow', { nodes, edges });
            console.log('HuEvaFlowEnhancer: Nodes sample:', nodes[0]);
            if (edges.length > 0) {
                console.log('HuEvaFlowEnhancer: Edges sample:', edges[0]);
            } else {
                console.log('HuEvaFlowEnhancer: No edges to render');
            }

            // Log all nodes positions and dimensions
            nodes.forEach((node, idx) => {
                console.log(`HuEvaFlowEnhancer: Node ${idx}: id=${node.id}, position=${node.position}, size=${node.width}x${node.height}, type=${node.type}`);
            });

            // Create a container for the SvelteFlow component with proper sizing
            const flowContainer = document.createElement('div');
            flowContainer.style.width = '100%';
            flowContainer.style.height = '600px'; // Fixed height instead of 100%
            flowContainer.style.minHeight = '400px';
            flowContainer.style.border = '1px solid #ccc';
            flowContainer.style.borderRadius = '4px';
            flowContainer.style.backgroundColor = '#fff';
            flowContainer.style.position = 'relative';
            flowContainer.style.overflow = 'hidden';
            container.appendChild(flowContainer);

            console.log('HuEvaFlowEnhancer: Flow container created, mounting SvelteFlow');

            // Mount SvelteFlow component using Svelte 5 API
            const flowInstance = mount(SvelteFlow, {
                target: flowContainer,
                props: {
                    nodes: nodes,
                    edges: edges,
                    fitView: true,
                    fitViewOptions: { padding: 0.2 },
                    defaultEdgeOptions: {
                        type: 'straight',
                        markerEnd: { type: 'arrowclosed', color: '#456' },
                        style: { stroke: '#456', strokeWidth: 3 }
                    },
                    nodeTypes: {
                        coloredNode: ColoredNode
                    }
                }
            });

            console.log('HuEvaFlowEnhancer: SvelteFlow mounted successfully', flowInstance);
            console.log('HuEvaFlowEnhancer: flowContainer children:', flowContainer.children.length, flowContainer.innerHTML);

            // Store instance reference for cleanup if needed
            if (!this.flowInstances) {
                this.flowInstances = new Map();
            }
            this.flowInstances.set(container, flowInstance);

            console.log('HuEvaFlowEnhancer: Enhanced workflow rendered successfully with SvelteFlow');
        } catch (error) {
            console.error('HuEvaFlowEnhancer: Error rendering enhanced workflow:', error);
            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: red;">
                    <div>
                        <h3>Error rendering enhanced workflow</h3>
                        <p>${error.message}</p>
                        <p>Please check the console for more details.</p>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Prepare data for SvelteFlow (nodes and edges)
     * @returns {{nodes: Array, edges: Array}} Object containing nodes and edges arrays
     */
    prepareSvelteFlowData() {
        if (!this.workflowData) {
            throw new Error('Workflow data not loaded');
        }

        const { workflow, statuses, transitions } = this.workflowData;
        const nodes = [];
        const edges = [];

        // Create a map of statuses by ID for easy lookup
        const statusMap = new Map();
        statuses.forEach(status => {
            statusMap.set(status.id, status);
        });

        statuses.forEach((status, index) => {
            let position = { x: 100, y: 100 };

            if (workflow.scheme_draw_config) {
                const configKey = `CmfStatus:${status.id}_draw_scheme_item`;
                const config = workflow.scheme_draw_config[configKey];

                if (config) {
                    position = { x: config.x, y: config.y };
                }
            }

            // Grid layout fallback if no positions in config
            if (position.x === 100 && position.y === 100) {
                const cols = 4;
                const row = Math.floor(index / cols);
                const col = index % cols;
                position = {
                    x: 200 + col * 250,
                    y: 150 + row * 200
                };
            }

            const bgColor = status.color || '#cccccc';
            const isStart = status.status_type === 'OPEN' || status.name.toLowerCase().includes('старт') || status.code === 'start';

            console.log(`HuEvaFlowEnhancer: Status "${status.name}" - color: ${bgColor}, isStart: ${isStart}`);

            const node = {
                id: status.id,
                type: 'coloredNode',
                position,
                width: isStart ? 50 : 140,  // Reduced from 200 to 140
                height: isStart ? 50 : 56,   // Reduced from 80 to 56
                data: {
                    label: status.name,
                    color: bgColor,
                    isStart: isStart
                }
            };

            nodes.push(node);
        });

        // Create edges from transitions
        transitions.forEach(transition => {
            const fromStatuses = transition.status_from || [];
            const toStatus = transition.status_to;

            if (!toStatus || !toStatus.id) {
                console.warn('HuEvaFlowEnhancer: Transition without valid status_to:', transition);
                return;
            }

            fromStatuses.forEach(fromStatus => {
                if (!fromStatus || !fromStatus.id) {
                    console.warn('HuEvaFlowEnhancer: Transition with invalid status_from item:', transition);
                    return;
                }

                // Verify that both statuses exist in our status map
                if (!statusMap.has(fromStatus.id)) {
                    console.warn(`HuEvaFlowEnhancer: Source status ${fromStatus.id} not found in statuses`);
                    return;
                }
                if (!statusMap.has(toStatus.id)) {
                    console.warn(`HuEvaFlowEnhancer: Target status ${toStatus.id} not found in statuses`);
                    return;
                }

                const edge = {
                    id: `${fromStatus.id}-${toStatus.id}`,
                    source: fromStatus.id,
                    target: toStatus.id,
                    label: transition.name?.trim() || '',
                    type: 'smoothstep',
                    markerEnd: { type: 'arrowclosed', color: '#456' },
                    style: { stroke: '#456', strokeWidth: 2 }
                };

                edges.push(edge);
            });
        });

        console.log('HuEvaFlowEnhancer: Prepared SvelteFlow data', { nodes: nodes.length, edges: edges.length });

        return { nodes, edges };
    }
}