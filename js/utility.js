/* globals window, setInterval, require, module*/
module.exports = {
	/**
	 * Get the parameters used in the URL query string
	 *
	 * @returns {{}} An object of the different parameters used in the URL
	 * @private
	 */
	_getWindowParameters: function () {
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
	},
	/**
	 * Bind click actions to the play and edit buttons
	 *
	 * @param {WebHelp} webHelpInstance The current instance of WebHelp
	 * @param {Object} webHelpInstance.ui
	 * @api private
	 * @private
	 */
	_bindPlayEditButtons: function (webHelpInstance) {
		var creation = require("./creation.js");
		var consumption = require("./consumption.js");
		//attach sequence specific handlers
		webHelpInstance.ui.webHelpMainContent.on('click', '.play-sequence', function (event) {
			consumption._playClickedSequence(webHelpInstance, event);
		});
		webHelpInstance.ui.webHelpMainContent.on('click', '.edit-sequence', function (event) {
			creation._editThisSequence(webHelpInstance, event);
		});
		webHelpInstance.ui.webHelpMainContent.on('click', '.remove-sequence', function (event) {
			creation._removeThisSequence.bind(webHelpInstance, event);
		});
	},
	/**
	 * Attach click icons to the given lists
	 *
	 * @api private
	 * @param {WebHelp} webHelpInstance the current instance of the WebHelp object
	 * @param {Object} webHelpInstance.ui
	 * @private
	 */
	_attachClickActionsToLists: function (webHelpInstance) {
		var creation = require("./creation.js");
		var consumption = require("./consumption.js");
		if (webHelpInstance.mode !== 'create') {
			webHelpInstance.ui.webHelpMainContent.find('div.iconClass-play').parents('li.webHelpSequenceList:not(.header)').attr('title', 'Play!').unbind('click').on('click', function (event) {
				consumption._playClickedSequence(webHelpInstance, event);
			});
		} else {
			webHelpInstance.ui.webHelpMainContent.find('div.iconClass-play').attr('title', 'Play!').unbind('click').on('click', function (event) {
				consumption._playClickedSequence(webHelpInstance, event);
			});
		}
		webHelpInstance.ui.webHelpMainContent.find('div.iconClass-edit').attr('title', 'Edit').unbind('click').on('click', function (event) {
			creation._editThisSequence(webHelpInstance, event);
		});
		webHelpInstance.ui.webHelpMainContent.find('div.iconClass-remove').attr('title', 'Delete').unbind('click').on('click', function (event) {
			creation._removeThisSequence.bind(webHelpInstance, event);
		});
	},
	/**
	 * Attach all required icons within the main UI content
	 *
	 * @api private
	 * @param {WebHelp} webHelpInstance
	 * @param {Object} webHelpInstance.ui
	 * @private
	 */
	_attachIcons: function (webHelpInstance) {
		for (var icon in webHelpInstance.iconClass) {
			if (webHelpInstance.iconClass.hasOwnProperty(icon)) {
				webHelpInstance.ui.webHelpMainContent.find(".iconClass-" + icon).removeClass(webHelpInstance.iconClass[icon]).addClass(webHelpInstance.iconClass[icon]);
			}
		}
	},
	_bindCloseButton: function (webHelpInstance) {
		webHelpInstance.ui.webHelpConsumptionModalClose = webHelpInstance.ui.webHelpConsumptionModalClose || jQuery('#webHelpConsumptionModalClose');
		webHelpInstance.ui.webHelpConsumptionModalClose.on('click',	webHelpInstance.onSequenceClose);
	},
	/**
	 * Perform the necessary actions to show the consumption mode
	 * @param {WebHelp} webHelpInstance The current instance of WebHelp
	 * @param {Object} webHelpInstance.ui The UI parameters
	 * @private
	 */
	_showHelpConsumptionMode: function (webHelpInstance) {
		var consumption = require("./consumption.js");
		var WebHelpTemplates = require("./WebHelpTemplates.js").WebHelpTemplates;
		var utility = this;
		consumption._addHelpIcon(webHelpInstance, webHelpInstance.helpIconPosition);
		webHelpInstance.ui.webHelpMainContent = jQuery("#webHelpMainContent");
		if (webHelpInstance.ui.webHelpMainContent.length <= 0) {
			var modalContent = jQuery(WebHelpTemplates.WebHelpContent);
			var webHelpContent = jQuery(WebHelpTemplates.WebHelpConsumption);
			utility._attachIcons(webHelpInstance);
			var $body = jQuery("body");
			$body.append(modalContent);
			$body.append(webHelpContent);
			webHelpInstance.ui.webHelpMainContent = jQuery("#webHelpMainContent");
		}
		webHelpInstance.ui.webHelpMainContent.appendTo("#contentConsumptionModal .modal-body");
		jQuery('.nav-tabs a[href=#addSequence]').hide();
		jQuery('#globalWebHelpCreatorActionsWell').hide();
		utility._refreshWhatsNew(webHelpInstance).then(function () {
			utility._populateCurrentSequences(webHelpInstance);
			webHelpInstance.watchWhatsNew = setInterval(function () {
				utility._refreshWhatsNew(webHelpInstance);
			}, 1800000);

		//This is used in Aladdin Desktop Help
		//to show the list of sequences available to view.
		if (webHelpInstance.showHelpContentsOnLoad){
			webHelpInstance.showSequenceConsumptionModal();
		} else if (webHelpInstance.showIntroOnLoad) {
				var introSeqId = webHelpInstance.getSequenceIdForSequenceName('Introduction');
				if (introSeqId && !webHelpInstance.isSequenceAlreadyViewed({seqId: introSeqId})) {
					webHelpInstance.playSequence('Introduction');
				}
			}
		});
		webHelpInstance.provideEmailSupport(webHelpInstance.supportEmail);
		//set up close action binding
		utility._bindCloseButton(webHelpInstance);
	},
	/**
	 * Perform the necessary actions to show the consumption mode
	 * @param {WebHelp} webHelpInstance The current instance of WebHelp
	 * @param {Object} webHelpInstance.ui The UI parameters
	 * @private
	 */
	_showHelpCreationMode: function (webHelpInstance) {
		var TableList = require("./WebHelpTableListBuilder.js").TableList;
		var jQueryDragSelector = require("./jQueryDragSelector.js").jQueryDragSelector;
		var creation = require("./creation.js");
		var WebHelpTemplates = require("./WebHelpTemplates").WebHelpTemplates;
		var utility = this;
		webHelpInstance.ui.webHelpMainContent = jQuery("#webHelpMainContent");
		if (webHelpInstance.ui.webHelpMainContent.length === 0) {
			var webHelpContent = jQuery(WebHelpTemplates.WebHelpCreator);
			jQuery("body").append(webHelpContent);
			webHelpInstance.ui.webHelpMainContent = jQuery("#webHelpMainContent");
		}
		var sidebarToggleButton = jQuery(WebHelpTemplates.WebHelpSidebarToggle);
		webHelpInstance.ui.webHelpMainContent
			.addClass('creationModeSidebar')
			.addClass('hideSidebar')
			.append(sidebarToggleButton)
			.children(':not(#creationModeSidebarshowHideSpan)').hide();
		webHelpInstance.ui.sidebarToggleButton = jQuery('#creationModeSidebarshowHideSpan');
		webHelpInstance.ui.sidebarToggleButton.on('click', function () {
			if (webHelpInstance.ui.webHelpMainContent.hasClass('hideSidebar')) {
				webHelpInstance.ui.webHelpMainContent.children(':not(#creationModeSidebarshowHideSpan)').show('slow', function () {
					webHelpInstance.ui.webHelpMainContent.removeClass('hideSidebar', 300);
				});
			} else {
				webHelpInstance.ui.webHelpMainContent.children(':not(#creationModeSidebarshowHideSpan)').hide('slow', function () {
					webHelpInstance.ui.webHelpMainContent.addClass('hideSidebar', 300);
				});
			}
		});
		webHelpInstance.stepsTable = new TableList({
			element: "#stepsTable",
			useData: false, //Create one generic step
			listTemplate: 'WebHelpSequenceCreationList',
			listItemTemplate: 'WebHelpSequenceStepListItem',
			searchable: false,
			sortable: true,
			status: "N"
		});
		creation._initScratchPadTable(webHelpInstance);
		jQuery('.nav-tabs a[href=#addSequence]').trigger('click');
		//attach event handlers to webHelpContent
		jQuery("#sequencePreviewButton").on("click", function () {
			creation._previewClickedSequence(webHelpInstance);
		});
		jQuery("#sequenceSaveButton").on("click", function () {
			creation._saveSequence(webHelpInstance);
		});
		jQuery("#clearStepsButton").on("click", function () {
			creation._clearStepsInSequence(webHelpInstance);
		});
		jQuery("#startDragDropButton").on("click", function () {
			creation._startSelectionOfElement(webHelpInstance);
		});
		jQuery("#startEmptyStepButton").on("click", function () {
			creation._createStepForThisElement(webHelpInstance);
		});
		jQuery("#cancelDragDropButton").on("click", jQueryDragSelector.off);
		jQuery("#noElementsSelectedButton").on("click", jQuery('#noElementsSelectedDiv').hide);
		jQuery("#noStepsInPreviewButton").on("click", jQuery('#noStepsInPreviewDiv').hide);
		jQuery("#saveAllHelpSequencesToFileButton").on("click", function () {
			utility._saveAllHelpSequencesToFile(webHelpInstance);
		});
		window.onbeforeunload = function (e) {
			var scratchPadData = webHelpInstance.scratchPadTable.getData();
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
		jQuery(webHelpInstance.stepsTable.element).on("click", ".remove-step", function (event) {
			creation._removeThisStep(webHelpInstance, event);
		});
		utility._attachIcons(webHelpInstance);
		var helpIconElement = jQuery(webHelpInstance.helpIconPosition);
		var currentTitleHTML = helpIconElement.html();
		currentTitleHTML += "[Edit mode]";
		var elem;
		if (helpIconElement && helpIconElement.length > 1) {
			elem = helpIconElement[0];
		} else {
			elem = helpIconElement;
		}
		jQuery(elem).html(currentTitleHTML);
		webHelpInstance.getSequencesCallback(webHelpInstance).then(function () {
			utility._populateCurrentSequences(webHelpInstance);
		});
	},
	/**
	 * Add/remove new contents to the new sequences table
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {Array} newSequences The list of new sequences
	 * @private
	 */
	_updateNewSequencesTable: function (webHelpInstance, newSequences) {
		var creation = require("./creation.js");
		var consumption = require("./consumption.js");
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
		if (webHelpInstance.mode === "consume") {
			consumption._initWhatsNewTable(webHelpInstance, aaData);
		} else {
			creation._initScratchPadTable(webHelpInstance, aaData);
		}
	},
	/**
	 * Save the current help sequences toa  file (Chrome only!)
	 * @param {WebHelp} webHelpInstance The current instance
	 * @param {Object} webHelpInstance.sequences The sequences attribute (including created sequences)
	 * @private
	 */
	_saveAllHelpSequencesToFile: function (webHelpInstance) {
		//get required data
		//Pretty print the JSON content
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
		//Syntax: JSON.stringify(value[, replacer[, space]])
		var utility = this;
		var allSequences = webHelpInstance.sequences;
		jQuery.map(allSequences, function (val) {
			val.status = "O";
		});
		var content = JSON.stringify(allSequences, null, '\t');
		var link = document.createElement('a'); //create a hyperlink
		var mimeType = 'application/json';
		//set attributes on top of the link
		link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(content));
		link.setAttribute('download', webHelpInstance.webHelpName + '.json');
		//trigger the download
		link.click();
		//destroy the link
		//TODO The line below to remove child breaks, check why
		//link.parentNode.removeChild(link);
		utility._updateNewSequencesTable(webHelpInstance, []);
	},
	/**
	 * Refresh new sequence count and data
	 *
	 * @param {WebHelp} webHelpInstance The current instance of WebHelp
	 * @param {Array} webHelpInstance.visitedSequenceIdList
	 * @returns {promise} Resolves when all sequences have been pulled, without a resolve parameter,
	 * @private
	 */
	_refreshWhatsNew: function (webHelpInstance) {
		var consumption = require("./consumption.js");
		var dfd = new jQuery.Deferred();
		var sequences = webHelpInstance.sequences; //new function
		var utility = this;
		webHelpInstance.getSequencesCallback(webHelpInstance)
			.then(function () {
				return consumption._getAllVisitedSequences(webHelpInstance);
			})
			.then(function () {
				var seenSequences = webHelpInstance.visitedSequenceIdList;
				var newSequences = [];
				for (var seqName in sequences) {
					if (sequences.hasOwnProperty(seqName)) {
						var seq = sequences[seqName];
						if (seq.visible !== undefined && seq.visible === false) {
							continue;
						}
						var seqId = seq.seqId.toString();
						if (seenSequences.indexOf(seqId) < 0) {
							newSequences.push(seq);
						}
					}
				}
				utility._updateNewSequencesTable(webHelpInstance, newSequences); // new function
				if (newSequences.length >= 1) {
					utility._populateCurrentSequences(webHelpInstance);
				}
				//update badge icon
				var numOfNewSequences = newSequences.length;
				if (webHelpInstance.mode !== "create") {
					if (numOfNewSequences > 0) {
						webHelpInstance.ui.webHelpButton.attr('data-badge', numOfNewSequences + ' new');
					} else {
						webHelpInstance.ui.webHelpButton.removeAttr('data-badge');
					}
				}
				dfd.resolve();
			});
		return dfd.promise();
	},
	/**
	 * Populates all current sequences from the sequences parameter that was read from the file
	 *
	 * @param {WebHelp} webHelpInstance The current instance
	 * @param {Object} webHelpInstance.sequences The sequences that were read into the attribute
	 * @param {Object} webHelpInstance.ui The UI parameter
	 * @private
	 */
	_populateCurrentSequences: function (webHelpInstance) {
		var TableList = require("./WebHelpTableListBuilder.js").TableList;
		var utility = this;
		if (!webHelpInstance.hasOwnProperty('visitedSequenceIdList')) {
			webHelpInstance.visitedSequenceIdList = [];
		}
		var retrievedSequences = webHelpInstance.sequences;
		jQuery.map(retrievedSequences, function (val) {
			if (val.status === "E") {
				delete retrievedSequences[val];
			}
		});
		if (retrievedSequences) {
			var sequenceData = [];
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
				if (webHelpInstance.isSequenceAlreadyViewed({seqId: sequenceContent.seqId})) {
					supplementalClasses.push('seen');
				} else {
					supplementalClasses.push('unseen');
				}
			});
			webHelpInstance.availableSequencesTable = new TableList({
				element: '#availableSequencesContent',
				data: sequenceData,
				listTemplate: 'WebHelpSequenceConsumptionList',
				listItemTemplate: 'WebHelpSequenceListItem',
				supplementalClasses: supplementalClasses
			});
			utility._attachIcons(webHelpInstance);
			utility._attachClickActionsToLists(webHelpInstance);
		}
	},
	/**
	 * Get all the steps relevant to the current table
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {TableList} webHelpInstance.stepsTable
	 * @returns {Boolean|Array} previewSteps
	 * @private
	 */
	_getCurrentTablePreviewSteps: function (webHelpInstance) {
		var rows = webHelpInstance.stepsTable.getData();
		if (rows.length <= 0) {
			jQuery('#noStepsInPreviewDiv').show();
			return false;
		}
		var previewSteps = [];
		for (var n = 0; n < rows.length; n++) {
			//escape ampersands (we may need other special characters in the content
			var elemAttribVal = rows[n][3].replace(/&/g, '').trim();
			var iframeElementId = rows[n][4].replace(/&/g, '').trim();
			if (iframeElementId === '') {
				iframeElementId = false;
			}
			var elemAttribType = rows[n][2].replace(/&/g, '').trim();
			var stepTitle = rows[n][1];
			var content = rows[n][5];
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
	},
	/**
	 * Get the status for the given table
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {TableList} webHelpInstance.stepsTable
	 * @returns {String} The status
	 * @private
	 */
	_getCurrentTableStatus: function (webHelpInstance) {
		return webHelpInstance.stepsTable.getStatus();
	},
	/**
	 * Get the current sequence ID for the given table
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {TableList} webHelpInstance.stepsTable
	 * @returns {String|int} The Sequence ID
	 * @private
	 */
	_getCurrentTableSeqId: function (webHelpInstance) {
		return webHelpInstance.stepsTable.getSeqId();
	}
};
