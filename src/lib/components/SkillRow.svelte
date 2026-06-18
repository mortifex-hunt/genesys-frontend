<script lang="ts">
	// Props for Svelte 5 component state
	let {
		name = '',
		characteristic = '',
		rank = $bindable(0),
		career = $bindable(false),
		setting = $bindable(false)
	} = $props();

	// Set rank toggle handler
	function handleRankClick(index: number) {
		if (rank === index) {
			rank = 0; // Toggle off to 0
		} else {
			rank = index; // Set rank
		}
	}
</script>

<div class="skill-row" class:has-rank={rank > 0}>
	<!-- Left side: Name and Characteristic -->
	<div class="skill-name-col">
		<span class="skill-name">{name}</span>
		<span class="skill-characteristic">({characteristic})</span>
	</div>

	<!-- Middle: Setting checkbox -->
	<div class="setting-col">
		<label class="custom-checkbox circle-checkbox">
			<input type="checkbox" bind:checked={setting} aria-label="Setting Skill" />
			<span class="checkmark"></span>
		</label>
	</div>

	<!-- Middle: Career checkbox -->
	<div class="career-col">
		<label class="custom-checkbox square-checkbox">
			<input type="checkbox" bind:checked={career} aria-label="Career Skill" />
			<span class="checkmark"></span>
		</label>
	</div>

	<!-- Right side: 5 Diamonds Rank Indicator -->
	<div class="rank-col">
		{#each Array(5) as _, i}
			{@const diamondIndex = i + 1}
			<button
				type="button"
				class="rank-diamond-btn"
				class:active={rank >= diamondIndex}
				onclick={() => handleRankClick(diamondIndex)}
				aria-label="Set Rank {diamondIndex}"
			>
				<svg class="diamond-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect 
						x="6" 
						y="6" 
						width="12" 
						height="12" 
						rx="1"
						transform="rotate(45 12 12)" 
						stroke="currentColor" 
						stroke-width="2"
						fill={rank >= diamondIndex ? "currentColor" : "transparent"}
					/>
				</svg>
			</button>
		{/each}
	</div>
</div>

<style>
	.skill-row {
		display: flex;
		align-items: center;
		padding: 0.35rem 0.75rem;
		border-bottom: 1px dashed rgba(63, 82, 93, 0.15);
		transition: background-color 0.2s ease;
	}

	.skill-row:hover {
		background-color: rgba(63, 82, 93, 0.04);
	}

	.skill-row.has-rank {
		background-color: rgba(63, 82, 93, 0.02);
	}

	/* Name Column */
	.skill-name-col {
		flex: 2;
		display: flex;
		align-items: baseline;
		gap: 0.35rem;
		min-width: 150px;
	}

	.skill-name {
		font-family: var(--font-brand);
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--color-text-brand);
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.skill-characteristic {
		font-family: var(--font-brand);
		font-size: 0.75rem;
		font-weight: 700;
		color: #94a3b8;
		text-transform: uppercase;
	}

	/* Custom Checkbox Toggles (Setting and Career) */
	.setting-col,
	.career-col {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		min-width: 60px;
	}

	.custom-checkbox {
		display: block;
		position: relative;
		width: 20px;
		height: 20px;
		cursor: pointer;
		user-select: none;
	}

	/* Hide the default browser checkbox */
	.custom-checkbox input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
	}

	/* Create a custom checkmark container */
	.checkmark {
		position: absolute;
		top: 0;
		left: 0;
		height: 20px;
		width: 20px;
		border: 1.5px dashed var(--color-line-brand);
		background-color: transparent;
		transition: all 0.2s ease;
	}

	/* Circle checkbox (Setting) styling */
	.circle-checkbox .checkmark {
		border-radius: 50%;
	}

	/* Square checkbox (Career) styling */
	.square-checkbox .checkmark {
		border-radius: 4px;
	}

	/* On hover, increase border opacity */
	.custom-checkbox:hover input ~ .checkmark {
		border-color: var(--color-focus);
	}

	/* When checked, fill with brand text color and show check icon/dot */
	.custom-checkbox input:checked ~ .checkmark {
		background-color: var(--color-text-brand);
		border-style: solid;
		border-color: var(--color-text-brand);
	}

	/* Dotted center for Setting checkbox when checked */
	.circle-checkbox input:checked ~ .checkmark::after {
		content: "";
		position: absolute;
		left: 5px;
		top: 5px;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background-color: white;
	}

	/* White checkmark check indicator for Career checkbox when checked */
	.square-checkbox input:checked ~ .checkmark::after {
		content: "";
		position: absolute;
		left: 6px;
		top: 3px;
		width: 5px;
		height: 9px;
		border: solid white;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}

	/* Ranks Column with SVG Diamonds */
	.rank-col {
		flex: 2;
		display: flex;
		justify-content: flex-end;
		gap: 0.3rem;
		min-width: 130px;
	}

	.rank-diamond-btn {
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
		width: 22px;
		height: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-line-brand);
		transition: color 0.15s ease, transform 0.1s ease;
		outline: none;
	}

	.rank-diamond-btn:hover {
		color: var(--color-focus);
		transform: scale(1.15);
	}

	.rank-diamond-btn.active {
		color: var(--color-text-brand);
	}

	.diamond-svg {
		width: 100%;
		height: 100%;
	}
</style>
