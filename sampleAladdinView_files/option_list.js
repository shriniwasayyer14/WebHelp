// ========================================================
//    Last edited by:  $Author: jvasquez $
//                on:  $Date: 2006/01/31 16:17:31 $
//          Filename:  $RCSfile: option_list.js,v $
//          Revision:  $Revision: 1.13 $
// ========================================================
//

// -----------------------------------------------------------------
// This function selects or unselects all options in the given
// select list
// 
// Arguments:
//	list - select object reference
//      true_false - true/false to select/deselect
//
// Returns:
//      Nothing
//
function SelectOptList(list, true_false) {
    for (var i = 0; i < list.options.length; i++) {
        if (list.options[i].value == "") {
            list.options[i].selected = false;
        }
        else {
            list.options[i].selected = true_false;
        }
    }
}

// -----------------------------------------------------------------
// This function moves the selected options in 
// the given list up/down 
//
// Arguments:
//      list - select object reference
//      dir - up/down
//
// Returns:
//      Nothing
//
function MoveOptionsUpDown(list, dir) {
    if (list == null || list == '') {
        return true;
    }

    if (list.selectedIndex < 0) {
        return true;
    }

    var start = dir == 'up' ? 0 : list.length - 1;
    var end = dir == 'up' ? list.length - 1 : 0;
    var last = dir == 'up' ? list.length - 1 : 0;

    var add = new Function("x", "y", "return x+y;")
    var add_val = dir == 'up' ? 1 : -1;

    var comp = dir == 'up' ? new Function("i", "j", "return i<=j;") : new Function("i", "j", "return i>=j;");

    var i = start;
    var next_i;
    var finished = false;
    while (comp(i, end) && !finished) {
        if (list.options[i].selected == true) {
            var val = list.options[i].value;
            var txt = list.options[i].text;

            if (i == start) {
                // can't move any further
                finished = true;
            }
            else {
                next_i = add(i, add_val * -1);
                list.options[i].value = list.options[next_i].value;
                list.options[i].text = list.options[next_i].text;
                list.options[i].selected = list.options[next_i].selected;
                list.options[next_i].value = val;
                list.options[next_i].text = txt;
                list.options[next_i].selected = true;
            }
        }
        i = add(i, add_val)
    }
}

// -----------------------------------------------------------------
// This function moves the selected options in the given
// list either to the top or the bottom of the list
//
// Arguments:
//      list - select object reference
//      dir - top/botom
//
// Returns:
//      Nothing
//
function MoveOptionsTopBottom(list, dir) {

    if (list == null || list == '') {
        return true;
    }

    if (list.selectedIndex < 0) {
        return true;
    }

    if (dir == 'bottom' &&
        list.options[list.options.length - 1].selected == true) {
        return true;
    }

    if (dir == 'top' &&
        list.options[0].selected == true) {
        return true;
    }

    var i = 0;
    var vals = new Array();
    var txts = new Array();
    var sels = new Array();
    var selected_vals = new Array();
    var selected_txts = new Array();
    var selected_sels = new Array();

    for (i; i < list.options.length; i++) {
        if (list.options[i].selected == true) {
            selected_vals[selected_vals.length] = list.options[i].value;
            selected_txts[selected_txts.length] = list.options[i].text;
            selected_sels[selected_sels.length] = list.options[i].selected;
        }
        else {
            vals[vals.length] = list.options[i].value;
            txts[txts.length] = list.options[i].text;
            sels[sels.length] = list.options[i].selected;
        }
    }

    //repopulating the list

    if (dir == 'bottom') {

        for (i = 0; i < vals.length; i++) {
            list.options[i].value = vals[i];
            list.options[i].text = txts[i];
            list.options[i].selected = sels[i];
        }

        for (i = 0; i < selected_vals.length; i++) {
            list.options[vals.length + i].value = selected_vals[i];
            list.options[vals.length + i].text = selected_txts[i];
            list.options[vals.length + i].selected = selected_sels[i];
        }
    }
    else if (dir == 'top') {
        for (i = 0; i < selected_vals.length; i++) {
            list.options[i].value = selected_vals[i];
            list.options[i].text = selected_txts[i];
            list.options[i].selected = selected_sels[i];
        }

        for (i = 0; i < vals.length; i++) {
            list.options[selected_vals.length + i].value = vals[i];
            list.options[selected_vals.length + i].text = txts[i];
            list.options[selected_vals.length + i].selected = sels[i];
        }
    }
}

// -----------------------------------------------------------------
// This function moves or copies options from one option list to another.
//
// Arguments:
//      from - list to move/copy from, select object reference
//      to - list to move/copy to, select object reference
//      moveAll - 1/0 move all items
//      copy_flag - if equals to 'copy', then options will be copied
//                  not moved.
//      unselected - 1/0 move unselected items
//      sequence  - array of original sequence: sequence['cusip']=0;
//                  sequence['fund']=1; etc.
//
// Returns:
//      Nothing
//
function MoveOptionsToList(from, to, moveAll, copy_flag, unselected, sequence) {

    var start_idx = moveAll || unselected ? 0 : from.selectedIndex;
    if (start_idx < 0) return;
    var fromnum = from.options.length;
    var tonum = to.options.length;
    var insert_idx = 0;

    // find out whether the from or to list is sorted
    if (!sequence) {
        insert_idx = tonum - 1;
    }
    else {
        for (var i = 1; i < fromnum || i < tonum; ++i) {
            if ((i < fromnum &&
                sequence[from.options[i].text] < sequence[from.options[i - 1].text])
                || (i < tonum &&
                sequence[to.options[i].text] < sequence[to.options[i - 1].text])) {
                // from or to is not sorted, just append
                insert_idx = tonum;
                break;
            }
        }
    }

    for (var i = start_idx; i < fromnum; i++) {
        if (!/^-+$/.test(from.options[i].text) &&
            (moveAll
            || (from.options[i].selected && !unselected)
            || (!from.options[i].selected && unselected) )) {

            var fromopt = from.options[i];

            // remove '-------------------------'
            if (to.options.length == 1 && to.options[0].value == "") {
                to.options.length = tonum = 0;
            }

            // where does it go? (calculate insert_idx)
            if (!sequence) {
                insert_idx++;
            }
            else {
                for (insert_idx; insert_idx < tonum; insert_idx++) {
                    if (sequence[fromopt.text] <
                        sequence[to.options[insert_idx].text]) {
                        break;
                    }
                }
            }

            if (copy_flag != 'copy') {
                from.options[i] = null;
                i--;
                fromnum--;
            }
            else {
                // create a duplicate of the from option
                fromopt = new Option(fromopt.text, fromopt.value);
            }

            to.options.add(fromopt, insert_idx);
            tonum++;
        }
    }

    if (from.options.length < 1) {
        from.options[0] = new Option("-----------------------", "");
    }
}

function MoveOptionsBetweenLists(list1, list2, unselected, sequence) {

    if (list1.selectedIndex > -1 && list2.selectedIndex == -1) {
        MoveOptionsToList(list1, list2, false, false, unselected, sequence);
        return;
    }
    if (list1.selectedIndex == -1 && list2.selectedIndex > -1) {
        MoveOptionsToList(list2, list1, false, false, unselected, sequence);
        return;
    }
    list1.selectedIndex = -1;
    list2.selectedIndex = -1;
    return;
}

// -----------------------------------------------------------------
// Searches for a string in option list.  
// If found selects matching option.
//
// Arguments:
//      string - string to search for
//      list - select object reference
//
// Returns:
//      Index of the matching option
//
function FindValueInOptList(string, opt_list) {

    var len = opt_list.options.length;
    var i;
    for (i = 0; i < len; i++) {
        if (opt_list.options[i].value == string) {
            opt_list.options[i].selected = true;
            return i;
        }
    }
    return -1;
}

// -----------------------------------------------------------------
// Searches for each value of comma-separated list in option list.  
// If found selects matching option.
//
// Arguments:
//      string - string to search for
//      list - select object reference
//
// Returns:
//      string list of values that have not been found
//      empty string if all values have been found in the list
//
function FindMultipleValuesInOptList(vals, opt_list) {

    var len = opt_list.options.length;
    var vsize = vals.length;
    var i;
    var v;
    var found_idx;
    for (i = 0; i < len && vsize > 0; i++) {
        found_idx = -1;
        for (v = 0; v < vsize && found_idx == -1; v++) {
            if (opt_list.options[i].value == vals[v]) {
                found_idx = v;
            }
        }
        if (found_idx > -1) {
            vsize--;
            for (v = found_idx; v < vsize; v++) {
                vals[v] = vals[v + 1];
            }
            vals.pop();
        }
    }
    var not_found = vals.join(', ');
    return not_found;
}


//------------------------------------------------------------------
//
// Use to compare the 2-lists widgets and select the shorter of
// the two lists
//
// Arguments: 
//	      1. left option list
//	      2. right option list
//
// Returns:
//	true if the shorter list has valid data 
//	false otherwise (nothing is selected)
//
function SelectShorterList(leftList, rightList) {

    if (!leftList || !rightList) return false;

    var selected = false;
    leftList.selectedIndex = -1;
    rightList.selectedIndex = -1;

    if (rightList.length < leftList.length) {
        if (rightList.length > 1 ||
            (rightList.length == 1 && rightList.options[0].value != '')) {
            SelectOptList(rightList, true);
            selected = true;
        }
    }
    else {
        if (leftList.length > 1 ||
            (leftList.length == 1 && leftList.options[0].value != '')) {
            SelectOptList(leftList, true);
            selected = true;
        }
    }

    return selected;
}


function SynchTextAndListMultiple(from, to) {

    if (from.type == 'text') from.value = from.value.replace(/\s/g, '');
    else to.value = to.value.replace(/\s/g, '');

    if (from.type == 'text' && from.value == '') {
        to.selectedIndex = 0;
        return;
    }

    if (from.type == 'select-one') {
        if (from.options[from.selectedIndex].value == '') {
            to.value = '';
            return;
        }
        if (/^\s*$/.test(to.value)) {
            to.value = from.options[from.selectedIndex].value;
        }
        else {
            to.value = to.value + ',' + from.options[from.selectedIndex].value;
        }
    }

    // remove duplicates
    var txt_fld = from.type == 'text' ? from : to;

    if (txt_fld.uppercase_text) {
        txt_fld.value = txt_fld.value.toUpperCase();
    }

    var tmp = txt_fld.value.split(/[;,]/);
    var unique = new Array();
    for (i in tmp) {
        unique[tmp[i]] = 1;
    }
    var vals = new Array();
    for (v in unique) {
        vals[vals.length] = v;
    }
    txt_fld.value = vals.join(',');

    if (to.type == 'text') {
        return true;
    }

    var not_found = '';
    if (vals.length == 1) {
        var idx = FindValueInOptList(vals[0], to);
        if (idx == -1) {
            to.selectedIndex = to.length - 1;
            not_found = vals[0];
        }
        else {
            to.selectedIndex = idx;
        }
    }
    else {
        not_found = FindMultipleValuesInOptList(vals, to);
    }

    if (not_found != '') {
        if (!(from.allow_custom || to.allow_custom)) {
            alert('Could not find \'' + not_found + '\' in the selection list' + " From: ");
        }
        else if (vals.length != 1) {
            to.selectedIndex = to.length - 1;
        }
    }

    return true;
}

// Function to be used by special two box selects
// that utilize behaviors
function toggleTwoBoxSearch(id, flag, refresh) {
    var twoBox = document.getElementById(id);

    if (twoBox == null) return false;

    var selectBoxes = twoBox.getElementsByTagName("select");

    // NOTE: This is very bad to tie so closely to the structure
    // of the component-- must be changed!
    var cells = twoBox.getElementsByTagName("td");
    cells[1].style.display = (flag) ? 'block' : 'none';
    cells[2].style.display = (flag) ? 'block' : 'none';

    var leftBoxTitle = cells[0].getElementsByTagName("div")[0];
    leftBoxTitle.innerHTML = (flag) ? 'Available' : 'Include';

    // NOTE: This is the hackiest crap ever
    if (refresh) {

        // Remove all options from the select box
        var selectBox = twoBox.retrieveElement('select-box');
        if (selectBox != null) {
            selectBox.clear();
        }

        // Refresh the filter box, but only if we are closing the search
        var filterBox = twoBox.retrieveElement('filter-box');
        if (filterBox != null && !flag) {
            filterBox.refresh();
        }
    }

    return true;
}
