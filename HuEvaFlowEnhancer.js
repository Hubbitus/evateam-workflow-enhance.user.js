/**
 * HuEvaFlowEnhancer - Class for enhancing EvaTeam workflow visualization
 */
class HuEvaFlowEnhancer {
    constructor() {
        this.isInitialized = false;
        this.workflowData = null;
        this.originalContainer = null;
        this.enhancedContainer = null;
    }

    /**
     * Initialize the enhancer
     */
    async initialize() {
        console.log('Hu: EvaTeam Workflow Enhancer: Initializing...');

        // Wait for required libraries
        await this.waitForLibraries();

        // Add the "Improve Schema" button when the element appears
        this.addImproveSchemaButton();

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
                                this.addImproveSchemaButton();
                                return;
                            }

                            // Check descendants of the node
                            const targetElement = node.querySelector && node.querySelector('dlg-cmf-workflow-task[_nghost-ng-c2682208480].ng-star-inserted');
                            if (targetElement) {
                                console.log('Hu: EvaTeam Workflow Enhancer: Found target element in mutation descendants.');

                                // Extract the HTML content from the target element and initialize from it
                                this.initFromHTML(targetElement.outerHTML);
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
     * Initialize the enhancer from HTML content
     * @param {string} htmlContent - HTML content to parse and visualize
     */
    async initFromHTML(htmlContent) {
        console.log('Hu: EvaTeam Workflow Enhancer: Initializing from HTML content...');

        // Wait for required libraries
        await this.waitForLibraries();

        // Create a temporary element to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        // Extract workflow data from the HTML content
        const workflowData = this.extractWorkflowData(tempDiv);

        // Find the appropriate container for the enhanced view
        // In development mode, look for the react-flow-container in the 'enhanced' tab
        let container = document.getElementById('react-flow-container');

        // If not found, try to find it in the development environment
        if (!container) {
            // Look for the container in the development environment
            const tabContent = document.querySelector('#enhanced-tab .react-flow-container') ||
                              document.querySelector('#enhanced-tab [id$="container"]') ||
                              document.querySelector('#enhanced-tab div') ||
                              document.getElementById('enhanced-tab');

            if (tabContent) {
                // Create a new container inside the enhanced tab
                container = document.createElement('div');
                container.id = 'react-flow-container';
                container.style.cssText = `
                    width: 100%;
                    height: 600px;
                    min-height: 500px;
                    display: block;
                    position: relative;
                `;

                // Clear the tab content and add our container
                tabContent.innerHTML = '';
                tabContent.appendChild(container);
            } else {
                // If still not found, create a new container and add it to the body
                container = document.createElement('div');
                container.id = 'react-flow-container';
                container.style.cssText = `
                    width: 100%;
                    height: 600px;
                    min-height: 500px;
                    display: block;
                    position: relative;
                `;

                // Add the container to the document body or to a specific location
                document.body.appendChild(container);
            }
        } else {
            // Clear the existing container
            container.innerHTML = '';
        }

        // Render the ReactFlow component in the container
        this.renderReactFlowComponent(container, workflowData);

        console.log('Hu: EvaTeam Workflow Enhancer: Initialized from HTML content.');
    }

    /**
     * Wait for required libraries to load
     */
    async waitForLibraries(retries = 50, delay = 200) {
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
                this.openEnhancedWorkflow(workflowTaskElement);
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
     * Function to extract workflow data from HTML elements (similar to the extension)
     */
    extractWorkflowData(element) {
        const nodes = [];
        const edges = [];

        // Find the chart container - try different selectors that might be in the actual HTML
        const chartContainer = element.querySelector('.chart-container') ||
                              element.querySelector('.chart-container[_ngcontent-ng-c1570323233]') ||
                              element.querySelector('[class*="chart-container"]') ||
                              element.querySelector('.jtk-draggable') ||
                              element.querySelector('[data-jtk-container]') ||
                              element.querySelector('app-cmf-ui-jsplumb') ||
                              element || // If no specific container found, use the element itself
                              null;

        if (!chartContainer) {
            console.error('Hu: EvaTeam Workflow Enhancer: Chart container not found.');
            return { nodes, edges };
        }

        // Extract nodes - try different selectors for nodes
        const nodeSelectors = [
            'div[id^="node_"]',
            'div[id*="CmfStatus:"]',
            'div[id*="CmfTrans:"]',
            'div[id="node_start"]',
            'div[id="all0"]',
            'div[class*="box circle"]',
            'div[class*="node"]',
            'div[class*="box"]',
            '[data-statusid]',
            '.node-start',
            '[id$="_draw_scheme_item"]'
        ];

        const nodeElements = [];
        console.log(`Hu: EvaTeam Workflow Enhancer: Looking for node elements with selectors: ${nodeSelectors.join(', ')}`);
        nodeSelectors.forEach(selector => {
            try {
                const elements = chartContainer.querySelectorAll ? chartContainer.querySelectorAll(selector) : [];
                console.log(`Hu: EvaTeam Workflow Enhancer: Selector "${selector}" found ${elements.length} elements`);
                elements.forEach(el => {
                    if (!nodeElements.some(existingEl => existingEl === el)) {
                        nodeElements.push(el);
                    }
                });
            } catch(e) {
                console.log(`Hu: EvaTeam Workflow Enhancer: Error with selector "${selector}": ${e.message}`);
                // Ignore selector errors
            }
        });
        console.log(`Hu: EvaTeam Workflow Enhancer: Total unique node elements found: ${nodeElements.length}`);

        nodeElements.forEach(el => {
            // Get ID from various possible attributes
            let id = el.id ||
                      el.getAttribute('data-statusid') ||
                      el.getAttribute('data-jtk-managed') ||
                      el.getAttribute('data-jtk-scope') ||
                      el.getAttribute('data-statusid') ||
                      null;

            // Normalize node ID: remove '_draw_scheme_item' suffix to match edge IDs
            // Edges reference nodes as 'CmfStatus:uuid' but nodes have 'CmfStatus:uuid_draw_scheme_item'
            if (id && id.includes('_draw_scheme_item')) {
                const originalId = id;
                id = id.replace('_draw_scheme_item', '');
                console.log(`Hu: EvaTeam Workflow Enhancer: Normalized node ID from "${originalId}" to "${id}"`);
            }

            // Special handling for non-UUID nodes like 'node_start' and 'all0'
            if (id === 'node_start' || id === 'all0') {
                console.log(`Hu: EvaTeam Workflow Enhancer: Special node found: "${id}"`);
            }

            if (!id) return;

            // Get label from various possible sources
            let label = '';
            const labelEl = el.querySelector('.node') ||
                           el.querySelector('.title') ||
                           el.querySelector('span') ||
                           null;
            label = (labelEl ? labelEl.textContent : el.textContent).trim();

            // Extract position from various possible sources
            let x = 0, y = 0;

            // Try to get position from style
            if (el.style) {
                const leftMatch = el.style.left ? el.style.left.match(/(\d+\.?\d*)px?/) : null;
                const topMatch = el.style.top ? el.style.top.match(/(\d+\.?\d*)px?/) : null;

                x = leftMatch ? parseFloat(leftMatch[1]) : 0;
                y = topMatch ? parseFloat(topMatch[1]) : 0;
            }

            // If no position from style, try to get from attributes/data attributes
            if (x === 0 && y === 0) {
                const leftAttr = el.getAttribute('data-left') || el.getAttribute('left') || null;
                const topAttr = el.getAttribute('data-top') || el.getAttribute('top') || null;

                if (leftAttr) x = parseFloat(leftAttr);
                if (topAttr) y = parseFloat(topAttr);
            }

            // Scale down positions to fit ReactFlow viewport better
            // Original positions can be too large for ReactFlow
            if (x > 1000 || y > 1000) {
                x = x / 3; // Scale down large positions
                y = y / 3;
            }

            // Ensure minimum spacing between nodes
            x = Math.max(x, 50);
            y = Math.max(y, 50);

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

            // Debug: Log node creation details
            // console.log(`Hu: EvaTeam Workflow Enhancer: Node created:`, {
            //     nodeId: id,
            //     elementId: el.id,
            //     label: label,
            //     position: { x, y },
            //     classes: Array.from(el.classList).join(', '),
            //     attributes: {
            //         'data-statusid': el.getAttribute('data-statusid'),
            //         'data-jtk-managed': el.getAttribute('data-jtk-managed'),
            //         'data-jtk-scope': el.getAttribute('data-jtk-scope')
            //     }
            // });
        });

        // Extract edges - try different selectors for edge labels
        const edgeSelectors = [
            '.jtk-overlay.n2n-transition',
            '.jtk-overlay',
            '.n2n-transition',
            '[class*="transition"]',
            '[jtk-overlay-id]',
            '[data-jtk-managed*="overlay"]'
        ];

        const edgeLabelElements = [];
        edgeSelectors.forEach(selector => {
            try {
                const elements = chartContainer.querySelectorAll ? chartContainer.querySelectorAll(selector) : [];
                elements.forEach(el => {
                    if (!edgeLabelElements.some(existingEl => existingEl === el)) {
                        edgeLabelElements.push(el);
                    }
                });
            } catch(e) {
                // Ignore selector errors
            }
        });

        const uniqueEdgeIds = new Set();

        console.log(`Hu: EvaTeam Workflow Enhancer: Found ${edgeLabelElements.length} edge elements to process`);

        // Debug edge element details
        edgeLabelElements.forEach((el, index) => {
            const overlayId = el.getAttribute('jtk-overlay-id') ||
                             el.getAttribute('data-jtk-overlay-id') ||
                             el.getAttribute('id') ||
                             null;
            const label = el.textContent.trim();
            console.log(`Hu: EvaTeam Workflow Enhancer: Edge element ${index}: overlayId="${overlayId}", label="${label}", element:`, el);
        });

        edgeLabelElements.forEach(el => {
            // Get overlay ID from various possible attributes
            const overlayId = el.getAttribute('jtk-overlay-id') ||
                             el.getAttribute('data-jtk-overlay-id') ||
                             el.getAttribute('id') ||
                             null;
            const label = el.textContent.trim();

            console.log(`Hu: EvaTeam Workflow Enhancer: Processing edge element, overlayId: "${overlayId}", label: "${label}"`);

            if (!overlayId || !label) {
                console.log(`Hu: EvaTeam Workflow Enhancer: Skipping edge element - missing overlayId or label`);
                return;
            }

            let sourceId = null;
            let targetId = null;

            // Extract source and target from the overlay ID
            // Try different patterns that might exist in the actual HTML
            // Format might be: CmfTrans:...CmfStatus:... (concatenated) or node_start-CmfStatus:... (with dash)

            // Pattern 1: IDs separated by a dash (common in our example)
            // But we need to check if it's really a separator, not just UUID dashes
            if (overlayId.includes('-') && !overlayId.includes('CmfStatus:') && !overlayId.includes('CmfTrans:')) {
                const parts = overlayId.split('-');
                if (parts.length >= 2) {
                    // Look for known patterns in the parts
                    for (let i = 0; i < parts.length; i++) {
                        if (parts[i].startsWith('CmfStatus:') ||
                            parts[i].startsWith('CmfTrans:') ||
                            parts[i] === 'node' ||
                            parts[i] === 'all') {

                            if (parts[i] === 'node' && i + 1 < parts.length && parts[i + 1].startsWith('_')) {
                                // This is 'node_start' pattern
                                sourceId = parts[i] + parts[i + 1];
                                if (i + 2 < parts.length) {
                                    // Try to reconstruct the target ID
                                    targetId = parts[i + 2];
                                    for (let j = i + 3; j < parts.length; j++) {
                                        if (parts[j].startsWith('CmfStatus:') ||
                                            parts[j].startsWith('CmfTrans:') ||
                                            parts[j] === 'all') {
                                            break; // Found start of next ID
                                        }
                                        targetId += '-' + parts[j];
                                    }
                                }
                                break;
                            } else if (parts[i] === 'all' && i + 1 < parts.length && /^\d+$/.test(parts[i + 1])) {
                                // This is 'all0' pattern
                                sourceId = parts[i] + parts[i + 1];
                                if (i + 2 < parts.length) {
                                    targetId = parts[i + 2];
                                    for (let j = i + 3; j < parts.length; j++) {
                                        if (parts[j].startsWith('CmfStatus:') ||
                                            parts[j].startsWith('CmfTrans:') ||
                                            parts[j] === 'all' ||
                                            (parts[j] === 'node' && j + 1 < parts.length && parts[j + 1].startsWith('_'))) {
                                            break; // Found start of next ID
                                        }
                                        targetId += '-' + parts[j];
                                    }
                                }
                                break;
                            } else if (parts[i].startsWith('CmfStatus:') || parts[i].startsWith('CmfTrans:')) {
                                // This is a complete ID
                                sourceId = parts[i];
                                if (i + 1 < parts.length) {
                                    targetId = parts[i + 1];
                                    for (let j = i + 2; j < parts.length; j++) {
                                        if (parts[j].startsWith('CmfStatus:') ||
                                            parts[j].startsWith('CmfTrans:') ||
                                            parts[j] === 'all' ||
                                            (parts[j] === 'node' && j + 1 < parts.length && parts[j + 1].startsWith('_'))) {
                                            break; // Found start of next ID
                                        }
                                        targetId += '-' + parts[j];
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }
            // Pattern 2: IDs concatenated without separators (like in the actual HTML)
            else {
                console.log(`Hu: EvaTeam Workflow Enhancer: Debug - Processing concatenated overlayId: "${overlayId}"`);

                // Find all UUID patterns in the string
                const uuidRegex = /([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/g;
                const uuidMatches = [];
                let match;
                while ((match = uuidRegex.exec(overlayId)) !== null) {
                    uuidMatches.push(match[1]);
                }

                console.log(`Hu: EvaTeam Workflow Enhancer: Debug - Found UUIDs:`, uuidMatches);

                if (uuidMatches.length >= 2) {
                    // We have at least 2 UUIDs, now we need to figure out which prefixes belong to which UUIDs

                    // Find positions of each UUID in the overlayId
                    const uuidPositions = uuidMatches.map(uuid => ({
                        uuid: uuid,
                        index: overlayId.indexOf(uuid)
                    })).sort((a, b) => a.index - b.index);

                    console.log(`Hu: EvaTeam Workflow Enhancer: Debug - UUID positions:`, uuidPositions);

                    // For each UUID, find what comes before it
                    for (let i = 0; i < uuidPositions.length; i++) {
                        const uuidInfo = uuidPositions[i];
                        // Find the closest CmfStatus: or CmfTrans: before this UUID
                        let closestPrefix = '';
                        let closestPrefixIndex = -1;

                        // Look for CmfStatus: before this UUID
                        const statusIndex = overlayId.lastIndexOf('CmfStatus:', uuidInfo.index);
                        // Look for CmfTrans: before this UUID
                        const transIndex = overlayId.lastIndexOf('CmfTrans:', uuidInfo.index);

                        // Choose the closer one
                        if (statusIndex > transIndex) {
                            closestPrefix = 'CmfStatus:';
                            closestPrefixIndex = statusIndex;
                        } else if (transIndex > statusIndex) {
                            closestPrefix = 'CmfTrans:';
                            closestPrefixIndex = transIndex;
                        }

                        // If we found a prefix, extract the content between it and the UUID
                        if (closestPrefixIndex !== -1) {
                            const prefixContent = overlayId.substring(closestPrefixIndex + closestPrefix.length, uuidInfo.index);
                            const fullPrefix = closestPrefix + prefixContent;

                            console.log(`Hu: EvaTeam Workflow Enhancer: Debug - UUID ${i} (${uuidInfo.uuid}) has prefix: "${fullPrefix}"`);

                            // Check what type of ID this is
                            if (fullPrefix.includes('CmfTrans:')) {
                                // This is a source ID
                                if (!sourceId) {
                                    sourceId = fullPrefix + uuidInfo.uuid;
                                    console.log(`Hu: EvaTeam Workflow Enhancer: Debug - Set sourceId to: "${sourceId}"`);
                                }
                            } else if (fullPrefix.includes('CmfStatus:')) {
                                // This is a target ID
                                if (!targetId) {
                                    targetId = fullPrefix + uuidInfo.uuid;
                                    console.log(`Hu: EvaTeam Workflow Enhancer: Debug - Set targetId to: "${targetId}"`);
                                }
                            }
                        } else {
                            // No clear prefix, try to determine from context
                            console.log(`Hu: EvaTeam Workflow Enhancer: Debug - UUID ${i} (${uuidInfo.uuid}) has NO prefix found`);

                            if (!sourceId) {
                                // Assume it's a source ID if we don't have one yet
                                sourceId = 'CmfTrans:' + uuidInfo.uuid;
                                console.log(`Hu: EvaTeam Workflow Enhancer: Debug - Defaulted sourceId to: "${sourceId}"`);
                            } else if (!targetId) {
                                // Assume it's a target ID if we already have source
                                targetId = 'CmfStatus:' + uuidInfo.uuid;
                                console.log(`Hu: EvaTeam Workflow Enhancer: Debug - Defaulted targetId to: "${targetId}"`);
                            }
                        }

                        // Stop once we have both source and target
                        if (sourceId && targetId) {
                            break;
                        }
                    }
                } else if (uuidMatches.length === 1) {
                    // Only one UUID found - this is unusual but handle it
                    const uuid = uuidMatches[0];
                    const uuidIndex = overlayId.indexOf(uuid);
                    const beforeUuid = overlayId.substring(0, uuidIndex);
                    const afterUuid = overlayId.substring(uuidIndex + uuid.length);

                    console.log(`Hu: EvaTeam Workflow Enhancer: Debug - Single UUID case: before="${beforeUuid}", after="${afterUuid}"`);

                    if (beforeUuid.includes('CmfTrans:')) {
                        sourceId = beforeUuid + uuid;
                    } else if (beforeUuid.includes('CmfStatus:')) {
                        targetId = beforeUuid + uuid;
                    }

                    // If we still don't have both IDs, try to infer from the remaining text
                    if (!sourceId || !targetId) {
                        if (!sourceId) {
                            // Look for CmfTrans: pattern in the remaining text
                            const transMatch = afterUuid.match(/CmfTrans:([0-9a-fA-F]{8})/);
                            if (transMatch) {
                                sourceId = transMatch[0] + uuid;
                            }
                        }

                        if (!targetId) {
                            // Look for CmfStatus: pattern in the remaining text
                            const statusMatch = afterUuid.match(/CmfStatus:([0-9a-fA-F]{8})/);
                            if (statusMatch) {
                                targetId = statusMatch[0] + uuid;
                            }
                        }
                    }
                }

                console.log(`Hu: EvaTeam Workflow Enhancer: Debug - Final IDs - source: "${sourceId}", target: "${targetId}"`);
            }

            // Fix ID mapping - ensure both source and target IDs exist as nodes
            // If source is CmfTrans, try to find corresponding CmfStatus node
            let fixedSourceId = sourceId;
            let fixedTargetId = targetId;

            if (sourceId && sourceId.startsWith('CmfTrans:')) {
                // For CmfTrans source, we need to find the logical source status
                // Since CmfTrans elements are not actual nodes, we need to determine
                // which status this transition originates from based on UUID relationships
                const transUuid = sourceId.replace('CmfTrans:', '');

                // Strategy: Find the status with the most similar UUID (heuristic)
                // This works because in EvaTeam, related statuses often have similar UUIDs
                let bestMatch = null;
                let bestScore = Infinity;

                for (const node of nodes) {
                    if (node.id.startsWith('CmfStatus:')) {
                        const statusUuid = node.id.replace('CmfStatus:', '');

                        // Calculate similarity score between UUIDs
                        // Using first 8 characters for comparison (simpler heuristic)
                        const transPrefix = transUuid.substring(0, 8);
                        const statusPrefix = statusUuid.substring(0, 8);

                        // Convert hex to decimal for comparison
                        const transNum = parseInt(transPrefix, 16);
                        const statusNum = parseInt(statusPrefix, 16);

                        const score = Math.abs(transNum - statusNum);

                        // Only consider reasonable matches (not too far apart)
                        if (score < bestScore && score < 100000000) {
                            bestScore = score;
                            bestMatch = node.id;
                        }
                    }
                }

                // Fallback: use the first available status if no good match found
                if (!bestMatch) {
                    bestMatch = nodes.find(n => n.id.startsWith('CmfStatus:'))?.id;
                }

                fixedSourceId = bestMatch;
                console.log(`Hu: EvaTeam Workflow Enhancer: Debug - Mapped CmfTrans ${transUuid} to source status: ${bestMatch} (score: ${bestScore})`);
            }

            if (targetId && targetId.startsWith('CmfTrans:')) {
                // If target is CmfTrans, try to find corresponding CmfStatus node
                const uuid = targetId.replace('CmfTrans:', '');
                fixedTargetId = `CmfStatus:${uuid}`;
            }

            // Check if both fixed IDs exist in our nodes
            const nodeIds = nodes.map(n => n.id);
            const sourceExists = nodeIds.includes(fixedSourceId);
            const targetExists = nodeIds.includes(fixedTargetId);

            if (fixedSourceId && fixedTargetId && sourceExists && targetExists && fixedSourceId !== fixedTargetId) {
                const edgeId = `e-${fixedSourceId}-${fixedTargetId}-${label.replace(/\s/g, '_')}`;
                if (!uniqueEdgeIds.has(edgeId)) {
                    edges.push({
                        id: edgeId,
                        source: fixedSourceId,
                        target: fixedTargetId,
                        label: label,
                        type: 'smoothstep',
                        animated: false,
                        style: { strokeWidth: 2, stroke: '#666' },
                        labelStyle: { fill: '#333', fontWeight: 'bold' },
                        labelBgPadding: [8, 4],
                        labelBgBorderRadius: 4,
                        labelBgStyle: { fill: '#fff', color: '#333', fillOpacity: 0.9, stroke: '#ccc', strokeWidth: 1 },
                        markerEnd: {
                            type: 'arrowclosed',
                            width: 15,
                            height: 15,
                            color: '#666',
                            strokeWidth: 1
                        }
                    });
                    uniqueEdgeIds.add(edgeId);
                    console.log(`Hu: EvaTeam Workflow Enhancer: ✅ Created edge: ${fixedSourceId} -> ${fixedTargetId} with label: "${label}"`);
                } else {
                    console.log(`Hu: EvaTeam Workflow Enhancer: ⚠️ Edge already exists: ${edgeId}`);
                }
            } else {
                const reasons = [];
                if (!fixedSourceId) reasons.push('no source ID');
                if (!fixedTargetId) reasons.push('no target ID');
                if (!sourceExists) reasons.push(`source "${fixedSourceId}" doesn't exist`);
                if (!targetExists) reasons.push(`target "${fixedTargetId}" doesn't exist`);
                if (fixedSourceId === fixedTargetId) reasons.push('source equals target (self-loop)');

                console.log(`Hu: EvaTeam Workflow Enhancer: ❌ Cannot create edge - ${reasons.join(', ')}. Original: source="${sourceId}", target="${targetId}"`);
            }
        });

        console.log(`Hu: EvaTeam Workflow Enhancer: Edge elements processing finished. Starting final checks...`);
        console.log(`Hu: EvaTeam Workflow Enhancer: Parsing complete - Created ${nodes.length} nodes and ${edges.length} edges`);
        console.log(`Hu: EvaTeam Workflow Enhancer: Node IDs:`, nodes.map(n => n.id));
        console.log(`Hu: EvaTeam Workflow Enhancer: Edge connections:`, edges.map(e => `${e.source} -> ${e.target}`));

        // Debug: Check if node IDs match edge source/target IDs
        const nodeIds = nodes.map(n => n.id);
        const edgeConnections = edges.map(e => `${e.source} -> ${e.target}`);

        console.log(`Hu: EvaTeam Workflow Enhancer: Debug - Checking ID matching:`);
        console.log(`Hu: EvaTeam Workflow Enhancer: Debug - Available node IDs:`, nodeIds);
        edges.forEach((edge, index) => {
            const sourceExists = nodeIds.includes(edge.source);
            const targetExists = nodeIds.includes(edge.target);
            console.log(`Hu: EvaTeam Workflow Enhancer: Debug - Edge ${index}: ${edge.source} -> ${edge.target} | Source exists: ${sourceExists}, Target exists: ${targetExists}`);
        });

        // Debug: Check node positions
        console.log(`Hu: EvaTeam Workflow Enhancer: Debug - Node positions:`);
        nodes.forEach((node, index) => {
            console.log(`Hu: EvaTeam Workflow Enhancer: Debug - Node ${index}: ${node.id} at position (${node.position.x}, ${node.position.y})`);
        });

        // Final validation and cleanup
        const finalEdges = [];
        const validNodeIds = new Set(nodes.map(n => n.id));

        edges.forEach(edge => {
            if (validNodeIds.has(edge.source) && validNodeIds.has(edge.target)) {
                finalEdges.push(edge);
            } else {
                console.log(`Hu: EvaTeam Workflow Enhancer: ⚠️ Removing invalid edge: ${edge.source} -> ${edge.target}`);
            }
        });

        console.log(`Hu: EvaTeam Workflow Enhancer: Final validation - ${finalEdges.length} valid edges from ${edges.length} total`);

        return { nodes, edges: finalEdges };
    }

    /**
     * Function to render the ReactFlow component
     */
    renderReactFlowComponent(container, workflowData) {
        console.log('Hu: EvaTeam Workflow Enhancer: Rendering ReactFlow component...');

        // Determine which React Flow object is available
        const ReactFlow = window.reactflow || window.ReactFlow || window.REACT_FLOW;
        const React = window.React;
        const ReactDOM = window.ReactDOM;

        if (!ReactFlow) {
            console.error('Hu: EvaTeam Workflow Enhancer: ReactFlow library not found!');
            return;
        }

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
                attributionPosition: 'bottom-left',
                connectionMode: ReactFlow.ConnectionMode.Loose,
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
     * Generate HTML for the enhanced workflow view (for backward compatibility)
     */
    generateEnhancedWorkflowHTML(workflowData) {
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
