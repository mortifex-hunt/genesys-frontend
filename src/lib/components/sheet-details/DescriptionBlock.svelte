<script lang="ts">
	interface Description {
		gender: string;
		age: string;
		height: string;
		build: string;
		hair: string;
		eyes: string;
		notableFeatures: string;
	}

	let {
		description = $bindable<Description>({
			gender: "",
			age: "",
			height: "",
			build: "",
			hair: "",
			eyes: "",
			notableFeatures: "",
		}),
	} = $props();
</script>

<div class="description-section">
	<div class="illustration-box">
		<div class="block-header">CHARACTER ILLUSTRATION</div>
		<!-- Placeholder for an actual image later, currently just an empty area -->
	</div>

	<div class="description-box">
		<div class="block-header">CHARACTER DESCRIPTION</div>
		<div class="desc-fields">
			<div class="input-row">
				<label for="gender">GENDER:</label>
				<input id="gender" type="text" bind:value={description.gender} />
			</div>
			<div class="input-row">
				<label for="age">AGE:</label>
				<input id="age" type="text" bind:value={description.age} />
			</div>
			<div class="input-row">
				<label for="height">HEIGHT:</label>
				<input id="height" type="text" bind:value={description.height} />
			</div>
			<div class="input-row">
				<label for="build">BUILD:</label>
				<input id="build" type="text" bind:value={description.build} />
			</div>
			<div class="input-row">
				<label for="hair">HAIR:</label>
				<input id="hair" type="text" bind:value={description.hair} />
			</div>
			<div class="input-row">
				<label for="eyes">EYES:</label>
				<input id="eyes" type="text" bind:value={description.eyes} />
			</div>
			<div class="textarea-row">
				<label for="features">NOTABLE FEATURES:</label>
				<textarea id="features" bind:value={description.notableFeatures}></textarea>
			</div>
		</div>
	</div>
</div>

<style>
	.description-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		height: 100%;
	}

	.illustration-box {
		background-color: var(--color-card-bg);
		border: 1.5px solid var(--color-line-brand);
		border-radius: 4px;
		flex-grow: 1;
		position: relative;
		min-height: 250px;
	}

	.description-box {
		background-color: var(--color-card-bg);
		border: 1.5px solid var(--color-line-brand);
		border-radius: 4px;
		position: relative;
		padding: 1rem;
		display: flex;
		flex-direction: column;
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

	.desc-fields {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex-grow: 1;
	}

	.input-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.input-row label {
		font-family: var(--font-brand);
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-text-brand);
		min-width: 60px;
	}

	.input-row input {
		flex-grow: 1;
		background: transparent;
		border: none;
		border-bottom: 1.5px solid var(--color-line-brand);
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--color-text-dark);
		outline: none;
		padding: 0.1rem 0;
	}

	.input-row input:focus {
		border-bottom-color: var(--color-focus);
	}

	.textarea-row {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex-grow: 1;
		margin-top: 0.5rem;
	}

	.textarea-row label {
		font-family: var(--font-brand);
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-text-brand);
	}

	.textarea-row textarea {
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
		min-height: 80px;
	}
</style>
