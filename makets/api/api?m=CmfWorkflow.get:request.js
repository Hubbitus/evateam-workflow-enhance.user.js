await fetch("https://eva.gid.team/api/?m=CmfWorkflow.get", {
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
    "body": "{\"jsonrpc\":\"2.2\",\"callid\":\"900a0bf3-db9b-471d-9dcf-006e97dc63ef\",\"jsver\":null,\"jsurl\":\"/desk/Task/DQ-7\",\"method\":\"CmfWorkflow.get\",\"args\":[],\"kwargs\":{\"filter\":[\"id\",\"=\",\"CmfWorkflow:f3d3e174-cb06-11f0-9799-eeb7fce6ef9e\"],\"fields\":[\"name\",\"status_from\",\"status_to\",\"text\",\"cmf_ui_form\",\"scheme_draw_config\"]},\"fields\":[],\"no_cache\":false,\"no_meta\":true,\"session_tab_id\":\"HZj1\",\"cache_id\":\"a68fa6\",\"jshash\":\"jshash:CmfWorkflow.get:plalexeev@gid.ru:fb731cdbe634494fd6ae:a68fa6\"}",
    "method": "POST",
    "mode": "cors"
});