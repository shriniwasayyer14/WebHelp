/* globals window, console, require, module */
module.exports = {
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
	_addHelpIcon: function (webHelpInstance, navbarButtonElement, addTextToNavbar) {
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
	},
	/**
	 * Method to mark the given sequence as seen
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {Array} webHelpInstance.visitedSequenceIdList
	 * @param {int} seqId
	 * @private
	 */
	_markThisSequenceAsSeen: function (webHelpInstance, seqId) {
		var utility = require("./utility.js");
		var consumption = this;
		return consumption._getAllVisitedSequences(webHelpInstance).then(function () {
			var key = webHelpInstance.genKey();
			var updatePreferences = false;
			if (webHelpInstance.visitedSequenceIdList.indexOf(seqId.toString()) < 0) {
				webHelpInstance.visitedSequenceIdList.push(seqId);
				updatePreferences = true;
			}

			var dfd = new jQuery.Deferred();
			if (updatePreferences) {
				consumption._setVisitedSequences(webHelpInstance, key, webHelpInstance.visitedSequenceIdList).then(function () {
					return utility._refreshWhatsNew(webHelpInstance).then(function () {
						dfd.resolve();
					});
				});
			} else {
				dfd.resolve();
			}
			return dfd.promise();
		});
	},
	/**
	 * Refresh and get all sequences from the given filename via RESTful call
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {String} webHelpInstance.sequencesBaseUrl The base of the URL to call for the sequence file from
	 * @param {String=} filename
	 * @returns {promise} When the AJAX call is complete
	 * @private
	 */
	_refreshAllSequences: function (webHelpInstance, filename) {
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
	},
	/**
	 * Initialize the "What's New" table
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {Array=} aaData
	 * @private
	 */
	_initWhatsNewTable: function (webHelpInstance, aaData) {
		var TableList = require("./WebHelpTableListBuilder.js").TableList;
		var utility = require("./utility.js");
		webHelpInstance.whatsNewTable = new TableList({
			element: '#whatsNewContent',
			data: aaData || [],
			listTemplate: 'WebHelpSequenceConsumptionList',
			listItemTemplate: 'WebHelpSequenceListItem',
			emptyListIndicator: 'All new help sequences viewed - Congratulations!'
		});
		utility._attachIcons(webHelpInstance);
		utility._attachClickActionsToLists(webHelpInstance);
	},
	/**
	 * Get all visited sequences via AJAX and sets them to the current WebHelp instance
	 * @private
	 * @param {WebHelp} webHelpInstance The current WebHelp instance that the visited sequence ID list is set to
	 * @param {Array} webHelpInstance.visitedSequenceIdList The current WebHelp instance that the visited sequence ID
	 *   list is set to
	 * @returns {promise} Promise when AJAX call returns
	 */
	_getAllVisitedSequences: function (webHelpInstance) {
		if (!webHelpInstance.hasOwnProperty('visitedSequenceIdList')) {
			var sequenceIds = [];
			webHelpInstance.visitedSequenceIdList = sequenceIds;
		}
		var dfd = new jQuery.Deferred();
		if (webHelpInstance.getVisitedCallback) {
			webHelpInstance.getVisitedCallback(webHelpInstance.visitedSequenceIdList, webHelpInstance).then(dfd.resolve);
		} else {
			dfd.resolve();
		}
		return dfd.promise();
	},
	/**
	 * Set visited sequences in userprefs
	 *
	 * @param {WebHelp} webHelpInstance
	 * @param {String} key The preference key
	 * @param {Array} val The set of values for the given app key
	 * @private
	 */
	_setVisitedSequences: function (webHelpInstance, key, val) {
		var dfd = new jQuery.Deferred();
		webHelpInstance.visitedSequenceIdList = val;
		if (webHelpInstance.setVisitedCallback) {
			return webHelpInstance.setVisitedCallback(key, val, webHelpInstance).then(dfd.resolve);
		} else {
			dfd.resolve(webHelpInstance.visitedSequenceIdList);
		}
		return dfd.promise();
	},
	/**
	 * This opens up the default Mail client of the user.
	 * @param {string} email - The recepient email address.
	 * @param {string} appName - Thhe current App Name, is used in the content of the email.
	 * @private
	 */

	_sendMail: function (email, appName) {
		jQuery("#webHelpEmailButton").click(function () {
			email = email.replace(",", ";");
			var link = document.createElement('a');
			var emailBody = 'Question: %0D%0AType your query here%0D%0A%0D%0A%0D%0ALink: ' + encodeURIComponent(window.location.href) + '%0D%0A%0D%0AApp Name:' + appName;
			link.setAttribute('href', 'mailto:' + email + '&subject=Enquiry' + '&body=' + emailBody);
			link.click();
		});
	},
	/**
	 * Play the sequence that was clicked on
	 * @param {WebHelp} webHelpInstance
	 * @param {Event} event The click event
	 * @private
	 */
	_playClickedSequence: function (webHelpInstance, event) {
		var sequenceName = jQuery(event.target).parents('li').find('.webHelpSequenceItem-title').text();
		webHelpInstance.playSequence(sequenceName);
	}
};
