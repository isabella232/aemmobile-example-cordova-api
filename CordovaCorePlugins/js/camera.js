/* ********************************************************

Camera

**********************************************************/

function cameraInfo() {
    navigator.camera.getPicture(cameraSuccess, cameraError, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
    });
}

function cameraSuccess(imageData) {
    var image = document.getElementById('myImage');
    image.src = "data:image/jpeg;base64," + imageData;
}

function cameraError(error) {
    debugLog(error);
}
