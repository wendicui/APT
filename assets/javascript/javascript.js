$(document).ready(function(){

    var latitude;
    var longitude;
    var center;
    var map;

    function firstsearch() {
        window.location.href = "search.html";
    }
//mapbox------------------------------------------------------------------------------------------------------------------------------
   function createMap(center){
        mapboxgl.accessToken = 'pk.eyJ1IjoicnVkY2tzOTEiLCJhIjoiY2o4ZHE1YXZtMHQ2NDJ4bW8xbGJzYmZrOCJ9.kGjczis6tYLYQLDnoRt_dg';
        map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v9',
            center: center, // starting position
            zoom: 12 // starting zoom
        });

    // Add zoom and rotation controls to the map.
         map.addControl(new mapboxgl.NavigationControl());
   }

  
   createMap([-72.9808, 40.7648])



    //get gocation of the user input, to center map and generate output for onboard
    function createGeo(){
        var accessToken = "pk.eyJ1Ijoic3BoMW54ZWQiLCJhIjoiY2o4OXI5NXpvMDZ6aTMzbWswaTFkMDNhZSJ9.AiNtXZkRzbZk-8d4PQJLww"
        var location = $("input").val().trim()
        var url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${accessToken}`

        $.ajax({
            url:url,
            method:"get"
        }).done(setGeo)

    }


    function setGeo(data){

            latitude = data.features[0].center[1];
            longitude = data.features[0].center[0];
            map.flyTo({
                center:[longitude, latitude]
            })
            latitude = latitude.toString()
            longitude = longitude.toString()
            drawData()

    }

  

//ONBOARD----------------------------------------------------------------------------------------------------------------------------
    $("#firstsearch").click(firstsearch);

 // create function for click event ,using property snapshot under proerty extended
    function drawData(){
      
        var radius = "20"
        var url = `https://search.onboard-apis.com/propertyapi/v1.0.0/property/snapshot?latitude=${latitude}&longitude=${longitude}&radius=${radius}&propertytype=APARTMENT`
        console.log(url)
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



    $("button").on("click", createGeo)

});



