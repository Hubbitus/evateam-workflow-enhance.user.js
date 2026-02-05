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
    "referrer": "https://eva.gid.team/project/Task/DATA-5945",
    "body": "{\"jsonrpc\":\"2.2\",\"callid\":\"5370b483-ab39-4c3b-bf25-fe699cde27e1\",\"jsver\":null,\"jsurl\":\"/project/Task/DATA-5945#analyze-visiology-protsess-raboty-s-dashbordami-postanovka-to-be\",\"method\":\"CmfStatus.list\",\"args\":[],\"kwargs\":{\"filter\":[\"workflow_id\",\"IN\",[\"CmfWorkflow:97af61e2-659a-11f0-8b7b-ee37db4b230b\"]],\"fields\":[\"status_type\",\"allow_empty_transition\",\"color\"],\"order_by\":[\"orderno\"]},\"fields\":[],\"no_cache\":false,\"no_meta\":true,\"session_tab_id\":\"HZj1\",\"cache_id\":\"289987\",\"jshash\":\"jshash:CmfStatus.list:plalexeev@gid.ru:301a9d9aadd2bc2e888c:289987\"}",
    "method": "POST",
    "mode": "cors"
});
