/* globals jQuery, jQueryDragSelector, window, WebHelpTemplates, introJs, setTimeout, setInterval, TableList, console */
/**
 * @namespace WebHelp
 *
 */
//TODO: Document attributes here using http://usejsdoc.org/tags-property.html
var WebHelp;
WebHelp = (function () {
	"use strict";
	/**
	 * Creates the WebHelp object with the specified settings
	 * @param {Object} WebHelpOptions The configuration options for WebHelp
	 * @param {String} [WebHelpOptions.appName='DefaultApp'] The App name that you wish to use for your app
	 * @param {String} [WebHelpOptions.sequencesBaseUrl='/WebHelp/'] The URL you wish to pull your sequence file from
	 * @param {String} [WebHelpOptions.visitedBaseUrl='/weblications/etc/getPrefs.epl'] The URL you wish to pull your
	 *   visited sequences from
	 * @param {Boolean} [WebHelpOptions.usesFontAwesome=false] Does your app use Font Awesome ? (Defaults to bootstrap
	 *   glyphicons if not)
	 * @param {Boolean} [WebHelpOptions.usesIframes=false] Does your app use iframes ? (Used for some additional
	 *   workarounds)
	 * @param {Boolean} [WebHelpOptions.usesFlexbox=false] Does your app use flexbox ? (Used for some additional
	 *   workarounds)
	 * @param {String} [WebHelpOptions.supportEmail = ''] The recepient email address used for support. (Defaults to empty string)
	 * @constructor [WebHelp]
	 * @class WebHelp
	 * @this WebHelp
	 */
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
			usesIframes: false,
			supportEmail: ''
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
	 * @param {WebHelp} webHelpInstance The current instance of WebHelp
	 * @param {Object} webHelpInstance.ui
	 * @api private
	 * @private
	 */
	function _bindPlayEditButtons(webHelpInstance) {
		//attach sequence specific handlers
		webHelpInstance.ui.webHelpMainContent.on('click', '.play-sequence', function (event) {
			_playClickedSequence(webHelpInstance, event);
		});
		webHelpInstance.ui.webHelpMainContent.on('click', '.edit-sequence', function (event) {
			_editThisSequence(webHelpInstance, event);
		});
		webHelpInstance.ui.webHelpMainContent.on('click', '.remove-sequence', function (event) {
			_removeThisSequence.bind(webHelpInstance, event);
		});
	}

	/**
	 * Programmatically trigger the sequence list modal when in consumption mode
	 * @public
	 *
	 * @memberOf WebHelp
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
	 * @param {WebHelp} webHelpInstance the current instance of WebHelp
	 * @param {Object} webHelpInstance.ui
	 * @param {selector=} navbarButtonElement
	 * @param {Boolean=} addTextToNavbar
	 * @private
	 */
	function _addHelpIcon(webHelpInstance, navbarButtonElement, addTextToNavbar) {
		if (!navbarButtonElement) {
			navbarButtonElement = webHelpInstance.helpIconPosition;
		}
		var dropdownButtonHtml = '<button class="btn light" id="contentConsumptionNavButton" >' +
			'<i class="' + webHelpInstance.iconClass.info + '"></i>';
		if (addTextToNavbar) {
			dropdownButtonHtml += 'App Help';
		}
		dropdownButtonHtml += '</button>';
		webHelpInstance.ui.webHelpButton = jQuery(dropdownButtonHtml);
		//Add to navbar if need be
		if ((jQuery('.ai-navbar').length > 0) && (jQuery(navbarButtonElement + ':last-of-type').hasClass('nav-right'))) {
			jQuery(navbarButtonElement + ':last-of-type').after(webHelpInstance.ui.webHelpButton);
			webHelpInstance.ui.webHelpButton.addClass('nav-right');
		} else {
			jQuery(navbarButtonElement).after(webHelpInstance.ui.webHelpButton);
		}
		webHelpInstance.ui.webHelpButton.on('click', function (event) {
			event.preventDefault();
			webHelpInstance.showSequenceConsumptionModal();
		});
		webHelpInstance.ui.webHelpButton.attr('title', 'App Help');
	}

	/**
	 * Perform the necessary actions to show the consumption mode
	 * @param {WebHelp} webHelpInstance The current instance of WebHelp
	 * @param {Object} webHelpInstance.ui The UI parameters
	 * @private
	 */
	function _showHelpConsumptionMode(webHelpInstance) {
		_addHelpIcon(webHelpInstance, webHelpInstance.helpIconPosition)
		webHelpInstance.ui.webHelpMainContent = jQuery("#webHelpMainContent");
		if (webHelpInstance.ui.webHelpMainContent.length <= 0) {
			var modalContent = jQuery(WebHelpTemplates.WebHelpContent);
			var webHelpContent = jQuery(WebHelpTemplates.WebHelpConsumption);
			_attachIcons(webHelpInstance);
			var $body = jQuery("body");
			$body.append(modalContent);
			$body.append(webHelpContent);
			webHelpInstance.ui.webHelpMainContent = jQuery("#webHelpMainContent");
		}
		webHelpInstance.ui.webHelpMainContent.appendTo("#contentConsumptionModal .modal-body");
		jQuery('.nav-tabs a[href=#addSequence]').hide();
		jQuery('#globalWebHelpCreatorActionsWell').hide();
		_refreshWhatsNew(webHelpInstance).then(function () {
			_populateCurrentSequences(webHelpInstance);
			webHelpInstance.watchWhatsNew = setInterval(function () {
				_refreshWhatsNew(webHelpInstance);
			}, 1800000);
			if (webHelpInstance.showIntroOnLoad) {
				var introSeqId = webHelpInstance.getSequenceIdForSequenceName('Introduction');
				if (introSeqId && !webHelpInstance.isSequenceAlreadyViewed({seqId: introSeqId})) {
					webHelpInstance.playSequence('Introduction');
				}
			}
		});
		webHelpInstance.provideEmailSupport(webHelpInstance.supportEmail);
	}

	/**
	 * Perform the necessary actions to show the consumption mode
	 * @param {WebHelp} webHelpInstance The current instance of WebHelp
	 * @param {Object} webHelpInstance.ui The UI parameters
	 * @private
	 */
	function _showHelpCreationMode(webHelpInstance) {
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
		_initScratchPadTable(webHelpInstance);
		jQuery('.nav-tabs a[href=#addSequence]').trigger('click');
		//attach event handlers to webHelpContent
		jQuery("#sequencePreviewButton").on("click", function () {
			_previewClickedSequence(webHelpInstance);
		});
		jQuery("#sequenceSaveButton").on("click", function () {
			_saveSequence(webHelpInstance);
		});
		jQuery("#clearStepsButton").on("click", function () {
			_clearStepsInSequence(webHelpInstance);
		});
		jQuery("#startDragDropButton").on("click", function () {
			_startSelectionOfElement(webHelpInstance);
		});
		jQuery("#startEmptyStepButton").on("click", function () {
			_createStepForThisElement(webHelpInstance);
		});
		jQuery("#cancelDragDropButton").on("click", jQueryDragSelector.off);
		jQuery("#noElementsSelectedButton").on("click", jQuery('#noElementsSelectedDiv').hide);
		jQuery("#noStepsInPreviewButton").on("click", jQuery('#noStepsInPreviewDiv').hide);
		jQuery("#saveAllHelpSequencesToFileButton").on("click", function () {
			_saveAllHelpSequencesToFile(webHelpInstance);
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
			_removeThisStep(webHelpInstance, event);
		});
		_attachIcons(webHelpInstance);
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
		_refreshAllSequences(webHelpInstance).then(function () {
			_populateCurrentSequences(webHelpInstance);
		});
	}

	/**
	 * Attach all required icons within the main UI content
	 *
	 * @api private
	 * @param {WebHelp} webHelpInstance
	 * @param {Object} webHelpInstance.ui
	 * @private
	 */
	function _attachIcons(webHelpInstance) {
		for (var icon in webHelpInstance.iconClass) {
			if (webHelpInstance.iconClass.hasOwnProperty(icon)) {
				webHelpInstance.ui.webHelpMainContent.find(".iconClass-" + icon).removeClass(webHelpInstance.iconClass[icon]).addClass(webHelpInstance.iconClass[icon]);
			}
		}
	}

	/**
	 * Save the current help sequences toa  file (Chrome only!)
	 * @param {WebHelp} webHelpInstance The current instance
	 * @param {Object} webHelpInstance.sequences The sequences attribute (including created sequences)
	 * @private
	 */
	function _saveAllHelpSequencesToFile(webHelpInstance) {
		//get required data
		//Pretty print the JSON content
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
		//Syntax: JSON.stringify(value[, replacer[, space]])
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
		_updateNewSequencesTable(webHelpInstance, []);
	}

	/**
	 * Refresh new sequence count and data
	 *
	 * @param {WebHelp} webHelpInstance The current instance of WebHelp
	 * @param {Array} webHelpInstance.visitedSequenceIdList
	 * @returns {promise} Resolves when all sequences have been pulled, without a resolve parameter,
	 * @private
	 */
	function _refreshWhatsNew(webHelpInstance) {
		var dfd = new jQuery.Deferred();
		var sequences = webHelpInstance.sequences; //new function
		_refreshAllSequences(webHelpInstance)
			.then(function () {
				return _getAllVisitedSequencesViaAjax(webHelpInstance);
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
				_updateNewSequencesTable(webHelpInstance, newSequences); // new function
				if (newSequences.length >= 1) {
					_populateCurrentSequences(webHelpInstance);
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
	}

	/**
	 * Populates all current sequences from the sequences parameter that was read from the file
	 *
	 * @param {WebHelp} webHelpInstance The current instance
	 * @param {Object} webHelpInstance.sequences The sequences that were read into the attribute
	 * @param {Object} webHelpInstance.ui The UI parameter
	 * @private
	 */
	function _populateCurrentSequences(webHelpInstance) {
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
			_attachIcons(webHelpInstance);
			_attachClickActionsToLists(webHelpInstance);
		}
	}

	/**
	 * Attach click icons to the given lists
	 *
	 * @api private
	 * @param {WebHelp} webHelpInstance the current instance of the WebHelp object
	 * @param {Object} webHelpInstance.ui
	 * @private
	 */
	function _attachClickActionsToLists(webHelpInstance) {
		if (webHelpInstance.mode !== 'create') {
			webHelpInstance.ui.webHelpMainContent.find('div.iconClass-play').parents('li.webHelpSequenceList:not(.header)').attr('title', 'Play!').unbind('click').on('click', function (event) {
				_playClickedSequence(webHelpInstance, event);
			});
		} else {
			webHelpInstance.ui.webHelpMainContent.find('div.iconClass-play').attr('title', 'Play!').unbind('click').on('click', function (event) {
				_playClickedSequence(webHelpInstance, event);
			});
		}
		webHelpInstance.ui.webHelpMainContent.find('div.iconClass-edit').attr('title', 'Edit').unbind('click').on('click', function (event) {
			_editThisSequence(webHelpInstance, event);
		});
		webHelpInstance.ui.webHelpMainContent.find('div.iconClass-remove').attr('title', 'Delete').unbind('click').on('click', function (event) {
			_removeThisSequence.bind(webHelpInstance, event);
		});
	}

	/**
	 * Trigger the selection event (start dragging to select a DOM element)
	 * Only available in consumption mode
	 *
	 * @param {WebHelp} webHelpInstance The current instance of WebHelp
	 * @param {Boolean} webHelpInstance.usesIframes Does this app use iFrames ?
	 * @private
	 */
	function _startSelectionOfElement(webHelpInstance) {
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
							_createStepForThisElement(webHelpInstance, arrayOfObjects, selectionDetails);
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
	}

	/**
	 * Create a step for a given element once it's selected
	 *
	 * @param {WebHelp} webHelpInstance The current WebHelp instance
	 * @param {Array=} arrayOfElems An array containing all the selected elements (if used)
	 * @param {Object=} selectionDetails selection details (especially if it contains iFrames and such (if used)
	 * @private
	 */
	function _createStepForThisElement(webHelpInstance, arrayOfElems, selectionDetails) {
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
			_removeThisStep(webHelpInstance, event);
		});
		_attachIcons(webHelpInstance);
	}

	/**
	 * Remove the clicked step
	 * @param {WebHelp} webHelpInstance The current instance
	 * @param {event} event The click event
	 * @private
	 */
	function _removeThisStep(webHelpInstance, event) {
		webHelpInstance.stepsTable.removeRow(event);
		if (!webHelpInstance.stepsTable.numRows()) {
			webHelpInstance.stepsTable.addRow();
			_attachIcons(webHelpInstance);
		}
	}

	/**
	 * Preview the clicked sequence (from the table, usually)
	 * @param {WebHelp} webHelpInstance
	 * @param {Object} webHelpInstance.ui The UI parameter
	 * @param {Boolean} webHelpInstance.usesIframes Does this app use iFrames ?
	 * @param {TableList} webHelpInstance.stepsTable The TableList used to list the steps
	 * @private
	 */
	function _previewClickedSequence(webHelpInstance) {
		var previewSteps = _getCurrentTablePreviewSteps(webHelpInstance);
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
	}

	/**
	 * Save a given sequences to the sequences object
	 * @param {WebHelp} webHelpInstance The current instance
	 * @param {Object} webHelpInstance.sequences The current sequences
	 * @private
	 */
	function _saveSequence(webHelpInstance) {
		var saveStatus = 'Sequence saved successfully!';
		try {
			var sequenceTitle = jQuery("#sequenceTitleSetter").val().trim();
			var stepsToSave = _getCurrentTablePreviewSteps(webHelpInstance);
			var sequences = webHelpInstance.sequences;
			var sequenceStatus = _getCurrentTableStatus(webHelpInstance);
			if (sequenceStatus === "E") {
				var editedSeqId = _getCurrentTableSeqId(webHelpInstance);
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
			_refreshScratchpad(webHelpInstance);
			_populateCurrentSequences(webHelpInstance);
		} catch (error) {
			saveStatus = 'Error saving the sequence!';
		} finally {
			var $showSequenceSavedSuccessAlert = jQuery('#showSequenceSavedSuccessAlert');
			_clearStepsInSequence(webHelpInstance);
			$showSequenceSavedSuccessAlert.html(saveStatus).show();
			setTimeout(function () {
				$showSequenceSavedSuccessAlert.hide();
			}, 2000);
		}
	}

	/**
	 * Get all the steps relevant to the current table
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {TableList} webHelpInstance.stepsTable
	 * @returns {Boolean|Array} previewSteps
	 * @private
	 */
	function _getCurrentTablePreviewSteps(webHelpInstance) {
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
	}

	/**
	 * Get the status for the given table
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {TableList} webHelpInstance.stepsTable
	 * @returns {String} The status
	 * @private
	 */
	function _getCurrentTableStatus(webHelpInstance) {
		return webHelpInstance.stepsTable.getStatus();
	}

	/**
	 * Get the current sequence ID for the given table
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {TableList} webHelpInstance.stepsTable
	 * @returns {String|int} The Sequence ID
	 * @private
	 */
	function _getCurrentTableSeqId(webHelpInstance) {
		return webHelpInstance.stepsTable.getSeqId();
	}

	/**
	 * Generates the sequencing key
	 * @returns {String} The WebHelps app key
	 * @private
	 */
	function _genKey(webHelpInstance) {
		return "WebHelp." + webHelpInstance.appName;
	}

	/**
	 * Get all visited sequences via AJAX and sets them to the current WebHelp instance
	 * @private
	 * @param {WebHelp} webHelpInstance The current WebHelp instance that the visited sequence ID list is set to
	 * @param {Array} webHelpInstance.visitedSequenceIdList The current WebHelp instance that the visited sequence ID
	 *   list is set to
	 * @returns {promise} Promise when AJAX call returns
	 */
	function _getAllVisitedSequencesViaAjax(webHelpInstance) {
		var userPreferences = {};
		var sequenceIds = [];
		var dfd = new jQuery.Deferred();
		if (!webHelpInstance.hasOwnProperty('visitedSequenceIdList')) {
			webHelpInstance.visitedSequenceIdList = sequenceIds;
		}
		jQuery.ajax({
			url: webHelpInstance.visitedBaseUrl,
			success: function (data) {
				data = data.split(/\r?\n/);
				for (var i = 0; i < data.length; i++) {
					var keyVal = data[i].split("\t");
					userPreferences[keyVal[0]] = keyVal[1];
				}
				var key = _genKey(webHelpInstance);
				var seqIds = userPreferences[key];
				if (seqIds && seqIds.length > 0) {
					seqIds = seqIds.split(",");
				}
				webHelpInstance.visitedSequenceIdList = seqIds;
			},
			error: function () {
				console.error('Could not poll for visited sequences');
			},
			complete: function () {
				//resolve regardless of what happens
				//the downstream methods will just have to use an empty array
				dfd.resolve();
			}
		});
		return dfd.promise();
	}

	/**
	 * Get a list of all visited sequences by sequence ID
	 * @public
	 *
	 * @memberOf WebHelp
	 * @returns {Array} A deep clone of the viewed sequence ID list
	 */
	WebHelp.prototype.getVisitedSequences = function () {
		var webHelpInstance = this;
		return jQuery.clone(webHelpInstance.visitedSequenceIdList);
	};
	/**
	 * Get the sequence ID for a given sequence name
	 * @param {String} sequenceName The name of the sequence
	 * @returns {int} The sequence ID The ID of the sequence
	 * @memberOf WebHelp
	 * @public
	 *
	 */
	WebHelp.prototype.getSequenceIdForSequenceName = function (sequenceName) {
		var sequence = this.sequences[sequenceName];
		return sequence.seqId;
	};
	/**
	 * Get the sequence name for a given sequence ID
	 * @param {int} sequenceId The sequence ID
	 * @returns {String} sequenceName The sequence name
	 * @memberOf WebHelp
	 * @public
	 *
	 */
	WebHelp.prototype.getSequenceNameForSequenceId = function (sequenceId) {
		var sequenceName = '';
		jQuery.each(this.sequences, function (key, value) {
			if (value.seqId === sequenceId) {
				sequenceName = key;
				return false;
			}
		});
		return sequenceName;
	};
	/**
	 * Given a seqence ID or name, check if the sequence has been previously seen or not
	 *
	 * @public
	 *
	 * @param {Object} options The options object
	 * @param {int=} options.seqId The sequence ID for the given sequence
	 * @param {String=} options.seqName The sequence name for the given sequence
	 * @returns {Boolean} Whether the sequence has been previously viewed
	 * @memberOf WebHelp
	 */
	WebHelp.prototype.isSequenceAlreadyViewed = function (options) {
		var seqId = options.seqId;
		var seqName = options.seqName;
		if (seqName && (!seqId)) {
			seqId = this.getSequenceIdForSequenceName(seqName);
		}
		if (!(seqName || seqId)) {
			console.error('Called function with no identifiers for sequence');
			return false;
		}
		var visitedSeqIds = this.visitedSequenceIdList;
		return visitedSeqIds.indexOf(seqId.toString()) >= 0;
	};
	/**
	 * Method to mark the given sequence as seen
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {Array} webHelpInstance.visitedSequenceIdList
	 * @param {int} seqId
	 * @private
	 */
	function _markThisSequenceAsSeen(webHelpInstance, seqId) {
		_getAllVisitedSequencesViaAjax(webHelpInstance).then(function () {
			var key = _genKey(webHelpInstance);
			var updatePreferences = false;
			if (webHelpInstance.visitedSequenceIdList.indexOf(seqId.toString()) < 0) {
				webHelpInstance.visitedSequenceIdList.push(seqId);
				updatePreferences = true;
			}
			if (updatePreferences) {
				_setVisitedSequencesInUserPrefs(webHelpInstance, key, webHelpInstance.visitedSequenceIdList);
				_refreshWhatsNew(webHelpInstance);
			}
		});
	}

	/**
	 * Set visited sequences in userprefs
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {String} key The preference key
	 * @param {Array} val The set of values for the given app key
	 * @private
	 */
	function _setVisitedSequencesInUserPrefs(webHelpInstance, key, val) {
		val = val.join(",");
		jQuery.ajax({
			type: "GET",
			url: "/weblications/etc/setPrefs.epl?" + key + "=" + val,
			success: function () {
				_refreshWhatsNew(webHelpInstance);
			}
		});
	}

	/**
	 * Add/remove new contents to the new sequences table
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {Array} newSequences The list of new sequences
	 * @private
	 */
	function _updateNewSequencesTable(webHelpInstance, newSequences) {
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
			_initWhatsNewTable(webHelpInstance, aaData);
		} else {
			_initScratchPadTable(webHelpInstance, aaData);
		}
	}

	/**
	 * Refresh and get all sequences from the given filename via RESTful call
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {String} webHelpInstance.sequencesBaseUrl The base of the URL to call for the sequence file from
	 * @param {String=} filename
	 * @returns {promise} When the AJAX call is complete
	 * @private
	 */
	function _refreshAllSequences(webHelpInstance, filename) {
		webHelpInstance.sequences = {};
		if (!filename) {
			filename = webHelpInstance.sequencesBaseUrl + webHelpInstance.webHelpName + '.json';
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
				webHelpInstance.sequences = data;
			},
			error: function () {
				console.error("Failed to load the sequences!");
			}
		});
	}

	/**
	 * Refresh the scratchpad as needed
	 *
	 * @param {WebHelp} webHelpInstance The current WebHelp instance
	 * @param {Object} webHelpInstance.sequences The sequences attribute
	 * @private
	 */
	function _refreshScratchpad(webHelpInstance) {
		var unsavedSequences = {};
		jQuery.map(webHelpInstance.sequences, function (val, i) {
			var status = val.status;
			if (status !== "O") {
				unsavedSequences[i] = val;
			}
		});
		_updateNewSequencesTable(webHelpInstance, unsavedSequences);
	}

	/**
	 * Initialize the "What's New" table
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {Array=} aaData
	 * @private
	 */
	function _initWhatsNewTable(webHelpInstance, aaData) {
		webHelpInstance.whatsNewTable = new TableList({
			element: '#whatsNewContent',
			data: aaData || [],
			listTemplate: 'WebHelpSequenceConsumptionList',
			listItemTemplate: 'WebHelpSequenceListItem',
			emptyListIndicator: 'All new help sequences viewed - Congratulations!'
		});
		_attachIcons(webHelpInstance);
		_attachClickActionsToLists(webHelpInstance);
	}

	/**
	 * Initialize the table in the scratchpad
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {Array=} aaData
	 * @private
	 */
	function _initScratchPadTable(webHelpInstance, aaData) {
		webHelpInstance.scratchPadTable = new TableList({
			element: '#scratchpadContent',
			data: aaData || [],
			listTemplate: 'WebHelpSequenceConsumptionList',
			listItemTemplate: 'WebHelpSequenceListItem'
		});
	}

	/**
	 * Clear out all the steps in the current sequence
	 *
	 * @param {WebHelp} webHelpInstance The current instance
	 * @private
	 */
	function _clearStepsInSequence(webHelpInstance) {
		//Destroy and reinitialize the table to get the edited data
		webHelpInstance.stepsTable.renderList();
		_attachIcons(webHelpInstance);
		jQuery("#sequenceTitleSetter").val("").attr("placeholder", "Sequence Title");
		webHelpInstance.stepsTable.setStatus("N");
	}
	/**
	 * Shows the Send Email button if WebHelp options include Support Email value
	 * @param {string} email - The recepient email address.
	 * @this WebHelp
	 * @memberOf WebHelp
	 * @public
	 */
	WebHelp.prototype.provideEmailSupport = function(email){

		this.ui.emailButton = jQuery("#webHelpEmailButton");
		if(email){
			this.ui.emailButton.show();
			_sendMail(email,this.appName);
		}
		else{
			//console.log("No mail recepients");
			this.ui.emailButton.hide();
		}
	}

	/**
	 * This opens up the default Mail client of the user.
	 * @param {string} email - The recepient email address.
	 * @param {string} appName - Thhe current App Name, is used in the content of the email.
	 * @private
	 */

	 function _sendMail(email,appName){

		jQuery("#webHelpEmailButton").click(function(event){
			email = email.replace(",",";");
			var link = document.createElement('a');

			var emailBody = 'Question: %0D%0AType your query here%0D%0A%0D%0A%0D%0ALink: '
				+encodeURIComponent(window.location.href)+'%0D%0A%0D%0AApp Name:'+appName;
			link.setAttribute('href','mailto:'+email +'&subject=Enquiry' + '&body='+emailBody);
			link.click();
		});
	};

	/**
	 * Play a sequence programmatically given its identifier (name or ID)
	 * @public
	 *
	 * @param {String|int} nameOrId The sequence name or ID for a given sequence - Name preferred
	 * @this WebHelp
	 * @memberOf WebHelp
	 */
	WebHelp.prototype.playSequence = function (nameOrId) {
		var seqName, seqId, sequence;
		if (isNaN(parseInt(nameOrId))) {
			seqName = nameOrId;
			seqId = this.getSequenceIdForSequenceName(seqName);
		} else {
			seqId = parseInt(nameOrId);
			seqName = this.getSequenceNameForSequenceId[seqId];
		}
		sequence = this.sequences[seqName];
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
		var webHelpInstance = this;
		webHelpInstance.ui.webHelpMainContent.hide();
		//Hacky workaround to introjs pushing fixed position elements into weird places while scrolling to play
		play.oncomplete(function () {
			webHelpInstance.ui.webHelpMainContent.show();
		});
		play.onexit(function () {
			webHelpInstance.ui.webHelpMainContent.show();
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
		if (webHelpInstance.usesFlexbox) {
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
	 * @param {WebHelp} webHelpInstance
	 * @param {Event} event The click event
	 * @private
	 */
	function _playClickedSequence(webHelpInstance, event) {
		var sequenceName = jQuery(event.target).parents('li').find('.webHelpSequenceItem-title').text();
		webHelpInstance.playSequence({sequenceName: sequenceName});
	}

	/**
	 * Edit the sequence that was clicked on
	 * @param {WebHelp} webHelpInstance The current instance
	 * @param {TableList} webHelpInstance.stepsTable The table used by the current instance
	 * @param {Event} event The click event
	 * @private
	 */
	function _editThisSequence(webHelpInstance, event) {
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
		_attachIcons(webHelpInstance);
		webHelpInstance.stepsTable.useData = false;
		jQuery('#sequenceTitleSetter').val(thisSequenceTitle);
		jQuery('.nav-tabs a[href=#addSequence]').tab('show');
	}

	/**
	 * Removes (undefines) a given sequence
	 * @param {WebHelp} webHelpInstance
	 * @param {Object} webHelpInstance.sequences The stored sequences
	 * @param {event} event
	 * @private
	 */
	function _removeThisSequence(webHelpInstance, event) {
		var sequenceName = jQuery(event.target).parents('li').find('.webHelpSequenceItem-title').text();
		var storedSequences = webHelpInstance.sequences;
		//use undefined instead of delete, the garbage collector will take care of it
		storedSequences[sequenceName] = undefined;
		_populateCurrentSequences(webHelpInstance);
		_refreshScratchpad(webHelpInstance);
	}

	return WebHelp;
})();
