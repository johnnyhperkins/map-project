var map;
var markers = [];
var fourSqCID = "3DJQTVJPRQAJGCLCKVFM4AZCT4MMXIT2ITZ54XU1O3MXVNXF";
var fourSqSecret = "0LTLRU4DLZQ1EIL0HHSHF2HPWBCXKPL22CRRH2ZERTC513OX";
var initwindowsize = $(window).width();

function initMap() {
    var styles = [
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e9e9e9"
                },
                {
                    "lightness": 17
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f5f5"
                },
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                },
                {
                    "lightness": 17
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#ffffff"
                },
                {
                    "lightness": 29
                },
                {
                    "weight": 0.2
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                },
                {
                    "lightness": 18
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f5f5"
                },
                {
                    "lightness": 21
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dedede"
                },
                {
                    "lightness": 21
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#ffffff"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "saturation": 36
                },
                {
                    "color": "#333333"
                },
                {
                    "lightness": 40
                }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f2f2f2"
                },
                {
                    "lightness": 19
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#fefefe"
                },
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#fefefe"
                },
                {
                    "lightness": 17
                },
                {
                    "weight": 1.2
                }
            ]
        }
    ];
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 40.718525, lng:-73.955106},
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });

    var defaultIcon = makeMarkerIcon();
  
    var largeInfowindow = new google.maps.InfoWindow();
    
    //recenter on resize. Code from https://codepen.io/hubpork/pen/xriIz
    google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
    });
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        var marker = new google.maps.Marker({
          position: position,
          title: title,
          animation: google.maps.Animation.DROP,
          icon: defaultIcon,
          id: i
        });
        markers.push(marker);
    }
    markers.forEach(function(marker) {
      marker.addListener('click', function() {
        var thisTitle = this.title;
        $('.listings li').each(function(){
          if(thisTitle == $(this).data('title')) {
            $(this).addClass('selected-location');
          } else {
            $(this).removeClass('selected-location');
          }
        });
        populateInfoWindow(this, largeInfowindow);
      });
    }
    
    showListings();
}

var locations = [
{title: "The Craic", location: {lat: 40.718525,lng:-73.955106}},
{title: "Pete's Candy Store", location: {lat: 40.718099,lng:-73.950193}},
{title: "The Woods", location: {lat: 40.713,lng:-73.966283}},
{title: "Night of Joy", location: {lat: 40.7171,lng:-73.949881}},
{title: "Union Pool", location: {lat: 40.714968,lng:-73.951513}},
{title: "Skinny Dennis", location: {lat: 40.716004,lng:-73.962048}},
{title: "St. Mazie Bar", location: {lat: 40.71243,lng:-73.955933}}
];

function showListings() {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

function makeMarkerIcon() {
    var markerImage = new google.maps.MarkerImage(
      'https://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
}

function getTextData(marker) {
  var url = 'https://api.foursquare.com/v2/venues/search';
  url += '?' + $.param({
      'client_id': fourSqCID,
      'client_secret': fourSqSecret,
      'v': "20170818",
      'limit': '1',
      'query' : marker.title,
      'll' : marker.position.lat() + ',' + marker.position.lng()
    });
  
  return $.ajax({
    method: "GET",
    url: url,
    dataType: "json",
    success: function(json) {
      console.log('text data success');      
    }
  })
  .fail(function(){
      console.log('Connection error');
      alert('Failed to connect to the Foursquare Server');
  })
  .done(function(json){
      console.log('text data done');
  });//close JSON request
}

function getFourSquareData(marker,infowindow) {
  $.when(getTextData(marker)).then(function(getTextDataResponse) {
    var json = getTextDataResponse.response.venues[0];
    var photoSrc = '';
    var photourl = 'https://api.foursquare.com/v2/venues/' + json.id + '/photos';
    photourl += '?' + $.param({
        'limit': 1,
        'client_id': fourSqCID,
        'client_secret': fourSqSecret,
        'v': "20170818"
      });
    //make photo api call
    $.ajax({
      method: "GET",
      url: photourl,
      dataType: 'json',
      success: function() {
        photoSrc = true;
        console.log('got photo json');
      }
    })
    .fail(function() {
      photoSrc = false;
      console.log("error getting photo");
    })
    .always(function(photojson) {
      if(photoSrc) {
        photoSrc = photojson.response.photos.items[0].prefix + 'cap300' + photojson.response.photos.items[0].suffix;
      }
      var markerContent = '';
      photoSrc ? markerContent = '<div class="markerwindow">' : markerContent = '<div class="markerwindow no-photo">';
      photoSrc ? markerContent += '<div class="overlay" style="background-image:url('+ photoSrc +')"></div><div class="text">' : '';
      markerContent += '<h3>' + marker.title + '</h3>';
      if(json.hasOwnProperty('location') && json.location.hasOwnProperty('formattedAddress')) {
        var formattedAddress = '';
        json.location.formattedAddress.forEach(function(line) {
          formattedAddress += line + '<br />';
        });
        markerContent += '<p>' + formattedAddress + '</p>';
      }
      if(json.hasOwnProperty('url')) {
        markerContent += '<a href="'+ json.url +'" target="_blank">View website</a>';
      }
      if(json.hasOwnProperty('menu') && json.menu.hasOwnProperty('url')) {
        markerContent += '<br /><a href="'+ json.menu.url +'" target="_blank">View menu</a>';
      }
      photoSrc.length ? markerContent += '</div></div>' : '</div>';
      marker.markerContent = markerContent;
      infowindow.setContent(marker.markerContent);
      infowindow.maxWidth = 300;
      infowindow.open(map, marker);
      console.log("complete");
    });
    
  });//close $.when
}

var controller = new slidebars();
controller.init();
$( '.mobile-menu' ).on( 'click', function ( event ) {
  event.stopPropagation();
  event.preventDefault();

  controller.toggle( 'menu' );
});

if(initwindowsize <= 767) {
  $('.listings-container').appendTo( $('#mobile-menu-container') );
}

$(window).resize(function() {
  var windowresize = $(window).width() + 15;
  if(windowresize < 768) {
    $('.listings-container').appendTo( $('#mobile-menu-container') );
    controller.close();
  } else if(windowresize > 768) {
    $('.listings-container').appendTo( $('.container') );
  }
});

function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;
        map.panTo(marker.getPosition());
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        //check if data has already been pulled from foursquare
        if(marker.hasOwnProperty('markerContent')) { 
          infowindow.setContent(marker.markerContent);
          infowindow.open(map, marker);
        } else {
          getFourSquareData(marker,infowindow);
        }
    }
}

var Listing = function(data) {
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
};

var ViewModel = function() {
    var self = this;
    this.listingList = ko.observableArray([]);
    this.query = ko.observable('');
    locations.forEach(function(location) {
        self.listingList.push( new Listing(location) );
    });
    //inspiration for this function was found here: http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    this.filteredResults = ko.computed(function() {
        if(self.query()) {
            var search = self.query().toLowerCase();
            return ko.utils.arrayFilter(self.listingList(), function (listing, i) {
                // checks if any letter in the search is part of the titles and if so returns the listing
                if(markers[i].title.toLowerCase().indexOf(search) >= 0) {
                    markers[i].setMap(map);
                } else {
                    markers[i].setMap(null);
                }
                return listing.title().toLowerCase().indexOf(search) >= 0;
            });
        } else {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
            return self.listingList();
        }}, this);
    this.selectedListing = function(selectedListing){
        markers.forEach(function(marker) {
            if(marker.title == selectedListing.title()) {
                new google.maps.event.trigger( marker, 'click' );
                marker.setIcon(makeMarkerIcon('FFFF24'));
            } 
        });  
    };
};
ko.applyBindings(new ViewModel)();