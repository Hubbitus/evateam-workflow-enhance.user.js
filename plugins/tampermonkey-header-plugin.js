const tampermonkeyHeaderPlugin = () => {
  return {
    name: 'tampermonkey-header',
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (fileName.endsWith('.js')) {
          const chunk = bundle[fileName];
          if (chunk.type === 'chunk') {
            // Add Tampermonkey headers
            const tampermonkeyHeader = `// ==UserScript==
// @name         EvaTeam Workflow Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces the built-in process view in EvaTeam with an advanced visualization using SvelteFlow
// @author       Pavel Alexeev <Pahan@Hubbitus.info>
// @match        https://eva.gid.team/project/Task/*
// @grant        none
// ==/UserScript==

`;
            chunk.code = tampermonkeyHeader + chunk.code;
          }
        }
      }
    }
  };
};

module.exports = tampermonkeyHeaderPlugin;