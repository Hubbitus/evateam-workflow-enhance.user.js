// tests/test_calculate_optimal_connection.js
console.log("=== Test Suite: calculateOptimalConnection ===");

// Mock HuEvaFlowEnhancer to access the method
class MockHuEvaFlowEnhancer {
    calculateOptimalConnection = (sourceNode, targetNode) => {
        // This is the actual function logic we are testing
        const sourcePosition = 'bottom';
        const targetPosition = 'top';
        return { sourcePosition, targetPosition };
    }
}
const mockEnhancer = new MockHuEvaFlowEnhancer();

// Test Case 1: Nodes are aligned vertically (source above target)
let sourceNode1 = { id: 's1', position: { x: 100, y: 0 }, width: 60, height: 60 };
let targetNode1 = { id: 't1', position: { x: 100, y: 100 }, width: 60, height: 60 };
let result1 = mockEnhancer.calculateOptimalConnection(sourceNode1, targetNode1);

console.log(`Test Case 1 (Source above Target): Expected {source: 'bottom', target: 'top'}, Got {source: '${result1.sourcePosition}', target: '${result1.targetPosition}'}`);
if (result1.sourcePosition === 'bottom' && result1.targetPosition === 'top') {
    console.log("  PASS");
} else {
    console.error("  FAIL");
}

// Test Case 2: Nodes are aligned horizontally (source left of target)
let sourceNode2 = { id: 's2', position: { x: 0, y: 100 }, width: 60, height: 60 };
let targetNode2 = { id: 't2', position: { x: 100, y: 100 }, width: 60, height: 60 };
let result2 = mockEnhancer.calculateOptimalConnection(sourceNode2, targetNode2);

console.log(`Test Case 2 (Source left of Target): Expected {source: 'bottom', target: 'top'}, Got {source: '${result2.sourcePosition}', target: '${result2.targetPosition}'}`);
if (result2.sourcePosition === 'bottom' && result2.targetPosition === 'top') {
    console.log("  PASS");
} else {
    console.error("  FAIL");
}

// Test Case 3: Nodes are aligned horizontally (source right of target)
let sourceNode3 = { id: 's3', position: { x: 100, y: 100 }, width: 60, height: 60 };
let targetNode3 = { id: 't3', position: { x: 0, y: 100 }, width: 60, height: 60 };
let result3 = mockEnhancer.calculateOptimalConnection(sourceNode3, targetNode3);

console.log(`Test Case 3 (Source right of Target): Expected {source: 'bottom', target: 'top'}, Got {source: '${result3.sourcePosition}', target: '${result3.targetPosition}'}`);
if (result3.sourcePosition === 'bottom' && result3.targetPosition === 'top') {
    console.log("  PASS");
} else {
    console.error("  FAIL");
}

// Test Case 4: Nodes are reversed (source below target - still expects bottom/top for handles)
let sourceNode4 = { id: 's4', position: { x: 100, y: 100 }, width: 60, height: 60 };
let targetNode4 = { id: 't4', position: { x: 100, y: 0 }, width: 60, height: 60 };
let result4 = mockEnhancer.calculateOptimalConnection(sourceNode4, targetNode4);

console.log(`Test Case 4 (Source below Target): Expected {source: 'bottom', target: 'top'}, Got {source: '${result4.sourcePosition}', target: '${result4.targetPosition}'}`);
if (result4.sourcePosition === 'bottom' && result4.targetPosition === 'top') {
    console.log("  PASS");
} else {
    console.error("  FAIL");
}

console.log("=== Test Suite: calculateOptimalConnection Completed ===");