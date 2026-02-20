<script>
  import { SvelteFlow, Background } from '@xyflow/svelte';
  import WorkflowTabs from './WorkflowTabs.svelte';
  import ColoredNode from './ColoredNode.svelte';
  import FitViewOnLoad from './FitViewOnLoad.svelte';
  import NodeTooltip from './NodeTooltip.svelte';
  import Modal from './Modal.svelte';
  import { onMount } from 'svelte';
  import dagre from 'dagre';
  import { localStorageManager } from '../utils.js';
  import { Logger } from '../logger.js';

  import '@xyflow/svelte/dist/base.css';
  import '@xyflow/svelte/dist/style.css';

  // Props - use $props() for Svelte 5 runes mode
  let { api = null, originalWorkflowElement = null } = $props();

  // State - use $state() for Svelte 5 reactivity
  let currentView = $state('enhanced');
  let workflowNodes = $state.raw([]);
  let workflowEdges = $state([]);
  let showTooltip = $state(false);
  let tooltipContent = $state('');
  let tooltipPosition = $state({ x: 0, y: 0 });
  let tooltipMaxWidth = $state(300);
  let tooltipNodeRef;
  let containerEl;
  let workflowData = $state(null);
  let showModal = $state(false);
  let modalTitle = $state('');
  let modalMessage = $state('');

  // Track last node positions to detect changes
  const lastPositions = new Map();

  const nodeTypes = {
    colored: ColoredNode,
  };

  // Store original transitions for recalculation
  let originalTransitions = [];

  function layoutNodesWithDagre(nodes, edges) {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 100 });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((node) => {
      g.setNode(node.id, { width: node.width, height: node.height });
    });

    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    return nodes.map((node) => {
      const nodeWithLayout = g.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithLayout.x - nodeWithLayout.width / 2,
          y: nodeWithLayout.y - nodeWithLayout.height / 2,
        },
      };
    });
  }

  function prepareSvelteFlowData(data, savedLayout = null) {
    if (!data) return { nodes: [], edges: [], transitions: [] };

    const { workflow, statuses, transitions } = data;
    let nodes = [];
    const edges = [];

    Logger.log('HuEvaFlowEnhancer: prepareSvelteFlowData - transitions:', transitions);

    statuses.forEach((status, index) => {
      const isStartNode = status.name.toLowerCase().includes('старт') || status.code === 'start';

      const node = {
        id: status.id,
        type: 'colored',
        position: { x: 0, y: 0 }, // Position will be set by dagre
        data: {
          label: status.name,
          description: status.text || '',
          color: status.color,
          statusType: status.status_type,
          isStart: isStartNode,
        },
        width: isStartNode ? 50 : 200,
        height: isStartNode ? 50 : 60,
      };

      nodes.push(node);
    });

    // Check if any transition has empty status_from (from "All" node)
    const hasAllTransitions = transitions.some(t => {
      const fromStatuses = Array.isArray(t.status_from) ? t.status_from : (t.status_from ? [t.status_from] : []);
      return fromStatuses.length === 0;
    });

    // Find start statuses (no incoming transitions within current workflow)
    const statusIds = statuses.map(s => s.id);
    const incomingTransitions = new Set();
    transitions.forEach(t => {
      const fromStatuses = Array.isArray(t.status_from) ? t.status_from : (t.status_from ? [t.status_from] : []);
      fromStatuses.forEach(fs => {
        if (fs && fs.id) {
          incomingTransitions.add(fs.id);
        }
      });
    });

    // Also track which statuses have incoming transitions to them
    const statusIdsWithIncoming = new Set();
    transitions.forEach(t => {
      if (t.status_to && t.status_to.id) {
        statusIdsWithIncoming.add(t.status_to.id);
      }
    });

    Logger.log('HuEvaFlowEnhancer: Status IDs:', statusIds);
    Logger.log('HuEvaFlowEnhancer: Status IDs with incoming transitions:', Array.from(statusIdsWithIncoming));

    // Start statuses are those that:
    // 1. Have no incoming transitions TO them (within current statuses)
    // 2. Are part of the current workflow's statuses
    const startStatuses = statuses.filter(s =>
      !statusIdsWithIncoming.has(s.id)
    );

    Logger.log('HuEvaFlowEnhancer: Start statuses:', startStatuses.map(s => s.name));

    // Create "Start" node if there are start statuses
    const hasStartNode = startStatuses.length > 0;
    if (hasStartNode) {
      nodes.push({
        id: 'start',
        type: 'colored',
        position: { x: 0, y: 0 },
        data: {
          label: 'Старт',
          description: 'Начало бизнес-процесса',
          color: '#445566',
          statusType: 'START',
          isStart: true,
        },
        width: 100,
        height: 100,
      });
    }

    // Create "All" node if needed
    if (hasAllTransitions) {
      nodes.push({
        id: 'all',
        type: 'colored',
        position: { x: 0, y: 0 },
        data: {
          label: 'Все',
          description: 'Переход возможен из любого статуса',
          color: '#ffffff',
          statusType: 'ALL',
          isStart: true,
        },
        width: 100,
        height: 100,
      });
    }

    // Create edges from "Start" node to start statuses
    if (hasStartNode) {
      startStatuses.forEach(status => {
        edges.push({
          id: `start-${status.id}`,
          source: 'start',
          target: status.id,
          type: 'default',
          label: '',
          animated: false,
          style: {
            stroke: '#445566',
            strokeWidth: 2
          },
          markerEnd: {
            type: 'arrowclosed',
            color: '#445566',
            width: 25,
            height: 25
          }
        });
      });
    }

    transitions.forEach(transition => {
      // Handle status_from as array or single object
      const fromStatuses = Array.isArray(transition.status_from)
        ? transition.status_from
        : transition.status_from ? [transition.status_from] : [];

      // If status_from is empty, use the "All" node
      if (fromStatuses.length === 0) {
        const sourceNode = nodes.find(n => n.id === 'all');
        const targetNode = nodes.find(n => n.id === transition.status_to.id);

        if (sourceNode && targetNode) {
          const edge = {
            id: `all-${transition.status_to.id}`,
            source: 'all',
            target: transition.status_to.id,
            type: 'default',
            label: transition.name.trim(),
            animated: false,
            style: {
              stroke: '#999999',
              strokeWidth: 2
            },
            labelStyle: {
              fill: '#999999',
              fontWeight: 600,
              fontSize: '12px'
            },
            markerEnd: {
              type: 'arrowclosed',
              color: '#999999',
              width: 25,
              height: 25
            }
          };

          edges.push(edge);
        }
      } else {
        fromStatuses.forEach(fromStatus => {
          // Skip if fromStatus is null or doesn't have an id
          if (!fromStatus || !fromStatus.id) return;

          const sourceNode = nodes.find(n => n.id === fromStatus.id);
          const targetNode = nodes.find(n => n.id === transition.status_to.id);

          if (sourceNode && targetNode) {
            const edge = {
              id: `${fromStatus.id}-${transition.status_to.id}`,
              source: fromStatus.id,
              target: transition.status_to.id,
              type: 'default',
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
                color: '#456',
                width: 25,
                height: 25
              }
            };

            edges.push(edge);
          }
        });
      }
    });

    if (savedLayout) {
      nodes.forEach((node) => {
        const savedNode = savedLayout.nodes.find((n) => n.id === node.id);
        if (savedNode) {
          node.position = savedNode.position;
        }
      });
    } else {
      nodes = layoutNodesWithDagre(nodes, edges);
    }

    edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);

        if (sourceNode && targetNode) {
          const { sourceHandleId, targetHandleId } = calculateOptimalHandles(sourceNode, targetNode);
          edge.sourceHandle = sourceHandleId;
          edge.targetHandle = targetHandleId;
        }
    });

    return { nodes, edges, transitions };
  }

  // Initialize when component mounts
  onMount(async () => {
    Logger.log('HuEvaFlowEnhancer: WorkflowApp mounted');

    // Load workflow data if available
    if (api) {
      try {
        // Extract workflow name from original dialog header
        let workflowName = null;
        if (originalWorkflowElement) {
          const titleElement = originalWorkflowElement.querySelector('.cmf-dialog__header .title');
          if (titleElement) {
            workflowName = titleElement.textContent.trim();
            // Remove "Бизнес-процесс: " prefix if present
            workflowName = workflowName.replace(/^Бизнес-процесс:\s*/, '');
            Logger.log('HuEvaFlowEnhancer: Extracted workflow name:', workflowName);
          }
        }

        if (api.config.useMock) {
          workflowData = await api.getCompleteWorkflowData(null);
          Logger.log('HuEvaFlowEnhancer: Using mock workflow data');
        } else if (workflowName) {
          workflowData = await api.getCompleteWorkflowDataByName(workflowName);
          Logger.log('HuEvaFlowEnhancer: Loaded workflow data by name:', workflowName);
        } else {
          throw new Error('Could not extract workflow name from dialog header');
        }

        // Prepare nodes and edges for SvelteFlow
        if (workflowData) {
          const workflowId = workflowData.workflow.id;
          const savedKey = localStorageManager._getKey(workflowId);
          const hasSavedData = localStorage.getItem(savedKey) !== null;

          // Check for hash mismatch before loading layout
          if (hasSavedData) {
            const savedLayout = localStorageManager.loadLayout(workflowId, workflowData);

            if (savedLayout) {
              // Hash matches, apply saved layout
              Logger.log('HuEvaFlowEnhancer: Applying saved layout', savedLayout);
              const { nodes, edges } = prepareSvelteFlowData(workflowData, savedLayout.layout);
              workflowNodes = nodes;
              workflowEdges = edges;
            } else {
              // Hash mismatch - apply auto layout AND show notification
              Logger.log('HuEvaFlowEnhancer: Hash mismatch detected');
              localStorageManager.clearLayout(workflowId);
              // Apply auto layout first so the UI is visible
              autoLayout();
              // Then show notification
              modalTitle = 'Процесс изменился';
              modalMessage =
                'Процесс изменился с момента сохранения раскладки. Расположение элементов было сброшено в автоматическое размещение.';
              showModal = true;
            }
          } else {
            // First time opening - apply auto layout
            Logger.log('HuEvaFlowEnhancer: First time opening, applying auto layout');
            autoLayout();
          }

          window.workflowTransitions = workflowData.transitions;
          Logger.log('HuEvaFlowEnhancer: Workflow data loaded, edges:', workflowEdges.length);
        }
      } catch (error) {
        Logger.error('HuEvaFlowEnhancer: Error loading workflow data:', error);
      }
    }
  });

  function autoLayout() {
    Logger.log('HuEvaFlowEnhancer: autoLayout called, workflowData:', !!workflowData);
    if (!workflowData) {
      Logger.error('HuEvaFlowEnhancer: autoLayout called but workflowData is null');
      return;
    }
    const { nodes, edges } = prepareSvelteFlowData(workflowData);
    workflowNodes = nodes;
    workflowEdges = edges;
    Logger.log('HuEvaFlowEnhancer: autoLayout applied, nodes:', nodes.length, 'edges:', edges.length);
  }

  function handleAutoLayout() {
    if (workflowData) {
      localStorageManager.clearLayout(workflowData.workflow.id);
      autoLayout();
    }
  }

  // Track last saved positions to avoid excessive localStorage writes
  let lastSavedPositions = $state({});

  // Save layout when node positions change
  $effect(() => {
    if (workflowData && workflowNodes.length > 0) {
      const currentPositions = JSON.stringify(
        workflowNodes.map((n) => ({ id: n.id, position: n.position }))
      );

      // Only save if positions changed
      if (currentPositions !== lastSavedPositions[workflowData.workflow.id]) {
        Logger.log('HuEvaFlowEnhancer: Node positions changed, saving layout');
        const layoutData = {
          nodes: workflowNodes.map((n) => ({ id: n.id, position: n.position })),
        };
        localStorageManager.saveLayout(workflowData.workflow.id, workflowData.workflow.name, workflowData, layoutData);
        lastSavedPositions[workflowData.workflow.id] = currentPositions;
      }
    }
  });

  /**
   * Calculate optimal handles for an edge based on node positions
   * This ensures the shortest possible path with minimal crossings
   */
  function calculateOptimalHandles(sourceNode, targetNode) {
    const sourceNodeWidth = sourceNode.width || 200;
    const sourceNodeHeight = sourceNode.height || 60;
    const targetNodeWidth = targetNode.width || 200;
    const targetNodeHeight = targetNode.height || 60;

    const sourceCenterX = sourceNode.position.x + sourceNodeWidth / 2;
    const sourceCenterY = sourceNode.position.y + sourceNodeHeight / 2;
    const targetCenterX = targetNode.position.x + targetNodeWidth / 2;
    const targetCenterY = targetNode.position.y + targetNodeHeight / 2;

    const deltaX = targetCenterX - sourceCenterX;
    const deltaY = targetCenterY - sourceCenterY;

    // Calculate the angle from source to target
    const angle = Math.atan2(deltaY, deltaX);
    const angleDeg = angle * (180 / Math.PI);

    // Determine handle positions based on angle quadrants
    let sourceHandleId, targetHandleId;

    // Quadrant-based handle selection for optimal routing
    if (angleDeg >= -45 && angleDeg < 45) {
      // Target is to the right
      sourceHandleId = 'source-right';
      targetHandleId = 'target-left';
    } else if (angleDeg >= 45 && angleDeg < 135) {
      // Target is below
      sourceHandleId = 'source-bottom';
      targetHandleId = 'target-top';
    } else if (angleDeg >= 135 || angleDeg < -135) {
      // Target is to the left
      sourceHandleId = 'source-left';
      targetHandleId = 'target-right';
    } else {
      // Target is above
      sourceHandleId = 'source-bottom';
      targetHandleId = 'target-top';
    }

    return { sourceHandleId, targetHandleId };
  }

  function handleNodeDrag(event) {
    const draggedNode = event.targetNode;

    const updatedEdges = workflowEdges.map(edge => {
      if (edge.source === draggedNode.id || edge.target === draggedNode.id) {
        const sourceNode = workflowNodes.find(n => n.id === edge.source);
        const targetNode = workflowNodes.find(n => n.id === edge.target);

        if (sourceNode && targetNode) {
          const { sourceHandleId, targetHandleId } = calculateOptimalHandles(sourceNode, targetNode);
          return { ...edge, sourceHandle: sourceHandleId, targetHandle: targetHandleId };
        }
      }
      return edge;
    });

    workflowEdges = updatedEdges;
  }

  function handleNodeClick(event) {
    Logger.log('HuEvaFlowEnhancer: handleNodeClick event:', event);
    const clickedNode = event.node;
    Logger.log('HuEvaFlowEnhancer: clickedNode:', clickedNode);
    if (clickedNode && clickedNode.data.description) {
      tooltipContent = clickedNode.data.description;

      const nodeRect = event.event.target.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();

      tooltipPosition = {
        x: nodeRect.right - containerRect.left,
        y: nodeRect.top - containerRect.top,
      };

      tooltipMaxWidth = containerEl.width - (nodeRect.right - containerRect.left) - 20; // 20px padding

      showTooltip = true;
      tooltipNodeRef = event.event.target;
    } else {
      Logger.log('HuEvaFlowEnhancer: No description for node', clickedNode?.id);
    }
  }

  $effect(() => {
    if (showTooltip) {
      const handleClickOutside = (event) => {
        // Check if click is outside the tooltip and not on the node that triggered it
        if (tooltipNodeRef && !tooltipNodeRef.contains(event.target)) {
          showTooltip = false;
        }
      };

      // Delay adding the listener to prevent the current click from immediately closing the tooltip
      const timer = setTimeout(() => {
        window.addEventListener('click', handleClickOutside, true);
      }, 0);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('click', handleClickOutside, true);
      };
    }
  });

  function switchView(view) {
    currentView = view;
  }
</script>

<div class="workflow-app" style="width: 100%; height: 100%; position: relative;" bind:this={containerEl}>
  <WorkflowTabs
    originalWorkflowElement={originalWorkflowElement}
    currentView={currentView}
    onSwitchView={switchView}
  >
    <div class="controls">
      <button onclick={handleAutoLayout}>Разместить автоматически</button>
    </div>
    {#if workflowNodes.length > 0 && workflowEdges.length > 0}
      <SvelteFlow
        bind:nodes={workflowNodes}
        edges={workflowEdges}
        nodeTypes={nodeTypes}
        onnodedrag={handleNodeDrag}
        onnodeclick={handleNodeClick}
        nodeDragThreshold={1}
      >
        <Background />
        <FitViewOnLoad />
      </SvelteFlow>
    {:else}
      <p>Loading enhanced workflow...</p>
    {/if}
  </WorkflowTabs>

  {#if showTooltip}
    <NodeTooltip description={tooltipContent} position={tooltipPosition} maxWidth={tooltipMaxWidth} />
  {/if}

  <Modal
    bind:showModal
    title={modalTitle}
    message={modalMessage}
  />
</div>

<style>
  .controls {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
  }
</style>
