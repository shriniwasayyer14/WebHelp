/* globals setTimeout, require, module, introJs, utility*/
module.exports = {
	/**
	 * Trigger the selection event (start dragging to select a DOM element)
	 * Only available in consumption mode
	 *
	 * @param {WebHelp} webHelpInstance The current instance of WebHelp
	 * @param {Boolean} webHelpInstance.usesIframes Does this app use iFrames ?
	 * @private
	 */
	_startSelectionOfElement: function (webHelpInstance) {
		var self = this;
		var jQueryDragSelector = require("./jQueryDragSelector.js").jQueryDragSelector;
		var WebHelpTemplates = require("./WebHelpTemplates").WebHelpTemplates;
		/* Close the sidemenu if it is open*/
		webHelpInstance.ui.sidebarToggleButton.trigger('click');
		jQueryDragSelector.setPaneState(true);
		var dragSelectionOptions = {
			usesIframes: webHelpInstance.usesIframes
		};
		jQueryDragSelector.on(dragSelectionOptions, function (selectionDetails) {
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
							self._createStepForThisElement(webHelpInstance, arrayOfObjects, selectionDetails);
						}
					});
					webHelpInstance.ui.sidebarToggleButton.trigger('click');
				}.bind(webHelpInstance));
				jQuery(".drag-select-no").on("click", function () {
					jQueryDragSelector.confirmSelection(false, element);
					webHelpInstance.ui.sidebarToggleButton.trigger('click');
				});
			} else {
				jQuery('#noElementsSelectedDiv').show();
				webHelpInstance.ui.sidebarToggleButton.trigger('click');
			}
		});
		jQuery("#startDragDropButton").tooltip({
			trigger: 'manual'
		}).tooltip("show");
		setTimeout(function () {
			jQuery("#startDragDropButton").tooltip('hide');
		}, 3000);
	},
	/**
	 * Create a step for a given element once it's selected
	 *
	 * @param {WebHelp} webHelpInstance The current WebHelp instance
	 * @param {Array=} arrayOfElems An array containing all the selected elements (if used)
	 * @param {Object=} selectionDetails selection details (especially if it contains iFrames and such (if used)
	 * @private
	 */
	_createStepForThisElement: function (webHelpInstance, arrayOfElems, selectionDetails) {
		var $stepsTable = jQuery("#stepsTable");
		var elemText = '';
		var elemType = '';
		var elemFrame = '';
		if (arrayOfElems) {
			for (var i = 0; i < arrayOfElems.length; i++) {
				elemText += arrayOfElems[i].value;
				if (selectionDetails.iframeAttributes) {
					elemFrame = selectionDetails.iframeAttributes.$frame.id;
				}
				elemText += "&";
				elemType += arrayOfElems[i].attribute + "&";
			}
			webHelpInstance.stepsTable.addRow([
				"",
				"Editable title",
				elemType,
				elemText,
				elemFrame,
				"Editable content"]);
		} else {
			webHelpInstance.stepsTable.addRow();
		}
		$stepsTable.find('.remove-step').unbind('click');
		$stepsTable.find('.remove-step').on('click', function (event) {
			this._removeThisStep(webHelpInstance, event);
		});
		utility._attachIcons(webHelpInstance);
	},
	/**
	 * Remove the clicked step
	 * @param {WebHelp} webHelpInstance The current instance
	 * @param {event} event The click event
	 * @private
	 */
	_removeThisStep: function (webHelpInstance, event) {
		var utility = require("./utility.js");
		webHelpInstance.stepsTable.removeRow(event);
		if (!webHelpInstance.stepsTable.numRows()) {
			webHelpInstance.stepsTable.addRow();
			utility._attachIcons(webHelpInstance);
		}
	},
	/**
	 * Preview the clicked sequence (from the table, usually)
	 * @param {WebHelp} webHelpInstance
	 * @param {Object} webHelpInstance.ui The UI parameter
	 * @param {Boolean} webHelpInstance.usesIframes Does this app use iFrames ?
	 * @param {TableList} webHelpInstance.stepsTable The TableList used to list the steps
	 * @private
	 */
	_previewClickedSequence: function (webHelpInstance) {
		var utility = require("./utility.js");
		var previewSteps = utility._getCurrentTablePreviewSteps(webHelpInstance);
		if (previewSteps) {
			var introJsObj = introJs();
			if (webHelpInstance.usesIframes) {
				for (var i = previewSteps.length - 1; i >= 0; i--) {
					var thisStep = previewSteps[i];
					if (thisStep.iframeId) {
						thisStep.element = jQuery('#' + thisStep.iframeId).contents().find(thisStep.element).get(0);
					}
				}
			}
			var options = {
				steps: previewSteps,
				showProgress: true,
				showBullets: false,
				tooltipPosition: 'auto'
			};
			for (var option in webHelpInstance.defaultIntroJsOptions) {
				if (webHelpInstance.defaultIntroJsOptions.hasOwnProperty(option)) {
					options[option] = webHelpInstance.defaultIntroJsOptions[option];
				}
			}
			introJsObj.setOptions(options);
			webHelpInstance.ui.sidebarToggleButton.trigger('click'); //Close the side menu
			setTimeout(function () {
				introJsObj.start();
			}, 500);
		}
	},
	/**
	 * Refresh the scratchpad as needed
	 *
	 * @param {WebHelp} webHelpInstance The current WebHelp instance
	 * @param {Object} webHelpInstance.sequences The sequences attribute
	 * @private
	 */
	_refreshScratchpad: function (webHelpInstance) {
		var utility = require("./utility.js");
		var unsavedSequences = {};
		jQuery.map(webHelpInstance.sequences, function (val, i) {
			var status = val.status;
			if (status !== "O") {
				unsavedSequences[i] = val;
			}
		});
		utility._updateNewSequencesTable(webHelpInstance, unsavedSequences);
	},
	/**
	 * Initialize the table in the scratchpad
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {Array=} aaData
	 * @private
	 */
	_initScratchPadTable: function (webHelpInstance, aaData) {
		var TableList = require("./WebHelpTableListBuilder.js").TableList;
		webHelpInstance.scratchPadTable = new TableList({
			element: '#scratchpadContent',
			data: aaData || [],
			listTemplate: 'WebHelpSequenceConsumptionList',
			listItemTemplate: 'WebHelpSequenceListItem'
		});
	},
	/**
	 * Save a given sequences to the sequences object
	 * @param {WebHelp} webHelpInstance The current instance
	 * @param {Object} webHelpInstance.sequences The current sequences
	 * @private
	 */
	_saveSequence: function (webHelpInstance) {
		var utility = require("./utility.js");
		var saveStatus = 'Sequence saved successfully!';
		try {
			var sequenceTitle = jQuery("#sequenceTitleSetter").val().trim();
			var stepsToSave = utility._getCurrentTablePreviewSteps(webHelpInstance);
			var sequences = webHelpInstance.sequences;
			var sequenceStatus = utility._getCurrentTableStatus(webHelpInstance);
			if (sequenceStatus === "E") {
				var editedSeqId = utility._getCurrentTableSeqId(webHelpInstance);
				jQuery.map(webHelpInstance.sequences, function (val, i) {
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
				tool: webHelpInstance.appName,
				status: sequenceStatus
			};
			// Populate scratchpad
			this._refreshScratchpad(webHelpInstance);
			utility._populateCurrentSequences(webHelpInstance);
		} catch (error) {
			saveStatus = 'Error saving the sequence!';
		} finally {
			var $showSequenceSavedSuccessAlert = jQuery('#showSequenceSavedSuccessAlert');
			this._clearStepsInSequence(webHelpInstance);
			$showSequenceSavedSuccessAlert.html(saveStatus).show();
			setTimeout(function () {
				$showSequenceSavedSuccessAlert.hide();
			}, 2000);
		}
	},
	/**
	 * Clear out all the steps in the current sequence
	 *
	 * @param {WebHelp} webHelpInstance The current instance
	 * @private
	 */
	_clearStepsInSequence: function (webHelpInstance) {
		var utility = require("./utility.js");
		//Destroy and reinitialize the table to get the edited data
		webHelpInstance.stepsTable.renderList();
		utility._attachIcons(webHelpInstance);
		jQuery("#sequenceTitleSetter").val("").attr("placeholder", "Sequence Title");
		webHelpInstance.stepsTable.setStatus("N");
	},
	/**
	 * Edit the sequence that was clicked on
	 * @param {WebHelp} webHelpInstance The current instance
	 * @param {TableList} webHelpInstance.stepsTable The table used by the current instance
	 * @param {Event} event The click event
	 * @private
	 */
	_editThisSequence: function (webHelpInstance, event) {
		var utility = require("./utility.js");
		var thisSequenceTitle = jQuery(event.target).parents('li').find('.webHelpSequenceItem-title').text();
		var sequence = webHelpInstance.sequences[thisSequenceTitle];
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
		webHelpInstance.stepsTable.setData(data);
		webHelpInstance.stepsTable.setStatus("E");
		webHelpInstance.stepsTable.setSeqId(seqId);
		webHelpInstance.stepsTable.useData = true;
		webHelpInstance.stepsTable.renderList();
		utility._attachIcons(webHelpInstance);
		webHelpInstance.stepsTable.useData = false;
		jQuery('#sequenceTitleSetter').val(thisSequenceTitle);
		jQuery('.nav-tabs a[href=#addSequence]').tab('show');
	},
	/**
	 * Removes (undefines) a given sequence
	 * @param {WebHelp} webHelpInstance
	 * @param {Object} webHelpInstance.sequences The stored sequences
	 * @param {event} event
	 * @private
	 */
	_removeThisSequence: function (webHelpInstance, event) {
		var utility = require("./utility.js");
		var sequenceName = jQuery(event.target).parents('li').find('.webHelpSequenceItem-title').text();
		var storedSequences = webHelpInstance.sequences;
		//use undefined instead of delete, the garbage collector will take care of it
		storedSequences[sequenceName] = undefined;
		utility._populateCurrentSequences(webHelpInstance);
		this._refreshScratchpad(webHelpInstance);
	}
};
