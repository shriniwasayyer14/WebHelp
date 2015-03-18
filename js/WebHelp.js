/* globals jQuery, jQueryDragSelector, window, alert, WebHelpTemplates, introJs, setTimeout, setInterval, localStorage */

var WebHelp;
WebHelp = (function () {
    function WebHelp(WebHelpOptions) {
        //setup defaults
        var defaultOptions = {
            appName: 'DefaultApp',
            mode: 'consume',
            helpIconPosition: '.ai-header .ai-header-title',
            showIntroOnLoad: false,
            usesFontAwesome: false,
            parameters: this.getWindowParameters(),
            ui: {}
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
                "add": "fa fa-plus",
                "info": "fa fa-info-circle",
                "edit": "fa fa-edit",
                "upload": "fa fa-upload"
            };
        } else { //default to bootstrap
            this.iconClass = {
                "remove": "glyphicon glyphicon-remove",
                "play": "glyphicon glyphicon-play-circle",
                "save": "glyphicon glyphicon-floppy-disk",
                "clear": "glyphicon glyphicon-refresh",
                "add": "glyphicon glyphicon-plus",
                "info": "glyphicon glyphicon-info-sign",
                "edit": "glyphicon glyphicon-edit",
                "upload": "glyphicon glyphicon-upload"
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
        this.bindPlayEditButtons();

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
                query_string[pair[0]] = [query_string[pair[0]], pair[1]];
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(pair[1]);
            }
        }
        return query_string;
    };

    WebHelp.prototype.bindPlayEditButtons = function () {
        var self = this;
        //attach sequence specific handlers
        this.ui.webHelpMainContent.on('click', '.play-sequence', this.playThisSequence.bind(self));
        this.ui.webHelpMainContent.on('click', '.edit-sequence', this.editThisSequence.bind(self));
        this.ui.webHelpMainContent.on('click', '.remove-sequence', this.removeThisSequence.bind(self));
    };
	
	WebHelp.prototype.showSequences = function(){
		jQuery('#contentConsumptionModal').modal('show');
	};

    WebHelp.prototype.addHelpIcon = function (navbarButtonElement, addTextToNavbar) {
		var self = this;
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
        this.ui.webHelpButton.on('click', function (event) {
            event.preventDefault();
            self.showSequences();
        });
        this.ui.webHelpButton.attr('title', 'App Help');
    };

    WebHelp.prototype.showHelpConsumptionMode = function () {
        this.addHelpIcon(this.helpIconPosition);
        this.ui.webHelpMainContent = jQuery("#webHelpMainContent");
        if (this.ui.webHelpMainContent.length <= 0) {
            var modalContent = jQuery(WebHelpTemplates["../templates/WebHelpContent.html"]);
            var webHelpContent = jQuery(WebHelpTemplates["../templates/WebHelpCreator.html"]);
            for (var icon in this.iconClass) {
                if (this.iconClass.hasOwnProperty(icon)) {
                    modalContent.find(".iconClass-" + icon).addClass(this.iconClass[icon]);
                    webHelpContent.find(".iconClass-" + icon).addClass(this.iconClass[icon]);
                }
            }
            var $body = jQuery("body");
            $body.append(modalContent);
            $body.append(webHelpContent);
            this.ui.webHelpMainContent = jQuery("#webHelpMainContent");
        }
        this.ui.webHelpMainContent.appendTo("#contentConsumptionModal .modal-body");
        jQuery('.nav-tabs a[href=#addSequence]').hide();
        jQuery('#globalWebHelpCreatorActionsWell').hide();
        if (this.showIntroOnLoad) {
            this.playSequence('Introduction');
        }
        this.refreshWhatsNew();
        var self = this;
        this.watchWhatsNew = setInterval(function () {
            self.refreshWhatsNew();
        }, 15000);
    };

    WebHelp.prototype.showHelpCreationMode = function () {
        var self = this;
        this.ui.webHelpMainContent = jQuery("#webHelpMainContent");
        if (this.ui.webHelpMainContent.length === 0) {
            var webHelpContent = jQuery(WebHelpTemplates["../templates/WebHelpCreator.html"]);
            for (var icon in this.iconClass) {
                if (this.iconClass.hasOwnProperty(icon)) {
                    webHelpContent.find(".iconClass-" + icon).addClass(this.iconClass[icon]);
                }
            }
            jQuery("body").append(webHelpContent);
            this.ui.webHelpMainContent = jQuery("#webHelpMainContent");
        }

        // build bootside menu

        this.ui.webHelpMainContent.BootSideMenu({
            side: "right", // left or right
            autoClose: true // auto close when page loads
        });

        jQuery('.nav-tabs a[href=#addSequence]').trigger('click');

        //attach event handlers to webHelpContent
        jQuery("#sequencePreviewButton").on("click", this.preview.bind(self));
        jQuery("#sequenceSaveButton").on("click", this.saveSequence.bind(self));
        jQuery("#clearStepsButton").on("click", this.clearStepsInSequence.bind(self));
        jQuery("#startDragDropButton").on("click", this.startSelectionOfElement.bind(self));
        jQuery("#startEmptyStepButton").on("click", this.createStepForThisElement.bind(self));
        jQuery("#cancelDragDropButton").on("click", jQueryDragSelector.off);
        jQuery("#noElementsSelectedButton").on("click", jQuery('#noElementsSelectedDiv').hide);
        jQuery("#noStepsInPreviewButton").on("click", jQuery('#noStepsInPreviewDiv').hide);
        jQuery("#saveAllHelpSequencesToFileButton").on("click", this.saveAllHelpSequencesToFile.bind(self));
        jQuery("#importAllHelpSequencesFromFileButton").on("click", this.importAllHelpSequencesFromFile.bind(self));

        var stepsTable = jQuery("#stepsTable");
        stepsTable.on("click", ".remove-step", this.removeThisStep);

        stepsTable.dataTable({
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

    WebHelp.prototype.saveAllHelpSequencesToFile = function() {
        /* Uses the HTML5 download attribute to serve up a file without the server
         * http://www.w3schools.com/tags/att_a_download.asp
         */

        //get required data

        //Pretty print the JSON content
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
        //Syntax: JSON.stringify(value[, replacer[, space]])
        var content = JSON.stringify(this.getAllSequences(), null, '\t');

        var link = document.createElement('a'); //create a hyperlink
        var mimeType = 'application/json';

        //set attributes on top of the link
        link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(content));
        link.setAttribute('download', this.webHelpName + '.json');

        //trigger the download
        link.click();

        //destroy the link
        link.parentNode.removeChild(link);
    };

    WebHelp.prototype.importAllHelpSequencesFromFile = function() {

    };

    WebHelp.prototype.refreshWhatsNew = function () {
        var sequences = this.getAllSequences(); //new function
        var seenSequences = this.getAllVisitedSequences(); //new function
        var newSequences = [];
        for (var seqName in sequences) {
            if (sequences.hasOwnProperty(seqName)) {
                var seq = sequences[seqName];
                var seqId = seq.seqId;
                if (seenSequences.indexOf(seqId) < 0) {
                    newSequences.push(seq);
                }
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

    WebHelp.prototype.makeEditable = function () {
        jQuery("#stepsTable").tableEdit({
            columnsTr: "1,4"
        });
    };

    WebHelp.prototype.populateCurrentSequences = function () {
        var isCreator = (this.parameters.create !== undefined);
        var retrievedHtml = '';
        var retrievedNewHtml = '';
        var retrievedPopularHtml = '';
        var retrievedSequences = this.getAllSequences();

        var numNewSequences = 0;
        if (retrievedSequences) {
            retrievedHtml += '<table id="availableSequencesList">';
            retrievedPopularHtml += '<table id="popularSequencesList">';
            retrievedNewHtml += '<table id="newSequencesList">';
            var self = this;
            jQuery.each(retrievedSequences, function (key, value) {
                var thisElement = "<tr>" +
                    "<td><span class='play-sequence " + self.iconClass.play + "' aria-hidden='true'></span></td>" +
                    "<td>" + key + "</td>" +
                    "<td><span class='edit-sequence " + self.iconClass.edit + "' aria-hidden='true'></td>" +
                    "<td><span class='remove-sequence " + self.iconClass.remove + "' aria-hidden='true' ></td>" +
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
            jQuery("#availableSequencesList").dataTable({
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

            jQuery("#popularSequencesList").dataTable({
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
            this.initWhatsNewTable();
            jQuery('td .' + this.iconClass.play).attr('title', 'Play!');
            jQuery('td .' + this.iconClass.edit).attr('title', 'Edit');
            jQuery('td .' + this.iconClass.remove).attr('title', 'Delete');

            //Convert all the tables to bootstrap-tables
            jQuery('#webHelpMainContent').find('table.dataTable').addClass('table table-hover table-striped table-bordered');
            return {
                numNewSequences: numNewSequences
            };
        }
    };

    WebHelp.prototype.startSelectionOfElement = function () {
        var self = this;
        /* Close the sidemenu if it is open*/
        var status = this.ui.webHelpMainContent.attr("data-status");
        if (status === "opened") {
            jQuery(".toggler").trigger("click");
        }
        jQueryDragSelector.on(function (element) {
            if (element) {
                element.popover({
                    html: true,
                    trigger: 'manual',
                    placement: 'auto top',
                    container: 'body', /*Show on top of all elements*/
                    content: WebHelpTemplates["../templates/WebHelpSelectPopup.html"]
                })
                    .popover('show');
                jQuery(".drag-select-yes").on("click", function () {
                    jQueryDragSelector.confirmSelection(true, function (arrayOfObjects) {
                        if (arrayOfObjects) {
                            self.createStepForThisElement(arrayOfObjects);
                        }
                    });
                }.bind(self));
                jQuery(".drag-select-no").on("click", function () {
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

    WebHelp.prototype.createStepForThisElement = function (arrayOfElems) {
        var t = jQuery("#stepsTable").DataTable();
        var elemText = "";
        var elemType = "";
        if (arrayOfElems) {
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

    WebHelp.prototype.removeThisStep = function (event) {
        var t = jQuery("#stepsTable").DataTable();
        t.row(jQuery(event.target).parents('tr')).remove().draw();
    };

    WebHelp.prototype.preview = function () {
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
	
	WebHelp.prototype.saveSequence = function(){
		//saveToDB()
		var sequenceTitle = jQuery("#sequenceTitleSetter").val().trim();
        var stepsToSave = this.getCurrentTablePreviewSteps();
        var sequences = this.getAllSequences();
        sequences[sequenceTitle] = {
            method: "saveSequence",
            seqId: new Date().getTime(),
            sequenceTitle: sequenceTitle,
            data: stepsToSave,
            tool: this.appName,
            active_flag: 'N',
            url: "test"
        };

        var saveStatus = 'Sequence saved successfully!';
        try {
            localStorage.setItem(this.webHelpName, JSON.stringify(sequences));
        } catch (error) {
            saveStatus = 'Error saving the sequence!';
        } finally {
            var $showSequenceSavedSuccessAlert = jQuery('#showSequenceSavedSuccessAlert');
            $showSequenceSavedSuccessAlert.html(saveStatus).show();
            setTimeout(function() {
                $showSequenceSavedSuccessAlert.hide();
            }, 1000);
        }


	};

    WebHelp.prototype.getCurrentTablePreviewSteps = function () {
        var $stepsTable = jQuery("#stepsTable");
        var numSteps = $stepsTable.find("td");
        var tableHasData = !((numSteps.length <= 0) || ((numSteps.length === 1) && (numSteps.hasClass('dataTables_empty'))));
        if (!tableHasData) {
            jQuery('#noStepsInPreviewDiv').show();
            return false;
        }

        var previewSteps = [];

        var tableRows = $stepsTable.find("tr");
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
                if (elemAttribType !== 'CSSPath') {
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

    WebHelp.prototype.genKey = function () {
        return "WebHelp." + this.appName + "." + this.userName;
    };

    // This function should be tied to the user and the app
    // Returns an array of sequence IDs of the visited sequences
    WebHelp.prototype.getAllVisitedSequences = function () {
        var userPrefs = {};
        jQuery.ajax({
            async : false,
            url: "/weblications/etc/getPrefs.epl",
            success: function(data) {
                data = data.split(/\r?\n/);
                for(var i=0;i<data.length;i++) {
                    var keyVal = data[i].split("/t");
                    userPrefs[keyVal[0]] = keyVal[1];
                }
            }
        });
        
        var key = this.genKey();
        var seqIds = userPrefs[key];
        if (seqIds && seqIds.length > 0) {
            return seqIds;
        } else {
            return [];
        }
    };

    // This method would mark the given sequence as seen
    WebHelp.prototype.markThisSequenceAsSeen = function (seqId) {
        var visitedSeqIds = this.getAllVisitedSequences();
        var key = this.genKey();
        if (visitedSeqIds.indexOf(seqId) < 0) {
            visitedSeqIds.push(seqId);
        }
        this.setVisitedSequencesInUserPrefs(key, visitedSeqIds);
    };

    WebHelp.prototype.setVisitedSequencesInUserPrefs = function(key, val) {
        var self = this;
        jQuery.ajax({
            type: "POST",
            url:"/weblications/etc/setPrefs.epl",
            data: {
                key:val
            },
            success: function() {
                self.refreshWhatsNew(); // new function
            }
        });
    };

    // This table will remove and add new contents to the new sequences table
    WebHelp.prototype.updateNewSequencesTable = function (newSequences) {
        if (newSequences.length >= 1) {
            this.populateCurrentSequences();
        }
        var aaData = [];
        var self = this;
        jQuery.each(newSequences, function (key, value) {
            aaData.push([
                "<span class='play-sequence fa fa-play-circle-o' aria-hidden='true'></span>",
                value.sequenceTitle,
                "<span class='edit-sequence " + self.iconClass.edit + "' aria-hidden='true'>",
                "<span class='remove-sequence " + self.iconClass.remove + "' aria-hidden='true'>",
                JSON.stringify(value)
            ]);
        });
        this.initWhatsNewTable(aaData);
    };

    WebHelp.prototype.initWhatsNewTable = function (aaData) {
        jQuery("#newSequencesList").dataTable({
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
            "aaData": aaData || []
        });
    };

    WebHelp.prototype.getAllSequences = function () {
        if (localStorage.getItem(this.webHelpName)) {
            return JSON.parse(localStorage.getItem(this.webHelpName));
        } else {
            return {};
        }
    };

    WebHelp.prototype.getAllSequencesFromDB = function () {
        var sequences;
        jQuery.ajax({
            url: "http://devntsl002.blackrock.com:8558/weblications/WebHelp/WebHelp.epl",
            type: "POST",
            async: false,
            data: {
                method: "loadAllSequences",
                tool: this.appName
            },
            success: function (data) {
                sequences = JSON.parse(data);
            },
            error: function () {
                alert("Failed to load the sequences");
            }
        });

        return sequences;
    };


    WebHelp.prototype.clearStepsInSequence = function () {
        //Destroy and reinitialize the table to get the edited data
        jQuery("#stepsTable").DataTable().clear().draw();
    };

    WebHelp.prototype.playSequence = function (sequenceName) {
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

    WebHelp.prototype.playThisSequence = function (event) {
        var t = jQuery("#" + jQuery('.dataTable:visible').attr('id')).DataTable();
        var sequenceName = [t.row(jQuery(event.target).parents('tr')).data()[1]];
        this.playSequence(sequenceName);
    };

    WebHelp.prototype.editThisSequence = function (event) {
        var t = jQuery("#availableSequencesList").DataTable();
        var thisSequenceTitle = t.row(jQuery(event.target).parents('tr')).data()[1];
        //t.row(jQuery(event.target).parents('tr')).remove().draw();
        var stepsForThisSequence = this.getAllSequences()[thisSequenceTitle];
        var stepsTable = jQuery("#stepsTable").DataTable();
        stepsTable.clear().draw();
        var self = this;
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
                "<span class='remove-step " + self.iconClass.remove + "' aria-hidden='true'></span>",
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

    WebHelp.prototype.removeThisSequence = function (event) {
        var t = jQuery("#availableSequencesList").DataTable();
        var storedSequences = this.getAllSequences();
        delete storedSequences[t.row(jQuery(event.target).parents('tr')).data()[1]];

        localStorage.setItem(this.webHelpName, JSON.stringify(storedSequences));
        this.populateCurrentSequences();
        this.refreshWhatsNew();
    };

    return WebHelp;
})();
