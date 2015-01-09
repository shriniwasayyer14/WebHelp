/* Calling the side menu option where the steps will be listed*/

function init() {
    $('#demo').BootSideMenu({
        side: "right", // left or right
        autoClose: true // auto close when page loads
    });

    t = $("#stepsTable").dataTable({
            "sDom": "",
            "aoColumns": [
                {
                    "sTitle": "",
                    "sWidth":"10%"
                },
                {
                    "sTitle": "Step",
                    "sWidth":"25%"
                },
                {
                    "sTitle": "Element",
                    "sWidth":"15%"
                },
                {
                    "sTitle": "Content",
                    "sWidth":"50%"
                }
            ]
        }
    ).rowReordering();
    makeEditable();
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
    elemText = elemText.substring(0, elemText.length -1 );
    t.row.add([
        "<span class='glyphicon glyphicon-remove' aria-hidden='true' onclick='removeThisStep()'></span>",
        "I'm editable",
         elemText,
        "Blah Blah Blah"])
        .draw();
    makeEditable();
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
    if(rows.length <= 0) {
        alert("Please create intro steps!");
        return;
    }
    var preview = introJs();
    var previewSteps = new Array();

    // Add the start of preview welcome message
    previewSteps.push({
        intro:"Welcome to 'Test App'>"
    });
    for(var n=0;n<rows.length;n++) {
       var elemAttribVal = rows[n][2];
       var elem = document.querySelector("#"+elemAttribVal); // Assuming the elem attrib is an id for now
        var content = rows[n][3];

        previewSteps.push({
            element:elem,
            intro:content,
            position:'bottom'
        });
    }

    preview.setOptions({steps:previewSteps});
    preview.start();
}

function save()
{
    $.ajax({
        type:"POST",
        url:"https://dev.blackrock.com:8558/weblications/WebQuery/WebHelp.epl",
        data: {
            "owner":"sayyer",
            "type":"test",
            "tool":"Test App",
            "url":"WebHelp",
            "data":new Array({title:"title",elem:"elem",elemAttrib:"elemAttrib",description:"Testing"})
        },
        success: function(data, success) {
            console.log(data);
        }
    });
}

function makeEditable() {
    $("#stepsTable").tableEdit({
        columnsTr:"1,3"
    });
}