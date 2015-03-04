/* globals jQuery, jQueryDragSelector, window, alert, WebHelpTemplates, introJs, setTimeout, setInterval, localStorage */

var WebHelp;
WebHelp = (function () {
	function WebHelp(WebHelpOptions) {
		//setup defaults
		var defaultOptions = {
			appname: 'DefaultApp',
			mode: 'consume',
			helpIconPosition: '.ai-header .ai-header-title',
			showIntroOnLoad: false,
			isNlaf: false,
			parameters: this.getWindowParameters()
		};
		if (!WebHelpOptions) {
			WebHelpOptions = defaultOptions;
		}
		defaultOptions.forEach(function (option) {
			this[option] = WebHelpOptions.hasOwnProperty(option) ? WebHelpOptions[option] : defaultOptions[option];
		});

		if (this.isNlaf === true) {
			this.iconClass = {
				"remove": "fa fa-times",
				"play": "fa fa-play-circle-o",
				"save": "fa fa-floppy-o",
				"clear": "fa fa-refresh",
				"add": "fa fa-plus",
				"info": "fa fa-info-circle",
				"edit": "fa fa-edit"
			};
		} else {
			this.iconClass = {
				"remove": "glyphicon glyphicon-remove",
				"play": "glyphicon glyphicon-play-circle",
				"save": "glyphicon glyphicon-floppy-disk",
				"clear": "glyphicon glyphicon-refresh",
				"add": "glyphicon glyphicon-plus",
				"info": "glyphicon glyphicon-info-sign",
				"edit": "glyphicon glyphicon-edit"
			};
		}

	}

	WebHelp.prototype.getWindowParameters = function () {
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
				var arr = [query_string[pair[0]], pair[1]];
				query_string[pair[0]] = arr;
				// If third or later entry with this name
			} else {
				query_string[pair[0]].push(pair[1]);
			}
		}

		return query_string;
	};

	WebHelp.prototype.addWebHelpContainer = function () {
		var webHelpContent = jQuery(WebHelpTemplates["../templates/WebHelpContainer.html"]);
		for (var icon in this.iconClass){
					webHelpContent.find("iconClass-"+icon).addClass(this.iconClass[icon]);
		}
		jQuery("body").append(webHelpContent);
	};

	WebHelp.prototype.addHelpIcon = function () {
		createNewNavigationButton(helpIconPosition);
	};

	WebHelp.prototype.showIntroOnStartup = function () {
		var availableSequences = getAllSequences();
		if (this.showIntroOnLoad) {
			if (availableSequences['Introduction']) {
				playSequence('Introduction');
			}
		}
	};

	WebHelp.prototype.showHelpConsumptionMode = function () {
		this.addHelpIconFunc();
		this.moveTableDivsToModal();
		this.showIntroOnStartup();
		this.refreshWhatsNew();
		setInterval(function () {
			this.refreshWhatsNew();
		}, 3000);
	};

	WebHelp.prototype.showHelpCreationMode = function () {
		jQuery('#webHelpMainContent').BootSideMenu({
			side: "right", // left or right
			autoClose: true // auto close when page loads
		});
		setUpAddEditTable();
		var helpIconElement = jQuery(this.helpIconPosition);
		var currentTitleHTML = helpIconElement.html();
		currentTitleHTML += "[Edit mode]";
		var elem;
		if (helpIconElement && helpIconElement.length > 1) {
			elem = helpIconElement[0];
		} else {
			elem = helpIconElement;
		}
		jQuery(elem).html(currentTitleHTML);
		refreshWhatsNew();
	};

	return WebHelp;
})();

function moveTableDivsToModal() {
	jQuery("#webHelpMainContent").appendTo("#contentConsumptionModal .modal-body");
	jQuery('.nav-tabs a[href=#addSequence]').hide();
}

function createNewNavigationButton(navbarButtonElement, addTextToNavbar) {
	var dropdownButtonHtml = '<button class="btn light" id="contentConsumptionNavButton" >' +
		'<i class="' + iconClass.info + '"></i>';

	if (addTextToNavbar) {
		dropdownButtonHtml += 'App Help';
	}

	dropdownButtonHtml += '</button>';

	//Add to navbar if need be
	if ((jQuery('.ai-navbar').length > 0) && (jQuery(navbarButtonElement + ':last-of-type').hasClass('nav-right'))) {
		jQuery(navbarButtonElement + ':last-of-type').after(dropdownButtonHtml);
		jQuery('#contentConsumptionNavButton').addClass('nav-right');
	} else {
		jQuery(navbarButtonElement).after(dropdownButtonHtml);
	}

	jQuery('#contentConsumptionNavButton').click(function (event) {
		event.preventDefault();
		jQuery('#contentConsumptionModal').modal('show');
	});

	jQuery('#contentConsumptionNavButton').attr('title', 'App Help');

}

function setUpAddEditTable() {
	var t = jQuery("#stepsTable").dataTable({
		"sDom": "",
		"language": {
			"emptyTable": "New steps will show up here!"
		},
		"aoColumns": [
			{
				"sTitle": "",
				"sWidth": "10%"
                },
			{
				"sTitle": "Step",
				"sWidth": "25%"
                },
			{
				"sTitle": "Attribute",
				"sWidth": "7%",
				"sClass": "invisibleColumnInStepsTable"
					/*Needs to be invisible, datatables bVisible false removes it from the DOM altogether*/
                },
			{
				"sTitle": "Value",
				"sWidth": "8%",
				"sClass": "invisibleColumnInStepsTable"
                },
			{
				"sTitle": "Content",
				"sWidth": "50%"
                }
            ]
	}).rowReordering();
	makeEditable();
}

function setNewSequenceCountBadgeOnHelpIcon(numNewSequences) {
	var $helpIcon = jQuery('#contentConsumptionNavButton');
	if (modeOfOperation == "create") {
		return;
	}
	if (numNewSequences > 0) {
		$helpIcon.attr('data-badge', numNewSequences);
	} else {
		$helpIcon.removeAttr('data-badge');
	}
}

function startSelectionOfElement(elementSelection) {

	/* Close the sidemenu if it is open*/
	var status = jQuery('#webHelpMainContent').attr("data-status");
	if (elementSelection && status === "opened") {
		jQuery(".toggler").trigger("click");
	}

	if (elementSelection) {
		jQueryDragSelector.on();
		jQuery("#startDragDropButton").tooltip({
			trigger: 'manual'
		}).tooltip("show");
		setTimeout(function () {
			jQuery("#startDragDropButton").tooltip('hide');
		}, 3000);
	} else {
		createStepForThisElement([]);
	}
}

function createStepForThisElement(arrayOfElems) {
	var t = jQuery("#stepsTable").DataTable();
	var elemText = "";
	var elemType = "";
	for (var i = 0; i < arrayOfElems.length; i++) {
		elemText += arrayOfElems[i].value + "&";
		elemType += arrayOfElems[i].attribute + "&";
	}
	elemText = elemText.substring(0, elemText.length - 1);
	elemType = elemType.substring(0, elemType.length - 1);
	t.row.add([
        "<span class='" + this.iconClass.remove + "' aria-hidden='true' onclick='removeThisStep()'></span>",
        "Editable title",
        elemType,
        elemText,
        "Editable content"])
		.draw();
	makeEditable();
}

function removeThisStep() {
	var t = jQuery("#stepsTable").DataTable();
	t.row(jQuery(event.target).parents('tr')).remove().draw();
}

function alertNoSelection() {
	jQuery('#noElementsSelectedDiv').show();
	jQueryDragSelector.on();
}

function preview() {
	//destroyAndRedrawTable(); //Doesn't respect row reordering
	var previewSteps = getCurrentTablePreviewSteps();

	if (previewSteps) {
		var introJsObj = introJs();
		introJsObj.setOptions({
			steps: previewSteps,
			showProgress: true,
			showBullets: false,
			tooltipPosition: 'auto'
		});
		jQuery('.toggler').trigger('click'); //Close the side menu
		setTimeout(function () {
			introJsObj.start();
		}, 500);
	}
}

function save() {

	var sequenceTitle = jQuery("#sequenceTitleSetter").val().trim();
	var stepsToSave = getCurrentTablePreviewSteps();
	if (stepsToSave) {
		var testObject = {};
		testObject[sequenceTitle] = {
			"sequenceTitle": sequenceTitle,
			"appName": this.appname,
			//"url": "WebHelp",
			"data": stepsToSave,
			"seqId": new Date().getTime()
		};

		// Put the object into storage
		var WebHelpName = 'WebHelp.' + this.appname;
		if (localStorage.getItem(WebHelpName)) {
			var localStorageObject = JSON.parse(localStorage.getItem(WebHelpName));
			localStorageObject[sequenceTitle] = testObject[sequenceTitle];
			localStorage.setItem(WebHelpName, JSON.stringify(localStorageObject));
		} else {
			localStorage.setItem(WebHelpName, JSON.stringify(testObject));
		}

		jQuery("#sequenceSaveButton").attr('title', 'Saved!').tooltip({
			trigger: 'manual'
		}).tooltip("show");
		setTimeout(function () {
			jQuery("#sequenceSaveButton").tooltip('hide').attr('title', '');
		}, 500);
		populateCurrentSequences();
		refreshWhatsNew();
	}
}

function saveToDB() {
	var sequenceTitle = jQuery("#sequenceTitleSetter").val().trim();
	var stepsToSave = getCurrentTablePreviewSteps();
	var method = "saveSequence";
	var description = "Test";
	var tool = this.appname;
	var active_flag = 'N';
	var list_order = new Date().getTime();
	var url = "";
	var data = stepsToSave;

	var auth = encodeURIComponent("sayyer:Ganesh001");

	jQuery.ajax({
		url: "http://devntsl002.blackrock.com:8558/weblications/WebHelp/WebHelp.epl",
		type: "POST",
		async: true,
		data: {
			method: "saveSequence",
			seq_id: new Date().getTime(),
			title: sequenceTitle,
			data: JSON.stringify(stepsToSave),
			tool: this.appname,
			active_flag: 'N',
			url: "test"
		},
		success: function (data, status) {
			jQuery("#sequenceSaveButton").attr('title', 'Saved!').tooltip({
				trigger: 'manual'
			}).tooltip("show");
			setTimeout(function () {
				jQuery("#sequenceSaveButton").tooltip('hide').attr('title', '');
			}, 500);
			populateCurrentSequences();
			refreshWhatsNew();
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			alert("Save action failed!");
		}
	});
}

function getCurrentTablePreviewSteps() {
	var tableHasData = !((jQuery("#stepsTable td").length <= 0) || ((jQuery("#stepsTable td").length === 1) && (jQuery("#stepsTable td").hasClass('dataTables_empty'))));
	if (!tableHasData) {
		jQuery('#noStepsInPreviewDiv').show();
		return false;
	}

	var previewSteps = [];

	var tableRows = jQuery("#stepsTable tr");
	var rows = [];

	jQuery.each(tableRows, function (index, element) {
		var cells = jQuery(element).find('td');
		if (cells.length > 0) {
			var thisRow = [];
			for (var n = 0; n < cells.length; n++) {
				thisRow.push(jQuery(cells[n]).text());
			}
			rows.push(thisRow);
		}
	});

	for (var n = 0; n < rows.length; n++) {
		var elemAttribVal = rows[n][3];
		var elemAttribType = rows[n][2];
		var stepTitle = rows[n][1];
		var content = rows[n][4];
		if (elemAttribVal) {
			var elem = "";
			if (elemAttribType != 'CSSPath') {
				elem = "[" + elemAttribType + "=\'" + elemAttribVal + "\']";
			} else {
				elem = elemAttribVal;
			}
			previewSteps.push({
				element: elem,
				intro: '<div><h3>' + stepTitle + '</h3><p>' + content + '</p></div>',
				position: 'auto'
			});
		} else {
			previewSteps.push({
				intro: '<div><h3>' + stepTitle + '</h3><p>' + content + '</p></div>'
			});
		}
	}

	return previewSteps;
}

function refreshWhatsNew() {
	var sequences = getAllSequences(); //new function
	var seenSequences = getAllVisitedSequences(); //new function
	var newSequences = [];
	for (seqName in sequences) {
		var seq = sequences[seqName];
		var seqId = seq.seqId;
		if (seenSequences.indexOf(seqId) < 0) {
			newSequences.push(seq);
		}
	}
	updateNewSequencesTable(newSequences); // new function
}


// This function should be tied to the user and the app
// Returns an array of sequence IDs of the visited sequences
function getAllVisitedSequences() {
	var key = "WebHelp." + this.appname + "." + userName;
	var seqIds = JSON.parse(localStorage.getItem(key));
	if (seqIds && seqIds.length > 0) {
		return seqIds;
	} else {
		return [];
	}
}

// This method would mark the given sequence as seen
function markThisSequenceAsSeen(seqId) {
	var visitedSeqIds = getAllVisitedSequences();
	var key = "WebHelp." + this.appname + "." + userName;
	if (visitedSeqIds.indexOf(seqId) < 0) {
		visitedSeqIds.push(seqId);
		localStorage.setItem(key, JSON.stringify(visitedSeqIds));
	}
	refreshWhatsNew(); // new function
}

// This table will remove and add new contents to the new sequences table
function updateNewSequencesTable(newSequences) {
	var numOfNewSequences = newSequences.length;
	if (newSequences.length >= 1) {
		populateCurrentSequences();
	}

	var aaData = [];
	jQuery.each(newSequences, function (key, value) {
		var row = [];
		row.push("<span class='fa fa-play-circle-o' aria-hidden='true' onclick='playThisSequence()'></span>");
		row.push(value.sequenceTitle);
		row.push("<span class='" + iconClass.edit + "' aria-hidden='true' onclick='editThisSequence()'>");
		row.push("<span class='" + iconClass.remove + "' aria-hidden='true' onclick='removeThisSequence()'>");
		row.push(JSON.stringify(value));

		aaData.push(row);
	});
	//$('#newSequencesList').dataTable().fnClearTable();
	initWhatsNewTable(aaData);
	setTimeout(function () {
		setNewSequenceCountBadgeOnHelpIcon(numOfNewSequences);
	}, 2000);
}

function populateCurrentSequences() {
	var isCreator = (getWindowParameters()['create'] !== undefined) ? true : false;
	var retrievedHtml = '';
	var retrievedNewHtml = '';
	var retrievedPopularHtml = '';
	var retrievedSequences = getAllSequences();

	var sequencesFromDB = getAllSequencesFromDB();

	var numNewSequences = 0;
	if (retrievedSequences) {
		retrievedHtml += '<table id="availableSequencesList">';
		retrievedPopularHtml += '<table id="popularSequencesList">';
		retrievedNewHtml += '<table id="newSequencesList">';
		jQuery.each(retrievedSequences, function (key, value) {
			var thisElement = "<tr>" +
				"<td><span class='" + iconClass.play + "' aria-hidden='true' onclick='playThisSequence()'></span></td>" +
				"<td>" + key + "</td>" +
				"<td><span class='" + iconClass.edit + "' aria-hidden='true' onclick='editThisSequence()'></td>" +
				"<td><span class='" + iconClass.remove + "' aria-hidden='true' onclick='removeThisSequence()'></td>" +
				"<td>" + JSON.stringify(value) + "</td>" +
				"</tr>";
			retrievedHtml += thisElement;
			retrievedPopularHtml += thisElement;
		});
		retrievedHtml += '</table>';
		retrievedPopularHtml += '</table>';
		retrievedNewHtml += '</table>';
		localStorage.setItem('WebHelp', JSON.stringify(retrievedSequences));
		jQuery('#availableSequencesContent').html(retrievedHtml);
		jQuery('#popularSequencesContent').html(retrievedPopularHtml);
		//listFilter(jQuery('#availableSequencesHeader'), jQuery('#availableSequencesList'));

		var t = jQuery("#availableSequencesList").dataTable({
			"sDom": '<"top"f<"clear">>', //It should be a searchable table
			"oLanguage": {
				"sSearch": "Search title and content: "
			},
			"aoColumns": [
				{
					"sTitle": "",
					"sWidth": "10%"
                    },
				{
					"sTitle": "Topic"
                    },
				{
					"sTitle": "",
					"sWidth": "10%",
					"bVisible": isCreator
                    },
				{
					"sTitle": "",
					"sWidth": "10%",
					"bVisible": isCreator
                    },
				{
					"sTitle": "Data",
					"bVisible": false,
					"bSearchable": true
                    }
                ]
		});

		var p = jQuery("#popularSequencesList").dataTable({
			"sDom": '<"top"f<"clear">>', //It should be a searchable table
			"oLanguage": {
				"sSearch": "Search title and content: "
			},
			"aoColumns": [
				{
					"sTitle": "",
					"sWidth": "10%"
                    },
				{
					"sTitle": "Topic"
                    },
				{
					"sTitle": "",
					"sWidth": "10%",
					"bVisible": false
                    },
				{
					"sTitle": "",
					"sWidth": "10%",
					"bVisible": false
                    },
				{
					"sTitle": "Data",
					"bVisible": false,
					"bSearchable": true
                    }
                ]
		});

		jQuery('#whatsNewContent').html(retrievedNewHtml);
		var emptyData = [];
		initWhatsNewTable();
		jQuery('td .' + iconClass.play).attr('title', 'Play!');
		jQuery('td .' + iconClass.edit).attr('title', 'Edit');
		jQuery('td .' + iconClass.remove).attr('title', 'Delete');

		//Convert all the tables to bootstrap-tables
		jQuery('#webHelpMainContent table.dataTable').addClass('table table-hover table-striped table-bordered');
		return {
			numNewSequences: numNewSequences
		};
	}
}

function initWhatsNewTable(aaData) {
	var a = jQuery("#newSequencesList").dataTable({
		"sDom": '<"top"f>', //It should be a searchable table
		"oLanguage": {
			"sSearch": "Search title and content: "
		},
		"bDestroy": true,
		"bRender": true,
		"aoColumns": [
			{
				"sTitle": "",
				"sWidth": "10%"
            },
			{
				"sTitle": "Topic"
            },
			{
				"sTitle": "",
				"sWidth": "10%",
				"bVisible": false
            },
			{
				"sTitle": "",
				"sWidth": "10%",
				"bVisible": false
            },
			{
				"sTitle": "Data",
				"bVisible": false,
				"bSearchable": true
            }
        ],
		"aaData": aaData
	});
}

function getAllSequences() {
	var WebHelpName = 'WebHelp.' + this.appname;
	if (localStorage.getItem(WebHelpName)) {
		return JSON.parse(localStorage.getItem(WebHelpName));
	} else {
		return {};
	}
}

function getAllSequencesFromDB() {
	var sequences;
	jQuery.ajax({
		url: "http://devntsl002.blackrock.com:8558/weblications/WebHelp/WebHelp.epl",
		type: "POST",
		async: false,
		data: {
			method: "loadAllSequences",
			tool: this.appname
		},
		success: function (data, status) {
			sequences = JSON.parse(data);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			alert("Failed to load the sequences");
		}
	});

	return sequences;
}

function makeEditable() {
	jQuery("#stepsTable").tableEdit({
		columnsTr: "1,4"
	});
}

function clearStepsInSequence() {
	//Destroy and reinitialize the table to get the edited data
	jQuery("#stepsTable").DataTable().clear().draw();
}

function playSequence(sequenceName) {
	var sequence = getAllSequences()[sequenceName];
	var seqId = sequence.seqId;
	var play = introJs();
	play.setOptions({
		steps: sequence.data,
		showProgress: true,
		showBullets: false
	});
	jQuery('.toggler').trigger('click'); //Close the side menu
	if (jQuery('#contentConsumptionModal').is(':visible')) {
		jQuery('#contentConsumptionModal').modal('hide');
	}
	play.start();
	markThisSequenceAsSeen(seqId);
}

function playThisSequence() {
	var t = jQuery("#" + jQuery('.dataTable:visible').attr('id')).DataTable();
	//t.row(jQuery(event.target).parents('tr')).remove().draw();
	var sequenceName = [t.row(jQuery(event.target).parents('tr')).data()[1]];
	playSequence(sequenceName);
}

/*function removeThisSequenceAsNew(sequenceName) {
 var allStoredSteps = getAllSequences();
 delete allStoredSteps[sequenceName].isNew;
 var WebHelpName = 'WebHelp.' + this.appname;
 localStorage.setItem(WebHelpName, JSON.stringify(allStoredSteps));
 var sequences = populateCurrentSequences();
 }*/

function editThisSequence() {
	var t = jQuery("#availableSequencesList").DataTable();
	var thisSequenceTitle = t.row(jQuery(event.target).parents('tr')).data()[1];
	//t.row(jQuery(event.target).parents('tr')).remove().draw();
	var stepsForThisSequence = getAllSequences()[thisSequenceTitle];
	var stepsTable = jQuery("#stepsTable").DataTable();
	stepsTable.clear().draw();
	jQuery.each(stepsForThisSequence.data, function (index, element) {
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
		stepsTable.row.add([
            "<span class='" + iconClass.remove + "' aria-hidden='true' onclick='removeThisStep()'></span>",
            title,
            elementAttr,
            elementId,
            text])
			.draw();
	});
	makeEditable();
	jQuery('#sequenceTitleSetter').val(thisSequenceTitle);
	jQuery('.nav-tabs a[href=#addSequence]').tab('show');
}

function removeThisSequence() {
	var t = jQuery("#availableSequencesList").DataTable();
	var storedSequences = getAllSequences();
	var seq = storedSequences[t.row(jQuery(event.target).parents('tr')).data()[1]];
	var seqId = seq.seqId;
	delete storedSequences[t.row(jQuery(event.target).parents('tr')).data()[1]];

	var WebHelpName = 'WebHelp.' + this.appname;
	localStorage.setItem(WebHelpName, JSON.stringify(storedSequences));
	populateCurrentSequences();
	refreshWhatsNew();
}