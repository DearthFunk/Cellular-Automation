(function () {
	'use strict';
	angular
		.module('cellularAutomation')
		.directive('cellActivator', cellActivator);

	cellActivator.$inject = [];
	function cellActivator() {
		var directive = {
			restrict: 'A',
			replace: true,
			templateUrl: 'app/directives/cellActivator/cellActivator.html',
			controller: cellActivatorController,
			bindToController: true,
			scope: {
				cells: "=cells",
				showLabel: "=showLabel",
				returnArray: "=returnArray"
			}
		};
		return directive
	}

	cellActivatorController.$inject = ['$scope'];
	function cellActivatorController($scope) {

		$scope.allCells = [1,2,3,4,5,6,7,8,9];
		$scope.selectCell = selectCell;

		//////////////////////////////////////////////

		function selectCell(index) {
			if ($scope.cells.indexOf(index) > -1) {
				var indexOf = $scope.returnArray.indexOf(index);
				indexOf > -1 ?
					$scope.returnArray.splice(indexOf, 1) :
					$scope.returnArray.push(index);

				$scope.returnArray.sort();
			}
		}


	}
})();

