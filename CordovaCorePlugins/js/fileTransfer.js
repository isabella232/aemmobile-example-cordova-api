/* ********************************************************

File Transfer

**********************************************************/

function fileTransferDownload() {
    var url = "https://www.dpsapps.com/users/mike/cordova/image.jpg";
    var targetPath = cordova.file.dataDirectory + "testImage.jpg";
    var trustHosts = true;
    var options = {};
    var dl_div = document.getElementById("ft_dl_progress");
    var success = function (fileentry) {
        dl_div.innerHTML = "Success!";
        var img = document.getElementById("ft_image");
        img.src = fileentry.nativeURL;
        fileTransferUploadPush();
    };

    var fail = function (filetransfererror) {
        dl_div.innerHTML = "File Transfer Failed! Error Code: " + filetransfererror.code;
    };

    var ft = new FileTransfer();

    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            dl_div.innerHTML = perc + "% loaded...";
        } else {
            if(statusDom.innerHTML === "") {
                dl_div.innerHTML = "Loading";
            } else {
                dl_div.innerHTML += ".";
            }
        }
    };

    ft.download(url, targetPath, success, fail, trustHosts, options);
}

function fileTransferUploadPush() {
    var targetUrl = "https://www.dpsapps.com/users/mike/cordova/index.php";
    var source = cordova.file.dataDirectory + "testImage.jpg";
    var trustHosts = true;
    var ul_div = document.getElementById("ft_ul_progress_push");

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = source.substr(source.lastIndexOf('/') + 1);
    options.mimeType = "image/jpg";
    options.httpMethod = "push";

    var params = {};
    params.value1 = "Anonymous";
    params.value2 = "a@a.com";

    options.params = params;

    var success = function(r) {
        ul_div.innerHTML = "Success! Bytes Sent: " + r.bytesSent + ", HTTP Code: " + r.responseCode;
        fileTransferUploadPost();
    };

    var fail = function(filetransfererror) {
        ul_div.innerHTML = "File Transfer Failed! Error Code: " + filetransfererror.code + ", http status code: " + filetransfererror.http_status;
    };

    var ft = new FileTransfer();

    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            ul_div.innerHTML = perc + "% sent using PUSH";
        } else {
            if (statusDom.innerHTML === "") {
                dl_div.innerHTML = "sending";
            } else {
                dl_div.innerHTML += ".";
            }
        }
    };

    ft.upload(source, targetUrl, success, fail, options, trustHosts);
}

function fileTransferUploadPost() {
    var targetUrl = "https://www.dpsapps.com/users/mike/cordova/index.php";
    var source = cordova.file.dataDirectory + "testImage.jpg";
    var trustHosts = true;
    var ul_div = document.getElementById("ft_ul_progress_post");

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = source.substr(source.lastIndexOf('/') + 1);
    options.mimeType = "image/jpg";
    options.httpMethod = "post";

    var params = {};
    params.value1 = "Anonymous";
    params.value2 = "a@a.com";

    options.params = params;

    var success = function(r) {
        ul_div.innerHTML = "Success! Bytes Sent: " + r.bytesSent + ", HTTP Code: " + r.responseCode;
    };

    var fail = function(filetransfererror) {
        ul_div.innerHTML = "File Transfer Failed! Error Code: " + filetransfererror.code + ", http status code: " + filetransfererror.http_status;
    };

    var ft = new FileTransfer();

    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            ul_div.innerHTML = perc + "% sent using POST";
        } else {
            if (statusDom.innerHTML === "") {
                dl_div.innerHTML = "sending";
            } else {
                dl_div.innerHTML += ".";
            }
        }
    };

    ft.upload(source, targetUrl, success, fail, options, trustHosts);
}
