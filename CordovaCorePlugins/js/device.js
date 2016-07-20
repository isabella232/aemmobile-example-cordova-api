/* ********************************************************

Device

**********************************************************/

function loadDeviceInfo() {
    document.getElementById("device_cordova").innerHTML = device.cordova;
    document.getElementById("device_platform").innerHTML = device.platform;
    document.getElementById("device_uuid").innerHTML = device.uuid;
    document.getElementById("device_model").innerHTML = device.model;
}

function loadCQDeviceInfo() {
    document.getElementById("device_class").innerHTML = cq.mobile.device.class;
    document.getElementById("device_vendor_id").innerHTML = cq.mobile.device.vendorId;
}
