// If you're adding a number of markers, you may want to drop them on the map
//
      // consecutively rather than all at once. This example shows how to use
      // window.setTimeout() to space your markers' animation.

      var neighborhoods = [

        {lat: 42.35226657107633, lng: -71.06815944523866},
        {lat: 42.36726657107633, lng: -71.08935944523866},
        {lat: 42.35926657107633, lng: -71.05835944523866},



      ];

      //neighborhoods = generateRandomPoints({'lat':42.3601, 'lng':-71.0589}, 500, 10);

      console.log(neighborhoods)

      var markers = [];
      var map;

      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: {lat: 42.3601, lng: -71.0589},
         styles:

        [
            {
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {}
        ]         });

      google.maps.event.addListenerOnce(map, 'idle', function(){
    // do something only the first time the map is loaded
            //drop() 
            loaded = true;
      });

  }

let loaded = false; 

var scrollEventHandler = function() {
	if(isScrolledIntoView(document.getElementById('map')) && loaded) {
    //$('.some-text').text('Scolled completely into view');
    drop(); 
    unbindScrollEventHandler();
  } else {
    //$('.some-text').text('Some text');
  }  
}

function unbindScrollEventHandler() {
	$(document).unbind('scroll', scrollEventHandler);
}

$(document).scroll(scrollEventHandler);

function isScrolledIntoView(el) {
    var elemTop = el.getBoundingClientRect().top;
    var elemBottom = el.getBoundingClientRect().bottom;
    //var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    var halfVisible = (elemBottom - (elemBottom - elemTop)/2)  <= window.innerHeight 
    return halfVisible;
}



      function drop() {
        clearMarkers();
        for (var i = 0; i < neighborhoods.length; i++) {
          addMarkerWithTimeout(neighborhoods[i], i * 150+0);
        }
      }

      function addMarkerWithTimeout(position, timeout) {
        window.setTimeout(function() {
          markers.push(new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP
          }));
        }, timeout);
      }

      function clearMarkers() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers = [];
      }



/**
* Generates number of random geolocation points given a center and a radius.
* @param  {Object} center A JS object with lat and lng attributes.
* @param  {number} radius Radius in meters.
* @param {number} count Number of points to generate.
* @return {array} Array of Objects with lat and lng attributes.
*/
function generateRandomPoints(center, radius, count) {
  var points = [];
  for (var i=0; i<count; i++) {
    points.push(generateRandomPoint(center, radius));
  }
  return points;
}


/**
* Generates number of random geolocation points given a center and a radius.
* Reference URL: http://goo.gl/KWcPE.
* @param  {Object} center A JS object with lat and lng attributes.
* @param  {number} radius Radius in meters.
* @return {Object} The generated random points as JS object with lat and lng attributes.
*/
function generateRandomPoint(center, radius) {
  var x0 = center.lng;
  var y0 = center.lat;
  // Convert Radius from meters to degrees.
  var rd = radius/111300;

  var u = Math.random();
  var v = Math.random();

  var w = rd * Math.sqrt(u);
  var t = 2 * Math.PI * v;
  var x = w * Math.cos(t);
  var y = w * Math.sin(t);

  var xp = x/Math.cos(y0);

  // Resulting point.
  return {'lat': y+y0, 'lng': xp+x0};
}

//          center: {lat: 42.3601, lng: -71.0589}

// Usage Example.
// Generates 100 points that is in a 1km radius from the given lat and lng point.
//var randomGeoPoints = generateRandomPoints({'lat':42.3601, 'lng':-71.0589}, 10000, 10);



