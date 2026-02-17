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

  const nodeTypes = {
    colored: ColoredNode,
  };

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
          const { nodes, edges } = prepareSvelteFlowData(workflowData);
          workflowNodes = nodes;
          workflowEdges = edges;
        }
      } catch (error) {
        console.error('Error loading workflow data:', error);
      }
    }
  });

  function prepareSvelteFlowData(data) {
    if (!data) return { nodes: [], edges: [] };

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
        width: isStartNode ? 50 : 200, // Default width from ColoredNode.svelte
        height: isStartNode ? 50 : 60, // Default height from ColoredNode.svelte

      };

      nodes.push(node);
    });

    transitions.forEach(transition => {
      transition.status_from.forEach(fromStatus => {
        const sourceNode = nodes.find(n => n.id === fromStatus.id);
        const targetNode = nodes.find(n => n.id === transition.status_to.id);

        let sourceHandleId = 'bottom-source';
        let targetHandleId = 'top-target';

        if (sourceNode && targetNode) {
          // Определяем центр узла, чтобы точнее рассчитать относительное положение
          const sourceNodeWidth = sourceNode.width || 200; // Default to 200 if undefined
          const sourceNodeHeight = sourceNode.height || 60; // Default to 60 if undefined
          const targetNodeWidth = targetNode.width || 200; // Default to 200 if undefined
          const targetNodeHeight = targetNode.height || 60; // Default to 60 if undefined

          const sourceCenterX = sourceNode.position.x + sourceNodeWidth / 2;
          const sourceCenterY = sourceNode.position.y + sourceNodeHeight / 2;
          const targetCenterX = targetNode.position.x + targetNodeWidth / 2;
          const targetCenterY = targetNode.position.y + targetNodeHeight / 2;

          const deltaX = targetCenterX - sourceCenterX;
          const deltaY = targetCenterY - sourceCenterY;

          // Используем пороги для определения основной ориентации
          // Приоритет отдаем горизонтальному, если разница по X значительна
          if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) { // если горизонтальное смещение значительно больше вертикального
            if (deltaX > 0) { // Целевой узел справа
              sourceHandleId = 'right-source';
              targetHandleId = 'left-target';
            } else { // Целевой узел слева
              sourceHandleId = 'left-source';
              targetHandleId = 'right-target';
            }
          } else { // Если вертикальное смещение больше или примерно равно горизонтальному
            if (deltaY > 0) { // Целевой узел снизу
              sourceHandleId = 'bottom-source';
              targetHandleId = 'top-target';
            } else { // Целевой узел сверху (в этом случае source будет снизу, а target сверху)
              // Это случай, когда target находится над source.
              // source (исходящий) не может быть сверху.
              sourceHandleId = 'bottom-source';
              targetHandleId = 'top-target';
            }
          }
        }

        const edge = {
          id: `${fromStatus.id}-${transition.status_to.id}`,
          source: fromStatus.id,
          sourceHandle: sourceHandleId, // Добавляем sourceHandle
          target: transition.status_to.id,
          targetHandle: targetHandleId, // Добавляем targetHandle
          type: 'bezier',
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

    return { nodes, edges };
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
      <SvelteFlow nodes="{workflowNodes}" edges="{workflowEdges}" nodeTypes="{nodeTypes}">
        <Background />
        <FitViewOnLoad />
      </SvelteFlow>
    {:else}
      <p>Loading enhanced workflow...</p>
    {/if}
  </WorkflowTabs>
</div>