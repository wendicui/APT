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

 // create function for click event ,using property snapshot under proerty extended
    function drawData(){
        console.log("working")
        var latitude = "39.296864"
        var longitude = "-75.613574"
        var radius = "20"
      

        var url = `https://search.onboard-apis.com/propertyapi/v1.0.0/property/snapshot?latitude=${latitude}&longitude=${longitude}&radius=${radius}&propertytype=APARTMENT`

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



