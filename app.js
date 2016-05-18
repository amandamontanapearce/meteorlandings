  var geoJSON;
$(document).ready(function(){
  var intialCoordinates;
  var metoerLandings;
  var localMeteorLandings;
  var localMeteorLandingsName;
  var localMeteorLandingsCoordinates;
  var localMeteorLandingsCoordinatesLat;
  var localMeteorLandingsCoordinatesLng;

  var featureArrayForGeo;
  var coordinateArray;
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
      //console.log(intialCoordinates);
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
          geoJSON = {
            'type': 'FeatureCollection',
            'features':[]};
          for (var i = 0; i < meteorLandings.length; i++) {
            localMeteorLandingsCoordinates = meteorLandings[i].geolocation.coordinates;
            localMeteorLandingsName = meteorLandings[i].name;
            localMeteorLandingsCoordinatesLat = meteorLandings[i].geolocation.coordinates[0];
            localMeteorLandingsCoordinatesLng = meteorLandings[i].geolocation.coordinates[1];
            localMeteorLandings = localMeteorLandingsName + ' coordinates are ' + localMeteorLandingsCoordinates + ' ';
            //console.log(localMeteorLandings);
            $('.results').append(localMeteorLandings);

            geoJSON.features.push(
            {
              'type':'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates':localMeteorLandingsCoordinates,
              },
              'properties': {
                'name': localMeteorLandingsName,
              },
            }) // features.push closing bracet
          } //forloop closing bracet
          console.log(geoJSON);
          map.data.addGeoJson(geoJSON);
        } //nasa  success ajax request closing bracet
      }) //nasa ajax request closing bracet
    }) //done closing bracet
  }) //submit click closing bracet
}) //ready closing bracet
