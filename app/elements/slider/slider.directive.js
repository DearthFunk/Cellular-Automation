(function () {
	'use strict';
	angular
		.module('life')
		.directive('slider', slider);

	slider.$inject = [];
	function slider() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'app/elements/slider/slider.html',
			bindToController: true,
			controller: sliderController,
			scope: {
				sliderValue: "=sliderValue",
				callBack: "=callBack",
				minValue: "=minValue",
				maxValue: "=maxValue",
				fixedValue: "=fixedValue"
			}
		};
		return directive;
	}

	sliderController.$inject = ['$scope', '$element', '$window'];
	function sliderController($scope, $element, $window) {

		$scope.thumbWidth = 8;

		var lastValue = -1;
		var runCallBack = angular.isDefined($scope.callBack);
		var toFixedValue = angular.isDefined($scope.fixedValue);
		var minValue = angular.isDefined($scope.minValue) ? $scope.minValue : 0;
		var maxValue = angular.isDefined($scope.maxValue) ? $scope.maxValue : 1;
		if (minValue >= maxValue) {
			minValue = 0;
			maxValue = 1;
		}
		if ($scope.sliderValue < minValue) {$scope.sliderValue = minValue}
		if ($scope.sliderValue > maxValue) {$scope.sliderValue = maxValue}
		var originalSliderValue = $scope.sliderValue;

		$scope.getWidth = getWidth;
		$scope.getLeftAdjust = getLeftAdjust;
		$scope.getOriginalLeftPos = getOriginalLeftPos;
		$scope.mouseDown = mouseDown;
		$scope.mouseUpEvent = mouseUpEvent;
		$scope.mouseMoveEvent = mouseMoveEvent;
		$scope.setSliderValueAndRunCallBack = setSliderValueAndRunCallBack;

		$scope.leftPos = $scope.getOriginalLeftPos();

		/////////////////////////////////////////////

		function getLeftAdjust() {
			return $element[0].getBoundingClientRect().left + ($scope.thumbWidth/2)
		}
		function getWidth() {
			return $element[0].getBoundingClientRect().width - $scope.thumbWidth;
		}
		function getOriginalLeftPos() {
			return (originalSliderValue-minValue) / (maxValue-minValue) * $scope.getWidth();
		}

		function mouseUpEvent() {
			angular.element($window).unbind('mouseup', mouseUpEvent);
			angular.element($window).unbind('mousemove', mouseMoveEvent);
		}
		function mouseDown(event) {
			$scope.leftPos = event.clientX - $scope.getLeftAdjust();
			$scope.setSliderValueAndRunCallBack();
			angular.element($window).bind('mouseup', mouseUpEvent);
			angular.element($window).bind('mousemove', mouseMoveEvent);
		}

		function setSliderValueAndRunCallBack(reset) {
			if (reset) {
				$scope.sliderValue = toFixedValue ? originalSliderValue.toFixed($scope.fixedValue) : originalSliderValue;
				$scope.leftPos = $scope.getOriginalLeftPos();
			}
			else {
				var newSlider = ($scope.leftPos / $scope.getWidth()) * (maxValue -  minValue) + minValue;
				$scope.sliderValue = toFixedValue ? newSlider.toFixed($scope.fixedValue) : newSlider;
			}
			if (runCallBack) {
				$scope.callBack($scope.sliderValue);
			}
		}

		function mouseMoveEvent(event) {
			var width = $scope.getWidth();
			var leftPos = event.clientX - $scope.getLeftAdjust();
			$scope.leftPos = leftPos < 0 ? 0 : leftPos > width ? width : leftPos;
			if ($scope.leftPos !== lastValue) {
				lastValue = $scope.leftPos;
				$scope.setSliderValueAndRunCallBack();
			}
		}

	}
})();