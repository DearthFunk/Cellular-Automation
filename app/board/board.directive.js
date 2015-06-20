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

	boardController.$inject = ['$scope', '$element', '$window', '$timeout', 'genColors', 'menuService', 'SPEED', 'GROWTH_TYPES', 'LOG_TYPE'];
	function boardController($scope, $element, $window, $timeout, genColors, menuService, SPEED, GROWTH_TYPES, LOG_TYPE) {

		var ctx = $element[0].getContext('2d');
		var prom;
		var w = 0;
		var h = 0;
		var cellsW = 0;
		var cellsH = 0;
		var automataSquareSize = 15;
		var automataTimer = 0;
		var lastXpos = -1;
		var lastYpos = -1;
		var automataColors = [];
		var surroundingCells = [
			{y:-1, x:-1},
			{y:-1, x: 0},
			{y:-1, x: 1},
			{y: 0, x:-1},
			{y: 0, x: 0},
			{y: 0, x: 1},
			{y: 1, x:-1},
			{y: 1, x: 0},
			{y: 1, x: 1}
		];
		var logType = {
			step: 'STEP',
			tick: 'TICK',
			speedChange: 'SPEED CHANGE',
			clear: 'CLEAR GRID'

		};

		$scope.$on('clearGridEvent', clearGrid);
		$scope.$on('windowResizeEvent', windowResize);
		$scope.$on('calculateColorsEvent', calculateColorsEvent);
		$scope.$on('drawStepEvent', drawStep);
		$element.bind('mousedown', mouseDownEvent);


		menuService.addLogItem(LOG_TYPE.INIT, 'Welcome to the Log!!!');
		var automata = newEmptyGrid();
		windowResize();

		timer();

		////////////////////////////////////////////////////

		function calculateColorsEvent() {
			automataColors = genColors.array.hex(menuService.colorOne,menuService.colorTwo,cellsW);
		}
		function clearGrid() {
			menuService.addLogItem(LOG_TYPE.CLEAR);
			for (var y = 0; y < automata.length; y++) {
				for (var x = 0; x < automata[y].length; x++) {
					automata[y][x].active = false;
					automata[y][x].count = 0;
				}
			}
		}
		function timer() {
			drawGrid();
			prom = $timeout(timer, 20);
		}
		function mouseDownEvent(e) {
			angular.element($window).bind('mouseup', mouseUpEvent);
			angular.element($window).bind('mousemove', mouseMoveEvent);
			mouseMoveEvent(e);
		}
		function mouseUpEvent(e) {
			angular.element($window).unbind('mouseup', mouseUpEvent);
			angular.element($window).unbind('mousemove', mouseMoveEvent);
			lastXpos = -1;
			lastYpos = -1;
		}

		var old
		function windowResize() {
			w = $window.innerWidth;
			h = $window.innerHeight;
			cellsH = Math.ceil(h/automataSquareSize);
			cellsW = Math.ceil(w/automataSquareSize);
			ctx.canvas.style.width = w + 'px';
			ctx.canvas.style.height = h + 'px';
			ctx.canvas.width = w;
			ctx.canvas.height = h;
			reCalculateGrid();
			calculateColorsEvent();
			menuService.addLogItem(LOG_TYPE.GRID_RESIZE, cellsW+'-'+cellsH);
		}

		function reCalculateGrid() {
			var height = automata.length > cellsH ? automata.length : cellsH;
			var width = automata[0].length > cellsW ? automata[0].length : cellsW;
			for (var y = -1; y < height+1; y++) {
				if (angular.isUndefined(automata[y+1])) {
					automata.push([]);
				}
				for (var x = -1; x < width+1; x++) {
					if (angular.isUndefined(automata[y+1][x+1])) {
						automata[y+1].push({
							x: x*automataSquareSize,
							y: y*automataSquareSize,
							active: false,
							count: 0
						})
					}
					//reset cells greater than the grid side
					else if (x > cellsW-1 || y > cellsH-1) {
						automata[y+1][x+1].active = false;
						automata[y+1][x+1].count = 0;
					}
				}
			}
		}
		function newEmptyGrid() {
			var grid = [];
			for (var y = -1; y < cellsH+1; y++) {
				var xArray = [];
				for (var x = -1; x < cellsW+1; x++) {
					xArray.push({
						x: x*automataSquareSize,
						y: y*automataSquareSize,
						active: false,
						count: 0}
					)
				}
				grid.push(xArray);
			}
			return grid;
		}

		function mouseMoveEvent(e) {
			var x = Math.floor(e.clientX / automataSquareSize) + 1;
			var y = Math.floor(e.clientY / automataSquareSize) + 1;
			if((x != lastXpos || y != lastYpos)) {
				if (x > 0 && y > 0 && x <= cellsW && y <= cellsH) {
					lastXpos = x;
					lastYpos = y;
					toggle(x,y, automata, true);
				}
			}
		}

		function toggle(x,y, theArray, mouse) {
			var cell = theArray[y][x];
			cell.active = !cell.active;
			menuService.addLogItem(mouse ? LOG_TYPE.MOUSE_TOGGLE : LOG_TYPE.CELL_TOGGLE, x+'-'+y);
			for (var i = 0; i < surroundingCells.length; i++) {
				if (i !== 4) { // 4 is the center cell, so it is skipped
					var surroundingCell = theArray[y + surroundingCells[i].y][x + surroundingCells[i].x];
					if ( cell.active && surroundingCell.count < 8) {surroundingCell.count++;}
					if (!cell.active && surroundingCell.count > 0) {surroundingCell.count--;}
				}
			}
		}

		function drawStep() {
			switch (menuService.activeGrowthType.type) {
				case GROWTH_TYPES.TOGGLER : growthAnimation1(); break;
				case GROWTH_TYPES.LIFE_AND_DEATH : growthAnimation2(); break;
				default : break;
			}
		}

		function drawGrid() {
			ctx.clearRect(0,0,w,h);
			for (var y = 1; y < automata.length-1; y++) {
				for (var x = 1; x < automata[y].length-1; x++) {
					var cell = automata[y][x];
					if (cell.active) {
						ctx.beginPath();
						ctx.fillStyle = automataColors[x];
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
				var timerSpd = Math.floor(parseInt(SPEED.MAX - menuService.animationSpeed + SPEED.MIN,10)/10) + 1;
				if (automataTimer % timerSpd == 0) {
					drawStep();
					menuService.addLogItem(LOG_TYPE.STEP, automataTimer/timerSpd);
				}
			}
		}
		function growthAnimation2() {
			var newGrid = newEmptyGrid();
			for (var y = 1; y < newGrid.length-1; y++) {
				for (var x = 1; x < newGrid[y].length-1; x++) {
					var count = automata[y][x].count;
					if (automata[y][x].active) {
						if (newGrid[y][x].active !== menuService.activeGrowthType.stayAlive.indexOf(count) > -1) {
							toggle(x,y,newGrid);
						}
					}
					else if (menuService.activeGrowthType.birth.indexOf(count) > -1) {
						toggle(x,y,newGrid);
					}
				}
			}
			automata = angular.copy(newGrid);
		}
		function growthAnimation1() {
			var newGrid = angular.copy(automata);
			for (var y = 1; y < newGrid.length-1; y++) {
				for (var x = 1; x < newGrid[y].length-1; x++) {
					if (automata[y][x].active) {
						toggle(x,y, newGrid);
						for (var i = 0; i < menuService.activeGrowthType.activatedCells.length; i++) {
							var index = menuService.activeGrowthType.activatedCells[i] - 1;
							var xIndex = x + surroundingCells[index].x;
							var yIndex = y + surroundingCells[index].y;
							if (xIndex > 0 && yIndex > 0 && xIndex <= cellsW && yIndex <= cellsH) {
								toggle(xIndex, yIndex, newGrid);
							}
						}
					}
				}
			}
			automata = angular.copy(newGrid);
		}

	}
})();
