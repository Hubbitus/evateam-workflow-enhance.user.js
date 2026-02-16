<script>
  import { onMount, createEventDispatcher, tick } from 'svelte';

  export let originalWorkflowElement = null;
  export let currentView = 'enhanced';

  const dispatch = createEventDispatcher();
  let originalViewContainer; // This will be the div where we place the original element

  async function switchView(view) {
    if (!originalWorkflowElement) return;

    if (view === 'original') {
      // Move the original element into our view and make it visible
      originalViewContainer.appendChild(originalWorkflowElement);
      originalWorkflowElement.style.display = 'block';
      dispatch('switchView', { view: 'original' });
    } else {
      // Hide the original element. We don't need to move it back,
      // it can stay in our container, just hidden.
      originalWorkflowElement.style.display = 'none';
      dispatch('switchView', { view: 'enhanced' });
    }
  }
</script>

<div class="workflow-tabs-wrapper" style="display: flex; flex-direction: column; height: 100%; width: 100%;">
  <div class="workflow-tabs-container" style="display: flex; flex-shrink: 0;">
    <button 
      id="enhanced-workflow-tab"
      on:click={() => switchView('enhanced')}
      class:active={currentView === 'enhanced'}
      style="
        flex: 1;
        padding: 10px;
        border: 1px solid #ccc;
        border-bottom: none;
        border-radius: 4px 0 0 0;
        cursor: pointer;
        background-color: {currentView === 'enhanced' ? '#fff' : '#f0f0f0'};
        font-weight: {currentView === 'enhanced' ? 'bold' : 'normal'};
      "
    >
      Улучшенная схема
    </button>
    <button 
      id="original-workflow-tab"
      on:click={() => switchView('original')}
      class:active={currentView === 'original'}
      style="
        flex: 1;
        padding: 10px;
        border: 1px solid #ccc;
        border-left: none;
        border-bottom: none;
        border-radius: 0 4px 0 0;
        cursor: pointer;
        background-color: {currentView === 'original' ? '#fff' : '#f0f0f0'};
        font-weight: {currentView === 'original' ? 'bold' : 'normal'};
      "
    >
      Исходный workflow
    </button>
  </div>

  <div class="workflow-content-wrapper" style="flex-grow: 1; border: 1px solid #ccc; border-top: none; border-radius: 0 0 4px 4px; overflow: hidden; position: relative;">
    <!-- Container for the enhanced view (SvelteFlow) -->
    <div style="display: {currentView === 'enhanced' ? 'block' : 'none'}; width: 100%; height: 100%;">
      <slot />
    </div>

    <!-- Container for the original view (DOM element) -->
    <div bind:this={originalViewContainer} style="display: {currentView === 'original' ? 'block' : 'none'}; width: 100%; height: 100%; overflow: auto; background: #fff; padding: 10px;">
      <!-- originalWorkflowElement will be appended here -->
    </div>
  </div>
</div>
