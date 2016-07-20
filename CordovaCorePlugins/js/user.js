/* ********************************************************

AEM Mobile User

**********************************************************/

//User Info
var userListeningForInfo = false;

function userInfo() {
    document.getElementById("user_isAuthenticated").innerHTML = cq.mobile.user
        .isAuthenticated;
    document.getElementById("user_authToken").innerHTML = cq.mobile.user.authToken;
}

function updateIsAuthenticated() {
    document.getElementById('user_isAuthenticated').innerHTML = cq.mobile.user
        .isAuthenticated;
}

function updateAuthToken() {
    document.getElementById('user_authToken').innerHTML = cq.mobile.user.authToken;
}

function watchUserInfo() {
    if (!userListeningForInfo) {
        document.addEventListener("isauthenticatedchanged",
            updateIsAuthenticated, false);
        document.addEventListener("authtokenchanged", updateAuthToken,
            false);
        userListeningForInfo = true;
    }
}

function unwatchUserInfo() {
    if (userListeningForInfo) {
        document.removeEventListener("isauthenticatedchanged",
            updateIsAuthenticated, false);
        document.removeEventListener("authtokenchanged", updateAuthToken,
            false);
        userListeningForInfo = false;
    }
}
