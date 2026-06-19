<script lang="ts">
  import { auth } from "$lib/stores/auth";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import ThemeButton from "$lib/components/small-components/ThemeButton.svelte";
  import { env } from "$env/dynamic/public";

  let dbData = $state<any>(null);
  let errorMsg = $state("");
  let isLoading = $state(true);

  onMount(async () => {
    const token = get(auth).token;
    const user = get(auth).user;
    
    if (user?.role !== 'admin') {
      errorMsg = "You do not have permission to view this page.";
      isLoading = false;
      return;
    }

    const hostname = window.location.hostname;
    const backendUrl = env.PUBLIC_BACKEND_URL || `http://${hostname}:3000`;
    const apiBase = `${backendUrl}/api/admin/database`;

    try {
      const res = await fetch(apiBase, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        dbData = await res.json();
      } else {
        const err = await res.json();
        errorMsg = err.error || "Failed to load database";
      }
    } catch (e) {
      errorMsg = "Failed to connect to the server.";
    } finally {
      isLoading = false;
    }
  });
</script>

<svelte:head>
  <title>Database View - Genesys</title>
</svelte:head>

<main class="page-container">
  <header class="app-header">
    <h1 class="app-title">DATABASE VIEWER</h1>
    <p class="app-subtitle">Read-only view of the in-memory backend database.</p>
  </header>

  <ThemeButton />

  <div class="controls-row">
    <a href="/" class="btn btn-secondary">&larr; Back to Character Sheets</a>
  </div>

  {#if isLoading}
    <div class="card loading">Loading database state...</div>
  {:else if errorMsg}
    <div class="card error">{errorMsg}</div>
  {:else if dbData}
    <div class="card">
      <h2 class="section-title">Users</h2>
      <pre class="json-viewer">{JSON.stringify(dbData.users, null, 2)}</pre>
    </div>

    <div class="card">
      <h2 class="section-title">Characters</h2>
      <pre class="json-viewer">{JSON.stringify(dbData.characters, null, 2)}</pre>
    </div>
  {/if}
</main>

<style>
  .page-container {
    width: 100%;
    max-width: 900px;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 0 auto;
    padding: 1rem;
  }

  .app-header {
    text-align: center;
  }

  .app-title {
    font-family: var(--font-brand);
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-text-brand);
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
  }

  .app-subtitle {
    font-size: 1rem;
    color: var(--color-text-muted);
  }

  .controls-row {
    display: flex;
    justify-content: flex-start;
  }

  .btn {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    text-decoration: none;
    display: inline-block;
  }

  .btn-secondary {
    background-color: var(--color-panel-bg);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }

  .btn-secondary:hover {
    background-color: var(--color-bg);
  }

  .card {
    background-color: var(--color-panel-bg);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .section-title {
    font-family: var(--font-brand);
    color: var(--color-text-brand);
    margin-bottom: 1rem;
    margin-top: 0;
    font-size: 1.5rem;
  }

  .json-viewer {
    background-color: #1e1e1e;
    color: #d4d4d4;
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .error {
    background-color: rgba(220, 38, 38, 0.1);
    color: #fca5a5;
    border-color: rgba(220, 38, 38, 0.3);
    text-align: center;
    font-weight: 600;
  }

  .loading {
    text-align: center;
    color: var(--color-text-muted);
    font-style: italic;
  }
</style>
