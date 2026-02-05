/**
 * HuEvaFlowEnhancer - Class for enhancing EvaTeam workflow visualization
 */
class HuEvaFlowEnhancer {
    constructor() {
        this.isInitialized = false;
        this.workflowData = null;
        this.originalContainer = null;
        this.enhancedContainer = null;
        // Determine the base URL for the API based on the environment
        const apiBaseUrl = window.location.hostname === 'localhost' ?
                           'http://localhost:3000/makets/api/' : // Corrected: without 'api__m=' prefix
                           'https://eva.gid.team/api/?m=';
        this.api = new window.HuEvaApi(apiBaseUrl);
        this.workflowId = null; // Store the workflow ID
        console.log('HuEvaFlowEnhancer: Constructor - Initialized.');
    }

    /**
     * Initialize the enhancer
     */
    async initialize() {
        console.log('Hu: EvaTeam Workflow Enhancer: Initializing...');

        // Extract workflowId from the URL. Example: /project/Task/YOUR-WORKFLOW-ID
        const pathSegments = window.location.pathname.split('/');
        const taskIndex = pathSegments.indexOf('Task');
        if (taskIndex > -1 && taskIndex + 1 < pathSegments.length) {
            this.workflowId = pathSegments[taskIndex + 1];
            console.log(`Hu: EvaTeam Workflow Enhancer: Detected workflowId: ${this.workflowId}`);
        } else {
            console.warn('Hu: EvaTeam Workflow Enhancer: Could not extract workflowId from URL. This might be an issue in production.');
            // For localhost development, we might not have a workflowId in the URL,
            // but the mock API can still provide data.
            // In a real scenario, this would need to be passed or extracted reliably.
        }

        // Wait for required libraries
        await this.waitForLibraries();

        // Add the "Improve Schema" button when the element appears
        this.addImproveSchemaButton();

        // Use a MutationObserver to detect when the workflow dialog appears
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // Element node
                            if (node.matches && node.matches('dlg-cmf-workflow-task.ng-star-inserted')) {
                                console.log('Hu: EvaTeam Workflow Enhancer: Found target element via mutation.');
                                this.addImproveSchemaButton(); // Re-add button if dialog re-appears
                                return;
                            }
                            const targetElement = node.querySelector && node.querySelector('dlg-cmf-workflow-task.ng-star-inserted');
                            if (targetElement) {
                                console.log('Hu: EvaTeam Workflow Enhancer: Found target element in mutation descendants.');
                                // Call the API-based enhancement
                                // Pass the targetElement to openEnhancedWorkflowAPI if needed for context/display
                                this.openEnhancedWorkflowAPI(this.workflowId, targetElement);
                                return;
                            }
                        }
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        this.isInitialized = true;
        console.log('Hu: EvaTeam Workflow Enhancer: Initialization complete.');
    }

    /**
     * Wait for required libraries to load
     */
    async waitForLibraries(retries = 50, delay = 200) {
        console.log(`Hu: EvaTeam Workflow Enhancer: waitForLibraries - Starting check (retries left: ${retries}).`);
        return new Promise((resolve, reject) => {
            const checkLibraries = () => {
                const isReactLoaded = typeof window.React !== 'undefined';
                const isReactDOMLoaded = typeof window.ReactDOM !== 'undefined';

                // Check for ReactFlow in various possible locations
                const isReactFlowLoaded = typeof window.reactflow !== 'undefined' ||
                                          typeof window.ReactFlow !== 'undefined' ||
                                          typeof window.REACT_FLOW !== 'undefined';

                console.log(`Hu: EvaTeam Workflow Enhancer: Checking library status - React: ${isReactLoaded}, ReactDOM: ${isReactDOMLoaded}, ReactFlow: ${isReactFlowLoaded}. Retries left: ${retries}`);

                if (isReactLoaded && isReactDOMLoaded && isReactFlowLoaded) {
                    console.log('Hu: EvaTeam Workflow Enhancer: All required libraries found.');
                    resolve();
                } else if (retries > 0) {
                    setTimeout(checkLibraries, delay);
                    retries--;
                } else {
                    console.error('Hu: EvaTeam Workflow Enhancer: Failed to load all required libraries after multiple retries. Proceeding with basic functionality.');
                    resolve();
                }
            };

            checkLibraries();
        });
    }

    /**
     * Add the "Improve Schema" button when the element appears
     */
    addImproveSchemaButton() {
        console.log('Hu: EvaTeam Workflow Enhancer: Attempting to add improve schema button.');

        // Find the dlg-cmf-workflow-task element with the specific attributes mentioned
        const workflowTaskElement = document.querySelector('dlg-cmf-workflow-task[_nghost-ng-c2682208480].ng-star-inserted');

        if (workflowTaskElement) {
            console.log('Hu: EvaTeam Workflow Enhancer: Found dlg-cmf-workflow-task element.');

            // Check if button already exists to prevent duplicates
            if (workflowTaskElement.querySelector('#improve-schema-button')) {
                console.log('Hu: EvaTeam Workflow Enhancer: Button already exists, skipping creation.');
                return;
            }

            // Create the button element
            const improveButton = document.createElement('button');
            improveButton.id = 'improve-schema-button';
            improveButton.textContent = 'Improve Schema';
            improveButton.style.cssText = `
                margin-left: 10px;
                padding: 8px 15px;
                background-color: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
            `;

            // Add click handler for the button
            improveButton.addEventListener('click', () => {
                this.openEnhancedWorkflowAPI(this.workflowId, workflowTaskElement);
            });

            // Find the header div that contains the title "Бизнес-процесс: Project DATA - sub-analytics"
            const headerDiv = workflowTaskElement.querySelector('[cmf-dialog-header]');
            if (headerDiv) {
                // Add the button to the header div, next to the title
                headerDiv.appendChild(improveButton);
                console.log('Hu: EvaTeam Workflow Enhancer: Button added successfully to header.');
            } else {
                console.error('Hu: EvaTeam Workflow Enhancer: Could not find header div in workflow task element.');

                // Alternative: Add button as next sibling to the workflow task element
                workflowTaskElement.parentNode.insertBefore(improveButton, workflowTaskElement.nextSibling);
                console.log('Hu: EvaTeam Workflow Enhancer: Button added as sibling to workflow task element.');
            }
        } else {
            console.log('Hu: EvaTeam Workflow Enhancer: dlg-cmf-workflow-task element not found, will wait for it.');
        }
    }

    /**
     * Initialize the enhancer from API data.
     * @param {string} workflowId - The ID of the workflow to fetch.
     */
    async initFromAPI(workflowId) {
        console.log(`Hu: EvaTeam Workflow Enhancer: initFromAPI - Starting for workflowId: ${workflowId}...`);

        if (!workflowId) {
            console.error('Hu: EvaTeam Workflow Enhancer: initFromAPI - No workflowId provided for API initialization.');
            return;
        }

        try {
            // Fetch all necessary data in parallel
            const [workflowResponse, transitionsResponse, statusesResponse] = await Promise.all([
                this.api.getCmfWorkflow({ workflowId: workflowId }),
                this.api.getCmfTransList(),
                this.api.getCmfStatusList()
            ]);

            console.log('Hu: EvaTeam Workflow Enhancer: initFromAPI - API responses received:', { workflowResponse, transitionsResponse, statusesResponse });

            // Process API data into ReactFlow format
            let workflowData;
            try {
                // Access the 'result' property for the actual data
                workflowData = this.processApiData(workflowResponse.result, transitionsResponse.result, statusesResponse.result);
                console.log('Hu: EvaTeam Workflow Enhancer: initFromAPI - Processed workflowData:', workflowData);
                window.lastWorkflowData = workflowData; // Expose globally for debugging
            } catch (processError) {
                console.error('Hu: EvaTeam Workflow Enhancer: initFromAPI - Error during processApiData:', processError);
                throw processError; // Re-throw to be caught by the outer catch
            }

            // Find the appropriate container for the enhanced view
            // In development mode, look for the react-flow-container in the 'enhanced' tab
            let container = document.getElementById('react-flow-container');

            // If not found, try to find it in the development environment
            if (!container) {
                const tabContent = document.querySelector('#enhanced-tab .react-flow-container') ||
                                  document.querySelector('#enhanced-tab [id$="container"]') ||
                                  document.querySelector('#enhanced-tab div') ||
                                  document.getElementById('enhanced-tab');

                if (tabContent) {
                    container = document.createElement('div');
                    container.id = 'react-flow-container';
                    container.style.cssText = `
                        width: 100%;
                        height: 600px;
                        min-height: 500px;
                        display: block;
                        position: relative;
                    `;
                    tabContent.innerHTML = '';
                    tabContent.appendChild(container);
                } else {
                    container = document.createElement('div');
                    container.id = 'react-flow-container';
                    container.style.cssText = `
                        width: 100%;
                        height: 600px;
                        min-height: 500px;
                        display: block;
                        position: relative;
                    `;
                    document.body.appendChild(container);
                }
            } else {
                container.innerHTML = ''; // Clear existing content
            }
            console.log('Hu: EvaTeam Workflow Enhancer: initFromAPI - Target container:', container);


            // Render the ReactFlow component in the container
            try {
                this.renderReactFlowComponent(container, workflowData);
                console.log('Hu: EvaTeam Workflow Enhancer: Initialized from API.');
            } catch (renderError) {
                console.error('Hu: EvaTeam Workflow Enhancer: initFromAPI - Error during renderReactFlowComponent:', renderError);
                throw renderError; // Re-throw to be caught by the outer catch
            }

        } catch (error) {
            console.error('Hu: EvaTeam Workflow Enhancer: Failed to initialize from API:', error);
            alert('Failed to load workflow data from API. Please check console for details.');
        }
    }

    /**
     * Function to process API data into ReactFlow nodes and edges.
     * @param {object} workflowResult - The 'result' object from CmfWorkflow.get response.
     * @param {Array} transitionsResult - The 'result' array from CmfTrans.list response.
     * @param {Array} statusesResult - The 'result' array from CmfStatus.list response.
     * @returns {{nodes: Array, edges: Array}} - ReactFlow compatible data.
     */
    processApiData(workflowResult, transitionsResult, statusesResult) {
        console.log('Hu: EvaTeam Workflow Enhancer: processApiData - Starting data processing.');
        const nodes = [];
        const edges = [];
        const statusMap = new Map(); // Map status ID to status object for easy lookup

        try {
            // Process statuses first to create nodes
            if (!statusesResult || !Array.isArray(statusesResult)) {
                console.warn('Hu: EvaTeam Workflow Enhancer: processApiData - Invalid statusesResult:', statusesResult);
            } else {
                statusesResult.forEach((status, index) => {
                    const id = status.id; // Use status.id directly
                    statusMap.set(status.id, status); // Store for later use by its full ID

                    // Simple grid layout for initial positioning
                    const x = 50 + (index % 4) * 250;
                    const y = 50 + Math.floor(index / 4) * 150;

                    const isStartOrEndNode = (status.name === 'Старт' || status.name === 'Все'); // Adjust based on actual names if needed
                    let width = 120;
                    let height = 60;
                    let shape = 'rect';

                    if (status.name === 'Старт') {
                        width = height = 60;
                        shape = 'circle';
                    }
                    if (status.name === 'Все') {
                        width = height = 50;
                        shape = 'circle';
                    }

                    nodes.push({
                        id: id,
                        position: { x, y },
                        data: {
                            label: status.name,
                            isStartEndNode: isStartOrEndNode,
                            shape: shape,
                            width: width,
                            height: height
                        },
                        width: width,
                        height: height,
                        type: (status.name === 'Старт' || status.name === 'Все') ? 'startEnd' : 'default',
                        style: {
                            backgroundColor: status.color || (isStartOrEndNode ? '#4CAF50' : '#fff'),
                            borderColor: '#ccc',
                            color: isStartOrEndNode ? '#fff' : '#000',
                            borderRadius: isStartOrEndNode ? '50%' : '8px',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            fontWeight: isStartOrEndNode ? 'bold' : 'normal',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: isStartOrEndNode ? '14px' : '12px'
                        }
                    });
                });
            }


            // Add 'node_start' and 'all0' as special nodes if they are not represented in statusesResult
            // And ensure their IDs are correct for edges to connect.
            if (!nodes.some(node => node.id === 'node_start')) {
                nodes.unshift({ // Add to the beginning
                    id: 'node_start',
                    position: { x: 50, y: 20 },
                    data: { label: 'Старт', isStartEndNode: true, shape: 'circle', width: 60, height: 60 },
                    width: 60, height: 60, type: 'startEnd',
                    style: {
                        backgroundColor: '#4CAF50', borderColor: '#2E7D32', color: 'white',
                        borderRadius: '50%', borderWidth: '3px', borderStyle: 'solid',
                        fontWeight: 'bold', textAlign: 'center', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: '14px'
                    }
                });
            }
            if (!nodes.some(node => node.id === 'all0')) {
                 nodes.push({ // Add to the end
                    id: 'all0',
                    position: { x: 50 + (nodes.length % 4) * 250, y: 50 + Math.floor(nodes.length / 4) * 150 },
                    data: { label: 'Все', isStartEndNode: true, shape: 'circle', width: 50, height: 50 },
                    width: 50, height: 50, type: 'startEnd',
                    style: {
                        backgroundColor: '#607D8B', borderColor: '#455A64', color: 'white',
                        borderRadius: '50%', borderWidth: '2px', borderStyle: 'solid',
                        fontWeight: 'bold', textAlign: 'center', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: '12px'
                    }
                });
            }

            // Process transitions to create edges
            if (!transitionsResult || !Array.isArray(transitionsResult)) {
                console.warn('Hu: EvaTeam Workflow Enhancer: processApiData - Invalid transitionsResult:', transitionsResult);
            } else {
                transitionsResult.forEach(trans => {
                    // Check if status_from is an array (as seen in some mock data)
                    const statusFromArr = Array.isArray(trans.status_from) ? trans.status_from : [trans.status_from];

                    statusFromArr.forEach(statusFrom => {
                        let sourceId = statusFrom.id; // Use statusFrom.id directly
                        let targetId = trans.status_to.id; // Use trans.status_to.id directly

                        // Handle special cases for 'start' and 'all' statuses if they are part of transitions
                        if (statusFrom.name === 'Старт') {
                            sourceId = 'node_start';
                        }
                        if (trans.status_to.name === 'Все') {
                            targetId = 'all0';
                        }

                        if (sourceId && targetId && sourceId !== targetId) {
                            const edgeId = `e-${sourceId}-${targetId}-${trans.id}`; // Use trans.id for unique edge ID part
                            edges.push({
                                id: edgeId,
                                source: sourceId,
                                target: targetId,
                                label: trans.name,
                                type: 'smoothstep',
                                animated: false,
                                style: {
                                    strokeWidth: 2,
                                    stroke: '#666',
                                    strokeDasharray: trans.name.toLowerCase().includes('reopen') ? '5,5' : 'none'
                                },
                                labelStyle: {
                                    fill: '#333',
                                    fontWeight: 'bold',
                                    fontSize: '12px'
                                },
                                labelBgPadding: [8, 4],
                                labelBgBorderRadius: 4,
                                labelBgStyle: {
                                    fill: '#fff',
                                    color: '#333',
                                    fillOpacity: 0.9,
                                    stroke: '#ccc',
                                    strokeWidth: 1
                                },
                                markerEnd: {
                                    type: 'arrowclosed',
                                    width: 15,
                                    height: 15,
                                    color: '#666',
                                    strokeWidth: 1
                                }
                            });
                        }
                    }); // End statusFromArr.forEach
                }); // End transitionsResult.forEach
            } // End else (transitionsResult is valid)
        } catch (processingError) {
            console.error('Hu: EvaTeam Workflow Enhancer: processApiData - Fatal error during data processing:', processingError);
            throw processingError; // Re-throw to be caught by initFromAPI
        }


        console.log(`Hu: EvaTeam Workflow Enhancer: processApiData - Created ${nodes.length} nodes and ${edges.length} edges.`);
        return { nodes, edges };
    }

    /**
     * Function to open the enhanced workflow view (API version).
     * @param {string} workflowId - The ID of the workflow to display.
     * @param {HTMLElement} workflowTaskElement - The original DOM element containing the workflow (used for context, not direct manipulation in dev mode).
     */
    async openEnhancedWorkflowAPI(workflowId, workflowTaskElement) {
        console.log('Hu: EvaTeam Workflow Enhancer: openEnhancedWorkflowAPI - Starting.');

        if (!workflowId) {
            console.error('Hu: EvaTeam Workflow Enhancer: openEnhancedWorkflowAPI - Workflow ID is not available.');
            return;
        }

        // Check if libraries loaded properly before proceeding
        const isReactLoaded = typeof window.React !== 'undefined';
        const isReactDOMLoaded = typeof window.ReactDOM !== 'undefined';
        const isReactFlowLoaded = typeof window.reactflow !== 'undefined' ||
                                  typeof window.ReactFlow !== 'undefined' ||
                                  typeof window.REACT_FLOW !== 'undefined';

        if (!isReactLoaded || !isReactDOMLoaded || !isReactFlowLoaded) {
            console.error('Hu: EvaTeam Workflow Enhancer: openEnhancedWorkflowAPI - Required libraries not loaded.');
            return;
        }

        // In dev.html, we directly manipulate the tabs.
        // We ensure the enhanced tab is active and then call initFromAPI.
        const enhancedTab = document.getElementById('enhanced-tab');
        const originalTab = document.getElementById('original-tab');
        const reactFlowContainer = document.getElementById('react-flow-container');

        if (!enhancedTab || !reactFlowContainer) {
            console.error('Hu: EvaTeam Workflow Enhancer: openEnhancedWorkflowAPI - Dev environment missing #enhanced-tab or #react-flow-container.');
            alert('Dev environment setup is incorrect. Missing enhanced tab or ReactFlow container.');
            return;
        }

        // Ensure enhanced tab is visible and original is hidden
        if (originalTab) {
            originalTab.style.display = 'none';
        }
        enhancedTab.style.display = 'block';

        // Update active class for tab buttons (assuming they exist in dev.html)
        const enhancedButton = document.querySelector(".tab-button[onclick*='enhanced']");
        const originalButton = document.querySelector(".tab-button[onclick*='original']");
        if (enhancedButton) enhancedButton.classList.add('active');
        if (originalButton) originalButton.classList.remove('active');


        // Render the ReactFlow component in the container with API data
        await this.initFromAPI(workflowId);
        console.log('Hu: EvaTeam Workflow Enhancer: openEnhancedWorkflowAPI - Completed.');
    }
    /**
     * Function to render the ReactFlow component
     */
    renderReactFlowComponent(container, workflowData) {
        console.log('Hu: EvaTeam Workflow Enhancer: renderReactFlowComponent - Rendering ReactFlow component...');
        console.log('Hu: EvaTeam Workflow Enhancer: renderReactFlowComponent - Container:', container);
        console.log('Hu: EvaTeam Workflow Enhancer: renderReactFlowComponent - workflowData:', workflowData);


        // Determine which React Flow object is available
        const ReactFlow = window.reactflow || window.ReactFlow || window.REACT_FLOW;
        const React = window.React;
        const ReactDOM = window.ReactDOM;

        if (!ReactFlow) {
            console.error('Hu: EvaTeam Workflow Enhancer: renderReactFlowComponent - ReactFlow library not found!');
            return;
        }

        // Create custom node components
        const StartEndNode = ({ data }) => {
            return React.createElement('div', {
                className: 'react-flow__node-start-end',
                style: {
                    width: data.width,
                    height: data.height,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                    color: 'white',
                    border: '3px solid #2E7D32',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontSize: '14px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    position: 'relative'
                }
            }, [
                // Add handles for connections - only top and bottom for top-bottom positioning
                React.createElement(ReactFlow.Handle, {
                    type: 'source',
                    position: 'top',
                    id: 'source-top',
                    style: {
                        background: '#2E7D32',
                        width: '8px',
                        height: '8px',
                        border: '2px solid white'
                    }
                }),
                React.createElement(ReactFlow.Handle, {
                    type: 'source',
                    position: 'bottom',
                    id: 'source-bottom',
                    style: {
                        background: '#2E7D32',
                        width: '8px',
                        height: '8px',
                        border: '2px solid white'
                    }
                }),
                React.createElement(ReactFlow.Handle, {
                    type: 'target',
                    position: 'top',
                    id: 'target-top',
                    style: {
                        background: '#2E7D32',
                        width: '8px',
                        height: '8px',
                        border: '2px solid white'
                    }
                }),
                React.createElement(ReactFlow.Handle, {
                    type: 'target',
                    position: 'bottom',
                    id: 'target-bottom',
                    style: {
                        background: '#2E7D32',
                        width: '8px',
                        height: '8px',
                        border: '2px solid white'
                    }
                }),
                React.createElement('div', {
                    style: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none'
                    }
                }, data.label)
            ]);
        };

        // Create the ReactFlow component
        function EnhancedWorkflowApp() {
            const [nodes, setNodes, onNodesChange] = ReactFlow.useNodesState(workflowData.nodes);
            const [edges, setEdges, onEdgesChange] = ReactFlow.useEdgesState(workflowData.edges);

            const onConnect = React.useCallback(
                (params) => setEdges((eds) => ReactFlow.addEdge(params, eds)),
                [setEdges]
            );

            // Define node types
            const nodeTypes = React.useMemo(() => ({
                startEnd: StartEndNode
            }), []);

            return React.createElement(ReactFlow.ReactFlow, {
                nodes: nodes,
                edges: edges,
                onNodesChange: onNodesChange,
                onEdgesChange: onEdgesChange,
                onConnect: onConnect,
                fitView: true,
                attributionPosition: 'bottom-left',
                connectionMode: ReactFlow.ConnectionMode.Loose,
                nodeTypes: nodeTypes,
                defaultEdgeOptions: {
                    type: 'smoothstep',
                    style: { strokeWidth: 2, stroke: '#666' },
                    markerEnd: {
                        type: 'arrowclosed',
                        width: 15,
                        height: 15,
                        color: '#666',
                        strokeWidth: 1
                    },
                    animated: false
                }
            },
                React.createElement(ReactFlow.Controls, null),
                React.createElement(ReactFlow.MiniMap, null),
                React.createElement(ReactFlow.Background, {
                    variant: ReactFlow.BackgroundVariant?.dots || 'dots'
                })
            );
        }

        try {
            // Debug information
            console.log('Hu: EvaTeam Workflow Enhancer: ReactFlow data:', {
                nodesCount: workflowData.nodes.length,
                edgesCount: workflowData.edges.length,
                firstFewNodes: workflowData.nodes.slice(0, 3),
                firstFewEdges: workflowData.edges.slice(0, 3)
            });

            // Render the component in the container using createRoot (React 18+)
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(EnhancedWorkflowApp));
            console.log('Hu: EvaTeam Workflow Enhancer: ReactFlow component rendered successfully!');

            // Additional debug after render
            setTimeout(() => {
                console.log('Hu: EvaTeam Workflow Enhancer: After render - checking ReactFlow instance');
                const reactFlowInstance = container.querySelector('.react-flow');
                if (reactFlowInstance) {
                    console.log('Hu: EvaTeam Workflow Enhancer: ReactFlow DOM element found:', reactFlowInstance);
                } else {
                    console.log('Hu: EvaTeam Workflow Enhancer: ReactFlow DOM element NOT found');
                }
            }, 100);

        } catch (error) {
            console.error('Hu: EvaTeam Workflow Enhancer: Error rendering ReactFlow component: ' + error.message);
            console.error('Hu: EvaTeam Workflow Enhancer: Error stack:', error.stack);
            // Fallback: render a simple representation
            container.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Error loading ReactFlow. Check dependencies.</div>';
        }
    }

    /**
     * Function to open the enhanced workflow view
     */
    openEnhancedWorkflow(workflowElement) {
        console.log('Hu: EvaTeam Workflow Enhancer: Opening enhanced workflow view.');

        // Check if libraries loaded properly before proceeding
        const isReactLoaded = typeof window.React !== 'undefined';
        const isReactDOMLoaded = typeof window.ReactDOM !== 'undefined';
        const isReactFlowLoaded = typeof window.reactflow !== 'undefined' ||
                                  typeof window.ReactFlow !== 'undefined' ||
                                  typeof window.REACT_FLOW !== 'undefined';

        if (!isReactLoaded || !isReactDOMLoaded || !isReactFlowLoaded) {
            alert('Необходимые библиотеки для отображения улучшенной схемы еще не загрузились. Пожалуйста, подождите немного и попробуйте снова.');
            return;
        }

        // Extract workflow data from the current view
        const workflowData = this.extractWorkflowData(workflowElement);

        // Find the app-cmf-ui-jsplumb element to add the enhanced view
        const jsPlumbElement = workflowElement.querySelector('app-cmf-ui-jsplumb');

        if (!jsPlumbElement) {
            console.error('Hu: EvaTeam Workflow Enhancer: Could not find app-cmf-ui-jsplumb element to add enhanced view.');
            alert('Не удалось найти элемент для добавления улучшенной схемы.');
            return;
        }

        // Check if enhanced view already exists
        let enhancedViewContainer = jsPlumbElement.querySelector('#enhanced-workflow-container');

        if (enhancedViewContainer) {
            // If container exists, just show it
            enhancedViewContainer.style.display = 'block';
            // Hide the original jsPlumb view
            const originalView = jsPlumbElement.querySelector('.chart-container');
            if (originalView) {
                originalView.style.display = 'none';
            }
            return;
        }

        // Create container for the enhanced view
        enhancedViewContainer = document.createElement('div');
        enhancedViewContainer.id = 'enhanced-workflow-container';
        enhancedViewContainer.style.cssText = `
            width: 100%;
            height: 600px;
            min-height: 500px;
            display: block;
            position: relative;
        `;

        // Add CSS for circular start/end nodes
        const style = document.createElement('style');
        style.textContent = `
            #enhanced-workflow-container .react-flow__node-start-end {
                border-radius: 50% !important;
                background: linear-gradient(135deg, #4CAF50, #45a049) !important;
                color: white !important;
                border: 3px solid #2E7D32 !important;
                font-weight: bold !important;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                text-align: center !important;
            }

            #enhanced-workflow-container .react-flow__node-start-end .react-flow__node-label {
                color: white !important;
                font-size: 14px !important;
                font-weight: bold !important;
            }
        `;
        enhancedViewContainer.appendChild(style);

        // Add the enhanced view container to the jsPlumb element
        jsPlumbElement.appendChild(enhancedViewContainer);

        // Hide the original jsPlumb view
        const originalView = jsPlumbElement.querySelector('.chart-container');
        if (originalView) {
            originalView.style.display = 'none';
        }

        // Create a button to switch back to the original view
        const switchButton = document.createElement('button');
        switchButton.textContent = 'Показать оригинальную схему';
        switchButton.style.cssText = `
            margin: 10px 0;
            padding: 8px 15px;
            background-color: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        switchButton.addEventListener('click', function() {
            enhancedViewContainer.style.display = 'none';
            if (originalView) {
                originalView.style.display = 'block';
            }
        });

        // Insert the button before the enhanced view container
        jsPlumbElement.insertBefore(switchButton, enhancedViewContainer);

        // Render the ReactFlow component in the container
        this.renderReactFlowComponent(enhancedViewContainer, workflowData);
    }

    /**
     * Calculate optimal connection positions for all nodes based on minimum distance
     */
    calculateOptimalConnectionPositions(nodes) {
        console.log(`Hu: EvaTeam Workflow Enhancer: calculateOptimalConnectionPositions - Initializing positions for ${nodes.length} nodes.`);
        // Initialize with default positions - individual edges will be optimized later
        nodes.forEach(node => {
            if (node.type === 'startEnd' || node.data?.isStartEndNode) {
                // For circular nodes, use top/bottom by default
                node.sourcePosition = 'bottom';
                node.targetPosition = 'top';
            } else {
                // For regular nodes, use left/right by default
                node.sourcePosition = 'right';
                node.targetPosition = 'left';
            }
        });

        console.log(`Hu: EvaTeam Workflow Enhancer: calculateOptimalConnectionPositions - Completed.`);
    }

    /**
     * Get optimal connection position for a specific connection based on minimum distance
     */
    getOptimalConnectionPosition(node, connectedNode, connectionType) {
        // Node dimensions (approximate, can be adjusted)
        const nodeWidth = node.width || 120;
        const nodeHeight = node.height || 60;

        // Calculate center points of the node
        const nodeCenterX = node.position.x + nodeWidth / 2;
        const nodeCenterY = node.position.y + nodeHeight / 2;

        // Connected node center
        const connectedCenterX = connectedNode.position.x + (connectedNode.width || 120) / 2;
        const connectedCenterY = connectedNode.position.y + (connectedNode.height || 60) / 2;

        // Calculate distances from each possible connection point to the target center
        const distances = {
            left: Math.sqrt(
                Math.pow(node.position.x - connectedCenterX, 2) +
                Math.pow(nodeCenterY - connectedCenterY, 2)
            ),
            right: Math.sqrt(
                Math.pow((node.position.x + nodeWidth) - connectedCenterX, 2) +
                Math.pow(nodeCenterY - connectedCenterY, 2)
            ),
            top: Math.sqrt(
                Math.pow(nodeCenterX - connectedCenterX, 2) +
                Math.pow(node.position.y - connectedCenterY, 2)
            ),
            bottom: Math.sqrt(
                Math.pow(nodeCenterX - connectedCenterX, 2) +
                Math.pow((node.position.y + nodeHeight) - connectedCenterY, 2)
            )
        };

        // Find the position with minimum distance
        let optimalPosition = 'right';
        let minDistance = distances.right;

        Object.keys(distances).forEach(position => {
            if (distances[position] < minDistance) {
                minDistance = distances[position];
                optimalPosition = position;
            }
        });

        console.log(`Hu: EvaTeam Workflow Enhancer: getOptimalConnectionPosition - for ${node.id} -> ${connectedNode.id}: ${optimalPosition} (distance: ${minDistance.toFixed(2)})`);

        return optimalPosition;
    }

    /**
     * Generate HTML for the enhanced workflow view (for backward compatibility)
     */
    generateEnhancedWorkflowHTML(workflowData) {
        console.log('Hu: EvaTeam Workflow Enhancer: generateEnhancedWorkflowHTML - Called.');
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Улучшенная схема workflow</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/reactflow@11.11.4/dist/umd/index.min.js"></script>
    <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
        #root { width: 100%; height: calc(100vh - 40px); }
        .header { margin-bottom: 20px; }
        .header h1 { color: #333; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Улучшенная схема workflow</h1>
        <p>Интерактивная диаграмма с возможностью перетаскивания и масштабирования</p>
    </div>
    <div id="root"></div>

    <script>
        (function() {
            const React = window.React;
            const ReactDOM = window.ReactDOM;
            // Determine which React Flow object is available
            const ReactFlow = window.reactflow || window.ReactFlow || window.REACT_FLOW;

            function EnhancedWorkflowApp() {
                const [nodes, setNodes, onNodesChange] = ReactFlow.useNodesState(${JSON.stringify(workflowData.nodes)});
                const [edges, setEdges, onEdgesChange] = ReactFlow.useEdgesState(${JSON.stringify(workflowData.edges)});

                const onConnect = React.useCallback(
                    (params) => setEdges((eds) => ReactFlow.addEdge(params, eds)),
                    [setEdges]
                );

                return React.createElement(ReactFlow.ReactFlow, {
                    nodes: nodes,
                    edges: edges,
                    onNodesChange: onNodesChange,
                    onEdgesChange: onEdgesChange,
                    onConnect: onConnect,
                    fitView: true,
                    attributionPosition: 'bottom-left'
                },
                    React.createElement(ReactFlow.Controls, null),
                    React.createElement(ReactFlow.MiniMap, null),
                    React.createElement(ReactFlow.Background, {
                        variant: ReactFlow.BackgroundVariant?.dots || 'dots'
                    })
                );
            }

            const rootElement = document.getElementById('root');
            const root = ReactDOM.createRoot(rootElement);
            root.render(React.createElement(EnhancedWorkflowApp));
        })();
    <\/script>
</body>
</html>`;
    }
}

// Initialize the enhancer when the script loads
// document.addEventListener('DOMContentLoaded', function() {
//     const enhancer = new HuEvaFlowEnhancer();
//     enhancer.initialize();
// });
