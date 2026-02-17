<script>
  import { SvelteFlow, Background } from '@xyflow/svelte';
  import WorkflowTabs from './WorkflowTabs.svelte';
  import ColoredNode from './ColoredNode.svelte';
  import FitViewOnLoad from './FitViewOnLoad.svelte';
  import NodeTooltip from './NodeTooltip.svelte';
  import { onMount } from 'svelte';
  import dagre from 'dagre';

  import '@xyflow/svelte/dist/base.css';
  import '@xyflow/svelte/dist/style.css';

  // Props - use $props() for Svelte 5 runes mode
  let { api = null, originalWorkflowElement = null } = $props();

  // State - use $state() for Svelte 5 reactivity
  let currentView = $state('enhanced');
  let workflowNodes = $state.raw([]);
  let workflowEdges = $state.raw([]);
  let showTooltip = $state(false);
  let tooltipContent = $state('');
  let tooltipPosition = $state({ x: 0, y: 0 });
  let tooltipMaxWidth = $state(300);
  let tooltipNodeRef;
  let containerEl;

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

  function prepareSvelteFlowData(data) {
    if (!data) return { nodes: [], edges: [], transitions: [] };

    const { workflow, statuses, transitions } = data;
    let nodes = [];
    const edges = [];

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

    transitions.forEach(transition => {
      transition.status_from.forEach(fromStatus => {
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
    });

    nodes = layoutNodesWithDagre(nodes, edges);

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
    const clickedNode = event.node;
    if (clickedNode && clickedNode.data.description) {
      tooltipContent = clickedNode.data.description;
      
      const nodeRect = event.event.target.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();

      tooltipPosition = {
        x: nodeRect.right - containerRect.left,
        y: nodeRect.top - containerRect.top,
      };

      tooltipMaxWidth = containerRect.width - (nodeRect.right - containerRect.left) - 20; // 20px padding
      
      showTooltip = true;
      tooltipNodeRef = event.event.target;
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
    on:switchView={(e) => switchView(e.detail.view)}
  >
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
</div>
