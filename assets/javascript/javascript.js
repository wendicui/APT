$(document).ready(function(){



    function firstsearch() {
        window.location.href = "search.html";
    } 
  mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtYXJpcm9zZW50aGFsIiwiYSI6ImNqOGRsc204bzBwbnAyd2xibnpqZG4wYmMifQ.rtRd33gsmY5DGiQkkJoj9g';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10'
  });



    $("#firstsearch").click(firstsearch);


});

