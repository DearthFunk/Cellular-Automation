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
		$scope.loadImageFile = loadImageFile;
		$scope.loadRule = loadRule;
		$scope.recalculateColors = recalculateColors;
		$scope.drawStep = drawStep;
		$scope.editingSpeed = false;


		var fileUploader = document.createElement('input');
		fileUploader.type = 'file';
		fileUploader.onchange = upload;

		///////////////////////////////////////////////////

		function drawStep(e) {
			e.stopPropagation();
			$rootScope.$broadcast('drawStepEvent');
		}
		function clearGrid(e)    {
			e.stopPropagation();
			$rootScope.$broadcast('clearGridEvent');
		}
		function loadRule(rule) {
			menuService.activeGrowthType.stayAlive = angular.copy(rule.stayAlive);
			menuService.activeGrowthType.birth = angular.copy(rule.birth);
		}
		function recalculateColors() {
			$rootScope.$broadcast('calculateColorsEvent');
		}




		function loadImageFile() {
			fileUploader.click();
		}

		function upload() {
			var filesSelected = fileUploader.files;
			if (filesSelected.length > 0) {
				var fileToLoad = filesSelected[0];
				if (fileToLoad.type.match('image.*')) {
					var fileReader = new FileReader();
					fileReader.onload = function(fileLoadedEvent) {
						$rootScope.$broadcast('imageLoadEvent', fileLoadedEvent);
					};
					fileReader.readAsDataURL(fileToLoad);
				}
			}
		}

	}
})();