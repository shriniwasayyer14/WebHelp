/* globals jQuery */
jQuery.fn.extend({
    tableListBuilder: function(elementSelector, data) {
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
            listTemplate: 'WebHelpSequenceConsumptionList',
            listItemTemplate: 'WebHelpSequenceStepListItem'
        };
        for (var option in defaultOptions) {
            if (!defaultOptions.hasOwnProperty(option)) {
                continue;
            }
            this[option] = tableListOptions.hasOwnProperty(option) ? tableListOptions[option] : defaultOptions[option];
        }
    }
    TableList.prototype.greet = function () {
        alert(this.tableListOptions);
    };

    TableList.prototype.renderList = function () {
        var $listTemplate = jQuery(WebHelpTemplates[this.listTemplate]);
        //If we have the list already, remove the data and re-render
        if (jQuery(this.element).has($listTemplate).length) {
            jQuery(this.element).find($listTemplate).remove();
        }
        var myListHtml = '';
        var length = this.data.length;
        if (!length) {
            $listTemplate.html('<li>' + this.emptyListIndicator + '</li>');
            jQuery(this.element).append($listTemplate);
            return;
        }
        for (var i = 0; i < length; i++) {
            var thisRow = this.data[i];
            var $listItemTemplate = jQuery(WebHelpTemplates[this.listItemTemplate]);
            var rowLength = thisRow.length;
            if (!rowLength) {
                continue;
            }
            for (var j = 0; j < rowLength; j++) {
                jQuery($listItemTemplate.find('span')[j]).html(thisRow[j]);
            }
            $listTemplate.append($listItemTemplate);
        }
        jQuery(this.element).append($listTemplate);
    };

    return TableList;
})();

