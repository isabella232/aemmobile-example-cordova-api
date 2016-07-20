/* ********************************************************

Device Orientation (Compass)

**********************************************************/

function roundNumber(num) {
    var dec = 3;
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}
var watchCompassId = null;
/**
 * Start watching compass
 */
var watchCompass = function() {
    debugLog("watchCompass()");
    // Success callback
    var success = function(a) {
        document.getElementById('compassHeading').innerHTML =
            roundNumber(a.magneticHeading);
    };
    // Fail callback
    var fail = function(e) {
        debugLog("watchCompass fail callback with error code " + e);
        stopCompass();
        setCompassStatus(e);
    };
    // Stop compass if running
    stopCompass();
    // Update heading every 1 sec
    var opt = {};
    opt.frequency = 1000;
    watchCompassId = navigator.compass.watchHeading(success, fail, opt);
    setCompassStatus("Running");
};
/**
 * Stop watching the acceleration
 */
var stopCompass = function() {
    setCompassStatus("Stopped");
    if (watchCompassId) {
        navigator.compass.clearWatch(watchCompassId);
        watchCompassId = null;
    }
};
/**
 * Get current compass
 */
var getCompass = function() {
    debugLog("getCompass()");
    // Stop compass if running
    stopCompass();
    // Success callback
    var success = function(a) {
        document.getElementById('compassHeading').innerHTML =
            roundNumber(a.magneticHeading);
    };
    // Fail callback
    var fail = function(e) {
        debugLog("getCompass fail callback with error code " + e.toString);
        setCompassStatus(e);
    };
    // Make call
    var opt = {};
    navigator.compass.getCurrentHeading(success, fail, opt);
};
/**
 * Set compass status
 */
var setCompassStatus = function(status) {
    document.getElementById('compass_status').innerHTML = status;
};
