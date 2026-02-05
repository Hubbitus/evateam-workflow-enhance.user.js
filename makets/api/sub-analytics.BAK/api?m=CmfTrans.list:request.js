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
    "referrer": "https://eva.gid.team/project/Task/DATA-5945",
    "body": "{\"jsonrpc\":\"2.2\",\"callid\":\"1d224c88-5efb-4126-8189-e0fdb664def2\",\"jsver\":null,\"jsurl\":\"/project/Task/DATA-5945#analyze-visiology-protsess-raboty-s-dashbordami-postanovka-to-be\",\"method\":\"CmfTrans.list\",\"args\":[],\"kwargs\":{\"filter\":[\"workflow_id\",\"=\",\"CmfWorkflow:97af61e2-659a-11f0-8b7b-ee37db4b230b\"],\"fields\":[\"name\",\"status_from\",\"status_to\"]},\"fields\":[],\"no_cache\":false,\"no_meta\":true,\"session_tab_id\":\"HZj1\",\"cache_id\":\"289987\",\"jshash\":\"jshash:CmfTrans.list:plalexeev@gid.ru:ae5c7fea69cb2146e0c9:289987\"}",
    "method": "POST",
    "mode": "cors"
});
