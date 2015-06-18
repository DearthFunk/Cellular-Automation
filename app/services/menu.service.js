(function () {
	'use strict';

	angular
		.module('menuServiceModule', [])
		.service('menuService', menuService)
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
		})
		.constant('LOG_TYPE', {
			INIT: 'initialized app',
			STEP: 'step',
			CLEAR: 'grid cleared',
			GRID_RESIZE: 'grid resized',
			CELL_TOGGLE: 'cell toggled',
			MOUSE_TOGGLE: 'mouse toggled'
		});

	menuService.$inject = ['GROWTH_TYPES', 'LOG_TYPE'];

	function menuService(GROWTH_TYPES, LOG_TYPE) {

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
			log: [],
			addLogItem: addLogItem
		};

	return service;

		/////////////////////////////////

		function addLogItem(type, msg) {
			service.log.push({type: type, msg: msg});
		}

	}
})();