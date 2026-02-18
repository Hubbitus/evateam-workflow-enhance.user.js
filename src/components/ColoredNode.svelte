<script>
  // Svelte 5: Use $props() for reactive props
  import { Handle } from '@xyflow/svelte';
  import { onMount } from 'svelte';

  let { data, selected, dragging, zIndex, width = 200, height = 60 } = $props();

  let nodeEl;

  // Log when component mounts
  onMount(() => {
    console.log('ColoredNode mounted:', {
      label: data?.label,
      statusType: data?.statusType,
      isStart: data?.isStart,
      width: width,
      height: height
    });

    // Force set dimensions for special nodes on the parent node element
    if (data?.statusType === 'ALL' || data?.statusType === 'START') {
      const size = 100;
      console.log('Setting special node size:', size);
      // Find parent node element (svelte-flow__node)
      let parentEl = nodeEl?.closest('.svelte-flow__node');
      if (parentEl) {
        parentEl.style.width = `${size}px`;
        parentEl.style.height = `${size}px`;
        parentEl.style.minWidth = `${size}px`;
        parentEl.style.minHeight = `${size}px`;
        console.log('Parent node element styled:', parentEl);
      } else {
        console.log('Parent node element not found');
      }
    }
  });

  // Derived reactive values from data
  const bgColor = $derived(data?.color || '#cccccc');
  const isDark = $derived(isDarkColor(bgColor));
  const textColor = $derived(isDark ? '#ffffff' : '#000000');
  const isSpecialNode = $derived(data?.statusType === 'ALL' || data?.statusType === 'START');
  const borderColor = $derived(data?.statusType === 'START' ? '#334455' : (data?.statusType === 'ALL' ? '#999999' : adjustColorLightness(bgColor, -20)));
  const isStart = $derived(data?.isStart || false);
  const isAllNode = $derived(data?.statusType === 'ALL');
  const isStartNode = $derived(data?.statusType === 'START');

  // Determine final dimensions
  const specialNodeSize = 70;
  const finalWidth = $derived(isSpecialNode ? specialNodeSize : width);
  const finalHeight = $derived(isSpecialNode ? specialNodeSize : height);
  const borderRadius = $derived(isSpecialNode ? '50%' : '6px');

  // Log dimensions for special nodes
  $effect(() => {
    if (isSpecialNode) {
      console.log('Special node dimensions:', {
        label: data?.label,
        statusType: data?.statusType,
        isSpecialNode,
        finalWidth,
        finalHeight,
        specialNodeSize
      });
    }
  });

  // Handle position helpers
  const handlePositionTop = { top: 0 };
  const handlePositionBottom = { bottom: 0 };
  const handlePositionLeft = { left: 0 };
  const handlePositionRight = { right: 0 };

  /**
   * Adjusts the lightness of a hex color.
   * @param {string} hex - The hex color string.
   * @param {number} percent - The percentage to adjust lightness by (positive for lighter, negative for darker).
   * @returns {string|null} The adjusted hex color or null if input is invalid.
   */
  function adjustColorLightness(hex, percent) {
    if (!hex) return '#000000'; // Return black as a fallback

    hex = hex.replace(/^#/, '');

    // Handle 3-digit hex
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }

    if (hex.length !== 6) {
      return '#000000'; // Return black for invalid hex
    }

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    const amount = Math.floor(255 * (percent / 100));

    r = Math.min(255, Math.max(0, r + amount));
    g = Math.min(255, Math.max(0, g + amount));
    b = Math.min(255, Math.max(0, b + amount));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // Helper function to determine if color is dark
  function isDarkColor(hex) {
    if (!hex) return true;
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return true;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  }
</script>

<div
  bind:this={nodeEl}
  class:is-special-node={isSpecialNode}
  style="
    background-color: {bgColor};
    color: {textColor};
    border: 3px solid {borderColor};
    border-radius: {borderRadius};
    padding: {isSpecialNode ? '0' : '8px 10px'};
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    overflow: hidden;
    box-sizing: border-box;
    outline: none !important;
    width: {finalWidth}px !important;
    height: {finalHeight}px !important;
    min-width: {isSpecialNode ? specialNodeSize + 'px !important' : '120px'};
    min-height: {isSpecialNode ? specialNodeSize + 'px !important' : '40px'};
    position: relative;
    background-clip: padding-box;
  "
>
  {#if !isSpecialNode}
    <span style="pointer-events: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{data.label}</span>
  {:else}
    <span style="pointer-events: none; font-size: 13px;">{data.label}</span>
  {/if}

  {#if data.description}
    <div class="description-indicator">?</div>
  {/if}

  <!-- Target handles - receives incoming edges -->
  <Handle type="target" position="top" id="target-top" />
  <Handle type="target" position="left" id="target-left" />
  <Handle type="target" position="right" id="target-right" />

  <!-- Source handles - connects outgoing edges -->
  <Handle type="source" position="bottom" id="source-bottom" />
  <Handle type="source" position="left" id="source-left" />
  <Handle type="source" position="right" id="source-right" />
</div>

<style>
.description-indicator {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 16px;
  height: 16px;
  background-color: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 0 2px white;
  z-index: 10;
}

:global(.svelte-flow__node.is-special-node) {
  width: 100px !important;
  height: 100px !important;
  min-width: 100px !important;
  min-height: 100px !important;
}
</style>
