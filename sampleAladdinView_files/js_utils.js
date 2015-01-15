// $Author: kjaiswal $
// $Date: 2013/02/11 19:15:24 $
// $RCSfile: js_utils.js,v $
// $Revision: 1.44 $

// -----------------------------------------------------------
// A better typeof()
//  Will correctly identify Arrays, Strings, Numbers, Dates,
//  user definded objects, DOM elements (by tag name)
//
// Arguments:
//     anything
//
// Returns:
//     The object class, DOM nodeName or the typeof()
//
function getType(a) {
    if (a == null) {
        return a;
    }
    // A Object with an identity
    if (a.constructor != null) {
        var foo = a.constructor.toString();
        var arr = foo.match(/function\s+(\w*)/);
        if (arr != null) {
            return arr[1];
        }
    }
    // A DOM object
    if (a.nodeName != null) {
        return a.nodeName;
    }
    // A core object (window, location, etc)
    return typeof(a);
}

function check_date(date_str, fieldName) {
    if (!check_date_value(date_str.value, fieldName)) {
        date_str.select();
        date_str.focus();
        return (false);
    }
    return (true);
}

function check_date_value(date_str, fieldName) {
    if (!date_str) {
        return true;
    }

    var d_ary = date_str.split('/');

    if (d_ary.length != 3) {
        alert(fieldName + ": Date can contain only digits and slashes and be in the MM/DD/YY or MM/DD/YYYY form");
        return (false);
    }

    var month = d_ary[0];
    var day = d_ary[1];
    var year = d_ary[2];

    var error = 0;
    var error_text = "";

    var $wd_test = /\D/;
    if ($wd_test.test(month) || $wd_test.test(day) || $wd_test.test(year)) {
        error = 1;
        error_text += fieldName + ": Date can contain only digits and slashes and be in the MM/DD/YY or MM/DD/YYYY form\n";
    }

    if (month.length > 2 || day.length > 2 || (year.length != 4 && year.length != 2)) {
        error = 1;
        error_text += fieldName + ": Date must be in MM/DD/YY or MM/DD/YYYY format\n";
    }

    if ((year > 99 && year < 1950) || year < 0 || year == "0000") {
        error = 1;
        error_text += fieldName + ": Invalid Year \n";
    }

    if (month > 12 || month < 1) {
        error = 1;
        error_text += fieldName + ": Invalid Month \n"
    }

    if (day > 31 || day < 1) {
        error = 1;
        error_text += fieldName + ": Invalid Day \n";
    }

    if ((month == 4 || month == 6 || month == 9 || month == 11) && (day > 30)) {
        error = 1;
        error_text += fieldName + ": Invalid Day \n";
    }

    if ((year % 4 == 0) && month == 2 && day > 29) {
        error = 1;
        error_text += fieldName + ": Invalid Day \n";
    } else if ((year % 4 > 0) && month == 2 && day > 28) {
        error = 1;
        error_text += fieldName + ": Invalid Day \n";
    }

    if (error) {
        alert(error_text);
        return (false);
    }
    return (true);
}

// This function takes a reference to a form and a list of fields which
// should have valid dates within them, checks them, and complains if
// an invalid date is input.

function check_date_fields(form, fields) {
    for (index = 0; index < fields.length; index++) {
        var tmp_ary = fields[index].split(/:/);
        var usrFieldName = tmp_ary[0];
        var htmlFieldName = tmp_ary[1];
        var temp = form.elements[htmlFieldName];
        if (!check_date(temp, usrFieldName)) {
            return false;
        }
    }
    return true;
}

//if the string starts with aChar, return true
function check_string_start_with(aChar, objname) {
    var inputString = document.forms[0].elements[objname].value.split(',');
    var tempString;
    for (index = 0; index < inputString.length; index++) {
        tempString = inputString[index].replace(/\s*/, '');
        if (tempString.charAt(0) == aChar)
            return true;
    }
    return false;
}

function check_date_end_of_month(date_str, fieldName) {
    if (!date_str.value) {
        return true;
    }

    var d_ary = date_str.value.split('/');

    if (d_ary.length != 3) {
        alert(fieldName + ": Date can contain only digits and slashes and be in the MM/DD/YY or MM/DD/YYYY form");
        date_str.select();
        date_str.focus();
        return (false);
    }

    var month = d_ary[0];
    var day = d_ary[1];
    var year = d_ary[2];

    var error = 0;
    var error_text = "";

    var $wd_test = /\D/;
    if ($wd_test.test(month) || $wd_test.test(day) || $wd_test.test(year)) {
        error = 1;
        error_text += fieldName + ": Date can contain only digits and slashes and be in the MM/DD/YY or MM/DD/YYYY form\n";
    }

    if (month.length > 2 || day.length > 2 || year.length > 4 || year.length < 2) {
        error = 1;
        error_text += fieldName + ": Date has too many digits! Must be in MM/DD/YY or MM/DD/YYYY format\n";
    }

    if ((year > 99 && year < 1900) || year < 0) {
        error = 1;
        error_text += fieldName + ": Invalid Year \n";
    }

    if (month > 12 || month < 1) {
        error = 1;
        error_text += fieldName + ": Invalid Month \n"
    }


    if ((month == 4 || month == 6 || month == 9 || month == 11) && (day != 30)) {
        error = 1;
        error_text += fieldName + ": Must be the end of the month \n";
    } else if ((year % 4 == 0) && month == 2 && day != 29) {
        error = 1;
        error_text += fieldName + ": Must be the end of the month \n";
    } else if ((year % 4 > 0) && month == 2 && day != 28) {
        error = 1;
        error_text += fieldName + ": Must be the end of the month \n";
    } else if ((month == 1 || month == 3 || month == 5 || month == 7 ||
        month == 8 || month == 10 || month == 12) && (day != 31)) {
        error = 1;
        error_text += fieldName + ": Must be the end of the month \n";
    }

    if (error) {
        alert(error_text);
        date_str.select();
        date_str.focus();
        return (false);
    }
    return (true);
}

// This function takes a reference to a form and a list of fields which
// should have valid dates within them, checks them, and complains if
// an invalid date is input.

function check_date_end_of_month_fields(form, fields) {
    for (index = 0; index < fields.length; index++) {
        var tmp_ary = fields[index].split(/:/);
        var usrFieldName = tmp_ary[0];
        var htmlFieldName = tmp_ary[1];
        var temp = form.elements[htmlFieldName];
        if (!check_date_end_of_month(temp, usrFieldName)) {
            return false;
        }
    }
    return true;
}

// convert date string of type MM/DD/YY to format MM/YY/YYYY
function convert_year(date_str) {
    if (!date_str) {
        return date_str;
    }
    date_str.replace(/\s/g, '');

    var d_ary = date_str.split('/');
    if (d_ary.length == 2 || (d_ary.length == 3 && d_ary[2] == null )) {
        var d = new Date();
        return d_ary[0] + '/' + d_ary[1] + '/' + d.getFullYear();
    }

    if (d_ary.length != 3) {
        return date_str;
    }

    if (d_ary[2].length != 2) {
        return date_str;
    }

    var ret_str = d_ary[0] + '/' + d_ary[1] + '/';
    if (parseInt(d_ary[2]) >= 58) {
        ret_str = ret_str + '19' + d_ary[2];
    }
    else {
        ret_str = ret_str + '20' + d_ary[2];
    }
    return ret_str;
}

// Compare 2 dates passed as arguments
// Returns: 0 -- if error occured
//          1 -- if first date is less than the second date
//          2 -- if first date is greater than the second date
//      3 -- if dates are equal, or one of the dates is blank
function compare_dates(field1, field2) {
    if (check_blank(field1) == true || check_blank(field2) == true) {
        return 3;
    }

    field1.value = convert_year(field1.value);
    field2.value = convert_year(field2.value);

    var d_ary1 = field1.value.split('/');
    var d_ary2 = field2.value.split('/');
    var ret_val;

    // compare years
    if (parseInt(d_ary1[2], 10) < parseInt(d_ary2[2], 10)) {
        return 1;
    }
    if (parseInt(d_ary1[2], 10) > parseInt(d_ary2[2], 10)) {
        return 2;
    }

    // years are the same - compare months
    if (parseInt(d_ary1[0], 10) < parseInt(d_ary2[0], 10)) {
        return 1;
    }
    if (parseInt(d_ary1[0], 10) > parseInt(d_ary2[0], 10)) {
        return 2;
    }

    // years and months are the same - compare days
    if (parseInt(d_ary1[1], 10) < parseInt(d_ary2[1], 10)) {
        return 1;
    }
    if (parseInt(d_ary1[1], 10) > parseInt(d_ary2[1], 10)) {
        return 2;
    }

    // the dates are equal
    return 3;
}

// Return current date in MM/DD/YYYY format
function get_todays_date() {
    var d = new Date();
    var month = d.getMonth() + 1;
    return month + '/' + d.getDate() + '/' + d.getFullYear();

}

// This simple function takes a field object as an argument
// and checks to see if its value is blank
// If it is blank it returns true, if not returns false.

function check_blank(field) {
    var blank_pat = /^\s*$/;
    return blank_pat.test(field.value);
}

// This function takes a reference to a form and a list of fields
// which should not be blank.  If one is blank, it complains.
function check_blank_fields(form, fields) {
    for (index = 0; index < fields.length; index++) {
        var tmp_ary = fields[index].split(/:/);
        var usrFieldName = tmp_ary[0];
        var htmlFieldName = tmp_ary[1];
        var temp = form.elements[htmlFieldName];
        if (check_blank(temp)) {
            temp.focus();
            temp.select();
            var errstr = "The field " + usrFieldName + " must be filled in.";
            alert(errstr);
            return false;
        }
    }
    return true;
}

// This simple function takes a field object as an argument
// and checks to see if its value is a number
// If it is a number it returns true, if not returns false.

function check_numeric(field) {
    var numeric_pat = /^\s*-*\s*\d*\.?\d*$/;
    var tmp_val = field.value.replace(/,/g, "");
    return numeric_pat.test(tmp_val);
}

// This function takes a reference to a form and a list of fields
// which should contain numbers.  If one is NAN, it complains.
function check_numeric_fields(form, fields) {
    for (index = 0; index < fields.length; index++) {
        var tmp_ary = fields[index].split(/:/);
        var usrFieldName = tmp_ary[0];
        var htmlFieldName = tmp_ary[1];
        var temp = form.elements[htmlFieldName];
        if (!check_numeric(temp)) {
            var errstr = "The field " + usrFieldName + " must contain a number.";
            temp.focus();
            temp.select();
            alert(errstr);
            return false;
        }
    }
    return true;
}

// This function takes a reference to a form and a list of fields
// which should contain a single number or multiple numbers.
// If one is NAN, it complains.
function check_multi_numeric_fields(form, fields) {
    for (index = 0; index < fields.length; index++) {
        var tmp_ary = fields[index].split(/:/);
        var usrFieldName = tmp_ary[0];
        var htmlFieldName = tmp_ary[1];
        var temp = form.elements[htmlFieldName];
        var temp_array = temp.value.split(",");
        var i = 0;
        for (i; i < temp_array.length; i++) {
            var temp_num = temp_array[i];
            var numeric_pat = /^\s*-*\s*\d*$/;
            if (!numeric_pat.test(temp_num)) {
                var errstr = "The field " + usrFieldName + " only accepts valid integer numbers.";
                temp.focus();
                temp.select();
                alert(errstr);
                return false;
            }
        }
    }
    return true;
}


// This function takes the same as above except its list of fields
// are select fields.  If the select field has a selectedIndex of -1
// (which indicates nothing has been selecte) or the value of the
// selected option is the empty string, the function returns false
// and complains to the user.
function check_selection_fields(form, fields) {
    for (index = 0; index < fields.length; index++) {
        var tmp_ary = fields[index].split(/:/);
        var usrFieldName = tmp_ary[0];
        var htmlFieldName = tmp_ary[1];
        var temp = form.elements[htmlFieldName];
        if ((temp.selectedIndex < 0) || (temp.options[temp.selectedIndex].value == "")) {
            var errstr = "You must select a value from " + usrFieldName + ".";
            temp.focus();
            alert(errstr);
            return false;
        }
    }
    return true;
}


function mm_convert(elem) {

    var pattern = /^(\-?\d*\.?\d+)([bmMB]+)$/;

    var results = pattern.exec(elem.value);

    if (results != null) {

        var num = parseFloat(results[1]);

        var result2 = results[2];

        for (var i = 0; i < result2.length; i++) {

            if (result2.charAt(i) == 'm'
                || result2.charAt(i) == 'M') {
                num *= 1000;
            }
            else if (result2.charAt(i) == 'b'
                || result2.charAt(i) == 'B') {
                num *= 1000000000;
            }
        }
        elem.value = num.toString();
    }
}


function commafy(val) {
    val = val.replace(/[,\s]/g, '');
    var sign = val.charAt(0);
    if (sign == '+' || sign == '-') {
        val = val.replace(/[+-]/, '');  // remove sign
    }
    var decimal = '';
    if (val.indexOf('.') > -1) {
        decimal = val.slice(val.indexOf('.'));
        val = val.slice(0, val.indexOf('.'));
    }
    var i = val.length - 1;
    var new_val = '';
    while (i >= 0) {
        new_val = new_val + val.charAt(i);
        i--;
    }
    new_val = new_val.replace(/(...)/g, "$1,");
    var ret_val = '';
    var i = new_val.length - 1;
    while (i >= 0) {
        ret_val = ret_val + new_val.charAt(i);
        i--;
    }
    ret_val = ret_val.replace(/^,/, "");
    if (sign == '+' || sign == '-') {
        ret_val = sign + ret_val;
    }
    if (decimal != '') {
        ret_val = ret_val + decimal;
    }
    return ret_val;
}

function check_monthend_date(date_str, field_name) {
    var ret_val = true;
    var d_ary = date_str.value.split('/');

    var month = d_ary[0];
    var day = d_ary[1];
    var year = d_ary[2];
    if ((month == 4 || month == 6 || month == 9 || month == 11)
        && (day != 30)) {
        ret_val = false;
    }
    if ((month == 1 || month == 3 || month == 5 || month == 7
        || month == 8 || month == 10 || month == 12)
        && (day != 31)) {
        ret_val = false;
    }

    var yr = year % 4;
    if (month == 2 && yr == 0 && day != 29) {
        ret_val = false;
    }
    if (month == 2 && yr != 0 && day != 28) {
        ret_val = false;
    }

    if (ret_val == false) {
        alert("\n---------------------------------------------------\n\n"
        + field_name + ' should fall on month end'
        + "\n\n---------------------------------------------------\n");
    }

    return ret_val;
}

// validate the given date, allow open date entry
// and check both objname and obj2name have to be open date or empty at the
// same time. if either or both of them are open date,
// set the boolobj to be true, which is 1
function validate_open_date(string, objname, string2, obj2name, boolobj) {
    if (document.forms[0].elements[objname].value == '') {
        return true;
    }

    document.forms[0].elements[objname].value = document.forms[0].elements[objname].value.toUpperCase();

    if (document.forms[0].elements[objname].value == 'OPEN') {
        if (document.forms[0].elements[obj2name].value != '' &&
            document.forms[0].elements[obj2name].value.toUpperCase() != 'OPEN') {
            alert(string + ' - invalid date formula\n  You can only enter an OPEN date when ' + string2 + ' is an OPEN date or empty.');
            return false;
        }
        document.forms[0].elements[boolobj].value = '1';
        return true;
    }
    document.forms[0].elements[boolobj].value = '0';

    if (document.forms[0].elements[obj2name].value.toUpperCase() == 'OPEN') {
        alert(string + ' - invalid date formula\n You can only enter an OPEN date or leave it as empty because ' + string2 + ' is an OPEN date. ');
        return false;
    }

    if (!validate_date(string, objname)) {
        return false;
    }

    return true;
}

// validate the given date, allow formulas such as t + 2b
function validate_date(string, objname) {

    document.forms[0].elements[objname].value =
        document.forms[0].elements[objname].value.toUpperCase();

    if (!(/^T/).test(document.forms[0].elements[objname].value)) {
        document.forms[0].elements[objname].value
            = convert_year(document.forms[0].elements[objname].value);
    }

    if (!validate_date_value(document.forms[0].elements[objname].value,
            string)) return false;

    return true;
}

function validate_date_value(date_str, title) {
    if (/^\s*$/.test(date_str)) {
        return true;
    }

    // check if this is a formula
    var formula1 = /^T\s*$/;
    var formula2 = /^T\s*[\-\+]\s*\d+\s*[BMY]?$/;
    if (/^T/.test(date_str)) {
        if (!formula1.test(date_str) && !formula2.test(date_str)) {

            alert(title + ' - invalid date formula\nExamples of valid formulas:\nT+1, T+1B, T-1, T-1B, T-1M, T+1M, T-1Y, T+1Y\nYou may enter any number of days in place of "1".\nLetter "B" stands for "business days"\nLetter "M" stands for "months"\nLetter "Y" stands for "years"\n');
            return false;
        }
        return true;
    }

    if (!check_date_value(date_str, title)) return false;
    return true;
}  // end validate_date_value

// validate given date/time field, allow formulas such as t + 2b
function validate_datetime(date_str, title) {
    if (/^\s*$/.test(date_str)) return true;
    var date = date_str.split(/\s+/);
    if (date.length > 2) {
        alert("Invalid Date/Time format for " + title);
        return false;
    }
    if (!validate_date_value(date[0], title)) return false;

    // verify time
    if (date.length < 2 || /^\s*$/.test(date[1])) return true;
    var time_pat1 = /^\d+:\d+\s*$/;
    var time_pat2 = /^\d+:\d+[AP]M\s*$/;
    if (!time_pat1.test(date[1]) && !time_pat2.test(date[1])) {
        alert("Invalid time format for " + title);
        return false;
    }
    return true;
    var time = date[1].split(/:/);
    if (time.length > 2 || time[0] < 0 || time[0] > 23
        || time[1] < 0 || time[1] > 59) {
        alert("Invalid time format for " + title);
        return true;
    }
}

// Searches given option list for a string.
// If string is found set selected property of the option list to that item and
// return index of that option.  If the list contains more than one entry that match
// the string, the first one is returned.
// If the string is not found displays message and returns -1
function find_string_in_opt_list(string, opt_list) {

    var len = opt_list.options.length;
    var i;
    for (i = 0; i < len; i++) {
        if (opt_list.options[i].value == string) {
            opt_list.options[i].selected = true;
            return i;
        }
    }
    alert('"' + string + '" is not found');
    return -1;
}


// Searches given option list for a string.
// return if the string is null.
// If string is found set selected property of the option list to that item and
// return index of that option.  If the list contains more than one entry that match
// the string, the first one is returned.
// If the string is not found, add the string to the list,
// select and return its index

function find_or_add_string_in_opt_list(string, opt_list) {

    if ((/^\s*$/).test(string)) {
        return;
    }

    var len = opt_list.options.length;
    var i;
    for (i = 0; i < len; i++) {
        if (opt_list.options[i].value == string) {
            opt_list.options[i].selected = true;
            return i;
        }
    }

    opt_list.options[len] = new Option(string, string);
    opt_list.options[len].selected = true;
    return len;
}

// check that set of checkboxes has at least one value selected
function check_checkbox_blank(form, fields) {
    return check_radio_blank(form, fields)
}

// check radio buttons to make sure one was checked (return true if so)
function check_radio_blank(form, fields) {
    for (index = 0; index < fields.length; index++) {
        var tmp_ary = fields[index].split(/:/);
        var usrFieldName = tmp_ary[0];
        var htmlFieldName = tmp_ary[1];
        var temp = form.elements[htmlFieldName];

        // step through the elements of array tmp (radio buttons with same name)
        // if any are checked, then this form element passes the test
        var flag = 0;

        if (!temp.length) {

            // for checkboxes with single checkbox (ex: dynamically created)
            // single checkboxes are not arrays

            if (temp.checked) {
                flag = 1

            }
        } else {
            // for multiple checkboxes/radio buttons
            var i;
            for (i = 0; i < temp.length; i++) {
                if (temp[i].checked) {
                    flag = 1;
                }
            }
        }


        if (!flag) {
            var errstr = "You must select a value from " + usrFieldName + ".";
            alert(errstr);
            return false;
        }
    }
    return true;


}

function select_deselect(this_form, objname, set_val) {
    var pat = new RegExp(objname);
    var e_num = this_form.elements.length;
    var i = 0;
    while (i < e_num) {
        if (pat.test(this_form.elements[i].name)) {
            this_form.elements[i].checked = set_val;
        }
        i++;
    }
}

//validate comma_separated positive or negative integer numbers
function validate_numeric(numValue, fieldName, actualFieldName) {

    var blank_pat = /^\s*$/;
    if (blank_pat.test(numValue)) {
        document.forms[0].elements[actualFieldName].value = "";
        return true;
    }

    var tmp_array = numValue.split(",");

    for (index = 0; index < tmp_array.length; index++) {
        var num = tmp_array[index];
        if (parseInt(num) != num) {
            var errstr = "The field " + fieldName + " must contain integer number(s).";
            alert(errstr);
            return false;
        }
    }

    return true;
}

//validate comma_separated positive or negative float
function validate_float(title, elem) {

    if ((/^\s*$/).test(elem.value)) return true;

    //elem.value = elem.value.replace(/^\+/,"");
    //var tmp = elem.value.replace(/,/g,"");

    if (parseFloat(elem.value) != elem.value) {
        elem.select();
        alert(title + " must be numeric");
        elem.focus();
        return false;
    }

    return true;
}

function plusescape(str) {
    var escstr = escape(str);
    var hasplus = /\+/;
    if (hasplus.test(escstr)) {
        return escstr.replace(/\+/g, '%2B');
    } else {
        return escstr;
    }
}

// -----------------------------------------------------------
// Function that opens pre-canned queries dialog box and loads
// and runs pre-canned queries.
// Arguments:
//     tool - unique tool name (trade, position, etc)
//     list - reference to the options list wich contains
//            list of pre-canned queries
//     auto_run - boolean whihc indicates whether selected
//                query needs to be loaded or executed automatically
// Returns:
//     Nothng
//
function FavoritesTool(tool, val, auto_run, reload_location) {

    if (val == '') {
        return;
    }

    if (val == 'add' && CheckInput != null
        && CheckInput('favorite=add') == false) {
        return false;
    }

    if (val == 'organize' || val == 'add') {
        var height = val == 'add' ? 210 : 360;
        var window_name = val == 'add' ? 'add_favorotes' : 'organize_favorites';

        BRSOpenWin("/weblications/WebQuery/components/favorites.epl?mode=" + val + "&tool=" + tool + "&reload_location=" + reload_location, window_name, "resizable,width=400,screenX=300,screenY=200,height=" + height);
        return;
    }
    if (val == 'browse') {
        BRSOpenWin("/weblications/WebQuery/components/browse_favorites.epl?tool=" + tool, 'browse_favs', "resizable,width=340,height=435,screenX=300,screenY=200");
        return;
    }

    if (val == 'application_default') {
        var args =
            window.location.search.replace(/\&?favorites_id=.*\&?/, '');
        args = args.replace(/\&?&application_default=1\&?/, '');
        window.location.replace(window.location.pathname + args + "&application_default=1");
        return;
    }

    if (auto_run == false) {
        var args =
            window.location.search.replace(/\&?favorites_id=.*\&?/, '');
        args = args.replace(/\&?auto_run=.*\&?/, '');
        window.location.replace(window.location.pathname + args + "&favorites_id=" + val);
        return;
    }

    document.forms[0].favorites_id.value = val;
    document.forms[0].auto_run.value = 1;
    document.forms[0].submit();
}

// -----------------------------------------------------------
// Function that opens view options dialog box.
// Arguments:
//     tool - unique tool name (trade, position, etc)
//     licat of arguments in any order:
//     opener_form=xyz
//     context=xyz
//     reload_location=xyz
//
// Returns:
//     Nothng
//
function ViewOptionsTool(tool) {
    var in_args = ViewOptionsTool.arguments;
    var default_args = 'opener_form=document.forms[0]';
    var args = '';
    var i;
    for (i = 0; i < in_args.length; i++) {
        if (/^context\=/.test(in_args[i])) {
            args = args + '&action_mode=LoadContext&' + in_args[i];
        }
        else if (/^opener_form\=/.test(in_args[i])) {
            args = args + '&' + in_args[i];
        }
        else if (/^tree_width\=/.test(in_args[i])) {
            args = args + '&' + in_args[i];
        }
        else if (/^reload_action\=/.test(in_args[i])) {
            args = args + '&' + in_args[i];
        }
    }
    if (args == '') {
        args = '&' + default_args;
    }

    BRSOpenWin("/weblications/WebQuery/components/view_options.epl?tool=" +
        tool + "&" + args, 'view_options',
        'resizable,height=569,width=962,screenX=300,screenY=200',
        true);
}

// -----------------------------------------------------------
// Function that opens popups, & brings them to focus
// Argument:
//  url  -  url of the popup, 1st argument in window.open
//  win_name - name of the popup, 2nd argument in window.open
//  win_attr - width,height,& other attributes of the popup
//             3rd argument in window.open
//      cache - true/false, whether or not you want to cache the popup,
//              caching a popup means that if you have popup A opened, &
//              minized, that clicking the link that opened the popup
//              will just bring popup A to focus, instead of closing
//              it & opening it again

function BRSOpenWin(url, win_name, win_attr, cache) {
    if (BRSOpenWin_wins[win_name] != null && !BRSOpenWin_wins[win_name].closed && cache) {
        BRSOpenWin_wins[win_name].focus();
        return;
    }
    if (BRSOpenWin_wins[win_name] != null && !BRSOpenWin_wins[win_name].closed) {
        BRSOpenWin_wins[win_name].close();
    }
    BRSOpenWin_wins[win_name] = window.open(url, win_name, win_attr);
    BRSOpenWin_wins[win_name].focus();
}

var BRSOpenWin_wins = new Array();

/**
 * Given a location, and a parameter name and a value,
 * return a new location that has a the parameter name and value set.
 * @param a_location The original document location
 * @param a_paramName The name of the parameter
 * @param a_paramValue The value of the parameter
 * @param a_delete If true, the parameter should be removed
 */
function ensureURLRequestParam(a_location, a_paramName, a_paramValue, a_delete) {
    var urlre = new RegExp(a_paramName + "=.*?(#|&|$)");
    var location = a_location;
    if (urlre.test(location)) {
        if (a_delete) {
            var newlocation;
            match = RegExp.lastMatch;
            lastIndex = urlre.lastIndex;
            if (!lastIndex) {
                lastIndex = location.indexOf(match) + match.length;
            }
            newlocation = location.substr(0, lastIndex - match.length);
            newlocation = newlocation + location.substr(lastIndex);
            location = newlocation;
        } else {
            var newlocation;
            match = RegExp.lastMatch;
            //Support for beloved browsers that don't support lastMatch accessor
            if (!match) {
                var matchInfo = urlre.exec(location);
                match = matchInfo[0];
            }
            lastIndex = urlre.lastIndex;
            if (!lastIndex) {
                lastIndex = location.indexOf(match) + match.length;
            }
            newlocation = location.substr(0, lastIndex - match.length);
            newlocation = newlocation + a_paramName + "=" + a_paramValue
            if (RegExp.$1) {
                newlocation = newlocation + RegExp.$1;
            }
            newlocation = newlocation + location.substr(lastIndex);
            location = newlocation;
        }
    } else {
        if (!a_delete) {
            var urlend = new RegExp("(#|&){0,1}$");
            var suffix = location.indexOf("?") == -1 ? "?" : "&";
            location = location.replace(urlend, suffix + a_paramName + "=" + a_paramValue);
        }
    }
    return location;
}

/**
 * Given a reference to a tr, return the nth td element
 * @param a_tr A DOM tr ref
 * @param a_nth The index of the desired table cell
 */
function getNthTDElement(a_tr, a_nth) {
    return getRowCells(a_tr).item(a_nth);
}

/**
 * A cross browser way to get the inner text of an element.
 * @param a_elem The DOM reference to pull the inner text from
 * @param a_elem The delimiter to use to put between item from different children (optional)
 * @param a_trim If true, trim the text as it is added
 * @returns The inner text of all child elements
 */
function getInnerText(a_elem, a_delim, a_trim) {
    if (!a_elem) {
        return '';
    }
    var children = a_elem.childNodes;
    var contents = '';
    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeType == 3 /*TEXT_NODE*/) {
            if (contents.length > 0 && a_delim) {
                contents = contents.concat(a_delim);
            }
            var text = children[i].nodeValue;
            if (a_trim) {
                text = stripBlanks(text);
            }
            contents = contents.concat(text);
        } else if (children[i].childNodes.length > 0) {
            if (contents.length > 0 && a_delim) {
                contents = contents.concat(a_delim);
            }
            contents = contents.concat(getInnerText(children[i], a_delim, a_trim));
        }
    }
    return contents;
}

/**
 * Get the next (or previous) sibling node in a cross brower way (i.e. ignores text nodes in Mozilla).
 * @param elem A DOM ref
 * @param reverseDirection If true, get the previousSibling
 * @returns The next or previous sibling
 */
function getNextSiblingElementNode(elem, reverseDirection) {
    var sibling = reverseDirection ? elem.previousSibling : elem.nextSibling;
    while (sibling && sibling.nodeType != 1 /*Element node type*/) {
        sibling = reverseDirection ? sibling.previousSibling : sibling.nextSibling;
    }
    return sibling;
}

/**
 * Given a reference to a TR, return the td or th elements inside.
 * @param a_trRef The DOM reference to a tr
 * @returns An array of td or th elements
 */
function getRowCells(a_trRef) {
    var rowCells = a_trRef.getElementsByTagName('td');
    if (rowCells.length == 0) {
        rowCells = a_trRef.getElementsByTagName('th');
    }
    return rowCells;
}

/**
 * Given a DOM ref, return the CSS class
 * @param a_trRef A DOM reference
 */
function getCSSClass(a_elemRef) {
    if (!a_elemRef) {
        return '';
    }
    var className = a_elemRef.getAttribute('className');
    if (!className) {
        className = a_elemRef.getAttribute('class');
    }
    return className;
}

/**
 * Get the parent with the matching tag name
 * @param anchor The DOM ref to start with
 * @param parentTagName The case insensative name of the parent tag you are looking for
 * @returns The first matching parent tag with the same tag name or null
 */
function getParentNode(anchor, parentTagName) {
    var parent = anchor.parentNode;
    while (parent.tagName && !(parentTagName.toLowerCase() == parent.tagName.toLowerCase())) {
        parent = parent.parentNode;
    }
    return parent;
}

/**
 * Get the first child with the matching tag name
 * @param anchor The DOM ref to start with
 * @param parentTagName The case insensative name of the child tag you are looking for
 * @returns The first matching child tag with the same tag name or null
 */
function getFirstChildNode(anchor, childTagName) {
    var child = anchor.firstChild;
    if (!child) {
        return null;
    }
    while (child) {
        if (child.nodeType == 1 && child.tagName.toLowerCase() == childTagName.toLowerCase()) {
            break;
        }
        child = getNextSiblingElementNode(child);
    }
    if (child) {
        return child;
    }
    //Repeat iteration for recursion
    child = anchor.firstChild;
    while (child) {
        if (child.nodeType == 1) {
            var descendant = getFirstChildNode(child, childTagName);
            if (descendant) {
                return descendant;
            }
        }
        child = getNextSiblingElementNode(child);
    }
    return null;
}

/**
 *  Get the cell index of a given td element.
 *  This is a stupid method.  Just use a_td.cellindex instead.
 *  @param a_td The td to test
 */
function getTDColumnIndex(a_td) {
    return a_td.cellIndex;
    /*
     var tds = getRowCells(a_td.parentNode);
     var index = 0;
     for ( ; index < tds.length; index++ ) {
     if ( tds.item(index) == a_td ) {
     break;
     }
     }
     return index;
     */
}

/**
 * Get an event or the window.event object
 */
function getEvent(a_event) {
    return ( a_event ) ? a_event : window.event;
}

/**
 * Strip out leading and trailing blanks and leading char code 160s (non breaking spaces)
 * from text.
 * @param a_raw The text to strip
 */
function stripBlanks(a_raw) {
    var stripped = a_raw;
    stripped = stripped.replace(/^\s+/g, '');
    stripped = stripped.replace(/\s+$/g, '');
    var regexpPattern = "^" + String.fromCharCode(160) + "+";
    var stripNBSP = new RegExp(regexpPattern);
    stripped = stripped.replace(stripNBSP, '');
    return stripped;
}

/**
 * Set the cancel bubble flag of an event in a cross browser way.
 * @param The event object.  If null, window.event is assumed.
 */
function cancelBubble(a_evt) {
    evt = ( a_evt ) ? a_evt : window.event;
    evt.cancelBubble = true;
}

/**
 * Assign a function pointer down a DOM tree of elements.
 * You probably should be using event master instead of this.
 * @param root The root DOM ref object
 * @param functionName The name to give the assigned function
 * @param functionPointer The pointer to the function object to assign
 */
function assignFunctionDownTree(root, functionName, functionPointer) {
    try {
        if (root[functionName] == null) {
            try {
                root[functionName] = functionPointer;
            } catch (ignore) {
            }
        }
    } catch (ignored) {
    }
    var children = root.childNodes;
    for (var i = 0; i < children.length; i++) {
        assignFunctionDownTree(children[i], functionName, functionPointer);
    }
}

/**
 * Resolve a template string
 * Take a string like this: '/viewserver/rw?port={port}&rpttag={rpttag}&subdir={subdir}&param1={one}&param2={two}'
 * and a Object like this:
 * var tokens = new Object();
 * tokens['port'] = 'BR-CORE';
 * tokens['rpttag'] = 'Z';
 * tokens['subdir'] = 'muni';
 * tokens['one'] = 'good';
 * tokens['two'] = 'bad';
 * And call this method and you will get:
 *  '/viewserver/rw?port=BR-CORE&rpttag=Z&subdir=muni&param1=good&param2=bad'
 *
 * Don't forget this psycho notation is the same:
 * var tokens = { port:'BR-CORE',rpttag:'Z',subdir:'muni',one:'good',two:'bad'};
 */
function resolveTemplate(templateString, params) {
    //Find all the '{' '}' delimited field, and swap them out.
    var parenMatch = new RegExp("{([^}]+)}", "g");
    var results = parenMatch.exec(templateString);
    while (results) {
        var token = results[1];
        var value = params[token];
        if (value == null) {
            value = '';
        }
        templateString = templateString.substring(0, results.index) + value + templateString.substring(parenMatch.lastIndex);
        var results = parenMatch.exec(templateString);
    }
    return templateString;
}

function ExtLink(url) {
    this.urlTemplate = url;
}

ExtLink.prototype.renderUrl = function (paramObj) {
    return resolveTemplate(this.urlTemplate, paramObj);
}

//e.g. to get url for one of these: ReutNws.url.renderUrl({ticker:"IBM"})

var GoogFin = {code: "GoogFin", name: "Google Finance", url: new ExtLink("http://www.google.com/finance?q={ticker}")};
var ReutCrt = {
    code: "ReutCrt",
    name: "Reuters Chart",
    url: new ExtLink("http://today.reuters.com/stocks/charts.aspx?ticker={ticker}")
};
var ReutNws = {
    code: "ReutNws",
    name: "Reuters News",
    url: new ExtLink("http://stocks.us.reuters.com/stocks/companyNews.asp?symbol={ticker}")
};
var YhooNws = {code: "YhooNws", name: "Yahoo News", url: new ExtLink("http://finance.yahoo.com/h?s={ids}")};
var TstrEst = {
    code: "TstrEst",
    name: "TheStreet Analyst Estimates",
    url: new ExtLink("http://tools.thestreet.com/tsc/quotes.html?pg=analyst&symb={ticker}")
};
var MsneEst = {
    code: "MsneEst",
    name: "MSN Earnings Estimates",
    url: new ExtLink("http://moneycentral.msn.com/investor/invsub/analyst/earnest.asp?Page=EarningsEstimates&Symbol={ticker}")
};
var MsneRpt = {
    code: "MsneRpt",
    name: "MSN Company Report",
    url: new ExtLink("http://moneycentral.msn.com/companyreport?Symbol={ticker}")
};
var MktwSec = {
    code: "MktwSec",
    name: "MarketWatch SEC Filings",
    url: new ExtLink("http://www.marketwatch.com/tools/quotes/secfilings.asp?symb={ticker}")
};
var ZcksOpt = {
    code: "ZcksOpt",
    name: "Zacks Options Chain",
    url: new ExtLink("http://www.zacks.com/research/report.php?type=opt&t={ticker}")
};
var GoogDatNws = {
    code: "GoogDatNws",
    name: "Google News By Date",
    url: new ExtLink("http://finance.google.com/finance?q={ticker}&morenews=15&rating=1&newsbefore={date}")
};
var YhooDatNws = {
    code: "YhooDatNws",
    name: "Yahoo News By Date",
    url: new ExtLink("http://finance.yahoo.com/q/h?s={ticker}&news=1&t={date}")
};

var ExternalResearchSources = new Array(YhooNws, GoogFin, ReutNws, ReutCrt, TstrEst, MsneEst, MsneRpt, MktwSec, ZcksOpt);


/**
 * Hides or shows an element by setting its style's "display" property.
 *
 * @param  elementOrID  the element to hide, or its ID.
 * @param  visible      a boolean indicating the desired visibility.
 * @return              the element, which may be useful if only the ID was
 *                      originally passed in.
 */
function setElementVisible(elementOrID, visible) {
    var element;
    if (typeof(elementOrID) == 'string') {
        element = document.getElementById(elementOrID);
    } else {
        element = elementOrID;
    }
    if (element != null && typeof(element) == 'object') {
        element.style.display = (visible ? '' : 'none');
    }
    return element;
}

/**
 * Substitutes one class name for another.
 *
 * @param element   the element whose class is to be changed.
 * @param oldClass  the class name that should be replaced.
 * @param newClass  the class that should be substituted.
 */
function changeClassName(element, oldClass, newClass) {
    element.className =
        element.className.replace(new RegExp('\\b' + oldClass + '\\b'), newClass);
}

/**
 * Adds a class name to an element's set of classes.
 *
 * @param element   the element whose class is to be changed.
 * @param class     the class name in question.
 * @param set       whether to set or remove the class name.
 */
function setClassName(element, theClass, set) {
    if (set) {
        if (new RegExp('\\b' + theClass + '\\b').test(element.className) == false) {
            element.className += ' ' + theClass;
        }
    } else {
        element.className = element.className.replace(
            new RegExp('\\b' + theClass + '\\b'), '');
    }
}

/**
 * Disables an input field and gives it a disabled appearance using the
 * AladdinView style sheet.
 *
 * @param control   the INPUT or TEXTAREA element representing the field.
 * @param disabled  a boolean indicating the desired state.
 */
function setControlDisabled(control, disabled) {
    control.disabled = disabled;
    if (disabled) {
        control.className =
            control.className.replace(/\binput\b/, 'no_input_input');
    } else {
        control.className =
            control.className.replace(/\bno_input_input\b/, 'input');
    }
}

/**
 * Makes a text field read-only and gives it a disabled appearance using the
 * AladdinView style sheet. Unlike disabling, this allows the field's value to
 * be passed in the form data.
 *
 * @param control   the INPUT or TEXTAREA element representing the text field.
 * @param readOnly  a boolean indicating the desired state.
 */
function setTextFieldReadOnly(control, readOnly) {
    control.readOnly = readOnly;
    if (readOnly) {
        control.className =
            control.className.replace(/\binput\b/, 'no_input_input');
    } else {
        control.className =
            control.className.replace(/\bno_input_input\b/, 'input');
    }
}

/**
 * Finds elements that have a given class.
 * Written by Jonathan Snook, http://www.snook.ca/jonathan
 * Add-ons by Robert Nyman, http://www.robertnyman.com
 *
 * @param  oElm          the element whose descendants should be searched.
 * @param  strTagName    the type of element to consider, or '*' for any.
 * @param  strClassName  the class to search for.
 * @return               an array of matching elements.
 */
function getElementsByClassName(oElm, strTagName, strClassName) {
    var arrElements = (strTagName == "*" && oElm.all) ? oElm.all : oElm.getElementsByTagName(strTagName);
    var arrReturnElements = new Array();
    strClassName = strClassName.replace(/-/g, "\-");
    var oRegExp = new RegExp('(^|\\s)' + strClassName + '(\\s|$)');
    var oElement;
    for (var i = 0; i < arrElements.length; i++) {
        oElement = arrElements[i];
        if (oRegExp.test(oElement.className)) {
            arrReturnElements.push(oElement);
        }
    }
    return arrReturnElements;
}

/**
 * Returns the x and y coordinates of the top-left corner of an element,
 * relative to the top-left corner of the containing frame or, optionally, of
 * the specified ancestor.
 *
 * @param  element            the element whose coordinates are needed.
 * @param  referenceAncestor  if specified, the ancestor element relative to
 *                            which to measure. If not specified, the frame
 *                            containing the element is used as the reference.
 * @return                    an object holding the coordinates in two
 *                            properties, called x and y.
 */
function getAbsoluteElementCoordinates(element, referenceAncestor) {
    var coords = {x: 0, y: 0};
    while (element != null && element != referenceAncestor) {
        coords.x += element.offsetLeft;
        coords.y += element.offsetTop;
        element = element.offsetParent;
    }
    return coords;
}

/**
 * Returns true if elem is found in array, false if not.
 *
 * @param    array        the array to search the contents of.
 * @param    elem        the element to search for in the array.
 * @param    strict        perform a 'strict' equality comparison (the objects being compared must be equal in value AND type).
 */
function arrayContains(array, elem, strict) {
    for (var key in array) {
        if (( !strict && array[key] == elem ) || ( strict && array[key] === elem )) {
            return true;
        }
    }
    return false;
}

/**
 * XML encode a string.
 *
 * @param    string        the string to be encoded.
 * @return                the encoded string.
 */
function xmlEncode(string) {
    return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').
        replace(/'/g, '&apos;').replace(/"/g, '&quot;');
}

/**
 * From 'Even Faster Web Sites' by Steve Souders:
 * Generally speaking, interacting with DOM objects is always more expensive than interacting with non-DOM objects.
 * Due to DOM behavior, property lookups typically take longer than non-DOM property lookups.
 * The HTMLCollection object is the worst-performing object in the DOM. If you need to repeatedly access members of
 * an HTMLCollection, it is more efficient to copy them into an array first.
 *
 * @param collection    an HTMLCollection to be copied to an array
 * @return                an array containing all of the members of the HTMLCollection
 */
function htmlCollectionToArray(collection) {
    var ret = [];
    var len = collection.length;

    for (var i = 0; i < len; i++) {
        ret[i] = collection[i];
    }

    return ret;
}