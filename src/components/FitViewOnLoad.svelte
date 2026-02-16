<script>
  import { onMount } from 'svelte';
  import { useSvelteFlow } from '@xyflow/svelte';

  const { fitView } = useSvelteFlow();

  onMount(() => {
    // Call fitView on the next tick to ensure nodes are rendered
    setTimeout(() => {
      console.log('FitViewOnLoad: Calling fitView()');
      fitView({ padding: 0.2, duration: 200 });
    }, 0);
  });
</script>
