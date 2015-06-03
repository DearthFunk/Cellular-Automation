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
		var cellsW = 0;
		var cellsH = 0;

		var automata = [];
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




		$scope.$on('clearGridEvent', clearGrid);
		$scope.$on('windowResizeEvent', windowResize);
		$element.bind('mousedown', mouseDownEvent);
		$scope.$on('imageLoadEvent', imageLoadEvent);
		$scope.$on('calculateColorsEvent', calculateColorsEvent);
		$scope.$on('drawStepEvent', drawStep);

		windowResize();
		init();
		timer();

		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;

		////////////////////////////////////////////////////

		function calculateColorsEvent() {
			automataColors = genColors.array.hex(menuService.colorOne,menuService.colorTwo,automata[0].length);
		}
		function imageLoadEvent(e, args) {
			var imgObj = new Image();
			imgObj.src = args.target.result;
			var canvas = document.createElement('canvas');
			var canvasContext = canvas.getContext('2d');
			canvas.width = imgObj.width;
			canvas.height = imgObj.height;
			canvasContext.drawImage(imgObj, 0, 0);
			var imgPixels = canvasContext.getImageData(0, 0, imgObj.width, imgObj.height);
			for(var y = 0; y < imgPixels.height; y++){
				for(var x = 0; x < imgPixels.width; x++){
					var i = (y * 4) * imgPixels.width + x * 4;
					var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
					imgPixels.data[i] = avg;
					imgPixels.data[i + 1] = avg;
					imgPixels.data[i + 2] = avg;
				}
			}


			var size = (30) * 0.01,

			// cache scaled width and height
				w = canvas.width * size,
				h = canvas.height * size;

			// draw original image to the scaled size
			//ctx.drawImage(img, 0, 0, w, h);
			ctx.putImageData(imgPixels,0,0); //,imgObj.width, imgObj.height);
			// then draw that scaled image thumb back to fill canvas
			// As smoothing is off the result will be pixelated
			ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
			//ctx.putImageData(imgPixels, 0 , 0, 0, 0, imgPixels.width, imgPixels.height);

		}

		function clearGrid() {
			automata = newEmptyGrid();
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

		function windowResize() {
			w = $window.innerWidth;
			h = $window.innerHeight;
			ctx.canvas.style.width = w + 'px';
			ctx.canvas.style.height = h + 'px';
			ctx.canvas.width = w;
			ctx.canvas.height = h;
		}

		function newEmptyGrid() {
			var grid = [];
			for (var y = -automataSquareSize; y < h+automataSquareSize; y+=automataSquareSize) {
				var xArray = [];
				for (var x = -automataSquareSize; x < w+automataSquareSize; x+=automataSquareSize) {
					xArray.push({x: x,y: y, active: false, count: 0})
				}
				grid.push(xArray);
			}
			return grid;
		}

		function init() {
			automata = newEmptyGrid();
			cellsH = automata.length - 2;
			cellsW = automata[0].length - 2;
			calculateColorsEvent();
		}

		function mouseMoveEvent(e) {
			var x = Math.floor(e.clientX / automataSquareSize) + 1;
			var y = Math.floor(e.clientY / automataSquareSize) + 1;
			if((x != lastXpos || y != lastYpos)) {
				if (x > 0 && y > 0 && x <= cellsW && y <= cellsH) {
					lastXpos = x;
					lastYpos = y;
					toggle(x,y, automata);
				}
			}
		}

		function toggle(x,y, theArray) {
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

		function drawStep() {
			switch (menuService.activeGrowthType.index) {
				case 0 : automata1(); break;
				case 1 : automata2(); break;
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
				if (automataTimer % menuService.animationSpeed == 0) {
					drawStep();
				}
			}
		}
		function automata2() {
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
		function automata1() {
			var newA = angular.copy(automata);
			for (var y = 1; y < automata.length-1; y++) {
				for (var x = 1; x < automata[y].length-1; x++) {
					if (automata[y][x].active) {
						toggle(x,y, newA);
						for (var i = 0; i < menuService.activeGrowthType.activatedCells.length; i++) {
							var index = menuService.activeGrowthType.activatedCells[i] - 1;
							var xIndex = x + surroundingCells[index].x;
							var yIndex = y + surroundingCells[index].y;
							if (xIndex > 0 && yIndex > 0 && xIndex <= cellsW && yIndex <= cellsH) {
								toggle(xIndex, yIndex, newA);
							}
						}
					}
				}
			}

			automata = angular.copy(newA);
		}

	}
})();
