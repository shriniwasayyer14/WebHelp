/* globals jQuery, document, require, exports */
/* exported jQueryDragSelector */
var selectableItems = 'div, label, input, textarea, button, a, ul, li, tr, td, span';
var jQueryDragSelector = {
	on: function (options, callback) {
		"use strict";
		require("../css/jQueryDragSelector.css");
		var self = this;
		if (!this.isOn) {
			/*
			 * Drag and drop jQuery enhancements - under MIT license
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
					var $selectedElements = self.rectangleSelect(selectableItems, selectionBoundingRect);
					var selectedIframeAttributes = false;
					if (!$selectedElements.length && options.usesIframes) {
						var skipLoop = false;
						jQuery('body').find('iframe').each(function (iFrameIndex, iFrameElement) {
							if (skipLoop) {
								return true;
							}
							var overrideElementObject = {
								'$body': jQuery(iFrameElement).contents().find('html').find('body'),
								'$frame': iFrameElement
							};
							$selectedElements = self.rectangleSelect(selectableItems, selectionBoundingRect, overrideElementObject);
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
		require("../css/jQueryDragSelector.css");
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
			jQuery(selectableItems).unbind("drop");
			this.isOn = false;
		}
	},
	rectangleSelect: function (selector, selectionBoundingRect, iframeAttr) {
		"use strict";
		require("../css/jQueryDragSelector.css");
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
exports.jQueryDragSelector = jQueryDragSelector;
