/*globals require, console, introJs, module*/
window.jQuery = require("jquery");
require("bootstrap");
require("intro.js");
require("jquery-get-path");
require("jquery-ui");
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
	 * @param {String=} [WebHelpOptions.supportEmail=] The recepient email address used for support. (No email tab if not
	 *   provided)
	 * @param {String=} [WebHelpOptions.helpIconPosition='.ai-header .ai-header-title'] The DOM element selector that the
	 *   help icon will be placed next to
	 * @this WebHelp
	 * @constructor WebHelp
	 * @memberOf WebHelp
	 */
	function WebHelp(WebHelpOptions) {
		var utility = require("./utility.js");
		//setup defaults
		var defaultOptions = {
			appName: 'DefaultApp',
			mode: 'consume',
			helpIconPosition: '.ai-header .ai-header-title',
			showIntroOnLoad: false,
			usesFontAwesome: false,
			parameters: utility._getWindowParameters(),
			ui: {},
			sequences: {},
			sequencesBaseUrl: '/WebHelp/',
			visitedBaseUrl: '/weblications/etc/getPrefs.epl',
			usesFlexbox: false,
			usesIframes: false,
			supportEmail: false
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
			utility._showHelpCreationMode(this);
		} else {
			this.mode = "consume";
			utility._showHelpConsumptionMode(this);
		}
		utility._bindPlayEditButtons(this);
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
	 * Shows the Send Email button if WebHelp options include Support Email value
	 * @param {string} email - The recepient email address.
	 * @this WebHelp
	 * @memberOf WebHelp
	 * @public
	 */
	WebHelp.prototype.provideEmailSupport = function (email) {
		var consumption = require("./consumption.js");
		this.ui.emailButton = jQuery("#webHelpEmailButton");
		if (email) {
			this.ui.emailButton.show();
			consumption._sendMail(email, this.appName);
		}
		else {
			//console.log("No mail recepients");
			this.ui.emailButton.hide();
		}
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
		var consumption = require("./consumption.js");
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
		consumption._markThisSequenceAsSeen(this, seqId);
	};
	return WebHelp;
})();
module.exports = WebHelp;
