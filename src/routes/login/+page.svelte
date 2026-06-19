<script lang="ts">
  import { auth, setAuth } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  import ThemeButton from "$lib/components/small-components/ThemeButton.svelte";
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";

  let username = $state("");
  let password = $state("");
  let isLogin = $state(true);
  let errorMsg = $state("");
  let isLoading = $state(false);

  onMount(() => {
    // If already logged in, redirect to home
    const unsubscribe = auth.subscribe((val) => {
      if (val.token) {
        goto("/");
      }
    });
    return unsubscribe;
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    errorMsg = "";
    isLoading = true;

    const hostname = window.location.hostname;
    const backendUrl = env.PUBLIC_BACKEND_URL || `http://${hostname}:3000`;
    console.log("[DEBUG] env.PUBLIC_BACKEND_URL is:", env.PUBLIC_BACKEND_URL);
    console.log("[DEBUG] Using backendUrl in login:", backendUrl);
    const apiBase = `${backendUrl}/api/auth`;

    const endpoint = isLogin ? "/login" : "/register";

    try {
      const res = await fetch(`${apiBase}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        errorMsg = data.error || "Authentication failed";
      } else {
        setAuth(data.token, data.user);
        goto("/");
      }
    } catch (err) {
      errorMsg = "Failed to connect to server.";
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>{isLogin ? 'Login' : 'Register'} - Genesys Character Sheets</title>
</svelte:head>

<main class="login-page">
  <ThemeButton />

  <div class="auth-card">
    <h1 class="title">{isLogin ? "Welcome Back" : "Create Account"}</h1>
    <p class="subtitle">
      {isLogin
        ? "Enter your credentials to access your character sheets."
        : "Sign up to start creating your Genesys characters."}
    </p>

    {#if errorMsg}
      <div class="error-banner">{errorMsg}</div>
    {/if}

    <form class="auth-form" onsubmit={handleSubmit}>
      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          bind:value={username}
          placeholder="Enter username"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="Enter password"
          required
        />
      </div>

      <button type="submit" class="submit-btn" disabled={isLoading}>
        {isLoading ? "Please wait..." : isLogin ? "Login" : "Register"}
      </button>
    </form>

    <div class="toggle-mode">
      <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
      <button class="link-btn" onclick={() => (isLogin = !isLogin)}>
        {isLogin ? "Register here" : "Login here"}
      </button>
    </div>
  </div>
</main>

<style>
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background-color: var(--color-bg);
    transition: background-color 0.3s ease;
  }

  .auth-card {
    width: 100%;
    max-width: 400px;
    background-color: var(--color-panel-bg);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 2.5rem 2rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  }

  .title {
    font-family: var(--font-brand);
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text-brand);
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    text-align: center;
    color: var(--color-text-muted);
    font-size: 0.95rem;
    margin-bottom: 2rem;
  }

  .error-banner {
    background-color: #fee2e2;
    color: #b91c1c;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    border: 1px solid #f87171;
    text-align: center;
  }
  
  :global(.dark) .error-banner {
    background-color: rgba(220, 38, 38, 0.1);
    color: #fca5a5;
    border-color: rgba(220, 38, 38, 0.3);
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text);
  }

  input {
    padding: 0.75rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background-color: var(--color-input-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  input:focus {
    outline: none;
    border-color: var(--color-brand-primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  .submit-btn {
    margin-top: 0.5rem;
    padding: 0.75rem;
    background-color: var(--color-brand-primary);
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .submit-btn:hover:not(:disabled) {
    background-color: var(--color-brand-secondary);
  }

  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .toggle-mode {
    margin-top: 2rem;
    text-align: center;
    font-size: 0.9rem;
    color: var(--color-text-muted);
  }

  .link-btn {
    background: none;
    border: none;
    color: var(--color-brand-primary);
    font-weight: 600;
    cursor: pointer;
    padding: 0 0.25rem;
  }

  .link-btn:hover {
    text-decoration: underline;
  }
</style>
