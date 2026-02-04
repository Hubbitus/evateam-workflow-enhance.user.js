# Руководство по отладке EvaTeam Workflow Enhancer

Этот файл содержит полезные команды и техники для отладки и тестирования EvaTeam Workflow Enhancer.

## Консольные команды

### Очистка всех сохраненных макетов
```javascript
Object.keys(localStorage).filter(key => key.startsWith('evateam_workflow_layout_')).forEach(key => localStorage.removeItem(key));
console.log('Hu: EvaTeam Workflow Enhancer: All saved layouts cleared');
```

### Просмотр всех сохраненных макетов
```javascript
Object.keys(localStorage).filter(key => key.startsWith('evateam_workflow_layout_')).forEach(key => {
    console.log(`Key: ${key}`);
    console.log(JSON.parse(localStorage.getItem(key)));
});
```

### Принудительное пересчитывание макета текущего workflow
```javascript
localStorage.removeItem(`evateam_workflow_layout_${getWorkflowIdFromUrl()}`);
location.reload();
```

### Получение информации о текущем workflow
```javascript
console.log('Workflow ID:', getWorkflowIdFromUrl());
console.log('Current nodes:', document.querySelectorAll('[id^="CmfStatus:"]').length);
console.log('Current edges:', document.querySelectorAll('[jtk-overlay-id]').length);
```

### Проверка загруженных библиотек
```javascript
console.log('React loaded:', typeof React !== 'undefined');
console.log('ReactFlow loaded:', typeof ReactFlow !== 'undefined');
console.log('React version:', React.version);
```

### Тестирование алгоритма авто-раскладки
```javascript
// Получить текущие данные
const currentNodes = Array.from(document.querySelectorAll('[id^="CmfStatus:"]')).map(el => ({
    id: el.id,
    text: el.textContent.trim(),
    position: { x: parseInt(el.style.left) || 0, y: parseInt(el.style.top) || 0 }
}));

// Протестировать авто-раскладку
const testLayout = autoLayoutNodes(currentNodes, []);
console.log('Auto layout result:', testLayout);
```

## Мониторинг производительности

### Измерение времени парсинга
```javascript
const startTime = performance.now();
const parsed = parseOriginalWorkflow(document.querySelector('#workflow').innerHTML);
const endTime = performance.now();
console.log(`Parsing took ${endTime - startTime} milliseconds`);
console.log('Parsed nodes:', parsed.nodes.length);
console.log('Parsed edges:', parsed.edges.length);
```

### Мониторинг localStorage
```javascript
// Отслеживание изменений в localStorage
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    if (key.startsWith('evateam_workflow_layout_')) {
        console.log('Layout saved:', key, JSON.parse(value));
    }
    return originalSetItem.call(this, key, value);
};
```

## Тестирование обработки ошибок

### Имитация поврежденного DOM
```javascript
// Сохранить оригинальный контент
const originalContent = document.querySelector('#workflow').innerHTML;

// Имитировать ошибку
document.querySelector('#workflow').innerHTML = '<div>Broken content</div>';
location.reload();

// Восстановить оригинал
setTimeout(() => {
    document.querySelector('#workflow').innerHTML = originalContent;
}, 5000);
```

### Тестирование без localStorage
```javascript
// Имитировать недоступность localStorage
const originalLocalStorage = window.localStorage;
Object.defineProperty(window, 'localStorage', {
    value: null,
    writable: false
});

// Перезагрузить страницу для тестирования
location.reload();

// Восстановить localStorage (после теста)
setTimeout(() => {
    Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true
    });
}, 3000);
```

## Полезные селекторы

### Поиск элементов workflow
```javascript
// Все узлы workflow
const workflowNodes = document.querySelectorAll('[id^="CmfStatus:"]');

// Все связи workflow
const workflowEdges = document.querySelectorAll('[jtk-overlay-id]');

// Кнопка Workflow
const workflowButton = document.querySelector('button[title*="Workflow"], button:contains("Workflow")');

// Контейнер workflow
const workflowContainer = document.querySelector('#workflow, .workflow-container');
```

### Поиск по тексту
```javascript
// Функция для поиска элементов по тексту
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

// Пример использования
const workflowElements = findElementsByText('Workflow');
```

## Профилирование React

### Отслеживание ре-рендеров
```javascript
// Переопределить React.createElement для отладки
const originalCreateElement = React.createElement;
React.createElement = function(type, props, ...children) {
    console.log('Creating element:', type, props?.id || props?.className);
    return originalCreateElement.call(this, type, props, ...children);
};
```

### Мониторинг состояния компонента
```javascript
// Добавить в WorkflowEnhancerApp для мониторинга состояния
const [debugState, setDebugState] = React.useState({});

React.useEffect(() => {
    console.log('Component state changed:', { activeTab, nodes: nodes.length, edges: edges.length });
    setDebugState({ activeTab, nodesCount: nodes.length, edgesCount: edges.length });
}, [activeTab, nodes, edges]);
```

## Тестирование на разных workflow

### Создание тестовых данных
```javascript
// Функция для создания простого workflow для тестирования
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

## Автоматизация тестирования

### Bookmarklet для быстрого тестирования
```javascript
// Создать закладку с этим кодом для быстрого тестирования
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

## Часто встречающиеся проблемы

### 1. Библиотеки не загружаются
**Симптомы**: "React is not defined" в консоли
**Решение**: Проверить подключение @require в заголовке скрипта

### 2. Неправильный парсинг DOM
**Симптомы**: Узлы не отображаются или отображаются некорректно
**Решение**: Проверить селекторы `[id^="CmfStatus:"]` и `[jtk-overlay-id]`

### 3. localStorage недоступен
**Симптомы**: Позиции не сохраняются между сессиями
**Решение**: Проверить режим инкогнито или настройки приватности

### 4. Производительность
**Симптомы**: Медленная работа с большими диаграммами
**Решение**: Включить debouncing для автосохранения

---

## Полезные ссылки

- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Tampermonkey Documentation](https://www.tampermonkey.net/documentation.php)
- [ReactFlow Documentation](https://reactflow.dev/learn)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)