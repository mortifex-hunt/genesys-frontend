<script lang="ts">
	import { fade, scale } from "svelte/transition";

	let {
		isOpen = $bindable(false),
		injuryResult = $bindable("")
	} = $props();
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div class="modal-backdrop" role="dialog" tabindex="-1" transition:fade={{ duration: 150 }} onclick={() => (isOpen = false)}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div class="modal-content" role="document" transition:scale={{ duration: 150, start: 0.95 }} onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h2>Injury Details</h2>
				<button type="button" class="close-btn" onclick={() => (isOpen = false)}>✕</button>
			</div>

			<div class="modal-body">
				<textarea
					class="details-textarea"
					bind:value={injuryResult}
					placeholder="Enter critical injury details here..."
				></textarea>
			</div>
			
			<div class="modal-footer">
				<button type="button" class="save-btn" onclick={() => (isOpen = false)}>Done</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1100;
		backdrop-filter: blur(2px);
	}

	.modal-content {
		background-color: var(--color-card-bg, #1a1a1a);
		border: 1.5px solid var(--color-line-brand, #333);
		border-radius: 8px;
		width: 90%;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		background-color: rgba(255, 255, 255, 0.05);
		border-bottom: 1px solid var(--color-line-brand, #333);
	}

	.modal-header h2 {
		margin: 0;
		font-family: var(--font-brand, sans-serif);
		font-size: 1.25rem;
		color: var(--color-text-brand, #fff);
	}

	.close-btn {
		background: none;
		border: none;
		color: #888;
		font-size: 1.25rem;
		cursor: pointer;
		transition: color 0.2s;
	}

	.close-btn:hover {
		color: #fff;
	}

	.modal-body {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
	}

	.details-textarea {
		width: 100%;
		height: 150px;
		background: rgba(0, 0, 0, 0.2);
		border: 1px solid var(--color-line-brand, #333);
		border-radius: 4px;
		color: var(--color-text-brand, #fff);
		font-family: var(--font-body, sans-serif);
		font-size: 0.95rem;
		padding: 0.75rem;
		resize: vertical;
		outline: none;
	}
	
	.details-textarea:focus {
		border-color: var(--color-text-brand, #fff);
	}

	.modal-footer {
		padding: 1rem 1.5rem;
		border-top: 1px solid var(--color-line-brand, #333);
		display: flex;
		justify-content: flex-end;
		background-color: rgba(0, 0, 0, 0.2);
	}

	.save-btn {
		background-color: transparent;
		border: 1px solid var(--color-text-brand, #fff);
		color: var(--color-text-brand, #fff);
		padding: 0.5rem 1.5rem;
		border-radius: 4px;
		cursor: pointer;
		font-family: var(--font-brand, sans-serif);
		font-weight: 600;
		transition: all 0.2s;
	}

	.save-btn:hover {
		background-color: var(--color-text-brand, #fff);
		color: #000;
	}
</style>
