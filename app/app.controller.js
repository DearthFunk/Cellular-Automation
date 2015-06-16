(function () {
	'use strict';

	angular
		.module('cellularAutomation', [
			'boardModule',
			'menuModule',
			'genColorsServiceModule',
			'menuServiceModule'
		])
		.constant('SPEED', {
			MIN: 1,
			MAX: 200
		})
		.constant('GROWTH_TYPES', {
			TOGGLER: 1,
			LIFE_AND_DEATH: 2,
			NEWTYPE3: 3,
			NEWTYPE4: 4,
			NEWTYPE5: 5
		});

})();