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

	menuController.$inject = ['$scope', '$rootScope', 'MENU_SIZE', 'RULE_TEMPLATES', 'menuService'];

	function menuController($scope, $rootScope, MENU_SIZE, RULE_TEMPLATES, menuService) {

		$scope.MENU_SIZE = MENU_SIZE;
		$scope.RULE_TEMPLATES = RULE_TEMPLATES;
		$scope.menuService = menuService;
		$scope.clearGrid = clearGrid;
		$scope.loadImageFile = loadImageFile;
		$scope.loadRule = loadRule;
		$scope.recalculateColors = recalculateColors;


		var fileUploader = document.createElement('input');
		fileUploader.type = 'file';
		fileUploader.onchange = upload;

		///////////////////////////////////////////////////

		function loadRule(rule) {
			menuService.activeGrowthType.stayAlive = angular.copy(rule.stayAlive);
			menuService.activeGrowthType.birth = angular.copy(rule.birth);

		}
		function clearGrid() {
			$rootScope.$broadcast('clearGridEvent');
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