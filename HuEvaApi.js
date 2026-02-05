class HuEvaApi {
    /**
     * @param {string} baseUrl - The base URL for the API.
     *                           For production: 'https://eva.gid.team/api/?m='
     *                           For mock: 'http://localhost:3000/makets/api/' (without 'api__m=' prefix for flexibility)
     */
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        // Flag to check if we are using the mock server
        this.isMock = baseUrl.includes('localhost:3000');
        console.log(`HuEvaApi: Constructor - baseUrl: ${this.baseUrl}, isMock: ${this.isMock}`);
    }

    async #fetchApi(method, requestBody = null) {
        let url;
        const options = {
            method: 'GET', // Default to GET
            headers: {
                'Content-Type': 'application/json',
                // Authorization will be handled by existing user cookies, as per requirements
            },
        };

        if (this.isMock) {
            // For mock, construct URL as 'baseUrl/api__m=method:response.json'
            // and assume GET requests for static files.
            url = `${this.baseUrl}api__m=${method}:response.json`;
            options.method = 'GET';
        } else {
            // For production, base URL includes '?m='
            url = `${this.baseUrl}${method}`;
            if (requestBody) {
                // If there's a request body, it's typically a POST request.
                // Parameters are usually part of the body, but some APIs might append to URL.
                // Assuming standard practice where parameters for GET are in URL, POST in body.
                options.method = 'POST';
                options.body = JSON.stringify(requestBody);
            }
        }
        console.log(`HuEvaApi: #fetchApi - method: ${method}, constructed URL: ${url}, options:`, options);


        try {
            const response = await fetch(url, options);
            console.log(`HuEvaApi: #fetchApi - method: ${method}, response status: ${response.status}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${method}:`, error);
            throw error;
        }
    }

    /**
     * Fetches workflow details.
     * @param {object} params - Parameters for CmfWorkflow.get, e.g., { workflowId: '...' }
     * @returns {Promise<object>} - Workflow data.
     */
    async getCmfWorkflow(params) {
        // For production, parameters would typically be used in the request body or as query params.
        // For mock, the parameters are ignored as we fetch a static file.
        return this.#fetchApi('CmfWorkflow.get', params);
    }

    /**
     * Fetches a list of transitions.
     * @returns {Promise<object>} - List of transitions data.
     */
    async getCmfTransList() {
        return this.#fetchApi('CmfTrans.list');
    }

    /**
     * Fetches a list of statuses.
     * @returns {Promise<object>} - List of statuses data.
     */
    async getCmfStatusList() {
        return this.#fetchApi('CmfStatus.list');
    }
}

// Expose the class globally for use in the userscript context
window.HuEvaApi = HuEvaApi;
