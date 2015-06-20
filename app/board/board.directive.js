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

		var prom;
		var w = 0;
		var h = 0;
		var cellsW = 0;
		var cellsH = 0;
		var cellSize = 15;
		var intTimer = 0;
		var lastX = -1;
		var lastY = -1;
		var gridColorArray = [];
		var ctx = $element[0].getContext('2d');
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

		$scope.$on('clearGridEvent', clearGrid);
		$scope.$on('windowResizeEvent', windowResize);
		$scope.$on('calculateColorsEvent', calculateColorsEvent);
		$scope.$on('drawStepEvent', drawStep);
		$element.bind('mousedown', mouseDownEvent);

		menuService.addLogItem(LOG_TYPE.INIT, 'Welcome to the Log!!!');
		var grid = newEmptyGrid();
		windowResize();
		timer();

		////////////////////////////////////////////////////

		function calculateColorsEvent() {
			gridColorArray = genColors.array.hex(menuService.colorOne,menuService.colorTwo,cellsW);
		}
		function clearGrid() {
			menuService.addLogItem(LOG_TYPE.CLEAR);
			for (var y = 0; y < grid.length; y++) {
				for (var x = 0; x < grid[y].length; x++) {
					grid[y][x].active = false;
					grid[y][x].count = 0;
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
			lastX = -1;
			lastY = -1;
		}

		function windowResize() {
			w = $window.innerWidth;
			h = $window.innerHeight;
			cellsH = Math.ceil(h/cellSize);
			cellsW = Math.ceil(w/cellSize);
			ctx.canvas.style.width = w + 'px';
			ctx.canvas.style.height = h + 'px';
			ctx.canvas.width = w;
			ctx.canvas.height = h;
			reCalculateGrid();
			calculateColorsEvent();
			menuService.addLogItem(LOG_TYPE.GRID_RESIZE, cellsW+'-'+cellsH);
		}

		function reCalculateGrid() {
			var height = grid.length > cellsH ? grid.length : cellsH;
			var width = grid[0].length > cellsW ? grid[0].length : cellsW;
			for (var y = -1; y < height+1; y++) {
				if (angular.isUndefined(grid[y+1])) {
					grid.push([]);
				}
				for (var x = -1; x < width+1; x++) {
					if (angular.isUndefined(grid[y+1][x+1])) {
						grid[y+1].push({
							x: x*cellSize,
							y: y*cellSize,
							active: false,
							count: 0
						})
					}
					//reset cells greater than the grid side
					if (x > cellsW-1 || y > cellsH-1) {
						grid[y+1][x+1].active = false;
						grid[y+1][x+1].count = 0;
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
						x: x*cellSize,
						y: y*cellSize,
						active: false,
						count: 0}
					)
				}
				grid.push(xArray);
			}
			return grid;
		}

		function mouseMoveEvent(e) {
			var x = Math.floor(e.clientX / cellSize) + 1;
			var y = Math.floor(e.clientY / cellSize) + 1;
			if((x != lastX || y != lastY)) {
				if (x > 0 && y > 0 && x <= cellsW && y <= cellsH) {
					lastX = x;
					lastY = y;
					toggle(x,y, grid, true);
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
			for (var y = 1; y < grid.length-1; y++) {
				for (var x = 1; x < grid[y].length-1; x++) {
					var cell = grid[y][x];
					if (cell.active) {
						ctx.beginPath();
						ctx.fillStyle = gridColorArray[x];
						ctx.rect(cell.x,cell.y,cellSize,cellSize);
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
				intTimer++;
				var timerSpd = Math.floor(parseInt(SPEED.MAX - menuService.animationSpeed + SPEED.MIN,10)/10) + 1;
				if (intTimer % timerSpd == 0) {
					drawStep();
					menuService.addLogItem(LOG_TYPE.STEP, intTimer/timerSpd);
				}
			}
		}
		function growthAnimation2() {
			var newGrid = newEmptyGrid();
			for (var y = 1; y < newGrid.length-1; y++) {
				for (var x = 1; x < newGrid[y].length-1; x++) {
					var count = grid[y][x].count;
					if (grid[y][x].active) {
						if (newGrid[y][x].active !== menuService.activeGrowthType.stayAlive.indexOf(count) > -1) {
							toggle(x,y,newGrid);
						}
					}
					else if (menuService.activeGrowthType.birth.indexOf(count) > -1) {
						toggle(x,y,newGrid);
					}
				}
			}
			grid = angular.copy(newGrid);
		}
		function growthAnimation1() {
			var newGrid = angular.copy(grid);
			for (var y = 1; y < newGrid.length-1; y++) {
				for (var x = 1; x < newGrid[y].length-1; x++) {
					if (grid[y][x].active) {
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
			grid = angular.copy(newGrid);
		}

	}
})();
