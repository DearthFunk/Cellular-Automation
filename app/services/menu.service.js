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
		});

	menuService.$inject = ['GROWTH_TYPES', 'genColors'];

	function menuService(GROWTH_TYPES, genColors) {

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
				{type: GROWTH_TYPES.NEWTYPE3,
					name: 'TBD'},
				{type: GROWTH_TYPES.NEWTYPE4,
					name: 'TBD'},
				{type: GROWTH_TYPES.NEWTYPE5,
					name: 'TBD'}
			],
			logPositionColor: '#DDDDFF',
			logPositionColorActive: '',
			editingLogPosition: false,
			logX: 1,
			logY: 1,
			log: [],
			addLogItem: addLogItem
		};
		service.logPositionColorActive = genColors.convert.rgba(service.logPositionColor, 0.5);
		return service;

		/////////////////////////////////

		function addLogItem(type, msg) {
			service.log.push([type, msg]);
		}

	}
})();