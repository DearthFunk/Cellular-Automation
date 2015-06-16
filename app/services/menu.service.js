(function () {
	'use strict';

	angular
		.module('menuServiceModule', [])
		.service('menuService', menuService);

	menuService.$inject = ['GROWTH_TYPES'];

	function menuService(GROWTH_TYPES ) {

		var service = {
			colorOne: '#FF0000',
			colorTwo: '#0000FF',
			animationSpeed: 80,
			playing: false,
			borders: false,
			growthTypes:  [
				{type: GROWTH_TYPES.TOGGLER,
					name: 'TOGGLER',
					activatedCells:[2,4,6,8]
				},
				{type: GROWTH_TYPES.LIFE_AND_DEATH,
					name: 'LIFE AND DEATH',
					stayAlive: [],
					birth:[]},
				{type: GROWTH_TYPES.NEWTYPE3},
				{type: GROWTH_TYPES.NEWTYPE4},
				{type: GROWTH_TYPES.NEWTYPE5}
			],
			//index, event type, description
			log: [{type:'START',msg:'Welcome to the Log!!!'}]
		};


	return service;

		/////////////////////////////////

	}
})();