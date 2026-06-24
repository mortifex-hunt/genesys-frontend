<script lang="ts" generics="T extends { id?: string; name: string }">
	import type { Snippet } from 'svelte';

	let {
		isOpen = $bindable(false),
		title = "Select Item",
		items = [] as T[],
		onSelect,
		row,
		header,
		controls,
	}: {
		isOpen: boolean;
		title: string;
		items: T[];
		onSelect: (item: T | null) => void;
		row: Snippet<[T]>;
		header?: Snippet;
		controls?: Snippet;
	} = $props();

	let searchQuery = $state("");
	let sortOption = $state("name_asc");

	let filteredAndSortedItems = $derived.by(() => {
		let result = items;
		if (searchQuery.trim() !== "") {
			const q = searchQuery.toLowerCase();
			result = result.filter(item => item.name.toLowerCase().includes(q));
		}

		result = [...result].sort((a, b) => {
			if (sortOption === "name_asc") {
				return a.name.localeCompare(b.name);
			} else if (sortOption === "name_desc") {
				return b.name.localeCompare(a.name);
			}
			return 0;
		});

		return result;
	});

	function handleSelect(item: T | null) {
		onSelect(item);
		isOpen = false;
	}

	function handleClose() {
		isOpen = false;
	}
</script>

{#if isOpen}
	<div class="modal-backdrop" onclick={handleClose} onkeydown={(e) => e.key === 'Escape' && handleClose()} tabindex="0" role="button">
		<div class="modal-content" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
			<div class="modal-header">
				<h2>{title}</h2>
				<button class="close-btn" onclick={handleClose} aria-label="Close modal">&times;</button>
			</div>

			<div class="modal-controls">
				<input 
					type="text" 
					class="search-input" 
					placeholder="Search by name..." 
					bind:value={searchQuery}
				/>
				<select class="sort-select" bind:value={sortOption}>
					<option value="name_asc">Name (A-Z)</option>
					<option value="name_desc">Name (Z-A)</option>
				</select>
				{#if controls}
					{@render controls()}
				{/if}
			</div>

			<div class="modal-body">
				<div class="items-list">
					<!-- Clear Option -->
					<button class="item-row clear-row" onclick={() => handleSelect(null)}>
						<div class="item-cell name-cell" style="justify-content: center; width: 100%; color: var(--color-rust);">
							<span style="font-weight: 700;">-- Clear Selection --</span>
						</div>
					</button>

					{#if header}
						<div class="list-header-wrapper">
							{@render header()}
						</div>
					{/if}

					{#if filteredAndSortedItems.length === 0}
						<div class="no-results">No items found matching "{searchQuery}"</div>
					{/if}

					{#each filteredAndSortedItems as item}
						<button class="item-row" onclick={() => handleSelect(item)}>
							{@render row(item)}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.modal-content {
		background-color: var(--color-card-bg);
		border: 1.5px solid var(--color-line-brand);
		border-radius: 8px;
		width: 100%;
		max-width: 800px;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		box-shadow: var(--shadow-premium);
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid var(--color-line-brand);
		background-image: var(--bg-cross-pattern);
		background-size: 60px 104px;
	}

	.modal-header h2 {
		margin: 0;
		font-family: var(--font-brand);
		color: var(--color-text-brand);
		font-size: 1.5rem;
		letter-spacing: 0.05em;
	}

	.close-btn {
		background: none;
		border: none;
		color: var(--color-text-dark);
		font-size: 2rem;
		line-height: 1;
		cursor: pointer;
		padding: 0;
		transition: color 0.2s;
	}

	.close-btn:hover {
		color: var(--color-text-brand);
	}

	.modal-controls {
		display: flex;
		gap: 1rem;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--color-line-brand);
		background: rgba(0, 0, 0, 0.2);
	}

	.search-input, .sort-select {
		background-color: rgba(255, 255, 255, 0.05);
		border: 1px solid #444;
		border-radius: 4px;
		padding: 0.5rem 1rem;
		color: white;
		font-family: var(--font-body);
		font-size: 1rem;
	}

	.search-input {
		flex: 1;
	}

	.sort-select {
		width: 150px;
		cursor: pointer;
	}

	.search-input:focus, .sort-select:focus {
		border-color: var(--color-text-brand);
		outline: none;
	}

	.sort-select option {
		background-color: var(--color-bg-page);
		color: white;
	}

	.modal-body {
		overflow-y: auto;
		flex: 1;
		padding: 1rem 1.5rem;
	}

	.items-list {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.list-header-wrapper {
		margin-bottom: 0.5rem;
	}

	.item-row {
		display: flex;
		width: 100%;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid transparent;
		border-radius: 4px;
		padding: 0;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
		color: var(--color-text-dark);
	}

	.item-row:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: var(--color-text-brand);
	}

	.clear-row {
		border: 1px dashed var(--color-rust);
		background: transparent;
		margin-bottom: 0.5rem;
		padding: 0.5rem;
	}

	.clear-row:hover {
		background: rgba(255, 255, 255, 0.05);
		border-color: var(--color-rust);
	}

	.no-results {
		text-align: center;
		padding: 2rem;
		color: #666;
		font-family: var(--font-body);
		font-style: italic;
	}

	@media (max-width: 600px) {
		.modal-controls {
			flex-direction: column;
		}
		.sort-select {
			width: 100%;
		}
	}
</style>
