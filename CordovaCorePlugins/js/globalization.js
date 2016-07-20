/* ********************************************************

Globalization

**********************************************************/

function loadGlobalizationInfo() {
    document.getElementById("globalization_preferred_language").innerHTML =
        navigator.globalization.getPreferredLanguage(
            globalizationSuccessPreferredLanguage, globalizationError);
    document.getElementById("globalization_locale").innerHTML = navigator.globalization
        .getLocaleName(globalizationSuccessLocale, globalizationError);
    document.getElementById("globalization_first_day_of_week").innerHTML =
        navigator.globalization.getFirstDayOfWeek(
            globalizationSuccessFirstDayOfWeek, globalizationError);
    document.getElementById("globalization_is_daylight_savings_time").innerHTML =
        navigator.globalization.isDayLightSavingsTime(new Date(),
            globalizationSuccessIsDayLightSavingsTime, globalizationError);
    document.getElementById("globalization_date_to_string").innerHTML =
        navigator.globalization.dateToString(new Date(),
            globalizationSuccessDateToString, globalizationError);
    document.getElementById("globalization_string_to_date").innerHTML =
        navigator.globalization.stringToDate('8/25/2014',
            globalizationSuccessStringToDate, globalizationError, {
                formatLength: 'short',
                selector: 'date'
            });
    document.getElementById("globalization_date_pattern").innerHTML =
        navigator.globalization.getDatePattern(
            globalizationSuccessDatePattern, globalizationError, {
                formatLength: 'short',
                selector: 'date and time'
            });
    document.getElementById("globalization_date_names").innerHTML =
        navigator.globalization.getDateNames(globalizationSuccessDateNames,
            globalizationError, {
                type: 'wide',
                item: 'months'
            });
    document.getElementById("globalization_currency_pattern").innerHTML =
        navigator.globalization.getCurrencyPattern('USD',
            globalizationSuccessCurrencyPattern, globalizationError);
    document.getElementById("globalization_number_to_string").innerHTML =
        navigator.globalization.numberToString(3.1415926,
            globalizationSuccessNumberToString, globalizationError, {
                type: 'decimal'
            });
    document.getElementById("globalization_string_to_number").innerHTML =
        navigator.globalization.stringToNumber('1234.56',
            globalizationSuccessStringToNumber, globalizationError, {
                type: 'decimal'
            });
    document.getElementById("globalization_number_pattern").innerHTML =
        navigator.globalization.getNumberPattern(
            globalizationSuccessNumberPattern, globalizationError, {
                type: 'decimal'
            });
}

function globalizationSuccessPreferredLanguage(language) {
    var myLanguage = language.value;
    document.getElementById("globalization_preferred_language").innerHTML =
        myLanguage;
}

function globalizationSuccessLocale(locale) {
    var myLocale = locale.value;
    document.getElementById("globalization_locale").innerHTML = myLocale;
}

function globalizationSuccessDateToString(date) {
    var myDateToString = date.value;
    document.getElementById("globalization_date_to_string").innerHTML =
        myDateToString;
}

function globalizationSuccessStringToDate(date) {
    var myStringToDate = 'month: ' + date.month + ' day: ' + date.day +
        ' year: ' + date.year + '\n';
    document.getElementById("globalization_string_to_date").innerHTML =
        myStringToDate;
}

function globalizationSuccessIsDayLightSavingsTime(date) {
    var myIsDayLightSavingsTime = date.dst;
    document.getElementById("globalization_is_daylight_savings_time").innerHTML =
        myIsDayLightSavingsTime;
}

function globalizationSuccessFirstDayOfWeek(day) {
    var myFirstDayOfWeek = day.value;
    document.getElementById("globalization_first_day_of_week").innerHTML =
        myFirstDayOfWeek;
}

function globalizationSuccessDatePattern(date) {
    var myDatePattern = 'pattern: ' + date.pattern + '\n' + 'timezone: ' +
        date.timezone;
    document.getElementById("globalization_date_pattern").innerHTML =
        myDatePattern;
}

function globalizationSuccessDateNames(names) {
    var obj = document.getElementById("globalization_date_names");
    obj.innerHTML = "";
    for (var i = 0; i < names.value.length; i++) {
        var myDateNames = 'month: ' + names.value[i];
        obj.innerHTML += myDateNames + "<br>";
    }
}

function globalizationSuccessCurrencyPattern(pattern) {
    var myCurrencyPattern = 'pattern: ' + pattern.pattern + '\n' + 'code: ' +
        pattern.code + '\n' + 'fraction: ' + pattern.fraction + '\n' +
        'rounding: ' + pattern.rounding + '\n' + 'decimal: ' + pattern.decimal +
        '\n' + 'grouping: ' + pattern.grouping;
    document.getElementById("globalization_currency_pattern").innerHTML =
        myCurrencyPattern;
}

function globalizationSuccessNumberToString(number) {
    var myNumberToString = number.value;
    document.getElementById("globalization_number_to_string").innerHTML =
        myNumberToString;
}

function globalizationSuccessStringToNumber(number) {
    var myStringToNumber = number.value;
    document.getElementById("globalization_string_to_number").innerHTML =
        myStringToNumber;
}

function globalizationSuccessNumberPattern(pattern) {
    var myNumberPattern = 'pattern: ' + pattern.pattern;
    document.getElementById("globalization_number_pattern").innerHTML =
        myNumberPattern;
}

function globalizationError(error) {
        debugLog(error.message);
}
