/* ********************************************************

Vibration

**********************************************************/

//new standard vibrate call that aligns to w3c spec with param long
var vibrateWithInt = function() {
    debugLog("navigator.vibrate(3000)");
    navigator.vibrate(3000);
};
//new standard vibrate call that aligns to w3c spec with param array
var vibrateWithArray = function() {
    debugLog("navigator.vibrate([3000])");
    navigator.vibrate([3000]);
};
