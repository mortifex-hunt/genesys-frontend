<script lang="ts">
	// Svelte 5 runes for component state
	let {
		characterName = $bindable(''),
		speciesArchetype = $bindable(''),
		career = $bindable(''),
		player = $bindable('')
	} = $props();
</script>

<div class="character-card">
	<div class="header-row">
		<span class="header-title">CHARACTER</span>
	</div>
	
	<div class="input-row">
		<label for="char-name" class="input-label">CHARACTER NAME:</label>
		<input 
			id="char-name"
			type="text" 
			bind:value={characterName} 
			class="input-field" 
			placeholder="Enter character name"
			autocomplete="off"
		/>
	</div>
	
	<div class="input-row">
		<label for="char-species" class="input-label">SPECIES/ARCHETYPE:</label>
		<input 
			id="char-species"
			type="text" 
			bind:value={speciesArchetype} 
			class="input-field" 
			placeholder="Enter species or archetype"
			autocomplete="off"
		/>
	</div>
	
	<div class="input-row">
		<label for="char-career" class="input-label">CAREER:</label>
		<input 
			id="char-career"
			type="text" 
			bind:value={career} 
			class="input-field" 
			placeholder="Enter career"
			autocomplete="off"
		/>
	</div>
	
	<div class="input-row last-row">
		<label for="char-player" class="input-label">PLAYER:</label>
		<input 
			id="char-player"
			type="text" 
			bind:value={player} 
			class="input-field" 
			placeholder="Enter player name"
			autocomplete="off"
		/>
	</div>
	
	<div class="footer-spacing"></div>
</div>

<style>
	.character-card {
		width: 100%;
		max-width: 900px;
		background-color: var(--color-card-bg);
		/* Precise mathematical SVG isogrid pattern, seamless and vector-sharp */
		background-image: var(--bg-cross-pattern);
		background-size: 60px 104px;
		border: 1.5px solid var(--color-line-brand);
		border-radius: 8px;
		box-shadow: var(--shadow-premium);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.header-row {
		padding: 1.25rem 1.5rem 0.5rem 1.5rem;
		display: flex;
		align-items: center;
	}

	.header-title {
		font-family: var(--font-brand);
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--color-text-brand);
		letter-spacing: 0.06em;
		opacity: 0.85;
	}

	.input-row {
		display: flex;
		align-items: baseline;
		padding: 0.75rem 1.5rem;
		border-bottom: 1.5px solid var(--color-line-brand);
		position: relative;
		transition: background-color 0.2s ease, border-bottom-color 0.2s ease;
	}

	/* Left vertical highlight indicator on focus */
	.input-row::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		background-color: var(--color-focus);
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.input-row:focus-within::before {
		opacity: 1;
	}

	.input-row:focus-within {
		background-color: rgba(63, 82, 93, 0.04);
		border-bottom-color: var(--color-focus);
	}

	.input-label {
		font-family: var(--font-brand);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-brand);
		letter-spacing: 0.02em;
		white-space: nowrap;
		margin-right: 0.5rem;
		user-select: none;
	}

	.input-field {
		font-family: var(--font-body);
		font-size: 1.15rem;
		font-weight: 500;
		color: var(--color-text-dark);
		background: transparent;
		border: none;
		outline: none;
		flex-grow: 1;
		padding: 0.1rem 0;
		letter-spacing: 0.01em;
	}

	.input-field::placeholder {
		color: rgba(63, 82, 93, 0.35);
		font-weight: 400;
		font-style: italic;
	}

	.footer-spacing {
		height: 1.25rem;
	}

	/* Micro-animations */
	@media (prefers-reduced-motion: reduce) {
		.input-row,
		.input-row::before {
			transition: none;
		}
	}
</style>
