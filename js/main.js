/* Calling the side menu option where the steps will be listed*/

function initWebHelp(webHelpElementMap) {
    var parameters = getWindowParameters();

    var elementsToScale = '#ai-content, .ai-header, .ai-navbar';
    var navbarButtonElement = '.ai-header .ai-header-title';
    var addTextToNavbar = false;

    if (webHelpElementMap) {
        elementsToScale = webHelpElementMap.elementsToScale || elementsToScale;
        navbarButtonElement = webHelpElementMap.navbarButtonElement || navbarButtonElement;
        addTextToNavbar = webHelpElementMap.addTextToNavbar || addTextToNavbar;
    }

    if (parameters['create'] != undefined) {
        jQuery('#webHelpMainContent').BootSideMenu({
            side: "right", // left or right
            autoClose: true // auto close when page loads
        });

        //Add function to click of toggle so that page gets resized
        jQuery('.toggler').click(function () {
            var toggler = jQuery(this);
            var container = toggler.parent();
            var containerWidth = container.width();
            var status = container.attr('data-status');
            if (!status) {
                status = "opened";
            }
            var bodyWidth = jQuery("body").width();
            if (status === "opened") {
                /*This part is slightly confusing. If the status is 'opened',
                 then it's going to be closed in the next step and vice versa*/
                jQuery(elementsToScale).css('width', bodyWidth);
            } else {
                jQuery(elementsToScale).css('width', bodyWidth - containerWidth - 20);
            }
        });

        setUpAddEditTable();
    } else {
        moveTableDivsToModal();
        showIntroOnStartup();
        createNewNavigationButton(navbarButtonElement);
    }
    populateCurrentSequences();
}

function showIntroOnStartup() {
    var availableSequences = retrieveLocalStorage();
    if (availableSequences['Introduction']) {
        playSequence('Introduction');
    }
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

    jQuery('#contentConsumptionNavButton').click(function () {
        jQuery('#contentConsumptionModal').modal('show');
    });

    jQuery('#contentConsumptionNavButton').attr('title', 'App Help');

}

function setUpAddEditTable() {
    var t = jQuery("#stepsTable").dataTable({
            "sDom": "",
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
                    "sTitle": "Element",
                    "sWidth": "15%"
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

function startSelectionOfElement(selectElement) {
    if (selectElement) {
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
    for (var i = 0; i < arrayOfElems.length; i++) {
        elemText += arrayOfElems[i].value + "&";
    }
    elemText = elemText.substring(0, elemText.length - 1);
    t.row.add([
        "<span class='fa fa-times' aria-hidden='true' onclick='removeThisStep()'></span>",
        "Editable title",
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
    destroyAndRedrawTable();
    var rows = jQuery("#stepsTable").DataTable().rows().data();
    if (rows.length <= 0) {
        jQuery('#noStepsInPreviewDiv').show();
        return;
    }
    var preview = introJs();
    var previewSteps = [];

    for (var n = 0; n < rows.length; n++) {
        var elemAttribVal = rows[n][2];
        var stepTitle = rows[n][1];
        var content = rows[n][3];
        if (elemAttribVal) {
            var elem = document.querySelector("#" + elemAttribVal); // Assuming the elem attrib is an id for now
            previewSteps.push({
                element: elem,
                intro: content,
                position: 'bottom'
            });
        } else {
            previewSteps.push({
                intro: '<div><h3>' + stepTitle + '</h3><p>' + content + '</p></div>'
            });
        }
    }

    preview.setOptions({
        steps: previewSteps,
        showProgress: true,
        showBullets: false,
        tooltipPosition: 'auto'
    });
    jQuery('.toggler').trigger('click'); //Close the side menu
    preview.start();
}

function save() {
    destroyAndRedrawTable();
    /*jQuery.ajax({
     type: "POST",
     url: "https://dev.blackrock.com:8558/weblications/WebQuery/WebHelp.epl",
     data: {
     "owner": "sayyer",
     "type": "test",
     "tool": "Test App",
     "url": "WebHelp",
     "data": new Array({title: "title", elem: "elem", elemAttrib: "elemAttrib", description: "Testing"})
     },
     success: function (data, success) {
     console.log(data);
     }
     });*/

    var rows = jQuery("#stepsTable").DataTable().rows().data();
    if (rows.length <= 0) {
        jQuery('#noStepsInPreviewDiv').show();
        return;
    }
    var previewSteps = [];
    var sequenceTitle = jQuery('#sequenceTitleSetter').val().trim();

    for (var n = 0; n < rows.length; n++) {
        var elemAttribVal = rows[n][2];
        var stepTitle = rows[n][1];
        var content = rows[n][3];
        if (elemAttribVal) {
            var elem = document.querySelector("#" + elemAttribVal); // Assuming the elem attrib is an id for now
            previewSteps.push({
                element: "#" + elemAttribVal,
                intro: '<div><h3>' + stepTitle + '</h3><p>' + content + '</p></div>',
                position: 'bottom'
            });
        } else {
            previewSteps.push({
                intro: '<div><h3>' + stepTitle + '</h3><p>' + content + '</p></div>'
            });
        }
    }

    var testObject = {};
    testObject[sequenceTitle] = {
        "sequenceTitle": sequenceTitle,
        "appName": "Test App",
        //"url": "WebHelp",
        "data": previewSteps,
        "isNew": jQuery('#markAsNewSequence').is(':checked')
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

}

function populateCurrentSequences() {
    var isCreator = (getWindowParameters()['create'] != undefined) ? true : false;
    var retrievedHtml = '';
    var retrievedNewHtml = '';
    var retrievedPopularHtml = '';
    var retrievedSequences = retrieveLocalStorage();
    var numNewItems = 0;
    if (retrievedSequences) {
        retrievedHtml += '<table id="availableSequencesList">';
        retrievedPopularHtml += '<table id="popularSequencesList">';
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
            if (value.isNew) {
                if (retrievedNewHtml === '') {
                    retrievedNewHtml += '<table id="newSequencesList">';
                }
                retrievedNewHtml += "<tr>" +
                "<td><span class='fa fa-play-circle-o' aria-hidden='true' onclick='playThisSequence()'></span></td>" +
                "<td>" + key + "</td>" +
                "<td><span class='fa fa-edit' aria-hidden='true' onclick='editThisSequence()'></td>" +
                "<td><span class='fa fa-times' aria-hidden='true' onclick='removeThisSequence()'></td>" +
                "<td>" + JSON.stringify(value) + "</td>" +
                "</tr>";
                retrievedSequences[key]['isNew'] = false;
                numNewItems += 1;
            }
        });
        retrievedHtml += '</table>';
        retrievedPopularHtml += '</table>';
        if (retrievedNewHtml != '') {
            retrievedNewHtml += '</table>';
        }
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

        if (retrievedNewHtml != '') {
            jQuery('#whatsNewContent').html(retrievedNewHtml);
            var a = jQuery("#newSequencesList").dataTable({
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
        }
        jQuery('td .fa-play-circle-o').attr('title', 'Play!');
        jQuery('td .fa-edit').attr('title', 'Edit');
        jQuery('td .fa-times').attr('title', 'Delete');
        /*if (numNewItems > 0) {
         jQuery('#newItemsBadge').html(numNewItems.toString());
         }*/
    }
}

function retrieveLocalStorage() {
    var WebHelpName = 'WebHelp.' + appNameForWebHelp;
    if (localStorage.getItem(WebHelpName)) {
        return JSON.parse(localStorage.getItem(WebHelpName));
    } else {
        return {};
    }
}

function makeEditable() {
    jQuery("#stepsTable").tableEdit({
        columnsTr: "1,3"
    });
}

function destroyAndRedrawTable() {
    //Destroy and reinitialize the table to get the edited data
    jQuery("#stepsTable").dataTable().fnDestroy();
    var t = jQuery("#stepsTable").dataTable({
            "sDom": '',
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
                    "sTitle": "Element",
                    "sWidth": "15%"
                },
                {
                    "sTitle": "Content",
                    "sWidth": "50%"
                }
            ]
        }
    ).rowReordering();
}

function playSequence(sequenceName) {
    var stepsForThisSequence = retrieveLocalStorage()[sequenceName];
    var play = introJs();
    play.setOptions({
        steps: stepsForThisSequence.data,
        showProgress: true,
        showBullets: false,
        tooltipPosition: 'auto'
    });
    jQuery('.toggler').trigger('click'); //Close the side menu
    if (jQuery('#contentConsumptionModal').is(':visible')) {
        jQuery('#contentConsumptionModal').modal('hide');
    }
    play.start();
}

function playThisSequence() {
    var t = jQuery("#" + jQuery('.dataTable:visible').attr('id')).DataTable();
    //t.row(jQuery(event.target).parents('tr')).remove().draw();
    var sequenceName = [t.row(jQuery(event.target).parents('tr')).data()[1]];
    playSequence(sequenceName);
}

function editThisSequence() {
    var t = jQuery("#availableSequencesList").DataTable();
    var thisSequenceTitle = t.row(jQuery(event.target).parents('tr')).data()[1];
    //t.row(jQuery(event.target).parents('tr')).remove().draw();
    var stepsForThisSequence = retrieveLocalStorage()[thisSequenceTitle];
    var stepsTable = jQuery("#stepsTable").DataTable();
    stepsTable.clear().draw();
    jQuery.each(stepsForThisSequence.data, function (index, element) {
        var title = jQuery(element.intro).children('h3').text() || '';
        var text = jQuery(element.intro).children('p').text() || '';
        var elementId = element.element || '';
        if (elementId.split('#').length > 1) {
            elementId = elementId.split('#')[1];
        }
        stepsTable.row.add([
            "<span class='fa fa-times' aria-hidden='true' onclick='removeThisStep()'></span>",
            title,
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
    var storedSteps = retrieveLocalStorage();
    delete storedSteps[t.row(jQuery(event.target).parents('tr')).data()[1]];

    var WebHelpName = 'WebHelp.' + appNameForWebHelp;
    localStorage.setItem(WebHelpName, JSON.stringify(storedSteps));
    populateCurrentSequences();
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
