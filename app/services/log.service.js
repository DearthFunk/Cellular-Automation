(function () {
	'use strict';

	angular
		.module('logServiceModule', [])
		.service('log', log)
		.constant('LOG_TYPE', {
			STEP: '-',
			CLEAR: 'CLEAR',
			GRID_RESIZE: 'R',
			CELL_TOGGLE: 'T',
			MOUSE_TOGGLE: 'M'
		});

	log.$inject = ['genColors'];

	function log(genColors) {

		var clr = '#DDDDFF';

		var service = {
			logX: 1,
			logY: 1,
			log: [],
			editingPos: false,
			color: clr,
			colorActive: genColors.convert.rgba(clr, 0.5),
			addEntry: addEntry,
			generateCSV: generateCSV,
			recalculateColor: recalculateColor
		};

		return service;

		/////////////////////////////////

		function recalculateColor() {
			service.colorActive = genColors.convert.rgba(service.color,0.5);
		}
		function addEntry(type, x, y) {
			service.log.push([type, x, y]);
		}
		function generateCSV() {
			var csvFile = '';
			var logFileName = 'log.csv';
			for (var i = 0; i < service.log.length; i++) {
				csvFile += service.log[i] + '|';
			}
			var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });

			if (navigator.msSaveBlob) { // IE 10+
				navigator.msSaveBlob(blob, logFileName);
			} else {
				var link = document.createElement("a");
				if (link.download !== undefined) { // feature detection
					// Browsers that support HTML5 download attribute

					var url = URL.createObjectURL(blob);
					link.setAttribute("href", url);
					link.setAttribute("download", logFileName);
					link.style.visibility = 'hidden';
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}
			}
		}

	}
})();