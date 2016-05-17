$(document).ready(function(){
  var intialCoordinates;
  var metoerLandings;
  var localMeteorLandings;
  var localMeteorLandingsCoordinates;
  var localMeteorLandingsCoordinatesLat;
  var localMeteorLandingsCoordinatesLng;
  $('#submit').click('#submit', function(event){
    event.preventDefault();

    var re = /[^A-Za-z0-9,]/g;

    var inputAddress = $('#address').val() + ',+' + $('#city').val() + ',+' + $('#state').val() + ',+' + $('#country').val()

    inputAddress = inputAddress.replace(re, '+')

    $.ajax({
      type:'GET',
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + inputAddress + '&key=AIzaSyBd8Ye4J4fuAcSAIU5tkzlOSiU9WujlnL8',
      success: function(data){
        if (data.results[0] === undefined){
          console.log('hey not an address')
        } else {
        intialCoordinates = data.results[0].geometry.location;
        }
      }
    }).done( function(){
      console.log(intialCoordinates);
      var coordinatesLatUpper = intialCoordinates.lat + 2;
      var coordinatesLatLower = intialCoordinates.lat -2;
      var coordinatesLngUpper = intialCoordinates.lng + 2;
      var coordinatesLngLower = intialCoordinates.lng -2;
      $.ajax({
        type:'GET',
        url: 'https://data.nasa.gov/resource/y77d-th95.json',
        processData: false,
        data:
          '$where=within_box(geolocation,' + coordinatesLatUpper + ',' + coordinatesLngUpper + ',' + coordinatesLatLower + ',' + coordinatesLngLower + ')'
        ,
        headers: {
          'X-APP-TOKEN' :'hqWcI8bFpAm4j8TI7uyqSzXs0'
        },
        success: function(data){
          meteorLandings= data;
          console.log(meteorLandings);
          for (var i = 0; i < meteorLandings.length; i++) {
            localMeteorLandings = meteorLandings[i].name + ' coordinates are ' + meteorLandings[i].geolocation.coordinates + ' ';
            console.log(localMeteorLandings);
            localMeteorLandingsCoordinates = meteorLandings[i].geolocation.coordinates;
            localMeteorLandingsCoordinatesLat = meteorLandings[i].geolocation.coordinates[0];
            localMeteorLandingsCoordinatesLng = meteorLandings[i].geolocation.coordinates[1];
            $('.results').append(localMeteorLandings);
            // $.ajax({
            //   type: 'GET',
            //   url: https:'//maps.googleapis.com/maps/api/geocode/json?latlng=' + localMeteorLandingsCoordinates + '&key=AIzaSyBd8Ye4J4fuAcSAIU5tkzlOSiU9WujlnL8',
            //   success: function(data){
            //
            //   }
            // })
          }
        }
      })










    });
  })
})
