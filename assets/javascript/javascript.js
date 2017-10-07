$(document).ready(function(){

    var latitude;
    var longitude;
    var center;
    var map;
    var zoom;
    var get;
    var timer

    function firstsearch() {
        window.location.href = "search.html";
    }
//mapbox------------------------------------------------------------------------------------------------------------------------------
   function checkGet(){
        clearTimeout(timer);
        timer = setTimeout(getMapInfo,2000)
        
   }


   function getMapInfo(){
    
        latitude = map.transform.center.lat
        longitude = map.transform.center.lng
        zoom = map.transform.zoom
        console.log(latitude)
        
   }

   function createMap(center){
        mapboxgl.accessToken = 'pk.eyJ1IjoicnVkY2tzOTEiLCJhIjoiY2o4ZHE1YXZtMHQ2NDJ4bW8xbGJzYmZrOCJ9.kGjczis6tYLYQLDnoRt_dg';
        map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v9',
            center: center, // starting position
            zoom: 12 // starting zoom
        });

    // Add zoom and rotation controls to the map.
         //map.addControl(new mapboxgl.NavigationControl());
         zoom = map.transform.zoom;
         map.on("zoom", checkGet)
         map.on("drag", checkGet)
         map.on("pan", checkGet)

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

            drawData()

    };
//Save search addresses onto user local storage

$("#search-box").on("click", function(event) {
    event.preventDefault();
    var userSearch = $("#search-box").val().trim();
    
        localStorage.setItem("search", userSearch);
    
        $("#search-history").html(localStorage.getItem("search"));
    
        });
  


//ONBOARD----------------------------------------------------------------------------------------------------------------------------
    $("#firstsearch").click(firstsearch);

 // create function for click event ,using property snapshot under proerty extended
    function drawData(){
        console.log(longitude);
        console.log(latitude);
        var radius = `${zoom/4}`
        var url = `https://search.onboard-apis.com/propertyapi/v1.0.0/property/snapshot?latitude=${latitude}&longitude=${longitude}&radius=${radius}&propertytype=APARTMENT&orderby=calendardate&PageSize=20`
        console.log(url)
        $.ajax({
            url:url,
            method:"get",
            headers:{
                'apikey': "aca334dc11f0a75eede8b6a5842796ab",
                'accept': 'application/json'
            },

        }).done(function(data){
           console.log(data)
            for (var i = 0; i < 20; i++) {
                latitude = data.property[i].location.latitude;
                longitude = data.property[i].location.longitude;
                var marker = new mapboxgl.Marker()
                            .setLngLat([longitude,latitude])
                            .addTo(map)
            }
        })
    }



    $("button").on("click", createGeo)

});


