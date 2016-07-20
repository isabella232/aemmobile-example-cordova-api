/* ********************************************************

Device Motion - Accellerometer

**********************************************************/

var watchAccelId = null;
/**
 * Start watching acceleration
 */
var watchAccel = function() {
    debugLog("watchAccel()");
    // Success callback
    var success = function(a) {
        document.getElementById('accel_x').innerHTML = roundNumber(a.x);
        document.getElementById('accel_y').innerHTML = roundNumber(a.y);
        document.getElementById('accel_z').innerHTML = roundNumber(a.z);
    };
    // Fail callback
    var fail = function(e) {
        debugLog("watchAccel fail callback with error code " + e);
        stopAccel();
        setAccelStatus(e);
    };
    // Update acceleration every 1 sec
    var opt = {};
    opt.frequency = 1000;
    watchAccelId = navigator.accelerometer.watchAcceleration(success, fail,
        opt);
    setAccelStatus("Running");
};
/**
 * Stop watching the acceleration
 */
var stopAccel = function() {
    debugLog("stopAccel()");
    setAccelStatus("Stopped");
    if (watchAccelId) {
        navigator.accelerometer.clearWatch(watchAccelId);
        watchAccelId = null;
    }
};
/**
 * Get current acceleration
 */
var getAccel = function() {
    debugLog("getAccel()");
    // Stop accel if running
    stopAccel();
    // Success callback
    var success = function(a) {
        document.getElementById('accel_x').innerHTML = roundNumber(a.x);
        document.getElementById('accel_y').innerHTML = roundNumber(a.y);
        document.getElementById('accel_z').innerHTML = roundNumber(a.z);
        debugLog("getAccel success callback");
    };
    // Fail callback
    var fail = function(e) {
        debugLog("getAccel fail callback with error code " + e);
        setAccelStatus(e);
    };
    // Make call
    var opt = {};
    navigator.accelerometer.getCurrentAcceleration(success, fail, opt);
};
/**
 * Set accelerometer status
 */
var setAccelStatus = function(status) {
    document.getElementById('accel_status').innerHTML = status;
};
