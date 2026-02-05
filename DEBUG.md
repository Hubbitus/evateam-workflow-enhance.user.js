# EvaTeam Workflow Enhancer Debugging Guide

This file contains useful commands and techniques for debugging and testing the EvaTeam Workflow Enhancer.

## Console Commands

### Clear all saved layouts
```javascript
Object.keys(localStorage).filter(key => key.startsWith('evateam_workflow_layout_')).forEach(key => localStorage.removeItem(key));
console.log('Hu: EvaTeam Workflow Enhancer: All saved layouts cleared');
```

### View all saved layouts
```javascript
Object.keys(localStorage).filter(key => key.startsWith('evateam_workflow_layout_')).forEach(key => {
    console.log(`Key: ${key}`);
    console.log(JSON.parse(localStorage.getItem(key)));
});
```

### Force recalculate current workflow layout
```javascript
localStorage.removeItem(`evateam_workflow_layout_${getWorkflowIdFromUrl()}`);
location.reload();
```

### Get current workflow information
```javascript
console.log('Workflow ID:', getWorkflowIdFromUrl());
console.log('Current nodes:', document.querySelectorAll('[id^="CmfStatus:"]').length);
console.log('Current edges:', document.querySelectorAll('[jtk-overlay-id]').length);
```

### Check loaded libraries
```javascript
console.log('React loaded:', typeof React !== 'undefined');
console.log('ReactFlow loaded:', typeof ReactFlow !== 'undefined');
console.log('React version:', React.version);
```

### Test auto-layout algorithm
```javascript
// Get current data
const currentNodes = Array.from(document.querySelectorAll('[id^="CmfStatus:"]')).map(el => ({
    id: el.id,
    text: el.textContent.trim(),
    position: { x: parseInt(el.style.left) || 0, y: parseInt(el.style.top) || 0 }
}));

// Test auto-layout
const testLayout = autoLayoutNodes(currentNodes, []);
console.log('Auto layout result:', testLayout);
```

## Performance Monitoring

### Measure parsing time
```javascript
const startTime = performance.now();
const parsed = parseOriginalWorkflow(document.querySelector('#workflow').innerHTML);
const endTime = performance.now();
console.log(`Parsing took ${endTime - startTime} milliseconds`);
console.log('Parsed nodes:', parsed.nodes.length);
console.log('Parsed edges:', parsed.edges.length);
```

### Monitor localStorage
```javascript
// Track localStorage changes
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    if (key.startsWith('evateam_workflow_layout_')) {
        console.log('Layout saved:', key, JSON.parse(value));
    }
    return originalSetItem.call(this, key, value);
};
```

## Error Handling Testing

### Simulate broken DOM
```javascript
// Save original content
const originalContent = document.querySelector('#workflow').innerHTML;

// Simulate error
document.querySelector('#workflow').innerHTML = '<div>Broken content</div>';
location.reload();

// Restore original
setTimeout(() => {
    document.querySelector('#workflow').innerHTML = originalContent;
}, 5000);
```

### Test without localStorage
```javascript
// Simulate localStorage unavailability
const originalLocalStorage = window.localStorage;
Object.defineProperty(window, 'localStorage', {
    value: null,
    writable: false
});

// Reload page for testing
location.reload();

// Restore localStorage (after test)
setTimeout(() => {
    Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true
    });
}, 3000);
```

## Useful Selectors

### Find workflow elements
```javascript
// All workflow nodes
const workflowNodes = document.querySelectorAll('[id^="CmfStatus:"]');

// All workflow connections
const workflowEdges = document.querySelectorAll('[jtk-overlay-id]');

// Workflow button
const workflowButton = document.querySelector('button[title*="Workflow"], button:contains("Workflow")');

// Workflow container
const workflowContainer = document.querySelector('#workflow, .workflow-container');
```

### Text search
```javascript
// Function to find elements by text
function findElementsByText(text) {
    const elements = [];
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    while (node = walker.nextNode()) {
        if (node.textContent.includes(text)) {
            elements.push(node.parentElement);
        }
    }
    return elements;
}

// Usage example
const workflowElements = findElementsByText('Workflow');
```

## React Profiling

### Track re-renders
```javascript
// Override React.createElement for debugging
const originalCreateElement = React.createElement;
React.createElement = function(type, props, ...children) {
    console.log('Creating element:', type, props?.id || props?.className);
    return originalCreateElement.call(this, type, props, ...children);
};
```

### Monitor component state
```javascript
// Add to WorkflowEnhancerApp for state monitoring
const [debugState, setDebugState] = React.useState({});

React.useEffect(() => {
    console.log('Component state changed:', { activeTab, nodes: nodes.length, edges: edges.length });
    setDebugState({ activeTab, nodesCount: nodes.length, edgesCount: edges.length });
}, [activeTab, nodes, edges]);
```

## Testing Different Workflows

### Create test data
```javascript
// Function to create simple workflow for testing
function createTestWorkflow() {
    const testHTML = `
        <div id="workflow">
            <div id="CmfStatus:test1" style="position: absolute; left: 100px; top: 50px; background: #e3f2fd;">
                <div>Test Status 1</div>
            </div>
            <div id="CmfStatus:test2" style="position: absolute; left: 300px; top: 150px; background: #f3e5f5;">
                <div>Test Status 2</div>
            </div>
            <div style="position: absolute; left: 200px; top: 100px; jtk-overlay-id="edge1" 
                 style="pointer-events: none; position: absolute;">
                <svg width="100" height="50">
                    <line x1="0" y1="25" x2="100" y2="25" stroke="#333" stroke-width="2" marker-end="url(#arrow)"/>
                </svg>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', testHTML);
    return testHTML;
}
```

## Testing Automation

### Bookmarklet for quick testing
```javascript
// Create a bookmark with this code for quick testing
javascript:(function(){
    console.clear();
    console.log('=== EvaTeam Workflow Enhancer Test ===');
    console.log('Workflow ID:', getWorkflowIdFromUrl());
    console.log('Nodes found:', document.querySelectorAll('[id^="CmfStatus:"]').length);
    console.log('Edges found:', document.querySelectorAll('[jtk-overlay-id]').length);
    console.log('React loaded:', typeof React !== 'undefined');
    console.log('ReactFlow loaded:', typeof ReactFlow !== 'undefined');
    console.log('LocalStorage available:', typeof Storage !== 'undefined');
    console.log('=====================================');
})();
```

## Common Issues

### 1. Libraries not loading
**Symptoms**: "React is not defined" in console
**Solution**: Check @require connection in script header

### 2. Incorrect DOM parsing
**Symptoms**: Nodes not displaying or displaying incorrectly
**Solution**: Check selectors `[id^="CmfStatus:"]` and `[jtk-overlay-id]`

### 3. localStorage unavailable
**Symptoms**: Positions not saved between sessions
**Solution**: Check incognito mode or privacy settings

### 4. Performance
**Symptoms**: Slow operation with large diagrams
**Solution**: Enable debouncing for auto-save

---

## Useful Links

- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Tampermonkey Documentation](https://www.tampermonkey.net/documentation.php)
- [ReactFlow Documentation](https://reactflow.dev/learn)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)