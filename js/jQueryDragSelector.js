var jQueryDragSelector = {
    on: function () {
        /*
         * Drag and drop jQuery enhancements under MIT license
         * http://threedubmedia.com/code/event/drag
         * http://threedubmedia.com/code/event/drop
         */
        jQuery(document)
            .drag("start", function (ev, dd) {
                return jQuery('<div class="selection" />')
                    .css('opacity', .5)
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

                /*Make sure only the biggest parent element is selected*/
                var selectedDivs = [];
                jQuery.each(jQuery('.dragSelectedElement'), function (index, element) {
                    jQuery(element).children().removeClass('dragSelectedElement');
                });

                jQuery('.dragSelectedElement').addClass('fadedDragSelectedElement');

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
                            content: '<div>Go ahead with this selection ?</div>' +
                            '<div class="btn-group">' +
                            '<button type="button" class="btn btn-success" onclick="jQueryDragSelector.confirmSelection(true)">Yes</button>' +
                            '<button class="btn btn-danger" onclick="jQueryDragSelector.confirmSelection(false)" type="button">No</button>' +
                            '</div>'
                        })
                        .popover('show');
                    /*TODO: I need to find a better way than binding global onclick events to the buttons*/
                } else {
                    jQuery('#selectedElements').html("");
                }
            });

        jQuery('div, input, select, textarea, button, a')
            .drop("start", function (ev, dd) {
                jQuery(this).addClass("active");
            })
            .drop(function (ev, dd) {
                /*http://javascript.info/tutorial/coordinates*/
                var isElementBounded = true;
                var elemBoundingRect = this.getBoundingClientRect();

                var selectionBoundingRect = {
                    top: (dd.offsetY < 0) ? dd.startY + dd.offsetY : dd.startY,
                    bottom: (dd.offsetY < 0) ? dd.startY : dd.startY + dd.offsetY,
                    left: (dd.offsetX < 0) ? dd.startX + dd.offsetX : dd.startX,
                    right: (dd.offsetX < 0) ? dd.startX : dd.startX + dd.offsetX
                };

                if ((selectionBoundingRect.top > elemBoundingRect.top)
                    || (selectionBoundingRect.left > elemBoundingRect.left)
                    || (selectionBoundingRect.right < elemBoundingRect.right)
                    || (selectionBoundingRect.bottom < elemBoundingRect.bottom)) {
                    /*The selection box does not contain the div*/
                    isElementBounded = false;
                }
                if (isElementBounded) {
                    if (jQuery(this).hasClass("dragSelectedElement")) {
                        jQuery(this).removeClass("dragSelectedElement");

                        /*
                         * Drop action goes from biggest to smallest element
                         * Once we remove the selected class from the parent, we add it to the children (if any)
                         * so that they get toggled out in the next round
                         */
                        jQuery(this).children().addClass("dragSelectedElement");
                    } else {
                        jQuery(this).addClass("dragSelectedElement");
                    }
                }
            })
            .drop("end", function () {
                jQuery(this).removeClass("active");
            });
        jQuery.drop({
            multi: true
        });
    },
    selectedObjects: [],
    confirmSelection: function (confirmBoolean) {
        jQuery(jQuery('.dragSelectedElement')[0]).popover('destroy');
        var arrayOfObjects = [];
        if (confirmBoolean) {
            jQuery.each(jQuery('.dragSelectedElement'), function (index, element) {
                var objectForArray = {
                    'attribute': '',
                    'value': ''
                };
                if (element.id) {
                    objectForArray.attribute = 'id';
                    objectForArray.value = element.id;
                } else if (element.name) {
                    objectForArray.attribute = 'name';
                    objectForArray.value = element.name;
                } else if (element.className) {
                    var jQueryClassName = element.className.split(/\s+/).join(' .');
                    if (jQuery(jQueryClassName).length === 1) {
                        objectForArray.attribute = 'className';
                        objectForArray.value = jQueryClassName;
                    } else {
                        objectForArray.attribute = 'boundingClientRect';
                        objectForArray.value = element.getBoundingClientRect();
                    }
                }
                arrayOfObjects.push(objectForArray);
            });
            createStepForThisElement(arrayOfObjects);
        }
        jQuery('.dragSelectedElement').removeClass('dragSelectedElement fadedDragSelectedElement');
        this.selectedObjects = arrayOfObjects;
        this.off();
    },
    off : function() {
        jQuery(document).unbind("draginit dragstart drag dragend");
    }
};


