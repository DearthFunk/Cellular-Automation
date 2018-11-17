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

	boardController.$inject = ['$scope', '$element', '$window', '$timeout', 'genColors', 'menuService', 'GROWTH_TYPES'];
	function boardController($scope, $element, $window, $timeout, genColors, menuService, GROWTH_TYPES) {

		var prom;
		var w = 0;
		var h = 0;
		var cellsW = 0;
		var cellsH = 0;
		var cellSize = 15;
		var lastX = -1;
		var lastY = -1;
		var gridColorArray = [];
		var emptyGrid = gridNew();
		var grid = angular.copy(emptyGrid);
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

		$window.onresize = windowResize;
		$scope.$on('clearGridEvent', gridClear);
		$scope.$on('calculateColorsEvent', animationRecalculateColors);
		$scope.$on('drawStepEvent', animationStep);
		$element.bind('mousedown', mouseDownEvent);

		windowResize();
		animationTimer();

		////////////////////////////////////////////////////

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

		function mouseMoveEvent(e) {
			var x = Math.floor(e.clientX / cellSize) + 1;
			var y = Math.floor(e.clientY / cellSize) + 1;
			if((x != lastX || y != lastY) && x > 0 && y > 0 && x <= cellsW && y <= cellsH) {
				lastX = x;
				lastY = y;
				gridToggleCell(x,y, grid, true);
				animationDraw();
			}
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
			emptyGrid = gridNew();
			gridRecalculateSize();
			animationRecalculateColors();
			animationDraw();
		}

		////////////////////////////////////////////////////

		function gridClear() {
			for (var y = 0; y < grid.length; y++) {
				for (var x = 0; x < grid[y].length; x++) {
					grid[y][x].active = false;
					grid[y][x].count = 0;
				}
			}
			ctx.clearRect(0, 0, w, h);
			animationDraw();
		}

		function gridRecalculateSize() {
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

		function gridNew() {
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

		function gridToggleCell(x,y, theArray, mouse) {
			var cell = theArray[y][x];
			cell.active = !cell.active;
			for (var i = 0; i < surroundingCells.length; i++) {
				if (i !== 4) { // 4 is the center cell, so it is skipped
					var surroundingCell = theArray[y + surroundingCells[i].y][x + surroundingCells[i].x];
					if ( cell.active && surroundingCell.count < 8) {surroundingCell.count++;}
					if (!cell.active && surroundingCell.count > 0) {surroundingCell.count--;}
				}
			}
		}

		//////////////////////////////////////////////////////

		function animationRecalculateColors() {
			gridColorArray = genColors.array.hex(menuService.colorOne,menuService.colorTwo,cellsW);
		}

		function animationTimer() {
			if (menuService.playing) {
				animationStep();
			}
			prom = $timeout(animationTimer,parseInt(menuService.animationSpeed,10));
		}

		function animationStep() {
			if (menuService.activeGrowthType) {
				switch (menuService.activeGrowthType.type) {
					case GROWTH_TYPES.TOGGLER : growthAnimation1(); break;
					case GROWTH_TYPES.LIFE_AND_DEATH : growthAnimation2(); break;
					default : break;
				}
			}
			animationDraw();
		}

		function animationDrawCell(cell, color) {
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.rect(cell.x, cell.y, cellSize, cellSize);
			ctx.fill();
			ctx.closePath();
		}

		function animationDraw() {
			ctx.clearRect(0, 0, w, h);
			for (var y = 1; y < grid.length - 1; y++) {
				for (var x = 1; x < grid[y].length - 1; x++) {
					var cell = grid[y][x];
					if (cell.active) {
						animationDrawCell(cell, gridColorArray[x]);
					}
				}
			}
		}

		////////////////////////////////////////////////////

		function growthAnimation1() {
			var newGrid = angular.copy(grid);
			for (var y = 1; y < newGrid.length-1; y++) {
				for (var x = 1; x < newGrid[y].length-1; x++) {
					if (grid[y][x].active) {
						gridToggleCell(x,y, newGrid);
						for (var i = 0; i < menuService.activeGrowthType.activatedCells.length; i++) {
							var index = menuService.activeGrowthType.activatedCells[i] - 1;
							var xIndex = x + surroundingCells[index].x;
							var yIndex = y + surroundingCells[index].y;
							if (xIndex > 0 && yIndex > 0 && xIndex <= cellsW && yIndex <= cellsH) {
								gridToggleCell(xIndex, yIndex, newGrid);
							}
						}
					}
				}
			}
			grid = angular.copy(newGrid);
		}

		function growthAnimation2() {
			var newGrid = angular.copy(emptyGrid);
			for (var y = 1; y < newGrid.length-1; y++) {
				for (var x = 1; x < newGrid[y].length-1; x++) {
					var count = grid[y][x].count;
					if (grid[y][x].active) {
						if (newGrid[y][x].active !== menuService.activeGrowthType.stayAlive.indexOf(count) > -1) {
							gridToggleCell(x,y,newGrid);
						}
					}
					else if (menuService.activeGrowthType.birth.indexOf(count) > -1) {
						gridToggleCell(x,y,newGrid);
					}
				}
			}
			grid = angular.copy(newGrid);
		}
	}
})();
