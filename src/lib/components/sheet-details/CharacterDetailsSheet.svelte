<script lang="ts">
	import MotivationsBlock from "./MotivationsBlock.svelte";
	import DescriptionBlock from "./DescriptionBlock.svelte";
	import EquipmentBlock from "./EquipmentBlock.svelte";
	import InjuriesNotesBlock from "./InjuriesNotesBlock.svelte";
	import TalentsBlock from "./TalentsBlock.svelte";

	interface Motivations {
		strength: string;
		flaw: string;
		desire: string;
		fear: string;
	}

	interface Description {
		gender: string;
		age: string;
		height: string;
		build: string;
		hair: string;
		eyes: string;
		notableFeatures: string;
	}

	interface Equipment {
		money: string;
		weaponsAndArmor: string;
		personalGear: string;
	}

	interface CriticalInjury {
		severity: number;
		result: string;
	}

	interface Talent {
		name: string;
		page: string;
		summary: string;
	}

	let {
		motivations = $bindable<Motivations>({ strength: "", flaw: "", desire: "", fear: "" }),
		description = $bindable<Description>({ gender: "", age: "", height: "", build: "", hair: "", eyes: "", notableFeatures: "" }),
		equipment = $bindable<Equipment>({ money: "", weaponsAndArmor: "", personalGear: "" }),
		notes = $bindable<string>(""),
		criticalInjuries = $bindable<CriticalInjury[]>([]),
		talents = $bindable<Talent[]>([]),
		globalInjuries = [] as any[]
	} = $props();
</script>

<div class="details-sheet-container">
	<div class="top-split">
		<div class="left-col">
			<MotivationsBlock bind:motivations />
			<EquipmentBlock bind:equipment />
		</div>
		<div class="right-col">
			<DescriptionBlock bind:description />
		</div>
	</div>

	<div class="bottom-split">
		<InjuriesNotesBlock bind:notes bind:criticalInjuries {globalInjuries} />
		<TalentsBlock bind:talents />
	</div>
</div>

<style>
	.details-sheet-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
	}

	.top-split {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 1.5rem;
	}

	.bottom-split {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	@media (max-width: 900px) {
		.top-split {
			grid-template-columns: 1fr;
		}
	}
</style>
