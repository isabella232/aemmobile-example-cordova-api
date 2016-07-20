/* ********************************************************

AEM Mobile Application

**********************************************************/

function applicationInfo() {
    document.getElementById("app_identifier").innerHTML = cq.mobile.application
        .id;
    document.getElementById("app_version").innerHTML = cq.mobile.application
        .version;
    document.getElementById("app_runtime_version").innerHTML = cq.mobile.application
        .runtimeVersion;
    document.getElementById("app_push_notification_token").innerHTML = cq.mobile
            .application.pushNotificationToken;
}
