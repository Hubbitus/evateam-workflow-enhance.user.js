<script>
  import {
    useEdges,
    getBezierPath,
    BaseEdge,
  } from '@xyflow/svelte';

  const {
    id,
    target,
    source,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    label,
    style,
    markerEnd,
    data,
  } = $props();

  const edges = useEdges();

  const isBidirectionalEdge = $derived(
    edges.current.some(
      (e) =>
        (e.source === target && e.target === source) ||
        (e.target === source && e.source === target),
    ),
  );

  function getSpecialPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  }, offset) {
    const centerX = (sourceX + targetX) / 2;
    const centerY = (sourceY + targetY) / 2;

    return `M ${sourceX} ${sourceY} Q ${centerX} ${centerY + offset} ${targetX} ${targetY}`;
  }

  const path = $derived.by(() => {
    const edgePathParams = {
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    };

    if (isBidirectionalEdge) {
      return getSpecialPath(edgePathParams, sourceX < targetX ? 25 : -25);
    } else {
      const [path] = getBezierPath(edgePathParams);
      return path;
    }
  });

  const labelMetrics = $derived.by(() => {
    if (!label) return { width: 100, x: (sourceX + targetX) / 2 - 50, y: (sourceY + targetY) / 2 - 12 };
    const width = Math.max(60, label.length * 7 + 16);
    const x = (sourceX + targetX) / 2 - width / 2;
    const y = (sourceY + targetY) / 2 - 12 + (data?.labelOffset || 0);
    // Добавляем запас под тень: +/- 20px по ширине и +/- 20px по высоте
    return { width: width + 20, x: x - 10, y: y - 10 };
  });
</script>

<g>
  <BaseEdge {id} {path} {style} {markerEnd} />

  {#if label}
    <foreignObject x={labelMetrics.x} y={labelMetrics.y} width={labelMetrics.width} height="50" style="pointer-events: none;">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          color: #456;
          white-space: nowrap;
          box-shadow: rgba(0, 0, 0, 0.20) 0px 3px 7px;
          pointer-events: auto;
          position: relative;
          z-index: 1;
          margin: 5px;
          ">
        {label}
      </div>
    </foreignObject>
  {/if}
</g>
