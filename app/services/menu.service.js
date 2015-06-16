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
			animationSpeed: 80,
			playing: false,
			borders: false,
			growthTypes:  [
				{index:0, name: 'TOGGLER',
					activatedCells:[2,4,6,8]},
				{index:1, name: 'LIFE AND DEATH',
					stayAlive: [], birth:[]},
				{index:2},
				{index:3},
				{index:4}
			],
			//index, event type, description
			log: [{type:'START',msg:'Welcome to the Log!!!'}]
		};

		service.activeGrowthType = service.growthTypes[1];
		service.activeGrowthType.stayAlive = RULE_TEMPLATES[0].stayAlive;
		service.activeGrowthType.birth = RULE_TEMPLATES[0].birth;

	return service;

		/////////////////////////////////

	}
})();