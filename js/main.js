/* Calling the side menu option where the steps will be listed*/

function init() {
    $('#demo').BootSideMenu({
        side: "right", // left or right
        autoClose: true // auto close when page loads
    });

    t = $("#stepsTable").dataTable({
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
}

function startSelectionOfElement() {
    jQueryDragSelector.on();
    jQuery("#startDragDropButton").tooltip({
        trigger: 'manual'
    }).tooltip("show");
    setTimeout(function () {
        jQuery("#startDragDropButton").tooltip('hide');
    }, 3000);
}

function createStepForThisElement(arrayOfElems) {
    var t = $("#stepsTable").DataTable();
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
    var t = $("#stepsTable").DataTable();
    t.row($(event.target).parents('tr')).remove().draw();
}

function alertNoSelection() {
    $('#noElementsSelectedDiv').show();
    jQueryDragSelector.on();
}

function preview() {
    var rows = $("#stepsTable").DataTable().rows().data();
    if (rows.length <= 0) {
        jQuery('#noStepsInPreviewDiv').show();
        return;
    }
    var preview = introJs();
    var previewSteps = new Array();

    // Add the start of preview welcome message
    previewSteps.push({
        intro: "Welcome to 'Test App'>"
    });
    for (var n = 0; n < rows.length; n++) {
        var elemAttribVal = rows[n][2];
        var elem = document.querySelector("#" + elemAttribVal); // Assuming the elem attrib is an id for now
        var content = rows[n][3];

        previewSteps.push({
            element: elem,
            intro: content,
            position: 'bottom'
        });
    }

    preview.setOptions({steps: previewSteps});
    preview.start();
}