/**
 * Class for interacting with EvaTeam API
 * Provides methods to get workflow data, statuses, and transitions
 */
export class HuEvaApi {
    /**
     * Constructor for HuEvaApi
     * @param {Object} config - Configuration object
     * @param {string} config.baseUrl - Base URL for API calls
     * @param {Object} config.mockUrls - Mock URLs for development
     * @param {boolean} config.useMock - Whether to use mock data
     */
    constructor(config = {}) {
        this.config = {
            baseUrl: 'https://eva.gid.team/api/',
            mockUrls: {
                'CmfWorkflow.get': './api/api_CmfWorkflow_get_response.json',
                'CmfTrans.list': './api/api_CmfTrans_list_response.json',
                'CmfStatus.list': './api/api_CmfStatus_list_response.json'
            },
            useMock: typeof config.useMock !== 'undefined' ? config.useMock : false,
            ...config
        };
    }

    /**
     * Makes an API call to EvaTeam
     * @param {string} method - API method to call (e.g., 'CmfWorkflow.get')
     * @param {Object} params - Parameters for the API call
     * @returns {Promise<Object>} Response from the API
     */
    async call(method, params = {}) {
        try {
            let url;
            let fetchOptions;

            if (this.config.useMock && this.config.mockUrls[method]) {
                // Mock mode - GET request to local JSON file
                url = this.config.mockUrls[method];
                fetchOptions = {
                    method: 'GET',
                    credentials: 'include'
                };
            } else {
                // Real API mode - POST request with JSON-RPC 2.2
                const callid = crypto.randomUUID?.() || Math.random().toString(36).substring(7);
                const jshash = `jshash:${method}:tampermonkey:${callid}`;

                const bodyParams = {
                    jsonrpc: '2.2',
                    callid: callid,
                    method: method,
                    kwargs: params,
                    no_meta: true,
                    jshash: jshash
                };
                url = `${this.config.baseUrl}?m=${method}`;
                fetchOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bodyParams),
                    credentials: 'include'
                };
            }

            console.log(`HuEvaFlowEnhancer: Calling API method ${method} with URL: ${url}`);

            const response = await fetch(url, fetchOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // JSON-RPC 2.0 response format
            if (data.error) {
                console.error(`HuEvaFlowEnhancer: API error for ${method}:`, data.error);
                throw new Error(`API error: ${JSON.stringify(data.error)}`);
            }

            console.log(`HuEvaFlowEnhancer: API call ${method} successful`, data);

            // Return the 'result' field for JSON-RPC 2.0
            return data.result || data;
        } catch (error) {
            console.error(`HuEvaFlowEnhancer: Error calling API method ${method}:`, error);
            throw error;
        }
    }

    /**
     * Gets workflow data
     * @param {string} workflowId - ID of the workflow to retrieve
     * @returns {Promise<Object>} Workflow data
     */
    async getWorkflow(workflowId) {
        const params = {};
        if (workflowId) {
            params.filter = ['id', '=', workflowId];
        }

        return await this.call('CmfWorkflow.get', params);
    }

    /**
     * Gets workflow data by name
     * @param {string} workflowName - Name of the workflow to retrieve
     * @returns {Promise<Object>} Workflow data
     */
    async getWorkflowByName(workflowName) {
        const params = {};
        if (workflowName) {
            params.filter = ['name', '=', workflowName];
        }

        return await this.call('CmfWorkflow.get', params);
    }

    /**
     * Gets transitions for a workflow
     * @param {string} workflowId - ID of the workflow
     * @returns {Promise<Array>} Array of transitions
     */
    async getTransitions(workflowId) {
        const params = {};
        if (workflowId) {
            params.filter = ['workflow_id', '=', workflowId];
        }
        // Request fields needed for visualization
        params.fields = ['id', 'name', 'status_from', 'status_to', 'workflow_id'];

        return await this.call('CmfTrans.list', params);
    }

    /**
     * Gets statuses for a workflow
     * @param {string} workflowId - ID of the workflow
     * @returns {Promise<Array>} Array of statuses
     */
    async getStatuses(workflowId) {
        const params = {};
        if (workflowId) {
            params.filter = ['workflow_id', '=', workflowId];
        }
        // Request fields needed for visualization
        params.fields = ['id', 'name', 'text', 'color', 'status_type', 'code', 'workflow_id'];

        return await this.call('CmfStatus.list', params);
    }

    /**
     * Gets complete workflow data (workflow, statuses, and transitions)
     * @param {string} workflowId - ID of the workflow
     * @returns {Promise<Object>} Complete workflow data
     */
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

    /**
     * Gets complete workflow data by workflow name
     * @param {string} workflowName - Name of the workflow
     * @returns {Promise<Object>} Complete workflow data
     */
    async getCompleteWorkflowDataByName(workflowName) {
        try {
            console.log(`HuEvaFlowEnhancer: Getting complete workflow data for workflow name: ${workflowName}`);

            // First get workflow by name
            const workflow = await this.getWorkflowByName(workflowName);

            if (!workflow || !workflow.id) {
                throw new Error(`Workflow not found with name: ${workflowName}`);
            }

            const workflowId = workflow.id;

            // Then get statuses and transitions using the workflow ID
            const [statuses, transitions] = await Promise.all([
                this.getStatuses(workflowId),
                this.getTransitions(workflowId)
            ]);

            return {
                workflow,
                statuses,
                transitions
            };
        } catch (error) {
            console.error(`HuEvaFlowEnhancer: Error getting complete workflow data by name:`, error);
            throw error;
        }
    }
}