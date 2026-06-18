<script lang="ts">
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
	} = $props();

	function addTalent() {
		talents = [...talents, { name: "", page: "", summary: "" }];
	}

	function removeTalent(index: number) {
		talents = talents.filter((_, i) => i !== index);
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
			<div class="talent-row">
				<div class="cell-name">
					<input type="text" bind:value={talent.name} />
				</div>
				<div class="cell-page">
					<input type="text" bind:value={talent.page} />
				</div>
				<div class="cell-summary">
					<input type="text" bind:value={talent.summary} />
				</div>
				<div class="cell-del">
					<button type="button" class="btn-del" onclick={() => removeTalent(i)}>&times;</button>
				</div>
			</div>
		{/each}
	</div>

	<div class="add-row">
		<button type="button" class="btn-add" onclick={addTalent}>+ Add Talent</button>
	</div>
</div>

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
</style>
