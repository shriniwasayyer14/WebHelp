/*globals require, exports*/
/**
 * @namespace TableList
 *
 */
var TableList;
TableList = (function () {
	"use strict";
	/**
	 * Creates the TableList object with the specified settings
	 * @param {Object} tableListOptions The configuration options for the TableList
	 * @param {String} [tableListOptions.element] (DOM selector) The element on which to initialize the TableList
	 * @param {String} [tableListOptions.emptyListIndicator='No data yet!'] What to show when you get an empty list
	 * @param {String} [tableListOptions.listTemplate=WebHelpSequenceConsumptionList]
	 * @param {String} [tableListOptions.listItemTemplate=WebHelpSequenceStepListItem]
	 * @param {String} [tableListOptions.searchListTemplate=WebHelpTableListSearch]
	 * @param {Boolean} [tableListOptions.expandable=true] Is expandable
	 * @param {Boolean} [tableListOptions.searchable=true] Is searchable
	 * @constructor [TableList]
	 * @class TableList
	 * @this TableList
	 */
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
		var WebHelpTemplates = require("./WebHelpTemplates").WebHelpTemplates;
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
		var WebHelpTemplates = require("./WebHelpTemplates").WebHelpTemplates;
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
		var WebHelpTemplates = require("./WebHelpTemplates").WebHelpTemplates;
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
		var WebHelpTemplates = require("./WebHelpTemplates").WebHelpTemplates;
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

exports.TableList = TableList;
