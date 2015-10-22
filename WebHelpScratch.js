/**
 * Intro.js v1.0.0
 * https://github.com/usablica/intro.js
 * MIT licensed
 *
 * Copyright (C) 2013 usabli.ca - A weekend project by Afshin Mehrabani (@afshinmeh)
 */

(function (root, factory) {
	if (typeof exports === 'object') {
		// CommonJS
		factory(exports);
	} else if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['exports'], factory);
	} else {
		// Browser globals
		factory(root);
	}
}(this, function (exports) {
	//Default config/variables
	var VERSION = '1.0.0';

	/**
	 * IntroJs main class
	 *
	 * @class IntroJs
	 */
	function IntroJs(obj) {
		this._targetElement = obj;
		this._options = {
			/* Next button label in tooltip box */
			nextLabel: 'Next &rarr;',
			/* Previous button label in tooltip box */
			prevLabel: '&larr; Back',
			/* Skip button label in tooltip box */
			skipLabel: 'Skip',
			/* Done button label in tooltip box */
			doneLabel: 'Done',
			/* Default tooltip box position */
			tooltipPosition: 'bottom',
			/* Next CSS class for tooltip boxes */
			tooltipClass: '',
			/* CSS class that is added to the helperLayer */
			highlightClass: '',
			/* Close introduction when pressing Escape button? */
			exitOnEsc: true,
			/* Close introduction when clicking on overlay layer? */
			exitOnOverlayClick: true,
			/* Show step numbers in introduction? */
			showStepNumbers: true,
			/* Let user use keyboard to navigate the tour? */
			keyboardNavigation: true,
			/* Show tour control buttons? */
			showButtons: true,
			/* Show tour bullets? */
			showBullets: true,
			/* Show tour progress? */
			showProgress: false,
			/* Scroll to highlighted element? */
			scrollToElement: true,
			/* Set the overlay opacity */
			overlayOpacity: 0.8,
			/* Precedence of positions, when auto is enabled */
			positionPrecedence: ["bottom", "top", "right", "left"],
			/* Disable an interaction with element? */
			disableInteraction: false
		};
	}

	/**
	 * Initiate a new introduction/guide from an element in the page
	 *
	 * @api private
	 * @method _introForElement
	 * @param {Object} targetElm
	 * @returns {Boolean} Success or not?
	 */
	function _introForElement(targetElm) {
		var introItems = [],
			self = this;
		if (this._options.steps) {
			//use steps passed programmatically
			var allIntroSteps = [];
			for (var i = 0, stepsLength = this._options.steps.length; i < stepsLength; i++) {
				var currentItem = _cloneObject(this._options.steps[i]);
				//set the step
				currentItem.step = introItems.length + 1;
				//use querySelector function only when developer used CSS selector
				if (typeof(currentItem.element) === 'string') {
					//grab the element with given selector from the page
					currentItem.element = document.querySelector(currentItem.element);
				}
				//intro without element
				if (typeof(currentItem.element) === 'undefined' || currentItem.element == null) {
					var floatingElementQuery = document.querySelector(".introjsFloatingElement");
					if (floatingElementQuery == null) {
						floatingElementQuery = document.createElement('div');
						floatingElementQuery.className = 'introjsFloatingElement';
						document.body.appendChild(floatingElementQuery);
					}
					currentItem.element = floatingElementQuery;
					currentItem.position = 'floating';
				}
				if (currentItem.element != null) {
					introItems.push(currentItem);
				}
			}
		} else {
			//use steps from data-* annotations
			var allIntroSteps = targetElm.querySelectorAll('*[data-intro]');
			//if there's no element to intro
			if (allIntroSteps.length < 1) {
				return false;
			}
			//first add intro items with data-step
			for (var i = 0, elmsLength = allIntroSteps.length; i < elmsLength; i++) {
				var currentElement = allIntroSteps[i];
				var step = parseInt(currentElement.getAttribute('data-step'), 10);
				if (step > 0) {
					introItems[step - 1] = {
						element: currentElement,
						intro: currentElement.getAttribute('data-intro'),
						step: parseInt(currentElement.getAttribute('data-step'), 10),
						tooltipClass: currentElement.getAttribute('data-tooltipClass'),
						highlightClass: currentElement.getAttribute('data-highlightClass'),
						position: currentElement.getAttribute('data-position') || this._options.tooltipPosition
					};
				}
			}
			//next add intro items without data-step
			//todo: we need a cleanup here, two loops are redundant
			var nextStep = 0;
			for (var i = 0, elmsLength = allIntroSteps.length; i < elmsLength; i++) {
				var currentElement = allIntroSteps[i];
				if (currentElement.getAttribute('data-step') == null) {
					while (true) {
						if (typeof introItems[nextStep] == 'undefined') {
							break;
						} else {
							nextStep++;
						}
					}
					introItems[nextStep] = {
						element: currentElement,
						intro: currentElement.getAttribute('data-intro'),
						step: nextStep + 1,
						tooltipClass: currentElement.getAttribute('data-tooltipClass'),
						highlightClass: currentElement.getAttribute('data-highlightClass'),
						position: currentElement.getAttribute('data-position') || this._options.tooltipPosition
					};
				}
			}
		}
		//removing undefined/null elements
		var tempIntroItems = [];
		for (var z = 0; z < introItems.length; z++) {
			introItems[z] && tempIntroItems.push(introItems[z]);  // copy non-empty values to the end of the array
		}
		introItems = tempIntroItems;
		//Ok, sort all items with given steps
		introItems.sort(function (a, b) {
			return a.step - b.step;
		});
		//set it to the introJs object
		self._introItems = introItems;
		//add overlay layer to the page
		if (_addOverlayLayer.call(self, targetElm)) {
			//then, start the show
			_nextStep.call(self);
			var skipButton = targetElm.querySelector('.introjs-skipbutton'),
				nextStepButton = targetElm.querySelector('.introjs-nextbutton');
			self._onKeyDown = function (e) {
				if (e.keyCode === 27 && self._options.exitOnEsc == true) {
					//escape key pressed, exit the intro
					_exitIntro.call(self, targetElm);
					//check if any callback is defined
					if (self._introExitCallback != undefined) {
						self._introExitCallback.call(self);
					}
				} else if (e.keyCode === 37) {
					//left arrow
					_previousStep.call(self);
				} else if (e.keyCode === 39) {
					//right arrow
					_nextStep.call(self);
				} else if (e.keyCode === 13) {
					//srcElement === ie
					var target = e.target || e.srcElement;
					if (target && target.className.indexOf('introjs-prevbutton') > 0) {
						//user hit enter while focusing on previous button
						_previousStep.call(self);
					} else if (target && target.className.indexOf('introjs-skipbutton') > 0) {
						//user hit enter while focusing on skip button
						_exitIntro.call(self, targetElm);
					} else {
						//default behavior for responding to enter
						_nextStep.call(self);
					}
					//prevent default behaviour on hitting Enter, to prevent steps being skipped in some browsers
					if (e.preventDefault) {
						e.preventDefault();
					} else {
						e.returnValue = false;
					}
				}
			};
			self._onResize = function (e) {
				_setHelperLayerPosition.call(self, document.querySelector('.introjs-helperLayer'));
				_setHelperLayerPosition.call(self, document.querySelector('.introjs-tooltipReferenceLayer'));
			};
			if (window.addEventListener) {
				if (this._options.keyboardNavigation) {
					window.addEventListener('keydown', self._onKeyDown, true);
				}
				//for window resize
				window.addEventListener('resize', self._onResize, true);
			} else if (document.attachEvent) { //IE
				if (this._options.keyboardNavigation) {
					document.attachEvent('onkeydown', self._onKeyDown);
				}
				//for window resize
				document.attachEvent('onresize', self._onResize);
			}
		}
		return false;
	}

	/*
	 * makes a copy of the object
	 * @api private
	 * @method _cloneObject
	 */
	function _cloneObject(object) {
		if (object == null || typeof (object) != 'object' || typeof (object.nodeType) != 'undefined') {
			return object;
		}
		var temp = {};
		for (var key in object) {
			temp[key] = _cloneObject(object[key]);
		}
		return temp;
	}

	/**
	 * Go to specific step of introduction
	 *
	 * @api private
	 * @method _goToStep
	 */
	function _goToStep(step) {
		//because steps starts with zero
		this._currentStep = step - 2;
		if (typeof (this._introItems) !== 'undefined') {
			_nextStep.call(this);
		}
	}

	/**
	 * Go to next step on intro
	 *
	 * @api private
	 * @method _nextStep
	 */
	function _nextStep() {
		this._direction = 'forward';
		if (typeof (this._currentStep) === 'undefined') {
			this._currentStep = 0;
		} else {
			++this._currentStep;
		}
		if ((this._introItems.length) <= this._currentStep) {
			//end of the intro
			//check if any callback is defined
			if (typeof (this._introCompleteCallback) === 'function') {
				this._introCompleteCallback.call(this);
			}
			_exitIntro.call(this, this._targetElement);
			return;
		}
		var nextStep = this._introItems[this._currentStep];
		if (typeof (this._introBeforeChangeCallback) !== 'undefined') {
			this._introBeforeChangeCallback.call(this, nextStep.element);
		}
		_showElement.call(this, nextStep);
	}

	/**
	 * Go to previous step on intro
	 *
	 * @api private
	 * @method _nextStep
	 */
	function _previousStep() {
		this._direction = 'backward';
		if (this._currentStep === 0) {
			return false;
		}
		var nextStep = this._introItems[--this._currentStep];
		if (typeof (this._introBeforeChangeCallback) !== 'undefined') {
			this._introBeforeChangeCallback.call(this, nextStep.element);
		}
		_showElement.call(this, nextStep);
	}

	/**
	 * Exit from intro
	 *
	 * @api private
	 * @method _exitIntro
	 * @param {Object} targetElement
	 */
	function _exitIntro(targetElement) {
		//remove overlay layer from the page
		var overlayLayer = targetElement.querySelector('.introjs-overlay');
		//return if intro already completed or skipped
		if (overlayLayer == null) {
			return;
		}
		//for fade-out animation
		overlayLayer.style.opacity = 0;
		setTimeout(function () {
			if (overlayLayer.parentNode) {
				overlayLayer.parentNode.removeChild(overlayLayer);
			}
		}, 500);
		//remove all helper layers
		var helperLayer = targetElement.querySelector('.introjs-helperLayer');
		if (helperLayer) {
			helperLayer.parentNode.removeChild(helperLayer);
		}
		var referenceLayer = targetElement.querySelector('.introjs-tooltipReferenceLayer');
		if (referenceLayer) {
			referenceLayer.parentNode.removeChild(referenceLayer);
		}
		//remove disableInteractionLayer
		var disableInteractionLayer = targetElement.querySelector('.introjs-disableInteraction');
		if (disableInteractionLayer) {
			disableInteractionLayer.parentNode.removeChild(disableInteractionLayer);
		}
		//remove intro floating element
		var floatingElement = document.querySelector('.introjsFloatingElement');
		if (floatingElement) {
			floatingElement.parentNode.removeChild(floatingElement);
		}
		//remove `introjs-showElement` class from the element
		var showElement = document.querySelector('.introjs-showElement');
		if (showElement) {
			showElement.className = showElement.className.replace(/introjs-[a-zA-Z]+/g, '').replace(/^\s+|\s+$/g, ''); // This
		                                                                                                             // is
		                                                                                                             // a
		                                                                                                             // manual
		                                                                                                             // trim.
		}
		//remove `introjs-customFixParent` class from the elements
		var fixParents = document.querySelectorAll('.introjs-customFixParent');
		if (fixParents && fixParents.length > 0) {
			for (var i = fixParents.length - 1; i >= 0; i--) {
				fixParents[i].className = fixParents[i].className.replace(/introjs-customFixParent/g, '').replace(/^\s+|\s+$/g, '');
			}
			;
		}
		//clean listeners
		if (window.removeEventListener) {
			window.removeEventListener('keydown', this._onKeyDown, true);
		} else if (document.detachEvent) { //IE
			document.detachEvent('onkeydown', this._onKeyDown);
		}
		//set the step to zero
		this._currentStep = undefined;
	}

	/**
	 * Render tooltip box in the page
	 *
	 * @api private
	 * @method _placeTooltip
	 * @param {Object} targetElement
	 * @param {Object} tooltipLayer
	 * @param {Object} arrowLayer
	 */
	function _placeTooltip(targetElement, tooltipLayer, arrowLayer, helperNumberLayer) {
		var tooltipCssClass = '',
			currentStepObj,
			tooltipOffset,
			targetElementOffset;
		//reset the old style
		tooltipLayer.style.top = null;
		tooltipLayer.style.right = null;
		tooltipLayer.style.bottom = null;
		tooltipLayer.style.left = null;
		tooltipLayer.style.marginLeft = null;
		tooltipLayer.style.marginTop = null;
		arrowLayer.style.display = 'inherit';
		if (typeof(helperNumberLayer) != 'undefined' && helperNumberLayer != null) {
			helperNumberLayer.style.top = null;
			helperNumberLayer.style.left = null;
		}
		//prevent error when `this._currentStep` is undefined
		if (!this._introItems[this._currentStep]) return;
		//if we have a custom css class for each step
		currentStepObj = this._introItems[this._currentStep];
		if (typeof (currentStepObj.tooltipClass) === 'string') {
			tooltipCssClass = currentStepObj.tooltipClass;
		} else {
			tooltipCssClass = this._options.tooltipClass;
		}
		tooltipLayer.className = ('introjs-tooltip ' + tooltipCssClass).replace(/^\s+|\s+$/g, '');
		//custom css class for tooltip boxes
		var tooltipCssClass = this._options.tooltipClass;
		currentTooltipPosition = this._introItems[this._currentStep].position;
		if ((currentTooltipPosition == "auto" || this._options.tooltipPosition == "auto")) {
			if (currentTooltipPosition != "floating") { // Floating is always valid, no point in calculating
				currentTooltipPosition = _determineAutoPosition.call(this, targetElement, tooltipLayer, currentTooltipPosition)
			}
		}
		var targetOffset = _getOffset(targetElement)
		var tooltipHeight = _getOffset(tooltipLayer).height
		var windowSize = _getWinSize()
		switch (currentTooltipPosition) {
			case 'top':
				tooltipLayer.style.left = '15px';
				tooltipLayer.style.top = '-' + (tooltipHeight + 10) + 'px';
				arrowLayer.className = 'introjs-arrow bottom';
				break;
			case 'right':
				tooltipLayer.style.left = (_getOffset(targetElement).width + 20) + 'px';
				if (targetOffset.top + tooltipHeight > windowSize.height) {
					// In this case, right would have fallen below the bottom of the screen.
					// Modify so that the bottom of the tooltip connects with the target
					arrowLayer.className = "introjs-arrow left-bottom";
					tooltipLayer.style.top = "-" + (tooltipHeight - targetOffset.height - 20) + "px"
				}
				arrowLayer.className = 'introjs-arrow left';
				break;
			case 'left':
				if (this._options.showStepNumbers == true) {
					tooltipLayer.style.top = '15px';
				}
				if (targetOffset.top + tooltipHeight > windowSize.height) {
					// In this case, left would have fallen below the bottom of the screen.
					// Modify so that the bottom of the tooltip connects with the target
					tooltipLayer.style.top = "-" + (tooltipHeight - targetOffset.height - 20) + "px"
					arrowLayer.className = 'introjs-arrow right-bottom';
				} else {
					arrowLayer.className = 'introjs-arrow right';
				}
				tooltipLayer.style.right = (targetOffset.width + 20) + 'px';
				break;
			case 'floating':
				arrowLayer.style.display = 'none';
				//we have to adjust the top and left of layer manually for intro items without element
				tooltipOffset = _getOffset(tooltipLayer);
				tooltipLayer.style.left = '50%';
				tooltipLayer.style.top = '50%';
				tooltipLayer.style.marginLeft = '-' + (tooltipOffset.width / 2) + 'px';
				tooltipLayer.style.marginTop = '-' + (tooltipOffset.height / 2) + 'px';
				if (typeof(helperNumberLayer) != 'undefined' && helperNumberLayer != null) {
					helperNumberLayer.style.left = '-' + ((tooltipOffset.width / 2) + 18) + 'px';
					helperNumberLayer.style.top = '-' + ((tooltipOffset.height / 2) + 18) + 'px';
				}
				break;
			case 'bottom-right-aligned':
				arrowLayer.className = 'introjs-arrow top-right';
				tooltipLayer.style.right = '0px';
				tooltipLayer.style.bottom = '-' + (_getOffset(tooltipLayer).height + 10) + 'px';
				break;
			case 'bottom-middle-aligned':
				targetElementOffset = _getOffset(targetElement);
				tooltipOffset = _getOffset(tooltipLayer);
				arrowLayer.className = 'introjs-arrow top-middle';
				tooltipLayer.style.left = (targetElementOffset.width / 2 - tooltipOffset.width / 2) + 'px';
				tooltipLayer.style.bottom = '-' + (tooltipOffset.height + 10) + 'px';
				break;
			case 'bottom-left-aligned':
			// Bottom-left-aligned is the same as the default bottom
			case 'bottom':
			// Bottom going to follow the default behavior
			default:
				tooltipLayer.style.bottom = '-' + (_getOffset(tooltipLayer).height + 10) + 'px';
				tooltipLayer.style.left = (_getOffset(targetElement).width / 2 - _getOffset(tooltipLayer).width / 2) + 'px';
				arrowLayer.className = 'introjs-arrow top';
				break;
		}
	}

	/**
	 * Determines the position of the tooltip based on the position precedence and availability
	 * of screen space.
	 *
	 * @param {Object} targetElement
	 * @param {Object} tooltipLayer
	 * @param {Object} desiredTooltipPosition
	 *
	 */
	function _determineAutoPosition(targetElement, tooltipLayer, desiredTooltipPosition) {

		// Take a clone of position precedence. These will be the available
		var possiblePositions = this._options.positionPrecedence.slice()
		var windowSize = _getWinSize()
		var tooltipHeight = _getOffset(tooltipLayer).height + 10
		var tooltipWidth = _getOffset(tooltipLayer).width + 20
		var targetOffset = _getOffset(targetElement)
		// If we check all the possible areas, and there are no valid places for the tooltip, the element
		// must take up most of the screen real estate. Show the tooltip floating in the middle of the screen.
		var calculatedPosition = "floating"
		// Check if the width of the tooltip + the starting point would spill off the right side of the screen
		// If no, neither bottom or top are valid
		if (targetOffset.left + tooltipWidth > windowSize.width || ((targetOffset.left + (targetOffset.width / 2)) - tooltipWidth) < 0) {
			_removeEntry(possiblePositions, "bottom")
			_removeEntry(possiblePositions, "top");
		} else {
			// Check for space below
			if ((targetOffset.height + targetOffset.top + tooltipHeight) > windowSize.height) {
				_removeEntry(possiblePositions, "bottom")
			}
			// Check for space above
			if (targetOffset.top - tooltipHeight < 0) {
				_removeEntry(possiblePositions, "top");
			}
		}
		// Check for space to the right
		if (targetOffset.width + targetOffset.left + tooltipWidth > windowSize.width) {
			_removeEntry(possiblePositions, "right");
		}
		// Check for space to the left
		if (targetOffset.left - tooltipWidth < 0) {
			_removeEntry(possiblePositions, "left");
		}
		// At this point, our array only has positions that are valid. Pick the first one, as it remains in order
		if (possiblePositions.length > 0) {
			calculatedPosition = possiblePositions[0];
		}
		// If the requested position is in the list, replace our calculated choice with that
		if (desiredTooltipPosition && desiredTooltipPosition != "auto") {
			if (possiblePositions.indexOf(desiredTooltipPosition) > -1) {
				calculatedPosition = desiredTooltipPosition
			}
		}
		return calculatedPosition
	}

	/**
	 * Remove an entry from a string array if it's there, does nothing if it isn't there.
	 *
	 * @param {Array} stringArray
	 * @param {String} stringToRemove
	 */
	function _removeEntry(stringArray, stringToRemove) {
		if (stringArray.indexOf(stringToRemove) > -1) {
			stringArray.splice(stringArray.indexOf(stringToRemove), 1);
		}
	}

	/**
	 * Update the position of the helper layer on the screen
	 *
	 * @api private
	 * @method _setHelperLayerPosition
	 * @param {Object} helperLayer
	 */
	function _setHelperLayerPosition(helperLayer) {
		if (helperLayer) {
			//prevent error when `this._currentStep` in undefined
			if (!this._introItems[this._currentStep]) return;
			var currentElement = this._introItems[this._currentStep],
				elementPosition = _getOffset(currentElement.element),
				widthHeightPadding = 10;
			if (currentElement.position == 'floating') {
				widthHeightPadding = 0;
			}
			//set new position to helper layer
			helperLayer.setAttribute('style', 'width: ' + (elementPosition.width + widthHeightPadding) + 'px; ' +
				'height:' + (elementPosition.height + widthHeightPadding) + 'px; ' +
				'top:' + (elementPosition.top - 5) + 'px;' +
				'left: ' + (elementPosition.left - 5) + 'px;');
		}
	}

	/**
	 * Add disableinteraction layer and adjust the size and position of the layer
	 *
	 * @api private
	 * @method _disableInteraction
	 */
	function _disableInteraction() {
		var disableInteractionLayer = document.querySelector('.introjs-disableInteraction');
		if (disableInteractionLayer === null) {
			disableInteractionLayer = document.createElement('div');
			disableInteractionLayer.className = 'introjs-disableInteraction';
			this._targetElement.appendChild(disableInteractionLayer);
		}
		_setHelperLayerPosition.call(this, disableInteractionLayer);
	}

	/**
	 * Show an element on the page
	 *
	 * @api private
	 * @method _showElement
	 * @param {Object} targetElement
	 */
	function _showElement(targetElement) {
		if (typeof (this._introChangeCallback) !== 'undefined') {
			this._introChangeCallback.call(this, targetElement.element);
		}
		var self = this,
			oldHelperLayer = document.querySelector('.introjs-helperLayer'),
			oldReferenceLayer = document.querySelector('.introjs-tooltipReferenceLayer'),
			highlightClass = 'introjs-helperLayer',
			elementPosition = _getOffset(targetElement.element);
		//check for a current step highlight class
		if (typeof (targetElement.highlightClass) === 'string') {
			highlightClass += (' ' + targetElement.highlightClass);
		}
		//check for options highlight class
		if (typeof (this._options.highlightClass) === 'string') {
			highlightClass += (' ' + this._options.highlightClass);
		}
		if (oldHelperLayer != null) {
			var oldHelperNumberLayer = oldReferenceLayer.querySelector('.introjs-helperNumberLayer'),
				oldtooltipLayer = oldReferenceLayer.querySelector('.introjs-tooltiptext'),
				oldArrowLayer = oldReferenceLayer.querySelector('.introjs-arrow'),
				oldtooltipContainer = oldReferenceLayer.querySelector('.introjs-tooltip'),
				skipTooltipButton = oldReferenceLayer.querySelector('.introjs-skipbutton'),
				prevTooltipButton = oldReferenceLayer.querySelector('.introjs-prevbutton'),
				nextTooltipButton = oldReferenceLayer.querySelector('.introjs-nextbutton');
			//update or reset the helper highlight class
			oldHelperLayer.className = highlightClass;
			//hide the tooltip
			oldtooltipContainer.style.opacity = 0;
			oldtooltipContainer.style.display = "none";
			if (oldHelperNumberLayer != null) {
				var lastIntroItem = this._introItems[(targetElement.step - 2 >= 0 ? targetElement.step - 2 : 0)];
				if (lastIntroItem != null && (this._direction == 'forward' && lastIntroItem.position == 'floating') || (this._direction == 'backward' && targetElement.position == 'floating')) {
					oldHelperNumberLayer.style.opacity = 0;
				}
			}
			//set new position to helper layer
			_setHelperLayerPosition.call(self, oldHelperLayer);
			_setHelperLayerPosition.call(self, oldReferenceLayer);
			//remove `introjs-customFixParent` class from the elements
			var fixParents = document.querySelectorAll('.introjs-customFixParent');
			if (fixParents && fixParents.length > 0) {
				for (var i = fixParents.length - 1; i >= 0; i--) {
					fixParents[i].className = fixParents[i].className.replace(/introjs-customFixParent/g, '').replace(/^\s+|\s+$/g, '');
				}
				;
			}
			//remove old classes
			var oldShowElement = document.querySelector('.introjs-showElement');
			oldShowElement.className = oldShowElement.className.replace(/introjs-[a-zA-Z]+/g, '').replace(/^\s+|\s+$/g, '');
			//we should wait until the CSS3 transition is competed (it's 0.3 sec) to prevent incorrect `height` and
			// `width` calculation
			if (self._lastShowElementTimer) {
				clearTimeout(self._lastShowElementTimer);
			}
			self._lastShowElementTimer = setTimeout(function () {
				//set current step to the label
				if (oldHelperNumberLayer != null) {
					oldHelperNumberLayer.innerHTML = targetElement.step;
				}
				//set current tooltip text
				oldtooltipLayer.innerHTML = targetElement.intro;
				//set the tooltip position
				oldtooltipContainer.style.display = "block";
				_placeTooltip.call(self, targetElement.element, oldtooltipContainer, oldArrowLayer, oldHelperNumberLayer);
				//change active bullet
				oldReferenceLayer.querySelector('.introjs-bullets li > a.active').className = '';
				oldReferenceLayer.querySelector('.introjs-bullets li > a[data-stepnumber="' + targetElement.step + '"]').className = 'active';
				oldReferenceLayer.querySelector('.introjs-progress .introjs-progressbar').setAttribute('style', 'width:' + _getProgress.call(self) + '%;');
				//show the tooltip
				oldtooltipContainer.style.opacity = 1;
				if (oldHelperNumberLayer) oldHelperNumberLayer.style.opacity = 1;
				//reset button focus
				if (nextTooltipButton.tabIndex === -1) {
					//tabindex of -1 means we are at the end of the tour - focus on skip / done
					skipTooltipButton.focus();
				} else {
					//still in the tour, focus on next
					nextTooltipButton.focus();
				}
			}, 350);
		} else {
			var helperLayer = document.createElement('div'),
				referenceLayer = document.createElement('div'),
				arrowLayer = document.createElement('div'),
				tooltipLayer = document.createElement('div'),
				tooltipTextLayer = document.createElement('div'),
				bulletsLayer = document.createElement('div'),
				progressLayer = document.createElement('div'),
				buttonsLayer = document.createElement('div');
			helperLayer.className = highlightClass;
			referenceLayer.className = 'introjs-tooltipReferenceLayer';
			//set new position to helper layer
			_setHelperLayerPosition.call(self, helperLayer);
			_setHelperLayerPosition.call(self, referenceLayer);
			//add helper layer to target element
			this._targetElement.appendChild(helperLayer);
			this._targetElement.appendChild(referenceLayer);
			arrowLayer.className = 'introjs-arrow';
			tooltipTextLayer.className = 'introjs-tooltiptext';
			tooltipTextLayer.innerHTML = targetElement.intro;
			bulletsLayer.className = 'introjs-bullets';
			if (this._options.showBullets === false) {
				bulletsLayer.style.display = 'none';
			}
			var ulContainer = document.createElement('ul');
			for (var i = 0, stepsLength = this._introItems.length; i < stepsLength; i++) {
				var innerLi = document.createElement('li');
				var anchorLink = document.createElement('a');
				anchorLink.onclick = function () {
					self.goToStep(this.getAttribute('data-stepnumber'));
				};
				if (i === (targetElement.step - 1)) anchorLink.className = 'active';
				anchorLink.href = 'javascript:void(0);';
				anchorLink.innerHTML = "&nbsp;";
				anchorLink.setAttribute('data-stepnumber', this._introItems[i].step);
				innerLi.appendChild(anchorLink);
				ulContainer.appendChild(innerLi);
			}
			bulletsLayer.appendChild(ulContainer);
			progressLayer.className = 'introjs-progress';
			if (this._options.showProgress === false) {
				progressLayer.style.display = 'none';
			}
			var progressBar = document.createElement('div');
			progressBar.className = 'introjs-progressbar';
			progressBar.setAttribute('style', 'width:' + _getProgress.call(this) + '%;');
			progressLayer.appendChild(progressBar);
			buttonsLayer.className = 'introjs-tooltipbuttons';
			if (this._options.showButtons === false) {
				buttonsLayer.style.display = 'none';
			}
			tooltipLayer.className = 'introjs-tooltip';
			tooltipLayer.appendChild(tooltipTextLayer);
			tooltipLayer.appendChild(bulletsLayer);
			tooltipLayer.appendChild(progressLayer);
			//add helper layer number
			if (this._options.showStepNumbers == true) {
				var helperNumberLayer = document.createElement('span');
				helperNumberLayer.className = 'introjs-helperNumberLayer';
				helperNumberLayer.innerHTML = targetElement.step;
				referenceLayer.appendChild(helperNumberLayer);
			}
			tooltipLayer.appendChild(arrowLayer);
			referenceLayer.appendChild(tooltipLayer);
			//next button
			var nextTooltipButton = document.createElement('a');
			nextTooltipButton.onclick = function () {
				if (self._introItems.length - 1 != self._currentStep) {
					_nextStep.call(self);
				}
			};
			nextTooltipButton.href = 'javascript:void(0);';
			nextTooltipButton.innerHTML = this._options.nextLabel;
			//previous button
			var prevTooltipButton = document.createElement('a');
			prevTooltipButton.onclick = function () {
				if (self._currentStep != 0) {
					_previousStep.call(self);
				}
			};
			prevTooltipButton.href = 'javascript:void(0);';
			prevTooltipButton.innerHTML = this._options.prevLabel;
			//skip button
			var skipTooltipButton = document.createElement('a');
			skipTooltipButton.className = 'introjs-button introjs-skipbutton';
			skipTooltipButton.href = 'javascript:void(0);';
			skipTooltipButton.innerHTML = this._options.skipLabel;
			skipTooltipButton.onclick = function () {
				if (self._introItems.length - 1 == self._currentStep && typeof (self._introCompleteCallback) === 'function') {
					self._introCompleteCallback.call(self);
				}
				if (self._introItems.length - 1 != self._currentStep && typeof (self._introExitCallback) === 'function') {
					self._introExitCallback.call(self);
				}
				_exitIntro.call(self, self._targetElement);
			};
			buttonsLayer.appendChild(skipTooltipButton);
			//in order to prevent displaying next/previous button always
			if (this._introItems.length > 1) {
				buttonsLayer.appendChild(prevTooltipButton);
				buttonsLayer.appendChild(nextTooltipButton);
			}
			tooltipLayer.appendChild(buttonsLayer);
			//set proper position
			_placeTooltip.call(self, targetElement.element, tooltipLayer, arrowLayer, helperNumberLayer);
		}
		//disable interaction
		if (this._options.disableInteraction === true) {
			_disableInteraction.call(self);
		}
		prevTooltipButton.removeAttribute('tabIndex');
		nextTooltipButton.removeAttribute('tabIndex');
		if (this._currentStep == 0 && this._introItems.length > 1) {
			prevTooltipButton.className = 'introjs-button introjs-prevbutton introjs-disabled';
			prevTooltipButton.tabIndex = '-1';
			nextTooltipButton.className = 'introjs-button introjs-nextbutton';
			skipTooltipButton.innerHTML = this._options.skipLabel;
		} else if (this._introItems.length - 1 == this._currentStep || this._introItems.length == 1) {
			skipTooltipButton.innerHTML = this._options.doneLabel;
			prevTooltipButton.className = 'introjs-button introjs-prevbutton';
			nextTooltipButton.className = 'introjs-button introjs-nextbutton introjs-disabled';
			nextTooltipButton.tabIndex = '-1';
		} else {
			prevTooltipButton.className = 'introjs-button introjs-prevbutton';
			nextTooltipButton.className = 'introjs-button introjs-nextbutton';
			skipTooltipButton.innerHTML = this._options.skipLabel;
		}
		//Set focus on "next" button, so that hitting Enter always moves you onto the next step
		nextTooltipButton.focus();
		//add target element position style
		targetElement.element.className += ' introjs-showElement';
		var currentElementPosition = _getPropValue(targetElement.element, 'position');
		if (currentElementPosition !== 'absolute' &&
			currentElementPosition !== 'relative') {
			//change to new intro item
			targetElement.element.className += ' introjs-relativePosition';
		}
		var parentElm = targetElement.element.parentNode;
		while (parentElm != null) {
			if (parentElm.tagName.toLowerCase() === 'body') break;
			//fix The Stacking Contenxt problem.
			//More detail:
			// https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context
			var zIndex = _getPropValue(parentElm, 'z-index');
			var opacity = parseFloat(_getPropValue(parentElm, 'opacity'));
			var transform = _getPropValue(parentElm, 'transform') || _getPropValue(parentElm, '-webkit-transform') || _getPropValue(parentElm, '-moz-transform') || _getPropValue(parentElm, '-ms-transform') || _getPropValue(parentElm, '-o-transform');
			if (/[0-9]+/.test(zIndex) || opacity < 1 || transform !== 'none') {
				parentElm.className += ' introjs-customFixParent';
			}
			parentElm = parentElm.parentNode;
		}
		if (!_elementInViewport(targetElement.element) && this._options.scrollToElement === true) {
			var rect = targetElement.element.getBoundingClientRect(),
				winHeight = _getWinSize().height,
				top = rect.bottom - (rect.bottom - rect.top),
				bottom = rect.bottom - winHeight;
			//Scroll up
			if (top < 0 || targetElement.element.clientHeight > winHeight) {
				window.scrollBy(0, top - 30); // 30px padding from edge to look nice
				//Scroll down
			} else {
				window.scrollBy(0, bottom + 100); // 70px + 30px padding from edge to look nice
			}
		}
		if (typeof (this._introAfterChangeCallback) !== 'undefined') {
			this._introAfterChangeCallback.call(this, targetElement.element);
		}
	}

	/**
	 * Get an element CSS property on the page
	 * Thanks to JavaScript Kit: http://www.javascriptkit.com/dhtmltutors/dhtmlcascade4.shtml
	 *
	 * @api private
	 * @method _getPropValue
	 * @param {Object} element
	 * @param {String} propName
	 * @returns Element's property value
	 */
	function _getPropValue(element, propName) {
		var propValue = '';
		if (element.currentStyle) { //IE
			propValue = element.currentStyle[propName];
		} else if (document.defaultView && document.defaultView.getComputedStyle) { //Others
			propValue = document.defaultView.getComputedStyle(element, null).getPropertyValue(propName);
		}
		//Prevent exception in IE
		if (propValue && propValue.toLowerCase) {
			return propValue.toLowerCase();
		} else {
			return propValue;
		}
	}

	/**
	 * Provides a cross-browser way to get the screen dimensions
	 * via: http://stackoverflow.com/questions/5864467/internet-explorer-innerheight
	 *
	 * @api private
	 * @method _getWinSize
	 * @returns {Object} width and height attributes
	 */
	function _getWinSize() {
		if (window.innerWidth != undefined) {
			return {width: window.innerWidth, height: window.innerHeight};
		} else {
			var D = document.documentElement;
			return {width: D.clientWidth, height: D.clientHeight};
		}
	}

	/**
	 * Add overlay layer to the page
	 * http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
	 *
	 * @api private
	 * @method _elementInViewport
	 * @param {Object} el
	 */
	function _elementInViewport(el) {
		var rect = el.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			(rect.bottom + 80) <= window.innerHeight && // add 80 to get the text right
			rect.right <= window.innerWidth
		);
	}

	/**
	 * Add overlay layer to the page
	 *
	 * @api private
	 * @method _addOverlayLayer
	 * @param {Object} targetElm
	 */
	function _addOverlayLayer(targetElm) {
		var overlayLayer = document.createElement('div'),
			styleText = '',
			self = this;
		//set css class name
		overlayLayer.className = 'introjs-overlay';
		//check if the target element is body, we should calculate the size of overlay layer in a better way
		if (targetElm.tagName.toLowerCase() === 'body') {
			styleText += 'top: 0;bottom: 0; left: 0;right: 0;position: fixed;';
			overlayLayer.setAttribute('style', styleText);
		} else {
			//set overlay layer position
			var elementPosition = _getOffset(targetElm);
			if (elementPosition) {
				styleText += 'width: ' + elementPosition.width + 'px; height:' + elementPosition.height + 'px; top:' + elementPosition.top + 'px;left: ' + elementPosition.left + 'px;';
				overlayLayer.setAttribute('style', styleText);
			}
		}
		targetElm.appendChild(overlayLayer);
		overlayLayer.onclick = function () {
			if (self._options.exitOnOverlayClick == true) {
				_exitIntro.call(self, targetElm);
				//check if any callback is defined
				if (self._introExitCallback != undefined) {
					self._introExitCallback.call(self);
				}
			}
		};
		setTimeout(function () {
			styleText += 'opacity: ' + self._options.overlayOpacity.toString() + ';';
			overlayLayer.setAttribute('style', styleText);
		}, 10);
		return true;
	}

	/**
	 * Get an element position on the page
	 * Thanks to `meouw`: http://stackoverflow.com/a/442474/375966
	 *
	 * @api private
	 * @method _getOffset
	 * @param {Object} element
	 * @returns Element's position info
	 */
	function _getOffset(element) {
		var elementPosition = {};
		var boundingFrameClientRect = {
			top: 0,
			left: 0
		};
		if ((element) && (element.ownerDocument !== window.document)) {
			boundingFrameClientRect = element.ownerDocument.defaultView.frameElement.getBoundingClientRect()
		}
		//set width
		elementPosition.width = element.offsetWidth;
		//set height
		elementPosition.height = element.offsetHeight;
		//calculate element top and left
		var _x = 0;
		var _y = 0;
		while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
			_x += element.offsetLeft;
			_y += element.offsetTop;
			element = element.offsetParent;
		}
		//set top
		elementPosition.top = _y;
		//set left
		elementPosition.left = _x;

		//account for elements within a frame
		elementPosition.top += boundingFrameClientRect.top;
		elementPosition.left += boundingFrameClientRect.left;

		return elementPosition;
	}

	/**
	 * Gets the current progress percentage
	 *
	 * @api private
	 * @method _getProgress
	 * @returns current progress percentage
	 */
	function _getProgress() {
		// Steps are 0 indexed
		var currentStep = parseInt((this._currentStep + 1), 10);
		return ((currentStep / this._introItems.length) * 100);
	}

	/**
	 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
	 * via: http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
	 *
	 * @param obj1
	 * @param obj2
	 * @returns obj3 a new object based on obj1 and obj2
	 */
	function _mergeOptions(obj1, obj2) {
		var obj3 = {};
		for (var attrname in obj1) {
			obj3[attrname] = obj1[attrname];
		}
		for (var attrname in obj2) {
			obj3[attrname] = obj2[attrname];
		}
		return obj3;
	}

	var introJs = function (targetElm) {
		if (typeof (targetElm) === 'object') {
			//Ok, create a new instance
			return new IntroJs(targetElm);
		} else if (typeof (targetElm) === 'string') {
			//select the target element with query selector
			var targetElement = document.querySelector(targetElm);
			if (targetElement) {
				return new IntroJs(targetElement);
			} else {
				throw new Error('There is no element with given selector.');
			}
		} else {
			return new IntroJs(document.body);
		}
	};
	/**
	 * Current IntroJs version
	 *
	 * @property version
	 * @type String
	 */
	introJs.version = VERSION;
	//Prototype
	introJs.fn = IntroJs.prototype = {
		clone: function () {
			return new IntroJs(this);
		},
		setOption: function (option, value) {
			this._options[option] = value;
			return this;
		},
		setOptions: function (options) {
			this._options = _mergeOptions(this._options, options);
			return this;
		},
		start: function () {
			_introForElement.call(this, this._targetElement);
			return this;
		},
		goToStep: function (step) {
			_goToStep.call(this, step);
			return this;
		},
		nextStep: function () {
			_nextStep.call(this);
			return this;
		},
		previousStep: function () {
			_previousStep.call(this);
			return this;
		},
		exit: function () {
			_exitIntro.call(this, this._targetElement);
			return this;
		},
		refresh: function () {
			_setHelperLayerPosition.call(this, document.querySelector('.introjs-helperLayer'));
			_setHelperLayerPosition.call(this, document.querySelector('.introjs-tooltipReferenceLayer'));
			return this;
		},
		onbeforechange: function (providedCallback) {
			if (typeof (providedCallback) === 'function') {
				this._introBeforeChangeCallback = providedCallback;
			} else {
				throw new Error('Provided callback for onbeforechange was not a function');
			}
			return this;
		},
		onchange: function (providedCallback) {
			if (typeof (providedCallback) === 'function') {
				this._introChangeCallback = providedCallback;
			} else {
				throw new Error('Provided callback for onchange was not a function.');
			}
			return this;
		},
		onafterchange: function (providedCallback) {
			if (typeof (providedCallback) === 'function') {
				this._introAfterChangeCallback = providedCallback;
			} else {
				throw new Error('Provided callback for onafterchange was not a function');
			}
			return this;
		},
		oncomplete: function (providedCallback) {
			if (typeof (providedCallback) === 'function') {
				this._introCompleteCallback = providedCallback;
			} else {
				throw new Error('Provided callback for oncomplete was not a function.');
			}
			return this;
		},
		onexit: function (providedCallback) {
			if (typeof (providedCallback) === 'function') {
				this._introExitCallback = providedCallback;
			} else {
				throw new Error('Provided callback for onexit was not a function.');
			}
			return this;
		}
	};
	exports.introJs = introJs;
	return introJs;
}));
;
/* globals jQuery */
jQuery.fn.extend({
	getPath: function () {
		"use strict";
		var path;
		var node = this;
		/*Include only names and IDs since you can always programmatically add/remove classes*/
		var uniqueTags = ['name', 'id'];
		while (node.length) {
			var realNode = node[0], name = realNode.localName;
			if (!name) {
				break;
			}
			name = name.toLowerCase();
			var parent = node.parent();
			for (var i = uniqueTags.length - 1; i >= 0; i--) {
				var tag = uniqueTags[i];
				var tagValue = node.attr(tag);
				if (tagValue && (tagValue.trim !== '')) {
					name += '[' + tag + '=\"' + tagValue + '\"]';
				}
			}
			var sameTagSiblings = parent.children(name);
			//As soon as you know you have sibling nodes, use nth-of-type so you can better find a unique match
			if (sameTagSiblings.length > 1) {
				var allSiblings = parent.children();
				var index = allSiblings.index(realNode) + 1;
				name += ':nth-child(' + index + ')';
			}
			path = name + (path ? '>' + path : '');
			node = parent;
		}
		return path;
	}
});
;
/*!
 * jquery.event.drag - v 2.2
 * Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
 * Open Source MIT License - http://threedubmedia.com/code/license
 */
// Created: 2008-06-04
// Updated: 2012-05-21
// REQUIRES: jquery 1.7.x
;
(function ($) {

// add the jquery instance method
	$.fn.drag = function (str, arg, opts) {
		// figure out the event type
		var type = typeof str == "string" ? str : "",
		// figure out the event handler...
			fn = $.isFunction(str) ? str : $.isFunction(arg) ? arg : null;
		// fix the event type
		if (type.indexOf("drag") !== 0)
			type = "drag" + type;
		// were options passed
		opts = ( str == fn ? arg : opts ) || {};
		// trigger or bind event handler
		return fn ? this.bind(type, opts, fn) : this.trigger(type);
	};
// local refs (increase compression)
	var $event = $.event,
		$special = $event.special,
// configure the drag special event
		drag = $special.drag = {
			// these are the default settings
			defaults: {
				which: 1, // mouse button pressed to start drag sequence
				distance: 0, // distance dragged before dragstart
				not: ':input', // selector to suppress dragging on target elements
				handle: null, // selector to match handle target elements
				relative: false, // true to use "position", false to use "offset"
				drop: true, // false to suppress drop events, true or selector to allow
				click: false // false to suppress click events after dragend (no proxy)
			},
			// the key name for stored drag data
			datakey: "dragdata",
			// prevent bubbling for better performance
			noBubble: true,
			// count bound related events
			add: function (obj) {
				// read the interaction data
				var data = $.data(this, drag.datakey),
				// read any passed options
					opts = obj.data || {};
				// count another realted event
				data.related += 1;
				// extend data options bound with this event
				// don't iterate "opts" in case it is a node
				$.each(drag.defaults, function (key, def) {
					if (opts[key] !== undefined)
						data[key] = opts[key];
				});
			},
			// forget unbound related events
			remove: function () {
				$.data(this, drag.datakey).related -= 1;
			},
			// configure interaction, capture settings
			setup: function () {
				// check for related events
				if ($.data(this, drag.datakey))
					return;
				// initialize the drag data with copied defaults
				var data = $.extend({related: 0}, drag.defaults);
				// store the interaction data
				$.data(this, drag.datakey, data);
				// bind the mousedown event, which starts drag interactions
				$event.add(this, "touchstart mousedown", drag.init, data);
				// prevent image dragging in IE...
				if (this.attachEvent)
					this.attachEvent("ondragstart", drag.dontstart);
			},
			// destroy configured interaction
			teardown: function () {
				var data = $.data(this, drag.datakey) || {};
				// check for related events
				if (data.related)
					return;
				// remove the stored data
				$.removeData(this, drag.datakey);
				// remove the mousedown event
				$event.remove(this, "touchstart mousedown", drag.init);
				// enable text selection
				drag.textselect(true);
				// un-prevent image dragging in IE...
				if (this.detachEvent)
					this.detachEvent("ondragstart", drag.dontstart);
			},
			// initialize the interaction
			init: function (event) {
				// sorry, only one touch at a time
				if (drag.touched)
					return;
				// the drag/drop interaction data
				var dd = event.data, results;
				// check the which directive
				if (event.which != 0 && dd.which > 0 && event.which != dd.which)
					return;
				// check for suppressed selector
				if ($(event.target).is(dd.not))
					return;
				// check for handle selector
				if (dd.handle && !$(event.target).closest(dd.handle, event.currentTarget).length)
					return;
				drag.touched = event.type == 'touchstart' ? this : null;
				dd.propagates = 1;
				dd.mousedown = this;
				dd.interactions = [drag.interaction(this, dd)];
				dd.target = event.target;
				dd.pageX = event.pageX;
				dd.pageY = event.pageY;
				dd.dragging = null;
				// handle draginit event...
				results = drag.hijack(event, "draginit", dd);
				// early cancel
				if (!dd.propagates)
					return;
				// flatten the result set
				results = drag.flatten(results);
				// insert new interaction elements
				if (results && results.length) {
					dd.interactions = [];
					$.each(results, function () {
						dd.interactions.push(drag.interaction(this, dd));
					});
				}
				// remember how many interactions are propagating
				dd.propagates = dd.interactions.length;
				// locate and init the drop targets
				if (dd.drop !== false && $special.drop)
					$special.drop.handler(event, dd);
				// disable text selection
				drag.textselect(false);
				// bind additional events...
				if (drag.touched)
					$event.add(drag.touched, "touchmove touchend", drag.handler, dd);
				else
					$event.add(document, "mousemove mouseup", drag.handler, dd);
				// helps prevent text selection or scrolling
				if (!drag.touched || dd.live)
					return false;
			},
			// returns an interaction object
			interaction: function (elem, dd) {
				var offset = $(elem)[dd.relative ? "position" : "offset"]() || {top: 0, left: 0};
				return {
					drag: elem,
					callback: new drag.callback(),
					droppable: [],
					offset: offset
				};
			},
			// handle drag-releatd DOM events
			handler: function (event) {
				// read the data before hijacking anything
				var dd = event.data;
				// handle various events
				switch (event.type) {
					// mousemove, check distance, start dragging
					case !dd.dragging && 'touchmove':
						event.preventDefault();
					case !dd.dragging && 'mousemove':
						//  drag tolerance, x� + y� = distance�
						if (Math.pow(event.pageX - dd.pageX, 2) + Math.pow(event.pageY - dd.pageY, 2) < Math.pow(dd.distance, 2))
							break; // distance tolerance not reached
						event.target = dd.target; // force target from "mousedown" event (fix distance issue)
						drag.hijack(event, "dragstart", dd); // trigger "dragstart"
						if (dd.propagates) // "dragstart" not rejected
							dd.dragging = true; // activate interaction
					// mousemove, dragging
					case 'touchmove':
						event.preventDefault();
					case 'mousemove':
						if (dd.dragging) {
							// trigger "drag"
							drag.hijack(event, "drag", dd);
							if (dd.propagates) {
								// manage drop events
								if (dd.drop !== false && $special.drop)
									$special.drop.handler(event, dd); // "dropstart", "dropend"
								break; // "drag" not rejected, stop
							}
							event.type = "mouseup"; // helps "drop" handler behave
						}
					// mouseup, stop dragging
					case 'touchend':
					case 'mouseup':
					default:
						if (drag.touched)
							$event.remove(drag.touched, "touchmove touchend", drag.handler); // remove touch events
						else
							$event.remove(document, "mousemove mouseup", drag.handler); // remove page events
						if (dd.dragging) {
							if (dd.drop !== false && $special.drop)
								$special.drop.handler(event, dd); // "drop"
							drag.hijack(event, "dragend", dd); // trigger "dragend"
						}
						drag.textselect(true); // enable text selection
						// if suppressing click events...
						if (dd.click === false && dd.dragging)
							$.data(dd.mousedown, "suppress.click", new Date().getTime() + 5);
						dd.dragging = drag.touched = false; // deactivate element
						break;
				}
			},
			// re-use event object for custom events
			hijack: function (event, type, dd, x, elem) {
				// not configured
				if (!dd)
					return;
				// remember the original event and type
				var orig = {event: event.originalEvent, type: event.type},
				// is the event drag related or drog related?
					mode = type.indexOf("drop") ? "drag" : "drop",
				// iteration vars
					result, i = x || 0, ia, $elems, callback,
					len = !isNaN(x) ? x : dd.interactions.length;
				// modify the event type
				event.type = type;
				// remove the original event
				event.originalEvent = null;
				// initialize the results
				dd.results = [];
				// handle each interacted element
				do if (ia = dd.interactions[i]) {
					// validate the interaction
					if (type !== "dragend" && ia.cancelled)
						continue;
					// set the dragdrop properties on the event object
					callback = drag.properties(event, dd, ia);
					// prepare for more results
					ia.results = [];
					// handle each element
					$(elem || ia[mode] || dd.droppable).each(function (p, subject) {
						// identify drag or drop targets individually
						callback.target = subject;
						// force propagtion of the custom event
						event.isPropagationStopped = function () {
							return false;
						};
						// handle the event
						result = subject ? $event.dispatch.call(subject, event, callback) : null;
						// stop the drag interaction for this element
						if (result === false) {
							if (mode == "drag") {
								ia.cancelled = true;
								dd.propagates -= 1;
							}
							if (type == "drop") {
								ia[mode][p] = null;
							}
						}
						// assign any dropinit elements
						else if (type == "dropinit")
							ia.droppable.push(drag.element(result) || subject);
						// accept a returned proxy element
						if (type == "dragstart")
							ia.proxy = $(drag.element(result) || ia.drag)[0];
						// remember this result
						ia.results.push(result);
						// forget the event result, for recycling
						delete event.result;
						// break on cancelled handler
						if (type !== "dropinit")
							return result;
					});
					// flatten the results
					dd.results[i] = drag.flatten(ia.results);
					// accept a set of valid drop targets
					if (type == "dropinit")
						ia.droppable = drag.flatten(ia.droppable);
					// locate drop targets
					if (type == "dragstart" && !ia.cancelled)
						callback.update();
				}
				while (++i < len)
				// restore the original event & type
				event.type = orig.type;
				event.originalEvent = orig.event;
				// return all handler results
				return drag.flatten(dd.results);
			},
			// extend the callback object with drag/drop properties...
			properties: function (event, dd, ia) {
				var obj = ia.callback;
				// elements
				obj.drag = ia.drag;
				obj.proxy = ia.proxy || ia.drag;
				// starting mouse position
				obj.startX = dd.pageX;
				obj.startY = dd.pageY;
				// current distance dragged
				obj.deltaX = event.pageX - dd.pageX;
				obj.deltaY = event.pageY - dd.pageY;
				// original element position
				obj.originalX = ia.offset.left;
				obj.originalY = ia.offset.top;
				// adjusted element position
				obj.offsetX = obj.originalX + obj.deltaX;
				obj.offsetY = obj.originalY + obj.deltaY;
				// assign the drop targets information
				obj.drop = drag.flatten(( ia.drop || [] ).slice());
				obj.available = drag.flatten(( ia.droppable || [] ).slice());
				return obj;
			},
			// determine is the argument is an element or jquery instance
			element: function (arg) {
				if (arg && ( arg.jquery || arg.nodeType == 1 ))
					return arg;
			},
			// flatten nested jquery objects and arrays into a single dimension array
			flatten: function (arr) {
				return $.map(arr, function (member) {
					return member && member.jquery ? $.makeArray(member) :
						member && member.length ? drag.flatten(member) : member;
				});
			},
			// toggles text selection attributes ON (true) or OFF (false)
			textselect: function (bool) {
				$(document)[bool ? "unbind" : "bind"]("selectstart", drag.dontstart)
					.css("MozUserSelect", bool ? "" : "none");
				// .attr("unselectable", bool ? "off" : "on" )
				document.unselectable = bool ? "off" : "on";
			},
			// suppress "selectstart" and "ondragstart" events
			dontstart: function () {
				return false;
			},
			// a callback instance contructor
			callback: function () {
			}
		};
// callback methods
	drag.callback.prototype = {
		update: function () {
			if ($special.drop && this.available.length)
				$.each(this.available, function (i) {
					$special.drop.locate(this, i);
				});
		}
	};
// patch $.event.$dispatch to allow suppressing clicks
	var $dispatch = $event.dispatch;
	$event.dispatch = function (event) {
		if ($.data(this, "suppress." + event.type) - new Date().getTime() > 0) {
			$.removeData(this, "suppress." + event.type);
			return;
		}
		return $dispatch.apply(this, arguments);
	};
// event fix hooks for touch events...
	var touchHooks =
		$event.fixHooks.touchstart =
			$event.fixHooks.touchmove =
				$event.fixHooks.touchend =
					$event.fixHooks.touchcancel = {
						props: "clientX clientY pageX pageY screenX screenY".split(" "),
						filter: function (event, orig) {
							if (orig) {
								var touched = ( orig.touches && orig.touches[0] )
									|| ( orig.changedTouches && orig.changedTouches[0] )
									|| null;
								// iOS webkit: touchstart, touchmove, touchend
								if (touched)
									$.each(touchHooks.props, function (i, prop) {
										event[prop] = touched[prop];
									});
							}
							return event;
						}
					};
// share the same special event configuration with related events...
	$special.draginit = $special.dragstart = $special.dragend = drag;
})(jQuery);
;
/* globals jQuery, jQueryDragSelector, window, WebHelpTemplates, introJs, setTimeout, setInterval, localStorage, TableList */
var WebHelp;
WebHelp = (function () {
	"use strict";
	function WebHelp(WebHelpOptions) {
		//setup defaults
		var defaultOptions = {
			appName: 'DefaultApp',
			mode: 'consume',
			helpIconPosition: '.ai-header .ai-header-title',
			showIntroOnLoad: false,
			usesFontAwesome: false,
			parameters: this.getWindowParameters(),
			ui: {},
			sequences: {},
			sequencesBaseUrl: '/WebHelp/',
			visitedBaseUrl: '/weblications/etc/getPrefs.epl',
			usesFlexbox: false
		};
		if (!WebHelpOptions) {
			WebHelpOptions = defaultOptions;
		}
		for (var option in defaultOptions) {
			if (!defaultOptions.hasOwnProperty(option)) {
				continue;
			}
			this[option] = WebHelpOptions.hasOwnProperty(option) ? WebHelpOptions[option] : defaultOptions[option];
		}
		this.webHelpName = 'WebHelp.' + this.appName;
		//setup icon classes
		if (this.usesFontAwesome === true) {
			this.iconClass = {
				"remove": "fa fa-times",
				"play": "fa fa-play-circle-o",
				"save": "fa fa-floppy-o",
				"clear": "fa fa-refresh",
				"new": "fa fa-plus",
				"add": "fa fa-plus",
				"info": "fa fa-info-circle",
				"edit": "fa fa-edit",
				"upload": "fa fa-upload",
				"next": "fa fa-arrow-circle-right",
				"prev": "fa fa-arrow-circle-left",
				"done": "fa fa-times-circle"
			};
		} else { //default to bootstrap
			this.iconClass = {
				"remove": "glyphicon glyphicon-remove",
				"play": "glyphicon glyphicon-play-circle",
				"new": "glyphicon glyphicon-plus",
				"save": "glyphicon glyphicon-floppy-disk",
				"clear": "glyphicon glyphicon-refresh",
				"add": "glyphicon glyphicon-plus",
				"info": "glyphicon glyphicon-info-sign",
				"edit": "glyphicon glyphicon-edit",
				"upload": "glyphicon glyphicon-upload",
				"next": "glyphicon glyphicon-circle-arrow-right",
				"prev": "glyphicon glyphicon-circle-arrow-left",
				"done": "glyphicon glyphicon-remove-sign"
			};
		}
		this.defaultIntroJsOptions = {
			nextLabel: '<span class=\"' + this.iconClass.next + '\"></span> Next',
			prevLabel: '<span class=\"' + this.iconClass.prev + '\"></span> Previous',
			skipLabel: '<span class=\"' + this.iconClass.done + '\"></span> Close',
			doneLabel: '<span class=\"' + this.iconClass.done + '\"></span> Done'
		};
		//build the gui
		if (this.parameters.create !== undefined) {
			this.mode = "create";
			this.showHelpCreationMode();
		} else {
			this.mode = "consume";
			this.showHelpConsumptionMode();
		}
		this.bindPlayEditButtons();
	}

	//detect jquery params
	WebHelp.prototype.getWindowParameters = function () {
		// This function is anonymous, is executed immediately and
		// the return value is assigned to QueryString!
		var query_string = {};
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			// If first entry with this name
			if (typeof query_string[pair[0]] === "undefined") {
				query_string[pair[0]] = pair[1];
				// If second entry with this name
			} else if (typeof query_string[pair[0]] === "string") {
				query_string[pair[0]] = [query_string[pair[0]], pair[1]];
				// If third or later entry with this name
			} else {
				query_string[pair[0]].push(pair[1]);
			}
		}
		return query_string;
	};
	WebHelp.prototype.bindPlayEditButtons = function () {
		var self = this;
		//attach sequence specific handlers
		this.ui.webHelpMainContent.on('click', '.play-sequence', this.playThisSequence.bind(self));
		this.ui.webHelpMainContent.on('click', '.edit-sequence', this.editThisSequence.bind(self));
		this.ui.webHelpMainContent.on('click', '.remove-sequence', this.removeThisSequence.bind(self));
	};
	WebHelp.prototype.showSequences = function () {
		jQuery('#contentConsumptionModal').modal('show');
	};
	WebHelp.prototype.addHelpIcon = function (navbarButtonElement, addTextToNavbar) {
		var self = this;
		if (!navbarButtonElement) {
			navbarButtonElement = this.helpIconPosition;
		}
		var dropdownButtonHtml = '<button class="btn light" id="contentConsumptionNavButton" >' +
			'<i class="' + this.iconClass.info + '"></i>';
		if (addTextToNavbar) {
			dropdownButtonHtml += 'App Help';
		}
		dropdownButtonHtml += '</button>';
		this.ui.webHelpButton = jQuery(dropdownButtonHtml);
		//Add to navbar if need be
		if ((jQuery('.ai-navbar').length > 0) && (jQuery(navbarButtonElement + ':last-of-type').hasClass('nav-right'))) {
			jQuery(navbarButtonElement + ':last-of-type').after(this.ui.webHelpButton);
			this.ui.webHelpButton.addClass('nav-right');
		} else {
			jQuery(navbarButtonElement).after(this.ui.webHelpButton);
		}
		this.ui.webHelpButton.on('click', function (event) {
			event.preventDefault();
			self.showSequences();
		});
		this.ui.webHelpButton.attr('title', 'App Help');
	};
	WebHelp.prototype.showHelpConsumptionMode = function () {
		this.addHelpIcon(this.helpIconPosition);
		this.ui.webHelpMainContent = jQuery("#webHelpMainContent");
		if (this.ui.webHelpMainContent.length <= 0) {
			var modalContent = jQuery(WebHelpTemplates.WebHelpContent);
			var webHelpContent = jQuery(WebHelpTemplates.WebHelpConsumption);
			this.attachIcons();
			var $body = jQuery("body");
			$body.append(modalContent);
			$body.append(webHelpContent);
			this.ui.webHelpMainContent = jQuery("#webHelpMainContent");
		}
		this.ui.webHelpMainContent.appendTo("#contentConsumptionModal .modal-body");
		jQuery('.nav-tabs a[href=#addSequence]').hide();
		jQuery('#globalWebHelpCreatorActionsWell').hide();
		this.refreshWhatsNew();
		this.populateCurrentSequences();
		var self = this;
		this.watchWhatsNew = setInterval(function () {
			self.refreshWhatsNew();
		}, 1800000);
		if (this.showIntroOnLoad) {
			var introSeqId = this.getSeqIdForSequence('Introduction');
			if (introSeqId && !this.isThisSequenceSeen(introSeqId)) {
				this.playSequence('Introduction');
			}
		}
	};
	WebHelp.prototype.showHelpCreationMode = function () {
		var self = this;
		this.ui.webHelpMainContent = jQuery("#webHelpMainContent");
		if (this.ui.webHelpMainContent.length === 0) {
			var webHelpContent = jQuery(WebHelpTemplates.WebHelpCreator);
			jQuery("body").append(webHelpContent);
			this.ui.webHelpMainContent = jQuery("#webHelpMainContent");
		}
		var sidebarToggleButton = jQuery(WebHelpTemplates.WebHelpSidebarToggle);
		this.ui.webHelpMainContent
			.addClass('creationModeSidebar')
			.addClass('hideSidebar')
			.append(sidebarToggleButton)
			.children(':not(#creationModeSidebarshowHideSpan)').hide();
		this.ui.sidebarToggleButton = jQuery('#creationModeSidebarshowHideSpan');
		this.ui.sidebarToggleButton.on('click', function () {
			if (self.ui.webHelpMainContent.hasClass('hideSidebar')) {
				self.ui.webHelpMainContent.children(':not(#creationModeSidebarshowHideSpan)').show('slow', function () {
					self.ui.webHelpMainContent.removeClass('hideSidebar', 300);
				});
			} else {
				self.ui.webHelpMainContent.children(':not(#creationModeSidebarshowHideSpan)').hide('slow', function () {
					self.ui.webHelpMainContent.addClass('hideSidebar', 300);
				});
			}
		});
		this.stepsTable = new TableList({
			element: "#stepsTable",
			useData: false, //Create one generic step
			listTemplate: 'WebHelpSequenceCreationList',
			listItemTemplate: 'WebHelpSequenceStepListItem',
			searchable: false,
			sortable: true,
			status: "N"
		});
		this.initScratchPadTable();
		jQuery('.nav-tabs a[href=#addSequence]').trigger('click');
		//attach event handlers to webHelpContent
		jQuery("#sequencePreviewButton").on("click", this.preview.bind(self));
		jQuery("#sequenceSaveButton").on("click", this.saveSequence.bind(self));
		jQuery("#clearStepsButton").on("click", this.clearStepsInSequence.bind(self));
		jQuery("#startDragDropButton").on("click", this.startSelectionOfElement.bind(self));
		jQuery("#startEmptyStepButton").on("click", this.createStepForThisElement.bind(self));
		jQuery("#cancelDragDropButton").on("click", jQueryDragSelector.off);
		jQuery("#noElementsSelectedButton").on("click", jQuery('#noElementsSelectedDiv').hide);
		jQuery("#noStepsInPreviewButton").on("click", jQuery('#noStepsInPreviewDiv').hide);
		jQuery("#saveAllHelpSequencesToFileButton").on("click", this.saveAllHelpSequencesToFile.bind(self));
		window.onbeforeunload = function (e) {
			var scratchPadData = self.scratchPadTable.getData();
			if (scratchPadData.length > 0) {
				var message = "You have unsaved changes in your scratchpad!";
				var err = e || window.event;
				// For IE and Firefox
				if (err) {
					err.returnValue = message;
				}
				// For Safari
				return message;
			}
		};
		jQuery(this.stepsTable.element).on("click", ".remove-step", this.removeThisStep.bind(self));
		this.attachIcons();
		var helpIconElement = jQuery(this.helpIconPosition);
		var currentTitleHTML = helpIconElement.html();
		currentTitleHTML += "[Edit mode]";
		var elem;
		if (helpIconElement && helpIconElement.length > 1) {
			elem = helpIconElement[0];
		} else {
			elem = helpIconElement;
		}
		jQuery(elem).html(currentTitleHTML);
		this.refreshAllSequences();
		this.populateCurrentSequences();
	};
	WebHelp.prototype.attachIcons = function () {
		for (var icon in this.iconClass) {
			if (this.iconClass.hasOwnProperty(icon)) {
				this.ui.webHelpMainContent.find(".iconClass-" + icon).removeClass(this.iconClass[icon]).addClass(this.iconClass[icon]);
			}
		}
	};
	WebHelp.prototype.saveAllHelpSequencesToFile = function () {
		//get required data
		//Pretty print the JSON content
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
		//Syntax: JSON.stringify(value[, replacer[, space]])
		var allSequences = this.sequences;
		jQuery.map(allSequences, function (val) {
			val.status = "O";
		});
		var content = JSON.stringify(allSequences, null, '\t');
		var link = document.createElement('a'); //create a hyperlink
		var mimeType = 'application/json';
		//set attributes on top of the link
		link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(content));
		link.setAttribute('download', this.webHelpName + '.json');
		//trigger the download
		link.click();
		//destroy the link
		//TODO The line below to remove child breaks, check why
		//link.parentNode.removeChild(link);
		this.updateNewSequencesTable([]);
	};
	WebHelp.prototype.refreshWhatsNew = function () {
		this.refreshAllSequences();
		var sequences = this.sequences; //new function
		var seenSequences = this.getAllVisitedSequences(); //new function
		var newSequences = [];
		for (var seqName in sequences) {
			if (sequences.hasOwnProperty(seqName)) {
				var seq = sequences[seqName];
				if (seq.visible !== undefined && seq.visible === false) {
					continue;
				}
				var seqId = seq.seqId.toString();
				if (seenSequences.indexOf(seqId) >= 0) {
					//jQuery(this.availableSequencesTable.element).find
				} else {
					newSequences.push(seq);
				}
			}
		}
		this.updateNewSequencesTable(newSequences); // new function
		if (newSequences.length >= 1) {
			this.populateCurrentSequences();
		}
		//update badge icon
		var numOfNewSequences = newSequences.length;
		if (this.mode !== "create") {
			if (numOfNewSequences > 0) {
				this.ui.webHelpButton.attr('data-badge', numOfNewSequences + ' new');
			} else {
				this.ui.webHelpButton.removeAttr('data-badge');
			}
		}
	};
	WebHelp.prototype.populateCurrentSequences = function () {
		var retrievedSequences = this.sequences;
		jQuery.map(retrievedSequences, function (val) {
			if (val.status === "E") {
				delete retrievedSequences[val];
			}
		});
		if (retrievedSequences) {
			var sequenceData = [];
			var self = this;
			var supplementalClasses = []; //Array of classes to add to each row if we want
			jQuery.each(retrievedSequences, function (sequenceTitle, sequenceContent) {
				if (sequenceContent.visible !== undefined && sequenceContent.visible === false) {
					return true; //continue
				}
				sequenceData.push([
					'', //play
					sequenceTitle, //title
					'',//edit
					'',//remove
					JSON.stringify(sequenceContent)//content
				]);
				if (self.isThisSequenceSeen(sequenceContent.seqId)) {
					supplementalClasses.push('seen');
				} else {
					supplementalClasses.push('unseen');
				}
			});
			this.availableSequencesTable = new TableList({
				element: '#availableSequencesContent',
				data: sequenceData,
				listTemplate: 'WebHelpSequenceConsumptionList',
				listItemTemplate: 'WebHelpSequenceListItem',
				supplementalClasses: supplementalClasses
			});
			this.attachIcons();
			this.attachClickActionsToLists();
		}
	};
	WebHelp.prototype.attachClickActionsToLists = function () {
		var self = this;
		if (self.mode !== 'create') {
			this.ui.webHelpMainContent.find('div.iconClass-play').parents('li.webHelpSequenceList:not(.header)').attr('title', 'Play!').unbind('click').on('click', self.playThisSequence.bind(self));
		} else {
			this.ui.webHelpMainContent.find('div.iconClass-play').attr('title', 'Play!').unbind('click').on('click', self.playThisSequence.bind(self));
		}
		this.ui.webHelpMainContent.find('div.iconClass-edit').attr('title', 'Edit').unbind('click').on('click', self.editThisSequence.bind(self));
		this.ui.webHelpMainContent.find('div.iconClass-remove').attr('title', 'Delete').unbind('click').on('click', self.removeThisSequence.bind(self));
	};
	WebHelp.prototype.startSelectionOfElement = function () {
		var self = this;
		/* Close the sidemenu if it is open*/
		this.ui.sidebarToggleButton.trigger('click');
		jQueryDragSelector.setPaneState(true);
		jQueryDragSelector.on(function (selectionDetails) {
			var element = selectionDetails.$element;
			if (selectionDetails.iframeAttributes) {
				element = selectionDetails.iframeAttributes.$body.find(selectionDetails.$element);
			}
			if (element) {
				element.popover({
					html: true,
					trigger: 'manual',
					placement: 'auto top',
					container: 'body', /*Show on top of all elements*/
					content: WebHelpTemplates.WebHelpSelectPopup
				}).popover('show');
				jQuery(".drag-select-yes").on("click", function () {
					jQueryDragSelector.confirmSelection(true, element, function (arrayOfObjects) {
						if (arrayOfObjects) {
							self.createStepForThisElement(arrayOfObjects, selectionDetails);
						}
					});
					self.ui.sidebarToggleButton.trigger('click');
				}.bind(self));
				jQuery(".drag-select-no").on("click", function () {
					jQueryDragSelector.confirmSelection(false, element);
					self.ui.sidebarToggleButton.trigger('click');
				});
			} else {
				jQuery('#noElementsSelectedDiv').show();
				self.ui.sidebarToggleButton.trigger('click');
			}
		});
		jQuery("#startDragDropButton").tooltip({
			trigger: 'manual'
		}).tooltip("show");
		setTimeout(function () {
			jQuery("#startDragDropButton").tooltip('hide');
		}, 3000);
	};
	WebHelp.prototype.createStepForThisElement = function (arrayOfElems, selectionDetails) {
		var self = this;
		var $stepsTable = jQuery("#stepsTable");
		var elemText = "";
		var elemType = "";
		if (arrayOfElems) {
			for (var i = 0; i < arrayOfElems.length; i++) {
				elemText += arrayOfElems[i].value;
				if (selectionDetails.iframeAttributes) {
					elemText += '~' + selectionDetails.iframeAttributes.$frame.id;
				}
				elemText += "&";
				elemType += arrayOfElems[i].attribute + "&";
			}
			this.stepsTable.addRow([
				"",
				"Editable title",
				elemType,
				elemText,
				"Editable content"]);
		} else {
			this.stepsTable.addRow();
		}
		$stepsTable.find('.remove-step').unbind('click');
		$stepsTable.find('.remove-step').on('click', function () {
			self.removeThisStep.bind(self);
		});
		this.attachIcons();
	};
	WebHelp.prototype.removeThisStep = function (event) {
		this.stepsTable.removeRow(event);
		if (!this.stepsTable.numRows()) {
			this.stepsTable.addRow();
			this.attachIcons();
		}
	};
	WebHelp.prototype.preview = function () {
		var previewSteps = this.getCurrentTablePreviewSteps();
		if (previewSteps) {
			var introJsObj = introJs();
			for (var i = previewSteps.length - 1; i >= 0; i --) {
				var thisStep = previewSteps[i];
				if (thisStep.iframeId) {
					thisStep.element = jQuery('#' + thisStep.iframeId).contents().find(thisStep.element).get(0);
				}
			}
			var options = {
				steps: previewSteps,
				showProgress: true,
				showBullets: false,
				tooltipPosition: 'auto'
			};
			for (var option in this.defaultIntroJsOptions) {
				if (this.defaultIntroJsOptions.hasOwnProperty(option)) {
					options[option] = this.defaultIntroJsOptions[option];
				}
			}
			introJsObj.setOptions(options);
			this.ui.sidebarToggleButton.trigger('click'); //Close the side menu
			setTimeout(function () {
				introJsObj.start();
			}, 500);
		}
		var saveStatus = 'Sequence saved successfully!';
		try {
			localStorage.setItem(this.webHelpName, JSON.stringify(this.sequences));
		} catch (error) {
			saveStatus = 'Error saving the sequence!';
		} finally {
			var $showSequenceSavedSuccessAlert = jQuery('#showSequenceSavedSuccessAlert');
			$showSequenceSavedSuccessAlert.html(saveStatus).show();
			setTimeout(function () {
				$showSequenceSavedSuccessAlert.hide();
			}, 1000);
		}
	};
	WebHelp.prototype.saveSequence = function () {
		var saveStatus = 'Sequence saved successfully!';
		try {
			var sequenceTitle = jQuery("#sequenceTitleSetter").val().trim();
			var stepsToSave = this.getCurrentTablePreviewSteps();
			var sequences = this.sequences;
			var sequenceStatus = this.getCurrentTableStatus();
			if (sequenceStatus === "E") {
				var editedSeqId = this.getCurrentTableSeqId();
				jQuery.map(this.sequences, function (val, i) {
					if (val.seqId === editedSeqId) {
						delete sequences[i];
					}
				});
			}
			sequences[sequenceTitle] = {
				method: "saveSequence",
				seqId: new Date().getTime(),
				sequenceTitle: sequenceTitle,
				data: stepsToSave,
				tool: this.appName,
				status: sequenceStatus
			};
			// Populate scratchpad
			this.refreshScratchpad();
			this.populateCurrentSequences();
		} catch (error) {
			saveStatus = 'Error saving the sequence!';
		} finally {
			var $showSequenceSavedSuccessAlert = jQuery('#showSequenceSavedSuccessAlert');
			this.clearStepsInSequence();
			$showSequenceSavedSuccessAlert.html(saveStatus).show();
			setTimeout(function () {
				$showSequenceSavedSuccessAlert.hide();
			}, 2000);
		}
	};
	WebHelp.prototype.getCurrentTablePreviewSteps = function () {
		var rows = this.stepsTable.getData();
		if (rows.length <= 0) {
			jQuery('#noStepsInPreviewDiv').show();
			return false;
		}
		var previewSteps = [];
		for (var n = 0; n < rows.length; n++) {
			//escape ampersands (we may need other special characters in the content
			var attributeArray = rows[n][3].replace(/&/g, '').trim().split('~');
			var elemAttribVal = attributeArray[0];
			var iframeElementId = false;
			if (attributeArray.length > 1) {
				iframeElementId = attributeArray[1];
			}
			var elemAttribType = rows[n][2].replace(/&/g, '').trim();
			var stepTitle = rows[n][1];
			var content = rows[n][4];
			if (elemAttribVal) {
				var elem = "";
				if (elemAttribType !== 'CSSPath') {
					elem = "[" + elemAttribType + "=\'" + elemAttribVal.replace(/[&<>"'\/]/g, '').trim() + "\']";
				} else {
					elem = elemAttribVal;
				}
				previewSteps.push({
					element: elem,
					intro: '<div><h3>' + stepTitle + '</h3><p>' + content + '</p></div>',
					position: 'auto',
					iframeId: iframeElementId
				});
			} else {
				previewSteps.push({
					intro: '<div><h3>' + stepTitle + '</h3><p>' + content + '</p></div>'
				});
			}
		}
		return previewSteps;
	};
	WebHelp.prototype.getCurrentTableStatus = function () {
		return this.stepsTable.getStatus();
	};
	WebHelp.prototype.getCurrentTableSeqId = function () {
		return this.stepsTable.getSeqId();
	};
	WebHelp.prototype.genKey = function () {
		//return "WebHelp." + this.appName + "." + this.userName;
		/* Using preferences, so do not need the username in the key for now*/
		return "WebHelp." + this.appName;
	};
	// This function should be tied to the user and the app
	// Returns an array of sequence IDs of the visited sequences
	WebHelp.prototype.getAllVisitedSequences = function () {
		var userPrefs = {};
		jQuery.ajax({
			async: false,
			url: this.visitedBaseUrl,
			success: function (data) {
				data = data.split(/\r?\n/);
				for (var i = 0; i < data.length; i++) {
					var keyVal = data[i].split("\t");
					userPrefs[keyVal[0]] = keyVal[1];
				}
			}
		});
		var key = this.genKey();
		var seqIds = userPrefs[key];
		if (seqIds && seqIds.length > 0) {
			return seqIds.split(",");
		} else {
			return [];
		}
	};
	// This method returns back the seq id for a sequence with title
	WebHelp.prototype.getSeqIdForSequence = function (sequenceName) {
		var sequence = this.sequences[sequenceName];
		var seqId = sequence.seqId;
		return seqId;
	};
	// Given a seqId, check if the sequence has been previously seen or not
	WebHelp.prototype.isThisSequenceSeen = function (seqId) {
		var visitedSeqIds = this.getAllVisitedSequences();
		return visitedSeqIds.indexOf(seqId.toString()) >= 0;
	};
	// This method would mark the given sequence as seen
	WebHelp.prototype.markThisSequenceAsSeen = function (seqId) {
		var visitedSeqIds = this.getAllVisitedSequences();
		var key = this.genKey();
		var updatePreferences = false;
		if (visitedSeqIds.indexOf(seqId.toString()) < 0) {
			visitedSeqIds.push(seqId);
			updatePreferences = true;
		}
		if (updatePreferences) {
			this.setVisitedSequencesInUserPrefs(key, visitedSeqIds);
			this.refreshWhatsNew();
		}
	};
	WebHelp.prototype.setVisitedSequencesInUserPrefs = function (key, val) {
		var self = this;
		val = val.join(",");
		jQuery.ajax({
			type: "GET",
			url: "/weblications/etc/setPrefs.epl?" + key + "=" + val,
			success: function () {
				self.refreshWhatsNew(); // new function
			}
		});
	};
	// This table will remove and add new contents to the new sequences table
	WebHelp.prototype.updateNewSequencesTable = function (newSequences) {
		var aaData = [];
		jQuery.each(newSequences, function (index, element) {
			aaData.push([
				'', //play
				element.sequenceTitle, //title
				'',//edit
				'',//remove
				JSON.stringify(element)//content
			]);
		});
		if (this.mode === "consume") {
			this.initWhatsNewTable(aaData);
		} else {
			this.initScratchPadTable(aaData);
		}
	};
	WebHelp.prototype.refreshAllSequences = function (file) {
		var self = this;
		this.sequences = {};
		if (!file) {
			file = this.sequencesBaseUrl + this.webHelpName + '.json';
		}
		jQuery.ajax({
			url: file,
			xhrFields: {
				withCredentials: true
			},
			cache: false,
			type: 'GET',
			dataType: 'json',
			async: false,
			success: function (data) {
				self.sequences = data;
			},
			error: function () {
				throw new Error("Failed to load the sequences!");
			}
		});
	};
	WebHelp.prototype.refreshScratchpad = function () {
		var unsavedSequences = {};
		jQuery.map(this.sequences, function (val, i) {
			var status = val.status;
			if (status !== "O") {
				unsavedSequences[i] = val;
			}
		});
		this.updateNewSequencesTable(unsavedSequences);
	};
	WebHelp.prototype.initWhatsNewTable = function (aaData) {
		this.whatsNewTable = new TableList({
			element: '#whatsNewContent',
			data: aaData || [],
			listTemplate: 'WebHelpSequenceConsumptionList',
			listItemTemplate: 'WebHelpSequenceListItem',
			emptyListIndicator: 'All new help sequences viewed - Congratulations!'
		});
		this.attachIcons();
		this.attachClickActionsToLists();
	};
	WebHelp.prototype.initScratchPadTable = function (aaData) {
		this.scratchPadTable = new TableList({
			element: '#scratchpadContent',
			data: aaData || [],
			listTemplate: 'WebHelpSequenceConsumptionList',
			listItemTemplate: 'WebHelpSequenceListItem'
		});
	};
	WebHelp.prototype.clearStepsInSequence = function () {
		//Destroy and reinitialize the table to get the edited data
		this.stepsTable.renderList();
		this.attachIcons();
		jQuery("#sequenceTitleSetter").val("").attr("placeholder", "Sequence Title");
		this.stepsTable.setStatus("N");
	};
	WebHelp.prototype.playSequence = function (sequenceName) {
		var sequence = this.sequences[sequenceName];
		var seqId = sequence.seqId;
		var play = introJs();
		var options = {
			steps: sequence.data,
			showProgress: true,
			showBullets: false
		};
		for (var option in this.defaultIntroJsOptions) {
			if (this.defaultIntroJsOptions.hasOwnProperty(option)) {
				options[option] = this.defaultIntroJsOptions[option];
			}
		}
		play.setOptions(options);
		var self = this;
		self.ui.webHelpMainContent.hide();
		//Hacky workaround to introjs pushing fixed position elements into weird places while scrolling to play
		play.oncomplete(function () {
			self.ui.webHelpMainContent.show();
		});
		play.onexit(function () {
			self.ui.webHelpMainContent.show();
		});
		//Workaround for flexbox
		/*
		 * Flexbox elements are asynchronously rendered
		 * Therefore, the intro tooltip pushes them out of place,
		 * causing them to look distorted
		 *
		 * The remedy for this is to re-render the items that
		 * use flex display.
		 * Pure CSS was not able to remedy the issue.
		 * This solution is somewhat non-performant, but currently works
		 * TODO: find a more performant or pure CSS-based solution
		 * */
		if (self.usesFlexbox) {
			var $flexBoxItems = jQuery('body').children().filter(function (el) {
				return (jQuery(this).css('display') === 'flex');
			});
			if ($flexBoxItems.length) {
				play.onbeforechange(function () {
					$flexBoxItems.css('position', 'static');
				});
				play.onafterchange(function () {
					$flexBoxItems.css('position', 'relative');
				});
			}
		}
		if (jQuery('#contentConsumptionModal').is(':visible')) {
			jQuery('#contentConsumptionModal').modal('hide');
		}
		play.start();
		this.markThisSequenceAsSeen(seqId);
	};
	WebHelp.prototype.playThisSequence = function (event) {
		var sequenceName = jQuery(event.target).parents('li').find('.webHelpSequenceItem-title').text();
		this.playSequence(sequenceName);
	};
	WebHelp.prototype.editThisSequence = function (event) {
		var thisSequenceTitle = jQuery(event.target).parents('li').find('.webHelpSequenceItem-title').text();
		var sequence = this.sequences[thisSequenceTitle];
		var data = [];
		var seqId = sequence.seqId;
		jQuery.each(sequence.data, function (index, element) {
			var title = jQuery(element.intro).children('h3').text() || '';
			var text = jQuery(element.intro).children('p').text() || '';
			var elementId = element.element || '';
			elementId = elementId.replace(/(\[|\])/g, '');
			var elementAttr = elementId;
			if (elementId.split('#').length > 1) {
				elementId = elementId.split('#')[1];
			} else if (elementId.split('=').length > 1) {
				var splitArray = elementId.split('=');
				elementId = splitArray[1].replace(/\'/g, '');
				elementAttr = splitArray[0];
			}
			data.push([
				"",
				title,
				elementAttr,
				elementId,
				text
			]);
		});
		this.stepsTable.setData(data);
		this.stepsTable.setStatus("E");
		this.stepsTable.setSeqId(seqId);
		this.stepsTable.useData = true;
		this.stepsTable.renderList();
		this.attachIcons();
		this.stepsTable.useData = false;
		jQuery('#sequenceTitleSetter').val(thisSequenceTitle);
		jQuery('.nav-tabs a[href=#addSequence]').tab('show');
	};
	WebHelp.prototype.removeThisSequence = function (event) {
		var sequenceName = jQuery(event.target).parents('li').find('.webHelpSequenceItem-title').text();
		var storedSequences = this.sequences;
		delete storedSequences[sequenceName];
		this.populateCurrentSequences();
		this.refreshScratchpad();
	};
	return WebHelp;
})();
;
/* globals jQuery, WebHelpTemplates */
var TableList;
TableList = (function () {
	"use strict";
	function TableList(tableListOptions) {
		if (tableListOptions.element === undefined) {
			//console.error('TableList needs an element to work on');
			throw new Error('TableList needs an element to work on');
		}
		var defaultOptions = {
			element: '',
			expandable: true,
			searchable: true,
			sortable: false,
			emptyListIndicator: 'No data yet!',
			data: [],
			status: "N",
			seqId: null,
			useData: true,
			listTemplate: 'WebHelpSequenceConsumptionList',
			listItemTemplate: 'WebHelpSequenceStepListItem',
			searchListTemplate: 'WebHelpTableListSearch',
			supplementalClasses: []
		};
		for (var option in defaultOptions) {
			if (!defaultOptions.hasOwnProperty(option)) {
				continue;
			}
			this[option] = tableListOptions.hasOwnProperty(option) ? tableListOptions[option] : defaultOptions[option];
		}
		this.renderList();
		if (this.sortable) {
			this._makeSortable();
		}
	}

	TableList.prototype.renderList = function () {
		var $listTemplate = jQuery(WebHelpTemplates[this.listTemplate]);
		var $searchListTemplate = jQuery(WebHelpTemplates[this.searchListTemplate]);
		//If we have the list already, remove the data and re-render
		jQuery(this.element).children('.' + $listTemplate.attr('class')).remove();
		if (this.searchable) {
			jQuery(this.element).children('.' + $searchListTemplate.attr('class')).remove();
		}
		var listItemTemplate = WebHelpTemplates[this.listItemTemplate];
		if (this.useData) {
			var length = this.data.length;
			if (!length) {
				$listTemplate.html('<li class=\"webHelpEmptyListIndicator\">' + this.emptyListIndicator + '</li>');
				jQuery(this.element).append($listTemplate);
				return;
			}
			for (var i = 0; i < length; i++) {
				var thisRow = this.data[i];
				var $thisListItemTemplate = jQuery(listItemTemplate);
				var rowLength = thisRow.length;
				if (!rowLength) {
					continue;
				}
				for (var j = 0; j < rowLength; j++) {
					jQuery($thisListItemTemplate.find('div')[j]).html(thisRow[j]);
				}
				if (this.supplementalClasses.length > 0) {
					$thisListItemTemplate.addClass(this.supplementalClasses[i]);
				}
				$listTemplate.append($thisListItemTemplate);
			}
		} else {
			var $listItemTemplate = jQuery(listItemTemplate);
			$listTemplate.append($listItemTemplate);
		}
		//Attach default classes to the containers and the lists
		jQuery(this.element).addClass('tableListContainer');
		$listTemplate.addClass('tableList');
		if (this.searchable) {
			jQuery(this.element).append($searchListTemplate).append($listTemplate);
			$searchListTemplate.on('keyup', this._searchFunction.bind(this));
		} else {
			jQuery(this.element).append($listTemplate);
		}
	};
	TableList.prototype.addRow = function (rowData) {
		var $listTemplate = jQuery(WebHelpTemplates[this.listTemplate]);
		var $thisListItemTemplate = jQuery(WebHelpTemplates[this.listItemTemplate]);
		if (rowData) {
			var rowLength = rowData.length;
			if (!rowLength || rowLength !== $thisListItemTemplate.children('div').length) {
				throw new Error('Attempted to add a row without any data or with incorrect parameters');
			}
			for (var j = 0; j < rowLength; j++) {
				jQuery($thisListItemTemplate.find('div')[j]).html(rowData[j]);
			}
			$listTemplate.append($thisListItemTemplate);
		}
		jQuery(this.element)
			.children('.' + $listTemplate.attr('class'))
			.append($thisListItemTemplate);
	};
	TableList.prototype.removeRow = function (clickEvent) {
		jQuery(clickEvent.target).parents('li.webHelpSequenceStepListItem').remove();
	};
	TableList.prototype.numRows = function () {
		return jQuery(this.element).find('ul').find('li:not(.header)').length;
	};
	TableList.prototype.getData = function () {
		/*No data binding, we have to evaluate this lazily*/
		var listItems = jQuery(this.element).find('ul').find('li:not(.header):not(.webHelpEmptyListIndicator)');
		var length = listItems.length;
		var returnArray = [];
		for (var i = 0; i < length; i++) {
			var rowArray = [];
			var thisRow = jQuery(listItems[i]);
			var thisRowContents = jQuery(thisRow).find('div');
			var rowElementLength = thisRowContents.length;
			for (var j = 0; j < rowElementLength; j++) {
				rowArray.push(jQuery(thisRowContents[j]).text());
				//Use text, otherwise ampersands and special characters will not be escaped
			}
			returnArray.push(rowArray);
		}
		return returnArray;
	};
	TableList.prototype._searchFunction = function () {
		var $listItems = jQuery(this.element).find('.' + jQuery(WebHelpTemplates[this.listTemplate]).attr('class')).find('li:not(.header)');
		var $searchBox = jQuery(this.element).find('.' + jQuery(WebHelpTemplates[this.searchListTemplate]).attr('class')).find('input');
		var val = $searchBox.val().trim();
		var text;
		$listItems.show().addClass('searchResults').filter(function () {
			text = jQuery(this).text().replace(/\s+/g, ' ');
			return !_fuzzySearch(text, val);
		}).hide();
	};
	TableList.prototype.setData = function (givenData) {
		this.data = givenData;
	};
	TableList.prototype.setStatus = function (status) {
		this.status = status;
	};
	TableList.prototype.getStatus = function () {
		return this.status;
	};
	TableList.prototype.setSeqId = function (seqId) {
		this.seqId = seqId;
	};
	TableList.prototype.getSeqId = function () {
		return this.seqId;
	};
	TableList.prototype._makeSortable = function () {
		var $thisList = jQuery(this.element).find('.' + jQuery(WebHelpTemplates[this.listTemplate]).attr('class')); //Finds
	                                                                                                              // the
	                                                                                                              // list
		$thisList.sortable({
			items: 'li:not(.header)',
			cancel: 'div[contenteditable="true"], .fa'
		});
	};
	//TODO Partial matching not complete
	function _fuzzySearch(target, searchTerm) {
		/*http://stackoverflow.com/a/15252131*/
		var hay = target.toLowerCase(), i = 0, n = -1, l;
		searchTerm = searchTerm.toLowerCase();
		for (; l = searchTerm[i++];) {
			if (!~(n = hay.indexOf(l, n + 1))) {
				return false;
			}
		}
		return true;
	}

	return TableList;
})();
;
var WebHelpTemplates = {};
WebHelpTemplates["WebHelpConsumption"] = "<div id=\"webHelpMainContent\">\n" +
	"    <div class=\"tabbable\">\n" +
	"        <!-- Only required for left/right tabs -->\n" +
	"        <ul class=\"nav nav-tabs\">\n" +
	"            <li><a href=\"#whatsNew\" data-toggle=\"tab\" target=\"_self\">What's New?</a></li>\n" +
	"            <li class=\"active\"><a href=\"#availableSequences\" data-toggle=\"tab\"  target=\"_self\">Topics</a></li>\n" +
	"        </ul>\n" +
	"        <div class=\"tab-content\">\n" +
	"            <div class=\"tab-pane\" id=\"whatsNew\">\n" +
	"                <div id=\"whatsNewContent\"></div>\n" +
	"            </div>\n" +
	"            <div class=\"tab-pane active\" id=\"availableSequences\">\n" +
	"                <div id=\"availableSequencesContent\"></div>\n" +
	"            </div>\n" +
	"        </div>\n" +
	"    </div>\n" +
	"</div>";
WebHelpTemplates["WebHelpContent"] = "<div id=\"contentConsumptionModal\" class=\"modal\">\n" +
	"        <div class=\"modal-dialog\">\n" +
	"                    <div class=\"modal-content\" style=\"width: 800px;\">\n" +
	"                                <div class=\"modal-header ai-modal-title\">\n" +
	"                                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span>\n" +
	"                                            </button>\n" +
	"                                            What would you like to learn?\n" +
	"                                </div>\n" +
	"                                <div class=\"modal-body\"></div>\n" +
	"                                <div class=\"modal-footer\">\n" +
	"                                            <button data-dismiss=\"modal\" class=\"btn btn-warning\">Close</button>\n" +
	"                                </div>\n" +
	"                    </div>\n" +
	"        </div>\n" +
	"</div>";
WebHelpTemplates["WebHelpCreator"] = "\n" +
	"<div id=\"webHelpMainContent\">\n" +
	"        <div class=\"tabbable\">\n" +
	"                    <!-- Only required for left/right tabs -->\n" +
	"                    <ul class=\"nav nav-tabs\">\n" +
	"                                <li><a href=\"#scratchpad\" data-toggle=\"tab\" target=\"_self\">Scratchpad</a></li>\n" +
	"                                <li><a href=\"#availableSequences\" data-toggle=\"tab\"  target=\"_self\">Topics</a></li>\n" +
	"                                <li><a href=\"#addSequence\" data-toggle=\"tab\"  target=\"_self\">Add/Edit Sequence</a></li>\n" +
	"                    </ul>\n" +
	"                    <div class=\"tab-content\">\n" +
	"                                <div class=\"tab-pane\" id=\"scratchpad\">\n" +
	"                                            <div id=\"scratchpadContent\"></div>\n" +
	"                                </div>\n" +
	"                                <div class=\"tab-pane\" id=\"availableSequences\">\n" +
	"                                            <div id=\"availableSequencesContent\"></div>\n" +
	"                                </div>\n" +
	"\n" +
	"                                <div class=\"tab-pane\" id=\"addSequence\">\n" +
	"                                            <div class=\"well\">\n" +
	"\n" +
	"                                                        <section>\n" +
	"                                                                    <div>\n" +
	"                                                                                <input type=\"text\" id=\"sequenceTitleSetter\" placeholder=\"Sequence title\" />\n" +
	"                                                                    </div>\n" +
	"                                                                    <div id=\"stepsTable\" class=\"table table-bordered table-hover\"></div>\n" +
	"                    </section>\n" +
	"\n" +
	"                                                        <button type=\"button\" id='sequencePreviewButton' class=\"btn btn-default centered actionButton\" aria-label=\"Left Align\" style=\"margin-top:20px;\">\n" +
	"                                                                    <span class=\"iconClass-play\" aria-hidden=\"true \"></span> Preview\n" +
	"                                                        </button>\n" +
	"\n" +
	"                                                        <button type=\"button \" id='sequenceSaveButton' class=\"btn btn-default centered \" aria-label=\"Left Align \" style=\"margin-top:20px;\">\n" +
	"                                                                    <span class=\"iconClass-save\" aria-hidden=\"true\"></span> Done\n" +
	"                                                        </button>\n" +
	"                                                        <button type=\"button\" id='clearStepsButton' class=\"btn btn-default centered\" aria-label=\"Left Align\" style=\"margin-top:20px;\">\n" +
	"                                                                    <span class=\"iconClass-clear\" aria-hidden=\"true \"></span> New\n" +
	"                                                        </button>\n" +
	"                                            </div>\n" +
	"\n" +
	"                                            <div class=\"well \"><b>Available actions:</b>\n" +
	"                                                        <div class=\"well-sm \">\n" +
	"                                                                    <button data-toggle=\"tooltip \" data-placement=\"top \" title=\"Click and drag over elements on the page to select them \" class=\"btn btn-success \" role=\"button \" id=\"startDragDropButton\"><span class=\"iconClass-add\"></span> Add element step\n" +
	"                                                                    </button>\n" +
	"                                                                    <button class=\"btn btn-info\" role=\"button\" id=\"startEmptyStepButton\">\n" +
	"                                                                                <span class=\"iconClass-add\"></span> Add page step\n" +
	"                                                                    </button>\n" +
	"                                                                    <button class=\"btn btn-danger \" id=\"cancelDragDropButton\" role=\"button \"><span class=\"iconClass-remove\"></span> Cancel\n" +
	"                                                                    </button>\n" +
	"                                                        </div>\n" +
	"                                            </div>\n" +
	"                                            <div class=\"alert alert-danger\" id=\"noElementsSelectedDiv\" style=\"display: none;\">\n" +
	"                                                        <button id=\"noElementsSelectedButton\" type=\"button\" class=\"close\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span>\n" +
	"                                                        </button>\n" +
	"                                                        No elements were selected, please try again\n" +
	"                                            </div>\n" +
	"\n" +
	"                                            <div class=\"alert alert-danger\" id=\"noStepsInPreviewDiv\" style=\"display: none;\">\n" +
	"                                                        <button id=\"noStepsInPreviewButton\" type=\"button\" class=\"close\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span>\n" +
	"                                                        </button>\n" +
	"                                                        No steps to preview. Please add steps.\n" +
	"                                            </div>\n" +
	"\n" +
	"                <div class=\"alert alert-info\" id=\"showSequenceSavedSuccessAlert\" style=\"display: none;\">\n" +
	"                    Sequence saved successfully!\n" +
	"                </div>\n" +
	"                                </div>\n" +
	"                    </div>\n" +
	"        <div class=\"well\" id=\"globalWebHelpCreatorActionsWell\"><b>Global actions:</b>\n" +
	"            <div class=\"well-sm \">\n" +
	"                <button class=\"btn btn-info\" role=\"button\" id=\"saveAllHelpSequencesToFileButton\">\n" +
	"                    <span class=\"iconClass-save\"></span> Save all sequences\n" +
	"                </button>\n" +
	"                <button class=\"btn btn-success\" id=\"importAllHelpSequencesFromFileButton\" role=\"button \">\n" +
	"                    <span class=\"iconClass-upload\"></span> Import sequences from file\n" +
	"                </button>\n" +
	"            </div>\n" +
	"        </div>\n" +
	"\n" +
	"        </div>\n" +
	"</div>\n" +
	"\n" +
	"\n" +
	"";
WebHelpTemplates["WebHelpSelectPopup"] = "<div>Go ahead with this selection ?</div>\n" +
	"<div class=\"btn-group\">\n" +
	"        <button type=\"button\" class=\"btn btn-success drag-select-yes\">Yes</button>\n" +
	"        <button type=\"button\" class=\"btn btn-danger drag-select-no\">No</button>\n" +
	"</div>";
WebHelpTemplates["WebHelpSequenceConsumptionList"] = "<ul class=\"webHelpSequenceConsumptionList\">\n" +
	"    <li class=\"webHelpSequenceList header\">\n" +
	"        <div class=\"iconClass-play\"></div>\n" +
	"        <div class=\"webHelpSequenceItem-title\">Topic</div>\n" +
	"        <div class=\"iconClass-edit\"></div>\n" +
	"        <div class=\"iconClass-remove\"></div>\n" +
	"        <div class=\"webHelpSequenceItem-content\">Content</div>\n" +
	"    </li>\n" +
	"</ul>";
WebHelpTemplates["WebHelpSequenceCreationList"] = "<ul class=\"webHelpSequenceCreationList\">\n" +
	"    <li class=\"webHelpSequenceStepListItem header\">\n" +
	"        <div class=\"iconClass-remove\"></div>\n" +
	"        <div class=\"webHelpSequenceListItem-title\">Title</div>\n" +
	"        <div class=\"webHelpSequenceListItem-selectionType\"></div>\n" +
	"        <div class=\"webHelpSequenceListItem-selectionValue\"></div>\n" +
	"        <div class=\"webHelpSequenceListItem-content\">Content</div>\n" +
	"    </li>\n" +
	"</ul>";
WebHelpTemplates["WebHelpSequenceListItem"] = "<li class=\"webHelpSequenceList\">\n" +
	"    <div class=\"iconClass-play\"></div>\n" +
	"    <div class=\"webHelpSequenceItem-title\"></div>\n" +
	"    <div class=\"iconClass-edit\"></div>\n" +
	"    <div class=\"iconClass-remove\"></div>\n" +
	"    <div class=\"webHelpSequenceItem-content\">Content</div>\n" +
	"</li>";
WebHelpTemplates["WebHelpSequenceStepListItem"] = "<li class=\"webHelpSequenceStepListItem\">\n" +
	"    <div class=\"iconClass-remove remove-step\"></div>\n" +
	"    <div contenteditable=\"true\" class=\"webHelpSequenceListItem-title\">Editable title</div>\n" +
	"    <div class=\"webHelpSequenceListItem-selectionType\"></div>\n" +
	"    <div class=\"webHelpSequenceListItem-selectionValue\"></div>\n" +
	"    <div contenteditable=\"true\" class=\"webHelpSequenceListItem-content\">Editable content</div>\n" +
	"</li>";
WebHelpTemplates["WebHelpSidebarToggle"] = "<span id=\"creationModeSidebarshowHideSpan\">Show/Hide Create Mode</span>";
WebHelpTemplates["WebHelpTableListSearch"] = "<div class=\"webHelpTableListSearch\">\n" +
	"    <label>Search title and content: <input type=\"text\" placeholder=\"Type to search\"></label>\n" +
	"</div>";
;
/* globals jQuery, document */
/* exported jQueryDragSelector */
var jQueryDragSelector = {
	on: function (callback) {
		"use strict";
		var self = this;
		if (!this.isOn) {
			/*
			 * Drag and drop jQuery enhancements under MIT license
			 * http://threedubmedia.com/code/event/drag
			 * http://threedubmedia.com/code/event/drop
			 */
			jQuery(document)
				.drag("start", function () {
					return jQuery('<div class="selection" />')
						.css('opacity', 0.5)
						.css('z-index', parseInt(jQuery('#webHelpFullBodyPane').css('z-index')) + 1)
						.appendTo(document.body);
				})
				.drag(function (ev, dd) {
					jQuery(dd.proxy).css({
						top: Math.min(ev.pageY, dd.startY),
						left: Math.min(ev.pageX, dd.startX),
						height: Math.abs(ev.pageY - dd.startY),
						width: Math.abs(ev.pageX - dd.startX)
					});
				})
				.drag("end", function (ev, dd) {
					jQuery(dd.proxy).remove();
					jQuery('.dragSelectedElement').popover('destroy');
					jQuery('.fadedDragSelectedElement').removeClass('fadedDragSelectedElement');
					var selectionBoundingRect = {
						top: (dd.offsetY < 0) ? dd.startY + dd.offsetY : dd.startY,
						bottom: (dd.offsetY < 0) ? dd.startY : dd.startY + dd.offsetY,
						left: (dd.offsetX < 0) ? dd.startX + dd.offsetX : dd.startX,
						right: (dd.offsetX < 0) ? dd.startX : dd.startX + dd.offsetX
					};
					var $selectedElements = self.rectangleSelect('body, div, input, textarea, button, a, ul, li, tr, td, span', selectionBoundingRect);
					var selectedIframeAttributes = false;
					if (!$selectedElements.length) {
						var skipLoop = false;
						jQuery('body').find('iframe').each(function (iFrameIndex, iFrameElement) {
							if (skipLoop) {
								return true;
							}
							var overrideElementObject = {
								'$body': jQuery(iFrameElement).contents().find('html').find('body'),
								'$frame': iFrameElement
							};
							$selectedElements = self.rectangleSelect('div, input, textarea, button, a, ul, li, tr, td, span', selectionBoundingRect, overrideElementObject);
							if ($selectedElements.length) {
								skipLoop = true;
								selectedIframeAttributes = overrideElementObject;
							}
						});
					}
					/*Make sure only the biggest parent element is selected*/
					jQuery.each($selectedElements, function (index, element) {
						jQuery(element).children().removeClass('dragSelectedElement');
						if (index > 0) {
							jQuery(element).removeClass('dragSelectedElement');
						}
					});
					jQuery($selectedElements[0]).addClass('fadedDragSelectedElement');
					if ($selectedElements.length > 0) {
						if (callback && typeof callback === 'function') {
							callback({
								$element: $selectedElements.first(),
								iframeAttributes: selectedIframeAttributes
							});
						}
					} else {
						callback(false);
					}
				});
			this.isOn = true;
		}
	},
	isOn: false,
	selectedObjects: [],
	setPaneState: function (booleanState) {
		if (booleanState) {
			jQuery('body').append('<div id="webHelpFullBodyPane"></div>');
			jQuery('#webHelpFullBodyPane').css({
				'position': 'fixed',
				'top': '0',
				'bottom': '0',
				'right': '0',
				'left': '0',
				'z-index': '1000000'
			});
		} else {
			jQuery('#webHelpFullBodyPane').remove();
		}
	},
	confirmSelection: function (confirmBoolean, $element, callback) {
		"use strict";
		jQuery($element[0]).popover('destroy');
		var arrayOfObjects = [];
		/* Open the side-menu if it is closed*/
		var status = jQuery('#webHelpMainContent').attr("data-status");
		if (status === "closed") {
			jQuery(".toggler").trigger("click");
		}
		if (confirmBoolean) {
			jQuery.each($element, function (index, element) {
				jQuery(element).removeClass('dragSelectedElement fadedDragSelectedElement');
				if (index > 0) { /*Allow only one element for now*/
					return true; //continue
				}
				var objectForArray = {
					'attribute': '',
					'value': ''
				};
				if (element.id) {
					objectForArray.attribute = 'id';
					objectForArray.value = element.id.replace(/:/g, '\\:');
				} else if ((jQuery(element).children().length === 1) && (jQuery(element).children()[0].id)) {
					objectForArray.attribute = 'id';
					objectForArray.value = jQuery(element).children()[0].id.replace(/:/g, '\\:');
				} else if (element.name || jQuery(element).attr('name')) {
					objectForArray.attribute = 'name';
					objectForArray.value = element.name || jQuery(element).attr('name');
				} else if ((jQuery(element).children().length === 1) && (jQuery(element).children()[0].name || jQuery(jQuery(element).children()[0]).attr('name'))) {
					objectForArray.attribute = 'name';
					objectForArray.value = jQuery(element).children()[0].name || jQuery(jQuery(element).children()[0]).attr('name');
				} else if (element.className) {
					var jQueryClassName = '.' + element.className.split(/\s+/).join('.');
					if (jQuery(jQueryClassName).length === 1) {
						objectForArray.attribute = 'class';
						objectForArray.value = element.className;
					} else {
						objectForArray.attribute = 'CSSPath';
						objectForArray.value = jQuery(element).getPath();
					}
				} else {
					objectForArray.attribute = 'CSSPath';
					objectForArray.value = jQuery(element).getPath();
				}
				arrayOfObjects.push(objectForArray);
			});
			if (callback && typeof callback === 'function') {
				callback(arrayOfObjects);
			}
		} else {
			$element.removeClass('dragSelectedElement fadedDragSelectedElement');
			if (callback && typeof callback === 'function') {
				callback(false);
			}
		}
		this.selectedObjects = arrayOfObjects;
		this.off();
	},
	off: function () {
		"use strict";
		if (this.isOn) {
			jQuery(document).unbind("draginit").unbind("dragstart").unbind("drag").unbind("dragend");
			jQuery('div, input, textarea, button, a, ul, li, tr, td, span').unbind("drop");
			this.isOn = false;
		}
	},
	rectangleSelect: function (selector, selectionBoundingRect, iframeAttr) {
		"use strict";
		jQueryDragSelector.setPaneState(false);
		var $elementArray = jQuery(selector);
		var secondaryOffsetRectangle = {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0
		};
		if (iframeAttr) {
			$elementArray = iframeAttr.$body.find(selector);
			secondaryOffsetRectangle = iframeAttr.$frame.getBoundingClientRect();
		}
		$elementArray.each(function () {
			var $this = jQuery(this);
			var elemBoundingRect = $this.get(0).getBoundingClientRect();
			if ((selectionBoundingRect.top > (elemBoundingRect.top + secondaryOffsetRectangle.top)) ||
				(selectionBoundingRect.left > (elemBoundingRect.left + secondaryOffsetRectangle.left)) ||
				(selectionBoundingRect.right < (elemBoundingRect.right + secondaryOffsetRectangle.left)) ||
				(selectionBoundingRect.bottom < (elemBoundingRect.bottom + secondaryOffsetRectangle.top))) {
				//The element is not contained
				return true; //continue
			}
			//If we reach this point, the element is contained in the selection rectangle
			if ($this.hasClass("dragSelectedElement")) {
				$this.removeClass("dragSelectedElement");
				/*
				 * Drop action goes from biggest to smallest element
				 * Once we remove the selected class from the parent, we add it to the children (if any)
				 * so that they get toggled out in the next round
				 */
				$this.children().addClass("dragSelectedElement");
			} else {
				$this.addClass("dragSelectedElement");
			}
		});
		if (iframeAttr) {
			return iframeAttr.$body.find('.dragSelectedElement');
		}
		return jQuery('.dragSelectedElement');
	}
};
;
(function () {
	var method;
	var noop = function () {
	};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});
	while (length--) {
		method = methods[length];
		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());
// Place any jQuery/helper plugins in here.
;
