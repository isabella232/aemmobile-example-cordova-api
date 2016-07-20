/* ********************************************************

Media Capture

**********************************************************/

function mediaCaptureAudio() {
    var captureSuccess = function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            document.getElementById("mediacaptureaudio_result").innerHTML = "Captured Audio: " + path;
        }
    };

    // capture error callback
    var captureError = function(error) {
        //navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
        document.getElementById("mediacaptureaudio_result").innerHTML = "Failed to capture audio: "+error.code;
    };

    // start audio capture
    navigator.device.capture.captureAudio(captureSuccess, captureError, {limit:1});
}

function mediaCaptureVideo() {
    var captureSuccess = function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            document.getElementById("mediacapturevideo_result").innerHTML = "Captured Video: " + path;
            document.getElementById("mc_video").src = path;
        }
    };

    // capture error callback
    var captureError = function(error) {
        //navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
        document.getElementById("mediacapturevideo_result").innerHTML = "Failed to capture Video: "+error.code;
    };

    // start video capture
    navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:1});
}

function mediaCaptureImage() {
    var captureSuccess = function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            document.getElementById("mediacaptureimage_result").innerHTML = "Captured Image: " + path;
            document.getElementById("mc_image").src = path;
        }
    };

    // capture error callback
    var captureError = function(error) {
        //navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
        document.getElementById("mediacaptureimage_result").innerHTML = "Failed to capture Image: "+error.code;
    };

    // start image capture
    navigator.device.capture.captureImage(captureSuccess,captureError, {limit:1});
}
