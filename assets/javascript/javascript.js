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
  //  var searchBase = [ ]

    if(localStorage.getItem("firstsearch")){
        $("input").val(localStorage.getItem("firstsearch"));
        $("#History").append(localStorage.getItem("firstsearch"))
        createGeo();
    }


    function firstsearch() {
        var firstS= $(".streetname").val().trim();
        localStorage.setItem("firstsearch", firstS)
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

    $(".icon").on("click", function(event) {
        event.preventDefault();

        var userSearch = $(".streetname").val().trim();

       // searchBase.unshift(userSearch)
        
            localStorage.setItem("search", userSearch);

            var newSearch = localStorage.getItem("search")
     
        
            var newSpan = $( "<span > " + newSearch + '</span>')
            console.log(newSearch[0])
            newSpan.addClass("cities")

            $("#History").append(newSpan)   
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

      map.loadImage('https://cdn2.iconfinder.com/data/icons/bullet-points/64/Bulletpoint_Bullet_Listicon_Shape_Bulletfont_Glyph_Typography_Bullet_Point_Customshape_Wingding_Custom_Circle_Selection_Dot_Duble-512.png', function(error, image) {
                    if (error) throw error;
                    map.addImage('sub', image);
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
          // console.log(data)
            for (var i = 0; i < data.property.length; i++) {
                latitude = data.property[i].location.latitude;
                longitude = data.property[i].location.longitude;
    //one way to add points to map,  clickable    
            // //create pop-up
                // var popUp = new mapboxgl.Popup()
                //     .setHTML(`<p id = "trial" >Excellent choice!</p>`)

                // var newDiv = document.createElement('div')
                // newDiv.className = "click" 
                // newDiv.dataset.address1 = data.property[i].address.line1;
                // newDiv.dataset.address2 = data.property[i].address.line2;
            
                // var marker = new mapboxgl.Marker(newDiv)
                //             .setLngLat([longitude,latitude])
                //             .setPopup(popUp)
                //             .addTo(map)
                            
                //             popUp.on("click", function(){console.log("working")})
               
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
         //   console.log(geojson)
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
          //  console.log(url)
            $.ajax({
                url:url,
                method:"get",
                headers:{
                    'apikey': "aca334dc11f0a75eede8b6a5842796ab",
                    'accept': 'application/json'
                },

            }).done(function(data){
              //  console.log(data)
                var info = data.property[0]
                $(".searchbox").html(`Excellent Choice!<br>
                    You have chosed the apartment at:<br>
                    ${info.address.line1}<br>
                    ${info.address.line2}<br>
                    You will have  ${info.building.summary.unitsCount} neighbors in the building<br>


                    `)



            })


    }

    
    $(".icon").on("click", createGeo)
  

       map.on('click', function (e) {
            //box for the click area
             var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
             var features = map.queryRenderedFeatures(bbox, {layer: ['points', 'subway']})
                      
            //map.flyTo({center: features[0].geometry.coordinates});
            console.log(features)
            line1 = features[0].properties.address1;
            line2 = features[0].properties.address2;
            detail()
            features[0].properties.geo1
            loadSub()

            // var featureSub = map.queryRenderedFeatures(bbox, {layer: 'subway'})

            
            // console.log(featureSub[0].geometry.coordinates)
            if(features[0].properties.line){
                new mapboxgl.Popup()
                .setLngLat(features[0].geometry.coordinates)
                .setHTML('Subway: ' + features[0].properties.line)
                .addTo(map) 
            }
              
         });

       function loadSub(){

          
            if(map.getLayer("subway")){map.removeLayer("subway");}
            if(map.getSource('subStation')){map.removeSource('subStation')}

                      map.addSource('subStation',{
                            "type": "geojson",
                            "data": subway
                        },)

                        map.addLayer({
                            "id": "subway",
                            "type": "symbol",
                            "source": 'subStation',
                            "layout": {
                                "icon-image": "sub",
                                "icon-size": 0.05,

                            }
                        });
        
       }




});


