// ==UserScript==
// @name         EvaTeam Workflow Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces the built-in process view in EvaTeam with an advanced visualization using SvelteFlow
// @author       Pavel Alexeev <Pahan@Hubbitus.info>
// @match        https://eva.gid.team/project/Task/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('HuEvaFlowEnhancer: Script started loading.');

    // Dynamically load the bundled script
    function loadBundle() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'data:text/javascript,' + encodeURIComponent(`
                // This would be replaced by the actual bundled code from Vite
                // The bundle would contain SvelteFlow and all dependencies
                
                // Placeholder for the actual bundled code
                console.log('SvelteFlow bundle loaded');
                
                // Initialize the enhancer after bundle is loaded
                if (typeof window.HuEvaFlowEnhancer !== 'undefined') {
                    const enhancer = new window.HuEvaFlowEnhancer();
                    enhancer.initialize();
                } else {
                    console.error('HuEvaFlowEnhancer not found in bundle');
                }
            `);
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Load the bundle and initialize
    loadBundle()
        .then(() => {
            console.log('Bundle loaded successfully');
        })
        .catch(error => {
            console.error('Error loading bundle:', error);
        });
})();