await fetch("https://eva.gid.team/api/?m=CmfStatus.list", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/json",
        "Sec-GPC": "1",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
    },
    "referrer": "https://eva.gid.team/desk/Task/DQ-7",
    "body": "{\"jsonrpc\":\"2.2\",\"callid\":\"cd12ffe0-1682-4c5f-a76c-a0c325572108\",\"jsver\":null,\"jsurl\":\"/desk/Task/DQ-7\",\"method\":\"CmfStatus.list\",\"args\":[],\"kwargs\":{\"filter\":[\"workflow_id\",\"IN\",[\"CmfWorkflow:f3d3e174-cb06-11f0-9799-eeb7fce6ef9e\"]],\"fields\":[\"status_type\",\"allow_empty_transition\",\"color\"],\"order_by\":[\"orderno\"]},\"fields\":[],\"no_cache\":false,\"no_meta\":true,\"session_tab_id\":\"HZj1\",\"cache_id\":\"a68fa6\",\"jshash\":\"jshash:CmfStatus.list:plalexeev@gid.ru:53052e08bb051b2e4e1c:a68fa6\"}",
    "method": "POST",
    "mode": "cors"
});