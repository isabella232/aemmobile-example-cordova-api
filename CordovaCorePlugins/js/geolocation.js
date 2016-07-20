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

function geolocationError(error) {
    debugLog(error.message);
}
