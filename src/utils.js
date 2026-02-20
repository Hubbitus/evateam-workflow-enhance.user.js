
import { sha256 } from 'js-sha256';
import { Logger } from './logger.js';

/**
 * @typedef {Object} WorkflowData
 * @property {any} CmfWorkflow - The CmfWorkflow object.
 * @property {any[]} CmfStatus - The list of CmfStatus objects.
 * @property {any[]} CmfTrans - The list of CmfTrans objects.
 */

/**
 * @typedef {Object} SavedLayout
 * @property {string} id - The ID of the workflow.
 * @property {string} name - The name of the workflow.
 * @property {string} hash - The hash of the workflow data.
 * @property {string} update_date - The date of the last update.
 * @property {any} layout - The layout data.
 */

class LocalStorageManager {
    /**
     * @param {string} prefix
     */
    constructor(prefix = 'hu-eva-workflow-') {
        this.prefix = prefix;
    }

    /**
     * @param {string} id
     * @returns {string}
     */
    _getKey(id) {
        return `${this.prefix}${id}`;
    }

    /**
     * @param {WorkflowData} workflowData
     * @returns {string}
     */
    _calculateHash(workflowData) {
        // Hash must be calculated on full CmfWorkflow object + list of CmfStatus + list of CmfTrans
        const hashData = {
            CmfWorkflow: workflowData.workflow,
            CmfStatus: workflowData.statuses,
            CmfTrans: workflowData.transitions
        };
        const dataString = JSON.stringify(hashData);
        return sha256(dataString);
    }

    /**
     * @param {string} id
     * @param {string} name
     * @param {WorkflowData} workflowData
     * @param {any} layout
     */
    saveLayout(id, name, workflowData, layout) {
        const key = this._getKey(id);
        const hash = this._calculateHash(workflowData);
        const update_date = new Date().toISOString();

        /** @type {SavedLayout} */
        const dataToSave = {
            id,
            name,
            hash,
            update_date,
            layout
        };

        localStorage.setItem(key, JSON.stringify(dataToSave));
        Logger.log('HuEvaFlowEnhancer: Layout saved for workflow', id);
    }

    /**
     * @param {string} id
     * @param {WorkflowData} workflowData
     * @returns {SavedLayout | null}
     */
    loadLayout(id, workflowData) {
        const key = this._getKey(id);
        const savedData = localStorage.getItem(key);

        if (!savedData) {
            Logger.log('HuEvaFlowEnhancer: No saved layout found for workflow', id);
            return null;
        }

        /** @type {SavedLayout} */
        const parsedData = JSON.parse(savedData);
        const currentHash = this._calculateHash(workflowData);

        if (parsedData.hash !== currentHash) {
            Logger.warn('HuEvaFlowEnhancer: Workflow data has changed. Clearing saved layout.');
            this.clearLayout(id);
            return null;
        }

        Logger.log('HuEvaFlowEnhancer: Saved layout loaded for workflow', id);
        return parsedData;
    }

    /**
     * @param {string} id
     */
    clearLayout(id) {
        const key = this._getKey(id);
        localStorage.removeItem(key);
        Logger.log('HuEvaFlowEnhancer: Cleared saved layout for workflow', id);
    }
}

export const localStorageManager = new LocalStorageManager();
