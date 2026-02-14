/**
 * Class for enhancing EvaTeam workflow visualization using SvelteFlow
 */
import { HuEvaApi } from './HuEvaApi.js';

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
            this.createTabsInterface();
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
                const workflowElement = document.querySelector('.cmf-dialog__content app-cmf-workflow-auto, #cdk-overlay-1 app-cmf-workflow-auto, .chart-container');

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
                        const workflowElement = document.querySelector('.cmf-dialog__content app-cmf-workflow-auto, #cdk-overlay-1 app-cmf-workflow-auto, .chart-container');

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
        this.container.style.height = '100%';

        const devContainer = document.getElementById('workflow-container');
        if (devContainer) {
            devContainer.appendChild(this.container);
        } else {
            this.originalWorkflowElement.parentNode.insertBefore(this.container, this.originalWorkflowElement.nextSibling);
        }

        console.log('HuEvaFlowEnhancer: Container set up');
    }

    /**
     * Create the tabs interface to switch between views
     */
    createTabsInterface() {
        const tabContainer = document.createElement('div');
        tabContainer.className = 'workflow-tabs-container';
        tabContainer.style.display = 'flex';
        tabContainer.style.marginBottom = '10px';

        const enhancedTab = document.createElement('button');
        enhancedTab.id = 'enhanced-workflow-tab';
        enhancedTab.textContent = 'Улучшенная схема';
        enhancedTab.style.flex = '1';
        enhancedTab.style.padding = '10px';
        enhancedTab.style.border = '1px solid #ccc';
        enhancedTab.style.borderRadius = '4px 0 0 4px';
        enhancedTab.style.cursor = 'pointer';
        enhancedTab.style.backgroundColor = 'rgb(154 231 181)'; // Active tab background
        enhancedTab.style.fontWeight = 'bold'; // Make active tab visually distinct
        enhancedTab.addEventListener('click', () => this.switchView('enhanced'));

        const originalTab = document.createElement('button');
        originalTab.id = 'original-workflow-tab';
        originalTab.textContent = 'Исходный workflow';
        originalTab.style.flex = '1';
        originalTab.style.padding = '10px';
        originalTab.style.border = '1px solid #ccc';
        originalTab.style.borderLeft = 'none';
        originalTab.style.borderRadius = '0 4px 4px 0';
        originalTab.style.cursor = 'pointer';
        originalTab.style.backgroundColor = '#f0f0f0'; // Inactive tab background
        originalTab.style.fontWeight = 'normal'; // Normal weight for inactive tab
        originalTab.addEventListener('click', () => this.switchView('original'));

        // Add tabs to container (enhanced first, original second)
        tabContainer.appendChild(enhancedTab);
        tabContainer.appendChild(originalTab);

        this.container.appendChild(tabContainer);

        const originalViewContainer = document.createElement('div');
        originalViewContainer.id = 'original-workflow-view';
        originalViewContainer.style.display = 'none';
        originalViewContainer.style.width = '100%';
        originalViewContainer.style.height = 'calc(100% - 50px)';
        originalViewContainer.style.overflow = 'auto';
        
        // Clone the original workflow element with all its computed styles
        const clonedOriginal = this.originalWorkflowElement.cloneNode(true);
        
        // Copy all computed styles from the original element to preserve appearance
        const copyStyles = (originalElement, clonedElement) => {
            // Copy inline styles
            clonedElement.setAttribute('style', originalElement.getAttribute('style') || '');
            
            // Copy CSS classes
            clonedElement.className = originalElement.className;
            
            // For all child elements, copy their styles recursively
            const originalChildren = originalElement.querySelectorAll('*');
            const clonedChildren = clonedElement.querySelectorAll('*');
            
            for (let i = 0; i < originalChildren.length; i++) {
                const originalChild = originalChildren[i];
                const clonedChild = clonedChildren[i];
                
                if (clonedChild) {
                    // Copy inline styles
                    clonedChild.setAttribute('style', originalChild.getAttribute('style') || '');
                    
                    // Copy CSS classes
                    clonedChild.className = originalChild.className;
                    
                    // Copy other attributes that might affect styling
                    for (let attr of originalChild.attributes) {
                        if (attr.name.startsWith('class') || attr.name.startsWith('style') || 
                            attr.name.startsWith('id') || attr.name.startsWith('data-')) {
                            clonedChild.setAttribute(attr.name, attr.value);
                        }
                    }
                }
            }
        };
        
        copyStyles(this.originalWorkflowElement, clonedOriginal);
        
        originalViewContainer.appendChild(clonedOriginal);

        const enhancedViewContainer = document.createElement('div');
        enhancedViewContainer.id = 'enhanced-workflow-view';
        enhancedViewContainer.style.display = 'block'; // Show by default
        enhancedViewContainer.style.width = '100%';
        enhancedViewContainer.style.height = 'calc(100% - 50px)';

        this.container.appendChild(originalViewContainer);
        this.container.appendChild(enhancedViewContainer);

        this.currentView = 'enhanced';

        console.log('HuEvaFlowEnhancer: Tabs interface created');
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
        // Check if SvelteFlow is available
        if (typeof window.SvelteFlow === 'undefined') {
            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
                    <div>
                        <h3>SvelteFlow not loaded</h3>
                        <p>Please ensure SvelteFlow is properly loaded via the bundled script.</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = '';

        try {
            const { nodes, edges } = this.prepareSvelteFlowData();

            // Create a container for the SvelteFlow component
            const flowContainer = document.createElement('div');
            flowContainer.style.width = '100%';
            flowContainer.style.height = '100%';
            container.appendChild(flowContainer);

            // Create the SvelteFlow component instance
            const flowInstance = new window.SvelteFlow({
                target: flowContainer,
                props: {
                    nodes: nodes,
                    edges: edges,
                    fitView: true,
                    defaultViewport: { x: 0, y: 0, zoom: 1 },
                    onNodeDragStop: (event, node) => {
                        console.log('HuEvaFlowEnhancer: Node dragged', node);
                    }
                }
            });

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

        statuses.forEach((status, index) => {
            let position = { x: 100, y: 100 };

            if (workflow.scheme_draw_config) {
                const configKey = `${status.id}_draw_scheme_item`;
                const config = workflow.scheme_draw_config[configKey];

                if (config) {
                    position = { x: config.x, y: config.y };
                }
            }

            if (position.x === 100 && position.y === 100) {
                const cols = 4;
                const row = Math.floor(index / cols);
                const col = index % cols;
                position = {
                    x: 200 + col * 250,
                    y: 150 + row * 200
                };
            }

            const bgColor = this.hexToRgbA(status.color, 0.15) || '#ffffff';
            const borderColor = this.adjustColorLightness(status.color, -20) || '#000000';
            const textColor = this.adjustColorLightness(status.color, -80) || '#000000';

            const node = {
                id: status.id,
                type: 'default',
                position,
                data: {
                    label: status.name,
                    description: status.text || '',
                    color: status.color,
                    statusType: status.status_type
                },
                style: {
                    backgroundColor: bgColor,
                    borderColor: borderColor,
                    color: textColor,
                    border: `2px solid ${borderColor}`,
                    borderRadius: '6px',
                    padding: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    minWidth: '120px',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                },
                sourcePosition: 'right',
                targetPosition: 'left',
                draggable: true
            };

            if (status.name.toLowerCase().includes('старт') || status.code === 'start') {
                node.style.borderRadius = '50%';
                node.style.minWidth = '60px';
                node.style.minHeight = '60px';
            }

            nodes.push(node);
        });

        transitions.forEach(transition => {
            transition.status_from.forEach(fromStatus => {
                const edge = {
                    id: `${fromStatus.id}-${transition.status_to.id}`,
                    source: fromStatus.id,
                    target: transition.status_to.id,
                    type: 'smoothstep',
                    label: transition.name.trim(),
                    animated: false,
                    style: {
                        stroke: '#456',
                        strokeWidth: 2
                    },
                    labelStyle: {
                        fill: '#456',
                        fontWeight: 600,
                        fontSize: '12px'
                    },
                    markerEnd: {
                        type: 'arrowclosed',
                        color: '#456'
                    }
                };

                edges.push(edge);
            });
        });

        console.log('HuEvaFlowEnhancer: Prepared SvelteFlow data', { nodes, edges });

        return { nodes, edges };
    }

    /**
     * Helper function to convert hex color to RGBA
     * @param {string} hex - Hex color string
     * @param {number} alpha - Alpha value (0-1)
     * @returns {string|null} RGBA color string or null if invalid
     */
    hexToRgbA(hex, alpha = 1) {
        if (!hex) return null;

        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})` :
            null;
    }

    /**
     * Helper function to adjust color lightness
     * @param {string} hex - Hex color string
     * @param {number} percent - Percentage to adjust (-100 to 100)
     * @returns {string|null} Adjusted hex color string or null if invalid
     */
    adjustColorLightness(hex, percent) {
        if (!hex) return null;

        hex = hex.replace(/^\s*#|\s*$/g, '');

        let r = parseInt(hex.substr(0, 2), 16);
        let g = parseInt(hex.substr(2, 2), 16);
        let b = parseInt(hex.substr(4, 2), 16);

        r = Math.min(255, Math.max(0, r + r * (percent / 100)));
        g = Math.min(255, Math.max(0, g + g * (percent / 100)));
        b = Math.min(255, Math.max(0, b + b * (percent / 100)));

        r = Math.round(r).toString(16).padStart(2, '0');
        g = Math.round(g).toString(16).padStart(2, '0');
        b = Math.round(b).toString(16).padStart(2, '0');

        return `#${r}${g}${b}`;
    }
}