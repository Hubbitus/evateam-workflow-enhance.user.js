// src/HuEvaApi.js
export class HuEvaApi {
    constructor(config = {}) {
        this.config = {
            baseUrl: 'https://eva.gid.team/api/',
            mockUrls: {
                'CmfWorkflow.get': 'http://localhost:3000/makets/api/api__m=CmfWorkflow.get:response.json',
                'CmfTrans.list': 'http://localhost:3000/makets/api/api__m=CmfTrans.list:response.json',
                'CmfStatus.list': 'http://localhost:3000/makets/api/api__m=CmfStatus.list:response.json'
            },
            useMock: typeof config.useMock !== 'undefined' ? config.useMock : false,
            ...config
        };
    }

    async call(method, params = {}) {
        try {
            let url;
            if (this.config.useMock && this.config.mockUrls[method]) {
                url = this.config.mockUrls[method];
            } else {
                url = `${this.config.baseUrl}?m=${method}`;

                const queryParams = new URLSearchParams({ m: method });
                for (const [key, value] of Object.entries(params)) {
                    queryParams.append(key, value);
                }
                url = `${this.config.baseUrl}?${queryParams.toString()}`;
            }

            console.log(`HuEvaFlowEnhancer: Calling API method ${method} with URL: ${url}`);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            console.log(`HuEvaFlowEnhancer: API call ${method} successful`, data);

            return data;
        } catch (error) {
            console.error(`HuEvaFlowEnhancer: Error calling API method ${method}:`, error);
            throw error;
        }
    }

    async getWorkflow(workflowId) {
        const params = {};
        if (workflowId) {
            params.id = workflowId;
        }

        const response = await this.call('CmfWorkflow.get', params);
        return response.result;
    }

    async getTransitions(workflowId) {
        const params = {};
        if (workflowId) {
            params.workflow_id = workflowId;
        }

        const response = await this.call('CmfTrans.list', params);
        return response.result;
    }

    async getStatuses(workflowId) {
        const params = {};
        if (workflowId) {
            params.workflow_id = workflowId;
        }

        const response = await this.call('CmfStatus.list', params);
        return response.result;
    }

    async getCompleteWorkflowData(workflowId) {
        try {
            console.log(`HuEvaFlowEnhancer: Getting complete workflow data for workflow ID: ${workflowId}`);

            const [workflow, statuses, transitions] = await Promise.all([
                this.getWorkflow(workflowId),
                this.getStatuses(workflowId),
                this.getTransitions(workflowId)
            ]);

            return {
                workflow,
                statuses,
                transitions
            };
        } catch (error) {
            console.error(`HuEvaFlowEnhancer: Error getting complete workflow data:`, error);
            throw error;
        }
    }
}