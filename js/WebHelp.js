/* globals jQuery, jQueryDragSelector, window, WebHelpTemplates, introJs, setTimeout, setInterval, TableList */
var WebHelp;
WebHelp = (function () {
	"use strict";
	function WebHelp(WebHelpOptions) {
		//setup defaults
		var defaultOptions = {
			appName: 'DefaultApp',
			mode: 'consume',
			helpIconPosition: '.ai-header .ai-header-title',
			showIntroOnLoad: false,
			usesFontAwesome: false,
			parameters: _getWindowParameters(),
			ui: {},
			sequences: {},
			sequencesBaseUrl: '/WebHelp/',
			visitedBaseUrl: '/weblications/etc/getPrefs.epl',
			usesFlexbox: false,
			usesIframes: false
		};
		if (!WebHelpOptions) {
			WebHelpOptions = defaultOptions;
		}
		for (var option in defaultOptions) {
			if (!defaultOptions.hasOwnProperty(option)) {
				continue;
			}
			this[option] = WebHelpOptions.hasOwnProperty(option) ? WebHelpOptions[option] : defaultOptions[option];
		}
		this.webHelpName = 'WebHelp.' + this.appName;
		//setup icon classes
		if (this.usesFontAwesome === true) {
			this.iconClass = {
				"remove": "fa fa-times",
				"play": "fa fa-play-circle-o",
				"save": "fa fa-floppy-o",
				"clear": "fa fa-refresh",
				"new": "fa fa-plus",
				"add": "fa fa-plus",
				"info": "fa fa-info-circle",
				"edit": "fa fa-edit",
				"upload": "fa fa-upload",
				"next": "fa fa-step-forward",
				"prev": "fa fa-step-backward",
				"done": "fa fa-times"
			};
		} else { //default to bootstrap
			this.iconClass = {
				"remove": "glyphicon glyphicon-remove",
				"play": "glyphicon glyphicon-play-circle",
				"new": "glyphicon glyphicon-plus",
				"save": "glyphicon glyphicon-floppy-disk",
				"clear": "glyphicon glyphicon-refresh",
				"add": "glyphicon glyphicon-plus",
				"info": "glyphicon glyphicon-info-sign",
				"edit": "glyphicon glyphicon-edit",
				"upload": "glyphicon glyphicon-upload",
				"next": "glyphicon glyphicon-step-forward",
				"prev": "glyphicon glyphicon-step-backward",
				"done": "glyphicon glyphicon-remove"
			};
		}
		this.defaultIntroJsOptions = {
			nextLabel: 'Next <span class=\"' + this.iconClass.next + '\"></span>',
			prevLabel: '<span class=\"' + this.iconClass.prev + '\"></span> Previous',
			skipLabel: '<span class=\"' + this.iconClass.done + '\"></span>',
			doneLabel: '<span class=\"' + this.iconClass.done + '\"></span>'
		};
		//build the gui
		if (this.parameters.create !== undefined) {
			this.mode = "create";
			_showHelpCreationMode(this);
		} else {
			this.mode = "consume";
			_showHelpConsumptionMode(this);
		}
		_bindPlayEditButtons(this);
	}

	/**
	 * Get the parameters used in the URL query string
	 *
	 * @returns {{}} An object of the different parameters used in the URL
	 * @private
	 */
	function _getWindowParameters() {
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
				query_string[pair[0]] = [query_string[pair[0]], pair[1]];
				// If third or later entry with this name
			} else {
				query_string[pair[0]].push(pair[1]);
			}
		}
		return query_string;
	}

	/**
	 * Bind click actions to the play and edit buttons
	 *
	 * @param {WebHelp} WebHelpInstance The current instance of WebHelp
	 * @param {Object} WebHelpInstance.ui
	 * @api private
	 * @private
	 */
	function _bindPlayEditButtons(WebHelpInstance) {
		//attach sequence specific handlers
		WebHelpInstance.ui.webHelpMainContent.on('click', '.play-sequence', function (event) {
			_playClickedSequence(WebHelpInstance, event);
		});
		WebHelpInstance.ui.webHelpMainContent.on('click', '.edit-sequence', function (event) {
			_editThisSequence(WebHelpInstance, event);
		});
		WebHelpInstance.ui.webHelpMainContent.on('click', '.remove-sequence', function (event) {
			_removeThisSequence.bind(WebHelpInstance, event);
		});
	}

	/**
	 * Programmatically trigger the sequence list modal when in consumption mode
	 * @api public
	 */
	WebHelp.prototype.showSequenceConsumptionModal = function () {
		if (this.mode === 'consume') {
			jQuery('#contentConsumptionModal').modal('show');
			jQuery('.modal-backdrop').css({
				'zIndex': '100'
			});
		}
	};

	/**
	 * Add the help icon to the specified page element
	 *
	 * @api private
	 * @param {WebHelp} WebHelpInstance the current instance of WebHelp
	 * @param {Object} WebHelpInstance.ui
	 * @param {selector=} navbarButtonElement
	 * @param {Boolean=} addTextToNavbar
	 * @private
	 */
	function _addHelpIcon (WebHelpInstance, navbarButtonElement, addTextToNavbar) {
		if (!navbarButtonElement) {
			navbarButtonElement = WebHelpInstance.helpIconPosition;
		}
		var dropdownButtonHtml = '<button class="btn light" id="contentConsumptionNavButton" >' +
			'<i class="' + WebHelpInstance.iconClass.info + '"></i>';
		if (addTextToNavbar) {
			dropdownButtonHtml += 'App Help';
		}
		dropdownButtonHtml += '</button>';
		WebHelpInstance.ui.webHelpButton = jQuery(dropdownButtonHtml);
		//Add to navbar if need be
		if ((jQuery('.ai-navbar').length > 0) && (jQuery(navbarButtonElement + ':last-of-type').hasClass('nav-right'))) {
			jQuery(navbarButtonElement + ':last-of-type').after(WebHelpInstance.ui.webHelpButton);
			WebHelpInstance.ui.webHelpButton.addClass('nav-right');
		} else {
			jQuery(navbarButtonElement).after(WebHelpInstance.ui.webHelpButton);
		}
		WebHelpInstance.ui.webHelpButton.on('click', function (event) {
			event.preventDefault();
			WebHelpInstance.showSequenceConsumptionModal();
		});
		WebHelpInstance.ui.webHelpButton.attr('title', 'App Help');
	}

	/**
	 * Perform the necessary actions to show the consumption mode
	 * @param {WebHelp} WebHelpInstance The current instance of WebHelp
	 * @param {Object} WebHelpInstance.ui The UI parameters
	 * @private
	 */
	function _showHelpConsumptionMode(WebHelpInstance) {
		_addHelpIcon(WebHelpInstance, WebHelpInstance.helpIconPosition);
		WebHelpInstance.ui.webHelpMainContent = jQuery("#webHelpMainContent");
		if (WebHelpInstance.ui.webHelpMainContent.length <= 0) {
			var modalContent = jQuery(WebHelpTemplates.WebHelpContent);
			var webHelpContent = jQuery(WebHelpTemplates.WebHelpConsumption);
			_attachIcons(WebHelpInstance);
			var $body = jQuery("body");
			$body.append(modalContent);
			$body.append(webHelpContent);
			WebHelpInstance.ui.webHelpMainContent = jQuery("#webHelpMainContent");
		}
		WebHelpInstance.ui.webHelpMainContent.appendTo("#contentConsumptionModal .modal-body");
		jQuery('.nav-tabs a[href=#addSequence]').hide();
		jQuery('#globalWebHelpCreatorActionsWell').hide();
		_refreshWhatsNew(WebHelpInstance).then(function () {
			_populateCurrentSequences(WebHelpInstance);
			WebHelpInstance.watchWhatsNew = setInterval(function () {
				_refreshWhatsNew(WebHelpInstance);
			}, 1800000);
			if (WebHelpInstance.showIntroOnLoad) {
				var introSeqId = WebHelpInstance.getSeqIdForSequence('Introduction');
				if (introSeqId && !WebHelpInstance.isThisSequenceSeen(introSeqId)) {
					WebHelpInstance.playSequence('Introduction');
				}
			}
		});
	}

	/**
	 * Perform the necessary actions to show the consumption mode
	 * @param {WebHelp} WebHelpInstance The current instance of WebHelp
	 * @param {Object} WebHelpInstance.ui The UI parameters
	 * @private
	 */
	function _showHelpCreationMode(WebHelpInstance) {
		WebHelpInstance.ui.webHelpMainContent = jQuery("#webHelpMainContent");
		if (WebHelpInstance.ui.webHelpMainContent.length === 0) {
			var webHelpContent = jQuery(WebHelpTemplates.WebHelpCreator);
			jQuery("body").append(webHelpContent);
			WebHelpInstance.ui.webHelpMainContent = jQuery("#webHelpMainContent");
		}
		var sidebarToggleButton = jQuery(WebHelpTemplates.WebHelpSidebarToggle);
		WebHelpInstance.ui.webHelpMainContent
			.addClass('creationModeSidebar')
			.addClass('hideSidebar')
			.append(sidebarToggleButton)
			.children(':not(#creationModeSidebarshowHideSpan)').hide();
		WebHelpInstance.ui.sidebarToggleButton = jQuery('#creationModeSidebarshowHideSpan');
		WebHelpInstance.ui.sidebarToggleButton.on('click', function () {
			if (WebHelpInstance.ui.webHelpMainContent.hasClass('hideSidebar')) {
				WebHelpInstance.ui.webHelpMainContent.children(':not(#creationModeSidebarshowHideSpan)').show('slow', function () {
					WebHelpInstance.ui.webHelpMainContent.removeClass('hideSidebar', 300);
				});
			} else {
				WebHelpInstance.ui.webHelpMainContent.children(':not(#creationModeSidebarshowHideSpan)').hide('slow', function () {
					WebHelpInstance.ui.webHelpMainContent.addClass('hideSidebar', 300);
				});
			}
		});
		WebHelpInstance.stepsTable = new TableList({
			element: "#stepsTable",
			useData: false, //Create one generic step
			listTemplate: 'WebHelpSequenceCreationList',
			listItemTemplate: 'WebHelpSequenceStepListItem',
			searchable: false,
			sortable: true,
			status: "N"
		});
		_initScratchPadTable(WebHelpInstance);
		jQuery('.nav-tabs a[href=#addSequence]').trigger('click');
		//attach event handlers to webHelpContent
		jQuery("#sequencePreviewButton").on("click", function () {
			_previewClickedSequence(WebHelpInstance);
		});
		jQuery("#sequenceSaveButton").on("click", function () {
			_saveSequence(WebHelpInstance);
		});
		jQuery("#clearStepsButton").on("click", function () {
			_clearStepsInSequence(WebHelpInstance);
		});
		jQuery("#startDragDropButton").on("click", function () {
			_startSelectionOfElement(WebHelpInstance);
		});
		jQuery("#startEmptyStepButton").on("click", function () {
			_createStepForThisElement(WebHelpInstance);
		});
		jQuery("#cancelDragDropButton").on("click", jQueryDragSelector.off);
		jQuery("#noElementsSelectedButton").on("click", jQuery('#noElementsSelectedDiv').hide);
		jQuery("#noStepsInPreviewButton").on("click", jQuery('#noStepsInPreviewDiv').hide);
		jQuery("#saveAllHelpSequencesToFileButton").on("click", function () {
			_saveAllHelpSequencesToFile(WebHelpInstance);
		});
		window.onbeforeunload = function (e) {
			var scratchPadData = WebHelpInstance.scratchPadTable.getData();
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
		jQuery(WebHelpInstance.stepsTable.element).on("click", ".remove-step", function (event) {
			_removeThisStep(WebHelpInstance, event);
		});
		_attachIcons(WebHelpInstance);
		var helpIconElement = jQuery(WebHelpInstance.helpIconPosition);
		var currentTitleHTML = helpIconElement.html();
		currentTitleHTML += "[Edit mode]";
		var elem;
		if (helpIconElement && helpIconElement.length > 1) {
			elem = helpIconElement[0];
		} else {
			elem = helpIconElement;
		}
		jQuery(elem).html(currentTitleHTML);
		_refreshAllSequences(WebHelpInstance).then(function () {
			_populateCurrentSequences(WebHelpInstance);
		});
	}

	/**
	 * Attach all required icons within the main UI content
	 *
	 * @api private
	 * @param {WebHelp} WebHelpInstance
	 * @param {Object} WebHelpInstance.ui
	 * @private
	 */
	function _attachIcons(WebHelpInstance) {
		for (var icon in WebHelpInstance.iconClass) {
			if (WebHelpInstance.iconClass.hasOwnProperty(icon)) {
				WebHelpInstance.ui.webHelpMainContent.find(".iconClass-" + icon).removeClass(WebHelpInstance.iconClass[icon]).addClass(WebHelpInstance.iconClass[icon]);
			}
		}
	}

	/**
	 * Save the current help sequences toa  file (Chrome only!)
	 * @param {WebHelp} WebHelpInstance The current instance
	 * @param {Object} WebHelpInstance.sequences The sequences attribute (including created sequences)
	 * @private
	 */
	function _saveAllHelpSequencesToFile(WebHelpInstance) {
		//get required data
		//Pretty print the JSON content
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
		//Syntax: JSON.stringify(value[, replacer[, space]])
		var allSequences = WebHelpInstance.sequences;
		jQuery.map(allSequences, function (val) {
			val.status = "O";
		});
		var content = JSON.stringify(allSequences, null, '\t');
		var link = document.createElement('a'); //create a hyperlink
		var mimeType = 'application/json';
		//set attributes on top of the link
		link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(content));
		link.setAttribute('download', this.webHelpName + '.json');
		//trigger the download
		link.click();
		//destroy the link
		//TODO The line below to remove child breaks, check why
		//link.parentNode.removeChild(link);
		_updateNewSequencesTable(WebHelpInstance, []);
	}

	/**
	 * Refresh new sequence count and data
	 *
	 * @param {WebHelp} WebHelpInstance The current instance of WebHelp
	 * @returns {promise} Resolves when all sequences have been pulled, without a resolve parameter,
	 * @private
	 */
	function _refreshWhatsNew(WebHelpInstance) {
		var dfd = new jQuery.Deferred();
		_refreshAllSequences(WebHelpInstance).then(function () {
			var sequences = WebHelpInstance.sequences; //new function
			var seenSequences = WebHelpInstance.getAllVisitedSequences(); //new function
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
			_updateNewSequencesTable(WebHelpInstance, newSequences); // new function
			if (newSequences.length >= 1) {
				_populateCurrentSequences(WebHelpInstance);
			}
			//update badge icon
			var numOfNewSequences = newSequences.length;
			if (WebHelpInstance.mode !== "create") {
				if (numOfNewSequences > 0) {
					WebHelpInstance.ui.webHelpButton.attr('data-badge', numOfNewSequences + ' new');
				} else {
					WebHelpInstance.ui.webHelpButton.removeAttr('data-badge');
				}
			}
			dfd.resolve();
		});
		return dfd.promise();
	}

	/**
	 * Populates all current sequences from the sequences parameter that was read from the file
	 *
	 * @param {WebHelp} WebHelpInstance The current instance
	 * @param {Object} WebHelpInstance.sequences The sequences that were read into the attribute
	 * @param {Object} WebHelpInstance.ui The UI parameter
	 * @private
	 */
	function _populateCurrentSequences(WebHelpInstance) {
		var retrievedSequences = WebHelpInstance.sequences;
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
				if (WebHelpInstance.isThisSequenceSeen(sequenceContent.seqId)) {
					supplementalClasses.push('seen');
				} else {
					supplementalClasses.push('unseen');
				}
			});
			WebHelpInstance.availableSequencesTable = new TableList({
				element: '#availableSequencesContent',
				data: sequenceData,
				listTemplate: 'WebHelpSequenceConsumptionList',
				listItemTemplate: 'WebHelpSequenceListItem',
				supplementalClasses: supplementalClasses
			});
			_attachIcons(WebHelpInstance);
			_attachClickActionsToLists(WebHelpInstance);
		}
	}
	/**
	 * Attach click icons to the given lists
	 *
	 * @api private
	 * @param {WebHelp} WebHelpInstance the current instance of the WebHelp object
	 * @param {Object} WebHelpInstance.ui
	 * @private
	 */
	function _attachClickActionsToLists(WebHelpInstance) {
		if (WebHelpInstance.mode !== 'create') {
			WebHelpInstance.ui.webHelpMainContent.find('div.iconClass-play').parents('li.webHelpSequenceList:not(.header)').attr('title', 'Play!').unbind('click').on('click', function (event) {
				_playClickedSequence(WebHelpInstance, event);
			});
		} else {
			WebHelpInstance.ui.webHelpMainContent.find('div.iconClass-play').attr('title', 'Play!').unbind('click').on('click', function (event) {
				_playClickedSequence(WebHelpInstance, event);
			});
		}
		WebHelpInstance.ui.webHelpMainContent.find('div.iconClass-edit').attr('title', 'Edit').unbind('click').on('click', function (event) {
			_editThisSequence(WebHelpInstance, event);
		});
		WebHelpInstance.ui.webHelpMainContent.find('div.iconClass-remove').attr('title', 'Delete').unbind('click').on('click', function (event) {
			_removeThisSequence.bind(WebHelpInstance, event);
		});
	}

	/**
	 * Trigger the selection event (start dragging to select a DOM element)
	 * Only available in consumption mode
	 *
	 * @param {WebHelp} WebHelpInstance The current instance of WebHelp
	 * @param {Boolean} WebHelpInstance.usesIframes Does this app use iFrames ?
	 * @private
	 */
	function _startSelectionOfElement(WebHelpInstance) {
		/* Close the sidemenu if it is open*/
		WebHelpInstance.ui.sidebarToggleButton.trigger('click');
		jQueryDragSelector.setPaneState(true);
		var dragSelectionOptions = {
			usesIframes: WebHelpInstance.usesIframes
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
							_createStepForThisElement(WebHelpInstance, arrayOfObjects, selectionDetails);
						}
					});
					WebHelpInstance.ui.sidebarToggleButton.trigger('click');
				}.bind(WebHelpInstance));
				jQuery(".drag-select-no").on("click", function () {
					jQueryDragSelector.confirmSelection(false, element);
					WebHelpInstance.ui.sidebarToggleButton.trigger('click');
				});
			} else {
				jQuery('#noElementsSelectedDiv').show();
				WebHelpInstance.ui.sidebarToggleButton.trigger('click');
			}
		});
		jQuery("#startDragDropButton").tooltip({
			trigger: 'manual'
		}).tooltip("show");
		setTimeout(function () {
			jQuery("#startDragDropButton").tooltip('hide');
		}, 3000);
	}

	/**
	 * Create a step for a given element once it's selected
	 *
	 * @param {WebHelp} WebHelpInstance The current WebHelp instance
	 * @param {Array=} arrayOfElems An array containing all the selected elements (if used)
	 * @param {Object=} selectionDetails selection details (especially if it contains iFrames and such (if used)
	 * @private
	 */
	function _createStepForThisElement(WebHelpInstance, arrayOfElems, selectionDetails) {
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
			WebHelpInstance.stepsTable.addRow([
				"",
				"Editable title",
				elemType,
				elemText,
				elemFrame,
				"Editable content"]);
		} else {
			WebHelpInstance.stepsTable.addRow();
		}
		$stepsTable.find('.remove-step').unbind('click');
		$stepsTable.find('.remove-step').on('click', function (event) {
			_removeThisStep(WebHelpInstance, event);
		});
		_attachIcons(WebHelpInstance);
	}

	/**
	 * Remove the clicked step
	 * @param {WebHelp} WebHelpInstance The current instance
	 * @param {event} event The click event
	 * @private
	 */
	function _removeThisStep(WebHelpInstance, event) {
		WebHelpInstance.stepsTable.removeRow(event);
		if (!WebHelpInstance.stepsTable.numRows()) {
			WebHelpInstance.stepsTable.addRow();
			_attachIcons(WebHelpInstance);
		}
	}

	/**
	 * Preview the clicked sequence (from the table, usually)
	 * @param {WebHelp} WebHelpInstance
	 * @param {Object} WebHelpInstance.ui The UI parameter
	 * @param {Boolean} WebHelpInstance.usesIframes Does this app use iFrames ?
	 * @param {TableList} WebHelpInstance.stepsTable The TableList used to list the steps
	 * @private
	 */
	function _previewClickedSequence(WebHelpInstance) {
		var previewSteps = _getCurrentTablePreviewSteps(WebHelpInstance);
		if (previewSteps) {
			var introJsObj = introJs();
			if (WebHelpInstance.usesIframes) {
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
			for (var option in WebHelpInstance.defaultIntroJsOptions) {
				if (WebHelpInstance.defaultIntroJsOptions.hasOwnProperty(option)) {
					options[option] = WebHelpInstance.defaultIntroJsOptions[option];
				}
			}
			introJsObj.setOptions(options);
			WebHelpInstance.ui.sidebarToggleButton.trigger('click'); //Close the side menu
			setTimeout(function () {
				introJsObj.start();
			}, 500);
		}
	}

	/**
	 * Save a given sequences to the sequences object
	 * @param {WebHelp} WebHelpInstance The current instance
	 * @param {Object} WebHelpInstance.sequences The current sequences
	 * @private
	 */
	function _saveSequence(WebHelpInstance) {
		var saveStatus = 'Sequence saved successfully!';
		try {
			var sequenceTitle = jQuery("#sequenceTitleSetter").val().trim();
			var stepsToSave = _getCurrentTablePreviewSteps(WebHelpInstance);
			var sequences = WebHelpInstance.sequences;
			var sequenceStatus = _getCurrentTableStatus(WebHelpInstance);
			if (sequenceStatus === "E") {
				var editedSeqId = _getCurrentTableSeqId(WebHelpInstance);
				jQuery.map(WebHelpInstance.sequences, function (val, i) {
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
				tool: WebHelpInstance.appName,
				status: sequenceStatus
			};
			// Populate scratchpad
			_refreshScratchpad(WebHelpInstance);
			_populateCurrentSequences(WebHelpInstance);
		} catch (error) {
			saveStatus = 'Error saving the sequence!';
		} finally {
			var $showSequenceSavedSuccessAlert = jQuery('#showSequenceSavedSuccessAlert');
			_clearStepsInSequence(WebHelpInstance);
			$showSequenceSavedSuccessAlert.html(saveStatus).show();
			setTimeout(function () {
				$showSequenceSavedSuccessAlert.hide();
			}, 2000);
		}
	}

	/**
	 * Get all the steps relevant to the current table
	 *
	 * @param {WebHelp} WebHelpInstance
	 * @param {TableList} WebHelpInstance.stepsTable
	 * @returns {Boolean|Array} previewSteps
	 * @private
	 */
	function _getCurrentTablePreviewSteps(WebHelpInstance) {
		var rows = WebHelpInstance.stepsTable.getData();
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
	}

	/**
	 * Get the status for the given table
	 *
	 * @param {WebHelp} WebHelpInstance
	 * @param {TableList} WebHelpInstance.stepsTable
	 * @returns {String} The status
	 * @private
	 */
	function _getCurrentTableStatus(WebHelpInstance) {
		return WebHelpInstance.stepsTable.getStatus();
	}

	/**
	 * Get the current sequence ID for the given table
	 *
	 * @param {WebHelp} WebHelpInstance
	 * @param {TableList} WebHelpInstance.stepsTable
	 * @returns {String|int} The Sequence ID
	 * @private
	 */
	function _getCurrentTableSeqId(WebHelpInstance) {
		return WebHelpInstance.stepsTable.getSeqId();
	}

	/**
	 * Generates the sequencing key
	 * @returns {String} The WebHelps app key
	 * @private
	 */
	function _genKey(WebHelpInstance) {
		return "WebHelp." + WebHelpInstance.appName;
	}

	// This function should be tied to the user and the app
	// Returns an array of sequence IDs of the visited sequences
	/*TODO: Get rid of async false and convert to promise chain!!!!!!*/
	WebHelp.prototype.getAllVisitedSequences = function () {
		var userPrefs = {};
		jQuery.ajax({
			async: false,
			url: this.visitedBaseUrl,
			success: function (data) {
				data = data.split(/\r?\n/);
				for (var i = 0; i < data.length; i++) {
					var keyVal = data[i].split("\t");
					userPrefs[keyVal[0]] = keyVal[1];
				}
			}
		});
		var key = _genKey(this);
		var seqIds = userPrefs[key];
		if (seqIds && seqIds.length > 0) {
			return seqIds.split(",");
		} else {
			return [];
		}
	};
	// This method returns back the seq id for a sequence with title
	WebHelp.prototype.getSeqIdForSequence = function (sequenceName) {
		var sequence = this.sequences[sequenceName];
		var seqId = sequence.seqId;
		return seqId;
	};
	// Given a seqId, check if the sequence has been previously seen or not
	WebHelp.prototype.isThisSequenceSeen = function (seqId) {
		var visitedSeqIds = this.getAllVisitedSequences();
		return visitedSeqIds.indexOf(seqId.toString()) >= 0;
	};
	/**
	 * Method to mark the given sequence as seen
	 *
	 * @param {WebHelp} WebHelpInstance
	 * @param {int} seqId
	 * @private
	 */
	function _markThisSequenceAsSeen(WebHelpInstance, seqId) {
		var visitedSeqIds = WebHelpInstance.getAllVisitedSequences();
		var key = _genKey(WebHelpInstance);
		var updatePreferences = false;
		if (visitedSeqIds.indexOf(seqId.toString()) < 0) {
			visitedSeqIds.push(seqId);
			updatePreferences = true;
		}
		if (updatePreferences) {
			_setVisitedSequencesInUserPrefs(WebHelpInstance, key, visitedSeqIds);
			_refreshWhatsNew(WebHelpInstance);
		}
	}

	/**
	 * Set visited sequences in userprefs
	 *
	 * @param {WebHelp} WebHelpInstance
	 * @param {String} key The preference key
	 * @param {Array} val The set of values for the given app key
	 * @private
	 */
	function _setVisitedSequencesInUserPrefs(WebHelpInstance, key, val) {
		val = val.join(",");
		jQuery.ajax({
			type: "GET",
			url: "/weblications/etc/setPrefs.epl?" + key + "=" + val,
			success: function () {
				_refreshWhatsNew(WebHelpInstance);
			}
		});
	}

	/**
	 * Add/remove new contents to the new sequences table
	 *
	 * @param {WebHelp} WebHelpInstance
	 * @param {Array} newSequences The list of new sequences
	 * @private
	 */
	function _updateNewSequencesTable(WebHelpInstance, newSequences) {
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
		if (WebHelpInstance.mode === "consume") {
			_initWhatsNewTable(WebHelpInstance, aaData);
		} else {
			_initScratchPadTable(WebHelpInstance, aaData);
		}
	}

	/**
	 * Refresh and get all sequences from the given filename via RESTful call
	 *
	 * @param {WebHelp} WebHelpInstance
	 * @param {String} WebHelpInstance.sequencesBaseUrl The base of the URL to call for the sequence file from
	 * @param {String=} filename
	 * @returns {promise} When the AJAX call is complete
	 * @private
	 */
	function _refreshAllSequences(WebHelpInstance, filename) {
		WebHelpInstance.sequences = {};
		if (!filename) {
			filename = WebHelpInstance.sequencesBaseUrl + WebHelpInstance.webHelpName + '.json';
		}
		return jQuery.ajax({
			url: filename,
			xhrFields: {
				withCredentials: true
			},
			cache: false,
			type: 'GET',
			dataType: 'json',
			success: function (data) {
				WebHelpInstance.sequences = data;
			},
			error: function () {
				throw new Error("Failed to load the sequences!");
			}
		});
	}

	/**
	 * Refresh the scratchpad as needed
	 *
	 * @param {WebHelp} WebHelpInstance The current WebHelp instance
	 * @param {Object} WebHelpInstance.sequences The sequences attribute
	 * @private
	 */
	function _refreshScratchpad(WebHelpInstance) {
		var unsavedSequences = {};
		jQuery.map(WebHelpInstance.sequences, function (val, i) {
			var status = val.status;
			if (status !== "O") {
				unsavedSequences[i] = val;
			}
		});
		_updateNewSequencesTable(WebHelpInstance, unsavedSequences);
	}

	/**
	 * Initialize the "What's New" table
	 *
	 * @param {WebHelp} WebHelpInstance
	 * @param {Array=} aaData
	 * @private
	 */
	function _initWhatsNewTable(WebHelpInstance, aaData) {
		WebHelpInstance.whatsNewTable = new TableList({
			element: '#whatsNewContent',
			data: aaData || [],
			listTemplate: 'WebHelpSequenceConsumptionList',
			listItemTemplate: 'WebHelpSequenceListItem',
			emptyListIndicator: 'All new help sequences viewed - Congratulations!'
		});
		_attachIcons(WebHelpInstance);
		_attachClickActionsToLists(WebHelpInstance);
	}

	/**
	 * Initialize the table in the scratchpad
	 *
	 * @param {WebHelp} WebHelpInstance
	 * @param {Array=} aaData
	 * @private
	 */
	function _initScratchPadTable(WebHelpInstance, aaData) {
		WebHelpInstance.scratchPadTable = new TableList({
			element: '#scratchpadContent',
			data: aaData || [],
			listTemplate: 'WebHelpSequenceConsumptionList',
			listItemTemplate: 'WebHelpSequenceListItem'
		});
	}

	/**
	 * Clear out all the steps in the current sequence
	 *
	 * @param {WebHelp} WebHelpInstance The current instance
	 * @private
	 */
	function _clearStepsInSequence(WebHelpInstance) {
		//Destroy and reinitialize the table to get the edited data
		WebHelpInstance.stepsTable.renderList();
		_attachIcons(WebHelpInstance);
		jQuery("#sequenceTitleSetter").val("").attr("placeholder", "Sequence Title");
		this.stepsTable.setStatus("N");
	}

	WebHelp.prototype.playSequence = function (sequenceName) {
		var sequence = this.sequences[sequenceName];
		var seqId = sequence.seqId;
		var play = introJs();
		if (this.usesIframes) {
			for (var i = sequence.data.length - 1; i >= 0; i--) {
				var thisStep = sequence.data[i];
				if (thisStep.iframeId) {
					thisStep.element = jQuery('#' + thisStep.iframeId).contents().find(thisStep.element).get(0);
				}
			}
		}
		var options = {
			steps: sequence.data,
			showProgress: true,
			showBullets: false
		};
		for (var option in this.defaultIntroJsOptions) {
			if (this.defaultIntroJsOptions.hasOwnProperty(option)) {
				options[option] = this.defaultIntroJsOptions[option];
			}
		}
		play.setOptions(options);
		var WebHelpInstance = this;
		WebHelpInstance.ui.webHelpMainContent.hide();
		//Hacky workaround to introjs pushing fixed position elements into weird places while scrolling to play
		play.oncomplete(function () {
			WebHelpInstance.ui.webHelpMainContent.show();
		});
		play.onexit(function () {
			WebHelpInstance.ui.webHelpMainContent.show();
		});
		//Workaround for flexbox
		/*
		 * Flexbox elements are asynchronously rendered
		 * Therefore, the intro tooltip pushes them out of place,
		 * causing them to look distorted
		 *
		 * The remedy for this is to re-render the items that
		 * use flex display.
		 * Pure CSS was not able to remedy the issue.
		 * This solution is somewhat non-performant, but currently works
		 * TODO: find a more performant or pure CSS-based solution
		 * */
		if (WebHelpInstance.usesFlexbox) {
			var $flexBoxItems = jQuery('body').children().filter(function () {
				return (jQuery(this).css('display') === 'flex');
			});
			if ($flexBoxItems.length) {
				play.onbeforechange(function () {
					$flexBoxItems.css('position', 'static');
				});
				play.onafterchange(function () {
					$flexBoxItems.css('position', 'relative');
				});
			}
		}
		if (jQuery('#contentConsumptionModal').is(':visible')) {
			jQuery('#contentConsumptionModal').modal('hide');
		}
		play.start();
		_markThisSequenceAsSeen(this, seqId);
	};

	/**
	 * Play the sequence that was clicked on
	 * @param {WebHelp} WebHelpInstance
	 * @param {Event} event The click event
	 * @private
	 */
	function _playClickedSequence(WebHelpInstance, event) {
		var sequenceName = jQuery(event.target).parents('li').find('.webHelpSequenceItem-title').text();
		WebHelpInstance.playSequence(sequenceName);
	}

	/**
	 * Edit the sequence that was clicked on
	 * @param {WebHelp} WebHelpInstance The current instance
	 * @param {TableList} WebHelpInstance.stepsTable The table used by the current instance
	 * @param {Event} event The click event
	 * @private
	 */
	function _editThisSequence(WebHelpInstance, event) {
		var thisSequenceTitle = jQuery(event.target).parents('li').find('.webHelpSequenceItem-title').text();
		var sequence = WebHelpInstance.sequences[thisSequenceTitle];
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
		WebHelpInstance.stepsTable.setData(data);
		WebHelpInstance.stepsTable.setStatus("E");
		WebHelpInstance.stepsTable.setSeqId(seqId);
		WebHelpInstance.stepsTable.useData = true;
		WebHelpInstance.stepsTable.renderList();
		_attachIcons(WebHelpInstance);
		WebHelpInstance.stepsTable.useData = false;
		jQuery('#sequenceTitleSetter').val(thisSequenceTitle);
		jQuery('.nav-tabs a[href=#addSequence]').tab('show');
	}

	//TODO: Try and find a way to not use delete
	/**
	 * Removes (deletes) a given sequence
	 * @param {WebHelp} WebHelpInstance
	 * @param {event} event
	 * @private
	 */
	function _removeThisSequence(WebHelpInstance, event) {
		var sequenceName = jQuery(event.target).parents('li').find('.webHelpSequenceItem-title').text();
		var storedSequences = WebHelpInstance.sequences;
		delete storedSequences[sequenceName];
		_populateCurrentSequences(WebHelpInstance);
		_refreshScratchpad(WebHelpInstance);
	}

	return WebHelp;
})();
