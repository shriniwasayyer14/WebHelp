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
        elemText += arrayOfElems[i].attribute + " ";
    }
    t.row.add([
        "<span class='glyphicon glyphicon-remove' aria-hidden='true' onclick='removeThisStep()'></span>",
        "<input type='text'>I'm editable</input>",
        "<div contenteditable>" + elemText + "</div>",
        "<div contenteditable>I'm editable</div>;",
        "<div contenteditable>I'm editable</div>"])
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