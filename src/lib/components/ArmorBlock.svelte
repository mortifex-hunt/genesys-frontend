<script lang="ts">
	interface ArmorItem {
		id?: string;
		name: string;
		defense: string;
		soak: string;
		encumbrance: string;
		hardPoints: string;
		special: string;
	}

	let {
		armors = $bindable<ArmorItem[]>([
			{
				id: "",
				name: "",
				defense: "",
				soak: "",
				encumbrance: "",
				hardPoints: "",
				special: "",
			},
			{
				id: "",
				name: "",
				defense: "",
				soak: "",
				encumbrance: "",
				hardPoints: "",
				special: "",
			},
			{
				id: "",
				name: "",
				defense: "",
				soak: "",
				encumbrance: "",
				hardPoints: "",
				special: "",
			},
		]),
		availableArmor = [] as ArmorItem[],
		onAddArmor = undefined as
			| ((armor: Omit<ArmorItem, "id">) => void)
			| undefined,
	} = $props();

	let isAdding = $state(false);
	let newArmor = $state({
		name: "",
		defense: "",
		soak: "",
		encumbrance: "",
		hardPoints: "",
		special: "",
	});

	function submitArmor() {
		if (onAddArmor && newArmor.name.trim() !== "") {
			onAddArmor({ ...newArmor });
			newArmor = {
				name: "",
				defense: "",
				soak: "",
				encumbrance: "",
				hardPoints: "",
				special: "",
			};
			isAdding = false;
		}
	}
</script>

<div class="weapons-section">
	<!-- Hexagonal Header -->
	<div class="weapons-header-banner">
		<span class="weapons-banner-text">ARMOR</span>
	</div>

	<div class="weapons-block">
		<!-- Table Scroll Wrapper -->
		<div class="table-scroll-wrapper">
			<!-- Column Headers -->
		<div class="weapons-header-row">
			<div class="col-lbl left-align">ARMOR</div>
			<div></div>
			<div class="col-lbl">DEFENSE</div>
			<div></div>
			<div class="col-lbl">SOAK</div>
			<div></div>
			<div class="col-lbl">ENCUMBRANCE</div>
			<div></div>
			<div class="col-lbl">HARD POINTS</div>
			<div></div>
			<div class="col-lbl left-align" style="padding-left: 1rem;">
				SPECIAL
			</div>
		</div>

		<!-- Rows -->
		<div class="weapons-body">
				{#each armors as a, i}
					<div class="weapon-row">
						<div class="weapon-cell left">
							<select
								value={a.id || ""}
								onchange={(e) => {
									const selectedId = e.currentTarget.value;
									const selected = availableArmor.find(
										(aa) => aa.id === selectedId,
									);
									if (selected) {
										armors[i] = { ...selected };
									} else {
										armors[i] = {
											id: "",
											name: "",
											defense: "",
											soak: "",
											encumbrance: "",
											hardPoints: "",
											special: "",
										};
									}
								}}
							>
								<option value=""></option>
								{#each availableArmor as aa}
									<option value={aa.id}>{aa.name}</option>
								{/each}
							</select>
						</div>
						<div class="divider"></div>
						<div class="weapon-cell readonly-text">
							{a.defense || ""}
						</div>
						<div class="divider"></div>
						<div class="weapon-cell readonly-text">
							{a.soak || ""}
						</div>
						<div class="divider"></div>
						<div class="weapon-cell readonly-text">
							{a.encumbrance || ""}
						</div>
						<div class="divider"></div>
						<div class="weapon-cell readonly-text">
							{a.hardPoints || ""}
						</div>
						<div class="divider"></div>
						<div class="weapon-cell left readonly-text">
							{a.special || ""}
						</div>
					</div>
				{/each}

				<div class="add-row">
					<button class="btn-add" onclick={() => (isAdding = true)}>
						+ Add Global Armor
					</button>
				</div>
			</div>
		</div>

		{#if onAddArmor && isAdding}
			<div class="add-weapon-form">
				<h4 class="form-title">Create Global Armor</h4>
				<div class="form-grid">
					<div class="form-group span-2">
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label>Armor Name</label>
						<input
							type="text"
							bind:value={newArmor.name}
							placeholder="e.g. Heavy Battle Armor"
						/>
					</div>
					<div class="form-group">
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label>Defense</label>
						<input
							type="text"
							bind:value={newArmor.defense}
							placeholder="1"
						/>
					</div>
					<div class="form-group">
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label>Soak</label>
						<input
							type="text"
							bind:value={newArmor.soak}
							placeholder="+2"
						/>
					</div>
					<div class="form-group">
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label>Encum</label>
						<input
							type="text"
							bind:value={newArmor.encumbrance}
							placeholder="5"
						/>
					</div>
					<div class="form-group">
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label>Hard Pts</label>
						<input
							type="text"
							bind:value={newArmor.hardPoints}
							placeholder="4"
						/>
					</div>
					<div class="form-group span-full">
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label>Special</label>
						<input
							type="text"
							bind:value={newArmor.special}
							placeholder="e.g. Sealable"
						/>
					</div>
				</div>
				<div class="form-actions">
					<button
						class="btn-cancel"
						onclick={() => (isAdding = false)}>Cancel</button
					>
					<button
						class="btn-save"
						onclick={submitArmor}
						disabled={!newArmor.name.trim()}>Save Armor</button
					>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.weapons-section {
		position: relative;
		margin-top: 1.5rem;
		margin-bottom: 2rem;
	}

	.weapons-header-banner {
		position: absolute;
		top: -16px;
		left: 0;
		background-color: var(--color-rust);
		color: #fff;
		padding: 4px 20px 4px 10px;
		font-family: var(--font-brand);
		font-weight: 700;
		font-size: 1.1rem;
		letter-spacing: 0.1em;
		clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
		z-index: 2;
	}

	.weapons-block {
		background-color: var(--color-card-bg);
		border: 1.5px solid var(--color-line-brand);
		border-radius: 4px;
		padding-top: 1.5rem;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	/* We use a grid matching the number of columns.
	 * 1: Name (fr)
	 * 2: Divider (1px)
	 * 3: Def (50px)
	 * 4: Divider (1px)
	 * 5: Soak (50px)
	 * 6: Divider (1px)
	 * 7: Encum (80px)
	 * 8: Divider (1px)
	 * 9: HP (80px)
	 * 10: Divider (1px)
	 * 11: Special (1.5fr)
	 */
	.weapons-header-row,
	.weapon-row {
		display: grid;
		grid-template-columns: 1fr 1px 60px 1px 60px 1px 110px 1px 110px 1px 1.5fr;
	}

	.weapons-header-row {
		background-color: var(--color-bg-page);
		border-top: 1.5px solid var(--color-line-brand);
		border-bottom: 1.5px solid var(--color-line-brand);
		font-family: var(--font-brand);
		font-weight: 700;
		font-size: 0.8rem;
		color: var(--color-text-brand);
		text-align: center;
	}

	.col-lbl {
		padding: 0.4rem;
	}

	.left-align {
		text-align: left;
		padding-left: 0.5rem;
	}

	.weapon-row {
		border-bottom: 1px solid var(--color-line-brand);
	}

	.weapon-row:last-child {
		border-bottom: none;
	}

	.weapon-cell {
		padding: 0.4rem;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.weapon-cell.left {
		text-align: left;
		justify-content: flex-start;
	}

	.weapon-cell select,
	.weapon-cell input {
		width: 100%;
		background: transparent;
		border: none;
		color: var(--color-text-dark);
		font-family: var(--font-body);
		font-size: 0.95rem;
		outline: none;
	}

	.weapon-cell select {
		cursor: pointer;
		appearance: none;
		/* basic styling to look decent */
	}

	.weapon-cell select option {
		background: var(--color-bg-page);
		color: var(--color-text-dark);
	}

	.readonly-text {
		color: var(--color-text-dark);
		font-family: var(--font-body);
		font-size: 0.95rem;
	}

	.divider {
		background-color: var(--color-line-brand);
	}

	.add-row {
		padding: 0.5rem;
		display: flex;
		justify-content: center;
		border-top: 1px solid var(--color-line-brand);
		background-color: rgba(255, 255, 255, 0.02);
	}

	.btn-add {
		background: none;
		border: 1px dashed #666;
		color: #888;
		padding: 0.25rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-family: var(--font-body);
		font-size: 0.9rem;
		transition: all 0.2s;
	}

	.btn-add:hover {
		border-color: var(--color-text-brand);
		color: var(--color-text-brand);
		background: rgba(255, 255, 255, 0.05);
	}

	/* Form */
	.add-weapon-form {
		padding: 1.5rem;
		background-color: rgba(0, 0, 0, 0.15);
		border-top: 1px solid var(--color-line-brand);
	}

	.form-title {
		margin-top: 0;
		margin-bottom: 1rem;
		font-family: var(--font-brand);
		color: var(--color-text-brand);
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.span-2 {
		grid-column: span 2;
	}

	.span-full {
		grid-column: 1 / -1;
	}

	.form-group label {
		font-family: var(--font-brand);
		font-size: 0.8rem;
		color: #aaa;
	}

	.form-group input {
		background-color: rgba(255, 255, 255, 0.05);
		border: 1px solid #444;
		border-radius: 4px;
		padding: 0.5rem;
		color: white;
		font-family: var(--font-body);
	}

	.form-group input:focus {
		border-color: var(--color-text-brand);
		outline: none;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
	}

	.btn-cancel,
	.btn-save {
		padding: 0.5rem 1rem;
		border-radius: 4px;
		font-family: var(--font-brand);
		cursor: pointer;
		border: none;
	}

	.btn-cancel {
		background: transparent;
		color: #aaa;
	}

	.btn-cancel:hover {
		color: white;
	}

	.btn-save {
		background: var(--color-rust);
		color: white;
	}

	.btn-save:hover:not(:disabled) {
		filter: brightness(1.1);
	}

	.btn-save:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.table-scroll-wrapper {
			overflow-x: auto;
			overflow-y: hidden;
		}
		
		.weapons-header-row,
		.weapon-row {
			min-width: 600px; /* Minimum width to prevent squishing */
		}

		.form-grid {
			grid-template-columns: 1fr;
		}

		.span-2 {
			grid-column: 1 / -1;
		}

		.form-actions {
			width: 100%;
			justify-content: center;
		}
	}
</style>
