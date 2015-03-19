/* globals jQuery */
jQuery.fn.extend({
    tableListBuilder: function (elementSelector, data) {
        return new TableListBuilder({
            element: elementSelector,
            data: data
        });
    }
});

var TableList;
TableList = (function () {
    function TableList(tableListOptions) {
        if (tableListOptions.element === undefined) {
            //console.error('TableList needs an element to work on');
            throw new Error('TableList needs an element to work on');
        }
        var defaultOptions = {
            element: '',
            expandable: true,
            searchable: true,
            emptyListIndicator: 'No data yet!',
            data: [],
            useData: true,
            listTemplate: 'WebHelpSequenceConsumptionList',
            listItemTemplate: 'WebHelpSequenceStepListItem'
        };
        for (var option in defaultOptions) {
            if (!defaultOptions.hasOwnProperty(option)) {
                continue;
            }
            this[option] = tableListOptions.hasOwnProperty(option) ? tableListOptions[option] : defaultOptions[option];
        }
        this.renderList();
    }

    TableList.prototype.test = function () {
        i = 0;
        var arrayItem = [];
        while (i < 5) {
            arrayItem.push(['', 'Title' + i, 'Type' + i, 'Value' + i, 'Content' + i]);
            i += 1;
        }
        var a = new TableList({element: '#webHelpMainContent', data: arrayItem});
    };

    TableList.prototype.renderList = function () {
        var $listTemplate = jQuery(WebHelpTemplates[this.listTemplate]);
        //If we have the list already, remove the data and re-render
        jQuery(this.element).children('.' + $listTemplate.attr('class')).remove();
        var myListHtml = '';
        var listItemTemplate = WebHelpTemplates[this.listItemTemplate];
        if (this.useData) {
            var length = this.data.length;
            if (!length) {
                $listTemplate.html('<li>' + this.emptyListIndicator + '</li>');
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
                $listTemplate.append($thisListItemTemplate);
            }
        } else {
            var $listItemTemplate = jQuery(listItemTemplate);
            $listTemplate.append($listItemTemplate);
        }
        jQuery(this.element).append($listTemplate);
    };
    TableList.prototype.addRow = function () {
        var $listTemplate = jQuery(WebHelpTemplates[this.listTemplate]);
        if (this.useData) {

        } else {
            jQuery(this.element)
                .children('.' + $listTemplate.attr('class'))
                .append(jQuery(WebHelpTemplates[this.listItemTemplate]));
        }
    };

    return TableList;
})();

