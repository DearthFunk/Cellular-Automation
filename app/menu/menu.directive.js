(function () {
	'use strict';
	angular
		.module('menuModule', [])
		.directive('menu', menu);

	menu.$inject = [];

	function menu() {
		var directive = {
			restrict: 'C',
			templateUrl: 'app/menu/menu.html',
			replace: true,
			controller: menuController,
			bindToController: true
		};
		return directive;
	}

	menuController.$inject = ['$scope', '$rootScope', 'MENU_SIZE', 'menuService'];

	function menuController($scope, $rootScope, MENU_SIZE, menuService) {

		$scope.MENU_SIZE = MENU_SIZE;
		$scope.menuService = menuService;
		$scope.clearGrid = clearGrid;
		$scope.loadImageFile = loadImageFile;
		$scope.recalculateColors = recalculateColors;

		var fileUploader = document.createElement('input');
		fileUploader.type = 'file';
		fileUploader.onchange = upload;

		///////////////////////////////////////////////////

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