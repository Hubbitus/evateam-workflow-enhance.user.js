<script>
  import { onMount } from 'svelte';
  import { useSvelteFlow } from '@xyflow/svelte';
  import { Logger } from '../logger.js';

  const { fitView } = useSvelteFlow();

  onMount(() => {
    // Call fitView on the next tick to ensure nodes are rendered
    setTimeout(() => {
      Logger.log('HuEvaFlowEnhancer: FitViewOnLoad calling fitView()');
      fitView({ padding: 0.2, duration: 200 });
    }, 0);
  });
</script>
