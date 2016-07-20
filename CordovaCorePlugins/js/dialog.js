/* ********************************************************

Dialogs

**********************************************************/

function doDialogAlert() {
    debugLog("Dialog Alert Called");
    navigator.notification.alert('You are the winner!', // message
        doDialogAlertCallback, // callback
        'Game Over', // title
        'Done' // buttonName
    );
}

function doDialogConfirm() {
    debugLog("Dialog Confirm Called");
    navigator.notification.confirm('You are the winner!', // message
        doDialogConfirmCallback, // callback to invoke with index of button pressed
        'Game Over', // title
        ['Restart', 'Exit'] // buttonLabels
    );
}

function doDialogPrompt() {
    debugLog("Dialog Prompt Called");
    navigator.notification.prompt('Please enter your name', // message
        doDialogPromptCallback, // callback to invoke
        'Registration', // title
        ['Ok', 'Exit'], // buttonLabels
        'Jane Doe' // defaultText
    );
}

function doDialogBeep() {
    debugLog("Dialog Beep Called");
    navigator.notification.beep(2); //Beep Twice
    document.getElementById("dialog_beep").innerHTML = "Beep x2";
}

function doDialogAlertCallback() {
    document.getElementById("dialog_alert").innerHTML =
        "Alert Callback Received!";
}

function doDialogConfirmCallback(buttonIndex) {
    document.getElementById("dialog_confirm").innerHTML = "Button: " +
        buttonIndex;
}

function doDialogPromptCallback(results) {
    document.getElementById("dialog_prompt").innerHTML = "Button: " +
            results.buttonIndex + " | Input: " + results.input1;
}
