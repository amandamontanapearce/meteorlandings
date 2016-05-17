$(document).ready(function(){
  var coordinates
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
        coordinates = data.results[0].geometry.location;
        }
      }
    }).done( function(){
      console.log(coordinates);
      










    });
  })
})
