/* ********************************************************

InAppBrowser

**********************************************************/

var ref;

function doBrowseDDG() {
    debugLog("Browse Duck Duck Go called");
    ref = window.open('https://duckduckgo.com', '_blank');
    IABAddEventListeners(ref);
}

function doOctane() {
    debugLog("Browse Octane benchmark called");
    ref = window.open('https://chromium.github.io/octane',
        '_blank', {
            presentationstyle: 'formsheet'
        });
    IABAddEventListeners(ref);
}

function doBrowseParticles() {
    debugLog("Browse Particles called");
    ref = window.open(
        'https://www.scirra.com/demos/c2/particles', '_blank', {
            location: 'no',
            presentationstyle: 'pagesheet'
        });
    IABAddEventListeners(ref);
}

function doBrowseKaleidoscope() {
    debugLog("Browse Kaleidoscope called");
    ref = window.open(
        'http://www.chiptune.com/kaleidoscope', '_blank', {
            location: 'no',
            presentationstyle: 'formsheet'
        });
    IABAddEventListeners(ref);
}

function IABAddEventListeners(ref) {
    ref.addEventListener('loadstart', IABLoadstartCallback);
    ref.addEventListener('loadstop', IABLoadstopCallback);
    ref.addEventListener('loaderror', IABLoaderrorCallback);
    ref.addEventListener('exit', IABExitCallback);
}

function IABLoadstartCallback(event) {
    debugLog("In-app browser load started: " + event.url);
}

function IABLoadstopCallback(event) {
    debugLog("In-app browser load finished");
}

function IABLoaderrorCallback(event) {
    debugLog("In-app browser got error: " + event.message + " (" + event.code +
        ") for " + event.url);
}

function IABExitCallback(event) {
    debugLog("In-app browser exited");
}
