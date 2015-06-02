(function () {
	'use strict';

	angular
		.module('life', [
			'boardModule',
			'menuModule',
			'genColorsServiceModule',
			'menuServiceModule',
			'checklist-model'
		])
		.constant('MENU_SIZE', 220)
		.controller('lifeController', lifeController);

	lifeController.$inject = ['$scope'];

	function lifeController($scope) {

	}

})();