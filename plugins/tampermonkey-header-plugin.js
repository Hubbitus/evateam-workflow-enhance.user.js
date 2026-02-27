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
// @include      /^https://eva[-\\w]*\\.[^/]+/.*$/
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// ==/UserScript==
`;

          // Add the header to the beginning of the code
          if (chunk.type === 'chunk') {
            let code = tampermonkeyHeader + chunk.code;

            // Replace Svelte's style injection with GM_addStyle
            // Pattern: (function() { const style = document.createElement('style'); style.textContent = "CSS"; (document.head || document.documentElement).appendChild(style); })();
            const styleInjectionPattern = /\(function\(\)\s*\{\s*const style\s*=\s*document\.createElement\(['"]style['"]\);\s*style\.textContent\s*=\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*');\s*\(\s*document\.head\s*\|\|\s*document\.documentElement\s*\)\.appendChild\(style\);\s*\}\)\(\);/gs;

            code = code.replace(styleInjectionPattern, (match, cssContent) => {
              // Extract CSS from the string (removing quotes and escaping)
              const css = cssContent.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"');
              // Return GM_addStyle call with multiline CSS
              return `GM_addStyle(\`${css}\`);`;
            });

            chunk.code = code;
          }
        }
      }
    }
  };
}

module.exports = tampermonkeyHeaders;