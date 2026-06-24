<script lang="ts">
	import { onMount, tick } from "svelte";
	import { io } from "socket.io-client";
	import type { Socket } from "socket.io-client";
	import CharacterHeader from "$lib/components/CharacterHeader.svelte";
	import StatBlock from "$lib/components/StatBlock.svelte";
	import SkillsSheet from "$lib/components/SkillsSheet.svelte";
	import WeaponsBlock from "$lib/components/WeaponsBlock.svelte";
	import ArmorBlock from "$lib/components/ArmorBlock.svelte";
	import CharacteristicsBlock from "$lib/components/CharacteristicsBlock.svelte";
	import ThemeButton from "$lib/components/small-components/ThemeButton.svelte";
	import CharacterDetailsSheet from "$lib/components/sheet-details/CharacterDetailsSheet.svelte";
	import { auth, logout } from "$lib/stores/auth";
	import { get } from "svelte/store";
	import { env } from "$env/dynamic/public";

	const currentUser = get(auth).user;

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

	interface WeaponItem {
		id?: string;
		name: string;
		skill: string;
		damage: string;
		crit: string;
		range: string;
		special: string;
	}

	interface ArmorItem {
		id?: string;
		name: string;
		defense: string;
		soak: string;
		encumbrance: string;
		hardPoints: string;
		special: string;
	}

	// Reactive states for the character sheet fields
	let characterId = $state("default-char");
	let characterName = $state("Dax Karr");
	let speciesArchetype = $state("Human (Leader)");
	let career = $state("Smuggler / Scoundrel");
	let player = $state("Alex");
	let soakValue = $state(4);
	let woundsThreshold = $state(12);
	let woundsCurrent = $state(0);
	let strainThreshold = $state(10);
	let strainCurrent = $state(0);
	let defenseRanged = $state(1);
	let defenseMelee = $state(0);

	let brawn = $state(2);
	let agility = $state(2);
	let intellect = $state(2);
	let cunning = $state(2);
	let willpower = $state(2);
	let presence = $state(2);

	let skills = $state<Skill[]>([]);
	let weapons = $state<WeaponItem[]>([
		{ name: "", skill: "", damage: "", crit: "", range: "", special: "" },
		{ name: "", skill: "", damage: "", crit: "", range: "", special: "" },
		{ name: "", skill: "", damage: "", crit: "", range: "", special: "" },
	]);
	let armors = $state<ArmorItem[]>([
		{
			name: "",
			defense: "",
			soak: "",
			encumbrance: "",
			hardPoints: "",
			special: "",
		},
		{
			name: "",
			defense: "",
			soak: "",
			encumbrance: "",
			hardPoints: "",
			special: "",
		},
		{
			name: "",
			defense: "",
			soak: "",
			encumbrance: "",
			hardPoints: "",
			special: "",
		},
	]);

	let activeTab = $state<"main" | "details">("main");
	let motivations = $state({ strength: "", flaw: "", desire: "", fear: "" });
	let description = $state({
		gender: "",
		age: "",
		height: "",
		build: "",
		hair: "",
		eyes: "",
		notableFeatures: "",
	});
	let equipment = $state({
		money: "",
		weaponsAndArmor: "",
		personalGear: "",
	});
	let notes = $state("");
	let criticalInjuries = $state<any[]>([]);
	let talents = $state<any[]>([]);

	// Standard Skills List constant
	const STANDARD_SKILLS = [
		{ name: "Alchemy", characteristic: "INT", category: "General" },
		{
			name: "Astrocartography",
			characteristic: "INT",
			category: "General",
		},
		{ name: "Athletics", characteristic: "BR", category: "General" },
		{ name: "Computers", characteristic: "INT", category: "General" },
		{ name: "Cool", characteristic: "PR", category: "General" },
		{ name: "Coordination", characteristic: "AG", category: "General" },
		{ name: "Discipline", characteristic: "WILL", category: "General" },
		{ name: "Driving", characteristic: "AG", category: "General" },
		{ name: "Mechanics", characteristic: "INT", category: "General" },
		{ name: "Medicine", characteristic: "INT", category: "General" },
		{ name: "Operating", characteristic: "INT", category: "General" },
		{ name: "Perception", characteristic: "CUN", category: "General" },
		{ name: "Piloting", characteristic: "AG", category: "General" },
		{ name: "Resilience", characteristic: "BR", category: "General" },
		{ name: "Riding", characteristic: "AG", category: "General" },
		{ name: "Skulduggery", characteristic: "CUN", category: "General" },
		{ name: "Stealth", characteristic: "AG", category: "General" },
		{ name: "Streetwise", characteristic: "CUN", category: "General" },
		{ name: "Survival", characteristic: "CUN", category: "General" },
		{ name: "Vigilance", characteristic: "WILL", category: "General" },

		{ name: "Brawl", characteristic: "BR", category: "Combat" },
		{ name: "Gunnery", characteristic: "AG", category: "Combat" },
		{ name: "Melee", characteristic: "BR", category: "Combat" },
		{ name: "Melee-Heavy", characteristic: "BR", category: "Combat" },
		{ name: "Melee-Light", characteristic: "BR", category: "Combat" },
		{ name: "Ranged", characteristic: "AG", category: "Combat" },
		{ name: "Ranged-Heavy", characteristic: "AG", category: "Combat" },
		{ name: "Ranged-Light", characteristic: "AG", category: "Combat" },

		{ name: "Charm", characteristic: "PR", category: "Social" },
		{ name: "Coercion", characteristic: "WILL", category: "Social" },
		{ name: "Deception", characteristic: "CUN", category: "Social" },
		{ name: "Leadership", characteristic: "PR", category: "Social" },
		{ name: "Negotiation", characteristic: "PR", category: "Social" },

		{ name: "Knowledge", characteristic: "INT", category: "Knowledge" },

		{ name: "Arcana", characteristic: "INT", category: "Magic" },
		{ name: "Divine", characteristic: "WILL", category: "Magic" },
		{ name: "Primal", characteristic: "CUN", category: "Magic" },
	];

	let isDev = typeof window !== 'undefined' && (
		window.location.href.includes("localhost") ||
		window.location.href.includes("[IP_ADDRESS]")
	);

	function getDefaultSkills(): Skill[] {
		return STANDARD_SKILLS.map((s) => ({
			name: s.name,
			characteristic: s.characteristic,
			category: s.category as any,
			isSetting: true,
			isCareer: false,
			rank: 0,
		}));
	}

	function ensureSkillsArray(skillsData: any): Skill[] {
		const defaultSkills = getDefaultSkills();
		if (!skillsData) return defaultSkills;

		if (Array.isArray(skillsData)) {
			const result = [...skillsData];
			for (const std of defaultSkills) {
				if (!result.some((s) => s.name === std.name)) {
					result.push(std);
				}
			}
			return result;
		}

		if (typeof skillsData === "object") {
			const result = defaultSkills.map((s) => {
				const old = skillsData[s.name];
				if (old) {
					return {
						...s,
						rank: old.rank ?? 0,
						isCareer: old.career ?? false,
						isSetting: old.setting ?? true,
					};
				}
				return s;
			});

			for (const [name, value] of Object.entries(skillsData)) {
				const isStandard = STANDARD_SKILLS.some((s) => s.name === name);
				if (!isStandard && value && typeof value === "object") {
					const val = value as any;
					result.push({
						name,
						characteristic: val.characteristic ?? "BR",
						category: "Custom",
						isSetting: val.setting ?? true,
						isCareer: val.career ?? false,
						rank: val.rank ?? 0,
					});
				}
			}
			return result;
		}

		return defaultSkills;
	}

	// API and list states
	let apiBase = $state(
		env.PUBLIC_BACKEND_URL
			? `${env.PUBLIC_BACKEND_URL}/api`
			: "http://localhost:3000/api",
	);
	let charactersList = $state<any[]>([]);
	let availableWeapons = $state<WeaponItem[]>([]);
	let availableArmor = $state<ArmorItem[]>([]);
	let globalInjuries = $state<any[]>([]);
	let globalSkills = $state<any[]>([]);
	let globalCharacteristics = $state<any[]>([]);
	let globalQualities = $state<any[]>([]);
	let globalTalents = $state<any[]>([]);
	let globalAbilities = $state<any[]>([]);
	let isConnected = $state(false);
	let selectedId = $state("default-char");

	// Socket.io client state
	let socket: Socket | undefined = $state(undefined);
	let updatingFromServer = false;

	// Toast notification state
	let toast = $state<{
		message: string;
		type: "success" | "error" | "info";
	} | null>(null);
	let toastTimeout: any;

	function showToast(
		message: string,
		type: "success" | "error" | "info" = "success",
	) {
		toast = { message, type };
		if (toastTimeout) clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => {
			toast = null;
		}, 4000);
	}

	// Verify backend connectivity
	async function checkConnection(): Promise<boolean> {
		try {
			const res = await fetch(`${apiBase}/health`);
			if (res.ok) {
				isConnected = true;
				return true;
			}
		} catch (e) {
			// Fail silently, connection state drops
		}
		isConnected = false;
		return false;
	}

	// Load list of saved characters from Backend or LocalStorage
	async function refreshCharacters() {
		const online = await checkConnection();
		if (online) {
			try {
				const token = get(auth).token;
				const res = await fetch(`${apiBase}/characters`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (res.ok) {
					charactersList = await res.json();
					return;
				}
			} catch (e) {
				console.error("Failed to fetch from backend", e);
			}
		}

		// Fallback: LocalStorage
		try {
			const localData = localStorage.getItem("genesys_characters");
			if (localData) {
				const parsed = JSON.parse(localData);
				charactersList = Object.values(parsed).map((char: any) => ({
					id: char.id,
					characterName: char.characterName || "Unnamed Character",
					player: char.player || "—",
				}));
			} else {
				// Default seed fallback
				charactersList = [
					{
						id: "default-char",
						characterName: "Dax Karr",
						player: "Alex",
					},
				];
			}
		} catch (e) {
			console.error("Failed to read from localStorage", e);
		}
	}

	// Load list of available global weapons
	async function refreshWeapons() {
		try {
			const res = await fetch(`${apiBase}/weapons`);
			if (res.ok) {
				availableWeapons = await res.json();
			}
		} catch (e) {
			console.error("Failed to fetch weapons", e);
		}
	}

	// Load list of available global armor
	async function refreshArmor() {
		try {
			const res = await fetch(`${apiBase}/armor`);
			if (res.ok) {
				availableArmor = await res.json();
			}
		} catch (e) {
			console.error("Failed to fetch armor", e);
		}
	}

	// Load list of available global critical injuries
	async function refreshGlobalInjuries() {
		try {
			const res = await fetch(`${apiBase}/critical-injuries`);
			if (res.ok) {
				globalInjuries = await res.json();
			}
		} catch (e) {
			console.error("Failed to fetch global injuries", e);
		}
	}

	async function refreshReferenceData() {
		try {
			const cachedSkills = localStorage.getItem("genesys_skills");
			if (cachedSkills) {
				globalSkills = JSON.parse(cachedSkills);
			} else {
				const res = await fetch(`${apiBase}/content/skills`);
				if (res.ok) {
					globalSkills = await res.json();
					localStorage.setItem("genesys_skills", JSON.stringify(globalSkills));
				}
			}

			const cachedChars = localStorage.getItem("genesys_characteristics");
			if (cachedChars) {
				globalCharacteristics = JSON.parse(cachedChars);
			} else {
				const res = await fetch(`${apiBase}/content/characteristics`);
				if (res.ok) {
					globalCharacteristics = await res.json();
					localStorage.setItem("genesys_characteristics", JSON.stringify(globalCharacteristics));
				}
			}

			const cachedQualities = localStorage.getItem("genesys_qualities");
			if (cachedQualities) {
				globalQualities = JSON.parse(cachedQualities);
			} else {
				const res = await fetch(`${apiBase}/content/qualities`);
				if (res.ok) {
					globalQualities = await res.json();
					localStorage.setItem("genesys_qualities", JSON.stringify(globalQualities));
				}
			}

			// Talents
			const cachedTalents = localStorage.getItem("genesys_talents");
			if (cachedTalents) {
				globalTalents = JSON.parse(cachedTalents);
			} else {
				const res = await fetch(`${apiBase}/content/talents`);
				if (res.ok) {
					globalTalents = await res.json();
					localStorage.setItem("genesys_talents", JSON.stringify(globalTalents));
				}
			}

			// Abilities
			const cachedAbilities = localStorage.getItem("genesys_abilities");
			if (cachedAbilities) {
				globalAbilities = JSON.parse(cachedAbilities);
			} else {
				const res = await fetch(`${apiBase}/content/abilities`);
				if (res.ok) {
					globalAbilities = await res.json();
					localStorage.setItem("genesys_abilities", JSON.stringify(globalAbilities));
				}
			}
		} catch (e) {
			console.error("Failed to fetch reference data", e);
		}
	}

	// Create a new global weapon
	async function handleAddWeapon(weapon: Omit<WeaponItem, "id">) {
		try {
			const token = get(auth).token;
			const res = await fetch(`${apiBase}/weapons`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(weapon),
			});
			if (res.ok) {
				showToast("Global weapon added!", "success");
				await refreshWeapons();
			} else {
				showToast("Failed to add weapon.", "error");
			}
		} catch (e) {
			showToast("Error adding weapon.", "error");
		}
	}

	// Create a new global armor
	async function handleAddArmor(armor: Omit<ArmorItem, "id">) {
		try {
			const token = get(auth).token;
			const res = await fetch(`${apiBase}/armor`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
				body: JSON.stringify(armor),
			});
			if (res.ok) {
				await refreshArmor();
				showToast("Global Armor created!", "success");
			} else {
				const data = await res.json();
				showToast(data.error || "Failed to create armor", "error");
			}
		} catch (e) {
			console.error("Failed to add armor", e);
		}
	}

	// Load a specific character's details
	async function loadCharacter(id: string) {
		if (!id) return;

		showToast("Loading character profile...", "info");

		// If switching characters, join the new socket room
		if (socket?.connected && id !== characterId) {
			socket.emit("leave-character", characterId);
			socket.emit("join-character", id);
		}

		const online = await checkConnection();
		if (online) {
			try {
				const token = get(auth).token;
				const res = await fetch(`${apiBase}/characters/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (res.ok) {
					const data = await res.json();
					updatingFromServer = true;
					characterId = data.id;
					characterName = data.characterName || "";
					speciesArchetype = data.speciesArchetype || "";
					career = data.career || "";
					player = data.player || "";
					soakValue = data.soakValue ?? 0;
					woundsThreshold = data.woundsThreshold ?? 0;
					woundsCurrent = data.woundsCurrent ?? 0;
					strainThreshold = data.strainThreshold ?? 0;
					strainCurrent = data.strainCurrent ?? 0;
					defenseRanged = data.defenseRanged ?? 0;
					defenseMelee = data.defenseMelee ?? 0;
					brawn = data.brawn ?? 2;
					agility = data.agility ?? 2;
					intellect = data.intellect ?? 2;
					cunning = data.cunning ?? 2;
					willpower = data.willpower ?? 2;
					presence = data.presence ?? 2;
					skills = ensureSkillsArray(data.skills);
					weapons = data.weapons || [
						{
							name: "",
							skill: "",
							damage: "",
							crit: "",
							range: "",
							special: "",
						},
						{
							name: "",
							skill: "",
							damage: "",
							crit: "",
							range: "",
							special: "",
						},
						{
							name: "",
							skill: "",
							damage: "",
							crit: "",
							range: "",
							special: "",
						},
					];
					armors = data.armors || [
						{
							name: "",
							defense: "",
							soak: "",
							encumbrance: "",
							hardPoints: "",
							special: "",
						},
						{
							name: "",
							defense: "",
							soak: "",
							encumbrance: "",
							hardPoints: "",
							special: "",
						},
						{
							name: "",
							defense: "",
							soak: "",
							encumbrance: "",
							hardPoints: "",
							special: "",
						},
					];
					motivations = data.motivations || {
						strength: "",
						flaw: "",
						desire: "",
						fear: "",
					};
					description = data.description || {
						gender: "",
						age: "",
						height: "",
						build: "",
						hair: "",
						eyes: "",
						notableFeatures: "",
					};
					equipment = data.equipment || {
						money: "",
						weaponsAndArmor: "",
						personalGear: "",
					};
					notes = data.notes || "";
					criticalInjuries = data.criticalInjuries || [];
					talents = data.talents || [];
					selectedId = data.id;
					await tick();
					updatingFromServer = false;
					showToast(
						`Loaded "${data.characterName || "Unnamed"}" from server.`,
						"success",
					);
					return;
				}
			} catch (e) {
				console.error("Load character from backend failed", e);
			}
		}

		// Fallback: LocalStorage
		try {
			const localData = localStorage.getItem("genesys_characters");
			if (localData) {
				const parsed = JSON.parse(localData);
				const char = parsed[id];
				if (char) {
					updatingFromServer = true;
					characterId = char.id;
					characterName = char.characterName || "";
					speciesArchetype = char.speciesArchetype || "";
					career = char.career || "";
					player = char.player || "";
					soakValue = char.soakValue ?? 0;
					woundsThreshold = char.woundsThreshold ?? 0;
					woundsCurrent = char.woundsCurrent ?? 0;
					strainThreshold = char.strainThreshold ?? 0;
					strainCurrent = char.strainCurrent ?? 0;
					defenseRanged = char.defenseRanged ?? 0;
					defenseMelee = char.defenseMelee ?? 0;
					brawn = char.brawn ?? 2;
					agility = char.agility ?? 2;
					intellect = char.intellect ?? 2;
					cunning = char.cunning ?? 2;
					willpower = char.willpower ?? 2;
					presence = char.presence ?? 2;
					skills = ensureSkillsArray(char.skills);
					weapons = char.weapons || [
						{
							name: "",
							skill: "",
							damage: "",
							crit: "",
							range: "",
							special: "",
						},
						{
							name: "",
							skill: "",
							damage: "",
							crit: "",
							range: "",
							special: "",
						},
						{
							name: "",
							skill: "",
							damage: "",
							crit: "",
							range: "",
							special: "",
						},
					];
					armors = char.armors || [
						{
							name: "",
							defense: "",
							soak: "",
							encumbrance: "",
							hardPoints: "",
							special: "",
						},
						{
							name: "",
							defense: "",
							soak: "",
							encumbrance: "",
							hardPoints: "",
							special: "",
						},
						{
							name: "",
							defense: "",
							soak: "",
							encumbrance: "",
							hardPoints: "",
							special: "",
						},
					];
					motivations = char.motivations || {
						strength: "",
						flaw: "",
						desire: "",
						fear: "",
					};
					description = char.description || {
						gender: "",
						age: "",
						height: "",
						build: "",
						hair: "",
						eyes: "",
						notableFeatures: "",
					};
					equipment = char.equipment || {
						money: "",
						weaponsAndArmor: "",
						personalGear: "",
					};
					notes = char.notes || "";
					criticalInjuries = char.criticalInjuries || [];
					talents = char.talents || [];
					selectedId = char.id;
					await tick();
					updatingFromServer = false;
					showToast(
						`Loaded "${char.characterName || "Unnamed"}" from local storage.`,
						"success",
					);
					return;
				}
			}
		} catch (e) {
			console.error("Load character from localStorage failed", e);
		}

		if (id === "default-char") {
			updatingFromServer = true;
			characterId = "default-char";
			characterName = "Dax Karr";
			speciesArchetype = "Human (Leader)";
			career = "Smuggler / Scoundrel";
			player = "Alex";
			soakValue = 4;
			woundsThreshold = 12;
			woundsCurrent = 0;
			strainThreshold = 10;
			strainCurrent = 0;
			defenseRanged = 1;
			defenseMelee = 0;
			brawn = 2;
			agility = 2;
			intellect = 2;
			cunning = 2;
			willpower = 2;
			presence = 2;
			skills = ensureSkillsArray([
				{
					name: "Brawl",
					characteristic: "BR",
					category: "Combat",
					isSetting: true,
					isCareer: true,
					rank: 1,
				},
				{
					name: "Ranged-Light",
					characteristic: "AG",
					category: "Combat",
					isSetting: true,
					isCareer: true,
					rank: 2,
				},
				{
					name: "Deception",
					characteristic: "CUN",
					category: "Social",
					isSetting: true,
					isCareer: true,
					rank: 2,
				},
				{
					name: "Stealth",
					characteristic: "AG",
					category: "General",
					isSetting: true,
					isCareer: false,
					rank: 1,
				},
				{
					name: "Streetwise",
					characteristic: "CUN",
					category: "General",
					isSetting: true,
					isCareer: true,
					rank: 2,
				},
				{
					name: "Athletics",
					characteristic: "BR",
					category: "General",
					isSetting: true,
					isCareer: false,
					rank: 1,
				},
				{
					name: "Negotiation",
					characteristic: "PR",
					category: "Social",
					isSetting: true,
					isCareer: true,
					rank: 1,
				},
			]);
			weapons = [
				{
					name: "Blaster Pistol",
					skill: "Ranged-Light",
					damage: "6",
					crit: "3",
					range: "Medium",
					special: "Stun setting",
				},
				{
					name: "Vibroknife",
					skill: "Melee-Light",
					damage: "+1",
					crit: "2",
					range: "Engaged",
					special: "Pierce 2, Vicious 1",
				},
				{
					name: "",
					skill: "",
					damage: "",
					crit: "",
					range: "",
					special: "",
				},
			];
			armors = [
				{
					name: "",
					defense: "",
					soak: "",
					encumbrance: "",
					hardPoints: "",
					special: "",
				},
				{
					name: "",
					defense: "",
					soak: "",
					encumbrance: "",
					hardPoints: "",
					special: "",
				},
				{
					name: "",
					defense: "",
					soak: "",
					encumbrance: "",
					hardPoints: "",
					special: "",
				},
			];
			motivations = {
				strength: "Brave",
				flaw: "Reckless",
				desire: "Wealth",
				fear: "Poverty",
			};
			description = {
				gender: "Male",
				age: "28",
				height: "1.85m",
				build: "Athletic",
				hair: "Brown",
				eyes: "Green",
				notableFeatures: "Scar on cheek",
			};
			equipment = {
				money: "1500 credits",
				weaponsAndArmor: "Heavy Blaster, Padded Armor",
				personalGear: "Comlink, Datapad",
			};
			notes = "Always shoots first.";
			criticalInjuries = [];
			talents = [
				{
					name: "Quick Draw",
					page: "135",
					summary:
						"Once per round, draw or holster a weapon or accessible item as an incidental.",
				},
			];
			selectedId = "default-char";
			await tick();
			updatingFromServer = false;
			showToast("Loaded default character profile.", "info");
		} else {
			showToast("Could not find character profile.", "error");
		}
	}

	// Save the current character's details
	async function saveCharacter() {
		showToast("Saving character profile...", "info");
		const payload = {
			id: characterId,
			characterName,
			speciesArchetype,
			career,
			player,
			soakValue,
			woundsThreshold,
			woundsCurrent,
			strainThreshold,
			strainCurrent,
			defenseRanged,
			defenseMelee,
			brawn,
			agility,
			intellect,
			cunning,
			willpower,
			presence,
			skills,
			weapons,
			armors,
			motivations,
			description,
			equipment,
			notes,
			criticalInjuries,
			talents,
		};

		const online = await checkConnection();
		if (online) {
			try {
				const token = get(auth).token;
				const res = await fetch(`${apiBase}/characters`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(payload),
				});
				if (res.ok) {
					showToast(
						`Character "${characterName || "Unnamed"}" saved to server.`,
						"success",
					);
					await refreshCharacters();
					selectedId = characterId;
					return;
				}
			} catch (e) {
				console.error("Save to backend failed", e);
			}
		}

		// Fallback: LocalStorage
		try {
			const localData =
				localStorage.getItem("genesys_characters") || "{}";
			const parsed = JSON.parse(localData);
			parsed[characterId] = {
				...payload,
				updatedAt: Date.now(),
			};
			localStorage.setItem("genesys_characters", JSON.stringify(parsed));
			showToast(
				`Character "${characterName || "Unnamed"}" saved to local storage.`,
				"success",
			);
			await refreshCharacters();
			selectedId = characterId;
		} catch (e) {
			showToast("Failed to save character profile.", "error");
		}
	}

	// Start a new character profile
	function createNewCharacter() {
		const newId = `char-${Math.random().toString(36).substring(2, 11)}`;

		if (socket?.connected) {
			socket.emit("leave-character", characterId);
			socket.emit("join-character", newId);
		}

		updatingFromServer = true;
		characterId = newId;
		characterName = "";
		speciesArchetype = "";
		career = "";
		player = "";
		soakValue = 0;
		woundsThreshold = 0;
		woundsCurrent = 0;
		strainThreshold = 0;
		strainCurrent = 0;
		defenseRanged = 0;
		defenseMelee = 0;
		brawn = 2;
		agility = 2;
		intellect = 2;
		cunning = 2;
		willpower = 2;
		presence = 2;
		skills = ensureSkillsArray(null);
		weapons = [
			{
				name: "",
				skill: "",
				damage: "",
				crit: "",
				range: "",
				special: "",
			},
			{
				name: "",
				skill: "",
				damage: "",
				crit: "",
				range: "",
				special: "",
			},
			{
				name: "",
				skill: "",
				damage: "",
				crit: "",
				range: "",
				special: "",
			},
		];
		armors = [
			{
				name: "",
				defense: "",
				soak: "",
				encumbrance: "",
				hardPoints: "",
				special: "",
			},
			{
				name: "",
				defense: "",
				soak: "",
				encumbrance: "",
				hardPoints: "",
				special: "",
			},
			{
				name: "",
				defense: "",
				soak: "",
				encumbrance: "",
				hardPoints: "",
				special: "",
			},
		];
		motivations = { strength: "", flaw: "", desire: "", fear: "" };
		description = {
			gender: "",
			age: "",
			height: "",
			build: "",
			hair: "",
			eyes: "",
			notableFeatures: "",
		};
		equipment = { money: "", weaponsAndArmor: "", personalGear: "" };
		notes = "";
		criticalInjuries = [];
		talents = [];
		selectedId = "";
		setTimeout(() => {
			updatingFromServer = false;
		}, 50);
		showToast(
			"New sheet initialized. Enter details and click Save.",
			"info",
		);
	}

	// Delete current character profile
	async function deleteCharacter() {
		if (characterId === "default-char") {
			showToast("Cannot delete the default character template.", "error");
			return;
		}

		const confirmDelete = confirm(
			`Are you sure you want to delete "${characterName || "this character"}"?`,
		);
		if (!confirmDelete) return;

		const online = await checkConnection();
		if (online) {
			try {
				const token = get(auth).token;
				const res = await fetch(
					`${apiBase}/characters/${characterId}`,
					{
						method: "DELETE",
						headers: { Authorization: `Bearer ${token}` },
					},
				);
				if (res.ok) {
					showToast("Character deleted from server.", "success");
					await loadCharacter("default-char");
					await refreshCharacters();
					return;
				}
			} catch (e) {
				console.error("Delete character from backend failed...", e);
			}
		}

		// Fallback: LocalStorage
		try {
			const localData = localStorage.getItem("genesys_characters");
			if (localData) {
				const parsed = JSON.parse(localData);
				if (parsed[characterId]) {
					delete parsed[characterId];
					localStorage.setItem(
						"genesys_characters",
						JSON.stringify(parsed),
					);
					showToast(
						"Character deleted from local storage.",
						"success",
					);
					await loadCharacter("default-char");
					await refreshCharacters();
					return;
				}
			}
		} catch (e) {
			console.error(e);
		}
		showToast("Failed to delete character.", "error");
	}

	onMount(() => {
		let checkInterval: any;

		if (typeof window !== "undefined") {
			const hostname = window.location.hostname;
			const backendUrl =
				env.PUBLIC_BACKEND_URL || `http://${hostname}:3000`;
			console.log("[DEBUG] env.PUBLIC_BACKEND_URL is:", env.PUBLIC_BACKEND_URL);
			console.log("[DEBUG] Using backendUrl:", backendUrl);
			apiBase = `${backendUrl}/api`;

			// Initialize socket connection
			const token = get(auth).token;
			socket = io(backendUrl, {
				withCredentials: true,
				auth: { token },
				transports: ["websocket"]
			});

			socket.on("connect", () => {
				console.log("Connected to socket server");
				isConnected = true;
				socket?.emit("join-character", characterId);
			});

			socket.on("character-state", async (data: any) => {
				if (data.id !== characterId && data.id !== selectedId) return;
				updatingFromServer = true;
				characterName = data.characterName || "";
				speciesArchetype = data.speciesArchetype || "";
				career = data.career || "";
				player = data.player || "";
				soakValue = data.soakValue ?? 0;
				woundsThreshold = data.woundsThreshold ?? 0;
				woundsCurrent = data.woundsCurrent ?? 0;
				strainThreshold = data.strainThreshold ?? 0;
				strainCurrent = data.strainCurrent ?? 0;
				defenseRanged = data.defenseRanged ?? 0;
				defenseMelee = data.defenseMelee ?? 0;
				brawn = data.brawn ?? 2;
				agility = data.agility ?? 2;
				intellect = data.intellect ?? 2;
				cunning = data.cunning ?? 2;
				willpower = data.willpower ?? 2;
				presence = data.presence ?? 2;
				skills = ensureSkillsArray(data.skills);
				if (data.weapons) weapons = data.weapons;
				if (data.armors) armors = data.armors;
				if (data.motivations) motivations = data.motivations;
				if (data.description) description = data.description;
				if (data.equipment) equipment = data.equipment;
				if (data.notes !== undefined) notes = data.notes;
				if (data.criticalInjuries)
					criticalInjuries = data.criticalInjuries;
				if (data.talents) talents = data.talents;
				await tick();
				updatingFromServer = false;
			});

			socket.on("character-updated", async (data: any) => {
				if (data.id !== characterId) return;
				updatingFromServer = true;
				characterName = data.characterName || "";
				speciesArchetype = data.speciesArchetype || "";
				career = data.career || "";
				player = data.player || "";
				soakValue = data.soakValue ?? 0;
				woundsThreshold = data.woundsThreshold ?? 0;
				woundsCurrent = data.woundsCurrent ?? 0;
				strainThreshold = data.strainThreshold ?? 0;
				strainCurrent = data.strainCurrent ?? 0;
				defenseRanged = data.defenseRanged ?? 0;
				defenseMelee = data.defenseMelee ?? 0;
				brawn = data.brawn ?? 2;
				agility = data.agility ?? 2;
				intellect = data.intellect ?? 2;
				cunning = data.cunning ?? 2;
				willpower = data.willpower ?? 2;
				presence = data.presence ?? 2;
				skills = ensureSkillsArray(data.skills);
				if (data.weapons) weapons = data.weapons;
				if (data.armors) armors = data.armors;
				await tick();
				updatingFromServer = false;
			});

			socket.on("disconnect", () => {
				console.log("Disconnected from socket server");
				isConnected = false;
			});
		}

		async function init() {
			await refreshCharacters();
			await refreshWeapons();
			await refreshArmor();
			await refreshGlobalInjuries();
			await refreshReferenceData();

			// If characters list has items, load the first one, otherwise default-char
			if (charactersList.length > 0) {
				const hasDefault = charactersList.some(
					(c) => c.id === "default-char",
				);
				await loadCharacter(
					hasDefault ? "default-char" : charactersList[0].id,
				);
			} else {
				await loadCharacter("default-char");
			}
		}

		init();

		// Poll backend health silently
		checkInterval = setInterval(async () => {
			await checkConnection();
		}, 10000);

		return () => {
			clearInterval(checkInterval);
			socket?.disconnect();
		};
	});

	function handleLogout() {
		logout();
		window.location.href = "/login";
	}

	// Trigger socket updates whenever state changes, except when updating from server
	let debounceTimeout: any;
	$effect(() => {
		// Deep watch skills object using stringify
		const _tracker =
			JSON.stringify(skills) +
			JSON.stringify(weapons) +
			JSON.stringify(armors) +
			JSON.stringify(motivations) +
			JSON.stringify(description) +
			JSON.stringify(equipment) +
			JSON.stringify(criticalInjuries) +
			JSON.stringify(talents) +
			notes +
			brawn +
			agility +
			intellect +
			cunning +
			willpower +
			presence;

		const state = {
			id: characterId,
			characterName,
			speciesArchetype,
			career,
			player,
			soakValue,
			woundsThreshold,
			woundsCurrent,
			strainThreshold,
			strainCurrent,
			defenseRanged,
			defenseMelee,
			skills,
			weapons,
			armors,
			motivations,
			description,
			equipment,
			notes,
			criticalInjuries,
			talents,
		};

		if (updatingFromServer || !socket?.connected) return;

		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			socket?.emit("update-character", state);
			console.log("Sent update to server:", state);
		}, 300);
	});
</script>

<svelte:head>
	<title>Genesys Character Sheets</title>
</svelte:head>

<!-- Slide-down Toasts -->
{#if toast}
	<div class="toast-container">
		<div class="toast {toast.type}">
			{toast.message}
		</div>
	</div>
{/if}

<main class="page-container">
	<header class="app-header">
		<h1 class="app-title">GENESYS CHARACTER SHEETS</h1>
		<p class="app-subtitle">
			Select, load, edit, and save your characters. Connects automatically
			to local API with offline fallback.
		</p>
	</header>

	<ThemeButton />

	<!-- Controls Section at the Top -->
	<section class="control-bar">
		<div class="controls-left">
			<div class="status-indicator">
				<span class="status-dot {isConnected ? 'online' : 'offline'}"
				></span>
				<span class="status-text"
					>{isConnected ? "Server Connected" : "Offline Mode"}</span
				>
			</div>

			<div class="select-wrapper">
				<select
					id="character-select"
					class="character-select"
					bind:value={selectedId}
					onchange={(e) => loadCharacter(e.currentTarget.value)}
					aria-label="Select Character Profile"
				>
					<option value="" disabled selected
						>-- Select Profile --</option
					>
					{#each charactersList as char}
						<option value={char.id}>
							{char.characterName || "Unnamed Character"} ({char.player ||
								"No Player"})
						</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="controls-right">
			{#if currentUser?.role === "admin"}
				<a
					href="/database"
					class="btn btn-secondary"
					style="background: transparent; border: 1px solid var(--color-border); display: flex; align-items: center; text-decoration: none;"
					title="View Database"
				>
					<svg
						class="btn-icon"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
						/>
					</svg>
					Database
				</a>
			{/if}

			<button
				type="button"
				class="btn btn-secondary"
				style="background: transparent; border: 1px solid var(--color-border);"
				onclick={handleLogout}
				title="Log Out"
			>
				<svg
					class="btn-icon"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
					/>
				</svg>
				Logout
			</button>
			<button
				type="button"
				class="btn btn-secondary"
				onclick={createNewCharacter}
				title="Create New Character Sheet"
			>
				<svg
					class="btn-icon"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.5"
						d="M12 4v16m8-8H4"
					/>
				</svg>
				New
			</button>

			<button
				type="button"
				class="btn btn-primary"
				onclick={saveCharacter}
				title="Save Current Character Settings"
			>
				<svg
					class="btn-icon"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.5"
						d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
					/>
				</svg>
				Save
			</button>

			{#if characterId !== "default-char"}
				<button
					type="button"
					class="btn btn-danger"
					onclick={deleteCharacter}
					title="Delete Character Profile"
				>
					<svg
						class="btn-icon"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.5"
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						/>
					</svg>
					Delete
				</button>
			{/if}
		</div>
	</section>

	<div class="tabs-container">
		<button
			type="button"
			class="tab-btn"
			class:active={activeTab === "main"}
			onclick={() => (activeTab = "main")}>Main Sheet</button
		>
		<button
			type="button"
			class="tab-btn"
			class:active={activeTab === "details"}
			onclick={() => (activeTab = "details")}>Details & Gear</button
		>
	</div>

	{#if activeTab === "main"}
		<section class="demo-section">
			<!-- The Genesys CharacterHeader component -->
			<CharacterHeader
				bind:characterName
				bind:speciesArchetype
				bind:career
				bind:player
			/>
		</section>

		<!-- Derived Attribute StatBlocks Row -->
		<section class="stats-row">
			<StatBlock
				title="SOAK VALUE"
				type="single"
				bind:value={soakValue}
			/>
			<StatBlock
				title="WOUNDS"
				type="dual"
				bind:leftValue={woundsThreshold}
				bind:rightValue={woundsCurrent}
				leftLabel="THRESHOLD"
				rightLabel="CURRENT"
			/>
			<StatBlock
				title="STRAIN"
				type="dual"
				bind:leftValue={strainThreshold}
				bind:rightValue={strainCurrent}
				leftLabel="THRESHOLD"
				rightLabel="CURRENT"
			/>
			<StatBlock
				title="DEFENSE"
				type="dual"
				bind:leftValue={defenseRanged}
				bind:rightValue={defenseMelee}
				leftLabel="RANGED"
				rightLabel="MELEE"
			/>
		</section>

		<!-- Characteristics Section -->
		<CharacteristicsBlock
			bind:brawn
			bind:agility
			bind:intellect
			bind:cunning
			bind:willpower
			bind:presence
			{globalCharacteristics}
		/>

		<!-- Skills Section -->
		<SkillsSheet bind:skills {globalSkills} />

		<!-- Weapons Section -->
		<WeaponsBlock
			bind:weapons
			{availableWeapons}
			onAddWeapon={handleAddWeapon}
			{globalQualities}
		/>

		<!-- Armor Section -->
		<ArmorBlock 
			bind:armors 
			{availableArmor} 
			onAddArmor={handleAddArmor} 
			{globalQualities} 
		/>
	{:else}
		<CharacterDetailsSheet
			bind:motivations
			bind:description
			bind:equipment
			bind:notes
			bind:criticalInjuries
			bind:talents
			{globalTalents}
			{globalAbilities}
			{globalInjuries}
		/>
	{/if}

	<section class="state-inspector">
		<h2 class="inspector-title">Reactive State Inspector</h2>
		<div class="inspector-grid">
			<div class="state-item">
				<span class="state-label">Profile ID:</span>
				<span class="state-value code-font">{characterId}</span>
			</div>
			<div class="state-item">
				<span class="state-label">Name:</span>
				<span class="state-value">{characterName || "—"}</span>
			</div>
			<div class="state-item">
				<span class="state-label">Species/Archetype:</span>
				<span class="state-value">{speciesArchetype || "—"}</span>
			</div>
			<div class="state-item">
				<span class="state-label">Career:</span>
				<span class="state-value">{career || "—"}</span>
			</div>
			<div class="state-item">
				<span class="state-label">Player:</span>
				<span class="state-value">{player || "—"}</span>
			</div>
			<div class="state-item">
				<span class="state-label">Soak:</span>
				<span class="state-value">{soakValue}</span>
			</div>
			<div class="state-item">
				<span class="state-label">Wounds:</span>
				<span class="state-value"
					>{woundsCurrent} / {woundsThreshold}</span
				>
			</div>
			<div class="state-item">
				<span class="state-label">Strain:</span>
				<span class="state-value"
					>{strainCurrent} / {strainThreshold}</span
				>
			</div>
			<div class="state-item">
				<span class="state-label">Defense:</span>
				<span class="state-value"
					>R: {defenseRanged} | M: {defenseMelee}</span
				>
			</div>
		</div>
	</section>
</main>

<style>
	.page-container {
		width: 100%;
		max-width: 900px;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin: 0 auto;
	}

	.tabs-container {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 1rem;
		margin: -0.5rem 0 1rem 0;
	}

	.tab-btn {
		font-family: var(--font-brand);
		font-size: 1.1rem;
		font-weight: 700;
		padding: 0.5rem 2rem;
		background: var(--color-card-bg);
		border: 1.5px solid var(--color-line-brand);
		color: var(--color-text-brand);
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.tab-btn:hover {
		background: var(--color-line-brand);
		color: var(--color-bg-page);
	}

	.tab-btn.active {
		background: var(--color-text-brand);
		color: var(--color-bg-page);
		border-color: var(--color-text-brand);
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
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.app-subtitle {
		font-size: 1rem;
		color: #64748b;
		max-width: 700px;
		margin: 0 auto;
		line-height: 1.5;
	}

	/* Toast styling */
	.toast-container {
		position: fixed;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1000;
		pointer-events: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 90%;
		max-width: 450px;
	}

	.toast {
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		font-family: var(--font-body);
		font-weight: 500;
		font-size: 0.95rem;
		color: white;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
		pointer-events: auto;
		animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		border: 1.5px solid transparent;
		text-align: center;
		width: 100%;
	}

	.toast.success {
		background-color: #064e3b;
		border-color: #059669;
	}

	.toast.error {
		background-color: #7f1d1d;
		border-color: #dc2626;
	}

	.toast.info {
		background-color: #1e3a8a;
		border-color: #3b82f6;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(1rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Control bar styling */
	.control-bar {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem 1.25rem;
		background: var(--color-card-bg);
		border: 1.5px solid var(--color-line-brand);
		border-radius: 8px;
		box-shadow: var(--shadow-premium);
		width: 100%;
	}

	.controls-left {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.25rem;
		width: 100%;
	}

	.controls-right {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		width: 100%;
		flex-wrap: wrap;
	}

	/* Status indicator */
	.status-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		user-select: none;
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: inline-block;
	}

	.status-dot.online {
		background-color: #10b981;
		box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
	}

	.status-dot.offline {
		background-color: #f59e0b;
		box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
	}

	.status-text {
		font-family: var(--font-brand);
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--color-text-brand);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Select profile dropdown */
	.select-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		flex-grow: 1;
		max-width: 320px;
	}

	.character-select {
		width: 100%;
		font-family: var(--font-body);
		font-size: 0.9rem;
		padding: 0.45rem 2rem 0.45rem 0.75rem;
		border: 1.5px solid var(--color-line-brand);
		border-radius: 4px;
		background-color: var(--color-card-bg);
		color: var(--color-text-dark);
		cursor: pointer;
		outline: none;
		font-weight: 500;
		appearance: none;
		-webkit-appearance: none;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.character-select:focus {
		border-color: var(--color-focus);
		box-shadow: 0 0 0 3px var(--color-highlight);
	}

	.select-wrapper::after {
		content: "";
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		width: 0;
		height: 0;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-top: 5px solid var(--color-text-brand);
		pointer-events: none;
		opacity: 0.8;
	}

	/* Button design */
	.btn {
		font-family: var(--font-brand);
		font-size: 1.05rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: 0.45rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		transition:
			background-color 0.2s,
			border-color 0.2s,
			color 0.2s,
			transform 0.1s;
		user-select: none;
		outline: none;
	}

	.btn:active {
		transform: scale(0.97);
	}

	.btn-icon {
		width: 16px;
		height: 16px;
	}

	.btn-primary {
		background-color: var(--color-text-brand-hover);
		color: var(--color-text-inverted);
		border: 1.5px solid var(--color-text-brand);
	}

	.btn-primary:hover {
		background-color: var(--color-blue-steel);
		border-color: var(--color-text-brand);
		box-shadow: 0 8px 16px 0 rgba(171, 171, 171, 0.6);
	}

	.btn-secondary {
		background-color: transparent;
		color: var(--color-text-brand);
		border: 1.5px solid var(--color-line-brand);
	}

	.btn-secondary:hover {
		background-color: var(--color-blue-steel);
		border-color: var(--color-text-brand);
		box-shadow: 0 8px 16px 0 rgba(171, 171, 171, 0.6);
	}

	.btn-danger {
		background-color: transparent;
		color: #ef4444;
		border: 1.5px solid #ef4444;
	}

	.btn-danger:hover {
		background-color: rgba(239, 68, 68, 0.08);
	}

	/* Sheet display and state inspector */
	.demo-section {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.stats-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		justify-items: center;
		gap: 2rem 1rem;
		width: 100%;
		margin: 0.5rem 0;
	}

	.state-inspector {
		background: var(--color-card-bg);
		color: var(--color-text);
		border: 1.5px solid var(--color-line-brand);
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: var(--shadow-premium);
	}

	.inspector-title {
		font-family: var(--font-brand);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-brand);
		letter-spacing: 0.05em;
		margin-bottom: 1rem;
		border-bottom: 1.5px dashed #e2e8f0;
		padding-bottom: 0.5rem;
	}

	.inspector-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1.25rem;
	}

	.state-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.state-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		font-weight: 700;
		color: #94a3b8;
		letter-spacing: 0.05em;
	}

	.state-value {
		font-family: var(--font-body);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--color-text-dark);
		word-break: break-all;
	}

	.code-font {
		font-family: "Courier New", Courier, monospace;
		font-size: 0.85rem;
		color: #475569;
		background-color: #f1f5f9;
		padding: 0.1rem 0.3rem;
		border-radius: 3px;
		border: 1px solid #e2e8f0;
	}

	/* Responsive tweaks */
	@media (max-width: 768px) {
		.control-bar {
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
			padding: 1rem;
		}

		.controls-left {
			flex-direction: column;
			align-items: stretch;
			width: 100%;
			gap: 0.75rem;
		}

		.select-wrapper {
			max-width: 100%;
		}

		.controls-right {
			width: 100%;
			justify-content: flex-end;
		}

		.btn {
			flex-grow: 1;
		}
	}
</style>
