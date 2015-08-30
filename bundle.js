/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*eslint-disable no-var, no-console, vars-on-top*/

	__webpack_require__(1);
	__webpack_require__(5);
	var Rainbow = __webpack_require__(7);
	var NProgress = __webpack_require__(8);

	var places;

	const CATEGORIES = {
	    'World News': 'http://feeds.reuters.com/Reuters/worldNews',
	    'US News': 'http://feeds.reuters.com/Reuters/domesticNews',
	    'Top News': 'http://feeds.reuters.com/reuters/MostRead',
	    'Politics': 'http://feeds.reuters.com/Reuters/PoliticsNews'
	}

	function dispNum(n) {
	    return parseFloat(parseFloat(n).toFixed(1));
	}

	$(document).ready(function () {
	    $('#countryInfo').html('').css('display', 'none');
	    $('#errors').hide();

	    $('.slug').click(function(event) {
	        requestStories($(this).text());
	        event.preventDefault();
	        return false;
	    });

	    $(document).on('mousemove', function (e) {
	        $('#countryInfo').css({
	            left: e.pageX,
	            top: e.pageY
	        });
	    });

	    requestStories('World News');
	});

	var mWidth = $('#map').width(),
	    width = 1000,
	    height = 360,
	    country;

	var rainbow = new Rainbow();
	rainbow.setSpectrum('f61f55', '40dee3', '67ff8c');
	rainbow.setNumberRange(-200, 200);

	var projection = d3.geo.mercator()
	    .scale(150)
	    .translate([width / 2, height / 1.5]);

	var path = d3.geo.path()
	    .projection(projection);

	var svg = d3.select('#map').append('svg')
	    .attr('preserveAspectRatio', 'xMidYMid')
	    .attr('viewBox', '0 0 ' + width + ' ' + height)
	    .attr('width', mWidth)
	    .attr('height', mWidth * height / width);

	svg.append('rect')
	    .attr('class', 'background')
	    .attr('width', width)
	    .attr('height', height)
	    .on('click', countryClicked);

	var g = svg.append('g');
	d3.json('/json/countries.topo.json', function (error, us) {
	    g.append('g')
	        .attr('id', 'countries')
	        .selectAll('path')
	        .data(topojson.feature(us, us.objects.countries).features)
	        .enter()
	        .append('path')
	        .attr('id', function (d) {
	            return d.id;
	        })
	        .attr('name', function (d) {
	            return d.properties.name;
	        })
	        .attr('d', path)
	        .on('click', countryClicked)
	        .on('mouseover', function (d) {
	            d3.select(this).classed('selected', true);

	            sentiment = d3.select(this).attr('sentiment');
	            if (sentiment == null) {
	                sentiment = 0;
	            }

	            if (sentiment < 0) {
	                $('#countryInfo').html(d.properties.name + ', ' + dispNum(sentiment) + ' sentiment').css('display', 'block');
	            } else if (sentiment > 0) {
	                $('#countryInfo').html(d.properties.name + ', +' + dispNum(sentiment) + ' sentiment').css('display', 'block');
	            } else {
	                $('#countryInfo').html(d.properties.name).css('display', 'block');
	            }
	        })
	        .on('mouseout', function (e) {
	            d3.select(this).classed('selected', false);
	            $('#countryInfo').html('').css('display', 'none');
	        });
	});

	function countryClicked(d) {
	    // FeedZilla is down so do nothing for now.

	    // // Previous selection
	    // if (country) {
	    //     g.selectAll('#' + country.id).classed('selected', false);
	    // }
	    //
	    // if (d && country !== d) {
	    //     country = d;
	    //     g.selectAll('#' + country.id).classed('selected', true);
	    //     requestStories(country.properties.name);
	    // }
	}

	NProgress.configure({
	    trickleRate: 0.05,
	    trickleSpeed: 400
	});

	function requestStories(slug) {
	    NProgress.start();

	    g.selectAll('#countries *').style('fill', null);
	    g.selectAll('#countries *').attr('sentiment', 0);

	    $('#title').html('<h1>' + slug + '</h1>');
	    $('#footer').css('border-top', '1px solid #ddd');

	    url = 'http://localhost:5000/feeds';
	    if (window.location.host == 'mapworldnews.com') {
	        url = 'http://map-world-news.herokuapp.com/feeds';
	    }

	    $.post(url, { url: CATEGORIES[slug] }, function(data) {
	        $.post(url, { data: data }, function(data) {
	            var itemsPositive = [];
	            var itemsNegative = [];
	            var itemsNeutral = [];

	            var i = 1;
	            console.log(data);
	            $.each(data, function(idx, val) {
	                open = '<div class="story">';
	                close = '</div>';

	                title = '<h5><a href="' + val.link + '" target="_blank">'
	                      + val.title + '</a></h5>';

	                tag = ''

	                if (val.sentiment > 0) {
	                    tag = '+' + dispNum(val.sentiment) + ' sentiment';
	                    if (val.countries.length > 0) {
	                        tag +=  ' for ' + val.countries.join(', ');
	                    }
	                    tag += '.';
	                } else if (val.sentiment < 0) {
	                    tag = Math.floor(val.sentiment) + ' sentiment';
	                    if (val.countries.length > 0) {
	                        tag +=  ' for ' + val.countries.join(', ');
	                    }
	                    tag += '.';
	                } else {
	                    if (val.countries.length > 0) {
	                        tag = val.countries.join(', ') + ' mentioned.';
	                    }
	                }

	                tag = '<strong>' + tag + '</strong>';
	                text = '<p>' + val.summary + '</p>';
	                story = open + title + tag + text + close;

	                if (val.sentiment > 0) {
	                    itemsPositive.push(story);
	                } else if (val.sentiment < 0) {
	                    itemsNegative.push(story);
	                } else {
	                    itemsNeutral.push(story);
	                }

	                i++;
	                val.countries.forEach(function (entry) {
	                    original = entry;
	                    entry = g.selectAll('#' + entry)

	                    if (entry.empty()) {
	                        console.log('Error. Country not found: ' + original);
	                    } else {
	                        currentSentiment = parseFloat(entry.attr('sentiment'));
	                        currentSentiment = currentSentiment || 0;
	                        newSentiment = currentSentiment + val.sentiment;
	                        entry.attr('sentiment', newSentiment);

	                        entry.style('fill', '#' + rainbow.colourAt(Math.round(newSentiment * 100)));
	                        $('#map').css('background-image', 'url("/img/key.png")');
	                    }
	                });
	            });

	            $('#itemsPositive').html('<h3>Positive</h3>' + itemsPositive.join('\n'))
	            $('#itemsNeutral').html('<h3>Neutral</h3>' + itemsNeutral.join('\n'))
	            $('#itemsNegative').html('<h3>Negative</h3>' + itemsNegative.join('\n'))
	            NProgress.done();
	        }, 'json');
	    }).fail(function() {
	        NProgress.done();
	        console.log( 'Failure to getJSON for ' + url);
	        $('#errors').slideDown().delay(30000).slideUp();
	    });
	}

	$(window).resize(function () {
	    var w = $('#map').width();
	    svg.attr('width', w);
	    svg.attr('height', w * height / width);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./custom.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./custom.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "body {\n  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n}\n\nh1 {\n  font-weight: 800;\n}\n\nh2, h3 {\n  font-weight: 600;\n}\n\nnav.navbar {\n  background-color: white;\n  margin-bottom: 0px;\n  border-bottom: 1px solid #2e3540;\n}\n\n.navbar a:link, .navbar a:visited\n.navbar-form .form-control,\n.navbar-form .btn-default,\n.form-control,\n.navbar-default .navbar-brand {\n  text-shadow: none;\n  box-shadow: none;\n  color: #2e3540;\n  border-color: #2e3540;\n}\n\n.navbar a:hover, .navbar a:focus,\n.btn-default:hover, .btn-default:focus,\n.form-control:hover, .form-control:focus,\n.navbar-default .navbar-brand:hover {\n  color: #428bca;\n  border-color: #428bca;\n  background-color: white;\n  box-shadow: none\n}\n\n#countryInfo {\n  color: #000;\n  display: block;\n  position: absolute;\n  top: -50px;\n  left: -50px;\n  margin: 5px 15px;\n  padding: 5px 10px;\n  background-color: white;\n  border-radius: 3px;\n  border: 1px solid #2e3540;\n}\n\n.story {\n  border-top: 1px solid #ddd;\n  padding-bottom: 20px;\n}\n\n.story h5,\n.story h5 a {\n  padding-top: 5px;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  margin-bottom: 2px;\n}\n\n.story strong {\n  font-weight: 600;\n}\n\n.story p {\n  margin-top: 1em;\n}\n\n#footer {\n  padding-top: 10px;\n  margin-top: 20px;\n  padding-bottom: 100px;\n}\n\n#footer ol li {\n  margin-bottom: 0.5em;\n}\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(6);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./map.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./map.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "#map {\n  background-size: 112px 32px;\n  background-position: 0% 100%;\n  background-repeat: no-repeat;\n\n  /* Filled in by JS when map is colored. */\n  background-image: none;\n}\n\n#errors {\n  margin-top: 15px;\n}\n\n#map-background {\n  background-color: #2e3540;\n}\n\n.background {\n  fill: none;\n  pointer-events: all;\n}\n\n#countries {\n  /*cursor: pointer;*/\n  fill: #474e5b;\n  stroke: #2e3540;\n  stroke-width:1;\n  stroke-linejoin: miter;\n  stroke-linecap: butt;\n}\n", ""]);

	// exports


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
	RainbowVis-JS 
	Released under Eclipse Public License - v 1.0
	*/

	function Rainbow()
	{
		"use strict";
		var gradients = null;
		var minNum = 0;
		var maxNum = 100;
		var colours = ['ff0000', 'ffff00', '00ff00', '0000ff']; 
		setColours(colours);
		
		function setColours (spectrum) 
		{
			if (spectrum.length < 2) {
				throw new Error('Rainbow must have two or more colours.');
			} else {
				var increment = (maxNum - minNum)/(spectrum.length - 1);
				var firstGradient = new ColourGradient();
				firstGradient.setGradient(spectrum[0], spectrum[1]);
				firstGradient.setNumberRange(minNum, minNum + increment);
				gradients = [ firstGradient ];
				
				for (var i = 1; i < spectrum.length - 1; i++) {
					var colourGradient = new ColourGradient();
					colourGradient.setGradient(spectrum[i], spectrum[i + 1]);
					colourGradient.setNumberRange(minNum + increment * i, minNum + increment * (i + 1)); 
					gradients[i] = colourGradient; 
				}

				colours = spectrum;
			}
		}

		this.setSpectrum = function () 
		{
			setColours(arguments);
			return this;
		}

		this.setSpectrumByArray = function (array)
		{
			setColours(array);
			return this;
		}

		this.colourAt = function (number)
		{
			if (isNaN(number)) {
				throw new TypeError(number + ' is not a number');
			} else if (gradients.length === 1) {
				return gradients[0].colourAt(number);
			} else {
				var segment = (maxNum - minNum)/(gradients.length);
				var index = Math.min(Math.floor((Math.max(number, minNum) - minNum)/segment), gradients.length - 1);
				return gradients[index].colourAt(number);
			}
		}

		this.colorAt = this.colourAt;

		this.setNumberRange = function (minNumber, maxNumber)
		{
			if (maxNumber > minNumber) {
				minNum = minNumber;
				maxNum = maxNumber;
				setColours(colours);
			} else {
				throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
			}
			return this;
		}
	}

	function ColourGradient() 
	{
		"use strict";
		var startColour = 'ff0000';
		var endColour = '0000ff';
		var minNum = 0;
		var maxNum = 100;

		this.setGradient = function (colourStart, colourEnd)
		{
			startColour = getHexColour(colourStart);
			endColour = getHexColour(colourEnd);
		}

		this.setNumberRange = function (minNumber, maxNumber)
		{
			if (maxNumber > minNumber) {
				minNum = minNumber;
				maxNum = maxNumber;
			} else {
				throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
			}
		}

		this.colourAt = function (number)
		{
			return calcHex(number, startColour.substring(0,2), endColour.substring(0,2)) 
				+ calcHex(number, startColour.substring(2,4), endColour.substring(2,4)) 
				+ calcHex(number, startColour.substring(4,6), endColour.substring(4,6));
		}
		
		function calcHex(number, channelStart_Base16, channelEnd_Base16)
		{
			var num = number;
			if (num < minNum) {
				num = minNum;
			}
			if (num > maxNum) {
				num = maxNum;
			} 
			var numRange = maxNum - minNum;
			var cStart_Base10 = parseInt(channelStart_Base16, 16);
			var cEnd_Base10 = parseInt(channelEnd_Base16, 16); 
			var cPerUnit = (cEnd_Base10 - cStart_Base10)/numRange;
			var c_Base10 = Math.round(cPerUnit * (num - minNum) + cStart_Base10);
			return formatHex(c_Base10.toString(16));
		}

		function formatHex(hex) 
		{
			if (hex.length === 1) {
				return '0' + hex;
			} else {
				return hex;
			}
		} 
		
		function isHexColour(string)
		{
			var regex = /^#?[0-9a-fA-F]{6}$/i;
			return regex.test(string);
		}

		function getHexColour(string)
		{
			if (isHexColour(string)) {
				return string.substring(string.length - 6, string.length);
			} else {
				var name = string.toLowerCase();
				if (colourNames.hasOwnProperty(name)) {
					return colourNames[name];
				}
				throw new Error(string + ' is not a valid colour.');
			}
		}
		
		// Extended list of CSS colornames s taken from
		// http://www.w3.org/TR/css3-color/#svg-color
		var colourNames = {
			aliceblue: "F0F8FF",
			antiquewhite: "FAEBD7",
			aqua: "00FFFF",
			aquamarine: "7FFFD4",
			azure: "F0FFFF",
			beige: "F5F5DC",
			bisque: "FFE4C4",
			black: "000000",
			blanchedalmond: "FFEBCD",
			blue: "0000FF",
			blueviolet: "8A2BE2",
			brown: "A52A2A",
			burlywood: "DEB887",
			cadetblue: "5F9EA0",
			chartreuse: "7FFF00",
			chocolate: "D2691E",
			coral: "FF7F50",
			cornflowerblue: "6495ED",
			cornsilk: "FFF8DC",
			crimson: "DC143C",
			cyan: "00FFFF",
			darkblue: "00008B",
			darkcyan: "008B8B",
			darkgoldenrod: "B8860B",
			darkgray: "A9A9A9",
			darkgreen: "006400",
			darkgrey: "A9A9A9",
			darkkhaki: "BDB76B",
			darkmagenta: "8B008B",
			darkolivegreen: "556B2F",
			darkorange: "FF8C00",
			darkorchid: "9932CC",
			darkred: "8B0000",
			darksalmon: "E9967A",
			darkseagreen: "8FBC8F",
			darkslateblue: "483D8B",
			darkslategray: "2F4F4F",
			darkslategrey: "2F4F4F",
			darkturquoise: "00CED1",
			darkviolet: "9400D3",
			deeppink: "FF1493",
			deepskyblue: "00BFFF",
			dimgray: "696969",
			dimgrey: "696969",
			dodgerblue: "1E90FF",
			firebrick: "B22222",
			floralwhite: "FFFAF0",
			forestgreen: "228B22",
			fuchsia: "FF00FF",
			gainsboro: "DCDCDC",
			ghostwhite: "F8F8FF",
			gold: "FFD700",
			goldenrod: "DAA520",
			gray: "808080",
			green: "008000",
			greenyellow: "ADFF2F",
			grey: "808080",
			honeydew: "F0FFF0",
			hotpink: "FF69B4",
			indianred: "CD5C5C",
			indigo: "4B0082",
			ivory: "FFFFF0",
			khaki: "F0E68C",
			lavender: "E6E6FA",
			lavenderblush: "FFF0F5",
			lawngreen: "7CFC00",
			lemonchiffon: "FFFACD",
			lightblue: "ADD8E6",
			lightcoral: "F08080",
			lightcyan: "E0FFFF",
			lightgoldenrodyellow: "FAFAD2",
			lightgray: "D3D3D3",
			lightgreen: "90EE90",
			lightgrey: "D3D3D3",
			lightpink: "FFB6C1",
			lightsalmon: "FFA07A",
			lightseagreen: "20B2AA",
			lightskyblue: "87CEFA",
			lightslategray: "778899",
			lightslategrey: "778899",
			lightsteelblue: "B0C4DE",
			lightyellow: "FFFFE0",
			lime: "00FF00",
			limegreen: "32CD32",
			linen: "FAF0E6",
			magenta: "FF00FF",
			maroon: "800000",
			mediumaquamarine: "66CDAA",
			mediumblue: "0000CD",
			mediumorchid: "BA55D3",
			mediumpurple: "9370DB",
			mediumseagreen: "3CB371",
			mediumslateblue: "7B68EE",
			mediumspringgreen: "00FA9A",
			mediumturquoise: "48D1CC",
			mediumvioletred: "C71585",
			midnightblue: "191970",
			mintcream: "F5FFFA",
			mistyrose: "FFE4E1",
			moccasin: "FFE4B5",
			navajowhite: "FFDEAD",
			navy: "000080",
			oldlace: "FDF5E6",
			olive: "808000",
			olivedrab: "6B8E23",
			orange: "FFA500",
			orangered: "FF4500",
			orchid: "DA70D6",
			palegoldenrod: "EEE8AA",
			palegreen: "98FB98",
			paleturquoise: "AFEEEE",
			palevioletred: "DB7093",
			papayawhip: "FFEFD5",
			peachpuff: "FFDAB9",
			peru: "CD853F",
			pink: "FFC0CB",
			plum: "DDA0DD",
			powderblue: "B0E0E6",
			purple: "800080",
			red: "FF0000",
			rosybrown: "BC8F8F",
			royalblue: "4169E1",
			saddlebrown: "8B4513",
			salmon: "FA8072",
			sandybrown: "F4A460",
			seagreen: "2E8B57",
			seashell: "FFF5EE",
			sienna: "A0522D",
			silver: "C0C0C0",
			skyblue: "87CEEB",
			slateblue: "6A5ACD",
			slategray: "708090",
			slategrey: "708090",
			snow: "FFFAFA",
			springgreen: "00FF7F",
			steelblue: "4682B4",
			tan: "D2B48C",
			teal: "008080",
			thistle: "D8BFD8",
			tomato: "FF6347",
			turquoise: "40E0D0",
			violet: "EE82EE",
			wheat: "F5DEB3",
			white: "FFFFFF",
			whitesmoke: "F5F5F5",
			yellow: "FFFF00",
			yellowgreen: "9ACD32"
		}
	}

	if (true) {
	  module.exports = Rainbow;
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
	 * @license MIT */

	;(function(root, factory) {

	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    module.exports = factory();
	  } else {
	    root.NProgress = factory();
	  }

	})(this, function() {
	  var NProgress = {};

	  NProgress.version = '0.2.0';

	  var Settings = NProgress.settings = {
	    minimum: 0.08,
	    easing: 'ease',
	    positionUsing: '',
	    speed: 200,
	    trickle: true,
	    trickleRate: 0.02,
	    trickleSpeed: 800,
	    showSpinner: true,
	    barSelector: '[role="bar"]',
	    spinnerSelector: '[role="spinner"]',
	    parent: 'body',
	    template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
	  };

	  /**
	   * Updates configuration.
	   *
	   *     NProgress.configure({
	   *       minimum: 0.1
	   *     });
	   */
	  NProgress.configure = function(options) {
	    var key, value;
	    for (key in options) {
	      value = options[key];
	      if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
	    }

	    return this;
	  };

	  /**
	   * Last number.
	   */

	  NProgress.status = null;

	  /**
	   * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
	   *
	   *     NProgress.set(0.4);
	   *     NProgress.set(1.0);
	   */

	  NProgress.set = function(n) {
	    var started = NProgress.isStarted();

	    n = clamp(n, Settings.minimum, 1);
	    NProgress.status = (n === 1 ? null : n);

	    var progress = NProgress.render(!started),
	        bar      = progress.querySelector(Settings.barSelector),
	        speed    = Settings.speed,
	        ease     = Settings.easing;

	    progress.offsetWidth; /* Repaint */

	    queue(function(next) {
	      // Set positionUsing if it hasn't already been set
	      if (Settings.positionUsing === '') Settings.positionUsing = NProgress.getPositioningCSS();

	      // Add transition
	      css(bar, barPositionCSS(n, speed, ease));

	      if (n === 1) {
	        // Fade out
	        css(progress, { 
	          transition: 'none', 
	          opacity: 1 
	        });
	        progress.offsetWidth; /* Repaint */

	        setTimeout(function() {
	          css(progress, { 
	            transition: 'all ' + speed + 'ms linear', 
	            opacity: 0 
	          });
	          setTimeout(function() {
	            NProgress.remove();
	            next();
	          }, speed);
	        }, speed);
	      } else {
	        setTimeout(next, speed);
	      }
	    });

	    return this;
	  };

	  NProgress.isStarted = function() {
	    return typeof NProgress.status === 'number';
	  };

	  /**
	   * Shows the progress bar.
	   * This is the same as setting the status to 0%, except that it doesn't go backwards.
	   *
	   *     NProgress.start();
	   *
	   */
	  NProgress.start = function() {
	    if (!NProgress.status) NProgress.set(0);

	    var work = function() {
	      setTimeout(function() {
	        if (!NProgress.status) return;
	        NProgress.trickle();
	        work();
	      }, Settings.trickleSpeed);
	    };

	    if (Settings.trickle) work();

	    return this;
	  };

	  /**
	   * Hides the progress bar.
	   * This is the *sort of* the same as setting the status to 100%, with the
	   * difference being `done()` makes some placebo effect of some realistic motion.
	   *
	   *     NProgress.done();
	   *
	   * If `true` is passed, it will show the progress bar even if its hidden.
	   *
	   *     NProgress.done(true);
	   */

	  NProgress.done = function(force) {
	    if (!force && !NProgress.status) return this;

	    return NProgress.inc(0.3 + 0.5 * Math.random()).set(1);
	  };

	  /**
	   * Increments by a random amount.
	   */

	  NProgress.inc = function(amount) {
	    var n = NProgress.status;

	    if (!n) {
	      return NProgress.start();
	    } else {
	      if (typeof amount !== 'number') {
	        amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
	      }

	      n = clamp(n + amount, 0, 0.994);
	      return NProgress.set(n);
	    }
	  };

	  NProgress.trickle = function() {
	    return NProgress.inc(Math.random() * Settings.trickleRate);
	  };

	  /**
	   * Waits for all supplied jQuery promises and
	   * increases the progress as the promises resolve.
	   *
	   * @param $promise jQUery Promise
	   */
	  (function() {
	    var initial = 0, current = 0;

	    NProgress.promise = function($promise) {
	      if (!$promise || $promise.state() === "resolved") {
	        return this;
	      }

	      if (current === 0) {
	        NProgress.start();
	      }

	      initial++;
	      current++;

	      $promise.always(function() {
	        current--;
	        if (current === 0) {
	            initial = 0;
	            NProgress.done();
	        } else {
	            NProgress.set((initial - current) / initial);
	        }
	      });

	      return this;
	    };

	  })();

	  /**
	   * (Internal) renders the progress bar markup based on the `template`
	   * setting.
	   */

	  NProgress.render = function(fromStart) {
	    if (NProgress.isRendered()) return document.getElementById('nprogress');

	    addClass(document.documentElement, 'nprogress-busy');
	    
	    var progress = document.createElement('div');
	    progress.id = 'nprogress';
	    progress.innerHTML = Settings.template;

	    var bar      = progress.querySelector(Settings.barSelector),
	        perc     = fromStart ? '-100' : toBarPerc(NProgress.status || 0),
	        parent   = document.querySelector(Settings.parent),
	        spinner;
	    
	    css(bar, {
	      transition: 'all 0 linear',
	      transform: 'translate3d(' + perc + '%,0,0)'
	    });

	    if (!Settings.showSpinner) {
	      spinner = progress.querySelector(Settings.spinnerSelector);
	      spinner && removeElement(spinner);
	    }

	    if (parent != document.body) {
	      addClass(parent, 'nprogress-custom-parent');
	    }

	    parent.appendChild(progress);
	    return progress;
	  };

	  /**
	   * Removes the element. Opposite of render().
	   */

	  NProgress.remove = function() {
	    removeClass(document.documentElement, 'nprogress-busy');
	    removeClass(document.querySelector(Settings.parent), 'nprogress-custom-parent');
	    var progress = document.getElementById('nprogress');
	    progress && removeElement(progress);
	  };

	  /**
	   * Checks if the progress bar is rendered.
	   */

	  NProgress.isRendered = function() {
	    return !!document.getElementById('nprogress');
	  };

	  /**
	   * Determine which positioning CSS rule to use.
	   */

	  NProgress.getPositioningCSS = function() {
	    // Sniff on document.body.style
	    var bodyStyle = document.body.style;

	    // Sniff prefixes
	    var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
	                       ('MozTransform' in bodyStyle) ? 'Moz' :
	                       ('msTransform' in bodyStyle) ? 'ms' :
	                       ('OTransform' in bodyStyle) ? 'O' : '';

	    if (vendorPrefix + 'Perspective' in bodyStyle) {
	      // Modern browsers with 3D support, e.g. Webkit, IE10
	      return 'translate3d';
	    } else if (vendorPrefix + 'Transform' in bodyStyle) {
	      // Browsers without 3D support, e.g. IE9
	      return 'translate';
	    } else {
	      // Browsers without translate() support, e.g. IE7-8
	      return 'margin';
	    }
	  };

	  /**
	   * Helpers
	   */

	  function clamp(n, min, max) {
	    if (n < min) return min;
	    if (n > max) return max;
	    return n;
	  }

	  /**
	   * (Internal) converts a percentage (`0..1`) to a bar translateX
	   * percentage (`-100%..0%`).
	   */

	  function toBarPerc(n) {
	    return (-1 + n) * 100;
	  }


	  /**
	   * (Internal) returns the correct CSS for changing the bar's
	   * position given an n percentage, and speed and ease from Settings
	   */

	  function barPositionCSS(n, speed, ease) {
	    var barCSS;

	    if (Settings.positionUsing === 'translate3d') {
	      barCSS = { transform: 'translate3d('+toBarPerc(n)+'%,0,0)' };
	    } else if (Settings.positionUsing === 'translate') {
	      barCSS = { transform: 'translate('+toBarPerc(n)+'%,0)' };
	    } else {
	      barCSS = { 'margin-left': toBarPerc(n)+'%' };
	    }

	    barCSS.transition = 'all '+speed+'ms '+ease;

	    return barCSS;
	  }

	  /**
	   * (Internal) Queues a function to be executed.
	   */

	  var queue = (function() {
	    var pending = [];
	    
	    function next() {
	      var fn = pending.shift();
	      if (fn) {
	        fn(next);
	      }
	    }

	    return function(fn) {
	      pending.push(fn);
	      if (pending.length == 1) next();
	    };
	  })();

	  /**
	   * (Internal) Applies css properties to an element, similar to the jQuery 
	   * css method.
	   *
	   * While this helper does assist with vendor prefixed property names, it 
	   * does not perform any manipulation of values prior to setting styles.
	   */

	  var css = (function() {
	    var cssPrefixes = [ 'Webkit', 'O', 'Moz', 'ms' ],
	        cssProps    = {};

	    function camelCase(string) {
	      return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function(match, letter) {
	        return letter.toUpperCase();
	      });
	    }

	    function getVendorProp(name) {
	      var style = document.body.style;
	      if (name in style) return name;

	      var i = cssPrefixes.length,
	          capName = name.charAt(0).toUpperCase() + name.slice(1),
	          vendorName;
	      while (i--) {
	        vendorName = cssPrefixes[i] + capName;
	        if (vendorName in style) return vendorName;
	      }

	      return name;
	    }

	    function getStyleProp(name) {
	      name = camelCase(name);
	      return cssProps[name] || (cssProps[name] = getVendorProp(name));
	    }

	    function applyCss(element, prop, value) {
	      prop = getStyleProp(prop);
	      element.style[prop] = value;
	    }

	    return function(element, properties) {
	      var args = arguments,
	          prop, 
	          value;

	      if (args.length == 2) {
	        for (prop in properties) {
	          value = properties[prop];
	          if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
	        }
	      } else {
	        applyCss(element, args[1], args[2]);
	      }
	    }
	  })();

	  /**
	   * (Internal) Determines if an element or space separated list of class names contains a class name.
	   */

	  function hasClass(element, name) {
	    var list = typeof element == 'string' ? element : classList(element);
	    return list.indexOf(' ' + name + ' ') >= 0;
	  }

	  /**
	   * (Internal) Adds a class to an element.
	   */

	  function addClass(element, name) {
	    var oldList = classList(element),
	        newList = oldList + name;

	    if (hasClass(oldList, name)) return; 

	    // Trim the opening space.
	    element.className = newList.substring(1);
	  }

	  /**
	   * (Internal) Removes a class from an element.
	   */

	  function removeClass(element, name) {
	    var oldList = classList(element),
	        newList;

	    if (!hasClass(element, name)) return;

	    // Replace the class name.
	    newList = oldList.replace(' ' + name + ' ', ' ');

	    // Trim the opening and closing spaces.
	    element.className = newList.substring(1, newList.length - 1);
	  }

	  /**
	   * (Internal) Gets a space separated list of the class names on the element. 
	   * The list is wrapped with a single space on each end to facilitate finding 
	   * matches within the list.
	   */

	  function classList(element) {
	    return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ');
	  }

	  /**
	   * (Internal) Removes an element from the DOM.
	   */

	  function removeElement(element) {
	    element && element.parentNode && element.parentNode.removeChild(element);
	  }

	  return NProgress;
	});



/***/ }
/******/ ]);