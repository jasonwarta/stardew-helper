const data = require('constants/data.json');
window.data = data;

window.otherData = data.map((entry) => {
	const extras = {};
	for (const key of Object.keys(entry)) {
		for (const season of ['spring', 'summer', 'fall', 'winter']) {
			console.log(entry, key, season);
			if (entry[key]?.toLowerCase().indexOf(season) !== -1) {
				if (extras.seasons && !extras.seasons.includes(season)) {
					extras.seasons = [season, ...extras.seasons];
				} else extras.seasons = [season];
			}
		}
		if (!extras.seasons) extras.seasons = [];
	}

	return {
		...extras,
		...entry,
	};
});
console.log(JSON.stringify(window.otherData));
