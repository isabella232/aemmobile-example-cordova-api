/* ********************************************************

Media

**********************************************************/

var mediaTimer;
var mediaState;

function loadMedia() {
    if (mediaState == 'notLoaded') {
        // The assets for this content are in:
        // <appPath>/Library/Caches/<pubId>/<articleId>/folio/<resourcePath>/assets
        //
        // On a device <appPath> is:
        // /var/mobile/Containers/Data/Application/<UUID>
        //
        // <pubId> and <articleId> are unique hashes created by the Viewer.
        // <resourcePath> is OverlayResources/<articleFolder>, defined only for an InDesign HTML overlay.
        // <articleFolder> is the the name of the folder containing the index.html file that is
        // specified when creating the overlay with InDesign.
        //
        // The Cordova Media plugin is designed to work with the Cordova File plugin, but we can't
        // use it since don't want to modify the File plugin for the Viewer to support the <pubId>,
        // <articleId> and <resourcePath> path components.
        //
        // One way to get the media path is to use window.location and strip off the file://
        // protocol at the beginning and the index.html file name at the end:
        // var mediaPath = window.location.pathname;
        // mediaPath = mediaPath.slice(0, -10) + "assets/media/song.mp3";
        //
        // Here we use the rootPath property of the entity object supplied by the custom Context plugin.
        var mediaPath;
        var entity = cq.mobile.context.entity;

        if (cq.mobile.context.type === "article") {
            mediaPath = entity.rootPath;
        }
        else if (cq.mobile.context.type === "overlay") {
            mediaPath = entity.rootPath + "/OverlayResources/multiple_plugins";
        }
        else {
            debugLog("unsupported context type " + cq.mobile.context.type);
        }

        mediaPath = mediaPath + "/assets/media/Apollo_11_highlight_4.mp3";
        debugLog("cq.mobile.context.type is: " + cq.mobile.context.type);
        debugLog("loading media at " + mediaPath);

        // The mediaSuccessCallback in the constructor below is called back after a successful play,
        // record, or stop operation or condition.  mediaErrorCallback works the same way.
        // mediaStatusCallback monitors the status of the play and record operations.
        media = new Media(mediaPath, mediaSuccessCallback, mediaErrorCallback, mediaStatusCallback);
        document.getElementById('mediaStatus').innerHTML = " loaded";
        mediaState = 'loaded';
    } else {
        debugLog("media already loaded");
    }
}

function mediaSuccessCallback() {
    debugLog("mediaSuccessCallback");
}

function mediaErrorCallback(error) {
    debugLog("mediaErrorCallback: " + error.message);
    document.getElementById('mediaStatus').innerHTML = " Error: code " + error.code;
}

function mediaStatusCallback(status) {
    switch (status) {
    case Media.MEDIA_NONE:
        document.getElementById('mediaStatus').innerHTML = " no media";
        mediaState = 'notLoaded';
        break;
    case Media.MEDIA_STARTING:
        document.getElementById('mediaStatus').innerHTML = " starting";
        mediaState = 'running';
        break;
    case Media.MEDIA_RUNNING:
        document.getElementById('mediaStatus').innerHTML = " running";
        // media.duration is initially undefined.  getDuration() returns -1 until the media is
        // running. Poll the duration value every 100ms until getDuration() returns a good value.
        // Bail if we've polled for over 2 seconds.
        var counter = 0;
        var timerDur = setInterval(function() {
            counter = counter + 100;
            if (counter > 2000) {
                clearInterval(timerDur);
                timerDur = undefined;
            }
            var dur = media.getDuration();
            if (dur > 0) {
                clearInterval(timerDur);
                timerDur = undefined;
                document.getElementById('mediaDuration').innerHTML = (dur) + " seconds";
            }
        }, 100);
        // media.position is initially undefined. getCurrentPosition() returns -1 until the media is
        // running.  Update the current position once every second.
        mediaTimer = setInterval(function () {
            media.getCurrentPosition(
                function (position) {
                    if (position > -1) {
                        document.getElementById('mediaPosition').innerHTML = (position) + " seconds";
                    }
                },
                function (e) {
                    debugLog("Error getting current media position: " + e);
                }
            );
        }, 1000);
        mediaState = 'running';
        break;
    case Media.MEDIA_PAUSED:
        document.getElementById('mediaStatus').innerHTML = " paused";
        clearInterval(mediaTimer);
        mediaTimer = undefined;
        mediaState = 'paused';
        break;
    case Media.MEDIA_STOPPED:
        // both Media.stop() and playing to the end set this condition.
        document.getElementById('mediaStatus').innerHTML = " stopped";
        clearInterval(mediaTimer);
        mediaTimer = undefined;
        mediaState = 'stopped';
        break;
    }
}

function pausePlayMedia() {
    if (mediaState == 'loaded' || mediaState == 'paused' || mediaState == 'stopped') {
        media.play();
    } else if (mediaState == 'running') {
        media.pause();
    }
}

function rewindMedia() {
    if (media) {
        document.getElementById('mediaPosition').innerHTML = " 0 seconds";
        media.seekTo(0);
    }
}

function stopMedia() {
    if (media) {
        media.stop();
    }
}

function releaseMedia() {
    if (media) {
        media.release();
        media = undefined;
        mediaState = 'notLoaded';
        if (mediaTimer) {
            clearInterval(mediaTimer);
            mediaTimer = undefined;
        }
        document.getElementById('mediaDuration').innerHTML = "";
        document.getElementById('mediaPosition').innerHTML = "";
        document.getElementById('mediaStatus').innerHTML = " not loaded";
    }
}
