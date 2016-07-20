/* ********************************************************

Network Information

**********************************************************/

function checkConnection() {
    var networkState = navigator.connection.type;
    document.getElementById("network_stateid").innerHTML = networkState;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';
    document.getElementById("network_state").innerHTML = states[
        networkState];
    document.addEventListener("offline", handleOffline, false);
    document.addEventListener("online", handleOnline, false);
}

function handleOffline() {
    document.getElementById("network_event").innerHTML =
        "Offline Event Fired";
}

function handleOnline() {
    document.getElementById("network_event").innerHTML =
            "Online Event Fired";
}
