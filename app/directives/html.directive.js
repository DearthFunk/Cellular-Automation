(function () {
	'use strict';
	angular
		.module('life')
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

	htmlController.$inject = ['$element', '$rootScope', '$window'];
	function htmlController($element, $rootScope, $window) {

		$window.onblur = windowOnBlur;
		$window.onresize = windowOnResize;
		$window.onbeforeunload = windowOnBeforeUnload;

		$element.bind('mousedown', mouseDown);
		$element.bind('mousewheel', mouseWheel);
		$element.bind('mousemove', mouseMove);
		$element.bind('mouseup', mouseUp);
		$element.bind('keydown', keyDown);
		$element.bind('keyup', keyUp);

		/////////////////////////////////////////////////
		
		function windowOnBlur(event) {
			$rootScope.$broadcast('windowBlurEvent', event);
		}
		function windowOnResize() {
			$rootScope.$broadcast('windowResizeEvent', event);
		}
		function windowOnBeforeUnload() {

		}

		/////////////////////////////////////////////////
		
		function mouseWheel(event) {
			if (event.target.localName === 'textarea'){return;}
			$rootScope.$broadcast('mouseWheelEvent', event);
		}
		function mouseMove(event) {
			if (event.target.localName === 'textarea'){return;}
			$rootScope.$broadcast('mouseMoveEvent', event);
		}
		function mouseDown(event) {
			if (event.target.localName === 'textarea'){return;}
			$rootScope.$broadcast('mouseDownEvent', event);
		}
		function mouseUp(event) {
			if (event.target.localName === 'textarea'){return;}
			$rootScope.$broadcast('mouseUpEvent', event);
		}
		function keyDown(event) {
			if (event.target.localName === 'textarea'){return;}
			$rootScope.$broadcast('keyDownEvent', event);
		}
		function keyUp(event) {
			if (event.target.localName === 'textarea'){return;}
			$rootScope.$broadcast('keyUpEvent', event);
		}
	}

})();