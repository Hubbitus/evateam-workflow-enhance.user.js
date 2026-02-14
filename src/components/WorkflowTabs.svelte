<script>
  import { onMount } from 'svelte';

  export let originalContent = '';
  export let onSwitchView;
  export let currentView = 'enhanced';

  let enhancedView;
  let originalView;
  let originalTab;
  let enhancedTab;

  onMount(() => {
    // Trigger the initial view rendering
    if (currentView === 'enhanced' && onSwitchView) {
      onSwitchView('enhanced');
    }
  });

  function switchToEnhanced() {
    if (onSwitchView) {
      onSwitchView('enhanced');
    }
  }

  function switchToOriginal() {
    if (onSwitchView) {
      onSwitchView('original');
    }
  }

  // Update active tab when currentView changes
  $: if (currentView === 'enhanced' && enhancedTab) {
    enhancedTab.style.backgroundColor = '#e0e0e0';
    enhancedTab.style.fontWeight = 'bold';
    if (originalTab) {
      originalTab.style.backgroundColor = '#f0f0f0';
      originalTab.style.fontWeight = 'normal';
    }
  }

  $: if (currentView === 'original' && originalTab) {
    originalTab.style.backgroundColor = '#e0e0e0';
    originalTab.style.fontWeight = 'bold';
    if (enhancedTab) {
      enhancedTab.style.backgroundColor = '#f0f0f0';
      enhancedTab.style.fontWeight = 'normal';
    }
  }
</script>

<div class="workflow-tabs-container" style="display: flex; margin-bottom: 10px;">
  <button 
    id="enhanced-workflow-tab"
    bind:this={enhancedTab}
    on:click={switchToEnhanced}
    style="
      flex: 1;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px 0 0 4px;
      cursor: pointer;
      background-color: {currentView === 'enhanced' ? '#e0e0e0' : '#f0f0f0'};
      font-weight: {currentView === 'enhanced' ? 'bold' : 'normal'};
    "
  >
    Улучшенная схема
  </button>
  <button 
    id="original-workflow-tab"
    bind:this={originalTab}
    on:click={switchToOriginal}
    style="
      flex: 1;
      padding: 10px;
      border: 1px solid #ccc;
      border-left: none;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      background-color: {currentView === 'original' ? '#e0e0e0' : '#f0f0f0'};
      font-weight: {currentView === 'original' ? 'bold' : 'normal'};
    "
  >
    Исходный workflow
  </button>
</div>

{#if currentView === 'original'}
  <div 
    id="original-workflow-view" 
    bind:this={originalView}
    style="
      display: block;
      width: 100%;
      height: calc(100% - 50px);
      overflow: auto;
    "
  >
    {@html originalContent}
  </div>
{:else}
  <div 
    id="enhanced-workflow-view" 
    bind:this={enhancedView}
    style="
      display: block;
      width: 100%;
      height: calc(100% - 50px);
    "
  >
    <!-- Enhanced workflow will be rendered here by the parent -->
  </div>
{/if}