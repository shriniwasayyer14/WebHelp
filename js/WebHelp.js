var modeOfOperation;

function initWebHelp(WebHelpOptions) {
    var helpIconPosition = '.ai-header .ai-header-title';
    var showIntroOnLoad = true;

    if (WebHelpOptions) {
        helpIconPosition = WebHelpOptions.helpIconPosition || helpIconPosition;
        showIntroOnLoad = (typeof WebHelpOptions.showIntroOnLoad != 'undefined') ? WebHelpOptions.showIntroOnLoad : showIntroOnLoad;
    }
    var parameters = getWindowParameters();

    var addWebHelpContainerFunc = function () {
        var webHelpContent = getWebHelpContainerHTML();
        jQuery("body").append(webHelpContent);
    };

    var addHelpIconFunc = function () {
        createNewNavigationButton(helpIconPosition);
    };

    var showIntroOnStartup = function () {
        var availableSequences = getAllSequences();
        if(showIntroOnLoad) {
            if (availableSequences['Introduction']) {
                playSequence('Introduction');
            }
        }
    };
    var showHelpConsumptionMode = function () {
        addHelpIconFunc();
        moveTableDivsToModal();
        showIntroOnStartup();
        refreshWhatsNew();
        setInterval(function(){
            refreshWhatsNew();
        },3000);
    };

    var showHelpCreationMode = function () {
        jQuery('#webHelpMainContent').BootSideMenu({
            side: "right", // left or right
            autoClose: true // auto close when page loads
        });
        setUpAddEditTable();
        var currentTitleHTML = jQuery(helpIconPosition).html();
        currentTitleHTML += "[Edit mode]";
        var elem;
        if(jQuery(helpIconPosition) && jQuery(helpIconPosition).length > 1) {
            elem = jQuery(helpIconPosition)[0];
        } else {
            elem = jQuery(helpIconPosition);
        }
        jQuery(elem).html(currentTitleHTML);
        refreshWhatsNew();
    };

/*
    var addBadgeToHelpIcon = function (numNewSequences) {
        setNewSequenceCountBadgeOnHelpIcon(numNewSequences);
    };*/

    addWebHelpContainerFunc();
    populateCurrentSequences();
    if (parameters['create'] != undefined) {
        modeOfOperation = "create";
        showHelpCreationMode();
    } else {
        modeOfOperation = "consume";
        showHelpConsumptionMode();
    }
}

function getWebHelpContainerHTML() {
    var webHelpElementsHTML = "<div id=\"webHelpMainContent\">\r\n    " +
        "<div class=\"tabbable\"> <!-- Only required for left\/right tabs -->\r\n        " +
        "<ul class=\"nav nav-tabs\">\r\n            " +
        "<li class=\"active\"><a href=\"#popularSequences\" data-toggle=\"tab\">Popular<\/a><\/li>\r\n            " +
        "<li><a href=\"#whatsNew\" data-toggle=\"tab\">What\'s New?<!--<span class=\"badge\" id=\"newItemsBadge\"\/>--><\/a>\r\n            " +
        "<li><a href=\"#availableSequences\" data-toggle=\"tab\">Topics<\/a><\/li>\r\n            " +
        "<li><a href=\"#addSequence\" data-toggle=\"tab\">Add\/Edit Sequence<\/a><\/li>\r\n        " +
        "<\/ul>\r\n        " +
        "<div class=\"tab-content\">\r\n            " +
        "<div class=\"tab-pane active\" id=\"popularSequences\">\r\n                " +
        "<div id=\"popularSequencesContent\">\r\n                    No popular items yet!\r\n                <\/div>\r\n            " +
        "<\/div>\r\n            <div class=\"tab-pane\" id=\"whatsNew\">\r\n                " +
        "<div id=\"whatsNewContent\">\r\n                    No new items yet!\r\n                <\/div>\r\n            " +
        "<\/div>\r\n            " +
        "<div class=\"tab-pane\" id=\"availableSequences\">\r\n                " +
        "<div id=\"availableSequencesContent\">\r\n                    Placeholder where you can search for existing sequences\r\n                <\/div>\r\n            " +
        "<\/div>\r\n            " +
        "<div class=\"tab-pane\" id=\"addSequence\">\r\n                " +
        "<div class=\"well\">\r\n                    " +
        "<section contenteditable=\"true\">\r\n                        " +
        "<div><input type=\"text\" id=\"sequenceTitleSetter\" value=\"Sequence title\"\/>\r\n\r\n                            " +
        "<\/div>\r\n                        " +
        "<table id=\"stepsTable\" class=\"table table-bordered table-hover\">\r\n                        " +
        "<\/table>\r\n                    " +
        "<\/section>\r\n                   " +
        "<button type=\"button\" id=\'sequencePreviewButton\' class=\"btn btn-default centered actionButton\"\r\n                            aria-label=\"Left Align\"\r\n                            style=\"margin-top:20px;\" onclick=\"preview();\">\r\n                        <span class=\"fa fa-play-circle-o\" aria-hidden=\"true\"><\/span> Preview\r\n                    <\/button>\r\n                    " +
        "<button type=\"button\" id=\'sequenceSaveButton\' class=\"btn btn-default centered\"\r\n                            aria-label=\"Left Align\"\r\n                            style=\"margin-top:20px;\"\r\n                            onclick=\"save();\">\r\n                        <span class=\"fa fa-floppy-o\" aria-hidden=\"true\"><\/span> Save\r\n                    <\/button>\r\n                    " +
        "<button type=\"button\" id=\'clearStepsButton\' class=\"btn btn-default centered\"\r\n                            aria-label=\"Left Align\"\r\n                            style=\"margin-top:20px;\"\r\n                            onclick=\"clearStepsInSequence();\">\r\n                        <span class=\"fa fa-refresh\" aria-hidden=\"true\"><\/span> Clear\r\n                    <\/button>\r\n                " +
        "<\/div>\r\n                " +
        "<div class=\"well\">Available actions:\r\n                    " +
        "<div class=\"well-sm\">\r\n                        " +
        "<button data-toggle=\"tooltip\" data-placement=\"top\"\r\n                                title=\"Click and drag over elements on the page to select them\"\r\n                                class=\"btn btn-success\" role=\"button\"\r\n                                id=\"startDragDropButton\"\r\n                                onClick=\"startSelectionOfElement(true);\"><span class=\"fa fa-plus\"><\/span> Add element\r\n                            step\r\n                        <\/button>\r\n                        " +
        "<button class=\"btn btn-info\" role=\"button\"\r\n                                id=\"startEmptyStepButton\"\r\n                                onClick=\"startSelectionOfElement(false);\"><span class=\"fa fa-plus\"><\/span> Add page step\r\n                        <\/button>\r\n                        " +
        "<button class=\"btn btn-danger\" id=\"cancelDragDropButton\"\r\n                                role=\"button\"\r\n                                onClick=\"jQueryDragSelector.off();\"><span class=\"fa fa-times\"><\/span> Cancel\r\n                        <\/button>\r\n                    " +
        "<\/div>\r\n                " +
        "<\/div>\r\n                " +
        "<div class=\"alert alert-danger\" id=\"noElementsSelectedDiv\" style=\"display: none;\">\r\n                    " +
        "<button type=\"button\" class=\"close\" onclick=\"jQuery(\'#noElementsSelectedDiv\').hide();\"\r\n                            aria-label=\"Close\"><span\r\n                            aria-hidden=\"true\">&times;<\/span><\/button>\r\n                    No elements were selected, please try again\r\n                <\/div>\r\n                " +
        "<div class=\"alert alert-danger\" id=\"noStepsInPreviewDiv\" style=\"display: none;\">\r\n                    <button type=\"button\" class=\"close\" onclick=\"jQuery(\'#noStepsInPreviewDiv\').hide();\"\r\n                            aria-label=\"Close\"><span\r\n                            aria-hidden=\"true\">&times;<\/span><\/button>\r\n                    No steps to preview. Please add steps.\r\n                <\/div>\r\n            " +
        "<\/div>\r\n        " +
        "<\/div>\r\n    " +
        "<\/div>\r\n" +
        "<\/div>\r\n" +
        "<div id=\"contentConsumptionModal\" class=\"modal\">\r\n    " +
        "<div class=\"modal-dialog\">\r\n        " +
        "<div class=\"modal-content\" style=\"width: 800px;\">\r\n            " +
        "<div class=\"modal-header ai-modal-title\">\r\n                " +
        "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span\r\n                        aria-hidden=\"true\">&times;<\/span><\/button>\r\n                " +
        "What would you like to learn?\r\n            " +
        "<\/div>\r\n            " +
        "<div class=\"modal-body\"><\/div>\r\n            " +
        "<div class=\"modal-footer\">\r\n                <button data-dismiss=\"modal\" class=\"btn btn-default\">Close<\/button>\r\n            <\/div>\r\n        " +
        "<\/div>\r\n    " +
        "<\/div>\r\n" +
        "<\/div>";
    return webHelpElementsHTML;
}

function moveTableDivsToModal() {
    jQuery("#webHelpMainContent").appendTo("#contentConsumptionModal .modal-body");
    jQuery('.nav-tabs a[href=#addSequence]').hide();
}

function createNewNavigationButton(navbarButtonElement, addTextToNavbar) {
    var dropdownButtonHtml = '<button class="btn light" id="contentConsumptionNavButton" >' +
        '<i class="fa fa-info-circle"></i>';

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
        }
    ).rowReordering();
    makeEditable();
}

function setNewSequenceCountBadgeOnHelpIcon(numNewSequences) {
    var $helpIcon = jQuery('#contentConsumptionNavButton');
    if(modeOfOperation == "create") {
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
    if(elementSelection && status === "opened") {
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
        "<span class='fa fa-times' aria-hidden='true' onclick='removeThisStep()'></span>",
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
        var preview = introJs();
        preview.setOptions({
            steps: previewSteps,
            showProgress: true,
            showBullets: false,
            tooltipPosition: 'auto'
        });
        jQuery('.toggler').trigger('click'); //Close the side menu
        setTimeout(function () {
            preview.start();
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
            "appName": appNameForWebHelp,
            //"url": "WebHelp",
            "data": stepsToSave,
            "seqId": new Date().getTime()
        };

        // Put the object into storage
        var WebHelpName = 'WebHelp.' + appNameForWebHelp;
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
            if(elemAttribType != 'CSSPath') {
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
    for(seqName in sequences) {
        var seq = sequences[seqName];
        var seqId = seq.seqId;
        if(seenSequences.indexOf(seqId) < 0) {
            newSequences.push(seq);
        }
    }
    updateNewSequencesTable(newSequences); // new function
}


// This function should be tied to the user and the app
// Returns an array of sequence IDs of the visited sequences
function getAllVisitedSequences() {
    var key = "WebHelp."+appNameForWebHelp+"."+userName;
    var seqIds = JSON.parse(localStorage.getItem(key));
    if(seqIds && seqIds.length > 0) {
        return seqIds;
    } else {
        return [];
    }
}

// This method would mark the given sequence as seen
function markThisSequenceAsSeen(seqId) {
    var visitedSeqIds = getAllVisitedSequences();
    var key = "WebHelp."+appNameForWebHelp+"."+userName;
    if(visitedSeqIds.indexOf(seqId) < 0) {
        visitedSeqIds.push(seqId);
        localStorage.setItem(key, JSON.stringify(visitedSeqIds));
    }
    refreshWhatsNew();// new function
}

// This table will remove and add new contents to the new sequences table
function updateNewSequencesTable(newSequences) {
    var numOfNewSequences = newSequences.length;
    if(newSequences.length >= 1) {
        populateCurrentSequences();
    }

    var aaData = [];
    jQuery.each(newSequences, function (key, value) {
        var row = [];
        row.push("<span class='fa fa-play-circle-o' aria-hidden='true' onclick='playThisSequence()'></span>");
        row.push(value.sequenceTitle);
        row.push("<span class='fa fa-edit' aria-hidden='true' onclick='editThisSequence()'>");
        row.push("<span class='fa fa-times' aria-hidden='true' onclick='removeThisSequence()'>");
        row.push(JSON.stringify(value));

        aaData.push(row);
    });
    //$('#newSequencesList').dataTable().fnClearTable();
    initWhatsNewTable(aaData);
    setTimeout(function(){
        setNewSequenceCountBadgeOnHelpIcon(numOfNewSequences);
    },2000);
}

function populateCurrentSequences() {
    var isCreator = (getWindowParameters()['create'] != undefined) ? true : false;
    var retrievedHtml = '';
    var retrievedNewHtml = '';
    var retrievedPopularHtml = '';
    var retrievedSequences = getAllSequences();
    var numNewSequences = 0;
    if (retrievedSequences) {
        retrievedHtml += '<table id="availableSequencesList">';
        retrievedPopularHtml += '<table id="popularSequencesList">';
        retrievedNewHtml += '<table id="newSequencesList">';
        jQuery.each(retrievedSequences, function (key, value) {
            var thisElement = "<tr>" +
                "<td><span class='fa fa-play-circle-o' aria-hidden='true' onclick='playThisSequence()'></span></td>" +
                "<td>" + key + "</td>" +
                "<td><span class='fa fa-edit' aria-hidden='true' onclick='editThisSequence()'></td>" +
                "<td><span class='fa fa-times' aria-hidden='true' onclick='removeThisSequence()'></td>" +
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
            }
        );

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
            }
        );

        jQuery('#whatsNewContent').html(retrievedNewHtml);
        var emptyData = [];
        initWhatsNewTable();
        jQuery('td .fa-play-circle-o').attr('title', 'Play!');
        jQuery('td .fa-edit').attr('title', 'Edit');
        jQuery('td .fa-times').attr('title', 'Delete');

        //Convert all the tables to bootstrap-tables
        jQuery('#webHelpMainContent table.dataTable').addClass('table table-hover table-striped table-bordered');
        return {
            numNewSequences: numNewSequences
        }
    }
}

function initWhatsNewTable(aaData) {
    var a = jQuery("#newSequencesList").dataTable({
        "sDom": '<"top"f>', //It should be a searchable table
        "oLanguage": {
            "sSearch": "Search title and content: "
        },
        "bDestroy":true,
        "bRender":true,
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
        "aaData":aaData
    });
}

function getAllSequences() {
    var WebHelpName = 'WebHelp.' + appNameForWebHelp;
    if (localStorage.getItem(WebHelpName)) {
        return JSON.parse(localStorage.getItem(WebHelpName));
    } else {
        return {};
    }
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
    var WebHelpName = 'WebHelp.' + appNameForWebHelp;
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
            "<span class='fa fa-times' aria-hidden='true' onclick='removeThisStep()'></span>",
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

    var WebHelpName = 'WebHelp.' + appNameForWebHelp;
    localStorage.setItem(WebHelpName, JSON.stringify(storedSequences));
    populateCurrentSequences();
    refreshWhatsNew();
}

function getWindowParameters() {
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
}