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
			parameters: this.getWindowParameters(),
			ui: {}
		};
		if (!WebHelpOptions) {
			WebHelpOptions = defaultOptions;
		}
		for (var option in defaultOptions){
			this[option] = WebHelpOptions.hasOwnProperty(option) ? WebHelpOptions[option] : defaultOptions[option];
		}

		//setup icon classes
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
				
		//build the gui
		if (this.parameters.create !== undefined) {
        this.mode = "create";
        this.showHelpCreationMode();
    } else {
        this.mode = "consume";
        this.showHelpConsumptionMode();
    }
	}
	
	//detect jquery params
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

	WebHelp.prototype.addHelpIcon = function (navbarButtonElement, addTextToNavbar) {
		if (!navbarButtonElement) {
			navbarButtonElement = this.helpIconPosition;
		}
		var dropdownButtonHtml = '<button class="btn light" id="contentConsumptionNavButton" >' +
			'<i class="' + this.iconClass.info + '"></i>';
		if (addTextToNavbar) {
			dropdownButtonHtml += 'App Help';
		}
		dropdownButtonHtml += '</button>';
		this.ui.webHelpButton = jQuery(dropdownButtonHtml);
		//Add to navbar if need be
		if ((jQuery('.ai-navbar').length > 0) && (jQuery(navbarButtonElement + ':last-of-type').hasClass('nav-right'))) {
			jQuery(navbarButtonElement + ':last-of-type').after(this.ui.webHelpButton);
			this.ui.webHelpButton.addClass('nav-right');
		} else {
			jQuery(navbarButtonElement).after(this.ui.webHelpButton);
		}
		this.ui.webHelpButton.click(function (event) {
			event.preventDefault();
			jQuery('#contentConsumptionModal').modal('show');
		});
		this.ui.webHelpButton.attr('title', 'App Help');
	};
	
	WebHelp.prototype.showHelpConsumptionMode = function () {
		this.addHelpIcon(this.helpIconPosition);
		this.ui.webHelpMainContent.appendTo("#contentConsumptionModal .modal-body");
		jQuery('.nav-tabs a[href=#addSequence]').hide();
		if (this.showIntroOnLoad) {
			this.playSequence('Introduction');
		}
		this.refreshWhatsNew();
		this.watchWhatsNew = setInterval(function () {
			this.refreshWhatsNew();
		}, 15000);
	};
	
	WebHelp.prototype.showHelpCreationMode = function () {
		var self = this;
		
		if (jQuery("#webHelpMainContent").length === 0){
			var webHelpContent = jQuery(WebHelpTemplates["../templates/WebHelpCreator.html"]);
			for (var icon in this.iconClass) {
				webHelpContent.find("iconClass-" + icon).addClass(this.iconClass[icon]);
			}
			jQuery("body").append(webHelpContent);
		}
		
		// build bootside menu
		this.ui.webHelpMainContent = jQuery("#webHelpMainContent");
		this.ui.webHelpMainContent.BootSideMenu({
			side: "right", // left or right
			autoClose: true // auto close when page loads
		});
		
		//attach event handlers to webHelpContent
		jQuery("#sequencePreviewButton").on("click", this.preview.bind(self));
		jQuery("#sequenceSaveButton").on("click", this.saveToDB.bind(self));
		jQuery("#clearStepsButton").on("click", this.clearStepsInSequence.bind(self));
		jQuery("#startDragDropButton").on("click", this.startSelectionOfElement.bind(self));
		jQuery("#startEmptyStepButton").on("click", this.createStepForThisElement.bind(self));
		jQuery("#cancelDragDropButton").on("click", jQueryDragSelector.off);
		jQuery("#noElementsSelectedButton").on("click", jQuery('#noElementsSelectedDiv').hide);
		jQuery("#noStepsInPreviewButton").on("click", jQuery('#noStepsInPreviewDiv').hide);
		
		//attach sequence specific handlers
		this.ui.webHelpMainContent.on('click', 'play-sequence', this.playThisSequence.bind(self));
		this.ui.webHelpMainContent.on('click', 'edit-sequence', this.editThisSequence.bind(self));
		this.ui.webHelpMainContent.on('click', 'remove-sequence', this.removeThisSequence.bind(self));
		
		
		var stepsTable = jQuery("#stepsTable");
		stepsTable.on("click", ".remove-step", this.removeThisStep);
		
		var t = stepsTable.dataTable({
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
		this.makeEditable();
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
		this.refreshWhatsNew();
	};

	WebHelp.prototype.refreshWhatsNew = function() {
		var sequences = this.getAllSequences(); //new function
		var seenSequences = this.getAllVisitedSequences(); //new function
		var newSequences = [];
		for (var seqName in sequences) {
			var seq = sequences[seqName];
			var seqId = seq.seqId;
			if (seenSequences.indexOf(seqId) < 0) {
				newSequences.push(seq);
			}
		}
		this.updateNewSequencesTable(newSequences); // new function
		
		//update badge icon
		var numOfNewSequences = newSequences.length;
		
		if (this.mode !== "create") {
			if (numOfNewSequences > 0) {
				this.ui.webHelpButton.attr('data-badge', numOfNewSequences);
			} else {
				this.ui.webHelpButton.removeAttr('data-badge');
			}
		}
		
	};
	
	WebHelp.prototype.makeEditable = function() {
		jQuery("#stepsTable").tableEdit({
			columnsTr: "1,4"
		});
	};
	
	WebHelp.prototype.populateCurrentSequences = function() {
		var isCreator = (this.parameters.create !== undefined) ? true : false;
		var retrievedHtml = '';
		var retrievedNewHtml = '';
		var retrievedPopularHtml = '';
		var retrievedSequences = this.getAllSequences();
		var sequencesFromDB = this.getAllSequencesFromDB();

		var numNewSequences = 0;
		if (retrievedSequences) {
			retrievedHtml += '<table id="availableSequencesList">';
			retrievedPopularHtml += '<table id="popularSequencesList">';
			retrievedNewHtml += '<table id="newSequencesList">';
			jQuery.each(retrievedSequences, function (key, value) {
				var thisElement = "<tr>" +
					"<td><span class='play-sequence " + this.iconClass.play + "' aria-hidden='true'></span></td>" +
					"<td>" + key + "</td>" +
					"<td><span class='edit-sequence " + this.iconClass.edit + "' aria-hidden='true'></td>" +
					"<td><span class='remove-sequence " + this.iconClass.remove + "' aria-hidden='true' ></td>" +
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
			this.initWhatsNewTable();
			jQuery('td .' + this.iconClass.play).attr('title', 'Play!');
			jQuery('td .' + this.iconClass.edit).attr('title', 'Edit');
			jQuery('td .' + this.iconClass.remove).attr('title', 'Delete');

			//Convert all the tables to bootstrap-tables
			jQuery('#webHelpMainContent table.dataTable').addClass('table table-hover table-striped table-bordered');
			return {
				numNewSequences: numNewSequences
			};
		}
	};
	
	WebHelp.prototype.startSelectionOfElement = function() {
		var self = this;
		/* Close the sidemenu if it is open*/
		var status = this.ui.webHelpMainContent.attr("data-status");
		if (status === "opened") {
			jQuery(".toggler").trigger("click");
		}
		jQueryDragSelector.on(function(element){
			if (element){
				element.popover({
						html: true,
						trigger: 'manual',
						placement: 'auto top',
						container: 'body', /*Show on top of all elements*/
						content: WebHelpTemplates["../templates/WebHelpSelectPopup.html"]
				})
				.popover('show');
				jQuery(".drag-select-yes").on("click", function(){
					jQueryDragSelector.confirmSelection(true, function(arrayOfObjects){
						if (arrayOfObjects){
							self.createStepForThisElement(arrayOfObjects);
						}
					});
				}.bind(self));
				jQuery(".drag-select-no").on("click", function(){
					jQueryDragSelector.confirmSelection(false);
				});
			} else {
				jQuery('#noElementsSelectedDiv').show();
			}
		});
		jQuery("#startDragDropButton").tooltip({
			trigger: 'manual'
		}).tooltip("show");
		setTimeout(function () {
			jQuery("#startDragDropButton").tooltip('hide');
		}, 3000);
	};
	
	WebHelp.prototype.createStepForThisElement = function(arrayOfElems) {
		var t = jQuery("#stepsTable").DataTable();
		var elemText = "";
		var elemType = "";
		if (arrayOfElems){
			for (var i = 0; i < arrayOfElems.length; i++) {
				elemText += arrayOfElems[i].value + "&";
				elemType += arrayOfElems[i].attribute + "&";
			}
		}
		elemText = elemText.substring(0, elemText.length - 1);
		elemType = elemType.substring(0, elemType.length - 1);
		t.row.add([
					"<span class='" + this.iconClass.remove + "' aria-hidden='true'></span>",
					"Editable title",
					elemType,
					elemText,
					"Editable content"])
			.draw();
		this.makeEditable();
	};

	WebHelp.prototype.removeThisStep = function(event) {
		var t = jQuery("#stepsTable").DataTable();
		t.row(jQuery(event.target).parents('tr')).remove().draw();
	};

	WebHelp.prototype.preview = function() {
		//destroyAndRedrawTable(); //Doesn't respect row reordering
		var previewSteps = this.getCurrentTablePreviewSteps();

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
	};

	WebHelp.prototype.saveToDB = function() {
		var sequenceTitle = jQuery("#sequenceTitleSetter").val().trim();
		var stepsToSave = this.getCurrentTablePreviewSteps();
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
				this.populateCurrentSequences();
				this.refreshWhatsNew();
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("Save action failed!");
			}
		});
	};

	WebHelp.prototype.getCurrentTablePreviewSteps = function() {
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
	};
	
	WebHelp.prototype.genKey = function(){
		var key = "WebHelp." + this.appname + "." + this.userName;
		return key;
	};

	// This function should be tied to the user and the app
	// Returns an array of sequence IDs of the visited sequences
	WebHelp.prototype.getAllVisitedSequences = function(){
		var key = this.genKey();
		var seqIds = JSON.parse(localStorage.getItem(key));
		if (seqIds && seqIds.length > 0) {
			return seqIds;
		} else {
			return [];
		}
	};

	// This method would mark the given sequence as seen
	WebHelp.prototype.markThisSequenceAsSeen = function(seqId) {
		var visitedSeqIds = this.getAllVisitedSequences();
		var key = this.genKey();
		if (visitedSeqIds.indexOf(seqId) < 0) {
			visitedSeqIds.push(seqId);
			localStorage.setItem(key, JSON.stringify(visitedSeqIds));
		}
		this.refreshWhatsNew(); // new function
	};

	// This table will remove and add new contents to the new sequences table
	WebHelp.prototype.updateNewSequencesTable = function(newSequences) {
		if (newSequences.length >= 1) {
			this.populateCurrentSequences();
		}
		var aaData = [];
		jQuery.each(newSequences, function (key, value) {
			aaData.push([
				"<span class='play-sequence fa fa-play-circle-o' aria-hidden='true'></span>",
				value.sequenceTitle,
				"<span class='edit-sequence " + this.iconClass.edit + "' aria-hidden='true'>",
				"<span class='remove-sequence " + this.iconClass.remove + "' aria-hidden='true'>",
				JSON.stringify(value)
			]);
		});
		this.initWhatsNewTable(aaData);
	};

	WebHelp.prototype.initWhatsNewTable = function(aaData) {
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
	};

	WebHelp.prototype.getAllSequences = function() {
		var WebHelpName = 'WebHelp.' + this.appname;
		if (localStorage.getItem(WebHelpName)) {
			return JSON.parse(localStorage.getItem(WebHelpName));
		} else {
			return {};
		}
	};

	WebHelp.prototype.getAllSequencesFromDB = function() {
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
	};



	WebHelp.prototype.clearStepsInSequence = function() {
		//Destroy and reinitialize the table to get the edited data
		jQuery("#stepsTable").DataTable().clear().draw();
	};

	WebHelp.prototype.playSequence = function(sequenceName){
		var sequence = this.getAllSequences()[sequenceName];
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
		this.markThisSequenceAsSeen(seqId);
	};

	WebHelp.prototype.playThisSequence = function(event) {
		var t = jQuery("#" + jQuery('.dataTable:visible').attr('id')).DataTable();
		var sequenceName = [t.row(jQuery(event.target).parents('tr')).data()[1]];
		this.playSequence(sequenceName);
	};

	WebHelp.prototype.editThisSequence = function(event){
		var t = jQuery("#availableSequencesList").DataTable();
		var thisSequenceTitle = t.row(jQuery(event.target).parents('tr')).data()[1];
		//t.row(jQuery(event.target).parents('tr')).remove().draw();
		var stepsForThisSequence = this.getAllSequences()[thisSequenceTitle];
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
							"<span class='remove-step " + this.iconClass.remove + "' aria-hidden='true'></span>",
							title,
							elementAttr,
							elementId,
							text])
				.draw();
		});
		this.makeEditable();
		jQuery('#sequenceTitleSetter').val(thisSequenceTitle);
		jQuery('.nav-tabs a[href=#addSequence]').tab('show');
	};

	WebHelp.prototype.removeThisSequence = function(event) {
		var t = jQuery("#availableSequencesList").DataTable();
		var storedSequences = this.getAllSequences();
		var seq = storedSequences[t.row(jQuery(event.target).parents('tr')).data()[1]];
		var seqId = seq.seqId;
		delete storedSequences[t.row(jQuery(event.target).parents('tr')).data()[1]];

		var WebHelpName = 'WebHelp.' + this.appname;
		localStorage.setItem(WebHelpName, JSON.stringify(storedSequences));
		this.populateCurrentSequences();
		this.refreshWhatsNew();
	};

	return WebHelp;
})();
