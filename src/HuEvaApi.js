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
                'CmfWorkflow.get': '../dev/api/api_CmfWorkflow_get_response.json',
                'CmfTrans.list': '../dev/api/api_CmfTrans_list_response.json',
                'CmfStatus.list': '../dev/api/api_CmfStatus_list_response.json'
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

    /**
     * Gets workflow data
     * @param {string} workflowId - ID of the workflow to retrieve
     * @returns {Promise<Object>} Workflow data
     */
    async getWorkflow(workflowId) {
        const params = {};
        if (workflowId) {
            params.id = workflowId;
        }

        const response = await this.call('CmfWorkflow.get', params);
        return response.result;
    }

    /**
     * Gets transitions for a workflow
     * @param {string} workflowId - ID of the workflow
     * @returns {Promise<Array>} Array of transitions
     */
    async getTransitions(workflowId) {
        const params = {};
        if (workflowId) {
            params.workflow_id = workflowId;
        }

        const response = await this.call('CmfTrans.list', params);
        return response.result;
    }

    /**
     * Gets statuses for a workflow
     * @param {string} workflowId - ID of the workflow
     * @returns {Promise<Array>} Array of statuses
     */
    async getStatuses(workflowId) {
        const params = {};
        if (workflowId) {
            params.workflow_id = workflowId;
        }

        const response = await this.call('CmfStatus.list', params);
        return response.result;
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
}