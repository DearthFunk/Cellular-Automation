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
			automataPattern: {
				l:{order:1, val:true,   class:"fa-arrow-left"},
				r:{order:2, val:true,   class:"fa-arrow-right"},
				t:{order:3, val:false,  class:"fa-arrow-up"},
				b:{order:4, val:true,   class:"fa-arrow-down"},
				tr:{order:5,val:false,  class:"rotate fa-arrow-up"},
				br:{order:6,val:false,  class:"rotate fa-arrow-right"},
				tl:{order:7,val:false,  class:"rotate fa-arrow-left"},
				bl:{order:8,val:false,  class:"rotate fa-arrow-down"}
			},
			growthTypes:  [
				{index:0},
				{index:1},
				{index:2},
				{index:3},
				{index:4}
			]
		};

		service.activeGrowthType = service.growthTypes[0];

		return service;

		/////////////////////////////////

	}
})();