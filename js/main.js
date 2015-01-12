/* Calling the side menu option where the steps will be listed*/

function init() {

    jQuery('#demo').BootSideMenu({
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
            jQuery('#ai-content, .ai-header, .ai-navbar').css('width', bodyWidth);
        } else {
            jQuery('#ai-content, .ai-header, .ai-navbar').css('width', bodyWidth - containerWidth - 20);
        }
    });

    setUpAddEditTable();
    populateCurrentSequences();
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
        "<span class='glyphicon glyphicon-remove' aria-hidden='true' onclick='removeThisStep()'></span>",
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

    preview.setOptions({steps: previewSteps});
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
        "isNew": true
    };


// Put the object into storage
    if (localStorage.getItem('WebHelp')) {
        var localStorageObject = JSON.parse(localStorage.getItem('WebHelp'));
        localStorageObject[sequenceTitle] = testObject[sequenceTitle];
        localStorage.setItem('WebHelp', JSON.stringify(localStorageObject));
    } else {
        localStorage.setItem('WebHelp', JSON.stringify(testObject));
    }

    populateCurrentSequences();

}

function populateCurrentSequences() {
    var retrievedHtml = '';
    var retrievedNewHtml = '';
    var retrievedSequences = retrieveLocalStorage();
    var numNewItems = 0;
    if (retrievedSequences) {
        //retrievedHtml += '<h3 id="availableSequencesHeader"></h3>';
        retrievedHtml += '<table id="availableSequencesList">';
        jQuery.each(retrievedSequences, function (key, value) {
            retrievedHtml += "<tr>" +
            "<td><span class='glyphicon glyphicon-play' aria-hidden='true' onclick='playThisSequence()'></span></td>" +
            "<td>" + key + "</td>" +
            "<td><span class='glyphicon glyphicon-edit' aria-hidden='true' onclick='editThisSequence()'></td>" +
            "<td><span class='glyphicon glyphicon-remove' aria-hidden='true' onclick='removeThisSequence()'></td>" +
            "<td>" + JSON.stringify(value) + "</td>" +
            "</tr>";

            if (value.isNew) {
                if (retrievedNewHtml === '') {
                    retrievedNewHtml += '<table id="newSequencesList">';
                }
                retrievedNewHtml += "<tr>" +
                "<td><span class='glyphicon glyphicon-play' aria-hidden='true' onclick='playThisSequence()'></span></td>" +
                "<td>" + key + "</td>" +
                "<td><span class='glyphicon glyphicon-edit' aria-hidden='true' onclick='editThisSequence()'></td>" +
                "<td><span class='glyphicon glyphicon-remove' aria-hidden='true' onclick='removeThisSequence()'></td>" +
                "<td>" + JSON.stringify(value) + "</td>" +
                "</tr>";
                retrievedSequences[key]['isNew'] = false;
                numNewItems += 1;
            }
        });
        retrievedHtml += '</table>';
        if (retrievedNewHtml != '') {
            retrievedNewHtml += '</table>';
        }
        localStorage.setItem('WebHelp', JSON.stringify(retrievedSequences));
        jQuery('#availableSequencesContent').html(retrievedHtml);
        //listFilter(jQuery('#availableSequencesHeader'), jQuery('#availableSequencesList'));

        var t = jQuery("#availableSequencesList").dataTable({
                "sDom": '<"top"f<"clear">>', //It should be a searchable table
                "oLanguage": {
                    "sSearch": "Search titles and content: "
                },
                "aoColumns": [
                    {
                        "sTitle": "",
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": "Sequence"
                    },
                    {
                        "sTitle": "",
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": "",
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": "",
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
                        "sSearch": "Search titles and content: "
                    },
                    "aoColumns": [
                        {
                            "sTitle": "",
                            "sWidth": "10%"
                        },
                        {
                            "sTitle": "Sequence"
                        },
                        {
                            "sTitle": "",
                            "sWidth": "10%"
                        },
                        {
                            "sTitle": "",
                            "sWidth": "10%"
                        },
                        {
                            "sTitle": "",
                            "bVisible": false,
                            "bSearchable": true
                        }
                    ]
                }
            );
        }
        /*if (numNewItems > 0) {
         jQuery('#newItemsBadge').html(numNewItems.toString());
         }*/
    }
}

function retrieveLocalStorage() {
    if (localStorage.getItem('WebHelp')) {
        return JSON.parse(localStorage.getItem('WebHelp'));
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

function playThisSequence() {
    var t = jQuery("#availableSequencesList").DataTable();
    //t.row(jQuery(event.target).parents('tr')).remove().draw();
    var stepsForThisSequence = retrieveLocalStorage()[t.row(jQuery(event.target).parents('tr')).data()[1]];
    var play = introJs();
    play.setOptions({
        steps: stepsForThisSequence.data
    });
    jQuery('.toggler').trigger('click'); //Close the side menu
    play.start();
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
            "<span class='glyphicon glyphicon-remove' aria-hidden='true' onclick='removeThisStep()'></span>",
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
    localStorage.setItem('WebHelp', JSON.stringify(storedSteps));
    populateCurrentSequences();
}
