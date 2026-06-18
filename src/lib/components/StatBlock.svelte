<script lang="ts">
	// Svelte 5 runes for component properties
	let {
		title = "",
		type = "single", // 'single' or 'dual'
		value = $bindable(0), // for 'single'
		leftValue = $bindable(0), // for 'dual' (e.g. Threshold)
		rightValue = $bindable(0), // for 'dual' (e.g. Current)
		leftLabel = "THRESHOLD",
		rightLabel = "CURRENT",
	} = $props();

	// Restrict inputs to numbers >= 0
	function enforceMin(e: Event, binding: "val" | "left" | "right") {
		const target = e.target as HTMLInputElement;
		let val = parseInt(target.value) || 0;
		if (val < 0) val = 0;

		if (binding === "val") value = val;
		else if (binding === "left") leftValue = val;
		else if (binding === "right") rightValue = val;
	}
</script>

<div class="stat-wrapper">
	<!-- Decorative background oval (split color or solid) -->
	<div
		class="stat-bg {type}"
		class:single-bg={type === "single"}
		class:dual-bg={type === "dual"}
	></div>

	<!-- Octagonal chamfer card with parent-child clipping for border drawing -->
	<div class="stat-card-border">
		<div class="stat-card-content">
			<!-- Header Title Banner -->
			<div class="stat-header">
				{title}
			</div>

			<!-- Input Body area -->
			<div class="stat-body">
				{#if type === "single"}
					<div class="input-container single-input">
						<input
							type="number"
							{value}
							oninput={(e) => enforceMin(e, "val")}
							class="stat-input"
							min="0"
							aria-label={title}
						/>
					</div>
				{:else}
					<div class="input-container dual-input-left">
						<input
							type="number"
							value={leftValue}
							oninput={(e) => enforceMin(e, "left")}
							class="stat-input"
							min="0"
							aria-label="{title} {leftLabel}"
						/>
					</div>

					<div class="stat-divider"></div>

					<div class="input-container dual-input-right">
						<input
							type="number"
							value={rightValue}
							oninput={(e) => enforceMin(e, "right")}
							class="stat-input"
							min="0"
							aria-label="{title} {rightLabel}"
						/>
					</div>
				{/if}
			</div>

			<!-- Footer labels (for dual attributes) -->
			{#if type === "dual"}
				<div class="stat-footers">
					<div class="footer-label left">
						{leftLabel}
					</div>
					<div class="footer-label right">
						{rightLabel}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Design Tokens */
	:root {
		--color-rust: #9a2826;
		--color-blue-steel: #134074;
		--color-gold-orange: #d6802b;
	}

	.stat-wrapper {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 200px;
		height: 130px;
		user-select: none;
	}

	/* Oval backdrop styled like the original Genesys sheet */
	.stat-bg {
		position: absolute;
		z-index: 1;
		width: 182px;
		height: 98px;
		border-radius: 91px / 49px; /* Seamless oval curve */
		border: 3.5px solid var(--color-gold-orange);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
		pointer-events: none;
	}

	.single-bg {
		background-color: var(--color-rust);
	}

	.dual-bg {
		background: linear-gradient(
			90deg,
			var(--color-rust) 50%,
			var(--color-blue-steel) 50%
		);
	}

	/* Card Border via Parent-Child Clipping */
	.stat-card-border {
		position: relative;
		z-index: 2;
		width: 166px;
		height: 104px;
		background-color: var(--color-line-brand);
		padding: 1.5px;
		/* Sci-fi/RPG chamfered octagonal clip path */
		clip-path: polygon(
			12px 0,
			calc(100% - 12px) 0,
			100% 12px,
			100% calc(100% - 12px),
			calc(100% - 12px) 100%,
			12px 100%,
			0 calc(100% - 12px),
			0 12px
		);
	}

	.stat-card-content {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background-color: var(--color-card-bg);
		clip-path: inherit; /* Inherit the exact octagonal shape */
	}

	/* Title Banner */
	.stat-header {
		background-color: var(--color-rust);
		color: white;
		font-family: var(--font-brand);
		font-size: 1.05rem;
		font-weight: 700;
		text-align: center;
		padding: 0.2rem 0;
		border-bottom: 1.5px solid var(--color-line-brand);
		letter-spacing: 0.03em;
	}

	/* Inner body */
	.stat-body {
		display: flex;
		flex-grow: 1;
		background-color: var(--color-card-bg);
	}

	.input-container {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 100%;
		transition: background-color 0.2s ease;
	}

	.input-container:focus-within {
		background-color: rgba(214, 128, 43, 0.05); /* subtle gold focus glow */
	}

	/* Vertical line divider in dual layout */
	.stat-divider {
		width: 1.5px;
		background-color: var(--color-line-brand);
		height: 100%;
	}

	/* Styled number inputs */
	.stat-input {
		font-family: var(--font-brand);
		font-size: 2.2rem;
		font-weight: 700;
		text-align: center;
		color: var(--color-text-dark);
		border: none;
		outline: none;
		background: transparent;
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
	}

	/* Hide default number input spinner buttons */
	.stat-input::-webkit-outer-spin-button,
	.stat-input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.stat-input[type="number"] {
		-moz-appearance: textfield;
		appearance: textfield;
	}

	/* Footer labels */
	.stat-footers {
		display: flex;
		border-top: 1.5px solid var(--color-line-brand);
		height: 20px;
	}

	.footer-label {
		font-family: var(--font-brand);
		font-size: 0.72rem;
		font-weight: 700;
		color: white;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 100%;
		letter-spacing: 0.02em;
	}

	.footer-label.left {
		background-color: var(--color-rust);
	}

	.footer-label.right {
		background-color: var(--color-blue-steel);
		border-left: 1.5px solid var(--color-line-brand);
	}
</style>
