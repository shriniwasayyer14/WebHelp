/*globals require, console, module*/
/**
 * Refresh and get all sequences from the given filename via RESTful call
 *
 * @param {WebHelp} webHelpInstance
 * @param {String} webHelpInstance.sequencesBaseUrl The base of the URL to call for the sequence file from
 * @param {String=} filename
 * @returns {promise} When the AJAX call is complete
 * @private
 */
function getSequencesCallback(webHelpInstance, filename) {
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
 * Get all visited sequences
 * @param {[]} sequences
 * @param {WebHelp} webHelpInstance
 * @returns {Promise}
 */
function getVisitedCallback(sequences, webHelpInstance) {
	var userPreferences = {};
	return jQuery.ajax({
		url: webHelpInstance.visitedBaseUrl,
		success: function (data) {
			data = data.split(/\r?\n/);
			for (var i = 0; i < data.length; i++) {
				var keyVal = data[i].split("\t");
				userPreferences[keyVal[0]] = keyVal[1];
			}
			var key = webHelpInstance.genKey();
			var seqIds = userPreferences[key];
			if (seqIds && seqIds.length > 0) {
				seqIds = seqIds.split(",");
			}
			webHelpInstance.visitedSequenceIdList = seqIds;
		},
		error: function () {
			console.error('Could not poll for visited sequences');
		}
	});
}

/**
 * Set all visited sequences
 * @param {String} key Parameter to set
 * @param {String} val Values to set for the parameter
 * @param {WebHelp} webHelpInstance
 */
function setVisitedCallback (key, val, webHelpInstance) {
	val = val.join(",");
	var utility = require("./utility.js");
	jQuery.ajax({
		type: "GET",
		url: "/weblications/etc/setPrefs.epl?" + key + "=" + val,
		success: function () {
			utility._refreshWhatsNew(webHelpInstance);
		}
	});
}

module.exports = {
	getSequencesCallback: getSequencesCallback,
	getVisitedCallback: getVisitedCallback,
	setVisitedCallback: setVisitedCallback
};

