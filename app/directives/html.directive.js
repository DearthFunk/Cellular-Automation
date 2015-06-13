(function () {
	'use strict';
	angular
		.module('cellularAutomation')
		.directive('html', html);

	html.$inject = [];
	function html() {
		var directive = {
			restrict: 'E',
			controller: htmlController,
			bindToController: true
		};
		return directive
	}

	htmlController.$inject = ['$rootScope', '$window'];
	function htmlController($rootScope, $window) {

		$window.onblur = windowOnBlur;
		$window.onresize = windowOnResize;
		$window.onbeforeunload = windowOnBeforeUnload;

		/////////////////////////////////////////////////
		
		function windowOnBlur(event) {
			$rootScope.$broadcast('windowBlurEvent', event);
		}
		function windowOnResize() {
			$rootScope.$broadcast('windowResizeEvent', event);
		}
		function windowOnBeforeUnload() {

		}
	}

})();