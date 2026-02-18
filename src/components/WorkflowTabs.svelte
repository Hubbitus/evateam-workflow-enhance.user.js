<script>
  import { onMount, createEventDispatcher, tick } from 'svelte';

  export let originalWorkflowElement = null;
  export let currentView = 'enhanced';

  const dispatch = createEventDispatcher();
  let originalViewContainer; // This will be the div where we place the original element
  let closeButton;
  let dialogElement;

  onMount(() => {
    // Find the dialog element (parent of the workflow element)
    if (originalWorkflowElement) {
      // Go up to find the dialog container
      dialogElement = originalWorkflowElement.closest('.cdk-global-overlay-wrapper') ||
                     originalWorkflowElement.closest('.cdk-overlay-container') ||
                     originalWorkflowElement.closest('.mat-mdc-dialog-container') ||
                     originalWorkflowElement.parentElement;

      console.log('HuEvaFlowEnhancer: Dialog element found:', !!dialogElement);

      // Try to find the "Закрыть" button (cmf-button__basic)
      if (originalWorkflowElement) {
        const allButtons = originalWorkflowElement.querySelectorAll('button');
        console.log('HuEvaFlowEnhancer: All buttons in original workflow element:', allButtons.length);
        allButtons.forEach((btn, i) => {
          console.log(`HuEvaFlowEnhancer: Button ${i}:`, btn.className, btn.textContent.trim());
          // Check if this is the "Закрыть" button
          if (btn.textContent.trim() === 'Закрыть' || btn.classList.contains('cmf-button__basic')) {
            console.log('HuEvaFlowEnhancer: Found Закрыть button:', btn);
            closeButton = btn;
          }
        });
      }

      // Also try to find close button in the dialog
      if (!closeButton && dialogElement) {
        const allButtons = dialogElement.querySelectorAll('button');
        allButtons.forEach((btn) => {
          if (btn.textContent.trim() === 'Закрыть' || btn.classList.contains('cmf-button__basic')) {
            console.log('HuEvaFlowEnhancer: Found Закрыть button in dialog:', btn);
            closeButton = btn;
          }
        });
      }

      if (closeButton) {
        console.log('HuEvaFlowEnhancer: Using Закрыть button:', closeButton);
      } else {
        console.warn('HuEvaFlowEnhancer: Закрыть button not found');
      }
    }
  });

  function closeDialog() {
    console.log('HuEvaFlowEnhancer: Close button clicked, closeButton:', !!closeButton);

    // Try to find the "Закрыть" button again if not found
    if (!closeButton && originalWorkflowElement) {
      const allButtons = originalWorkflowElement.querySelectorAll('button');
      allButtons.forEach((btn) => {
        if (btn.textContent.trim() === 'Закрыть' || btn.classList.contains('cmf-button__basic')) {
          console.log('HuEvaFlowEnhancer: Found Закрыть button on click:', btn);
          closeButton = btn;
        }
      });
    }

    if (!closeButton && dialogElement) {
      const allButtons = dialogElement.querySelectorAll('button');
      allButtons.forEach((btn) => {
        if (btn.textContent.trim() === 'Закрыть' || btn.classList.contains('cmf-button__basic')) {
          console.log('HuEvaFlowEnhancer: Found Закрыть button in dialog on click:', btn);
          closeButton = btn;
        }
      });
    }

    if (closeButton) {
      // Try to click the "Закрыть" button with proper event dispatching
      try {
        console.log('HuEvaFlowEnhancer: Attempting to close dialog with Закрыть button...');

        // Method 1: Direct click
        closeButton.click();

        // Method 2: Dispatch click event
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        closeButton.dispatchEvent(clickEvent);

        // Method 3: Dispatch mousedown and mouseup
        const mousedownEvent = new MouseEvent('mousedown', { bubbles: true });
        const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
        closeButton.dispatchEvent(mousedownEvent);
        closeButton.dispatchEvent(mouseupEvent);

        // Method 4: Try to get the Angular event handler and call it
        if (closeButton._ngElementListeners) {
          console.log('HuEvaFlowEnhancer: Found Angular listeners');
        }

        console.log('HuEvaFlowEnhancer: Close button clicked successfully');
      } catch (e) {
        console.error('HuEvaFlowEnhancer: Error clicking close button:', e);
      }
    } else {
      console.warn('HuEvaFlowEnhancer: Закрыть button not found, cannot close dialog');
    }
  }

  async function switchView(view) {
    if (!originalWorkflowElement) return;

    if (view === 'original') {
      // Move the original element into our view and make it visible
      originalViewContainer.appendChild(originalWorkflowElement);
      originalWorkflowElement.style.display = 'block';
      originalWorkflowElement.style.height = '100%';
      originalWorkflowElement.style.width = '100%';
      // Also set height on the dialog content if it exists
      const dialogContent = originalWorkflowElement.querySelector('.cmf-dialog__content');
      if (dialogContent) {
        dialogContent.style.height = '100%';
        dialogContent.style.maxHeight = 'none';
      }
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
  <div class="workflow-tabs-container" style="display: flex; flex-shrink: 0; align-items: center;">
    <button 
      id="enhanced-workflow-tab"
      on:click={() => switchView('enhanced')}
      class:active={currentView === 'enhanced'}
      style="
        flex: 1;
        padding: 10px;
        border: 1px solid #ccc;
        border-bottom: none;
        border-radius: 4px 0 0 4px;
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
        border-radius: 0;
        cursor: pointer;
        background-color: {currentView === 'original' ? '#fff' : '#f0f0f0'};
        font-weight: {currentView === 'original' ? 'bold' : 'normal'};
      "
    >
      Исходный workflow
    </button>
    <button
      id="close-workflow-button"
      on:click={closeDialog}
      style="
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-left: none;
        border-bottom: none;
        border-radius: 0 4px 0 0;
        cursor: pointer;
        background-color: #f0f0f0;
        font-size: 18px;
        line-height: 1;
        min-width: 40px;
      "
      title="Закрыть"
    >
      ×
    </button>
  </div>

  <div class="workflow-content-wrapper" style="flex-grow: 1; border: 1px solid #ccc; border-top: none; border-radius: 0 0 4px 4px; overflow: hidden; position: relative;">
    <!-- Container for the enhanced view (SvelteFlow) -->
    <div style="display: {currentView === 'enhanced' ? 'block' : 'none'}; width: 100%; height: 100%;">
      <slot />
    </div>

    <!-- Container for the original view (DOM element) -->
    <div bind:this={originalViewContainer} style="display: {currentView === 'original' ? 'flex' : 'none'}; width: 100%; height: 100%; overflow: auto; background: #fff; padding: 0; flex-direction: column;">
      <!-- originalWorkflowElement will be appended here -->
    </div>
  </div>
</div>
