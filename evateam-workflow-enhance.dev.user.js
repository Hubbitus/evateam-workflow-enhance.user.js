// ==UserScript==
// @name         EvaTeam Workflow Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds an 'Improve Schema' button to EvaTeam workflow dialogs with enhanced functionality
// @author       Pavel Alexeev (Pahan@Hubbitus.info)
// @match        https://eva.gid.team/project/Task/*
// @grant        none
// @require      https://unpkg.com/react@18/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
// @require      https://cdn.jsdelivr.net/npm/reactflow@11.11.4/dist/umd/index.min.js
// @require      http://localhost:3004/HuEvaFlowEnhancer.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Hu: EvaTeam Workflow Enhancer: Script started loading.');

    // Initialize the enhancer
    const enhancer = new HuEvaFlowEnhancer();
    enhancer.initialize();
})();

