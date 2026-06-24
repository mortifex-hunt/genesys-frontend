<script lang="ts">
	import Tooltip from "../Tooltip.svelte";
	import ItemSelectionModal from "../ItemSelectionModal.svelte";
	import { env } from "$env/dynamic/public";

	interface Talent {
		name: string;
		page: string;
		summary: string;
	}

	let {
		talents = $bindable<Talent[]>([
			{ name: "", page: "", summary: "" },
			{ name: "", page: "", summary: "" },
			{ name: "", page: "", summary: "" },
			{ name: "", page: "", summary: "" },
			{ name: "", page: "", summary: "" },
		]),
		globalTalents = [] as any[],
		globalAbilities = [] as any[]
	} = $props();

	let combinedOptions = $derived(
		[...globalTalents, ...globalAbilities].sort((a, b) => a.name.localeCompare(b.name))
	);

	let isModalOpen = $state(false);
	let isCreateModalOpen = $state(false);
	let newTalentName = $state("");
	let newTalentSummary = $state("");
	let isSaving = $state(false);

	let apiBase = "http://localhost:3000/api";
	if (typeof window !== "undefined") {
		const hostname = window.location.hostname;
		const backendUrl = env.PUBLIC_BACKEND_URL || `http://${hostname}:3000`;
		apiBase = `${backendUrl}/api`;
	}

	async function saveGlobalTalent() {
		if (!newTalentName.trim()) return;
		isSaving = true;
		try {
			const res = await fetch(`${apiBase}/content/custom-talents`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: newTalentName,
					data: { description: newTalentSummary }
				})
			});
			if (res.ok) {
				const savedTalent = await res.json();
				// Push directly to global options to update UI immediately
				globalTalents.push(savedTalent);
				// Also add it directly to character
				handleTalentSelect(savedTalent);
				isCreateModalOpen = false;
				isModalOpen = false;
				newTalentName = "";
				newTalentSummary = "";
			} else {
				console.error("Failed to save global talent");
			}
		} catch (e) {
			console.error("Error saving global talent:", e);
		} finally {
			isSaving = false;
		}
	}

	function addCustomTalent() {
		talents = [...talents, { name: "", page: "", summary: "" }];
	}

	function removeTalent(index: number) {
		talents = talents.filter((_, i) => i !== index);
	}

	function handleTalentSelect(selectedItem: any) {
		if (selectedItem) {
			let summary = "";
			if (selectedItem.data && selectedItem.data.description) {
				if (Array.isArray(selectedItem.data.description)) {
					summary = selectedItem.data.description[0];
				} else if (typeof selectedItem.data.description === 'string') {
					summary = selectedItem.data.description;
				}
			}

			const emptyIndex = talents.findIndex(t => !t.name && !t.page && !t.summary);
			if (emptyIndex !== -1) {
				talents[emptyIndex] = { name: selectedItem.name, page: "", summary };
			} else {
				talents = [...talents, { name: selectedItem.name, page: "", summary }];
			}
		}
	}

	function getFullDescription(name: string) {
		if (!name) return null;
		const match = combinedOptions.find(o => o.name.toLowerCase() === name.toLowerCase());
		return match?.data?.description;
	}
</script>

<div class="talents-container">
	<div class="block-header">TALENTS AND SPECIAL ABILITIES</div>
	
	<div class="talents-header-row">
		<div class="col-name">NAME</div>
		<div class="col-page">PAGE #</div>
		<div class="col-summary">ABILITY SUMMARY</div>
		<div class="col-del"></div>
	</div>

	<div class="talents-list">
		{#each talents as talent, i}
			{@const desc = getFullDescription(talent.name)}
			<div class="talent-row">
				<div class="cell-name">
					<input type="text" bind:value={talent.name} />
				</div>
				<div class="cell-page">
					<input type="text" bind:value={talent.page} />
				</div>
				<div class="cell-summary">
					<Tooltip direction="top" class="talent-tooltip-wrapper">
						<input type="text" bind:value={talent.summary} />
						{#snippet tooltipBody()}
							<h4>{talent.name || "Talent"}</h4>
							{#if desc}
								{#if Array.isArray(desc)}
									{#each desc as p}
										<p>{p}</p>
									{/each}
								{:else}
									<p>{desc}</p>
								{/if}
							{:else if talent.summary}
								<p>{talent.summary}</p>
							{:else}
								<p>No description provided.</p>
							{/if}
						{/snippet}
					</Tooltip>
				</div>
				<div class="cell-del">
					<button type="button" class="btn-del" onclick={() => removeTalent(i)}>&times;</button>
				</div>
			</div>
		{/each}
	</div>

	<div class="add-row">
		<button type="button" class="btn-add search-btn" onclick={() => isModalOpen = true}>
			🔍 Search Database
		</button>
		<button type="button" class="btn-add custom-btn" onclick={addCustomTalent}>
			+ Add Custom
		</button>
	</div>
</div>

<ItemSelectionModal
	bind:isOpen={isModalOpen}
	title="Select Talent or Ability"
	items={combinedOptions}
	onSelect={handleTalentSelect}
>
	{#snippet controls()}
		<button class="btn-create-global" onclick={() => isCreateModalOpen = true}>
			🌐 Create New Global
		</button>
	{/snippet}

	{#snippet header()}
		<div class="talent-modal-header">
			<div class="modal-col-name">NAME</div>
			<div class="modal-col-summary">SUMMARY</div>
		</div>
	{/snippet}

	{#snippet row(item)}
		{@const desc = item.data?.description}
		<div class="talent-modal-row">
			<div class="modal-col-name">
				<span style="font-weight: 600; color: var(--color-text-brand);">{item.name}</span>
			</div>
			<div class="modal-col-summary">
				{#if desc}
					<Tooltip direction="top" class="talent-tooltip-wrapper">
						<div class="summary-text">
							{#if Array.isArray(item.data?.description)}
								{item.data.description[0]}
							{:else if typeof item.data?.description === 'string'}
								{item.data.description}
							{:else}
								—
							{/if}
						</div>
						{#snippet tooltipBody()}
							<h4>{item.name}</h4>
							{#if Array.isArray(desc)}
								{#each desc as p}
									<p>{p}</p>
								{/each}
							{:else}
								<p>{desc}</p>
							{/if}
						{/snippet}
					</Tooltip>
				{:else}
					<div class="summary-text">
						{#if Array.isArray(item.data?.description)}
							{item.data.description[0]}
						{:else if typeof item.data?.description === 'string'}
							{item.data.description}
						{:else}
							—
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/snippet}
</ItemSelectionModal>

{#if isCreateModalOpen}
	<div class="create-modal-backdrop" onclick={() => isCreateModalOpen = false} onkeydown={(e) => e.key === 'Escape' && (isCreateModalOpen = false)} tabindex="0" role="button">
		<div class="create-modal-content" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
			<div class="create-modal-header">
				<h2>Create Global Talent</h2>
				<button type="button" class="close-btn" onclick={() => isCreateModalOpen = false}>&times;</button>
			</div>
			<div class="create-modal-body">
				<p class="create-help-text">This will save a new talent to the database, making it permanently available in the search modal for all characters.</p>
				<div class="form-group">
					<label for="talent-name">Talent Name</label>
					<input id="talent-name" type="text" bind:value={newTalentName} placeholder="e.g. Master of Shadows" />
				</div>
				<div class="form-group">
					<label for="talent-summary">Description / Summary</label>
					<textarea id="talent-summary" bind:value={newTalentSummary} placeholder="Full description of what the talent does..."></textarea>
				</div>
				<div class="create-modal-actions">
					<button type="button" class="btn-cancel" onclick={() => isCreateModalOpen = false}>Cancel</button>
					<button type="button" class="btn-save" onclick={saveGlobalTalent} disabled={!newTalentName.trim() || isSaving}>
						{isSaving ? "Saving..." : "💾 Save to Database"}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.talents-container {
		background-color: var(--color-card-bg);
		border: 1.5px solid var(--color-line-brand);
		border-radius: 4px;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.block-header {
		position: absolute;
		top: -10px;
		right: 15px;
		background: var(--color-bg-page);
		padding: 0 8px;
		font-family: var(--font-brand);
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--color-text-brand);
		letter-spacing: 0.05em;
	}

	.talents-header-row {
		display: flex;
		padding: 0.5rem;
		border-bottom: 1.5px solid var(--color-line-brand);
		font-family: var(--font-brand);
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-text-brand);
	}

	.col-name { width: 25%; }
	.col-page { width: 10%; text-align: center; border-left: 1.5px solid var(--color-line-brand); }
	.col-summary { flex-grow: 1; text-align: right; padding-right: 10px; border-left: 1.5px solid var(--color-line-brand); }
	.col-del { width: 25px; }

	.talents-list {
		display: flex;
		flex-direction: column;
	}

	.talent-row {
		display: flex;
		border-bottom: 1px dashed var(--color-line-brand);
		align-items: center;
		height: 35px;
	}

	.talent-row:last-child {
		border-bottom: none;
	}

	.cell-name, .cell-page, .cell-summary {
		height: 100%;
		padding: 0 0.5rem;
	}

	.cell-name { width: 25%; }
	.cell-page { width: 10%; border-left: 1.5px dashed var(--color-line-brand); }
	.cell-summary { flex-grow: 1; border-left: 1.5px dashed var(--color-line-brand); }
	
	.talent-row input {
		width: 100%;
		height: 100%;
		background: transparent;
		border: none;
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--color-text-dark);
		outline: none;
	}

	.cell-page input {
		text-align: center;
	}

	.cell-del {
		width: 25px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.btn-del {
		background: transparent;
		border: none;
		color: #94a3b8;
		font-size: 1.25rem;
		cursor: pointer;
		padding: 0;
	}

	.btn-del:hover {
		color: #ef4444;
	}

	.add-row {
		padding: 0.5rem;
		display: flex;
		justify-content: center;
		gap: 1rem;
		border-top: 1.5px dashed var(--color-line-brand);
	}

	.btn-add {
		background: transparent;
		border: 1px dashed var(--color-line-brand);
		color: var(--color-text-brand);
		font-family: var(--font-brand);
		font-weight: 700;
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		cursor: pointer;
	}

	.btn-add:hover {
		background: var(--color-line-brand);
		color: var(--color-bg-page);
	}

	.search-btn {
		border-color: var(--color-text-brand);
		background: rgba(255, 255, 255, 0.05);
	}

	:global(.talent-tooltip-wrapper) {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
	}

	/* Modal Snippet Styles */
	.talent-modal-header {
		display: flex;
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.05);
		font-family: var(--font-brand);
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-text-brand);
		border-bottom: 1px solid var(--color-line-brand);
	}

	.talent-modal-row {
		display: flex;
		width: 100%;
		padding: 0.75rem 1rem;
		align-items: center;
	}

	.modal-col-name {
		width: 30%;
		padding-right: 1rem;
		display: flex;
		align-items: center;
	}

	.modal-col-summary {
		flex: 1;
		font-size: 0.85rem;
		color: #ccc;
		text-align: left;
		min-width: 0;
	}

	.summary-text {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Create Global Talent Modal Styles */
	.btn-create-global {
		background-color: var(--color-brand);
		color: white;
		border: none;
		border-radius: 4px;
		padding: 0.5rem 1rem;
		font-family: var(--font-brand);
		font-weight: 700;
		cursor: pointer;
		white-space: nowrap;
		transition: background-color 0.2s;
	}

	.btn-create-global:hover {
		background-color: var(--color-brand-light, #1c5280);
	}

	.create-modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1100;
		padding: 1rem;
	}

	.create-modal-content {
		background-color: var(--color-card-bg);
		border: 1.5px solid var(--color-line-brand);
		border-radius: 8px;
		width: 100%;
		max-width: 500px;
		box-shadow: var(--shadow-premium);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.create-modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid var(--color-line-brand);
		background-image: var(--bg-cross-pattern);
		background-size: 60px 104px;
	}

	.create-modal-header h2 {
		margin: 0;
		font-family: var(--font-brand);
		color: var(--color-text-brand);
		font-size: 1.25rem;
	}

	.close-btn {
		background: none;
		border: none;
		color: var(--color-text-dark);
		font-size: 2rem;
		line-height: 1;
		cursor: pointer;
		padding: 0;
	}

	.close-btn:hover {
		color: var(--color-text-brand);
	}

	.create-modal-body {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.create-help-text {
		margin: 0;
		font-size: 0.85rem;
		color: #aaa;
		font-style: italic;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-group label {
		font-family: var(--font-brand);
		color: var(--color-text-brand);
		font-size: 0.85rem;
		font-weight: 700;
	}

	.form-group input, .form-group textarea {
		background: rgba(0, 0, 0, 0.2);
		border: 1px solid var(--color-line-brand);
		border-radius: 4px;
		color: white;
		padding: 0.75rem;
		font-family: var(--font-body);
		font-size: 1rem;
	}

	.form-group input:focus, .form-group textarea:focus {
		outline: none;
		border-color: var(--color-rust);
	}

	.form-group textarea {
		min-height: 120px;
		resize: vertical;
	}

	.create-modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.btn-cancel, .btn-save {
		padding: 0.5rem 1rem;
		font-family: var(--font-brand);
		font-weight: 700;
		border-radius: 4px;
		cursor: pointer;
		border: none;
	}

	.btn-cancel {
		background: transparent;
		color: #999;
	}

	.btn-cancel:hover {
		color: white;
	}

	.btn-save {
		background: var(--color-rust);
		color: white;
	}

	.btn-save:hover:not(:disabled) {
		background: #eb8c39;
	}

	.btn-save:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
