/**
 * Vite plugin to add Tampermonkey headers to the output
 * Version is generated from environment variable BUILD_VERSION (format: vYYYYMMDDHHmmss)
 */
function tampermonkeyHeaders() {
  return {
    name: 'tampermonkey-headers',
    generateBundle(options, bundle) {
      // Get version from environment variable or use default
      const version = process.env.BUILD_VERSION || '0.1.0';
      const repoUrl = 'https://github.com/Hubbitus/evateam-workflow-enhance.user.js';
      const rawUrl = 'https://raw.githubusercontent.com/Hubbitus/evateam-workflow-enhance.user.js/main/dist/evateam-workflow-enhance.user.js';

      // Process each JS file in the bundle
      for (const fileName in bundle) {
        if (fileName.endsWith('.js') && !fileName.includes('style')) {
          const chunk = bundle[fileName];

          // Tampermonkey headers
          const tampermonkeyHeader = `// ==UserScript==
// @name         EvaTeam Workflow Enhancer
// @namespace    http://tampermonkey.net/
// @version      ${version}
// @description  Replaces the built-in process view in EvaTeam with an advanced visualization using SvelteFlow
// @author       Pavel Alexeev <Pahan@Hubbitus.info>
// @homepageURL  ${repoUrl}
// @supportURL   ${repoUrl}/issues
// @updateURL    ${repoUrl}/releases/latest/download/evateam-workflow-enhance.user.js
// @downloadURL  ${repoUrl}/releases/latest/download/evateam-workflow-enhance.user.js
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