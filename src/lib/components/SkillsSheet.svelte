<script lang="ts">
	// Inline type definition matching backend schema
	interface Skill {
		name: string;
		characteristic: string;
		category:
			| "General"
			| "Combat"
			| "Social"
			| "Magic"
			| "Knowledge"
			| "Custom";
		isSetting: boolean;
		isCareer: boolean;
		rank: number;
	}

	// Svelte 5 runes for binding skills state
	let { skills = $bindable<Skill[]>([]) } = $props();

	// Groups
	const groups = [
		{
			title: "GENERAL SKILLS",
			category: "General" as const,
			side: "left",
		},
		{
			title: "MAGIC SKILLS",
			category: "Magic" as const,
			side: "left",
		},
		{
			title: "COMBAT SKILLS",
			category: "Combat" as const,
			side: "right",
		},
		{
			title: "SOCIAL SKILLS",
			category: "Social" as const,
			side: "right",
		},
		{
			title: "KNOWLEDGE SKILLS",
			category: "Knowledge" as const,
			side: "right",
		},
		{
			title: "CUSTOM SKILLS",
			category: "Custom" as const,
			side: "right",
		},
	];

	// Toggle rank helper: clicking a chevron sets the rank, clicking it again toggles it down
	function setRank(skill: Skill, targetRank: number) {
		if (skill.rank === targetRank) {
			skill.rank = targetRank - 1;
		} else {
			skill.rank = targetRank;
		}
	}

	// Toggle setting helper
	function toggleSetting(skill: Skill) {
		skill.isSetting = !skill.isSetting;
	}

	// Toggle career helper
	function toggleCareer(skill: Skill) {
		skill.isCareer = !skill.isCareer;
	}

	// Add custom skill
	function addCustomSkill() {
		skills = [
			...skills,
			{
				name: "",
				characteristic: "BR",
				category: "Custom",
				isSetting: true,
				isCareer: false,
				rank: 0,
			},
		];
	}

	// Delete custom skill
	function deleteSkill(skillToDelete: Skill) {
		skills = skills.filter((s) => s !== skillToDelete);
	}
</script>

<!-- Skills Main Container -->
<div class="skills-section">
	<div class="skills-header-banner">
		<span class="skills-banner-text">SKILLS</span>
	</div>

	<div class="skills-grid">
		<!-- Left Column -->
		<div class="skills-column">
			{#each groups.filter((g) => g.side === "left") as group}
				{@const groupSkills = skills.filter(
					(s) => s.category === group.category,
				)}
				<div class="category-block">
					<div class="category-header-row">
						<span class="category-title">{group.title}</span>
						<span class="col-lbl">SETTING?</span>
						<span class="col-lbl">CAREER?</span>
						<span class="col-lbl">RANK</span>
					</div>

					<div class="category-list">
						{#each groupSkills as skill}
							<div
								class="skill-row"
								class:inactive-row={!skill.isSetting}
							>
								<div class="skill-info">
									<span class="skill-name">{skill.name}</span>
									<span class="skill-char"
										>({skill.characteristic})</span
									>
								</div>

								<!-- Setting Toggle (Dotted Circle) -->
								<div class="toggle-cell">
									<button
										type="button"
										class="chk-dotted-circle"
										class:checked={skill.isSetting}
										onclick={() => toggleSetting(skill)}
										aria-label="Toggle setting availability for {skill.name}"
									></button>
								</div>

								<!-- Career Toggle (Dotted Square) -->
								<div class="toggle-cell">
									<button
										type="button"
										class="chk-dotted-square"
										class:checked={skill.isCareer}
										onclick={() => toggleCareer(skill)}
										aria-label="Toggle career training for {skill.name}"
									></button>
								</div>

								<!-- Ranks Chevron Group -->
								<div class="rank-cell">
									<svg
										width="96"
										height="18"
										viewBox="0 0 96 20"
										class="rank-chevron-group"
										aria-label="Skill rank rank out of 5"
									>
										{#each Array(5) as _, idx}
											{@const r = idx + 1}
											<polygon
												points="{idx * 18},0 {idx * 18 +
													18},0 {idx * 18 +
													24},10 {idx * 18 +
													18},20 {idx * 18},20 {idx *
													18 +
													6},10"
												class="rank-chevron"
												class:filled={r <= skill.rank}
												class:career-filled={r <=
													skill.rank &&
													skill.isCareer}
												onclick={() =>
													setRank(skill, r)}
											/>
										{/each}
									</svg>
								</div>
							</div>
						{/each}
						{#if groupSkills.length === 0}
							<div class="empty-list-label">
								No skills in this category.
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<!-- Right Column -->
		<div class="skills-column">
			{#each groups.filter((g) => g.side === "right") as group}
				{@const groupSkills = skills.filter(
					(s) => s.category === group.category,
				)}
				<div class="category-block">
					<div class="category-header-row">
						<span class="category-title">{group.title}</span>
						<span class="col-lbl">SETTING?</span>
						<span class="col-lbl">CAREER?</span>
						<span class="col-lbl">RANK</span>
						{#if group.category === "Custom"}
							<span class="col-lbl-del"></span>
						{/if}
					</div>

					<div class="category-list">
						{#each groupSkills as skill, idx}
							<div
								class="skill-row"
								class:inactive-row={!skill.isSetting}
							>
								{#if group.category === "Custom"}
									<!-- Editable fields for Custom Skills -->
									<div class="skill-info custom-skill-fields">
										<input
											type="text"
											bind:value={skill.name}
											placeholder="CUSTOM SKILL NAME"
											class="custom-skill-name-input"
											aria-label="Custom skill name"
										/>
										<select
											bind:value={skill.characteristic}
											class="custom-skill-char-select"
											aria-label="Custom skill attribute"
										>
											<option value="BR">BR</option>
											<option value="AG">AG</option>
											<option value="INT">INT</option>
											<option value="CUN">CUN</option>
											<option value="WILL">WILL</option>
											<option value="PR">PR</option>
										</select>
									</div>
								{:else}
									<div class="skill-info">
										<span class="skill-name"
											>{skill.name}</span
										>
										<span class="skill-char"
											>({skill.characteristic})</span
										>
									</div>
								{/if}

								<!-- Setting Toggle (Dotted Circle) -->
								<div class="toggle-cell">
									<button
										type="button"
										class="chk-dotted-circle"
										class:checked={skill.isSetting}
										onclick={() => toggleSetting(skill)}
										aria-label="Toggle setting availability"
									></button>
								</div>

								<!-- Career Toggle (Dotted Square) -->
								<div class="toggle-cell">
									<button
										type="button"
										class="chk-dotted-square"
										class:checked={skill.isCareer}
										onclick={() => toggleCareer(skill)}
										aria-label="Toggle career training"
									></button>
								</div>

								<!-- Ranks Chevron Group -->
								<div class="rank-cell">
									<svg
										width="96"
										height="18"
										viewBox="0 0 96 20"
										class="rank-chevron-group"
										aria-label="Skill rank out of 5"
									>
										{#each Array(5) as _, idx}
											{@const r = idx + 1}
											<!-- svelte-ignore a11y_click_events_have_key_events -->
											<!-- svelte-ignore a11y_no_static_element_interactions -->
											<polygon
												points="{idx * 18},0 {idx * 18 +
													18},0 {idx * 18 +
													24},10 {idx * 18 +
													18},20 {idx * 18},20 {idx *
													18 +
													6},10"
												class="rank-chevron"
												class:filled={r <= skill.rank}
												class:career-filled={r <=
													skill.rank &&
													skill.isCareer}
												onclick={() =>
													setRank(skill, r)}
											/>
										{/each}
									</svg>
								</div>

								<!-- Delete Button for Custom Skills -->
								{#if group.category === "Custom"}
									<div class="delete-cell">
										<button
											type="button"
											class="btn-delete-skill"
											onclick={() => deleteSkill(skill)}
											title="Delete custom skill"
										>
											&times;
										</button>
									</div>
								{/if}
							</div>
						{/each}

						<!-- Empty list / Actions -->
						{#if group.category === "Custom"}
							<div class="custom-actions-row">
								<button
									type="button"
									class="btn-add-custom-skill"
									onclick={addCustomSkill}
								>
									+ Add Custom Skill
								</button>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	/* Styles Section */
	.skills-section {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 900px;
		margin: 1rem auto;
		gap: 0;
	}

	/* Dark Slate Banner Header for Skills */
	.skills-header-banner {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 140px;
		height: 28px;
		background-color: var(--color-card-bg);
		color: var(--color-text-brand);
		margin: 0 auto;
		clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 100%, 0 100%);
		border: 1px solid var(--color-line-brand);
		border-bottom: none;
	}

	.skills-banner-text {
		font-family: var(--font-brand);
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: 0.08em;
	}

	/* Columns Grid */
	.skills-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 1.5rem;
		width: 100%;
		border-top: 2px solid var(--color-line-brand);
		padding-top: 1.5rem;
	}

	@media (max-width: 768px) {
		.skills-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.skills-column {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		min-width: 0;
	}

	/* Card / Category Group Blocks */
	.category-block {
		background-color: var(--color-card-bg);
		background-image: var(--bg-cross-pattern);
		background-size: 60px 104px;
		border: 1.5px solid var(--color-line-brand);
		border-radius: 6px;
		box-shadow: var(--shadow-premium);
		overflow-x: auto;
		overflow-y: hidden;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	/* Table Category Header Row */
	.category-header-row {
		display: grid;
		grid-template-columns: 1fr 65px 65px 100px;
		align-items: center;
		background-color: var(--color-card-bg);
		border-bottom: 1.5px solid var(--color-line-brand);
		padding: 0.4rem 0.75rem;
		min-width: 380px; /* Forces scroll on very small screens */
	}

	.category-block:has(.btn-delete-skill) .category-header-row {
		grid-template-columns: 1fr 65px 65px 100px 30px;
	}

	.category-title {
		font-family: var(--font-brand);
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--color-text-brand);
		letter-spacing: 0.04em;
	}

	.col-lbl {
		font-family: var(--font-brand);
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--color-text-brand);
		text-align: center;
		letter-spacing: 0.02em;
	}

	/* Skill Rows */
	.category-list {
		display: flex;
		flex-direction: column;
		padding: 0.25rem 0;
	}

	.skill-row {
		display: grid;
		grid-template-columns: 1fr 65px 65px 100px;
		align-items: center;
		padding: 0.35rem 0.75rem;
		border-bottom: 1px dashed rgba(63, 82, 93, 0.15);
		transition: background-color 0.2s;
		min-width: 380px;
	}

	.skill-row:has(.btn-delete-skill) {
		grid-template-columns: 1fr 65px 65px 100px 30px;
	}

	.skill-row:last-child {
		border-bottom: none;
	}

	.skill-row:hover {
		background-color: rgba(255, 255, 255, 0.45);
	}

	.inactive-row {
		opacity: 0.45;
	}

	.skill-info {
		display: flex;
		align-items: baseline;
		gap: 0.35rem;
	}

	.skill-name {
		font-family: var(--font-brand);
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text-brand);
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.skill-char {
		font-family: var(--font-brand);
		font-size: 0.82rem;
		font-weight: 600;
		color: #64748b;
		text-transform: uppercase;
	}

	.toggle-cell {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* Dotted Circle Checkbox for Setting availability */
	.chk-dotted-circle {
		width: 16px;
		height: 16px;
		border: 1.5px dashed var(--color-line-brand);
		border-radius: 50%;
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		outline: none;
		transition:
			background-color 0.2s,
			border-color 0.2s;
	}

	.chk-dotted-circle:hover {
		border-color: var(--color-rust);
	}

	.chk-dotted-circle.checked {
		border: 1.5px solid var(--color-rust);
		background-color: transparent;
	}

	.chk-dotted-circle.checked::after {
		content: "";
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background-color: var(--color-rust);
		display: block;
	}

	/* Dotted Square Checkbox for Career skill */
	.chk-dotted-square {
		width: 15px;
		height: 15px;
		border: 1.5px dashed var(--color-line-brand);
		border-radius: 2px;
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		outline: none;
		transition:
			background-color 0.2s,
			border-color 0.2s;
	}

	.chk-dotted-square:hover {
		border-color: var(--color-blue-steel);
	}

	.chk-dotted-square.checked {
		border: 1.5px solid var(--color-blue-steel);
		background-color: transparent;
	}

	.chk-dotted-square.checked::after {
		content: "";
		width: 6px;
		height: 6px;
		background-color: var(--color-blue-steel);
		display: block;
	}

	/* Chevron Ranks Group */
	.rank-cell {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.rank-chevron-group {
		display: flex;
		overflow: visible;
	}

	.rank-chevron {
		fill: transparent;
		stroke: var(--color-line-brand);
		stroke-width: 1.5px;
		cursor: pointer;
		transition:
			fill 0.2s ease,
			stroke 0.2s ease;
	}

	.rank-chevron:hover {
		fill: rgba(154, 40, 38, 0.15);
		stroke: var(--color-rust);
	}

	.rank-chevron.filled {
		fill: var(--color-rust);
		stroke: var(--color-rust);
	}

	.rank-chevron.filled.career-filled {
		fill: var(--color-blue-steel);
		stroke: var(--color-blue-steel);
	}

	/* Custom Skills Inline Inputs */
	.custom-skill-fields {
		background-color: var(--color-card-bg);
		display: flex;
		gap: 0.35rem;
		flex-grow: 1;
		align-items: center;
	}

	.custom-skill-name-input {
		font-family: var(--font-brand);
		font-size: 0.92rem;
		font-weight: 700;
		color: var(--color-text-brand);
		background: transparent;
		border: none;
		border-bottom: 1.2px solid rgba(63, 82, 93, 0.25);
		padding: 0.05rem 0.15rem;
		outline: none;
		flex-grow: 1;
		max-width: 120px;
		text-transform: uppercase;
	}

	.custom-skill-name-input:focus {
		color: var(--color-text-brand);
		border-bottom-color: var(--color-focus);
	}

	.custom-skill-name-input::placeholder {
		font-style: italic;
		font-weight: 500;
		opacity: 0.45;
	}

	.custom-skill-char-select {
		font-family: var(--font-brand);
		font-size: 0.8rem;
		font-weight: 600;
		color: #64748b;
		background: white;
		border: 1.2px solid rgba(63, 82, 93, 0.25);
		border-radius: 2px;
		padding: 0.05rem 0.15rem;
		outline: none;
		cursor: pointer;
	}

	.custom-skill-char-select:focus {
		border-color: var(--color-focus);
	}

	/* Custom Skill Delete Button */
	.delete-cell {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.btn-delete-skill {
		background: transparent;
		border: none;
		color: #94a3b8;
		font-size: 1.25rem;
		line-height: 1;
		cursor: pointer;
		padding: 0;
		margin: 0;
		outline: none;
		transition: color 0.2s;
	}

	.btn-delete-skill:hover {
		color: #ef4444;
	}

	/* Add Custom Skill Button Footer */
	.custom-actions-row {
		display: flex;
		justify-content: center;
		padding: 0.6rem 0;
		background-color: var(--color-card-bg);
		border-top: 1.2px dashed rgba(63, 82, 93, 0.2);
	}

	.btn-add-custom-skill {
		font-family: var(--font-brand);
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--color-text-brand);
		background: transparent;
		border: 1.5px dashed var(--color-line-brand);
		border-radius: 4px;
		padding: 0.3rem 0.75rem;
		cursor: pointer;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		transition:
			background-color 0.2s,
			border-color 0.2s,
			color 0.2s;
	}

	.btn-add-custom-skill:hover {
		background-color: rgba(63, 82, 93, 0.06);
		border-color: var(--color-focus);
		color: var(--color-focus);
	}

	.empty-list-label {
		text-align: center;
		font-size: 0.85rem;
		color: #94a3b8;
		padding: 1rem 0;
		font-style: italic;
	}
</style>
