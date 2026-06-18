<script lang="ts">
    import { theme, toggleTheme } from "$lib/stores/theme";

    // SVG Icons
    const SunIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-icon"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const MoonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
</script>

<button
    type="button"
    class="theme-button"
    onclick={toggleTheme}
    onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") toggleTheme();
    }}
    aria-label="Toggle theme"
>
    {#if $theme === "dark"}
        {@html SunIcon}
    {:else}
        {@html MoonIcon}
    {/if}
</button>

<style>
    .theme-button {
        position: absolute;
        top: 15px;
        right: 15px;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 45px;
        height: 45px;
        border: none;
        border-radius: 50%;
        background-color: var(--color-panel-bg, var(--color-card-bg));
        color: var(--color-text-main, #333);
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        padding: 0;
        outline: none;
    }

    .theme-button:hover {
        transform: translateY(-2px);
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        background-color: var(--color-bg, #f8fafc);
        color: var(--color-brand-primary, #3b82f6);
    }

    .theme-button:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    }

    :global(.theme-icon) {
        width: 20px;
        height: 20px;
    }
</style>
