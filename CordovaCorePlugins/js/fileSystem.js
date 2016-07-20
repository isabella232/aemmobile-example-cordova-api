/* ********************************************************

Filesystem

**********************************************************/

function filesystemInfo() {
    document.getElementById("file_app").innerHTML = cordova.file.applicationDirectory;
    document.getElementById("file_storage").innerHTML = cordova.file.applicationStorageDirectory;
    document.getElementById("file_data").innerHTML = cordova.file.dataDirectory;
    document.getElementById("file_cache").innerHTML = cordova.file.cacheDirectory;
    document.getElementById("file_documents").innerHTML = cordova.file.documentsDirectory;
}
