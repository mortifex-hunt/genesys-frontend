<script lang="ts">
	interface Motivations {
		strength: string;
		flaw: string;
		desire: string;
		fear: string;
	}

	let {
		motivations = $bindable<Motivations>({
			strength: "",
			flaw: "",
			desire: "",
			fear: "",
		}),
	} = $props();
</script>

<div class="motivations-container">
	<div class="block-header">MOTIVATIONS</div>
	<div class="motivations-grid">
		<div class="motivation-cell">
			<label for="strength-input">STRENGTH:</label>
			<textarea
				id="strength-input"
				bind:value={motivations.strength}
			></textarea>
		</div>
		<div class="motivation-cell">
			<label for="flaw-input">FLAW:</label>
			<textarea id="flaw-input" bind:value={motivations.flaw}></textarea>
		</div>
		<div class="motivation-cell">
			<label for="desire-input">DESIRE:</label>
			<textarea
				id="desire-input"
				bind:value={motivations.desire}
			></textarea>
		</div>
		<div class="motivation-cell">
			<label for="fear-input">FEAR:</label>
			<textarea id="fear-input" bind:value={motivations.fear}></textarea>
		</div>
	</div>
</div>

<style>
	.motivations-container {
		background-color: var(--color-card-bg);
		border: 1.5px solid var(--color-line-brand);
		border-radius: 4px;
		display: flex;
		flex-direction: column;
		position: relative;
		margin-bottom: 1rem;
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

	.motivations-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5px;
		background-color: var(--color-line-brand);
	}

	.motivation-cell {
		background-color: var(--color-card-bg);
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		min-height: 120px;
	}

	.motivation-cell label {
		font-family: var(--font-brand);
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-text-brand);
		margin-bottom: 0.25rem;
	}

	.motivation-cell textarea {
		width: 100%;
		flex-grow: 1;
		background: transparent;
		border: none;
		resize: none;
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--color-text-dark);
		outline: none;
		line-height: 1.4;
	}
</style>
