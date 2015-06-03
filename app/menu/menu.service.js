(function () {
	'use strict';

	angular
		.module('menuServiceModule', [])
		.service('menuService', menuService);

	menuService.$inject = ['RULE_TEMPLATES'];

	function menuService(RULE_TEMPLATES) {

		var service = {
			colorOne: '#FF0000',
			colorTwo: '#0000FF',
			animationSpeed: 5,
			playing: false,
			borders: false,


			growthTypes:  [
				{index:0, activatedCells:[2,4,6,8]},
				{index:1, stayAlive: [], birth:[]},
				{index:2},
				{index:3},
				{index:4}
			],
			birthOptions:[{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8}],
			stayAliveOptions:[{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8}],
		};

		service.activeGrowthType = service.growthTypes[1];
		service.activeGrowthType.stayAlive = RULE_TEMPLATES[0].stayAlive;
		service.activeGrowthType.birth = RULE_TEMPLATES[0].birth;

	return service;

		/////////////////////////////////

	}
})();