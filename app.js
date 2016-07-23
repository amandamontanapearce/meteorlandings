  var geoJSON;
  var initialMeteorLandingsCoordinatesLat;
  var initialMeteorLandingsCoordinatesLng;
  var intialCoordinates;
  var localMeteorLandings;
  var localMeteorLandingsName;
  var localMeteorLandingsCoordinates;
  var featureArrayForGeo;
  var coordinateArray;
  $(document).ready(function() {

          var metoerLandings;

          $('#submit').click('#submit', function(event) {
                  event.preventDefault();

                  var re = /[^A-Za-z0-9,]/g;

                  var inputAddress = $('#address').val() + ',+' + $('#city').val() + ',+' + $('#state').val() + ',+' + $('#country').val()

                  inputAddress = inputAddress.replace(re, '+')

                  $.ajax({
                          type: 'GET',
                          url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + inputAddress + '&key=AIzaSyBQj2U5k5ZWjxYQBuYcb0DRJY9-mqjxB1U',
                          success: function(data) {
                              if (data.results[0] === undefined) {
                                  console.log('hey not an address')
                              } else {
                                  intialCoordinates = data.results[0].geometry.location;
                                  initialCoordinates = JSON.stringify(intialCoordinates);

                                  localStorage.setItem('startCoordinates', initialCoordinates);
                              }
                          }
                      }).done(function() {
                          console.log(intialCoordinates);
                          initialMeteorLandingsCoordinatesLat = intialCoordinates.lat;
                          initialMeteorLandingsCoordinatesLng = intialCoordinates.lng;
                          var coordinatesLatUpper = intialCoordinates.lat + 2;
                          var coordinatesLatLower = intialCoordinates.lat - 2;
                          var coordinatesLngUpper = intialCoordinates.lng + 2;
                          var coordinatesLngLower = intialCoordinates.lng - 2;
                          $.ajax({
                                  type: 'GET',
                                  url: 'https://data.nasa.gov/resource/y77d-th95.json',
                                  processData: false,
                                  data: '$where=within_box(geolocation,' + coordinatesLatUpper + ',' + coordinatesLngUpper + ',' + coordinatesLatLower + ',' + coordinatesLngLower + ')',
                                  headers: {
                                      'X-APP-TOKEN': 'hqWcI8bFpAm4j8TI7uyqSzXs0'
                                  },
                                  success: function(data) {
                                          meteorLandings = data;
                                          console.log(meteorLandings);
                                          geoJSON = {
                                              'type': 'FeatureCollection',
                                              'features': []
                                          };
                                          for (var i = 0; i < meteorLandings.length; i++) {
                                              localMeteorLandingsCoordinates = meteorLandings[i].geolocation.coordinates;
                                              localMeteorLandingsName = meteorLandings[i].name;
                                              localMeteorLandings = localMeteorLandingsName + ' coordinates are ' + localMeteorLandingsCoordinates + ' ';
                                              //console.log(localMeteorLandings);
                                              $('.results').append(localMeteorLandings);
                                              google.maps.event.trigger(map, 'resize');
                                              $('#map').height(300);
                                              $('.results').show();

                                              geoJSON.features.push({
                                                      'type': 'Feature',
                                                      'geometry': {
                                                          'type': 'Point',
                                                          'coordinates': localMeteorLandingsCoordinates,
                                                      },
                                                      'properties': {
                                                          'name': localMeteorLandingsName,
                                                      },
                                                  })
                                          }
                                          console.log(typeof(initialMeteorLandingsCoordinatesLat));
                                          map.data.addGeoJson(geoJSON);
                                          toBeCenter = localStorage.getItem('startCoordinates');
                                          toBeCenter = JSON.parse(toBeCenter);
                                          map.setCenter(toBeCenter);

                                      }
                              })
                      })
              })

          $('#clear').click(function() {
              document.getElementById("addressForm").reset();
              $('.results').hide();
              localStorage.clear();
              map.data.forEach(function(feature) {
                  map.data.remove(feature);
              });
          })
      }) 
