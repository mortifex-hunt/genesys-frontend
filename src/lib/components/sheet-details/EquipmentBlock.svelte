<script lang="ts">
	interface Equipment {
		money: string;
		weaponsAndArmor: string;
		personalGear: string;
	}

	let {
		equipment = $bindable<Equipment>({
			money: "",
			weaponsAndArmor: "",
			personalGear: "",
		}),
	} = $props();
</script>

<div class="equipment-container">
	<div class="block-header">EQUIPMENT LOG</div>
	
	<div class="money-row">
		<label for="money-input">MONEY:</label>
		<input id="money-input" type="text" bind:value={equipment.money} />
	</div>

	<div class="gear-grid">
		<div class="gear-cell">
			<label for="weapons-armor-input">WEAPONS & ARMOR:</label>
			<textarea
				id="weapons-armor-input"
				bind:value={equipment.weaponsAndArmor}
			></textarea>
		</div>
		<div class="gear-cell">
			<label for="personal-gear-input">PERSONAL GEAR:</label>
			<textarea
				id="personal-gear-input"
				bind:value={equipment.personalGear}
			></textarea>
		</div>
	</div>
</div>

<style>
	.equipment-container {
		background-color: var(--color-card-bg);
		border: 1.5px solid var(--color-line-brand);
		border-radius: 4px;
		display: flex;
		flex-direction: column;
		position: relative;
		margin-bottom: 1rem;
		padding: 1rem;
		gap: 0.75rem;
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

	.money-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background-color: var(--color-card-bg);
		border: 1.5px solid var(--color-line-brand);
		padding: 0.25rem 0.5rem;
		width: 50%;
	}

	.money-row label {
		font-family: var(--font-brand);
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-text-brand);
	}

	.money-row input {
		flex-grow: 1;
		background: transparent;
		border: none;
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--color-text-dark);
		outline: none;
	}

	.gear-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5px;
		background-color: var(--color-line-brand);
		border: 1.5px solid var(--color-line-brand);
	}

	.gear-cell {
		background-color: var(--color-card-bg);
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		min-height: 180px;
	}

	.gear-cell label {
		font-family: var(--font-brand);
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-text-brand);
		margin-bottom: 0.25rem;
		border-bottom: 1px solid var(--color-line-brand);
		padding-bottom: 0.25rem;
	}

	.gear-cell textarea {
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
	}
</style>
