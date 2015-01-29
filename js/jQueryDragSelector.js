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




