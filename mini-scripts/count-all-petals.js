// Counts all the petals you have so you can feel like a sigma

(async () => {

	const currentVersionHash = (await (await fetch("https://florr.io")).text()).match(/const\sversionHash\s=\s"(.*)";/)[1];
	if (currentVersionHash !== "c214e5b8d15240241f126ae0b60d46270f6e85c5") {
		console.error("Versionhash error.");
		return;
	}

	const textDecoder = new TextDecoder();
	function readStringInDataSection(address) {
		let startAt = address;
		let length = 0;
		while (true) {
			if (Module.HEAPU8[(startAt + length)] === 0x00) {
				break;
			}
			length++;
		}
		const buffer = Module.HEAPU8.slice(startAt, (startAt + length));
		return textDecoder.decode(buffer);
	}

	const kMaxRarities = 9;
	const kMaxPetals = 89;
	const petalInventoryBaseAddress = 2719944;
	const petalDefinitionNameBaseAddress = 1953464;

	const petals = {};
	const totals = new Array(kMaxRarities).fill(0);

	for (let petalIndex = 1; petalIndex <= kMaxPetals; petalIndex++) {

		const petalNameAddress = Module.HEAPU32[(petalDefinitionNameBaseAddress + ((6 << 2) * petalIndex)) >> 2];
		const petalName = readStringInDataSection(petalNameAddress);

		const amounts = new Array();
		for (let rarityIndex = 0; rarityIndex < kMaxRarities; rarityIndex++) {
			const amount = Module.HEAPU32[(petalInventoryBaseAddress + ((petalIndex * kMaxRarities + rarityIndex) << 2)) >> 2];
			amounts.push(amount);
			totals[rarityIndex] += amount;
		}
		petals[petalName] = amounts;

	}

	console.log("Petals:", petals);
	console.log("Total:", totals);

})();