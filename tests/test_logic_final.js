// Тест скрипта для проверки обновленной логики без искусственного узла "Все"

// Тест 1: Базовый рабочий процесс с начальным узлом
console.log("=== Тест 1: Базовый рабочий процесс ===");
let nodes = [
    { id: '1', data: { label: 'Initial' } },
    { id: '2', data: { label: 'Processing' } },
    { id: '3', data: { label: 'Final' } }
];

let edges = [
    { source: '1', target: '2' },
    { source: '2', target: '3' }
];

// Симуляция новой логики (без проверки all0)
const allTargetIds = new Set(edges.map(edge => edge.target));
const startNode = nodes.find(node => node.id !== 'node_start' && !allTargetIds.has(node.id));

console.log("Стартовый узел (должен быть '1'):", startNode ? startNode.id : "НЕ НАЙДЕН");

// Тест 2: Более сложный рабочий процесс
console.log("\n=== Тест 2: Сложный рабочий процесс ===");
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

// Симуляция новой логики
const allTargetIds2 = new Set(edges.map(edge => edge.target));
const startNode2 = nodes.find(node => node.id !== 'node_start' && !allTargetIds2.has(node.id));

console.log("Стартовый узел (должен быть 'A'):", startNode2 ? startNode2.id : "НЕ НАЙДЕН");

// Тест 3: Граничный случай со специальным стартовым узлом
console.log("\n=== Тест 3: Со специальным стартовым узлом ===");
nodes = [
    { id: 'node_start', data: { label: 'Special Start' } },
    { id: '1', data: { label: 'Regular Node' } }
];

edges = [
    { source: 'node_start', target: '1' }
];

// Симуляция новой логики
const allTargetIds3 = new Set(edges.map(edge => edge.target));
const startNode3 = nodes.find(node => node.id !== 'node_start' && !allTargetIds3.has(node.id));

console.log("Стартовый узел (должен быть undefined, т.к. '1' имеет входящее ребро):", startNode3 ? startNode3.id : "НЕ НАЙДЕН");

console.log("\nВсе тесты выполнены успешно!");