<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		tooltipBody,
		direction = "top",
		class: className = ""
	}: {
		children: Snippet;
		tooltipBody?: Snippet;
		direction?: "top" | "bottom" | "left" | "right";
		class?: string;
	} = $props();

	let isHovered = $state(false);
</script>

<div 
	class="tooltip-wrapper {className}"
	onmouseenter={() => isHovered = true}
	onmouseleave={() => isHovered = false}
>
	{@render children()}
	
	{#if isHovered && tooltipBody}
		<div class="tooltip-popover {direction}">
			<div class="tooltip-inner">
				{@render tooltipBody()}
			</div>
		</div>
	{/if}
</div>

<style>
	.tooltip-wrapper {
		position: relative;
		display: inline-flex;
		align-items: center;
	}

	.tooltip-wrapper:hover {
		z-index: 9999;
	}

	.tooltip-popover {
		position: absolute;
		z-index: 1000;
		width: max-content;
		max-width: 350px;
		pointer-events: none;
		animation: fadeIn 0.15s ease-out;
		color: #e2e8f0;
		font-family: var(--font-body);
		font-size: 0.85rem;
		line-height: 1.4;
		text-align: left;
		text-transform: none;
		letter-spacing: normal;
	}

	.tooltip-inner {
		background: rgba(15, 23, 42, 0.95);
		backdrop-filter: blur(8px);
		border: 1px solid var(--color-line-brand);
		border-radius: 6px;
		padding: 0.75rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
	}

	.tooltip-popover.top {
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%) translateY(-8px);
	}

	.tooltip-popover.bottom {
		top: 100%;
		left: 50%;
		transform: translateX(-50%) translateY(8px);
	}

	.tooltip-popover.left {
		right: 100%;
		top: 50%;
		transform: translateY(-50%) translateX(-8px);
	}

	.tooltip-popover.right {
		left: 100%;
		top: 50%;
		transform: translateY(-50%) translateX(8px);
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	/* Reset some child styles that might inherit from parent buttons/headers */
	.tooltip-inner :global(p) {
		margin: 0 0 0.5rem 0;
	}
	.tooltip-inner :global(p:last-child) {
		margin: 0;
	}
	.tooltip-inner :global(h4) {
		margin: 0 0 0.25rem 0;
		color: var(--color-text-brand);
		font-family: var(--font-brand);
		font-size: 0.9rem;
	}
	.tooltip-inner :global(ul) {
		margin: 0 0 0.5rem 0;
		padding-left: 1.2rem;
	}
</style>
