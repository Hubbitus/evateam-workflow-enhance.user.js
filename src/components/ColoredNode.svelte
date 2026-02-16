<script>
  // Svelte 5: Use $props() for reactive props
  import { Handle } from '@xyflow/svelte';

  let { data, selected, dragging, zIndex, width = 200, height = 60 } = $props();

  // Derived reactive values from data
  const bgColor = $derived(data?.color || '#cccccc');
  const isDark = $derived(isDarkColor(bgColor));
  const textColor = $derived(isDark ? '#ffffff' : '#000000');
  const borderColor = $derived(isDark ? '#ffffff' : '#000000');
  const isStart = $derived(data?.isStart || false);

  // Determine final dimensions
  const finalWidth = $derived(isStart ? 50 : width);
  const finalHeight = $derived(isStart ? 50 : height);
  const borderRadius = $derived(isStart ? '50%' : '6px');

  // Handle position helpers
  const handlePositionTop = { top: 0 };
  const handlePositionBottom = { bottom: 0 };
  const handlePositionLeft = { left: 0 };
  const handlePositionRight = { right: 0 };

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
  style="
    background-color: {bgColor};
    color: {textColor};
    border: 3px solid {borderColor};
    border-radius: {borderRadius};
    padding: {isStart ? '0' : '8px 10px'};
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
    width: {finalWidth}px;
    height: {finalHeight}px;
    min-width: {isStart ? '50px' : '120px'};
    min-height: {isStart ? '50px' : '40px'};
    position: relative;
    background-clip: padding-box;
  "
>
  {#if !isStart}
    <span style="pointer-events: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{data.label}</span>
  {:else}
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="pointer-events: none;">
      <circle cx="12" cy="12" r="10" />
    </svg>
  {/if}

  <!-- Target handle (top) - receives incoming edges -->
  <Handle
    type="target"
    position="top"
    id="target"
    style="
      width: 10px;
      height: 10px;
      background: {isDark ? '#fff' : '#000'};
      border: 2px solid {bgColor};
      border-radius: 50%;
    "
  />

  <!-- Source handle (bottom) - connects outgoing edges -->
  <Handle
    type="source"
    position="bottom"
    id="source"
    style="
      width: 10px;
      height: 10px;
      background: {isDark ? '#fff' : '#000'};
      border: 2px solid {bgColor};
      border-radius: 50%;
    "
  />
</div>
