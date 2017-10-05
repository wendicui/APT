$(document).ready(function(){



    function firstsearch() {
        window.location.href = "search.html";
    }


mapboxgl.accessToken = 'pk.eyJ1IjoicnVkY2tzOTEiLCJhIjoiY2o4ZHE1YXZtMHQ2NDJ4bW8xbGJzYmZrOCJ9.kGjczis6tYLYQLDnoRt_dg';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-74.50, 40], // starting position
    zoom: 9 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());


    $("#firstsearch").click(firstsearch);


 // create function for click event
    function drawData(){
        
        var address1 = "468%20SEQUOIA%20DR"
        var address2 = "SMYRNA%2C%20DE"
        var radius = "20"
        var min
        var max
        
        var url = `https://search.onboard-apis.com/propertyapi/v1.0.0/assessment/snapshot?address1=${address1}&address2=${address2}&radius=${radius}`


        $.ajax({
            url:url,
            method:"get",
            headers:{
                'apikey': "aca334dc11f0a75eede8b6a5842796ab"
            }
        }).done(function(data){
            console.log(data)
        })
}



$("button").on("click", drawData)

});



