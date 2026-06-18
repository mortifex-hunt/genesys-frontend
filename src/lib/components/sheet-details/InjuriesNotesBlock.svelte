<script lang="ts">
	import CriticalInjuryDialog from "./CriticalInjuryDialog.svelte";
	import InjuryDetailsDialog from "./InjuryDetailsDialog.svelte";

	interface CriticalInjury {
		severity: number;
		result: string;
	}

	let {
		notes = $bindable<string>(""),
		criticalInjuries = $bindable<CriticalInjury[]>([
			{ severity: 0, result: "" },
			{ severity: 0, result: "" },
			{ severity: 0, result: "" },
			{ severity: 0, result: "" },
		]),
		globalInjuries = [] as any[]
	} = $props();

	let isDialogOpen = $state(false);
	
	let isDetailsOpen = $state(false);
	let detailsIndex = $state(0);

	function openDetails(index: number) {
		detailsIndex = index;
		isDetailsOpen = true;
	}

	function setSeverity(injuryIndex: number, severityValue: number) {
		if (criticalInjuries[injuryIndex].severity === severityValue) {
			criticalInjuries[injuryIndex].severity = 0; // Toggle off
		} else {
			criticalInjuries[injuryIndex].severity = severityValue;
		}
	}

	function handleSelectInjury(injury: any) {
		// Replace first empty or just push
		const emptyIndex = criticalInjuries.findIndex(i => i.severity === 0 && !i.result);
		if (emptyIndex !== -1) {
			criticalInjuries[emptyIndex] = { severity: injury.severity, result: `${injury.name}: ${injury.effect}` };
		} else {
			criticalInjuries = [...criticalInjuries, { severity: injury.severity, result: `${injury.name}: ${injury.effect}` }];
		}
	}

	function removeInjury(index: number) {
		criticalInjuries = criticalInjuries.filter((_, i) => i !== index);
	}
</script>

<CriticalInjuryDialog bind:isOpen={isDialogOpen} injuries={globalInjuries} onSelect={handleSelectInjury} />
{#if criticalInjuries.length > 0}
	<InjuryDetailsDialog bind:isOpen={isDetailsOpen} bind:injuryResult={criticalInjuries[detailsIndex].result} />
{/if}

<div class="injuries-notes-container">
	<div class="notes-section">
		<div class="block-header">NOTES</div>
		<textarea bind:value={notes}></textarea>
	</div>

	<div class="injuries-section">
		<div class="block-header">CRITICAL INJURIES</div>
		<div class="injuries-header-row">
			<div class="severity-col">SEVERITY</div>
			<div class="result-col">RESULT</div>
			<div class="del-col"></div>
		</div>
		<div class="injuries-list">
			{#each criticalInjuries as injury, idx}
				<div class="injury-row">
					<div class="severity-cell">
						{#each Array(4) as _, sIdx}
							{@const sVal = sIdx + 1}
							<button
								type="button"
								class="diamond-btn"
								class:active={sVal <= injury.severity}
								onclick={() => setSeverity(idx, sVal)}
								aria-label="Set severity to {sVal}"
							>
								<svg viewBox="0 0 24 24" class="diamond-icon">
									<polygon points="12,2 22,12 12,22 2,12" />
								</svg>
							</button>
						{/each}
					</div>
					<div class="result-cell">
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div class="result-display" onclick={() => openDetails(idx)}>
							{injury.result || "Click to add details..."}
						</div>
					</div>
					<div class="del-cell">
						<button
							type="button"
							class="btn-del"
							onclick={() => removeInjury(idx)}
						>
							&times;
						</button>
					</div>
				</div>
			{/each}
		</div>
		<div class="add-row">
			<button type="button" class="btn-add" onclick={() => (isDialogOpen = true)}>
				+ Add Injury
			</button>
		</div>
	</div>
</div>

<style>
	.injuries-notes-container {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.notes-section, .injuries-section {
		background-color: var(--color-card-bg);
		border: 1.5px solid var(--color-line-brand);
		border-radius: 4px;
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0; /* prevents flex/grid blow-out from nowrap text */
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

	.notes-section textarea {
		width: 100%;
		flex-grow: 1;
		background: transparent;
		border: none;
		resize: none;
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--color-text-dark);
		outline: none;
		line-height: 1.5;
		padding: 1rem;
		min-height: 150px;
	}

	.injuries-header-row {
		display: flex;
		border-bottom: 1.5px solid var(--color-line-brand);
		padding: 0.5rem;
		font-family: var(--font-brand);
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-text-brand);
	}

	.severity-col {
		width: 100px;
		text-align: center;
	}

	.result-col {
		flex-grow: 1;
		text-align: right;
		padding-right: 10px;
	}

	.del-col {
		width: 25px;
	}

	.injuries-list {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.injury-row {
		display: flex;
		border-bottom: 1px dashed var(--color-line-brand);
		align-items: center;
		min-width: 0;
	}

	.injury-row:last-child {
		border-bottom: none;
	}

	.severity-cell {
		width: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.25rem;
		gap: 2px;
		border-right: 1.5px dashed var(--color-line-brand);
	}

	.diamond-btn {
		background: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
		width: 20px;
		height: 20px;
		outline: none;
	}

	.diamond-icon {
		fill: transparent;
		stroke: var(--color-line-brand);
		stroke-width: 1.5;
		width: 100%;
		height: 100%;
		transition: fill 0.2s, stroke 0.2s;
	}

	.diamond-btn:hover .diamond-icon {
		stroke: var(--color-rust);
	}

	.diamond-btn.active .diamond-icon {
		fill: var(--color-rust);
		stroke: var(--color-rust);
	}

	.result-cell {
		flex-grow: 1;
		padding: 0 0.5rem;
		min-width: 0; /* allows truncation */
	}

	.result-display {
		width: 100%;
		background: transparent;
		border: none;
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--color-text-dark);
		cursor: pointer;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 0.25rem 0;
		text-align: left;
	}

	.result-display:hover {
		color: var(--color-text-brand);
	}

	.del-cell {
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

	@media (max-width: 900px) {
		.injuries-notes-container {
			grid-template-columns: 1fr;
		}
	}
</style>
