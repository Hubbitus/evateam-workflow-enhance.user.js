<script>
  import { SvelteFlow, Background } from '@xyflow/svelte';
  import WorkflowTabs from './WorkflowTabs.svelte';
  import ColoredNode from './ColoredNode.svelte';
  import FitViewOnLoad from './FitViewOnLoad.svelte';
  import { onMount } from 'svelte';

  import '@xyflow/svelte/dist/base.css';
  import '@xyflow/svelte/dist/style.css';

  // Props
  export let api = null;
  export let originalWorkflowElement = null;

  // State
  let currentView = 'enhanced';
  let workflowNodes = [];
  let workflowEdges = [];
  let flowKey = 0; // Key to force re-render
  let updateTimeout = null; // Debounce timer

  const nodeTypes = {
    colored: ColoredNode,
  };

  // Store original transitions for recalculation
  let originalTransitions = [];

  // Initialize when component mounts
  onMount(async () => {
    console.log('WorkflowApp mounted');

    // Load workflow data if available
    if (api) {
      try {
        // Extract workflow ID and load data
        const workflowId = 'CmfWorkflow:f3d3e174-cb06-11f0-9799-eeb7fce6ef9e'; // Mock ID
        const workflowData = await api.getCompleteWorkflowData(workflowId);

        // Prepare nodes and edges for SvelteFlow
        if (workflowData) {
          const { nodes, edges, transitions } = prepareSvelteFlowData(workflowData);
          workflowNodes = nodes;
          workflowEdges = edges;
          // Store transitions for dynamic recalculation
          window.workflowTransitions = transitions;
          console.log('Workflow data loaded, edges:', edges.length);
        }
      } catch (error) {
        console.error('Error loading workflow data:', error);
      }
    }
  });

  function prepareSvelteFlowData(data) {
    if (!data) return { nodes: [], edges: [], transitions: [] };

    const { workflow, statuses, transitions } = data;
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

      const isStartNode = status.name.toLowerCase().includes('старт') || status.code === 'start';

      const node = {
        id: status.id,
        type: 'colored',
        position,
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

    // Create edges with optimal handles based on node positions
    transitions.forEach(transition => {
      transition.status_from.forEach(fromStatus => {
        const sourceNode = nodes.find(n => n.id === fromStatus.id);
        const targetNode = nodes.find(n => n.id === transition.status_to.id);

        if (sourceNode && targetNode) {
          const { sourceHandleId, targetHandleId } = calculateOptimalHandles(sourceNode, targetNode);

          const edge = {
            id: `${fromStatus.id}-${transition.status_to.id}`,
            source: fromStatus.id,
            target: transition.status_to.id,
            sourceHandle: sourceHandleId,
            targetHandle: targetHandleId,
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
              color: '#456'
            }
          };

          edges.push(edge);
        }
      });
    });

    return { nodes, edges, transitions };
  }

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
    if (angleDeg >= -22.5 && angleDeg < 22.5) {
      // Target is to the right
      sourceHandleId = 'source-right';
      targetHandleId = 'target-left';
    } else if (angleDeg >= 22.5 && angleDeg < 67.5) {
      // Target is bottom-right
      sourceHandleId = 'source-right';
      targetHandleId = 'target-top';
    } else if (angleDeg >= 67.5 && angleDeg < 112.5) {
      // Target is below
      sourceHandleId = 'source-bottom';
      targetHandleId = 'target-top';
    } else if (angleDeg >= 112.5 && angleDeg < 157.5) {
      // Target is bottom-left
      sourceHandleId = 'source-left';
      targetHandleId = 'target-top';
    } else if (angleDeg >= 157.5 || angleDeg < -157.5) {
      // Target is to the left
      sourceHandleId = 'source-left';
      targetHandleId = 'target-right';
    } else if (angleDeg >= -157.5 && angleDeg < -112.5) {
      // Target is top-left
      sourceHandleId = 'source-left';
      targetHandleId = 'target-bottom';
    } else if (angleDeg >= -112.5 && angleDeg < -67.5) {
      // Target is above
      sourceHandleId = 'source-top';
      targetHandleId = 'target-bottom';
    } else {
      // Target is top-right
      sourceHandleId = 'source-right';
      targetHandleId = 'target-bottom';
    }

    return { sourceHandleId, targetHandleId };
  }

  /**
   * Update all edges with optimal handles based on current node positions
   * SvelteFlow automatically handles this when no explicit handles are specified
   */
  function updateEdgeHandles() {
    console.log('Node positions changed, SvelteFlow will automatically recalculate handles');
    // SvelteFlow automatically uses the optimal handles based on node positions
    // when sourceHandle/targetHandle are not specified
  }

  /**
   * Recalculate edge handles when nodes are moved
   */
  function recalculateEdgeHandles() {
    workflowEdges = workflowEdges.map(edge => {
      const sourceNode = workflowNodes.find(n => n.id === edge.source);
      const targetNode = workflowNodes.find(n => n.id === edge.target);

      if (sourceNode && targetNode) {
        const { sourceHandleId, targetHandleId } = calculateOptimalHandles(sourceNode, targetNode);
        return {
          ...edge,
          sourceHandle: sourceHandleId,
          targetHandle: targetHandleId
        };
      }

      return edge;
    });
  }

  /**
   * Handle node changes (drag, position update)
   */
  function handleNodesChange(changes) {
    console.log('Nodes changed:', changes);
    let needsRecalc = false;

    changes.forEach(change => {
      if (change.type === 'position') {
        const nodeIndex = workflowNodes.findIndex(n => n.id === change.id);
        if (nodeIndex !== -1) {
          workflowNodes[nodeIndex].position = { ...change.position };
          needsRecalc = true;
        }
      }
    });

    // Recalculate edge handles when nodes move
    if (needsRecalc) {
      recalculateEdgeHandles();
    }
  }

  function switchView(view) {
    currentView = view;
  }
</script>

<div class="workflow-app" style="width: 100%; height: 100%;">
  <WorkflowTabs
    originalWorkflowElement="{originalWorkflowElement}"
    currentView="{currentView}"
    on:switchView="{(e) => switchView(e.detail.view)}"
  >
    {#if workflowNodes.length > 0 && workflowEdges.length > 0}
      <SvelteFlow
        nodes="{workflowNodes}"
        edges="{workflowEdges}"
        nodeTypes="{nodeTypes}"
        on:nodeschange="{handleNodesChange}"
      >
        <Background />
        <FitViewOnLoad />
      </SvelteFlow>
    {:else}
      <p>Loading enhanced workflow...</p>
    {/if}
  </WorkflowTabs>
</div>