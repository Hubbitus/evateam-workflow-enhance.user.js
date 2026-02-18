/**
 * Vite plugin to add Tampermonkey headers to the output
 */
function tampermonkeyHeaders() {
  return {
    name: 'tampermonkey-headers',
    generateBundle(options, bundle) {
      // Process each JS file in the bundle
      for (const fileName in bundle) {
        if (fileName.endsWith('.js') && !fileName.includes('style')) {
          const chunk = bundle[fileName];
          
          // Tampermonkey headers
          const tampermonkeyHeader = `// ==UserScript==
// @name         EvaTeam Workflow Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces the built-in process view in EvaTeam with an advanced visualization using SvelteFlow
// @author       Pavel Alexeev <Pahan@Hubbitus.info>
// @match        https://eva.gid.team/project/Task/*
// @match        https://eva.gid.team/desk/Task/*
// @grant        none
// ==/UserScript==

`;
          
          // Add the header to the beginning of the code
          if (chunk.type === 'chunk') {
            chunk.code = tampermonkeyHeader + chunk.code;
          }
        }
      }
    }
  };
}

module.exports = tampermonkeyHeaders;