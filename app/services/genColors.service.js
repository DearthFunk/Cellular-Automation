angular
	.module('genColorsServiceModule', [])
	.factory('genColors', genColors)
	.constant('COLOR_TYPE', {
		HEX: 0,
		RGB: 1,
		RGBA: 2,
		HSL: 3,
		HSLA: 4
	})
	.constant('RETURN_TYPE', {
		STRING: 0,
		ARRAY: 1,
		OBJECT: 2
	});

genColors.$inject = ['COLOR_TYPE', 'RETURN_TYPE'];

function genColors(COLOR_TYPE, RETURN_TYPE){

	var factory = {
		get: {
			colorType: getColorType,
			values: getValues,
			randomNumber: getRandomNumber,
			roundedNumber: getRoundedNumber,
			hue: getHue
		},
		random: {
			hex: randomHex,
			rgb: randomRgb,
			rgba: randomRgba,
			hsl: randomHsl,
			hsla: randomHsla
		},
		convert: {
			numberToHex: convertNumberToHex,
			hexToNumber: convertHexToNumber,
			hex: convertHex,
			rgb: convertRgb,
			rgba: convertRgba,
			hsl: convertHsl,
			hsla: convertHsla
		},
		between: {
			hex: betweenHex,
			rgb: betweenRgb,
			rgba: betweenRgba,
			hsl: betweenHsl,
			hsla: betweenHsla
		},
		array: {
			hex: arrayHex,
			rgb: arrayRgb,
			rgba: arrayRgba,
			hsl: arrayHsl,
			hsla: arrayHsla
		}
	};

	return factory;

	////////////////////////////////////////////////////////

	function getColorType(color) {
		var c = color.slice(0,4).toLowerCase();
		return (color[0] === '#' ? COLOR_TYPE.HEX :
			c === 'rgb(' ? COLOR_TYPE.RGB :
				c === 'rgba' ? COLOR_TYPE.RGBA :
					c === 'hsl(' ? COLOR_TYPE.HSL :
						c === 'hsla' ? COLOR_TYPE.HSLA :
							false
		)
	}
	function getValues(color, returnType, hslPercentage) {
		color = color.toUpperCase();
		var obj = {};
		var returnVal, vals, keys;
		var colorType = factory.get.colorType(color);
		if (colorType === COLOR_TYPE.HEX) {
			var arr = color.slice(1).split('').slice(0,3);
			vals = color.length < 7 ?
				[arr[0]+arr[0], arr[1]+arr[1], arr[2]+arr[2]] :
				color.slice(1).match(/.{1,2}/g);
			keys = ['r','g','b'];
		}
		else {
			vals = color.replace(/([(])/g,',').replace(/([)])/g,'').split(',');
			keys = vals[0].toLowerCase().split('');
			vals.splice(0,1);
		}
		for (var i = 0; i < keys.length; i++) {
			if (colorType === COLOR_TYPE.HEX) {
				obj[keys[i]] = vals[i];
			}
			else if ( vals[i].indexOf('%') > -1) {
				if (hslPercentage) {
					vals[i] = Number(vals[i].replace('%',''))/100;
				}
				obj[keys[i]] = vals[i];
			}
			else {
				obj[keys[i]] =  Number(vals[i]);
				vals[i] = Number(vals[i]);
			}
		}
		switch(returnType) {
			case RETURN_TYPE.STRING: returnVal = color; break;
			case RETURN_TYPE.ARRAY: returnVal = vals; break;
			case RETURN_TYPE.OBJECT: returnVal = angular.copy(obj); break;
			default: returnVal = color;
		}
		return returnVal
	}
	function getRandomNumber(from, to, decimals) {
		return angular.isDefined(decimals) ?
			Number((Math.random()*(Number(to)-Number(from))+Number(from)).toFixed(decimals)) :
			Number(Math.random()*(to-from)+from)
	}
	function getRoundedNumber(value, decimals) {
		var precision = decimals || 0;
		var neg = value < 0;
		var power = Math.pow(10, precision);
		var newvalue = Math.round(value * power);
		var integral = String((neg ? Math.ceil : Math.floor)(newvalue / power));
		var fraction = String((neg ? -newvalue : newvalue) % power);
		var padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
		return parseFloat(precision ? integral + '.' +  padding + fraction : integral);
	}
	function getHue(m1, m2, hue, numOrHex) {
		var v;
		if (hue < 0)
			hue += 1;
		else if (hue > 1)
			hue -= 1;

		if (6 * hue < 1)
			v = m1 + (m2 - m1) * hue * 6;
		else if (2 * hue < 1)
			v = m2;
		else if (3 * hue < 2)
			v = m1 + (m2 - m1) * (2/3 - hue) * 6;
		else
			v = m1;
		return numOrHex ? factory.convert.numberToHex(255 * v) : factory.get.roundedNumber(255 * v,0);
	}
	function randomHex(type, greyScale) {
		var returnVal;
		if (greyScale) {
			var hex =
				factory.get.randomNumber(0,15,0).toString(16).toUpperCase() +
				factory.get.randomNumber(0,15,0).toString(16).toUpperCase();
			returnVal = '#' + hex+hex+hex;
		}
		else {
			returnVal = '#' + ('00000'+(Math.random()*16777216<<0).toString(16)).substr(-6).toUpperCase();
		}
		return factory.get.values(returnVal,type);
	}
	function randomRgb(type, greyScale) {
		var r = factory.get.randomNumber(0,255,0);
		var g = greyScale ? r : factory.get.randomNumber(0,255,0);
		var b = greyScale ? r : factory.get.randomNumber(0,255,0);
		return factory.get.values('rgb('+r+','+b+','+g+')',type);
	}
	function randomHsl(type, greyScale) {
		var h = factory.get.randomNumber(0,240,0);
		var s = greyScale ? '0%' : factory.get.randomNumber(0,100,0) + '%';
		var l = factory.get.randomNumber(0,100,0) + '%';
		return factory.get.values('HSL('+h+','+s+','+l+')',type);
	}
	function randomRgba(type, greyScale, opacity) {
		var r =  factory.get.randomNumber(0,255,0);
		var g = greyScale ? r : factory.get.randomNumber(0,255,0);
		var b = greyScale ? r : factory.get.randomNumber(0,255,0);
		var a = angular.isUndefined(opacity) ? factory.get.randomNumber(0,1,4) : opacity;
		return factory.get.values('RGBA('+r+','+g+','+b+','+a+')',type);
	}
	function randomHsla(type, greyScale, opacity) {
		var h = factory.get.randomNumber(0,240,0);
		var s = greyScale ? '0%' : factory.get.randomNumber(0,100,0) + '%';
		var l = factory.get.randomNumber(0,100,0) + '%';
		var a = angular.isUndefined(opacity) ? factory.get.randomNumber(0,1,4) : opacity;
		return factory.get.values('HSLA('+h+','+s+','+l+','+a+')',type);
	}
	function convertNumberToHex(x) {
		return x>=0&&x<=255?('0' + parseInt(x).toString(16)).slice(-2).toUpperCase() : '00'
	}
	function convertHexToNumber(x) {
		var tmp = x.replace(/[^a-f,0-9]/ig, '');
		return tmp === '' ? 0 : parseInt(tmp,16);
	}
	function convertHex(color) {
		color = color.toUpperCase();
		var returnVal;
		var colorType = factory.get.colorType(color);
		var vals = factory.get.values(color,RETURN_TYPE.ARRAY,true);
		if (colorType === COLOR_TYPE.HEX) {
			if (color.length === 7) {
				returnVal = color;
			}
			else if (color.length === 4) {
				var tmp = color.split('');
				returnVal = '#' + tmp[1] + tmp[1] + tmp[2] + tmp[2] + tmp[3] + tmp[3];
			}
			else {
				returnVal = color;
			}
		}
		else if (colorType === COLOR_TYPE.RGB || colorType === COLOR_TYPE.RGBA) {
			returnVal =  '#' + factory.convert.numberToHex(vals[0]) + factory.convert.numberToHex(vals[1]) + factory.convert.numberToHex(vals[2]);
		}
		else if (colorType === COLOR_TYPE.HSL || colorType === COLOR_TYPE.HSLA) {
			var m1, m2, hue;
			if (vals[1] === 0) {vals[0] = vals[1] = vals[2] = (vals[2] * 255);}
			else {
				m2 = vals[2] <= 0.5 ? vals[2] * (vals[1] + 1) :vals[2] + vals[1] - vals[2] * vals[1];
				m1 = vals[2] * 2 - m2;
				hue = vals[0] / 360;
			}
			returnVal = '#' +
			factory.get.hue(m1, m2, hue + 1/3,true) +
			factory.get.hue(m1, m2, hue,true) +
			factory.get.hue(m1, m2, hue - 1/3,true);
		}
		else {
			returnVal = color;
		}
		return returnVal
	}
	function convertRgb(color) {
		color = color.toUpperCase();
		var returnVal;
		var colorType = factory.get.colorType(color);
		var vals = factory.get.values(color,RETURN_TYPE.ARRAY,true);

		if (colorType === COLOR_TYPE.HEX) {
			returnVal = 'RGB('+
			factory.convert.hexToNumber(vals[0]) + ','+
			factory.convert.hexToNumber(vals[1]) + ','+
			factory.convert.hexToNumber(vals[2]) + ')';
		}
		else if (colorType === COLOR_TYPE.RGB) {
			returnVal = color;
		}
		else if (colorType === COLOR_TYPE.RGBA) {
			returnVal = 'RGB(' + vals[0] + ',' + vals[1] + ',' + vals[2] + ')';
		}
		else if (colorType === COLOR_TYPE.HSL || colorType === COLOR_TYPE.HSLA) {
			var m1, m2, hue;
			if (vals[1] === 0) {vals[0] = vals[1] = vals[2] = (vals[2] * 255);}
			else {
				m2 = vals[2] <= 0.5 ? vals[2] * (vals[1] + 1) :vals[2] + vals[1] - vals[2] * vals[1];
				m1 = vals[2] * 2 - m2;
				hue = vals[0] / 360;
			}
			returnVal = 'RGB(' +
			factory.get.hue(m1, m2, hue + 1/3) + ',' +
			factory.get.hue(m1, m2, hue) + ',' +
			factory.get.hue(m1, m2, hue - 1/3) + ')';
		}
		return returnVal
	}
	function convertRgba(color, opacity) {
		color = color.toUpperCase();
		var returnVal;
		var colorType = factory.get.colorType(color);
		var vals = factory.get.values(color,RETURN_TYPE.ARRAY,true);
		var o = colorType === COLOR_TYPE.RGBA || colorType === COLOR_TYPE.HSLA ? vals[3] : opacity < 0 ? 0 : opacity > 1 || angular.isUndefined(opacity) ? 1 : opacity;
		if (colorType === COLOR_TYPE.HEX) {
			returnVal = 'RGBA('+
			factory.convert.hexToNumber(vals[0]) + ','+
			factory.convert.hexToNumber(vals[1]) + ','+
			factory.convert.hexToNumber(vals[2]) + ','+
			o + ')';
		}
		else if (colorType === COLOR_TYPE.RGB) {
			returnVal = 'RGBA(' + vals[0] + ',' + vals[1] + ',' + vals[2] + ',' + o + ')';
		}
		else if (colorType === COLOR_TYPE.RGBA) {
			returnVal = color;
		}
		else if (colorType === COLOR_TYPE.HSL || colorType === COLOR_TYPE.HSLA) {
			var m1, m2, hue;
			if (vals[1] === 0) {vals[0] = vals[1] = vals[2] = (vals[2] * 255);}
			else {
				m2 = vals[2] <= 0.5 ? vals[2] * (vals[1] + 1) :vals[2] + vals[1] - vals[2] * vals[1];
				m1 = vals[2] * 2 - m2;
				hue = vals[0] / 360;
			}
			returnVal = 'RGBA(' +
			factory.get.hue(m1, m2, hue + 1/3) + ',' +
			factory.get.hue(m1, m2, hue) + ',' +
			factory.get.hue(m1, m2, hue - 1/3) + ',' + o + ')';
		}
		return returnVal
	}
	function convertHsl(color) {
		var returnVal;
		var colorType = factory.get.colorType(color);
		var vals = factory.get.values(color,RETURN_TYPE.ARRAY,true);
		if ([COLOR_TYPE.HEX,COLOR_TYPE.RGB,COLOR_TYPE.RGBA].indexOf(colorType) !== -1) {
			var hexVals = factory.get.values(factory.convert.rgb(color),RETURN_TYPE.ARRAY);
			var r = (colorType === COLOR_TYPE.HEX ? hexVals[0] : vals[0])/255;
			var g = (colorType === COLOR_TYPE.HEX ? hexVals[1] : vals[1])/255;
			var b = (colorType === COLOR_TYPE.HEX ? hexVals[2] : vals[2])/255;
			var max = Math.max(r, g, b), min = Math.min(r, g, b);
			var h, s, l = (max + min) / 2;
			if(max === min){
				h = s = 0; // achromatic
			}else{
				var d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch(max){
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break;
				}
				h /= 6;
			}
			returnVal = 'HSL('+Math.floor(h*360)+','+Math.floor(s*100)+'%,'+Math.floor(l*100)+'%)';
		}
		else if(colorType === COLOR_TYPE.HSL) {returnVal = color.toUpperCase();}
		else if(colorType === COLOR_TYPE.HSLA) {returnVal = 'HSL('+vals[0]+','+(vals[1]*100)+'%,'+(vals[2]*100)+'%)';}
		return returnVal
	}
	function convertHsla(color, opacity) {
		var returnVal;
		var colorType = factory.get.colorType(color);
		var vals = factory.get.values(color,RETURN_TYPE.ARRAY,true);
		var o = colorType === COLOR_TYPE.RGBA || colorType === COLOR_TYPE.HSLA ? vals[3] : opacity < 0 ? 0 : opacity > 1 || angular.isUndefined(opacity) ? 1 : opacity;
		if (colorType === COLOR_TYPE.HEX || colorType === COLOR_TYPE.RGB || colorType === COLOR_TYPE.RGBA) {
			var hexVals = factory.get.values(factory.convert.rgb(color),RETURN_TYPE.ARRAY);
			var r = (colorType === COLOR_TYPE.HEX ? hexVals[0] : vals[0])/255;
			var g = (colorType === COLOR_TYPE.HEX ? hexVals[1] : vals[1])/255;
			var b = (colorType === COLOR_TYPE.HEX ? hexVals[2] : vals[2])/255;
			var max = Math.max(r, g, b), min = Math.min(r, g, b);
			var h, s, l = (max + min) / 2;
			if(max === min){ h = s = 0; }// achromatic
			else{
				var d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch(max){
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break;
				}
				h /= 6;
			}
			returnVal = 'HSLA('+Math.floor(h*360)+','+Math.floor(s*100)+'%,'+Math.floor(l*100)+'%,'+o+')';
		}
		else if(colorType === COLOR_TYPE.HSL) {returnVal = 'HSLA('+vals[0]+','+(vals[1]*100)+'%,'+(vals[2]*100)+'%,'+o+')';}
		else if(colorType === COLOR_TYPE.HSLA) {returnVal = color.toUpperCase()}
		return returnVal
	}
	function betweenHex(c1, c2) {return factory.array.hex(c1, c2, 3)[1]}
	function betweenRgb(c1, c2) {return factory.array.rgb(c1, c2, 3)[1]}
	function betweenHsl(c1, c2) {return factory.array.hsl(c1, c2, 3)[1]}
	function betweenRgba(c1, c2, o1, o2) {return factory.array.rgba(c1, c2, 3, o1, o2)[1]}
	function betweenHsla(c1, c2, o1, o2) {return factory.array.hsla(c1, c2, 3, o1, o2)[1]}
	function arrayHex(c1, c2, len) {
		var steps = [];
		var returnVal = [];
		if (len < 3) {returnVal = [factory.convert.hex(c1),factory.convert.hex(c2)]}
		else {
			var c1Vals = factory.get.values(factory.convert.rgb(c1),RETURN_TYPE.ARRAY);
			var c2Vals = factory.get.values(factory.convert.rgb(c2),RETURN_TYPE.ARRAY);
			for (var i = 0; i < c1Vals.length; i++) {
				steps.push( c1Vals[i] === c2Vals[i] ? 0 : (c1Vals[i] - c2Vals[i]) / (len-1) * -1 );
			}
			for (i = 0; i < len; i++) {
				returnVal.push ( '#' +
					factory.convert.numberToHex(Math.floor( steps[0] * i + c1Vals[0] )) +
					factory.convert.numberToHex(Math.floor( steps[1] * i + c1Vals[1] )) +
					factory.convert.numberToHex(Math.floor( steps[2] * i + c1Vals[2] ))
				)
			}
		}
		return returnVal
	}
	function arrayRgb(c1, c2, len) {
		var steps = [];
		var returnVal = [];
		if (len < 3) {returnVal = [factory.convert.rgb(c1),factory.convert.rgb(c2)]}
		else {
			var c1Vals = factory.get.values(factory.convert.rgb(c1),RETURN_TYPE.ARRAY);
			var c2Vals = factory.get.values(factory.convert.rgb(c2),RETURN_TYPE.ARRAY);
			for (var i = 0; i < c1Vals.length; i++) {
				steps.push( c1Vals[i] === c2Vals[i] ? 0 : (c1Vals[i] - c2Vals[i]) / (len-1) * -1 );
			}
			for ( i = 0; i < len; i++) {
				returnVal.push ( 'RGB(' +
					Math.floor( steps[0] * i + c1Vals[0] ) + ',' +
					Math.floor( steps[1] * i + c1Vals[1] ) + ',' +
					Math.floor( steps[2] * i + c1Vals[2] ) + ')'
				)
			}
		}
		return returnVal
	}
	function arrayRgba(c1, c2, len, op1, op2) {
		var steps = [];
		var returnVal = [];
		if (len < 3) {returnVal = [factory.convert.rgba(c1,op1),factory.convert.hex(c2,op2)]}
		else {
			var c1Vals = factory.get.values(factory.convert.rgba(c1,op1),RETURN_TYPE.ARRAY);
			var c2Vals = factory.get.values(factory.convert.rgba(c2,op2),RETURN_TYPE.ARRAY);

			for (var i = 0; i < c1Vals.length; i++) {
				steps.push( c1Vals[i] === c2Vals[i] ? 0 : (c1Vals[i] - c2Vals[i]) / (len-1) * -1 );
			}
			for (i = 0; i < len; i++) {
				returnVal.push ( 'RGBA(' +
					Math.floor( steps[0] * i + c1Vals[0] ) + ',' +
					Math.floor( steps[1] * i + c1Vals[1] ) + ',' +
					Math.floor( steps[2] * i + c1Vals[2] ) + ',' +
					factory.get.roundedNumber(Number(steps[3] * i + c1Vals[3]),2) + ')'
				)
			}
		}
		return returnVal
	}
	function arrayHsl(c1, c2, len) {
		var returnVal = [];
		if (len < 3) {returnVal = [factory.convert.hsl(c1),factory.convert.hsl(c2)]}
		else {
			returnVal = factory.array.rgb(c1,c2,len);
			for (var i = 0; i < returnVal.length; i++) {
				returnVal[i] = factory.convert.hsl(returnVal[i]);
			}
		}
		return returnVal
	}
	function arrayHsla(c1, c2, len, o1, o2) {
		var returnVal = [];
		if (len < 3) {returnVal = [factory.convert.hsla(c1),factory.convert.hsla(c2)]}
		else {
			returnVal = factory.array.rgba(c1,c2,len,o1,o2);
			for (var i = 0; i < returnVal.length; i++) {
				returnVal[i] = factory.convert.hsla(returnVal[i]);
			}
		}
		return returnVal
	}
}