await fetch("https://eva.gid.team/api/?m=CmfTrans.list", {
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
    "body": "{\"jsonrpc\":\"2.2\",\"callid\":\"3ad0a41a-a43e-4349-85d6-c86e0b02cf23\",\"jsver\":null,\"jsurl\":\"/desk/Task/DQ-7\",\"method\":\"CmfTrans.list\",\"args\":[],\"kwargs\":{\"filter\":[\"workflow_id\",\"=\",\"CmfWorkflow:f3d3e174-cb06-11f0-9799-eeb7fce6ef9e\"],\"fields\":[\"name\",\"status_from\",\"status_to\"]},\"fields\":[],\"no_cache\":false,\"no_meta\":true,\"session_tab_id\":\"HZj1\",\"cache_id\":\"a68fa6\",\"jshash\":\"jshash:CmfTrans.list:plalexeev@gid.ru:e3b5f57d3016ad3214d2:a68fa6\"}",
    "method": "POST",
    "mode": "cors"
});