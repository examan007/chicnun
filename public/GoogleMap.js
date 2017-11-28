// Google API
var GoogleAPI = {
    Debug: 0,
    //    ApiKey: 'AIzaSyDwBWZvdWLabelNameBCpIJnbDPvoTOsv2ikZoAjiKA',
    ApiKey: 'AIzaSyCYNJwbqnTY-ud0Q5KKhAhtVDJFpdCW9k8',
    Src: 'https://maps.googleapis.com',
    Path: '/maps/api/js?key=',
    Callback: '&callback=GoogleAPI.initMapWithMarker',
    Options: '&libraries=places',
    Map: null,
    Geocoder: null,
    //    Zipcode: 'L5L2P6',
    Zipcode: 'L9B2J4',
    Position: null,
    LabelName: 'unknown',
    Markers: new Array(),
    Primary: null,
    Zoom: 12,
//    MarkerSelectColor: '#2B65EC',
//    MarkerSelectColor: '#4B85FF',
    MarkerSelectColor: '#42bff4',
    MarkerDefaultColor: 'yellow',
    SelectedMarker: null,
    replacer: function (key, value) {
        return value;
    },
    getPosition: function (latlng) {
        var object = new Object();
        object.lat = parseFloat(latlng.lat);
        object.lng = parseFloat(latlng.lng);
        return (object);
    },
    getMarker: function (latlng) {
        var funcname = 'GoogleAPI.getMarker';
        var index = -1;
        var marker = null;
        if ((index = this.Markers.findIndex( function (marker) {
            try {
                if (
                    this.lat == marker.object.lat
                    &&
                    this.lng == marker.object.lng
                    ) {
                        return (true);
                }
            } catch (e) {
                    console.log(e);
            }
        }, this.getPosition(latlng))) >= 0) {
            marker = this.Markers[index];
        }
        return (marker);
    },
    goldStar: {
        path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
//        path: 'M 25,1 31,18 61,18 35,29 40,46 25,36 10,46 15,29 1,18 19,18 z',
        fillColor: 'yellow',
        fillOpacity: 0.8,
        scale: 0.1,
        strokeColor: 'gold',
        strokeWeight: 1,
    },
    selectMarker: function (marker) {
        function selectMarker(marker, color) {
            marker.icon.fillColor = color;
            marker.setMap(null);
            marker.setMap(GoogleAPI.Map);
        }
        if (GoogleAPI.SelectedMarker != null) {
            selectMarker(GoogleAPI.SelectedMarker, GoogleAPI.MarkerDefaultColor);
        }
        GoogleAPI.SelectedMarker = marker;
        if (marker != null) {
            selectMarker(marker, GoogleAPI.MarkerSelectColor);
            ModalInstance.showEntry(marker.entry, ['name', 'formatted_phone_number', 'formatted_address'])
        } else {
            ModalInstance.modal.style.display = "none";
        }
    },
    createMarker: function (entry, latlng, options) {
        var funcname = 'GoogleAPI.createMarker';
        var label = {
            text: this.LabelName,
            color: '#5B85FF',
            fontFamily: "Arial Black",
            fontSize: "12px",
        }
        var marker = new google.maps.Marker({
            position: latlng,
            //                icon: '/images/unicorn_marker.jpg',
            //                icon: '/images/unicorn-head-horse-with-a-horn.png',
            icon: this.goldStar,
            //            label: 
            options: options,
        });
        marker.object = this.getPosition(latlng);
        marker.entry = entry;
        marker.addListener('mouseover', function () {
            console.log(funcname + '(); mouseover!');
            console.log(funcname + '(); entry=[' + JSON.stringify(this.entry) + ']');
            GoogleAPI.selectMarker(this);
        });
        marker.addListener('click', function () {
            console.log(funcname + '(); click!');
            console.log(funcname + '(); entry=[' + JSON.stringify(this.entry) + ']');
            GoogleAPI.selectMarker(this);
        });
        marker.addListener('mouseout', function () {
            console.log(funcname + '(); mouseout!');
            console.log(funcname + '(); entry=[' + JSON.stringify(this.entry) + ']');
            GoogleAPI.selectMarker(null);
        });
        return (marker);
    },
    manageMarker: function (entry, latlng, primary) {
        var funcname = 'GoogleAPI.manageMarker';
        var marker = null;
        var options = {
            clickable: true,
        }
        if ((marker = this.getMarker(latlng)) != null) {
        } else {
            marker = this.createMarker(entry, latlng, options);
            this.Markers.push(marker);
            if (this.Debug > 2) {
                console.log(funcname + '[' + this.Markers.length + '] ' +
                    JSON.stringify(marker));

            }
        }
        marker.setMap(this.Map);
//        marker.setOptions(options);

        if (primary == true) {
            if (this.Primary != null) {
                this.Primary.setMap(null);
            }
            this.Primary = this.createMarker(entry, latlng, options);
            this.Primary.setMap(this.Map);
            options.zIndex = 10000;
 //           this.Primary.setOptions(options);
            console.log('getZIndex()=[' + this.Primary.getZIndex() + ']');
        }
    },
    getGeocoder: function () {
        if (this.Geocoder == null) {
            this.Geocoder = new google.maps.Geocoder();
        }
        return (this.Geocoder);
    },
    getMap: function (uluru) {
        if (this.Map == null) {
            this.Map = new google.maps.Map(
                document.getElementById('map'), {
                    zoom: this.Zoom,
                    center: uluru,
                    fullscreenControl: true,
                });
                var clickHandler = new ClickEventHandler(this.Map, uluru);
        }
        return (this.Map);
    },
    getLatLng: function(lat, lng) {
        var latlng = {
            lat: lat,
            lng: lng
        };
        return (latlng);
    },
    addMarker: function (lat, lng, entry) {
        if (this.Map == null) {
            return;
        }
        var latlng = this.getLatLng(lat, lng);
        var This = this;
        this.manageMarker(entry, latlng, false);
    },
    codeAddress: function (zipCode) {
        var geocoder = this.getGeocoder();
        var This = this;
        geocoder.geocode( { 'address': zipCode}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                //Got result, center the map and put it out there
                This.Map.setCenter(results[0].geometry.location);
                This.manageMarker(Controller.CurrentEntry, results[0].geometry.location, true);
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    },
    initMapWithAddress: function () {
        var geocoder = this.getGeocoder();
        var This = this;
        geocoder.geocode({ 'address': This.Zipcode }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var uluru = results[0].geometry.location;
                if (This.getMap(uluru) == null) {
                    alert('Cannot get Google map!');
                }
                This.codeAddress(This.Zipcode, map);

            } else {
                alert('Geocode was not successful; reason=[' + status + ']', null);
            }
            Controller.addMarkers();
        });
        return;
    },
    initMapWithPosition: function () {
        this.getMap(this.Position);
        this.Map.setCenter(this.Position);
        this.manageMarker(Controller.CurrentEntry, this.Position, true);
        this.Map.setZoom(this.Zoom);
        Controller.addMarkers();
    },
    initMapWithMarker: function () {
        if (this.Position == null) {
            this.initMapWithAddress();
        } else {
            this.initMapWithPosition();
        }
        var markerCluster = new MarkerClusterer(this.Map, this.Markers,
        {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
            maxZoom: (this.Zoom-4),
        });
    },
    start: function () {
        // 2. Initialize the JavaScript client library.
        gapi.client.init({
            'apiKey': GoogleAPI.ApiKey
        }).then(function() {
            // 3. Initialize and make the API request.
            return gapi.client.request({
//                'path': GoogleAPI.Src + GoogleAPI.Path
                'path': 'https://people.googleapis.com/v1/people/me',
            })
        }).then(function(response) {
            console.log(response.result);
        }, function(reason) {
            console.log('Error: ' + JSON.stringify(reason, GoogleAPI.replacer));
        })
    },
    inject: function (key) {
        this.Zipcode = (key == null) ? this.Zipcode : (typeof (key) === 'undefined') ? this.Zipcode : key;
        if (this.InjectComplete === true) {
            this.initMapWithMarker();
            return;
        }
        this.InjectComplete = true;
        var scriptTag = document.createElement("script");
        scriptTag.setAttribute("async", "async");
        scriptTag.setAttribute("defer", "defer");
        scriptTag.src = this.Src + this.Path + this.ApiKey + this.Callback + this.Options;
        document.head.appendChild(scriptTag);
        console.log('Action: add [' +
            JSON.stringify(scriptTag, Controller.replacer) + ']');
    }
};

/**
 * @constructor
 */
var ClickEventHandler = function(map, origin) {
    this.origin = origin;
    this.map = map;
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(map);
    this.placesService = new google.maps.places.PlacesService(map);
    this.infowindow = new google.maps.InfoWindow;
    this.infowindowContent = document.getElementById('infowindow-content');
    this.infowindow.setContent(this.infowindowContent);

    this.map.addListener('click', this.handleClick.bind(this));
};

ClickEventHandler.prototype.handleClick = function(event) {
    console.log('You clicked on: ' + event.latLng);
    // If the event has a placeId, use it.
    if (event.placeId) {
        console.log('You clicked on place:' + event.placeId);

        // Calling e.stop() on the event prevents the default info window from
        // showing.
        // If you call stop here when there is no placeId you will prevent some
        // other map click event handlers from receiving the event.
        event.stop();
        console.log('event.placeId=[' + event.placeId + ']');
    }
};

