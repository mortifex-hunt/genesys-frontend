<script lang="ts">
	import { fade, scale } from "svelte/transition";

	interface GlobalInjury {
		id: string;
		type: string;
		severity: number;
		minRoll: number;
		maxRoll: number;
		name: string;
		effect: string;
	}

	let {
		isOpen = $bindable(false),
		injuries = [] as GlobalInjury[],
		onSelect = undefined as ((injury: GlobalInjury) => void) | undefined,
	} = $props();

	let selectedType = $state("Crush");

	const damageTypes = [
		"Crush",
		"Puncture",
		"Slash",
		"Cold",
		"Electricity",
		"Heat",
	];

	let filteredInjuries = $derived(
		injuries.filter((inj) => inj.type === selectedType),
	);

	function handleSelect(injury: GlobalInjury) {
		if (onSelect) {
			onSelect(injury);
		}
		isOpen = false;
	}
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="modal-backdrop"
		role="dialog"
		tabindex="-1"
		transition:fade={{ duration: 150 }}
		onclick={() => (isOpen = false)}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="modal-content"
			role="document"
			transition:scale={{ duration: 150, start: 0.95 }}
			onclick={(e) => e.stopPropagation()}
		>
			<div class="modal-header">
				<h2>Add Critical Injury</h2>
				<button class="close-btn" onclick={() => (isOpen = false)}
					>✕</button
				>
			</div>

			<div class="tabs">
				{#each damageTypes as type}
					<button
						class="tab-btn {selectedType === type ? 'active' : ''}"
						onclick={() => (selectedType = type)}
					>
						{type}
					</button>
				{/each}
			</div>

			<div class="table-container">
				<table class="injuries-table">
					<thead>
						<tr>
							<th class="sev-col">Sev</th>
							<th class="roll-col">Roll</th>
							<th class="name-col">Effect</th>
							<th class="action-col"></th>
						</tr>
					</thead>
					<tbody>
						{#each filteredInjuries as inj}
							<tr>
								<td class="sev-col">
									<div class="pips">
										{#each Array(inj.severity) as _}
											<div class="pip filled"></div>
										{/each}
									</div>
								</td>
								<td class="roll-col"
									>{inj.minRoll
										.toString()
										.padStart(2, "0")}-{inj.maxRoll > 150
										? "151+"
										: inj.maxRoll}</td
								>
								<td class="name-col">
									<strong>{inj.name}:</strong>
									{inj.effect}
								</td>
								<td class="action-col">
									<button
										class="add-btn"
										onclick={() => handleSelect(inj)}
										>Select</button
									>
								</td>
							</tr>
						{/each}
						{#if filteredInjuries.length === 0}
							<tr>
								<td colspan="4" class="empty-state"
									>No critical injuries found for this type.</td
								>
							</tr>
						{/if}
					</tbody>
				</table>
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
		z-index: 1000;
		backdrop-filter: blur(2px);
	}

	.modal-content {
		background-color: var(--color-card-bg, #1a1a1a);
		border: 1.5px solid var(--color-line-brand, #333);
		border-radius: 8px;
		width: 90%;
		max-width: 800px;
		max-height: 85vh;
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

	.tabs {
		height: 100px;
		display: flex;
		padding: 0 1rem;
		background-color: rgba(0, 0, 0, 0.2);
		border-bottom: 1px solid var(--color-line-brand, #333);
		overflow-x: auto;
	}

	.tab-btn {
		background: none;
		border: none;
		color: #888;
		padding: 0.75rem 1rem;
		font-family: var(--font-brand, sans-serif);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		border-bottom: 2px solid transparent;
		transition: all 0.2s;
	}

	.tab-btn:hover {
		color: #ddd;
	}

	.tab-btn.active {
		color: var(--color-text-brand, #fff);
		border-bottom-color: var(--color-text-brand, #fff);
	}

	.table-container {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
	}

	.injuries-table {
		width: 100%;
		border-collapse: collapse;
		font-family: var(--font-body, sans-serif);
		font-size: 0.9rem;
	}

	.injuries-table th {
		text-align: left;
		color: #888;
		font-family: var(--font-brand, sans-serif);
		font-weight: 700;
		padding: 0.5rem;
		border-bottom: 1px solid #444;
	}

	.injuries-table td {
		padding: 0.75rem 0.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		color: #ddd;
		vertical-align: top;
	}

	.injuries-table tr:hover td {
		background-color: rgba(255, 255, 255, 0.02);
	}

	.sev-col {
		width: 60px;
	}
	.roll-col {
		width: 80px;
		font-weight: 600;
	}
	.action-col {
		width: 80px;
		text-align: center;
	}

	.name-col strong {
		color: var(--color-text-brand, #fff);
	}

	.pips {
		display: flex;
		gap: 3px;
	}

	.pip {
		width: 8px;
		height: 8px;
		background-color: rgba(255, 255, 255, 0.2);
		transform: rotate(45deg);
	}

	.pip.filled {
		background-color: #ef4444; /* red for severity */
	}

	.add-btn {
		background-color: transparent;
		border: 1px solid var(--color-line-brand, #555);
		color: var(--color-text-brand, #fff);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.8rem;
		font-family: var(--font-brand, sans-serif);
		transition: all 0.2s;
	}

	.add-btn:hover {
		background-color: var(--color-text-brand, #fff);
		color: #000;
	}

	.empty-state {
		text-align: center;
		padding: 2rem !important;
		color: #888 !important;
	}
</style>
