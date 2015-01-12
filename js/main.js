/* Calling the side menu option where the steps will be listed*/

function init() {
    jQuery('#demo').BootSideMenu({
        side: "right", // left or right
        autoClose: true // auto close when page loads
    });

    t = jQuery("#stepsTable").dataTable({
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
    preview.start();
}

function save() {
    destroyAndRedrawTable();
    jQuery.ajax({
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
    });
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
}