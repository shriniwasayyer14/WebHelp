/*    Last edited by:  $Author: akannan $
 *    on:  $Date: 2010-10-12 17:28:22 +0800 (Tue, 12 Oct 2010) $
 *    Filename:  $Id: manavik.html 436280 2010-10-12 09:28:22Z manavik $
 *    Revision:  $Revision: 436280 $
 *    Description
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
} (this, function (exports) {
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

          currentItem.element  = floatingElementQuery;
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
    if(_addOverlayLayer.call(self, targetElm)) {
      //then, start the show
      _nextStep.call(self);

      var skipButton     = targetElm.querySelector('.introjs-skipbutton'),
          nextStepButton = targetElm.querySelector('.introjs-nextbutton');

      self._onKeyDown = function(e) {
        if (e.keyCode === 27 && self._options.exitOnEsc == true) {
          //escape key pressed, exit the intro
          _exitIntro.call(self, targetElm);
          //check if any callback is defined
          if (self._introExitCallback != undefined) {
            self._introExitCallback.call(self);
          }
        } else if(e.keyCode === 37) {
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
          if(e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
        }
      };

      self._onResize = function(e) {
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
      showElement.className = showElement.className.replace(/introjs-[a-zA-Z]+/g, '').replace(/^\s+|\s+$/g, ''); // This is a manual trim.
    }

    //remove `introjs-fixParent` class from the elements
    var fixParents = document.querySelectorAll('.introjs-fixParent');
    if (fixParents && fixParents.length > 0) {
      for (var i = fixParents.length - 1; i >= 0; i--) {
        fixParents[i].className = fixParents[i].className.replace(/introjs-fixParent/g, '').replace(/^\s+|\s+$/g, '');
      };
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
    tooltipLayer.style.top        = null;
    tooltipLayer.style.right      = null;
    tooltipLayer.style.bottom     = null;
    tooltipLayer.style.left       = null;
    tooltipLayer.style.marginLeft = null;
    tooltipLayer.style.marginTop  = null;

    arrowLayer.style.display = 'inherit';

    if (typeof(helperNumberLayer) != 'undefined' && helperNumberLayer != null) {
      helperNumberLayer.style.top  = null;
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

        tooltipLayer.style.left   = '50%';
        tooltipLayer.style.top    = '50%';
        tooltipLayer.style.marginLeft = '-' + (tooltipOffset.width / 2)  + 'px';
        tooltipLayer.style.marginTop  = '-' + (tooltipOffset.height / 2) + 'px';

        if (typeof(helperNumberLayer) != 'undefined' && helperNumberLayer != null) {
          helperNumberLayer.style.left = '-' + ((tooltipOffset.width / 2) + 18) + 'px';
          helperNumberLayer.style.top  = '-' + ((tooltipOffset.height / 2) + 18) + 'px';
        }

        break;
      case 'bottom-right-aligned':
        arrowLayer.className      = 'introjs-arrow top-right';
        tooltipLayer.style.right  = '0px';
        tooltipLayer.style.bottom = '-' + (_getOffset(tooltipLayer).height + 10) + 'px';
        break;
      case 'bottom-middle-aligned':
        targetElementOffset = _getOffset(targetElement);
        tooltipOffset       = _getOffset(tooltipLayer);

        arrowLayer.className      = 'introjs-arrow top-middle';
        tooltipLayer.style.left   = (targetElementOffset.width / 2 - tooltipOffset.width / 2) + 'px';
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

      var currentElement  = this._introItems[this._currentStep],
          elementPosition = _getOffset(currentElement.element),
          widthHeightPadding = 10;

      if (currentElement.position == 'floating') {
        widthHeightPadding = 0;
      }

      //set new position to helper layer
      helperLayer.setAttribute('style', 'width: ' + (elementPosition.width  + widthHeightPadding)  + 'px; ' +
                                        'height:' + (elementPosition.height + widthHeightPadding)  + 'px; ' +
                                        'top:'    + (elementPosition.top    - 5)   + 'px;' +
                                        'left: '  + (elementPosition.left   - 5)   + 'px;');

    }
  }

  /**
   * Add disableinteraction layer and adjust the size and position of the layer
   *
   * @api private
   * @method _disableInteraction
   */
  function _disableInteraction () {
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
          oldtooltipLayer      = oldReferenceLayer.querySelector('.introjs-tooltiptext'),
          oldArrowLayer        = oldReferenceLayer.querySelector('.introjs-arrow'),
          oldtooltipContainer  = oldReferenceLayer.querySelector('.introjs-tooltip'),
          skipTooltipButton    = oldReferenceLayer.querySelector('.introjs-skipbutton'),
          prevTooltipButton    = oldReferenceLayer.querySelector('.introjs-prevbutton'),
          nextTooltipButton    = oldReferenceLayer.querySelector('.introjs-nextbutton');

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

      //remove `introjs-fixParent` class from the elements
      var fixParents = document.querySelectorAll('.introjs-fixParent');
      if (fixParents && fixParents.length > 0) {
        for (var i = fixParents.length - 1; i >= 0; i--) {
          fixParents[i].className = fixParents[i].className.replace(/introjs-fixParent/g, '').replace(/^\s+|\s+$/g, '');
        };
      }

      //remove old classes
      var oldShowElement = document.querySelector('.introjs-showElement');
      oldShowElement.className = oldShowElement.className.replace(/introjs-[a-zA-Z]+/g, '').replace(/^\s+|\s+$/g, '');

      //we should wait until the CSS3 transition is competed (it's 0.3 sec) to prevent incorrect `height` and `width` calculation
      if (self._lastShowElementTimer) {
        clearTimeout(self._lastShowElementTimer);
      }
      self._lastShowElementTimer = setTimeout(function() {
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
      var helperLayer       = document.createElement('div'),
          referenceLayer    = document.createElement('div'),
          arrowLayer        = document.createElement('div'),
          tooltipLayer      = document.createElement('div'),
          tooltipTextLayer  = document.createElement('div'),
          bulletsLayer      = document.createElement('div'),
          progressLayer     = document.createElement('div'),
          buttonsLayer      = document.createElement('div');

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
        var innerLi    = document.createElement('li');
        var anchorLink = document.createElement('a');

        anchorLink.onclick = function() {
          self.goToStep(this.getAttribute('data-stepnumber'));
        };

        if (i === (targetElement.step-1)) anchorLink.className = 'active';

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

      nextTooltipButton.onclick = function() {
        if (self._introItems.length - 1 != self._currentStep) {
          _nextStep.call(self);
        }
      };

      nextTooltipButton.href = 'javascript:void(0);';
      nextTooltipButton.innerHTML = this._options.nextLabel;

      //previous button
      var prevTooltipButton = document.createElement('a');

      prevTooltipButton.onclick = function() {
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

      skipTooltipButton.onclick = function() {
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
      //More detail: https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context
      var zIndex = _getPropValue(parentElm, 'z-index');
      var opacity = parseFloat(_getPropValue(parentElm, 'opacity'));
      var transform = _getPropValue(parentElm, 'transform') || _getPropValue(parentElm, '-webkit-transform') || _getPropValue(parentElm, '-moz-transform') || _getPropValue(parentElm, '-ms-transform') || _getPropValue(parentElm, '-o-transform');
      if (/[0-9]+/.test(zIndex) || opacity < 1 || transform !== 'none') {
        parentElm.className += ' introjs-fixParent';
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
  function _getPropValue (element, propName) {
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
      return { width: window.innerWidth, height: window.innerHeight };
    } else {
      var D = document.documentElement;
      return { width: D.clientWidth, height: D.clientHeight };
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
      (rect.bottom+80) <= window.innerHeight && // add 80 to get the text right
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

    overlayLayer.onclick = function() {
      if (self._options.exitOnOverlayClick == true) {
        _exitIntro.call(self, targetElm);

        //check if any callback is defined
        if (self._introExitCallback != undefined) {
          self._introExitCallback.call(self);
        }
      }
    };

    setTimeout(function() {
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
  function _mergeOptions(obj1,obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
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
    setOption: function(option, value) {
      this._options[option] = value;
      return this;
    },
    setOptions: function(options) {
      this._options = _mergeOptions(this._options, options);
      return this;
    },
    start: function () {
      _introForElement.call(this, this._targetElement);
      return this;
    },
    goToStep: function(step) {
      _goToStep.call(this, step);
      return this;
    },
    nextStep: function() {
      _nextStep.call(this);
      return this;
    },
    previousStep: function() {
      _previousStep.call(this);
      return this;
    },
    exit: function() {
      _exitIntro.call(this, this._targetElement);
      return this;
    },
    refresh: function() {
      _setHelperLayerPosition.call(this, document.querySelector('.introjs-helperLayer'));
      _setHelperLayerPosition.call(this, document.querySelector('.introjs-tooltipReferenceLayer'));
      return this;
    },
    onbeforechange: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introBeforeChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onbeforechange was not a function');
      }
      return this;
    },
    onchange: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onchange was not a function.');
      }
      return this;
    },
    onafterchange: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introAfterChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onafterchange was not a function');
      }
      return this;
    },
    oncomplete: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introCompleteCallback = providedCallback;
      } else {
        throw new Error('Provided callback for oncomplete was not a function.');
      }
      return this;
    },
    onexit: function(providedCallback) {
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
(function ( $ ) {

	jQuery.fn.BootSideMenu = function( options ) {

		var oldCode, newCode, side;

		newCode = "";

		var settings = jQuery.extend({
			side:"left",
			autoClose:true
		}, options );

		side = settings.side;
		autoClose = settings.autoClose;

		this.addClass("container sidebar");

		if(side=="left"){
			this.addClass("sidebar-left");
		}else if(side=="right"){
			this.addClass("sidebar-right");
		}else{
			this.addClass("sidebar-left");	
		}

		oldCode = this.html();

		newCode += "<div class=\"row\">\n";
		newCode += "	<div class=\"sidebar-row\" data-side=\""+side+"\">\n"+ oldCode+" </div>\n";
		newCode += "</div>";
		newCode += "<div class=\"toggler\">\n";
		newCode += "	<span class=\"glyphicon glyphicon-chevron-right\">&nbsp;</span> <span class=\"glyphicon glyphicon-chevron-left\">&nbsp;</span>\n";
		newCode += "</div>\n";

		this.html(newCode);

		if(autoClose){
			jQuery(this).find(".toggler").trigger("click");
		}

	};

	jQuery(document).on('click', '.sidebar .list-group-item', function(){
		jQuery('.sidebar .list-group-item').each(function(){
			jQuery(this).removeClass('active');
		});
		jQuery(this).addClass('active');
	});


	jQuery(document).on('click', '.sidebar .list-group-item', function(event){
		var idToToggle, this_offset, this_x, this_y, href, side;
		event.preventDefault();
		href = jQuery(this).attr('href');

		if(href.substr(0,1)=='#'){

			idToToggle = href.substr(1,href.length); 

			if(searchSubMenu(idToToggle)){

				this_offset = jQuery(this).offset();
				side = jQuery(this).parent().parent().attr('data-side');

				if(side=='left'){
					this_x = jQuery(this).width() + 10;
					this_y = this_offset.top +1;
					jQuery('#'+idToToggle).css('left', this_x);
					jQuery('#'+idToToggle).css('top', this_y);			
				}else if(side=='right'){
					this_x = jQuery(this).width()+10;
					this_y = this_offset.top +1;
					jQuery('#'+idToToggle).css('right', this_x);
					jQuery('#'+idToToggle).css('top', this_y);			
				}

				jQuery('#'+idToToggle).fadeIn();

			}else{
				jQuery('.submenu').fadeOut();
			}
		}
	});


	jQuery(document).on('click','.toggler', function(){
		var toggler = jQuery(this);
		var container = toggler.parent();
		var listaClassi = container[0].classList;
		var side = getSide(listaClassi);
		var containerWidth = container.width();
		var status = container.attr('data-status');
		if(!status){
			status = "opened";
		}
		doAnimation(container, containerWidth, side, status);
	});

	/*Cerca un div con classe submenu e id uguale a quello passato*/
	function searchSubMenu(id){
		var found = false;
		jQuery('.submenu').each(function(){
			var thisId = jQuery(this).attr('id');
			if(id==thisId){
				found = true;
			}
		});
		return found;
	}

//restituisce il lato del sidebar in base alla classe che trova settata
function getSide(listaClassi){
	var side;
	for(var i = 0; i<listaClassi.length; i++){
		if(listaClassi[i]=='sidebar-left'){
			side = "left";
			break;
		}else if(listaClassi[i]=='sidebar-right'){
			side = "right";
			break;
		}else{
			side = null;
		}
	}
	return side;
}
//esegue l'animazione
function doAnimation(container, containerWidth, sidebarSide, sidebarStatus){
	var toggler = container.children()[1];
	if(sidebarStatus=="opened"){
		if(sidebarSide=="left"){
			container.animate({
				left:-(containerWidth+2)
			});
			toggleArrow(toggler, "left");
		}else if(sidebarSide=="right"){
			container.animate({
				right:- (containerWidth +2)
			});
			toggleArrow(toggler, "right");
		}
		container.attr('data-status', 'closed');
	}else{
		if(sidebarSide=="left"){
			container.animate({
				left:0
			});
			toggleArrow(toggler, "right");
		}else if(sidebarSide=="right"){
			container.animate({
				right:0
			});
			toggleArrow(toggler, "left");
		}
		container.attr('data-status', 'opened');

	}

}

function toggleArrow(toggler, side){
	if(side=="left"){
		jQuery(toggler).children(".glyphicon-chevron-right").css('display', 'block');
		jQuery(toggler).children(".glyphicon-chevron-left").css('display', 'none');
	}else if(side=="right"){
		jQuery(toggler).children(".glyphicon-chevron-left").css('display', 'block');
		jQuery(toggler).children(".glyphicon-chevron-right").css('display', 'none');
	}
}

}( jQuery ));

;
(function ($) {

    "use strict";
    jQuery.fn.rowReordering = function (options) {

        function _fnStartProcessingMode(oTable) {
            ///<summary>
            ///Function that starts "Processing" mode i.e. shows "Processing..." dialog while some action is executing(Default function)
            ///</summary>

            if (oTable.fnSettings().oFeatures.bProcessing) {
                jQuery(".dataTables_processing").css('visibility', 'visible');
            }
        }

        function _fnEndProcessingMode(oTable) {
            ///<summary>
            ///Function that ends the "Processing" mode and returns the table in the normal state(Default function)
            ///</summary>

            if (oTable.fnSettings().oFeatures.bProcessing) {
                jQuery(".dataTables_processing").css('visibility', 'hidden');
            }
        }

        ///Not used
        function fnGetStartPosition(oTable, sSelector) {
            var iStart = 1000000;
            jQuery(sSelector, oTable).each(function () {
                iPosition = parseInt(oTable.fnGetData(this, properties.iIndexColumn));
                if (iPosition < iStart)
                    iStart = iPosition;
            });
            return iStart;
        }

        function fnCancelSorting(oTable, tbody, properties, iLogLevel, sMessage) {
            tbody.sortable('cancel');
            if(iLogLevel<=properties.iLogLevel){
                if(sMessage!= undefined){
                    properties.fnAlert(sMessage, "");
                }else{
                    properties.fnAlert("Row cannot be moved", "");
                }
            }
            properties.fnEndProcessingMode(oTable);
        }

        function fnGetState(oTable, sSelector, id) {

            var tr = jQuery("#" + id, oTable);
            var iCurrentPosition = oTable.fnGetData(tr[0], properties.iIndexColumn);
            var iNewPosition = -1; // fnGetStartPosition(sSelector);
            var sDirection;
            var trPrevious = tr.prev(sSelector);
            if (trPrevious.length > 0) {
                iNewPosition = parseInt(oTable.fnGetData(trPrevious[0], properties.iIndexColumn));
                if (iNewPosition < iCurrentPosition) {
                    iNewPosition = iNewPosition + 1;
                }
            } else {
                var trNext = tr.next(sSelector);
                if (trNext.length > 0) {
                    iNewPosition = parseInt(oTable.fnGetData(trNext[0], properties.iIndexColumn));
                    if (iNewPosition > iCurrentPosition)//moved back
                        iNewPosition = iNewPosition - 1;
                }
            }
            if (iNewPosition < iCurrentPosition)
                sDirection = "back";
            else
                sDirection = "forward";

            return { sDirection: sDirection, iCurrentPosition: iCurrentPosition, iNewPosition: iNewPosition };

        }

        function fnMoveRows(oTable, sSelector, iCurrentPosition, iNewPosition, sDirection, id, sGroup) {
            var iStart = iCurrentPosition;
            var iEnd = iNewPosition;
            if (sDirection == "back") {
                iStart = iNewPosition;
                iEnd = iCurrentPosition;
            }

            jQuery(oTable.fnGetNodes()).each(function () {
                if (sGroup != "" && jQuery(this).attr("data-group") != sGroup)
                    return;
                var tr = this;
                var iRowPosition = parseInt(oTable.fnGetData(tr, properties.iIndexColumn));
                if (iStart <= iRowPosition && iRowPosition <= iEnd) {
                    if (tr.id == id) {
                        oTable.fnUpdate(iNewPosition,
                            oTable.fnGetPosition(tr), // get row position in current model
                            properties.iIndexColumn,
                            false); // false = defer redraw until all row updates are done
                    } else {
                        if (sDirection == "back") {
                            oTable.fnUpdate(iRowPosition + 1,
                                oTable.fnGetPosition(tr), // get row position in current model
                                properties.iIndexColumn,
                                false); // false = defer redraw until all row updates are done
                        } else {
                            oTable.fnUpdate(iRowPosition - 1,
                                oTable.fnGetPosition(tr), // get row position in current model
                                properties.iIndexColumn,
                                false); // false = defer redraw until all row updates are done
                        }
                    }
                }
            });

            var oSettings = oTable.fnSettings();

            //Standing Redraw Extension
            //Author: 	Jonathan Hoguet
            //http://datatables.net/plug-ins/api#fnStandingRedraw
            if (oSettings.oFeatures.bServerSide === false) {
                var before = oSettings._iDisplayStart;
                oSettings.oApi._fnReDraw(oSettings);
                //iDisplayStart has been reset to zero - so lets change it back
                oSettings._iDisplayStart = before;
                oSettings.oApi._fnCalculateEnd(oSettings);
            }
            //draw the 'current' page
            oSettings.oApi._fnDraw(oSettings);
        }

        function _fnAlert(message, type) { alert(message); }

        var defaults = {
            iIndexColumn: 0,
            iStartPosition: 1,
            sURL: null,
            sRequestType: "POST",
            iGroupingLevel: 0,
            fnAlert: _fnAlert,
            fnSuccess: jQuery.noop,
            iLogLevel: 1,
            sDataGroupAttribute: "data-group",
            fnStartProcessingMode: _fnStartProcessingMode,
            fnEndProcessingMode: _fnEndProcessingMode,
            fnUpdateAjaxRequest: jQuery.noop
        };

        var properties = jQuery.extend(defaults, options);

        var iFrom, iTo;

        // Return a helper with preserved width of cells (see Issue 9)
        var tableFixHelper = function(e, tr)
        {
            var $originals = tr.children();
            var $helper = tr.clone();
            $helper.children().each(function(index)
            {
                // Set helper cell sizes to match the original sizes
                jQuery(this).width($originals.eq(index).width())
            });
            return $helper;
        };

        return this.each(function () {

            var oTable = jQuery(this).dataTable();

            var aaSortingFixed = (oTable.fnSettings().aaSortingFixed == null ? new Array() : oTable.fnSettings().aaSortingFixed);
            aaSortingFixed.push([properties.iIndexColumn, "asc"]);

            oTable.fnSettings().aaSortingFixed = aaSortingFixed;


            for (var i = 0; i < oTable.fnSettings().aoColumns.length; i++) {
                oTable.fnSettings().aoColumns[i].bSortable = false;
                /*for(var j=0; j<aaSortingFixed.length; j++)
                 {
                 if( i == aaSortingFixed[j][0] )
                 oTable.fnSettings().aoColumns[i].bSortable = false;
                 }*/
            }
            oTable.fnDraw();

            jQuery("tbody", oTable).disableSelection().sortable({
                cursor: "move",
                helper: tableFixHelper,
                update: function (event, ui) {
                    var $dataTable = oTable;
                    var tbody = jQuery(this);
                    var sSelector = "tbody tr";
                    var sGroup = "";
                    if (properties.bGroupingUsed) {
                        sGroup = jQuery(ui.item).attr(properties.sDataGroupAttribute);
                        if(sGroup==null || sGroup==undefined){
                            fnCancelSorting($dataTable, tbody, properties, 3, "Grouping row cannot be moved");
                            return;
                        }
                        sSelector = "tbody tr[" + properties.sDataGroupAttribute + " ='" + sGroup + "']";
                    }

                    var oState = fnGetState($dataTable, sSelector, ui.item.context.id);
                    if(oState.iNewPosition == -1)
                    {
                        fnCancelSorting($dataTable, tbody, properties,2);
                        return;
                    }

                    if (properties.sURL != null) {
                        properties.fnStartProcessingMode($dataTable);
                        var oAjaxRequest = {
                            url: properties.sURL,
                            type: properties.sRequestType,
                            data: { id: ui.item.context.id,
                                fromPosition: oState.iCurrentPosition,
                                toPosition: oState.iNewPosition,
                                direction: oState.sDirection,
                                group: sGroup
                            },
                            success: function (data) {
                                properties.fnSuccess(data);
                                fnMoveRows($dataTable, sSelector, oState.iCurrentPosition, oState.iNewPosition, oState.sDirection, ui.item.context.id, sGroup);
                                properties.fnEndProcessingMode($dataTable);
                            },
                            error: function (jqXHR) {
                                fnCancelSorting($dataTable, tbody, properties, 1, jqXHR.statusText);
                            }
                        };
                        properties.fnUpdateAjaxRequest(oAjaxRequest, properties, $dataTable);
                        jQuery.ajax(oAjaxRequest);
                    } else {
                        fnMoveRows($dataTable, sSelector, oState.iCurrentPosition, oState.iNewPosition, oState.sDirection, ui.item.context.id, sGroup);
                    }

                }
            });

        });

    };
})(jQuery);;
// Created: 2008-06-04 
// Updated: 2012-05-21
// REQUIRES: jquery 1.7.x

;(function( $ ){

// add the jquery instance method
jQuery.fn.drag = function( str, arg, opts ){
	// figure out the event type
	var type = typeof str == "string" ? str : "",
	// figure out the event handler...
	fn = jQuery.isFunction( str ) ? str : jQuery.isFunction( arg ) ? arg : null;
	// fix the event type
	if ( type.indexOf("drag") !== 0 ) 
		type = "drag"+ type;
	// were options passed
	opts = ( str == fn ? arg : opts ) || {};
	// trigger or bind event handler
	return fn ? this.bind( type, opts, fn ) : this.trigger( type );
};

// local refs (increase compression)
var $event = jQuery.event, 
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
	add: function( obj ){ 
		// read the interaction data
		var data = jQuery.data( this, drag.datakey ),
		// read any passed options 
		opts = obj.data || {};
		// count another realted event
		data.related += 1;
		// extend data options bound with this event
		// don't iterate "opts" in case it is a node 
		jQuery.each( drag.defaults, function( key, def ){
			if ( opts[ key ] !== undefined )
				data[ key ] = opts[ key ];
		});
	},
	
	// forget unbound related events
	remove: function(){
		jQuery.data( this, drag.datakey ).related -= 1;
	},
	
	// configure interaction, capture settings
	setup: function(){
		// check for related events
		if ( jQuery.data( this, drag.datakey ) ) 
			return;
		// initialize the drag data with copied defaults
		var data = jQuery.extend({ related:0 }, drag.defaults );
		// store the interaction data
		jQuery.data( this, drag.datakey, data );
		// bind the mousedown event, which starts drag interactions
		$event.add( this, "touchstart mousedown", drag.init, data );
		// prevent image dragging in IE...
		if ( this.attachEvent ) 
			this.attachEvent("ondragstart", drag.dontstart ); 
	},
	
	// destroy configured interaction
	teardown: function(){
		var data = jQuery.data( this, drag.datakey ) || {};
		// check for related events
		if ( data.related ) 
			return;
		// remove the stored data
		jQuery.removeData( this, drag.datakey );
		// remove the mousedown event
		$event.remove( this, "touchstart mousedown", drag.init );
		// enable text selection
		drag.textselect( true ); 
		// un-prevent image dragging in IE...
		if ( this.detachEvent ) 
			this.detachEvent("ondragstart", drag.dontstart ); 
	},
		
	// initialize the interaction
	init: function( event ){ 
		// sorry, only one touch at a time
		if ( drag.touched ) 
			return;
		// the drag/drop interaction data
		var dd = event.data, results;
		// check the which directive
		if ( event.which != 0 && dd.which > 0 && event.which != dd.which ) 
			return; 
		// check for suppressed selector
		if ( jQuery( event.target ).is( dd.not ) ) 
			return;
		// check for handle selector
		if ( dd.handle && !jQuery( event.target ).closest( dd.handle, event.currentTarget ).length ) 
			return;

		drag.touched = event.type == 'touchstart' ? this : null;
		dd.propagates = 1;
		dd.mousedown = this;
		dd.interactions = [ drag.interaction( this, dd ) ];
		dd.target = event.target;
		dd.pageX = event.pageX;
		dd.pageY = event.pageY;
		dd.dragging = null;
		// handle draginit event... 
		results = drag.hijack( event, "draginit", dd );
		// early cancel
		if ( !dd.propagates )
			return;
		// flatten the result set
		results = drag.flatten( results );
		// insert new interaction elements
		if ( results && results.length ){
			dd.interactions = [];
			jQuery.each( results, function(){
				dd.interactions.push( drag.interaction( this, dd ) );
			});
		}
		// remember how many interactions are propagating
		dd.propagates = dd.interactions.length;
		// locate and init the drop targets
		if ( dd.drop !== false && $special.drop ) 
			$special.drop.handler( event, dd );
		// disable text selection
		drag.textselect( false ); 
		// bind additional events...
		if ( drag.touched )
			$event.add( drag.touched, "touchmove touchend", drag.handler, dd );
		else 
			$event.add( document, "mousemove mouseup", drag.handler, dd );
		// helps prevent text selection or scrolling
		if ( !drag.touched || dd.live )
			return false;
	},	
	
	// returns an interaction object
	interaction: function( elem, dd ){
		var offset = jQuery( elem )[ dd.relative ? "position" : "offset" ]() || { top:0, left:0 };
		return {
			drag: elem, 
			callback: new drag.callback(), 
			droppable: [],
			offset: offset
		};
	},
	
	// handle drag-releatd DOM events
	handler: function( event ){ 
		// read the data before hijacking anything
		var dd = event.data;	
		// handle various events
		switch ( event.type ){
			// mousemove, check distance, start dragging
			case !dd.dragging && 'touchmove': 
				event.preventDefault();
			case !dd.dragging && 'mousemove':
				//  drag tolerance, x� + y� = distance�
				if ( Math.pow(  event.pageX-dd.pageX, 2 ) + Math.pow(  event.pageY-dd.pageY, 2 ) < Math.pow( dd.distance, 2 ) ) 
					break; // distance tolerance not reached
				event.target = dd.target; // force target from "mousedown" event (fix distance issue)
				drag.hijack( event, "dragstart", dd ); // trigger "dragstart"
				if ( dd.propagates ) // "dragstart" not rejected
					dd.dragging = true; // activate interaction
			// mousemove, dragging
			case 'touchmove':
				event.preventDefault();
			case 'mousemove':
				if ( dd.dragging ){
					// trigger "drag"		
					drag.hijack( event, "drag", dd );
					if ( dd.propagates ){
						// manage drop events
						if ( dd.drop !== false && $special.drop )
							$special.drop.handler( event, dd ); // "dropstart", "dropend"							
						break; // "drag" not rejected, stop		
					}
					event.type = "mouseup"; // helps "drop" handler behave
				}
			// mouseup, stop dragging
			case 'touchend': 
			case 'mouseup': 
			default:
				if ( drag.touched )
					$event.remove( drag.touched, "touchmove touchend", drag.handler ); // remove touch events
				else 
					$event.remove( document, "mousemove mouseup", drag.handler ); // remove page events	
				if ( dd.dragging ){
					if ( dd.drop !== false && $special.drop )
						$special.drop.handler( event, dd ); // "drop"
					drag.hijack( event, "dragend", dd ); // trigger "dragend"	
				}
				drag.textselect( true ); // enable text selection
				// if suppressing click events...
				if ( dd.click === false && dd.dragging )
					jQuery.data( dd.mousedown, "suppress.click", new Date().getTime() + 5 );
				dd.dragging = drag.touched = false; // deactivate element	
				break;
		}
	},
		
	// re-use event object for custom events
	hijack: function( event, type, dd, x, elem ){
		// not configured
		if ( !dd ) 
			return;
		// remember the original event and type
		var orig = { event:event.originalEvent, type:event.type },
		// is the event drag related or drog related?
		mode = type.indexOf("drop") ? "drag" : "drop",
		// iteration vars
		result, i = x || 0, ia, $elems, callback,
		len = !isNaN( x ) ? x : dd.interactions.length;
		// modify the event type
		event.type = type;
		// remove the original event
		event.originalEvent = null;
		// initialize the results
		dd.results = [];
		// handle each interacted element
		do if ( ia = dd.interactions[ i ] ){
			// validate the interaction
			if ( type !== "dragend" && ia.cancelled )
				continue;
			// set the dragdrop properties on the event object
			callback = drag.properties( event, dd, ia );
			// prepare for more results
			ia.results = [];
			// handle each element
			jQuery( elem || ia[ mode ] || dd.droppable ).each(function( p, subject ){
				// identify drag or drop targets individually
				callback.target = subject;
				// force propagtion of the custom event
				event.isPropagationStopped = function(){ return false; };
				// handle the event	
				result = subject ? $event.dispatch.call( subject, event, callback ) : null;
				// stop the drag interaction for this element
				if ( result === false ){
					if ( mode == "drag" ){
						ia.cancelled = true;
						dd.propagates -= 1;
					}
					if ( type == "drop" ){
						ia[ mode ][p] = null;
					}
				}
				// assign any dropinit elements
				else if ( type == "dropinit" )
					ia.droppable.push( drag.element( result ) || subject );
				// accept a returned proxy element 
				if ( type == "dragstart" )
					ia.proxy = jQuery( drag.element( result ) || ia.drag )[0];
				// remember this result	
				ia.results.push( result );
				// forget the event result, for recycling
				delete event.result;
				// break on cancelled handler
				if ( type !== "dropinit" )
					return result;
			});	
			// flatten the results	
			dd.results[ i ] = drag.flatten( ia.results );	
			// accept a set of valid drop targets
			if ( type == "dropinit" )
				ia.droppable = drag.flatten( ia.droppable );
			// locate drop targets
			if ( type == "dragstart" && !ia.cancelled )
				callback.update(); 
		}
		while ( ++i < len )
		// restore the original event & type
		event.type = orig.type;
		event.originalEvent = orig.event;
		// return all handler results
		return drag.flatten( dd.results );
	},
		
	// extend the callback object with drag/drop properties...
	properties: function( event, dd, ia ){		
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
		obj.drop = drag.flatten( ( ia.drop || [] ).slice() );
		obj.available = drag.flatten( ( ia.droppable || [] ).slice() );
		return obj;	
	},
	
	// determine is the argument is an element or jquery instance
	element: function( arg ){
		if ( arg && ( arg.jquery || arg.nodeType == 1 ) )
			return arg;
	},
	
	// flatten nested jquery objects and arrays into a single dimension array
	flatten: function( arr ){
		return jQuery.map( arr, function( member ){
			return member && member.jquery ? jQuery.makeArray( member ) : 
				member && member.length ? drag.flatten( member ) : member;
		});
	},
	
	// toggles text selection attributes ON (true) or OFF (false)
	textselect: function( bool ){ 
		jQuery( document )[ bool ? "unbind" : "bind" ]("selectstart", drag.dontstart )
			.css("MozUserSelect", bool ? "" : "none" );
		// .attr("unselectable", bool ? "off" : "on" )
		document.unselectable = bool ? "off" : "on"; 
	},
	
	// suppress "selectstart" and "ondragstart" events
	dontstart: function(){ 
		return false; 
	},
	
	// a callback instance contructor
	callback: function(){}
	
};

// callback methods
drag.callback.prototype = {
	update: function(){
		if ( $special.drop && this.available.length )
			jQuery.each( this.available, function( i ){
				$special.drop.locate( this, i );
			});
	}
};

// patch jQuery.event.$dispatch to allow suppressing clicks
var $dispatch = $event.dispatch;
$event.dispatch = function( event ){
	if ( jQuery.data( this, "suppress."+ event.type ) - new Date().getTime() > 0 ){
		jQuery.removeData( this, "suppress."+ event.type );
		return;
	}
	return $dispatch.apply( this, arguments );
};

// event fix hooks for touch events...
var touchHooks = 
$event.fixHooks.touchstart = 
$event.fixHooks.touchmove = 
$event.fixHooks.touchend =
$event.fixHooks.touchcancel = {
	props: "clientX clientY pageX pageY screenX screenY".split( " " ),
	filter: function( event, orig ) {
		if ( orig ){
			var touched = ( orig.touches && orig.touches[0] )
				|| ( orig.changedTouches && orig.changedTouches[0] )
				|| null; 
			// iOS webkit: touchstart, touchmove, touchend
			if ( touched ) 
				jQuery.each( touchHooks.props, function( i, prop ){
					event[ prop ] = touched[ prop ];
				});
		}
		return event;
	}
};

// share the same special event configuration with related events...
$special.draginit = $special.dragstart = $special.dragend = drag;

})( jQuery );;
;window.Modernizr=function(a,b,c){function D(a){j.cssText=a}function E(a,b){return D(n.join(a+";")+(b||""))}function F(a,b){return typeof a===b}function G(a,b){return!!~(""+a).indexOf(b)}function H(a,b){for(var d in a){var e=a[d];if(!G(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function I(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:F(f,"function")?f.bind(d||b):f}return!1}function J(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+p.join(d+" ")+d).split(" ");return F(b,"string")||F(b,"undefined")?H(e,b):(e=(a+" "+q.join(d+" ")+d).split(" "),I(e,b,c))}function K(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)u[c[d]]=c[d]in k;return u.list&&(u.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),u}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)k.setAttribute("type",f=a[d]),e=k.type!=="text",e&&(k.value=l,k.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&k.style.WebkitAppearance!==c?(g.appendChild(k),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(k,null).WebkitAppearance!=="textfield"&&k.offsetHeight!==0,g.removeChild(k)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=k.checkValidity&&k.checkValidity()===!1:e=k.value!=l)),t[a[d]]=!!e;return t}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k=b.createElement("input"),l=":)",m={}.toString,n=" -webkit- -moz- -o- -ms- ".split(" "),o="Webkit Moz O ms",p=o.split(" "),q=o.toLowerCase().split(" "),r={svg:"http://www.w3.org/2000/svg"},s={},t={},u={},v=[],w=v.slice,x,y=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},z=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b).matches;var d;return y("@media "+b+" { #"+h+" { position: absolute; } }",function(b){d=(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle)["position"]=="absolute"}),d},A=function(){function d(d,e){e=e||b.createElement(a[d]||"div"),d="on"+d;var f=d in e;return f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=F(e[d],"function"),F(e[d],"undefined")||(e[d]=c),e.removeAttribute(d))),e=null,f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),B={}.hasOwnProperty,C;!F(B,"undefined")&&!F(B.call,"undefined")?C=function(a,b){return B.call(a,b)}:C=function(a,b){return b in a&&F(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=w.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(w.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(w.call(arguments)))};return e}),s.flexbox=function(){return J("flexWrap")},s.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},s.canvastext=function(){return!!e.canvas&&!!F(b.createElement("canvas").getContext("2d").fillText,"function")},s.webgl=function(){return!!a.WebGLRenderingContext},s.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:y(["@media (",n.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},s.geolocation=function(){return"geolocation"in navigator},s.postmessage=function(){return!!a.postMessage},s.websqldatabase=function(){return!!a.openDatabase},s.indexedDB=function(){return!!J("indexedDB",a)},s.hashchange=function(){return A("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},s.history=function(){return!!a.history&&!!history.pushState},s.draganddrop=function(){var a=b.createElement("div");return"draggable"in a||"ondragstart"in a&&"ondrop"in a},s.websockets=function(){return"WebSocket"in a||"MozWebSocket"in a},s.rgba=function(){return D("background-color:rgba(150,255,150,.5)"),G(j.backgroundColor,"rgba")},s.hsla=function(){return D("background-color:hsla(120,40%,100%,.5)"),G(j.backgroundColor,"rgba")||G(j.backgroundColor,"hsla")},s.multiplebgs=function(){return D("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(j.background)},s.backgroundsize=function(){return J("backgroundSize")},s.borderimage=function(){return J("borderImage")},s.borderradius=function(){return J("borderRadius")},s.boxshadow=function(){return J("boxShadow")},s.textshadow=function(){return b.createElement("div").style.textShadow===""},s.opacity=function(){return E("opacity:.55"),/^0.55$/.test(j.opacity)},s.cssanimations=function(){return J("animationName")},s.csscolumns=function(){return J("columnCount")},s.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return D((a+"-webkit- ".split(" ").join(b+a)+n.join(c+a)).slice(0,-a.length)),G(j.backgroundImage,"gradient")},s.cssreflections=function(){return J("boxReflect")},s.csstransforms=function(){return!!J("transform")},s.csstransforms3d=function(){var a=!!J("perspective");return a&&"webkitPerspective"in g.style&&y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},s.csstransitions=function(){return J("transition")},s.fontface=function(){var a;return y('@font-face {font-family:"font";src:url("https://")}',function(c,d){var e=b.getElementById("smodernizr"),f=e.sheet||e.styleSheet,g=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"";a=/src/i.test(g)&&g.indexOf(d.split(" ")[0])===0}),a},s.generatedcontent=function(){var a;return y(["#",h,"{font:0/0 a}#",h,':after{content:"',l,'";visibility:hidden;font:3px/1 a}'].join(""),function(b){a=b.offsetHeight>=3}),a},s.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(d){}return c},s.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(d){}return c},s.localstorage=function(){try{return localStorage.setItem(h,h),localStorage.removeItem(h),!0}catch(a){return!1}},s.sessionstorage=function(){try{return sessionStorage.setItem(h,h),sessionStorage.removeItem(h),!0}catch(a){return!1}},s.webworkers=function(){return!!a.Worker},s.applicationcache=function(){return!!a.applicationCache},s.svg=function(){return!!b.createElementNS&&!!b.createElementNS(r.svg,"svg").createSVGRect},s.inlinesvg=function(){var a=b.createElement("div");return a.innerHTML="<svg/>",(a.firstChild&&a.firstChild.namespaceURI)==r.svg},s.smil=function(){return!!b.createElementNS&&/SVGAnimate/.test(m.call(b.createElementNS(r.svg,"animate")))},s.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(m.call(b.createElementNS(r.svg,"clipPath")))};for(var L in s)C(s,L)&&(x=L.toLowerCase(),e[x]=s[L](),v.push((e[x]?"":"no-")+x));return e.input||K(),e.addTest=function(a,b){if(typeof a=="object")for(var d in a)C(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},D(""),i=k=null,function(a,b){function k(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function l(){var a=r.elements;return typeof a=="string"?a.split(" "):a}function m(a){var b=i[a[g]];return b||(b={},h++,a[g]=h,i[h]=b),b}function n(a,c,f){c||(c=b);if(j)return c.createElement(a);f||(f=m(c));var g;return f.cache[a]?g=f.cache[a].cloneNode():e.test(a)?g=(f.cache[a]=f.createElem(a)).cloneNode():g=f.createElem(a),g.canHaveChildren&&!d.test(a)?f.frag.appendChild(g):g}function o(a,c){a||(a=b);if(j)return a.createDocumentFragment();c=c||m(a);var d=c.frag.cloneNode(),e=0,f=l(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function p(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return r.shivMethods?n(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+l().join().replace(/\w+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(r,b.frag)}function q(a){a||(a=b);var c=m(a);return r.shivCSS&&!f&&!c.hasCSS&&(c.hasCSS=!!k(a,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),j||p(a,c),a}var c=a.html5||{},d=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,e=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,f,g="_html5shiv",h=0,i={},j;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",f="hidden"in a,j=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){f=!0,j=!0}})();var r={elements:c.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:c.shivCSS!==!1,supportsUnknownElements:j,shivMethods:c.shivMethods!==!1,type:"default",shivDocument:q,createElement:n,createDocumentFragment:o};a.html5=r,q(b)}(this,b),e._version=d,e._prefixes=n,e._domPrefixes=q,e._cssomPrefixes=p,e.mq=z,e.hasEvent=A,e.testProp=function(a){return H([a])},e.testAllProps=J,e.testStyles=y,e.prefixed=function(a,b,c){return b?J(a,b,c):J(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+v.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
;


function initWebHelp(WebHelpOptions) {
    var helpIconPosition = '.ai-header .ai-header-title';
    var showIntroOnLoad = true;

    if (WebHelpOptions) {
        helpIconPosition = WebHelpOptions.helpIconPosition || helpIconPosition;
        showIntroOnLoad = (typeof WebHelpOptions.showIntroOnLoad != 'undefined') ? WebHelpOptions.showIntroOnLoad : showIntroOnLoad;
    }
    var parameters = getWindowParameters();

    var addWebHelpContainerFunc = function () {
        var webHelpContent = getWebHelpContainerHTML();
        jQuery("body").append(webHelpContent);
    };

    var addHelpIconFunc = function () {
        createNewNavigationButton(helpIconPosition);
    };

    var showIntroOnStartup = function () {
        var availableSequences = retrieveLocalStorage();
        if(showIntroOnLoad) {
            if (availableSequences['Introduction']) {
                playSequence('Introduction');
            }
        }
    };
    var showHelpConsumptionMode = function () {
        addHelpIconFunc();
        moveTableDivsToModal();
        showIntroOnStartup();
    };

    var showHelpCreationMode = function () {
        jQuery('#webHelpMainContent').BootSideMenu({
            side: "right", // left or right
            autoClose: true // auto close when page loads
        });
        setUpAddEditTable();
        var currentTitleHTML = jQuery(helpIconPosition).html();
        currentTitleHTML += "[Edit mode]";
        var elem;
        if(jQuery(helpIconPosition) && jQuery(helpIconPosition).length > 1) {
            elem = jQuery(helpIconPosition)[0];
        } else {
            elem = jQuery(helpIconPosition);
        }
        jQuery(elem).html(currentTitleHTML);
    };

    var loadAllSequences = function () {
        return populateCurrentSequences();
    };

    var addBadgeToHelpIcon = function (numNewSequences) {
        setNewSequenceCountBadgeOnHelpIcon(numNewSequences);
    };

    addWebHelpContainerFunc();
    var sequenceCounterObject = loadAllSequences();
    if (parameters['create'] != undefined) {
        //setElementsToScale();
        showHelpCreationMode();
    } else {
        showHelpConsumptionMode();
        addBadgeToHelpIcon(sequenceCounterObject.numNewSequences);
    }
}

function getWebHelpContainerHTML() {
    var webHelpElementsHTML = "<div id=\"webHelpMainContent\">\r\n    " +
        "<div class=\"tabbable\"> <!-- Only required for left\/right tabs -->\r\n        " +
        "<ul class=\"nav nav-tabs\">\r\n            " +
        "<li class=\"active\"><a href=\"#popularSequences\" data-toggle=\"tab\">Popular<\/a><\/li>\r\n            " +
        "<li><a href=\"#whatsNew\" data-toggle=\"tab\">What\'s New?<!--<span class=\"badge\" id=\"newItemsBadge\"\/>--><\/a>\r\n            " +
        "<li><a href=\"#availableSequences\" data-toggle=\"tab\">Topics<\/a><\/li>\r\n            " +
        "<li><a href=\"#addSequence\" data-toggle=\"tab\">Add\/Edit Sequence<\/a><\/li>\r\n        " +
        "<\/ul>\r\n        " +
        "<div class=\"tab-content\">\r\n            " +
        "<div class=\"tab-pane active\" id=\"popularSequences\">\r\n                " +
        "<div id=\"popularSequencesContent\">\r\n                    No popular items yet!\r\n                <\/div>\r\n            " +
        "<\/div>\r\n            <div class=\"tab-pane\" id=\"whatsNew\">\r\n                " +
        "<div id=\"whatsNewContent\">\r\n                    No new items yet!\r\n                <\/div>\r\n            " +
        "<\/div>\r\n            " +
        "<div class=\"tab-pane\" id=\"availableSequences\">\r\n                " +
        "<div id=\"availableSequencesContent\">\r\n                    Placeholder where you can search for existing sequences\r\n                <\/div>\r\n            " +
        "<\/div>\r\n            " +
        "<div class=\"tab-pane\" id=\"addSequence\">\r\n                " +
        "<div class=\"well\">\r\n                    " +
        "<section contenteditable=\"true\">\r\n                        " +
        "<div><input type=\"text\" id=\"sequenceTitleSetter\" value=\"Sequence title\"\/>\r\n\r\n                            " +
        "<div class=\"checkbox\"><label for=\"markAsNewSequence\"> <input type=\"checkbox\"\r\n                                                                                         id=\"markAsNewSequence\"> Mark as\r\n                                new\r\n                                sequence<\/label><\/div>\r\n                        " +
        "<\/div>\r\n                        " +
        "<table id=\"stepsTable\" class=\"table table-bordered table-hover\">\r\n                        " +
        "<\/table>\r\n                    " +
        "<\/section>\r\n                   " +
        "<button type=\"button\" id=\'sequencePreviewButton\' class=\"btn btn-default centered actionButton\"\r\n                            aria-label=\"Left Align\"\r\n                            style=\"margin-top:20px;\" onclick=\"preview();\">\r\n                        <span class=\"fa fa-play-circle-o\" aria-hidden=\"true\"><\/span> Preview\r\n                    <\/button>\r\n                    " +
        "<button type=\"button\" id=\'sequenceSaveButton\' class=\"btn btn-default centered\"\r\n                            aria-label=\"Left Align\"\r\n                            style=\"margin-top:20px;\"\r\n                            onclick=\"save();\">\r\n                        <span class=\"fa fa-floppy-o\" aria-hidden=\"true\"><\/span> Save\r\n                    <\/button>\r\n                    " +
        "<button type=\"button\" id=\'clearStepsButton\' class=\"btn btn-default centered\"\r\n                            aria-label=\"Left Align\"\r\n                            style=\"margin-top:20px;\"\r\n                            onclick=\"clearStepsInSequence();\">\r\n                        <span class=\"fa fa-refresh\" aria-hidden=\"true\"><\/span> Clear\r\n                    <\/button>\r\n                " +
        "<\/div>\r\n                " +
        "<div class=\"well\">Available actions:\r\n                    " +
        "<div class=\"well-sm\">\r\n                        " +
        "<button data-toggle=\"tooltip\" data-placement=\"top\"\r\n                                title=\"Click and drag over elements on the page to select them\"\r\n                                class=\"btn btn-success\" role=\"button\"\r\n                                id=\"startDragDropButton\"\r\n                                onClick=\"startSelectionOfElement(true);\"><span class=\"fa fa-plus\"><\/span> Add element\r\n                            step\r\n                        <\/button>\r\n                        " +
        "<button class=\"btn btn-info\" role=\"button\"\r\n                                id=\"startEmptyStepButton\"\r\n                                onClick=\"startSelectionOfElement(false);\"><span class=\"fa fa-plus\"><\/span> Add page step\r\n                        <\/button>\r\n                        " +
        "<button class=\"btn btn-danger\" id=\"cancelDragDropButton\"\r\n                                role=\"button\"\r\n                                onClick=\"jQueryDragSelector.off();\"><span class=\"fa fa-times\"><\/span> Cancel\r\n                        <\/button>\r\n                    " +
        "<\/div>\r\n                " +
        "<\/div>\r\n                " +
        "<div class=\"alert alert-danger\" id=\"noElementsSelectedDiv\" style=\"display: none;\">\r\n                    " +
        "<button type=\"button\" class=\"close\" onclick=\"jQuery(\'#noElementsSelectedDiv\').hide();\"\r\n                            aria-label=\"Close\"><span\r\n                            aria-hidden=\"true\">&times;<\/span><\/button>\r\n                    No elements were selected, please try again\r\n                <\/div>\r\n                " +
        "<div class=\"alert alert-danger\" id=\"noStepsInPreviewDiv\" style=\"display: none;\">\r\n                    <button type=\"button\" class=\"close\" onclick=\"jQuery(\'#noStepsInPreviewDiv\').hide();\"\r\n                            aria-label=\"Close\"><span\r\n                            aria-hidden=\"true\">&times;<\/span><\/button>\r\n                    No steps to preview. Please add steps.\r\n                <\/div>\r\n            " +
        "<\/div>\r\n        " +
        "<\/div>\r\n    " +
        "<\/div>\r\n" +
        "<\/div>\r\n" +
        "<div id=\"contentConsumptionModal\" class=\"modal\">\r\n    " +
        "<div class=\"modal-dialog\">\r\n        " +
        "<div class=\"modal-content\" style=\"width: 800px;\">\r\n            " +
        "<div class=\"modal-header ai-modal-title\">\r\n                " +
        "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span\r\n                        aria-hidden=\"true\">&times;<\/span><\/button>\r\n                " +
        "What would you like to learn?\r\n            " +
        "<\/div>\r\n            " +
        "<div class=\"modal-body\"><\/div>\r\n            " +
        "<div class=\"modal-footer\">\r\n                <button data-dismiss=\"modal\" class=\"btn btn-default\">Close<\/button>\r\n            <\/div>\r\n        " +
        "<\/div>\r\n    " +
        "<\/div>\r\n" +
        "<\/div>";
    return webHelpElementsHTML;
}

function moveTableDivsToModal() {
    jQuery("#webHelpMainContent").appendTo("#contentConsumptionModal .modal-body");
    jQuery('.nav-tabs a[href=#addSequence]').hide();
}

function createNewNavigationButton(navbarButtonElement, addTextToNavbar) {
    var dropdownButtonHtml = '<button class="btn light" id="contentConsumptionNavButton" >' +
        '<i class="fa fa-info-circle"></i>';

    if (addTextToNavbar) {
        dropdownButtonHtml += 'App Help';
    }

    dropdownButtonHtml += '</button>';

    //Add to navbar if need be
    if ((jQuery('.ai-navbar').length > 0) && (jQuery(navbarButtonElement + ':last-of-type').hasClass('nav-right'))) {
        jQuery(navbarButtonElement + ':last-of-type').after(dropdownButtonHtml);
        jQuery('#contentConsumptionNavButton').addClass('nav-right');
    } else {
        jQuery(navbarButtonElement).after(dropdownButtonHtml);
    }

    jQuery('#contentConsumptionNavButton').click(function (event) {
        event.preventDefault();
        jQuery('#contentConsumptionModal').modal('show');
    });

    jQuery('#contentConsumptionNavButton').attr('title', 'App Help');

}

function setUpAddEditTable() {
    var t = jQuery("#stepsTable").dataTable({
            "sDom": "",
            "language": {
                "emptyTable": "New steps will show up here!"
            },
            "aoColumns": [
                {
                    "sTitle": "",
                    "sWidth": "10%"
                },
                {
                    "sTitle": "Step",
                    "sWidth": "25%"
                },
                {
                    "sTitle": "Attribute",
                    "sWidth": "7%",
                    "sClass": "invisibleColumnInStepsTable"
                    /*Needs to be invisible, datatables bVisible false removes it from the DOM altogether*/
                },
                {
                    "sTitle": "Value",
                    "sWidth": "8%",
                    "sClass": "invisibleColumnInStepsTable"
                },
                {
                    "sTitle": "Content",
                    "sWidth": "50%"
                }
            ]
        }
    ).rowReordering();
    makeEditable();
}

function setNewSequenceCountBadgeOnHelpIcon(numNewSequences) {
    var $helpIcon = jQuery('#contentConsumptionNavButton');
    if (numNewSequences > 0) {
        $helpIcon.attr('data-badge', numNewSequences);
    } else {
        $helpIcon.removeAttr('data-badge');
    }
}

function startSelectionOfElement(elementSelection) {

    /* Close the sidemenu if it is open*/
    var status = jQuery('#webHelpMainContent').attr("data-status");
    if(elementSelection && status === "opened") {
        jQuery(".toggler").trigger("click");
    }

    if (elementSelection) {
        jQueryDragSelector.on();
        jQuery("#startDragDropButton").tooltip({
            trigger: 'manual'
        }).tooltip("show");
        setTimeout(function () {
            jQuery("#startDragDropButton").tooltip('hide');
        }, 3000);
    } else {
        createStepForThisElement([]);
    }
}

function createStepForThisElement(arrayOfElems) {
    var t = jQuery("#stepsTable").DataTable();
    var elemText = "";
    var elemType = "";
    for (var i = 0; i < arrayOfElems.length; i++) {
        elemText += arrayOfElems[i].value + "&";
        elemType += arrayOfElems[i].attribute + "&";
    }
    elemText = elemText.substring(0, elemText.length - 1);
    elemType = elemType.substring(0, elemType.length - 1);
    t.row.add([
        "<span class='fa fa-times' aria-hidden='true' onclick='removeThisStep()'></span>",
        "Editable title",
        elemType,
        elemText,
        "Editable content"])
        .draw();
    makeEditable();
}

function removeThisStep() {
    var t = jQuery("#stepsTable").DataTable();
    t.row(jQuery(event.target).parents('tr')).remove().draw();
}

function alertNoSelection() {
    jQuery('#noElementsSelectedDiv').show();
    jQueryDragSelector.on();
}

function preview() {
    //destroyAndRedrawTable(); //Doesn't respect row reordering
    var previewSteps = getCurrentTablePreviewSteps();

    if (previewSteps) {
        var preview = introJs();
        preview.setOptions({
            steps: previewSteps,
            showProgress: true,
            showBullets: false,
            tooltipPosition: 'auto'
        });
        jQuery('.toggler').trigger('click'); //Close the side menu
        setTimeout(function () {
            preview.start();
        }, 500);
    }
}

function save() {

    var sequenceTitle = jQuery("#sequenceTitleSetter").val().trim();
    var stepsToSave = getCurrentTablePreviewSteps();
    if (stepsToSave) {
        var testObject = {};
        testObject[sequenceTitle] = {
            "sequenceTitle": sequenceTitle,
            "appName": "Test App",
            //"url": "WebHelp",
            "data": stepsToSave,
            "isNew": jQuery('#markAsNewSequence').is(':checked')
        };

        // Put the object into storage
        var WebHelpName = 'WebHelp.' + appNameForWebHelp;
        if (localStorage.getItem(WebHelpName)) {
            var localStorageObject = JSON.parse(localStorage.getItem(WebHelpName));
            localStorageObject[sequenceTitle] = testObject[sequenceTitle];
            localStorage.setItem(WebHelpName, JSON.stringify(localStorageObject));
        } else {
            localStorage.setItem(WebHelpName, JSON.stringify(testObject));
        }

        jQuery("#sequenceSaveButton").attr('title', 'Saved!').tooltip({
            trigger: 'manual'
        }).tooltip("show");
        setTimeout(function () {
            jQuery("#sequenceSaveButton").tooltip('hide').attr('title', '');
        }, 500);

        var sequences = populateCurrentSequences();
        setNewSequenceCountBadgeOnHelpIcon(sequences.numNewSequences);
    }
}

function getCurrentTablePreviewSteps() {
    var tableHasData = !((jQuery("#stepsTable td").length <= 0) || ((jQuery("#stepsTable td").length === 1) && (jQuery("#stepsTable td").hasClass('dataTables_empty'))));
    if (!tableHasData) {
        jQuery('#noStepsInPreviewDiv').show();
        return false;
    }

    var previewSteps = [];

    var tableRows = jQuery("#stepsTable tr");
    var rows = [];

    jQuery.each(tableRows, function (index, element) {
        var cells = jQuery(element).find('td');
        if (cells.length > 0) {
            var thisRow = [];
            for (var n = 0; n < cells.length; n++) {
                thisRow.push(jQuery(cells[n]).text());
            }
            rows.push(thisRow);
        }
    });

    for (var n = 0; n < rows.length; n++) {
        var elemAttribVal = rows[n][3];
        var elemAttribType = rows[n][2];
        var stepTitle = rows[n][1];
        var content = rows[n][4];
        if (elemAttribVal) {
            var elem = "";
            if(elemAttribType != 'CSSPath') {
                elem = "[" + elemAttribType + "=\'" + elemAttribVal + "\']";
            } else {
                elem = elemAttribVal;
            }
            previewSteps.push({
                element: elem,
                intro: '<div><h3>' + stepTitle + '</h3><p>' + content + '</p></div>',
                position: 'bottom'
            });
        } else {
            previewSteps.push({
                intro: '<div><h3>' + stepTitle + '</h3><p>' + content + '</p></div>'
            });
        }
    }

    return previewSteps;
}

function populateCurrentSequences() {
    var isCreator = (getWindowParameters()['create'] != undefined) ? true : false;
    var retrievedHtml = '';
    var retrievedNewHtml = '';
    var retrievedPopularHtml = '';
    var retrievedSequences = retrieveLocalStorage();
    var numNewSequences = 0;
    if (retrievedSequences) {
        retrievedHtml += '<table id="availableSequencesList">';
        retrievedPopularHtml += '<table id="popularSequencesList">';
        jQuery.each(retrievedSequences, function (key, value) {
            var thisElement = "<tr>" +
                "<td><span class='fa fa-play-circle-o' aria-hidden='true' onclick='playThisSequence()'></span></td>" +
                "<td>" + key + "</td>" +
                "<td><span class='fa fa-edit' aria-hidden='true' onclick='editThisSequence()'></td>" +
                "<td><span class='fa fa-times' aria-hidden='true' onclick='removeThisSequence()'></td>" +
                "<td>" + JSON.stringify(value) + "</td>" +
                "</tr>";
            retrievedHtml += thisElement;
            retrievedPopularHtml += thisElement;
            if (value.isNew) {
                if (retrievedNewHtml === '') {
                    retrievedNewHtml += '<table id="newSequencesList">';
                }
                retrievedNewHtml += "<tr>" +
                "<td><span class='fa fa-play-circle-o' aria-hidden='true' onclick='playThisSequence()'></span></td>" +
                "<td>" + key + "</td>" +
                "<td><span class='fa fa-edit' aria-hidden='true' onclick='editThisSequence()'></td>" +
                "<td><span class='fa fa-times' aria-hidden='true' onclick='removeThisSequence()'></td>" +
                "<td>" + JSON.stringify(value) + "</td>" +
                "</tr>";
                retrievedSequences[key]['isNew'] = false;
                numNewSequences += 1;
            }
        });
        retrievedHtml += '</table>';
        retrievedPopularHtml += '</table>';
        if (retrievedNewHtml != '') {
            retrievedNewHtml += '</table>';
        }
        localStorage.setItem('WebHelp', JSON.stringify(retrievedSequences));
        jQuery('#availableSequencesContent').html(retrievedHtml);
        jQuery('#popularSequencesContent').html(retrievedPopularHtml);
        //listFilter(jQuery('#availableSequencesHeader'), jQuery('#availableSequencesList'));

        var t = jQuery("#availableSequencesList").dataTable({
                "sDom": '<"top"f<"clear">>', //It should be a searchable table
                "oLanguage": {
                    "sSearch": "Search title and content: "
                },
                "aoColumns": [
                    {
                        "sTitle": "",
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": "Topic"
                    },
                    {
                        "sTitle": "",
                        "sWidth": "10%",
                        "bVisible": isCreator
                    },
                    {
                        "sTitle": "",
                        "sWidth": "10%",
                        "bVisible": isCreator
                    },
                    {
                        "sTitle": "Data",
                        "bVisible": false,
                        "bSearchable": true
                    }
                ]
            }
        );

        var p = jQuery("#popularSequencesList").dataTable({
                "sDom": '<"top"f<"clear">>', //It should be a searchable table
                "oLanguage": {
                    "sSearch": "Search title and content: "
                },
                "aoColumns": [
                    {
                        "sTitle": "",
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": "Topic"
                    },
                    {
                        "sTitle": "",
                        "sWidth": "10%",
                        "bVisible": false
                    },
                    {
                        "sTitle": "",
                        "sWidth": "10%",
                        "bVisible": false
                    },
                    {
                        "sTitle": "Data",
                        "bVisible": false,
                        "bSearchable": true
                    }
                ]
            }
        );

        if (retrievedNewHtml != '') {
            jQuery('#whatsNewContent').html(retrievedNewHtml);
            var a = jQuery("#newSequencesList").dataTable({
                    "sDom": '<"top"f<"clear">>', //It should be a searchable table
                    "oLanguage": {
                        "sSearch": "Search title and content: "
                    },
                    "aoColumns": [
                        {
                            "sTitle": "",
                            "sWidth": "10%"
                        },
                        {
                            "sTitle": "Topic"
                        },
                        {
                            "sTitle": "",
                            "sWidth": "10%",
                            "bVisible": false
                        },
                        {
                            "sTitle": "",
                            "sWidth": "10%",
                            "bVisible": false
                        },
                        {
                            "sTitle": "Data",
                            "bVisible": false,
                            "bSearchable": true
                        }
                    ]
                }
            );
        }
        jQuery('td .fa-play-circle-o').attr('title', 'Play!');
        jQuery('td .fa-edit').attr('title', 'Edit');
        jQuery('td .fa-times').attr('title', 'Delete');

        //Convert all the tables to bootstrap-tables
        jQuery('#webHelpMainContent table.dataTable').addClass('table table-hover table-striped table-bordered');
        return {
            numNewSequences: numNewSequences
        }
    }
}

function retrieveLocalStorage() {
    var WebHelpName = 'WebHelp.' + appNameForWebHelp;
    if (localStorage.getItem(WebHelpName)) {
        return JSON.parse(localStorage.getItem(WebHelpName));
    } else {
        return {};
    }
}

function makeEditable() {
    jQuery("#stepsTable").tableEdit({
        columnsTr: "1,4"
    });
}

function clearStepsInSequence() {
    //Destroy and reinitialize the table to get the edited data
    jQuery("#stepsTable").DataTable().clear().draw();
}

function playSequence(sequenceName) {
    var stepsForThisSequence = retrieveLocalStorage()[sequenceName];
    if (stepsForThisSequence.isNew) {
        removeThisSequenceAsNew(sequenceName);
    }
    var play = introJs();
    play.setOptions({
        steps: stepsForThisSequence.data,
        showProgress: true,
        showBullets: false
    });
    jQuery('.toggler').trigger('click'); //Close the side menu
    if (jQuery('#contentConsumptionModal').is(':visible')) {
        jQuery('#contentConsumptionModal').modal('hide');
    }
    play.start();
}

function playThisSequence() {
    var t = jQuery("#" + jQuery('.dataTable:visible').attr('id')).DataTable();
    //t.row(jQuery(event.target).parents('tr')).remove().draw();
    var sequenceName = [t.row(jQuery(event.target).parents('tr')).data()[1]];
    playSequence(sequenceName);
}

function removeThisSequenceAsNew(sequenceName) {
    var allStoredSteps = retrieveLocalStorage();
    delete allStoredSteps[sequenceName].isNew;
    var WebHelpName = 'WebHelp.' + appNameForWebHelp;
    localStorage.setItem(WebHelpName, JSON.stringify(allStoredSteps));
    var sequences = populateCurrentSequences();
    setNewSequenceCountBadgeOnHelpIcon(sequences.numNewSequences);
}

function editThisSequence() {
    var t = jQuery("#availableSequencesList").DataTable();
    var thisSequenceTitle = t.row(jQuery(event.target).parents('tr')).data()[1];
    //t.row(jQuery(event.target).parents('tr')).remove().draw();
    var stepsForThisSequence = retrieveLocalStorage()[thisSequenceTitle];
    var stepsTable = jQuery("#stepsTable").DataTable();
    stepsTable.clear().draw();
    jQuery.each(stepsForThisSequence.data, function (index, element) {
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
        stepsTable.row.add([
            "<span class='fa fa-times' aria-hidden='true' onclick='removeThisStep()'></span>",
            title,
            elementAttr,
            elementId,
            text])
            .draw();
    });
    makeEditable();
    jQuery('#sequenceTitleSetter').val(thisSequenceTitle);
    jQuery('.nav-tabs a[href=#addSequence]').tab('show');
}

function removeThisSequence() {
    var t = jQuery("#availableSequencesList").DataTable();
    var storedSteps = retrieveLocalStorage();
    delete storedSteps[t.row(jQuery(event.target).parents('tr')).data()[1]];

    var WebHelpName = 'WebHelp.' + appNameForWebHelp;
    localStorage.setItem(WebHelpName, JSON.stringify(storedSteps));
    var sequences = populateCurrentSequences();
    setNewSequenceCountBadgeOnHelpIcon(sequences.numNewSequences);
}

function getWindowParameters() {
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
            var arr = [query_string[pair[0]], pair[1]];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    }
    return query_string;
};
var jQueryDragSelector = {
    on: function () {
        var self = this;
        if (!this.isOn) {
            /*
             * Drag and drop jQuery enhancements under MIT license
             * http://threedubmedia.com/code/event/drag
             * http://threedubmedia.com/code/event/drop
             */
            jQuery(document)
                .drag("start", function (ev, dd) {
                    return jQuery('<div class="selection" />')
                        .css('opacity', .5)
                        .css('z-index', 999999999999)
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

                    self.rectangleSelect('div, input, textarea, button, a, ul, li, tr, td, span', selectionBoundingRect);

                    /*Make sure only the biggest parent element is selected*/
                    var selectedDivs = [];
                    jQuery.each(jQuery('.dragSelectedElement'), function (index, element) {
                        jQuery(element).children().removeClass('dragSelectedElement');
                        if (index > 0) {
                            jQuery(element).removeClass('dragSelectedElement');
                        }
                    });
                    jQuery(jQuery('.dragSelectedElement')[0]).addClass('fadedDragSelectedElement');

                    //jQuery('.dragSelectedElement').addClass('fadedDragSelectedElement');

                    if (jQuery('.dragSelectedElement').length > 0) {
                        /*
                         * Just show the tooltip on one element even if multiple elements are selected
                         * The faded element CSS will make it clear which elements are selected
                         */
                        jQuery(jQuery('.dragSelectedElement')[0])
                            .popover({
                                html: true,
                                trigger: 'manual',
                                placement: 'auto top',
                                container: 'body', /*Show on top of all elements*/
                                content: '<div>Go ahead with this selection ?</div>' +
                                '<div class="btn-group">' +
                                '<button type="button" class="btn btn-success" onclick="jQueryDragSelector.confirmSelection(true)">Yes</button>' +
                                '<button class="btn btn-danger" onclick="jQueryDragSelector.confirmSelection(false)" type="button">No</button>' +
                                '</div>'
                            })
                            .popover('show');
                        /*TODO: I need to find a better way than binding global onclick events to the buttons*/
                    } else {
                        alertNoSelection();
                    }
                });

            this.isOn = true;
        }
    },
    isOn: false,
    selectedObjects: [],
    confirmSelection: function (confirmBoolean) {
        jQuery(jQuery('.dragSelectedElement')[0]).popover('destroy');
        var arrayOfObjects = [];
        /* Open the side-menu if it is closed*/
        var status = jQuery('#webHelpMainContent').attr("data-status");
        if(status === "closed") {
            jQuery(".toggler").trigger("click");
        }

        if (confirmBoolean) {
            jQuery.each(jQuery('.dragSelectedElement'), function (index, element) {
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
            createStepForThisElement(arrayOfObjects);
        } else {
            jQuery('.dragSelectedElement').removeClass('dragSelectedElement fadedDragSelectedElement');
        }

        this.selectedObjects = arrayOfObjects;
        this.off();
    },
    off: function () {
        if (this.isOn) {
            jQuery(document).unbind("draginit").unbind("dragstart").unbind("drag").unbind("dragend");
            jQuery('div, input, textarea, button, a, ul, li, tr, td, span').unbind("drop");
            this.isOn = false;
        }
    },
    rectangleSelect: function (selector, selectionBoundingRect) {
        var elements = [];
        jQuery(selector).each(function () {
            var $this = jQuery(this);
            var elemBoundingRect = $this.get(0).getBoundingClientRect();
            if ((selectionBoundingRect.top > elemBoundingRect.top)
                || (selectionBoundingRect.left > elemBoundingRect.left)
                || (selectionBoundingRect.right < elemBoundingRect.right)
                || (selectionBoundingRect.bottom < elemBoundingRect.bottom)) {
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
    }
};




;
jQuery.fn.extend({
    getPath: function () {
        var path, node = this;
        while (node.length) {
            var realNode = node[0], name = realNode.localName;
            if (!name) break;
            name = name.toLowerCase();

            var parent = node.parent();

            var sameTagSiblings = parent.children(name);
            if (sameTagSiblings.length > 1) {
                allSiblings = parent.children();
                var index = allSiblings.index(realNode) + 1;
                if (index > 1) {
                    name += ':nth-child(' + index + ')';
                }
            }

            path = name + (path ? '>' + path : '');
            node = parent;
        }

        return path;
    }
});

jQuery.fn.xpathEvaluate = function (xpathExpression) {
    // NOTE: vars not declared local for debug purposes
    $this = this.first(); // Don't make me deal with multiples before coffee

    // Evaluate xpath and retrieve matching nodes
    xpathResult = this[0].evaluate(xpathExpression, this[0], null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    result = [];
    while (elem = xpathResult.iterateNext()) {
        result.push(elem);
    }

    $result = jQuery([]).pushStack( result );
    return $result;
};
(function() {
    var method;
    var noop = function () {};
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
/*
 * @Version: 0.1
 * @Release: 2014-02-19
 */

jQuery.fn.tableEdit = function(settings, callback, activeMasks) {
    /*
     *
     * Settings default
     *
     */

    var defaults = {
        classTd: "tdEdit", //class to cell editable
        columnsTr: null, //index td editable, if null all td editables Ex.: "1,2,3,4,5"
        classBtEdit: "btEdit", //class of button for click event

        enableDblClick: true,

        textBtSave: "Save", //text button save
        textBtEdit: "Edit", //text button edit

        callBackObject: null, //receive object
        callback: function(){}, //return object with of values change
        activeMasks: function(){} //use to call function enable masks

    }; //cells editables

    //load settings
    settings = jQuery.extend(defaults, settings);

    return this.each(function() {

        //if columnsTr is not null, split to array.
        var tdsIndex = (settings.columnsTr != null) ? settings.columnsTr.split(",") : null;
        //get all rows
        var trsTable = jQuery(this).find("tbody tr");

        //funtion verify exists index
        function inArray(needle, haystack) {
            var length = haystack.length;
            for (var i = 0; i < length; i++) {
                if (haystack[i] == needle)
                    return true;
            }
            return false;
        }

        //loop in all rows
        for (k = 0; k < trsTable.length; k++) {
            element = jQuery(trsTable)[k];
            tdsLine = jQuery(element).find("td");

            jQuery.each(tdsLine, function(index, td) {
                //if cell not have button edit
                if (jQuery(td).find("." + settings.classBtEdit).length == 0) {
                    /*
                     * insert class edition
                     * for all columns or columns in tdsIndex
                     */
                    if (tdsIndex == null) {
                        jQuery(td).addClass(settings.classTd);
                    } else {
                        if (inArray(index, tdsIndex)) {
                            jQuery(td).addClass(settings.classTd);
                        }
                    }
                }
            });
        };

        //return create new input text
        function mountNewInput(cell) {

            var element = document.createElement("input");
            //get string in attribute ref
            var attrsString = jQuery(cell).attr("ref");
            if(attrsString != null){
                //split attributes
                var attrsArray = attrsString.split(",");

                var currentObj;
                for(n=0; n < attrsArray.length; n++){
                    //separate name of attribute and value attribute
                    currentObj = attrsArray[n].split(":");
                    jQuery(element).attr(jQuery.trim(currentObj[0]), jQuery.trim(currentObj[1]));
                }
            }else{
                indexCell = jQuery(cell).parent().children().index(jQuery(cell));
                element.setAttribute("name", "column_"+indexCell);
                element.setAttribute("type", "text");
            }

            element.setAttribute("value", jQuery(cell).text());
            jQuery(element).addClass("edit_from_te");
            return element;
        }

        //insert input in cell
        function editTr(tr) {
            var cells = jQuery(tr).find("." + settings.classTd);

            jQuery.each(jQuery(cells), function(index, cell) {
                newInput = mountNewInput(jQuery(cell));
                jQuery(cell).html("");
                jQuery(cell).append(newInput);
            });
            settings.activeMasks.call(this);
        }

        //insert input in cell
        function editTd(cell) {
            newInput = mountNewInput(jQuery(cell));
            jQuery(cell).html("");
            jQuery(cell).append(newInput).find("input").focus();
            settings.activeMasks.call(this);
        }

        //save values of inputs and create a object with values
        function saveTr(tr) {
            var cells = jQuery(tr).find("." + settings.classTd);
            var callBackObject = {};
            jQuery.each(jQuery(cells), function(index, cell) {
                input = jQuery(cell).find('input');
                if(typeof(jQuery(input).attr("name")) != "undefined"){
                    newValue = jQuery.trim(jQuery(input).val());
                    callBackObject[jQuery(input).attr("name")] = newValue;
                    jQuery(cell).html("");
                    jQuery(cell).append(newValue);
                }
            });
            settings.callBackObject = callBackObject;
        }

        //return object created in saveTr()
        function getCallback(){
            settings.callback(settings.callBackObject);//how can I send var a,b here
        }

        //change buttons, save to edit and edit to save
        function changeBt(bt)
        {
            var hasClass = jQuery(bt).hasClass(settings.classBtEdit);
            jQuery(bt).attr("class", "").addClass( ((hasClass) ? "btSave" : settings.classBtEdit) );

            jQuery(bt).text(((hasClass) ? settings.textBtSave : settings.textBtEdit));
            jQuery(bt).val(((hasClass) ? settings.textBtSave : settings.textBtEdit));
        }

        //event click in button
        function clickEvent() {

            var element_clicked = jQuery(this);
            element_verify = element_clicked;

            //search tr, element by element
            while (jQuery(element_verify).is("tr") == false) {
                element_verify = jQuery(element_verify).parent();
            }

/*            //if save button, call function save
            if (jQuery(this).hasClass("btSave")) {
                saveTr(element_verify);
                getCallback();
            } else {
                //if edit button, call function save
                editTr(element_verify);
            }*/
            saveTr(element_verify);
        }

        //edit cell with double click
        function dblClickEvent(){
            //if enableDblClick is true
            if(settings.enableDblClick){
                elementBt = jQuery(this).parent().find("."+settings.classBtEdit);
                changeBt(elementBt);
                editTd(jQuery(this));
            }
        }

        //bind to click's
        jQuery("." + settings.classTd).bind("focusout", clickEvent);
        jQuery("." + settings.classTd).bind("dblclick", dblClickEvent);
    });
}
;
