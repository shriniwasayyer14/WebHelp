//
// Function that checks cusip
//

// validate multiple cusips field (separated by ,; space, new line or tab)
//
function validate_cusips(cusip_box) {

    cusip_box.value = cusip_box.value.toUpperCase();
    var cusip = cusip_box.value;

    if ((/^\s*$/).test(cusip)) {
        return true;
    }

    var cusips = cusip.split(/[\,\s\n]+/);

    for (var i = 0; i < cusips.length; i++) {
        var ret_val = fix_cusip(cusips[i]);

        if (ret_val == 0) {
            alert('INVALID CUSIP: ' + cusips[i]);
            cusip_box.select();
            cusip_box.focus();
            return false;
        }
        else {
            if (cusips[i].length == 9 && ret_val != cusips[i]) {
                var check = confirm("The 9-digit CUSIP you have entered: " + cusips[i] + " has a wrong check digit.\nHit 'OK' to have the check digit corrected and continue, or hit 'Cancel' to change the CUSIP.");
                if (check == false) {
                    cusip_box.select();
                    cusip_box.focus();
                    return false;
                }
            }
            cusips[i] = ret_val;
        }
    }

    if (cusip_box.type == 'textarea') {
        cusip_box.value = cusips.join(",\n");
    }
    else {
        cusip_box.value = cusips.join(",");
    }

    return true;
}

function check_cusip(cusip) {
    cusip = cusip.toUpperCase();
    var tmp_cusip = fix_cusip(cusip);
    if (tmp_cusip == 0) {
        alert("Invalid CUSIP");
        return cusip;
    }
    return tmp_cusip;
}

//
// Function that calculates 9th digit in a CUSIP
//
function fix_cusip(cusip) {
    if (cusip.length < 8) return 0;
    if (cusip.length > 9) return 0;

    var check = 0;
    var checkloop = 0;
    var m;
    var d;
    var cur_ch;
    var ret_cusip = '';
    while (checkloop < 8) {
        m = checkloop % 2 + 1;
        cur_ch = cusip.substr(checkloop, 1);
        ret_cusip = ret_cusip + cur_ch;

        if (cur_ch == "*") {
            d = m * 9;
        }

        else if (cur_ch == "@") {
            d = m * 5;
        }

        else if (cur_ch == "#") {
            d = m * 6;
        }

        else if (cur_ch >= "0" && cur_ch <= "9") {
            d = m * cur_ch;
        }

        else {
            if (cur_ch >= "A" && cur_ch <= "Z") {
                cur_ch = char2num(cur_ch);
                d = m * cur_ch;
            }
            else {
                return 0;
            }
        }
        check += d % 10 + d / 10 - (( d % 10 ) / 10);
        checkloop++;
    }

    var nith_digit = (10 - check % 10) % 10;
    ret_cusip = ret_cusip + nith_digit;

    return ( ret_cusip );
}

//
// Function that calculates 9th difit in a CUSIP
//

function char2num(cur_ch) {
    var Alpha = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z');
    var i = 0;
    var ANum = 999;
    while (i < Alpha.length) {
        if (Alpha[i] == cur_ch) {
            ANum = i;
            i = Alpha.length;
        }
        i++;
    }

    return ( ANum );
}


