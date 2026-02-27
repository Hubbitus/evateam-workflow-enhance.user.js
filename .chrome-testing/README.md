# MCP testing in real browser

By https://cmd8.dev/blog/chrome-dev-tools-extension-debugging/

## Long story and problem
Initially I have setup for the MCP:
```json
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--executable-path",
        "/usr/bin/chromium-browser"
      ]
    }
  }
```

That does **not** work because there run separate browser session with isolated clean profile.
So, we have no extension like `Tampermonkey`.
The problem is even worse, it can't be installed or enabled starting from version 142 (switch `--load-extension` [dropped](https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/698#issuecomment-3718054500))

There are present issues for that:
1. [Add a flag for loading extensions#265](https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/265). Closed as duplicate of [Add a flag for loading extensions#265](https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/265), but has description of workaround in comment.
2. [Feature Request: Support for browser extension development and debugging#96](https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/96) - still opened.


## Solution
We use aforementioned workaround, detailed described in the post [Debugging Chrome Extensions with chrome-devtools-mcp](https://cmd8.dev/blog/chrome-dev-tools-extension-debugging/) and we have there 2 options:
1. Use `chromium-browser` - preferred.
2. Or install local build of `Google Chrome for Testing`. In script commented and also worked.

I've wrote all steps into file: `prepare-env.sh` - just run it, and then configure MCP like (e.g. in `.qwen/settings.json`):

```json
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--executable-path",
        "/usr/bin/chromium-browser"
      ]
    }
  }
```
