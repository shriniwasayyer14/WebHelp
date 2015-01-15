// ========================================================
//    Last edited by:  $Author: kjaiswal $
//                on:  $Date: 2013/04/24 09:05:50 $
//          Filename:  $RCSfile: expandable_panes_nested.js,v $
//          Revision:  $Revision: 1.7 $
// ========================================================
// --------------------------------------------------
// Function that help to expand/hide advanced search options panes
//

//
// Initialization function
//
function ExpandablePanesNested() {
    ExpandablePanesNested.init = 1;
    var idx = 1;
    var src = '';
    var name = '';
    for (var i = 0; i < document.images.length; i++) {
        if (document.images[i].src && document.images[i].id) {
            src = document.images[i].src.replace(/^.*\/images/, '/images');
            name = document.images[i].id.replace(/_img/, '');

            if (src == ExpandablePanesNested.all_panes_open
                || src == ExpandablePanesNested.all_panes_closed) {

                ExpandablePanesNested.panes[0] = name;
                ExpandablePanesNested.images[name] = document.images[i];
                ExpandablePanesNested.displays[name] = document.forms[0].elements[name + "_style"];

                if (src == ExpandablePanesNested.all_panes_open) {
                    ExpandablePanesNested.all_display = 'block';
                }
                else {
                    ExpandablePanesNested.all_display = 'none';
                }
            }
            else if (src == ExpandablePanesNested.pane_open
                || src == ExpandablePanesNested.pane_closed) {

                ExpandablePanesNested.panes[idx] = name;
                ExpandablePanesNested.images[name] = document.images[i];
                ExpandablePanesNested.displays[name] = document.forms[0].elements[name + "_style"];
                idx++;

            }
        }
    }
}

//
// init static variables
//
ExpandablePanesNested.init = null;
ExpandablePanesNested.panes = new Array();
ExpandablePanesNested.images = new Array();
ExpandablePanesNested.displays = new Array();
ExpandablePanesNested.all_display = '';

ExpandablePanesNested.pane_closed = '/images/appimages/arrows/arrow_red_right.jpg';
ExpandablePanesNested.pane_open = '/images/appimages/arrows/arrow_red_down.jpg';
ExpandablePanesNested.all_panes_open = '/images/appimages/arrows/arrow_tan_bg_down.jpg';
ExpandablePanesNested.all_panes_closed = '/images/appimages/arrows/arrow_tan_bg_right.jpg';

function ExpandPaneNested(id, all, appDefault) {
    if (ExpandablePanesNested.init == null) {
        ExpandablePanesNested();
    }
    var panes = ExpandablePanesNested.panes;
    var images = ExpandablePanesNested.images;
    var displays = ExpandablePanesNested.displays;
    var updateAdvPaneImg = true;
    var adv_pane_path = id + '_adv_pane_path';
    var ajax_flag = id + '_flag';

    if (!all) {

        if ((appDefault == 1 ) &&
            ( document.getElementById(ajax_flag).value == 'no' )) {

            var xmlhttp = new XMLHttpRequest();

            if (( !document.getElementById('ajaxWait_' + id) ) &&
                (document.getElementById(ajax_flag).value == 'no')) {

                var waitImg = document.createElement('img');
                waitImg.setAttribute('src', '/images/wait20.gif');
                waitImg.setAttribute('border', '0');
                waitImg.setAttribute('id', 'ajaxWait_' + id);
                waitImg.setAttribute('width', '10');
                waitImg.setAttribute('height', '10');

                document.getElementById('title:' + id).childNodes[0].appendChild(waitImg);
            }

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    if (document.getElementById(ajax_flag).value == 'no') {
                        document.getElementById(ajax_flag).value = 'yes';
                        document.getElementById(id).innerHTML += xmlhttp.responseText;
                        document.getElementById('ajaxWait_' + id).parentNode.removeChild(document.getElementById('ajaxWait_' + id));

                        var scripts = document.getElementById(id).getElementsByTagName('script');
                        var i = scripts.length;
                        var code_script;

                        while (i--) {
                            code_script += scripts[i].innerHTML;
                            code_script = code_script.replace("<!--", "");
                            code_script = code_script.replace("-->", "");
                        }

                        try {
                            //ugly IE way to call eval in global context
                            window.execScript(code_script);
                        } catch (e) {
                            console.log('cant eval !' + e.message);
                        }

                    } //if

                } //state & status check
            }

            xmlhttp.open("GET", "/weblications/WebQuery/components/generic_advancepane.epl?id=" + id + "&path="
            + document.getElementById(adv_pane_path).value + "&tool="
            + document.getElementById(ajax_flag + '_tool').value, true);
            xmlhttp.send();

        }//if you want to load via ajax

        // figure out if we will need to change status for "All" pane
        var new_disp = document.getElementById(id).style.display == 'none' ? 'block' : 'none';
        if (ExpandablePanesNested.all_display == new_disp) {
            updateAdvPaneImg = false;
        } else {
            var i = 1;
            while (updateAdvPaneImg && i < panes.length) {
                if (panes[i] != id
                    && document.getElementById(panes[i]).style.display != new_disp) {
                    updateAdvPaneImg = false;
                }
                i++;
            }
        }
    }

    if (all || updateAdvPaneImg) {
        ExpandablePanesNested.all_display =
            ExpandablePanesNested.all_display == 'none' ? 'block' : 'none';
        var img_src = ExpandablePanesNested.all_display == 'none' ?
            ExpandablePanesNested.all_panes_closed :
            ExpandablePanesNested.all_panes_open;
        var alt = ExpandablePanesNested.all_display == 'none' ? 'Expand' : 'Hide';

        images[panes[0]].src = img_src;
        images[panes[0]].alt = alt;
        displays[panes[0]].value = ExpandablePanesNested.all_display;
    }

    if (all) {
        for (var i = 1; i < panes.length; i++) {
            ExpandPaneNested(panes[i], '', appDefault);
            ExpandItNested(panes[i], ExpandablePanesNested.all_display);
        }
    }
    else {
        ExpandItNested(id);
    }
}

function ExpandItNested(id, display) {
    var images = ExpandablePanesNested.images;
    var displays = ExpandablePanesNested.displays;
    var paneRow = document.getElementById(id).parentNode.parentNode;

    if (!display) {
        display = paneRow.style.display == 'none' ? 'block' : 'none';
    }

    paneRow.style.display = display; //(display == 'none' ? '' : display);
    displays[id].value = display;
    images[id].src = display == 'none' ? ExpandablePanesNested.pane_closed :
        ExpandablePanesNested.pane_open;
    images[id].alt = display == 'none' ? 'Expand' : 'Hide';

    ExpandSubPanes(id);
}

function ExpandSubPanes(parentID) {
    var paneRow = document.getElementById(parentID).parentNode.parentNode;
    var display = paneRow.style.display;

    // Get the level of the pane from the class name:
    var startLevel = (/_(\d)$/.test(paneRow.className) ? RegExp.lastParen : 1);
    var level;

    for (var followingRow = paneRow.nextSibling; followingRow != null; followingRow = followingRow.nextSibling) {
        // See if the row represents a sub-pane of the starting pane:
        level = (/_(\d)$/.test(followingRow.className) ? RegExp.lastParen : 1);
        if (level <= startLevel) {
            break;
        }
        // If it's a sub-pane's title, just hide or show it:
        if (/^pane_title/.test(followingRow.className)) {
            followingRow.style.display = display;
        }
        // If we're hiding and this is a sub-pane's contents, collapse it using the ExpandItNested method:
        else if (display == "none" && /^input_form_glob/.test(followingRow.className)) {
            ExpandItNested(followingRow.children[0].children[0].id, "none");
        }
    }
}
