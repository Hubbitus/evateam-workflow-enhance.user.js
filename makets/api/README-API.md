# Api MOCKs

Directory contains examples of requests and responces as it served by EvaTeam for the workflow data.
Examples provided by https://eva.gid.team/desk/Task/DQ-7.

## Files naming and structure

File named by pattern:
```
	{path}?m={method}:{request|response}.{fileType}
```
Where:
1. {path} is the static URI path like api/.
  * On real server it shoul be like: https://eva.gid.team/api/?
  * On our mock that will be served at: http://localhost:3003/makets/api/
2. {method} - entity and method like: `CmfWorkflow.get`.
3. {request|responce} - in request prodided example how to call, in sesponce example of server answer
4. {fileType} - type of file:
  * `curl` - curl command invocation example
  * `js` - fetch call example
  * `json` - data in JSON format

### Example

Real API call to https://eva.gid.team/api/?m=CmfStatus.list saved as:
1. `api?m=CmfStatus.list:request.curl` - example how to call it with curl
2. `api?m=CmfStatus.list:request.js` - example how to call it with JavaScript fetch
3. `api?m=CmfStatus.list:response.json` - example of server answer.

For that example in dev mode that must be called like: http://localhost:3003/makets/api/api__m=CmfStatus.list:response.json

## Common sequence invocation

1. https://eva.gid.team/api/?m=CmfWorkflow.get
2. https://eva.gid.team/api/?m=CmfTrans.list
3. https://eva.gid.team/api/?m=CmfStatus.list
