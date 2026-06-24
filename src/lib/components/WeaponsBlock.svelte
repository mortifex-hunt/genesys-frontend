<script lang="ts">
	import ItemSelectionModal from "./ItemSelectionModal.svelte";

	interface WeaponItem {
		id?: string;
		name: string;
		skill: string;
		damage: string;
		crit: string;
		range: string;
		special: string;
	}

	let {
		weapons = $bindable<WeaponItem[]>([
			{
				id: "",
				name: "",
				skill: "",
				damage: "",
				crit: "",
				range: "",
				special: "",
			},
			{
				id: "",
				name: "",
				skill: "",
				damage: "",
				crit: "",
				range: "",
				special: "",
			},
			{
				id: "",
				name: "",
				skill: "",
				damage: "",
				crit: "",
				range: "",
				special: "",
			},
		]),
		availableWeapons = [] as WeaponItem[],
		onAddWeapon = undefined as
			| ((weapon: Omit<WeaponItem, "id">) => void)
			| undefined,
	} = $props();

	let isAdding = $state(false);
	let newWeapon = $state({
		name: "",
		skill: "",
		damage: "",
		crit: "",
		range: "",
		special: "",
	});

	let isModalOpen = $state(false);
	let activeRowIndex = $state<number | null>(null);

	function submitWeapon() {
		if (onAddWeapon && newWeapon.name.trim() !== "") {
			onAddWeapon({ ...newWeapon });
			newWeapon = {
				name: "",
				skill: "",
				damage: "",
				crit: "",
				range: "",
				special: "",
			};
			isAdding = false;
		}
	}

	function handleSelect(item: WeaponItem | null) {
		if (activeRowIndex !== null) {
			if (item) {
				weapons[activeRowIndex] = { ...item };
			} else {
				weapons[activeRowIndex] = {
					id: "",
					name: "",
					skill: "",
					damage: "",
					crit: "",
					range: "",
					special: "",
				};
			}
		}
	}
</script>

<div class="weapons-section">
	<!-- Hexagonal Header -->
	<div class="weapons-header-banner">
		<span class="weapons-banner-text">WEAPONS</span>
	</div>

	<div class="weapons-block">
		<!-- Table Scroll Wrapper -->
		<div class="table-scroll-wrapper">
			<!-- Column Headers -->
		<div class="weapons-header-row">
			<div class="col-lbl left-align">WEAPON</div>
			<div></div>
			<div class="col-lbl">SKILL</div>
			<div></div>
			<div class="col-lbl">DAMAGE</div>
			<div></div>
			<div class="col-lbl">CRIT</div>
			<div></div>
			<div class="col-lbl">RANGE</div>
			<div></div>
			<div class="col-lbl left-align" style="padding-left: 1rem;">
				SPECIAL
			</div>
		</div>

		<!-- Rows -->
		<div class="weapons-body">
			{#each weapons as w, i}
				<div class="weapon-row">
					<div class="weapon-cell left">
						<button class="weapon-select-btn" onclick={() => { activeRowIndex = i; isModalOpen = true; }}>
							{w.name || "Select Weapon..."}
						</button>
					</div>
					<div class="divider"></div>
					<div class="weapon-cell readonly-text">
						{w.skill || ""}
					</div>
					<div class="divider"></div>
					<div class="weapon-cell readonly-text">
						{w.damage || ""}
					</div>
					<div class="divider"></div>
					<div class="weapon-cell readonly-text">
						{w.crit || ""}
					</div>
					<div class="divider"></div>
					<div class="weapon-cell readonly-text">
						{w.range || ""}
					</div>
					<div class="divider"></div>
					<div class="weapon-cell left readonly-text">
						{w.special || ""}
					</div>
				</div>
				{#if i < weapons.length - 1}
					<div class="row-divider"></div>
				{/if}
			{/each}
		</div>
		</div>

		{#if onAddWeapon}
			<div class="add-weapon-section">
				{#if !isAdding}
					<button class="add-btn" onclick={() => (isAdding = true)}
						>+ Add Global Weapon</button
					>
				{:else}
					<div class="add-weapon-form">
						<input
							type="text"
							placeholder="Weapon Name"
							bind:value={newWeapon.name}
						/>
						<input
							type="text"
							placeholder="Skill"
							bind:value={newWeapon.skill}
						/>
						<input
							type="text"
							placeholder="Damage"
							bind:value={newWeapon.damage}
						/>
						<input
							type="text"
							placeholder="Crit"
							bind:value={newWeapon.crit}
						/>
						<input
							type="text"
							placeholder="Range"
							bind:value={newWeapon.range}
						/>
						<input
							type="text"
							placeholder="Special"
							bind:value={newWeapon.special}
						/>
						<div class="form-actions">
							<button class="save-btn" onclick={submitWeapon}
								>Save</button
							>
							<button
								class="cancel-btn"
								onclick={() => (isAdding = false)}
								>Cancel</button
							>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<ItemSelectionModal
	bind:isOpen={isModalOpen}
	title="Select Weapon"
	items={availableWeapons}
	onSelect={handleSelect}
>
	{#snippet header()}
		<div class="weapons-header-row" style="margin: 0; padding: 0 0.5rem;">
			<div class="col-lbl left-align">WEAPON</div>
			<div></div>
			<div class="col-lbl">SKILL</div>
			<div></div>
			<div class="col-lbl">DAMAGE</div>
			<div></div>
			<div class="col-lbl">CRIT</div>
			<div></div>
			<div class="col-lbl">RANGE</div>
			<div></div>
			<div class="col-lbl left-align" style="padding-left: 1rem;">
				SPECIAL
			</div>
		</div>
	{/snippet}
	{#snippet row(w)}
		<div class="weapon-row" style="border: none; width: 100%;">
			<div class="weapon-cell left" style="font-weight: 600; color: var(--color-text-brand);">{w.name}</div>
			<div class="divider"></div>
			<div class="weapon-cell readonly-text">{w.skill || ""}</div>
			<div class="divider"></div>
			<div class="weapon-cell readonly-text">{w.damage || ""}</div>
			<div class="divider"></div>
			<div class="weapon-cell readonly-text">{w.crit || ""}</div>
			<div class="divider"></div>
			<div class="weapon-cell readonly-text">{w.range || ""}</div>
			<div class="divider"></div>
			<div class="weapon-cell left readonly-text">{w.special || ""}</div>
		</div>
	{/snippet}
</ItemSelectionModal>

<style>
	.weapons-section {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 900px;
		margin: 1.5rem auto;
		position: relative;
	}

	.weapons-header-banner {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 160px;
		height: 30px;
		background-color: var(--color-card-bg);
		color: var(--color-text-brand);
		margin: 0 auto;
		margin-bottom: -15px; /* Overlap the box below */
		clip-path: polygon(
			15px 0,
			calc(100% - 15px) 0,
			100% 50%,
			calc(100% - 15px) 100%,
			15px 100%,
			0 50%
		);
		z-index: 2;
	}

	.weapons-banner-text {
		font-family: var(--font-brand);
		font-size: 1.1rem;
		font-weight: 700;
		letter-spacing: 0.08em;
	}

	.weapons-block {
		background-color: var(--color-card-bg);
		background-image: var(--bg-cross-pattern);
		background-size: 60px 104px;
		border-radius: 8px;
		padding: 2rem 1.5rem 1.5rem 1.5rem;
		box-shadow: var(--shadow-premium);
		border: 1.5px solid var(--color-line-brand);
		min-width: 0;
	}

	.weapons-header-row,
	.weapon-row {
		display: grid;
		grid-template-columns: 2.5fr 1.5px 1.5fr 1.5px 1fr 1.5px 1fr 1.5px 1.5fr 1.5px 3fr;
	}

	.weapons-header-row {
		margin-bottom: 2px;
		padding: 0 0.5rem; /* Match body inner padding slightly */
	}

	.col-lbl {
		font-family: var(--font-brand);
		font-size: 0.85rem;
		font-weight: 700;
		color: #64748b;
		text-align: center;
		letter-spacing: 0.02em;
	}

	.col-lbl.left-align {
		text-align: left;
		padding-left: 0.5rem;
	}

	.weapons-body {
		background-color: var(--color-card-bg);
		border: 1.5px solid var(--color-line-brand);
		border-radius: 2px;
	}

	.weapon-row {
		align-items: stretch;
		height: 40px;
	}

	.weapon-cell {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.weapon-cell select,
	.weapon-select-btn {
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
		background: transparent;
		font-family: var(--font-body);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--color-text-dark);
		text-align: center;
		padding: 0 0.5rem;
		cursor: pointer;
	}

	.weapon-cell select {
		background-color: var(--color-card-bg);
		text-align-last: center;
		appearance: none;
		-webkit-appearance: none;
	}

	.weapon-cell.left select,
	.weapon-cell.left .weapon-select-btn {
		text-align: left;
		text-align-last: left;
	}

	.weapon-select-btn:hover {
		color: var(--color-text-brand);
	}

	.divider {
		width: 1.5px;
		background-color: var(--color-line-brand);
		height: 60%;
		align-self: center;
	}

	.row-divider {
		width: 100%;
		height: 1px;
		background-image: linear-gradient(
			to right,
			var(--color-line-brand) 50%,
			transparent 50%
		);
		background-size: 6px 1px;
		background-repeat: repeat-x;
	}

	.add-weapon-section {
		margin-top: 1rem;
		text-align: center;
	}

	.add-btn {
		background: none;
		border: 1px dashed var(--color-line-brand);
		color: var(--color-text-brand);
		font-family: var(--font-brand);
		font-size: 0.85rem;
		font-weight: 600;
		padding: 0.5rem 1rem;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.add-btn:hover {
		background-color: var(--color-bg-brand-light);
		color: var(--color-bg-brand);
		border-color: var(--color-bg-brand);
	}

	.add-weapon-form {
		display: grid;
		grid-template-columns: 2.5fr 1.5fr 1fr 1fr 1.5fr 3fr auto;
		gap: 0.5rem;
		background-color: var(--color-card-bg);
		border: 1px solid var(--color-line-brand);
		padding: 0.5rem;
		border-radius: 4px;
	}

	.add-weapon-form input {
		width: 100%;
		border: 1px solid var(--color-line-brand);
		background: transparent;
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--color-text-dark);
		padding: 0.25rem 0.5rem;
		border-radius: 2px;
	}

	.form-actions {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.save-btn,
	.cancel-btn {
		border: none;
		font-size: 0.75rem;
		cursor: pointer;
		border-radius: 2px;
		padding: 0.2rem 0.5rem;
		font-family: var(--font-brand);
		font-weight: 600;
	}

	.save-btn {
		background-color: var(--color-text-brand);
		color: white;
	}

	.cancel-btn {
		background-color: transparent;
		border: 1px solid var(--color-line-brand);
		color: var(--color-text-brand);
	}

	.add-weapon-form input:focus {
		border-color: var(--color-focus);
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

		.add-weapon-form {
			flex-direction: column;
		}

		.add-weapon-form input {
			width: 100%;
		}

		.form-actions {
			width: 100%;
			justify-content: center;
		}
	}
</style>
