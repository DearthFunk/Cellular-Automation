(function () {
	'use strict';

	angular
		.module('menuServiceModule', [])
		.service('menuService', menuService)
		.constant('GROWTH_TYPES', {
			TOGGLER: 1,
			LIFE_AND_DEATH: 2,
			NEWTYPE3: 3,
			NEWTYPE4: 4,
			NEWTYPE5: 5
		});

	menuService.$inject = ['GROWTH_TYPES'];

	function menuService(GROWTH_TYPES) {

		var service = {
			colorOne: '#FF0000',
			colorTwo: '#0000FF',
			animationSpeed: 80,
			playing: false,
			growthTypes:  [
				{type: GROWTH_TYPES.TOGGLER,
					name: 'TOGGLER',
					activatedCells:[2,4,6,8]
				},
				{type: GROWTH_TYPES.LIFE_AND_DEATH,
					name: 'LIFE AND DEATH',
					stayAlive: [],
					birth:[]},
				{type: GROWTH_TYPES.NEWTYPE3,
					name: 'TBD'},
				{type: GROWTH_TYPES.NEWTYPE4,
					name: 'TBD'},
				{type: GROWTH_TYPES.NEWTYPE5,
					name: 'TBD'}
			]
		};

		return service;

	}
})();