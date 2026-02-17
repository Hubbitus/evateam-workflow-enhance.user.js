<script>
  let { description = '', position = { x: 0, y: 0 }, maxWidth = 300 } = $props();

  // Reactive styles for positioning
  const style = $derived(`top: ${position.y}px; left: ${position.x}px; max-width: ${maxWidth}px;`);
</script>

<div class="node-tooltip" style={style}>
  <p>{@html description}</p>
</div>

<style>
  .node-tooltip {
    position: absolute;
    background-color: rgb(45, 126, 136);
    color: white;
    padding: 10px 15px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    z-index: 1000;
    font-size: 13px;
    line-height: 1.5;
    pointer-events: none; /* Allows clicks to pass through to elements behind it if needed */
  }

  .node-tooltip p {
    margin: 0;
  }
</style>
