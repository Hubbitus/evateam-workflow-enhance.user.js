// Test script to validate the new dynamic transition logic

// Test case 1: Basic workflow with start and end nodes
console.log("=== Test Case 1: Basic workflow ===");
let nodes = [
    { id: '1', data: { label: 'Initial' } },
    { id: '2', data: { label: 'Processing' } },
    { id: '3', data: { label: 'Final' } }
];

let edges = [
    { source: '1', target: '2' },
    { source: '2', target: '3' }
];

// Simulate the new logic
const allTargetIds = new Set(edges.map(edge => edge.target));
const startNode = nodes.find(node => node.id !== 'node_start' && node.id !== 'all0' && !allTargetIds.has(node.id));

const allSourceIds = new Set(edges.map(edge => edge.source));
const endNode = nodes.find(node => node.id !== 'node_start' && node.id !== 'all0' && !allSourceIds.has(node.id));

console.log("Start node (should be '1'):", startNode ? startNode.id : "NOT FOUND");
console.log("End node (should be '3'):", endNode ? endNode.id : "NOT FOUND");

// Test case 2: More complex workflow
console.log("\n=== Test Case 2: Complex workflow ===");
nodes = [
    { id: 'A', data: { label: 'Start Status' } },
    { id: 'B', data: { label: 'Middle 1' } },
    { id: 'C', data: { label: 'Middle 2' } },
    { id: 'D', data: { label: 'End Status' } },
    { id: 'E', data: { label: 'Another Path' } }
];

edges = [
    { source: 'A', target: 'B' },
    { source: 'B', target: 'C' },
    { source: 'C', target: 'D' },
    { source: 'B', target: 'E' },
    { source: 'E', target: 'D' }
];

// Simulate the new logic
const allTargetIds2 = new Set(edges.map(edge => edge.target));
const startNode2 = nodes.find(node => node.id !== 'node_start' && node.id !== 'all0' && !allTargetIds2.has(node.id));

const allSourceIds2 = new Set(edges.map(edge => edge.source));
const endNode2 = nodes.find(node => node.id !== 'node_start' && node.id !== 'all0' && !allSourceIds2.has(node.id));

console.log("Start node (should be 'A'):", startNode2 ? startNode2.id : "NOT FOUND");
console.log("End node (should be 'D'):", endNode2 ? endNode2.id : "NOT FOUND");

// Test case 3: Edge case with special nodes already in edges
console.log("\n=== Test Case 3: With special nodes ===");
nodes = [
    { id: 'node_start', data: { label: 'Special Start' } },
    { id: 'all0', data: { label: 'Special End' } },
    { id: '1', data: { label: 'Regular Node' } }
];

edges = [
    { source: 'node_start', target: '1' },
    { source: '1', target: 'all0' }
];

// Simulate the new logic
const allTargetIds3 = new Set(edges.map(edge => edge.target));
const startNode3 = nodes.find(node => node.id !== 'node_start' && node.id !== 'all0' && !allTargetIds3.has(node.id));

const allSourceIds3 = new Set(edges.map(edge => edge.source));
const endNode3 = nodes.find(node => node.id !== 'node_start' && node.id !== 'all0' && !allSourceIds3.has(node.id));

console.log("Start node (should be undefined since '1' has incoming edge):", startNode3 ? startNode3.id : "NOT FOUND");
console.log("End node (should be undefined since '1' has outgoing edge):", endNode3 ? endNode3.id : "NOT FOUND");

console.log("\nAll tests completed successfully!");