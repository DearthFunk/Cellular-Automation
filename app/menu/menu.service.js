(function () {
	'use strict';

	angular
		.module('menuServiceModule', [])
		.service('menuService', menuService);

	menuService.$inject = [];

	function menuService() {

		var service = {
			colorOne: '#FF0000',
			colorTwo: '#0000FF',
			animationSpeed: 5,
			playing: false,
			borders: false,
			surroundingCell: [
				{y:-1, x:-1, val:false, class:"rotate fa-arrow-left"},
				{y:-1, x: 0, val:false, class:"fa-arrow-up"},
				{y:-1, x: 1, val:false, class:"rotate fa-arrow-up"},
				{y: 0, x:-1, val:true,  class:"fa-arrow-left"},
				{y: 0, x: 0},
				{y: 0, x: 1, val:true,   class:"fa-arrow-right"},
				{y: 1, x:-1, val:false,  class:"rotate fa-arrow-down"},
				{y: 1, x: 0, val:true,   class:"fa-arrow-down"},
				{y: 1, x: 1, val:false,  class:"rotate fa-arrow-right"}
			],
			growthTypes:  [
				{index:0},
				{index:1,
					birth:[3],
					stayAlive:[2,3]
				},
				{index:2},
				{index:3},
				{index:4}
			],
			birthOptions:[{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8}],
			stayAliveOptions:[{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8}]
		};

		service.activeGrowthType = service.growthTypes[1];

		return service;

		/////////////////////////////////

	}
})();