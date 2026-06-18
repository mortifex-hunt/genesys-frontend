<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { auth } from '$lib/stores/auth';
	import { theme } from '$lib/stores/theme';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	onMount(() => {
		const unsubscribeAuth = auth.subscribe((val) => {
			if (!val.token && $page.url.pathname !== '/login') {
				goto('/login');
			}
		});

		const unsubscribeTheme = theme.subscribe((val) => {
			if (typeof document !== 'undefined') {
				if (val === 'dark') {
					document.documentElement.classList.add('dark');
				} else {
					document.documentElement.classList.remove('dark');
				}
			}
		});

		return () => {
			unsubscribeAuth();
			unsubscribeTheme();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
