(function () {
	'use strict';
	angular
		.module('boardModule', [])
		.directive('boardDirective', board);

	function board() {
		var directive = {
			restrict: 'EA',
			controller: boardController,
			bindToController: true,
			replace: true,
			template: '<canvas></canvas>'
		};
		return directive;
	}

	boardController.$inject = ['$scope', '$element', '$window', '$timeout', 'genColors', 'menuService'];
	function boardController($scope, $element, $window, $timeout, genColors, menuService) {

		var ctx = $element[0].getContext('2d');
		var prom;
		var w = 0;
		var h = 0;
		var automata = [];
		var automataSquareSize = 15;
		var automataTimer = 0;
		var automataActiveX = -1;
		var automataActiveY = -1;
		var automataColors = [];



		$scope.$on('clearGridEvent', clearGrid);
		$scope.$on('windowResizeEvent', windowResize);
		$element.bind('mousedown', mouseDownEvent);
		$scope.$on('imageLoadEvent', imageLoadEvent);

		windowResize();
		init();
		timer();

		////////////////////////////////////////////////////

		function imageLoadEvent(e, args) {
			console.log(e, args);
		}

		function clearGrid() {
			for (var y = 0; y < automata.length; y++) {
				for (var x = 0; x < automata[y].length; x++) {
					automata[y][x].active = false;
				}
			}
		}
		function timer() {
			drawGrid();
			prom = $timeout(timer, 20);
		}
		function mouseDownEvent(e) {
			$element.bind('mouseup', mouseUpEvent);
			$element.bind('mousemove', mouseMoveEvent);
			mouseMoveEvent(e);
		}
		function mouseUpEvent(e) {
			$element.unbind('mouseup', mouseUpEvent);
			$element.unbind('mousemove', mouseMoveEvent);
			automataActiveX = -1;
			automataActiveY = -1;
		}

		function windowResize() {
			w = $window.innerWidth;
			h = $window.innerHeight;
			ctx.canvas.style.width = w + 'px';
			ctx.canvas.style.height = h + 'px';
			ctx.canvas.width = w;
			ctx.canvas.height = h;
		}

		function init() {
			for (var y = 0; y < h; y+=automataSquareSize) {
				var xArray = [];
				for (var x = 0; x < w; x+=automataSquareSize) {
					xArray.push({x: x,y: y, active: false})
				}
				automata.push(xArray);
			}
			automataColors = genColors.array.hex("#FF0000","#0000FF",automata[0].length);
		}

		function mouseMoveEvent(e) {
			var x = Math.floor(e.clientX / automataSquareSize);
			var y = Math.floor(e.clientY / automataSquareSize);

			if (x !== automataActiveX || y !== automataActiveY) {
				automataActiveX = x;
				automataActiveY = y;
				if (automataActiveY != -1 && angular.isDefined(automata[automataActiveY])) {
					if (automataActiveX != -1 && angular.isDefined(automata[automataActiveY][automataActiveX])) {
						automata[automataActiveY][automataActiveX].active = !automata[automataActiveY][automataActiveX].active;
					}
				}
			}
		}

		function toggle(item) {
			item.active = !item.active;
		}
		function drawGrid() {
			ctx.clearRect(0,0,w,h);

			for (var y = 0; y < automata.length; y++) {
				for (var x = 0; x < automata[y].length; x++) {
					var cell = automata[y][x];
					ctx.fillStyle = automataColors[x];
					if (cell.active) {
						ctx.beginPath();
						ctx.rect(cell.x,cell.y,automataSquareSize,automataSquareSize);
						if (menuService.borders) {
							ctx.lineWidth = 2;
							ctx.stroke();
						}
						ctx.fill();
						ctx.closePath();
					}
				}
			}

			if (menuService.playing) {
				automataTimer++;
				if (automataTimer % menuService.animationSpeed == 0) {
					var newA = angular.copy(automata);
					for (y = 0; y < automata.length; y++) {
						for (x = 0; x < automata[y].length; x++) {
							if (automata[y][x].active) {
								toggle(newA[y][x]);
								var wide = newA[y].length;
								var high = newA.length;
								if(menuService.automataPattern.l.val)  {if (x-1 > -1)               {toggle(newA[y][x-1]) }}       //left
								if(menuService.automataPattern.t.val)  {if (y-1 > -1)               {toggle(newA[y-1][x]) }}       //top
								if(menuService.automataPattern.r.val)  {if (x+1 < wide)             {toggle(newA[y][x+1]) }}       //right
								if(menuService.automataPattern.b.val)  {if (y+1 < high)             {toggle(newA[y+1][x]) }}       //bottom
								if(menuService.automataPattern.tr.val) {if (x+1 < wide && y-1 > -1) {toggle(newA[y-1][x+1]) }}   //top-right
								if(menuService.automataPattern.br.val) {if (x+1 < wide && y+1<high) {toggle(newA[y+1][x+1]) }}   //bottom-right
								if(menuService.automataPattern.tl.val) {if (x-1 > -1 && y-1 > -1)   {toggle(newA[y-1][x-1]) }}   //top-left
								if(menuService.automataPattern.bl.val) {if (x-1 > -1 && y+1 < high) {toggle(newA[y+1][x-1]) }}   //bottom-left
							}
						}
					}
					automata = angular.copy(newA);
				}
			}
		}

	}
})();
