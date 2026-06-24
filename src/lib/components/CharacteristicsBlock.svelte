<script lang="ts">
	import Tooltip from './Tooltip.svelte';
	let {
		brawn = $bindable(2),
		agility = $bindable(2),
		intellect = $bindable(2),
		cunning = $bindable(2),
		willpower = $bindable(2),
		presence = $bindable(2),
		globalCharacteristics = [] as any[]
	} = $props();

	// Array for rendering the layout
	const chars = [
		{ id: 'brawn', label: 'BRAWN', bind: () => brawn, set: (v: number) => brawn = v },
		{ id: 'agility', label: 'AGILITY', bind: () => agility, set: (v: number) => agility = v },
		{ id: 'intellect', label: 'INTELLECT', bind: () => intellect, set: (v: number) => intellect = v },
		{ id: 'cunning', label: 'CUNNING', bind: () => cunning, set: (v: number) => cunning = v },
		{ id: 'willpower', label: 'WILLPOWER', bind: () => willpower, set: (v: number) => willpower = v },
		{ id: 'presence', label: 'PRESENCE', bind: () => presence, set: (v: number) => presence = v },
	];

	function getCharData(label: string) {
		return globalCharacteristics.find(c => c.name.toLowerCase() === label.toLowerCase());
	}
</script>

<div class="characteristics-container">
	<div class="header-banner">
		<span>CHARACTERISTICS</span>
	</div>
	
	<!-- Background orange line connecting them all -->
	<div class="connection-bar"></div>

	<div class="characteristics-row">
		{#each chars as char}
			{@const charData = getCharData(char.label)}
			<Tooltip direction="bottom" class="char-module-wrapper">
				<div class="char-module">
					<!-- Circle for value -->
					<div class="char-circle">
						<input 
							type="number" 
							min="1" 
							max="6" 
							value={char.bind()} 
							oninput={(e) => char.set(parseInt(e.currentTarget.value) || 0)}
						/>
					</div>
					<!-- Blue base shape for label -->
					<div class="char-base">
						{char.label}
					</div>
				</div>
				{#snippet tooltipBody()}
					{#if charData?.data?.description}
						<h4>{charData.name}</h4>
						{#each charData.data.description as p}
							<p>{p}</p>
						{/each}
					{:else}
						<p>{char.label}</p>
					{/if}
				{/snippet}
			</Tooltip>
		{/each}
	</div>
</div>

<style>
	.characteristics-container {
		position: relative;
		margin: 2rem 0;
		padding-top: 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	.header-banner {
		position: absolute;
		top: -0.5rem;
		background-color: var(--color-bg-dark, #2b3340);
		color: #fff;
		padding: 4px 30px;
		font-family: var(--font-brand);
		font-size: 0.9rem;
		font-weight: 700;
		letter-spacing: 1px;
		clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 100%, 0 100%);
		z-index: 2;
	}

	/* The orange connecting bar going across the background */
	.connection-bar {
		position: absolute;
		top: 60%;
		left: 2%;
		right: 2%;
		height: 35px;
		background-color: var(--color-rust, #da7a28);
		border-radius: 18px;
		z-index: 0;
	}

	.characteristics-row {
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 0 1rem;
		z-index: 1;
		gap: 0.5rem;
	}

	:global(.char-module-wrapper) {
		flex: 1;
		max-width: 120px;
		display: flex !important;
		justify-content: center;
	}

	.char-module {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		width: 100%;
	}

	.char-circle {
		width: 70px;
		height: 70px;
		background-color: #fff;
		border: 3px solid #1c5280;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		z-index: 2;
		margin-bottom: -15px; /* Overlaps with the base */
		box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0,0,0,0.3);
	}

	/* Target crosshairs decoration inside circle */
	.char-circle::before, .char-circle::after {
		content: '';
		position: absolute;
		background-color: rgba(0,0,0,0.05);
		z-index: -1;
	}
	.char-circle::before {
		width: 100%;
		height: 1px;
		top: 50%;
	}
	.char-circle::after {
		height: 100%;
		width: 1px;
		left: 50%;
	}

	.char-circle input {
		width: 100%;
		text-align: center;
		font-family: var(--font-brand);
		font-size: 2rem;
		font-weight: 700;
		color: #1c5280;
		border: none;
		background: transparent;
		outline: none;
		/* Remove arrows */
		-moz-appearance: textfield;
	}
	.char-circle input::-webkit-outer-spin-button,
	.char-circle input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.char-base {
		width: 100%;
		background: linear-gradient(180deg, #18466e 0%, #0d2840 100%);
		border: 2px solid #fff;
		color: #fff;
		font-family: var(--font-brand);
		font-size: 0.9rem;
		font-weight: 700;
		text-align: center;
		padding: 20px 5px 8px 5px;
		/* Shape with cut corners */
		clip-path: polygon(
			15% 0, 
			85% 0, 
			100% 20%, 
			100% 100%, 
			0 100%, 
			0 20%
		);
		box-shadow: 0 4px 6px rgba(0,0,0,0.3);
	}

	@media (max-width: 768px) {
		.characteristics-row {
			padding: 0 0.25rem;
			gap: 0.25rem;
		}
		.char-circle {
			width: 50px;
			height: 50px;
			margin-bottom: -10px;
		}
		.char-circle input {
			font-size: 1.5rem;
		}
		.char-base {
			font-size: 0.65rem;
			padding: 15px 2px 6px 2px;
		}
		.connection-bar {
			top: 55%;
			height: 25px;
		}
	}

	@media (max-width: 400px) {
		.characteristics-row {
			gap: 0.15rem;
		}
		.char-circle {
			width: 44px;
			height: 44px;
		}
		.char-circle input {
			font-size: 1.25rem;
		}
		.char-base {
			font-size: 0.55rem;
			padding: 12px 1px 4px 1px;
		}
		.connection-bar {
			height: 20px;
		}
	}
</style>
