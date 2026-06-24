<script lang="ts">
	let {
		isOpen = $bindable(false),
		itemType = "weapon" as "weapon" | "armor",
		initialItem = null as any,
		globalQualities = [] as any[],
		onSave = (item: any) => {},
	} = $props();

	let editingItem = $state<any>({});
	let parsedSpecials = $state<{ name: string; rank: string }[]>([]);
	let newSpecialSelection = $state("");

	function parseSpecialsString(str: string) {
		if (!str) return [];
		return str.split(',').map(s => {
			const clean = s.trim();
			if (!clean) return null;
			const match = clean.match(/^(.*?)\s+([0-9]+)$/);
			if (match) {
				return { name: match[1].trim(), rank: match[2] };
			}
			return { name: clean, rank: "" };
		}).filter(x => x !== null) as { name: string; rank: string }[];
	}

	function buildSpecialsString() {
		return parsedSpecials.map(s => s.rank ? `${s.name} ${s.rank}` : s.name).join(", ");
	}

	let wasOpen = false;

	$effect(() => {
		if (isOpen && !wasOpen) {
			if (initialItem) {
				editingItem = { ...initialItem };
			} else {
				if (itemType === "weapon") {
					editingItem = { name: "", skill: "", damage: "", crit: "", range: "", special: "" };
				} else {
					editingItem = { name: "", defense: "", soak: "", encumbrance: "", hardPoints: "", special: "" };
				}
			}
			parsedSpecials = parseSpecialsString(editingItem.special || "");
			newSpecialSelection = "";
		}
		wasOpen = isOpen;
	});

	function addSpecial() {
		if (newSpecialSelection) {
			parsedSpecials.push({ name: newSpecialSelection, rank: "" });
			newSpecialSelection = "";
		}
	}

	function removeSpecial(index: number) {
		parsedSpecials.splice(index, 1);
	}

	function closeModal() {
		isOpen = false;
	}

	function handleSave() {
		editingItem.special = buildSpecialsString();
		onSave({ ...editingItem });
		isOpen = false;
	}
</script>

{#if isOpen}
	<div class="modal-backdrop">
		<div class="modal-content">
			<div class="modal-header">
				<h2>Edit {itemType === "weapon" ? "Weapon" : "Armor"}</h2>
				<button type="button" class="close-btn" onclick={closeModal} aria-label="Close modal">&times;</button>
			</div>

			<div class="modal-body">
				<div class="form-group">
					<label for="item-name">Name</label>
					<input id="item-name" type="text" bind:value={editingItem.name} />
				</div>
				
				{#if itemType === "weapon"}
					<div class="form-row">
						<div class="form-group">
							<label for="w-skill">Skill</label>
							<input id="w-skill" type="text" bind:value={editingItem.skill} />
						</div>
						<div class="form-group">
							<label for="w-range">Range</label>
							<input id="w-range" type="text" bind:value={editingItem.range} />
						</div>
					</div>
					<div class="form-row">
						<div class="form-group">
							<label for="w-dmg">Damage</label>
							<input id="w-dmg" type="text" bind:value={editingItem.damage} />
						</div>
						<div class="form-group">
							<label for="w-crit">Crit</label>
							<input id="w-crit" type="text" bind:value={editingItem.crit} />
						</div>
					</div>
				{:else}
					<div class="form-row">
						<div class="form-group">
							<label for="a-def">Defense</label>
							<input id="a-def" type="text" bind:value={editingItem.defense} />
						</div>
						<div class="form-group">
							<label for="a-soak">Soak</label>
							<input id="a-soak" type="text" bind:value={editingItem.soak} />
						</div>
					</div>
					<div class="form-row">
						<div class="form-group">
							<label for="a-enc">Encumbrance</label>
							<input id="a-enc" type="text" bind:value={editingItem.encumbrance} />
						</div>
						<div class="form-group">
							<label for="a-hp">Hard Points</label>
							<input id="a-hp" type="text" bind:value={editingItem.hardPoints} />
						</div>
					</div>
				{/if}

				<div class="form-group">
					<label>Special Qualities</label>
					
					<div class="specials-pill-container">
						{#each parsedSpecials as spec, i}
							<div class="special-pill-edit">
								<span class="spec-name">{spec.name}</span>
								<input type="text" class="spec-rank" placeholder="Rank" bind:value={spec.rank} />
								<button class="btn-remove-spec" type="button" onclick={() => removeSpecial(i)}>&times;</button>
							</div>
						{/each}
						{#if parsedSpecials.length === 0}
							<div class="no-specials-msg">No special qualities.</div>
						{/if}
					</div>

					<div class="add-special-row">
						<select bind:value={newSpecialSelection} class="special-select">
							<option value="">-- Add a Quality --</option>
							{#each globalQualities as q}
								<option value={q.name}>{q.name}</option>
							{/each}
						</select>
						<button type="button" class="btn-add-spec" onclick={addSpecial}>Add</button>
					</div>
				</div>
			</div>

			<div class="modal-footer">
				<button type="button" class="btn-cancel" onclick={closeModal}>Cancel</button>
				<button type="button" class="btn-save" onclick={handleSave}>Save</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10000;
	}

	.modal-content {
		background-color: var(--color-card-bg);
		border: 1.5px solid var(--color-line-brand);
		border-radius: 6px;
		width: 90%;
		max-width: 650px;
		display: flex;
		flex-direction: column;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		border-bottom: 1.5px solid var(--color-line-brand);
		background-color: rgba(0,0,0,0.2);
	}

	.modal-header h2 {
		margin: 0;
		color: var(--color-text-brand);
		font-family: var(--font-brand);
		font-size: 1.25rem;
		letter-spacing: 0.05em;
	}

	.close-btn {
		background: none;
		border: none;
		color: #94a3b8;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0;
		line-height: 1;
		transition: color 0.2s;
	}

	.close-btn:hover {
		color: #f87171;
	}

	.modal-body {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-row {
		display: flex;
		gap: 1rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		flex: 1;
		gap: 0.25rem;
	}

	label {
		font-size: 0.8rem;
		font-weight: 600;
		color: #94a3b8;
		text-transform: uppercase;
	}

	input, textarea {
		background: rgba(0,0,0,0.2);
		border: 1px solid #475569;
		border-radius: 4px;
		padding: 0.5rem;
		color: #e2e8f0;
		font-family: var(--font-body);
		font-size: 0.9rem;
	}

	input:focus, textarea:focus {
		outline: none;
		border-color: var(--color-text-brand);
	}

	.specials-pill-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0.5rem;
		background: rgba(0,0,0,0.15);
		border: 1px solid #475569;
		border-radius: 4px;
		min-height: 2.5rem;
	}

	.special-pill-edit {
		display: flex;
		align-items: center;
		background: var(--color-card-bg);
		border: 1px solid var(--color-line-brand);
		border-radius: 4px;
		padding-left: 0.5rem;
		overflow: hidden;
	}

	.spec-name {
		font-size: 0.85rem;
		color: var(--color-text-brand);
		margin-right: 0.5rem;
	}

	.spec-rank {
		width: 3rem;
		padding: 0.2rem;
		border: none;
		border-left: 1px solid #475569;
		border-radius: 0;
		text-align: center;
		font-size: 0.85rem;
		background: rgba(0,0,0,0.2);
	}

	.btn-remove-spec {
		background: none;
		border: none;
		border-left: 1px solid #475569;
		color: #f87171;
		cursor: pointer;
		padding: 0.2rem 0.5rem;
		transition: background 0.2s;
	}

	.btn-remove-spec:hover {
		background: rgba(248,113,113,0.2);
	}

	.no-specials-msg {
		color: #64748b;
		font-size: 0.85rem;
		font-style: italic;
		align-self: center;
	}

	.add-special-row {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.special-select {
		flex: 1;
		background: rgba(0,0,0,0.2);
		border: 1px solid #475569;
		border-radius: 4px;
		padding: 0.5rem;
		color: #e2e8f0;
		font-family: var(--font-body);
		font-size: 0.9rem;
	}

	.btn-add-spec {
		padding: 0.5rem 1rem;
		background: #334155;
		border: 1px solid #475569;
		color: white;
		border-radius: 4px;
		cursor: pointer;
		transition: background 0.2s;
	}

	.btn-add-spec:hover {
		background: #475569;
	}

	.modal-footer {
		padding: 1rem 1.5rem;
		border-top: 1.5px solid var(--color-line-brand);
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		background-color: rgba(0,0,0,0.2);
	}

	.btn-cancel, .btn-save {
		padding: 0.5rem 1rem;
		border-radius: 4px;
		font-family: var(--font-brand);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-cancel {
		background: transparent;
		border: 1px solid #475569;
		color: #cbd5e1;
	}

	.btn-cancel:hover {
		background: rgba(255,255,255,0.05);
	}

	.btn-save {
		background: var(--color-rust);
		border: 1px solid var(--color-rust);
		color: white;
	}

	.btn-save:hover {
		filter: brightness(1.1);
	}
</style>
