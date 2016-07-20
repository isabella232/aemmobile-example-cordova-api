
document.addEventListener('deviceready', onDeviceReady, false);

var isDebug = false;

//function onAppear() {
window.onAppear = function () {
}

function createElement(entity, listItem) {
	// create the link element
	var newLink = document.createElement('a');
	if (entity.type == "banner") {
		newLink.setAttribute('href', entity.metadata.url);
	} else {
		newLink.setAttribute('href', 'navto://' + entity.type + '/' + entity.metadata.entityName);
	}
	var linkText = document.createTextNode(entity.metadata.title);
	newLink.appendChild(linkText);
	// add the link element
	listItem.appendChild(newLink);

	// create type text field
	var entityType = document.createTextNode("(" + entity.type + ")");
	listItem.appendChild(entityType);

	// create info button from info.png
	var imageButton = document.createElement("img");
	imageButton.width = 20;
	imageButton.height = 20;
	imageButton.setAttribute('src', 'images/info.png');
	imageButton.addEventListener("click", function() {
		entityInfoDialog(entity);
	});
	// add the info button
	listItem.appendChild(imageButton);
}

function getEntityChildren(entity, parentElement) {
	// should verify that the entity is of type collection
	if (entity.type != "collection") {
		return;
	}
	var list = document.createElement('ul');
	if (parentElement.id == 'listContainer') {
		list.id = 'entityList';
	}
	// create the <ul> element
	entity.getChildren(function(entityList){
		debugLog("Child entity count: " + entityList.entities.length);
		for (var i=0; i < entityList.entities.length; i++) {
			var theEntity = entityList.entities[i];
			// add the <li> element
			var listItem = document.createElement('li');
			createElement(theEntity, listItem);
			if (theEntity.type == 'collection') {
				getEntityChildren(theEntity, listItem);
				// set the li class to hide ul children
				listItem.className = 'collapsed';
				// add a click handler to toggle expanding/collapsing the list
				listItem.addEventListener("click", function() {
					toggleListItem();
				});
			}
			// close the <li> element
			list.appendChild(listItem);
		}
	}, debugLog);
	// close the <ul> element
	parentElement.appendChild(list);
	if (parentElement.id == 'listContainer') {
		prepareList();
	}
}

function cardImageAssignment (xImageinfo) {
	debugLog("cardImageAssignment:" + JSON.stringify(xImageinfo));
	document.getElementById("card_image").src = xImageinfo;
}

function cardImageFailure (errorinfo) {
	debugLog("cardImageFailure:" + JSON.stringify(errorinfo));
}

function socialImageAssignment (xImageinfo) {
	debugLog("socialImageAssignment:" + JSON.stringify(xImageinfo));
	document.getElementById("social_image").src = xImageinfo;
}

function socialImageFailure (errorinfo) {
	debugLog("socialImageFailure:" + JSON.stringify(errorinfo));
}

function nextImageAssignment (xImageinfo) {
	debugLog("cardImageAssignment:" + JSON.stringify(xImageinfo));
	document.getElementById("next_button_image").src = xImageinfo;
}

function nextImageFailure (errorinfo) {
	debugLog("cardImageFailure:" + JSON.stringify(errorinfo));
}

function toggleListItem() {
	var mousePosInElement = event.pageX - event.currentTarget.offsetLeft;
	if (mousePosInElement < 20) {
		if (event.currentTarget.classList.contains('expanded')) {
			event.currentTarget.classList.remove('expanded')
			event.currentTarget.classList.add('collapsed')
		} else {
			event.currentTarget.classList.remove('collapsed')
			event.currentTarget.classList.add('expanded')
		}
	}
}

function onDeviceReady() {
	// disable the native navigation
	// adobeDPS.Gesture.disableNavigation();

	// get the height so we can set the value in the Center class
	var height = window.height;

	// for testing
	var previousEntity = cq.mobile.context.previousEntity;
	var nextEntity = cq.mobile.context.nextEntity;
	var entity = cq.mobile.context.entity;
	var parent = cq.mobile.context.collection;

	if (parent) {
		// this is the parent collection form the current entity
		getEntityChildren(parent, document.getElementById('listContainer'));
	}

	//	var context = cq.mobile.context;
	document.getElementById("name").innerHTML = entity.metadata.title;

	var author = entity.metadata.author;
	if (author) {
	//	document.getElementById("author").innerHTML = 'by: ' + author;
		document.getElementById("collection").innerHTML = 'by: ' + author;
	}

	if (previousEntity) {
		alert("Previous is true");
		// show the button
		//$("#previous_button").show();
		document.getElementById("previous_button").style.visibility = "visible";
		//previousEntity.getThumbnailImage(100, 100, previousImageAssignment, previousImageFailure);
	} else {
		//$("#previous_button").hide();
		document.getElementById("previous_button").style.visibility = "hidden";
	}

	if (nextEntity) {
		alert("Next is true");
		// show the button
		//$("#next_button").show();
		document.getElementById("next_button").style.visibility = "visible";
		nextEntity.getThumbnailImage(100, 100, nextImageAssignment, nextImageFailure);
	} else {
		//$("#next_button").hide();
		document.getElementById("next_button").style.visibility = "hidden";
	}

	// update the button images
	document.getElementById("previous_button_image").src = 'images/previous.png';
	document.getElementById("next_button_image").src = 'images/next.png';


	// assign the card image
	entity.getThumbnailImage(100, 100, cardImageAssignment, cardImageFailure);

	// assign the social image
	entity.getSocialSharingImage(100, 100, socialImageAssignment, socialImageFailure);

	var articleText = document.getElementById("article_metadata");
	//add class  class='callout'
	if(articleText) {
		articleText.innerHTML = entity.metadata.abstract;
    	articleText.className += articleText.className ? ' callout' : 'callout';
	}

	// change alignment based on department
	var department = entity.metadata.department;
	if ((department == 'Family') || (department == 'Pool'))
	{
		var cardImage = document.getElementById("card_image");
		cardImage.className += cardImage.className  ? ' textwrapright' : 'textwrapright';
	} else {
		var cardImage = document.getElementById("card_image");
		cardImage.className += cardImage.className  ? ' textwrapright' : 'textwrapleft';
	}

	// check about category
	var category = entity.metadata.category;
	if (category == 'PoolDeckColors') {
		var image = document.getElementById("social_image");
		image.className += image.className  ? ' textwrapright' : 'textwrapright';
	} else {
		var image = document.getElementById("social_image");
		image.className += image.className  ? ' textwrapright' : 'textwrapright';
	}

}

function debugLog(details) {
	if (isDebug) {
		document.getElementById("log_info").innerHTML = details + "<br/>" + document.getElementById("log_info").innerHTML;
	}
}

/* ********************************************************

Context

**********************************************************/

function getEntityInfo() {
	var context_type = document.getElementById("context_type");
	var entity_type = document.getElementById("entity_type");
	var entity_metadata = document.getElementById("entity_metadata");
	var entity_rootpath = document.getElementById("entity_rootpath");
	context_type.innerHTML = cq.mobile.context.type;
	entity_type.innerHTML = cq.mobile.context.entity.type;
	entity_metadata.innerHTML = prettyPrintJSON(cq.mobile.context.entity.metadata);
	entity_rootpath.innerHTML = cq.mobile.context.entity.rootPath;
	debugLog(prettyPrintJSON(cq.mobile.context.entity.metadata));
}

function getCardImage() {
    cq.mobile.context.entity.getThumbnailImage(300, 300, imageSuccess,
        imageFailure)
}

function getBackgroundImage() {
    cq.mobile.context.entity.getBackgroundImage(300, 300, imageSuccess,
        imageFailure)
}

function getSocialImage() {
    cq.mobile.context.entity.getSocialSharingImage(300, 300, imageSuccess,
        imageFailure)
}

function getCollectionCardImage() {
    cq.mobile.context.collection.getThumbnailImage(300, 300, imageSuccess,
        imageFailure)
}

function getCollectionBackgroundImage() {
    cq.mobile.context.collection.getBackgroundImage(300, 300, imageSuccess,
        imageFailure)
}

function getCollectionSocialImage() {
    cq.mobile.context.collection.getSocialSharingImage(300, 300,
        imageSuccess, imageFailure)
}

function imageSuccess(xImageinfo) {
    document.getElementById('entity_image').innerHTML = JSON.stringify(
        xImageinfo);
	var img_obj = document.getElementById('entity_image_obj');
	img_obj.src = xImageinfo;
}

function imageFailure(errorInfo) {
    document.getElementById('entity_image').innerHTML = JSON.stringify(
            errorInfo)
}

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

/* ********************************************************

AEM Mobile User

**********************************************************/

function userInfo() {
    document.getElementById("user_isAuthenticated").innerHTML = cq.mobile.user
        .isAuthenticated;
    document.getElementById("user_authToken").innerHTML = cq.mobile.user.authToken;
}

/* ********************************************************

Device

**********************************************************/

function loadDeviceInfo() {
    document.getElementById("device_cordova").innerHTML = cq.mobile.device.cordova;
    document.getElementById("device_platform").innerHTML = cq.mobile.device
        .platform;
    document.getElementById("device_uuid").innerHTML = cq.mobile.device.uuid;
    document.getElementById("device_model").innerHTML = cq.mobile.device.model;
    document.getElementById("device_class").innerHTML = cq.mobile.device.class;
    document.getElementById("device_vendor_id").innerHTML = cq.mobile.device
        .vendorId;
}

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

/* ********************************************************

Geolocation

**********************************************************/

function geolocationInfo() {
    navigator.geolocation.getCurrentPosition(geolocationSuccess,
        geolocationError);
}

function geolocationSuccess(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    document.getElementById("geo_longitude").innerHTML = longitude;
    document.getElementById("geo_latitude").innerHTML = latitude;
    var coords = new google.maps.LatLng(latitude, longitude);
    var mapOptions = {
        zoom: 15,
        center: coords,
        mapTypeControl: true,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("mapContainer"),
        mapOptions);
    var marker = new google.maps.Marker({
        position: coords,
        map: map,
        title: "Your current location!"
    });
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(latitude, longitude);
    var infowindow = new google.maps.InfoWindow();
    geocoder.geocode({
        'latLng': latlng
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                debugLog("Geocode: " + results[1].formatted_address);
                infowindow.setContent(results[1].formatted_address);
                infowindow.open(map, marker);
            }
        } else {
            debugLog("Geocode Fail");
        }
    });
}

function filesystemInfo() {
	document.getElementById("file_app").innerHTML = cordova.file.applicationDirectory;
	document.getElementById("file_storage").innerHTML = cordova.file.applicationStorageDirectory;
	document.getElementById("file_data").innerHTML = cordova.file.dataDirectory;
	document.getElementById("file_cache").innerHTML = cordova.file.cacheDirectory;
	document.getElementById("file_documents").innerHTML = cordova.file.documentsDirectory;
}

function entityInfoDialog(entity) {
	navigator.notification.alert(
		JSON.stringify(entity, undefined, 2),  // message
		function(){},         // callback
		entity.metadata.entityName,            // title
		'X'                  // buttonName
	);
}

function prettyPrintJSON(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'JSONnumber';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'JSONkey';
            } else {
                cls = 'JSONstring';
            }
        } else if (/true|false/.test(match)) {
            cls = 'JSONboolean';
        } else if (/null/.test(match)) {
            cls = 'JSONnull';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
