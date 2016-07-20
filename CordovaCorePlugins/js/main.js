/* ********************************************************

Cordova Function

**********************************************************/

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    debugLog("CQM Device Plugin : " + (cq.mobile.device ? 'available' : 'unavailable'));
    debugLog("CQM User : " + (cq.mobile.user ? 'available' : 'unavailable'));
    debugLog("CQM Application : " + (cq.mobile.application ? 'available' : 'unavailable'));
    debugLog("CQM Context : " + (cq.mobile.context ? 'available' : 'unavailable'));
    debugLog("In-App Browser Plugin : " + (window.open ? 'available' : 'unavailable'));
    debugLog("Device Plugin : " + (device ? 'available' : 'unavailable'));
    debugLog("Network Plugin : " + (navigator.connection ? 'available' : 'unavailable'));
    debugLog("FileSystem Plugin : " + (cordova.file ? 'available' : 'unavailable'));
    debugLog("FileTransfer Plugin : " + (FileTransfer ? 'available' : 'unavailable'));
    debugLog("Geolocation Plugin : " + (navigator.geolocation ? 'available' : 'unavailable'));
    debugLog("Dialog Plugin : " + (navigator.notification ? 'available' : 'unavailable'));
    debugLog("Camera Plugin : " + (navigator.camera ? 'available' : 'unavailable'));
    debugLog("Device Orientation Plugin : " + (navigator.compass ? 'available' : 'unavailable'));
    debugLog("Device Motion Plugin : " + (navigator.accelerometer ? 'available' : 'unavailable'));
    debugLog("Vibration Plugin : " + (typeof navigator.vibrate ? 'available' : 'unavailable'));
    debugLog("Contacts Plugin : " + (navigator.contacts ? 'available' : 'unavailable'));
    debugLog("MediaCapture Plugin : " + (navigator.device.capture ? 'available' : 'unavailable'));
    debugLog("Media Plugin : " + (typeof Media ? 'available' : 'unavailable'));
    mediaState = 'notLoaded';
}

/* ********************************************************

Utility

**********************************************************/

function debugLog(details) {
    document.getElementById("log_info").innerHTML = document.getElementById(
        "log_info").innerHTML + details + "<br/>";
}

function prettyPrintJSON(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'JSONnumber';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'JSONkey';
            } else {
                cls = 'JSONstring';
            }
        } else if (/true|false/.test(match)) {
            cls = 'JSONboolean';
        } else if (/null/.test(match)) {
            cls = 'JSONnull';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
