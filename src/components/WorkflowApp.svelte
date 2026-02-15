<script>
  import WorkflowTabs from './components/WorkflowTabs.svelte';
  import { onMount } from 'svelte';

  // Props
  export let workflowData = null;
  export let api = null;
  export let originalWorkflowElement = null;
  export let storedWorkflowHTML = null;

  // State
  let currentView = 'enhanced';
  let originalContent = '';
  let workflowNodes = [];
  let workflowEdges = [];

  // Initialize when component mounts
  onMount(async () => {
    console.log('WorkflowApp mounted');
    
    // Prepare original content with styles
    if (originalWorkflowElement && storedWorkflowHTML) {
      let styles = '';
      const parser = new DOMParser();
      const doc = parser.parseFromString(storedWorkflowHTML, 'text/html');
      const originalStyles = doc.querySelectorAll('style');
      for (const style of originalStyles) {
        styles += `<style>${style.textContent}</style>`;
      }
      originalContent = styles + originalWorkflowElement.outerHTML;
    }
    
    // Load workflow data if available
    if (api && !workflowData) {
      try {
        // Extract workflow ID and load data
        // This is simplified - in practice, you'd extract the ID from the page
        const workflowId = 'CmfWorkflow:f3d3e174-cb06-11f0-9799-eeb7fce6ef9e'; // Mock ID
        workflowData = await api.getCompleteWorkflowData(workflowId);
        
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

      const bgColor = hexToRgbA(status.color, 0.15) || '#ffffff';
      const borderColor = adjustColorLightness(status.color, -20) || '#000000';
      const textColor = adjustColorLightness(status.color, -80) || '#000000';

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

    return { nodes, edges };
  }

  function hexToRgbA(hex, alpha = 1) {
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

  function adjustColorLightness(hex, percent) {
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

  function switchView(view) {
    currentView = view;
  }
</script>

<div class="workflow-app" style="width: 100%; height: 100%;">
  <WorkflowTabs
    originalContent="{originalContent}"
    currentView="{currentView}"
    on:switchView="{(e) => switchView(e.detail.view)}"
  >
    {#if workflowNodes.length > 0 && workflowEdges.length > 0}
      <!-- SvelteFlow would be initialized here -->
      <p>Enhanced workflow view with {workflowNodes.length} nodes and {workflowEdges.length} edges</p>
    {:else}
      <p>Loading enhanced workflow...</p>
    {/if}
  </WorkflowTabs>
</div>