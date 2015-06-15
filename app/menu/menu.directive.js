(function () {
	'use strict';
	angular
		.module('menuModule', [])
		.directive('menu', menu);

	menu.$inject = [];

	function menu() {
		var directive = {
			restrict: 'A',
			templateUrl: 'app/menu/menu.html',
			replace: true,
			controller: menuController,
			bindToController: true
		};
		return directive;
	}

	menuController.$inject = ['$scope', '$rootScope', 'RULE_TEMPLATES', 'SPEED', 'menuService'];

	function menuController($scope, $rootScope, RULE_TEMPLATES, SPEED, menuService) {

		$scope.menuSize = 220;
		$scope.RULE_TEMPLATES = RULE_TEMPLATES;
		$scope.SPEED = SPEED;
		$scope.menuService = menuService;
		$scope.clearGrid = clearGrid;
		$scope.loadRule = loadRule;
		$scope.recalculateColors = recalculateColors;
		$scope.drawStep = drawStep;
		$scope.editingSpeed = false;

		///////////////////////////////////////////////////

		function loadRule(rule) {
			menuService.activeGrowthType.stayAlive = angular.copy(rule.stayAlive);
			menuService.activeGrowthType.birth = angular.copy(rule.birth);
		}
		function drawStep(e) {
			e.stopPropagation();
			$rootScope.$broadcast('drawStepEvent');
		}
		function clearGrid(e)    {
			e.stopPropagation();
			$rootScope.$broadcast('clearGridEvent');
		}
		function recalculateColors() {
			$rootScope.$broadcast('calculateColorsEvent');
		}
	}
})();