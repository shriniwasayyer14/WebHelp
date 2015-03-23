/* globals jQuery, WebHelpTemplates */
jQuery.fn.extend({
	tableList: function (elementSelector, data) {
		return new TableList({
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
			listItemTemplate: 'WebHelpSequenceStepListItem',
			searchListTemplate: 'WebHelpTableListSearch',
			useSearchFilter: true
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
		var i = 0;
		var arrayItem = [];
		while (i < 5) {
			arrayItem.push(['', 'Title' + i, 'Type' + i, 'Value' + i, 'Content' + i]);
			i += 1;
		}
		var a = new TableList({
			element: '#webHelpMainContent',
			data: arrayItem,
			listTemplate: 'WebHelpSequenceConsumptionList',
			listItemTemplate: 'WebHelpSequenceListItem'
		});
	};

	TableList.prototype.renderList = function () {
		var $listTemplate = jQuery(WebHelpTemplates[this.listTemplate]);
		var $searchListTemplate = jQuery(WebHelpTemplates[this.searchListTemplate]);
		//If we have the list already, remove the data and re-render
		jQuery(this.element).children('.' + $listTemplate.attr('class')).remove();
		if (this.useSearchFilter) {
			jQuery(this.element).children('.' + $searchListTemplate.attr('class')).remove();
		}

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
		//Attach default classes to the containers and the lists
		jQuery(this.element).addClass('tableListContainer');
		$listTemplate.addClass('tableList');
		if (this.useSearchFilter) {
			jQuery(this.element).append($searchListTemplate).append($listTemplate);
			var self = this;
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
			if (!rowLength || rowLength != $thisListItemTemplate.children('div').length) {
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
		return jQuery(this.element).find('ul > li:not(.header)').length;
	};

	TableList.prototype.getData = function () {
		/*No data binding, we have to evaluate this lazily*/
		var listItems = jQuery(this.element).find('ul > li:not(.header)');
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
		var $listItems = jQuery(this.element).find('.' + jQuery(WebHelpTemplates[this.listTemplate]).attr('class')).find('li');
		var $searchBox = jQuery(this.element).find('.' + jQuery(WebHelpTemplates[this.searchListTemplate]).attr('class')).find('input');
		var val = '^(?=.*\\b' + $searchBox.val().trim().split(/\s+/).join('\\b)(?=.*\\b') + ').*$';
		var reg = RegExp(val, 'i');
		var text;

		$listItems.show().addClass('searchResults').filter(function () {
			text = jQuery(this).text().replace(/\s+/g, ' ');
			return !reg.test(text);
		}).hide();
	};

	TableList.prototype.setData = function (givenData) {
		this.data = givenData;
	};

	return TableList;
})();

