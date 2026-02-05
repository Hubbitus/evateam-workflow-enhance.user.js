// Тест скрипта для проверки логики вычисления позиций соединений

function calculateOptimalConnection(sourceNode, targetNode) {
    let sourcePosition = 'bottom'; // Default for start node
    let targetPosition = 'top';    // Default for target node
    
    if (sourceNode && targetNode) {
        // Calculate centers of both nodes
        const sourceCenterX = sourceNode.position.x + (sourceNode.width || 60) / 2;
        const sourceCenterY = sourceNode.position.y + (sourceNode.height || 60) / 2;
        
        const targetCenterX = targetNode.position.x + (targetNode.width || 120) / 2;
        const targetCenterY = targetNode.position.y + (targetNode.height || 60) / 2;
        
        console.log(`Source center: (${sourceCenterX}, ${sourceCenterY})`);
        console.log(`Target center: (${targetCenterX}, ${targetCenterY})`);
        
        // Determine optimal source position based on target location
        if (targetCenterY > sourceCenterY + (sourceNode.height || 60) / 2) {
            // Target is below source - use bottom handle
            sourcePosition = 'bottom';
            targetPosition = 'top';
        } else if (targetCenterY < sourceCenterY - (sourceNode.height || 60) / 2) {
            // Target is above source - use top handle
            sourcePosition = 'top';
            targetPosition = 'bottom';
        } else if (targetCenterX > sourceCenterX) {
            // Target is to the right of source - use right handle
            sourcePosition = 'right';
            targetPosition = 'left';
        } else {
            // Target is to the left of source - use left handle
            sourcePosition = 'left';
            targetPosition = 'right';
        }
    }
    
    return { sourcePosition, targetPosition };
}

// Тест 1: Целевой узел находится справа от стартового
console.log("=== Тест 1: Цель справа ===");
const sourceNode1 = { position: { x: 100, y: 100 }, width: 60, height: 60 };
const targetNode1 = { position: { x: 300, y: 100 }, width: 120, height: 60 };

const result1 = calculateOptimalConnection(sourceNode1, targetNode1);
console.log("Результат:", result1); // Ожидаем: right -> left

// Тест 2: Целевой узел находится слева от стартового
console.log("\n=== Тест 2: Цель слева ===");
const sourceNode2 = { position: { x: 300, y: 100 }, width: 60, height: 60 };
const targetNode2 = { position: { x: 100, y: 100 }, width: 120, height: 60 };

const result2 = calculateOptimalConnection(sourceNode2, targetNode2);
console.log("Результат:", result2); // Ожидаем: left -> right

// Тест 3: Целевой узел находится ниже стартового
console.log("\n=== Тест 3: Цель снизу ===");
const sourceNode3 = { position: { x: 200, y: 100 }, width: 60, height: 60 };
const targetNode3 = { position: { x: 200, y: 300 }, width: 120, height: 60 };

const result3 = calculateOptimalConnection(sourceNode3, targetNode3);
console.log("Результат:", result3); // Ожидаем: bottom -> top

// Тест 4: Целевой узел находится выше стартового
console.log("\n=== Тест 4: Цель сверху ===");
const sourceNode4 = { position: { x: 200, y: 300 }, width: 60, height: 60 };
const targetNode4 = { position: { x: 200, y: 100 }, width: 120, height: 60 };

const result4 = calculateOptimalConnection(sourceNode4, targetNode4);
console.log("Результат:", result4); // Ожидаем: top -> bottom

console.log("\nВсе тесты выполнены!");