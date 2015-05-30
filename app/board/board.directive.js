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
		$scope.$on('calculateColorsEvent', calculateColorsEvent);

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
			calculateColorsEvent();
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
					switch (menuService.activeGrowthType.index) {
						case 0 : automata1(); break;
						case 1 : automata2(); break;
						default : break;
					}
				}
			}
		}
		function surroundingCellCount(x,y) {
			var count = 0;
			if (x-1 > -1) {count += automata[y][x-1].active ? 1 : 0; }
			if (y-1 > -1) {count += automata[y-1][x].active ? 1 : 0; }
			count += automata[y][x+1].active ? 1 : 0;
			count += automata[y+1][x].active ? 1 : 0;

			count += automata[y-1][x+1].active ? 1 : 0;
			count += automata[y+1][x+1].active ? 1 : 0;
			count += automata[y-1][x-1].active ? 1 : 0;
			count += automata[y+1][x-1].active ? 1 : 0;

			return count;
		}
		function automata2() {
			var newA = angular.copy(automata);
			for (var y = 0; y < automata.length; y++) {
				for (var x = 0; x < automata[y].length; x++) {
					var count = surroundingCellCount(x, y);

				}
			}
		}
		var wide = 0;
		var high = 0;
		function automata1() {
			var newA = angular.copy(automata);
			for (var y = 0; y < automata.length; y++) {
				for (var x = 0; x < automata[y].length; x++) {
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
})();
