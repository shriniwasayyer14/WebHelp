/* Calling the side menu option where the steps will be listed*/

function init() {
    jQuery('#demo').BootSideMenu({
        side: "right", // left or right
        autoClose: true // auto close when page loads
    });

    t = jQuery("#stepsTable").dataTable({
            "sDom": "",
            "aoColumns": [
                {"sTitle": ""},
                {"sTitle": "Step Name"},
                {"sTitle": "Page Element"},
                {"sTitle": "Content"},
                {"sTitle": "Styling Options"}
            ]
        }
    ).rowReordering();
    t = jQuery("#stepsTable").DataTable();
    t.row.add([
        "<span class='glyphicon glyphicon-remove' aria-hidden='true' onclick='removeThisStep()'></span>",
        "",
        "",
        "Introduction to 'Test App'",
        ""
    ]).draw();
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
        "I'm editable",
        elemText,
        "Blah Blah Blah",
        "I'm editable"])
        .draw();
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
    var rows = jQuery("#stepsTable").DataTable().rows().data();
    if (rows.length <= 0) {
        jQuery('#noStepsInPreviewDiv').show();
        return;
    }
    var preview = introJs();
    var previewSteps = [];

    for (var n = 0; n < rows.length; n++) {
        var elemAttribVal = rows[n][2];
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
                intro: content
            });
        }
    }

    preview.setOptions({steps: previewSteps});
    preview.start();
}