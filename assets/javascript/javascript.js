$(document).ready(function(){

    var latitude;
    var longitude;
    var center;
    var map;
    var zoom;
    var get;
    var timer;
    var line1
    var line2


    function firstsearch() {
        window.location.href = "search.html";
    }

    $("#firstsearch").click(firstsearch);
//mapbox------------------------------------------------------------------------------------------------------------------------------
   function checkGet(){
        clearTimeout(timer);
        timer = setTimeout(getMapInfo,2000)
        
   }


   function getMapInfo(){
    
        latitude = map.transform.center.lat;
        longitude = map.transform.center.lng;
        zoom = map.transform.zoom;
        console.log(latitude);
        drawData();
        
   }

   function createMap(center){
        mapboxgl.accessToken = 'pk.eyJ1Ijoid2VuZGljdWkiLCJhIjoiY2o4amEzb2VtMTdsbjMybXhnY292c2FmMSJ9.ZxnI5GaeWI4IFEPm1a8wrA';
        map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/light-v9',
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

      
   //change map style


    $(".style").on("click", function(){
       //  var style = map.getStyle()
       // var layers = map.getStyle().layers.[151];
       //  var src = map.getStyle().sources.list
       //  console.log(style)
        map.setStyle('mapbox://stles/mapbox/' + $(this).attr("id") +'-v9')
      //  map.getStyle().layers.[151]= layers
        // map.getStyle().sources.list = src

    })

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

    $(".streetname").on("click", function(event) {
        event.preventDefault();
        var userSearch = $(".streetname").val().trim();
        
            localStorage.setItem("search", userSearch);
        
            $("#search-history").html(localStorage.getItem("search"));
        
            });
  


//ONBOARD----------------------------------------------------------------------------------------------------------------------------
   

 // create function for click event ,using property snapshot under proerty extended
    //create the shell of database
    var geojson = {
        "type":  'FeatureCollection',
        "features":[]
    };


   map.on("load",function(){
//    add image
      map.loadImage('https://images.vexels.com/media/users/3/140527/isolated/preview/449b95d58f554656b159dd3ca21ab123-home-round-icon-by-vexels.png', function(error, image) {
                    if (error) throw error;
                    map.addImage('icon', image);
       })
   
   })

    function loadIcon(){   
        if(map.getLayer("points")){map.removeLayer("points");}
        if(map.getSource('list')){map.removeSource('list')}

                  map.addSource('list',{
                        "type": "geojson",
                        "data": geojson
                    },)

                    map.addLayer({
                        "id": "points",
                        "type": "symbol",
                        "source": 'list',
                        "layout": {
                            "icon-image": "icon",
                            "icon-size": 0.05,

                        }
                    });
    }

    function drawData(){
    
        var radius = `${4 - zoom/4}`
        if (radius < 0){ radius = 0.1};
        //console.log(radius)
        var url = `https://search.onboard-apis.com/propertyapi/v1.0.0/property/snapshot?latitude=${latitude}&longitude=${longitude}&radius=${radius}&propertytype=APARTMENT&orderby=calendardate&PageSize=20`
        //console.log(url)
        $.ajax({
            url:url,
            method:"get",
            headers:{
                'apikey': "aca334dc11f0a75eede8b6a5842796ab",
                'accept': 'application/json'
            },

        }).done(function(data){
            //add marker to map
           console.log(data)
            for (var i = 0; i < data.property.length; i++) {
                latitude = data.property[i].location.latitude;
                longitude = data.property[i].location.longitude;
    //one way to add points to map, yet not clickable    
            // //create pop-up
            //     var popUp = new mapboxgl.Popup()
            //         .setHTML(`<p id = "trial" >Excellent choice!</p>`)

            //     var newDiv = document.createElement('div')
            //     newDiv.className = "click" 
            //     newDiv.dataset.address1 = data.property[i].address.line1;
            //     newDiv.dataset.address2 = data.property[i].address.line2;
            
            //     var marker = new mapboxgl.Marker(newDiv)
            //                 .setLngLat([longitude,latitude])
            //                 .setPopup(popUp)
            //                 .addTo(map)
            // }
    //use layer and geojson to create markers,
            var newFeature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [longitude, latitude]
                    },
                    "properties": {
                        "address1": data.property[i].address.line1,
                        "address2": data.property[i].address.line2,
                        "geo1":longitude,
                        "geo2":latitude
                    }
            }
            geojson['features'].push(newFeature);
            console.log(geojson)
            }
            
            //create layer of markers

            loadIcon(geojson)                  

            
        })
    }


        function detail(){
            console.log("working")
            line1 = encodeURIComponent(line1)
            line2 = encodeURIComponent(line2)
            var url = `https://search.onboard-apis.com/propertyapi/v1.0.0/property/detail?address1=${line1}&address2=${line2}`
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
            })


    }

    
    $("button").on("click", createGeo)
   
    $(".click").on("click", detail)

       map.on('click', function (e) {
            //box for the click area
             var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
             var features = map.queryRenderedFeatures(bbox, {layer: 'points'})
                      
            //map.flyTo({center: features[0].geometry.coordinates});

            line1 = features[0].properties.address1;
            line2 = features[0].properties.address2;
            detail()
            features[0].properties.geo1
             // var popUp = new mapboxgl.Popup()
             //      .setHTML(`Excellent choice!`)
             //      .setLngLat(features[0].properties.geo)
             //      .addTo(map)
              
         });


});


