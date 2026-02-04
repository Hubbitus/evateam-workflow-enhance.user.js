(function() {
    'use strict';

    console.log('Hu: EvaTeam Workflow Enhancer: Script started loading.');

    // Insert CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .dev-header {
            background: #007bff;
            color: white;
            padding: 15px;
            margin: -20px -20px 20px -20px;
            border-radius: 0 0 8px 8px;
        }
        .dev-panel {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .console {
            background: #1e1e1e;
            color: #00ff00;
            padding: 15px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            max-height: 300px;
            overflow-y: auto;
            white-space: pre-wrap;
        }
        .workflow-container {
            border: 2px solid #ddd;
            border-radius: 8px;
            background: white;
            padding: 20px;
            min-height: 600px;
        }
        .tab-buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }
        .tab-button {
            padding: 8px 15px;
            border: 1px solid #007bff;
            background: #f8f9fa;
            color: #007bff;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .tab-button.active {
            background: #007bff;
            color: white;
        }
        .react-flow-container {
            border: 1px solid #eee;
            background: #fcfcfc;
            height: 500px;
            border-radius: 4px;
        }
        .dev-controls {
            display: flex;
            gap: 8px;
            margin-bottom: 15px;
        }
        .dev-button {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        }
        .dev-button.reset {
            background: #28a745;
            color: white;
        }
        .dev-button.clear {
            background: #dc3545;
            color: white;
        }
        .dev-button.info {
            background: #17a2b8;
            color: white;
        }
    `;
    document.head.appendChild(style);

    // Function to wait for libraries to load
    function waitForLibraries(callback, retries = 50, delay = 200) {
        const isReactLoaded = typeof window.React !== 'undefined';
        const isReactDOMLoaded = typeof window.ReactDOM !== 'undefined';
        // Updated detection for React Flow - checking for various possible global object names
        // React Flow UMD build might expose as reactflow, ReactFlow, or window.ReactFlowCore
        const isReactFlowLoaded = typeof window.reactflow !== 'undefined' ||
                                  typeof window.ReactFlow !== 'undefined' ||
                                  typeof window.REACT_FLOW !== 'undefined';

        console.log(`Hu: EvaTeam Workflow Enhancer: Checking library status - React: ${isReactLoaded}, ReactDOM: ${isReactDOMLoaded}, ReactFlow: ${isReactFlowLoaded}. Retries left: ${retries}`);

        if (isReactLoaded && isReactDOMLoaded && isReactFlowLoaded) {
            console.log('Hu: EvaTeam Workflow Enhancer: All required libraries found.');
            callback();
        } else if (retries > 0) {
            setTimeout(() => waitForLibraries(callback, retries - 1, delay), delay);
        } else {
            console.error('Hu: EvaTeam Workflow Enhancer: Failed to load all required libraries after multiple retries. Proceeding with basic functionality.');
            callback();
        }
    }

    // Function to add the "Улучшить схему" button when the element appears
    function addImproveSchemaButton() {
//        console.log('Hu: EvaTeam Workflow Enhancer: Attempting to add improve schema button.');

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
            improveButton.textContent = 'Улучшить схему';
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
            improveButton.addEventListener('click', function() {
                openEnhancedWorkflow(workflowTaskElement);
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
//            console.log('Hu: EvaTeam Workflow Enhancer: dlg-cmf-workflow-task element not found, will wait for it.');
        }
    }

    // Function to extract workflow data and add enhanced view as a tab
    function openEnhancedWorkflow(workflowElement) {
        console.log('Hu: EvaTeam Workflow Enhancer: Adding enhanced workflow view as a tab.');

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
        const workflowData = extractWorkflowData(workflowElement);

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
        renderReactFlowComponent(enhancedViewContainer, workflowData);
    }

    // Function to render the ReactFlow component
    function renderReactFlowComponent(container, workflowData) {
        // Determine which React Flow object is available
        const ReactFlow = window.reactflow || window.ReactFlow || window.REACT_FLOW;
        const React = window.React;
        const ReactDOM = window.ReactDOM;

        // Create the ReactFlow component
        function EnhancedWorkflowApp() {
            const [nodes, setNodes, onNodesChange] = ReactFlow.useNodesState(workflowData.nodes);
            const [edges, setEdges, onEdgesChange] = ReactFlow.useEdgesState(workflowData.edges);

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

        // Render the component in the container using createRoot (React 18+)
        const root = ReactDOM.createRoot(container);
        root.render(React.createElement(EnhancedWorkflowApp));
    }

    // Function to extract workflow data from the current view
    function extractWorkflowData(element) {
        const nodes = [];
        const edges = [];

        // Find the chart container
        const chartContainer = element.querySelector('.chart-container');
        if (!chartContainer) {
            console.error('Hu: EvaTeam Workflow Enhancer: Chart container not found.');
            return { nodes, edges };
        }

        // Extract nodes
        const nodeElements = chartContainer.querySelectorAll('div[id^="node_"], div[id^="CmfStatus:"], div.box.circle');
        nodeElements.forEach(el => {
            const id = el.id || el.getAttribute('data-statusid');
            if (!id) return;

            const labelEl = el.querySelector('.node');
            const label = (labelEl ? labelEl.textContent : el.textContent).trim();

            const leftMatch = el.style.left ? el.style.left.match(/(\d+\.?\d*)px/) : null;
            const topMatch = el.style.top ? el.style.top.match(/(\d+\.?\d*)px/) : null;

            const x = leftMatch ? parseFloat(leftMatch[1]) : 0;
            const y = topMatch ? parseFloat(topMatch[1]) : 0;

            // Create a default width/height for nodes
            const width = 120;
            const height = 60;

            nodes.push({
                id: id,
                position: { x, y },
                data: { label: label },
                width: width,
                height: height,
                className: Array.from(el.classList).join(' '),
                style: {
                    backgroundColor: el.style.backgroundColor || '#fff',
                    borderColor: el.style.borderColor || '#ccc',
                    color: el.style.color || '#000'
                }
            });
        });

        // Extract edges
        const edgeLabelElements = chartContainer.querySelectorAll('.jtk-overlay.n2n-transition');
        const uniqueEdgeIds = new Set();

        edgeLabelElements.forEach(el => {
            const overlayId = el.getAttribute('jtk-overlay-id');
            const label = el.textContent.trim();

            if (!overlayId || !label) return;

            let sourceId = null;
            let targetId = null;

            // Extract source and target from the overlay ID
            // Format: CmfTrans:97f7a04c-659a-11f0-8b7b-ee37db4b230bCmfStatus:97bff9d0-659a-11f0-8b7b-ee37db4b230b
            // This means transition from CmfTrans:... to CmfStatus:...
            const statusIdRegex = /(CmfStatus:[0-9a-fA-F-]+_draw_scheme_item|node_start|all0)/g;
            const foundIds = [];
            let match;
            while ((match = statusIdRegex.exec(overlayId)) !== null) {
                foundIds.push(match[1]);
            }

            if (foundIds.length >= 2) {
                sourceId = foundIds[0];
                targetId = foundIds[1];
            } else {
                // Alternative: try to find source/target from the position of the overlay
                const overlayRect = el.getBoundingClientRect();
                // This is a simplified approach - in a real implementation, we'd need more sophisticated logic
                // to determine source and target based on the overlay position
            }

            if (sourceId && targetId) {
                const edgeId = `e-${sourceId}-${targetId}-${label.replace(/\s/g, '_')}`;
                if (!uniqueEdgeIds.has(edgeId)) {
                    edges.push({
                        id: edgeId,
                        source: sourceId,
                        target: targetId,
                        label: label,
                        type: 'default',
                        animated: false,
                        style: { strokeWidth: 2, stroke: '#456' },
                        labelBgPadding: [8, 4],
                        labelBgBorderRadius: 4,
                        labelBgStyle: { fill: '#fff', color: '#456', fillOpacity: 0.7 },
                    });
                    uniqueEdgeIds.add(edgeId);
                }
            }
        });

        return { nodes, edges };
    }

    // Function to generate HTML for the enhanced workflow view (for backward compatibility)
    function generateEnhancedWorkflowHTML(workflowData) {
            // Use React Flow visualization
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

    // Use a MutationObserver to detect when the workflow dialog appears
    const observer = new MutationObserver((mutationsList, observer) => {
        // Look for the specific element in each mutation
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Check if the target element exists in the added nodes
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // Element node
                        // Check the node itself
                        if (node.matches && node.matches('dlg-cmf-workflow-task[_nghost-ng-c2682208480].ng-star-inserted')) {
                            console.log('Hu: EvaTeam Workflow Enhancer: Found target element via mutation.');
                            addImproveSchemaButton();
                            return;
                        }

                        // Check descendants of the node
                        const targetElement = node.querySelector && node.querySelector('dlg-cmf-workflow-task[_nghost-ng-c2682208480].ng-star-inserted');
                        if (targetElement) {
                            console.log('Hu: EvaTeam Workflow Enhancer: Found target element in mutation descendants.');
                            addImproveSchemaButton();
                            return;
                        }
                    }
                }
            }
        }

        // Also check periodically even if no specific mutation matched
        // DEBUG? addImproveSchemaButton();
    });

    // Wait for libraries and then start observing
    waitForLibraries(() => {
        console.log('Hu: EvaTeam Workflow Enhancer: Libraries loaded, starting observer.');
        observer.observe(document.body, { childList: true, subtree: true });

        // Also try once initially in case the element is already present
        addImproveSchemaButton();
    });

})();
