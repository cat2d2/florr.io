// **WARNING**
// - This script makes it seem like you have petals that you actually don't.
//   Therefore, if you equip them or use them for crafting more than once, your account will be banned.
// - We do NOT recommend running the script outside of a guest account if you are not a ban speedrunner!
// - Don't forget that we do NOT have any responsibility for any damage to you caused by the script.

(async () => {

	const currentVersionHash = (await (await fetch("https://florr.io")).text()).match(/const\sversionHash\s=\s"(.*)";/)[1];
	if (currentVersionHash !== "0f681e078e2367a601082a95ace3926a8de22e7a") {
		console.error("VersionHash error (tell this to kit2d2 if broken on discord) Join it: https://discord.gg/m4DefhCemY");
		return;
	}

	const kMaxRarities = 8;
	const kMaxPetals = 80;
	const petalInventoryBaseAddress = 2160116;

	for (let petalIndex = 1; petalIndex <= kMaxPetals; petalIndex++) {
		for (let rarityIndex = 0; rarityIndex < kMaxRarities; rarityIndex++) {
			const offset = ((petalIndex * kMaxRarities + rarityIndex) << 2);
			Module.HEAPU32[(petalInventoryBaseAddress + offset) >> 2] = 20;
		}
	}

	console.log("success!");

})();
