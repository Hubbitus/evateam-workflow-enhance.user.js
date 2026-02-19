
<script>
    export let showModal = false;
    export let title = '';
    export let message = '';
    export let onClose = () => {};

    function closeModal() {
        showModal = false;
        onClose();
    }
</script>

{#if showModal}
<div class="modal-backdrop">
    <div class="modal">
        <div class="modal-header">
            <h3>{title}</h3>
            <button class="modal-close-btn" onclick={closeModal}>&times;</button>
        </div>
        <div class="modal-body">
            <p>{message}</p>
        </div>
        <div class="modal-footer">
            <button class="btn" onclick={closeModal}>OK</button>
        </div>
    </div>
</div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        width: 400px;
        max-width: 90%;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 10px;
    }

    .modal-close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }

    .modal-footer {
        text-align: right;
        margin-top: 20px;
    }

    .btn {
        padding: 8px 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #f0f0f0;
        cursor: pointer;
    }

    .btn:hover {
        background-color: #e0e0e0;
    }
</style>
