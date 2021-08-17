
(function (){
    /* 
        This code refrence from source, such as :

        http://jsfiddle.net/geocodezip/cg9e6gpz/1/
        https://jsfiddle.net/upsidown/8gjt0y6p/
        http://jsfiddle.net/geocodezip/r7fu3a1y/1/

        What custom with me is :

        1. Add Another option in create icon such as size, origin, and anchor
        2. Add Function for add data detail for every location
        3. Add Function for open and close detail area sidecontent-detail

    */

    // Initial State Variabel
    var markers= [];

    /* http://jsfiddle.net/geocodezip/cg9e6gpz/1/ -> (1) */
    var activeIcon = {
        url: 'http://reka.web.id/marker-hovered-01.png',
        size: new google.maps.Size(211,172),
        origin: new google.maps.Point(0, 0),
        anchor:new google.maps.Point(60, 172),
    };

    /* http://jsfiddle.net/geocodezip/cg9e6gpz/1/ -> (1) */
    var normalIcon = {
        url: "http://reka.web.id/marker-unhover.png",
        size: new google.maps.Size(105,67.62),
        origin: new google.maps.Point(0, 0),
        anchor:new google.maps.Point(30, 67.62)
    };


    $.get("https://singapore-data-be.herokuapp.com/", function(locations, status){
        // INITIAL CREATE MAP
        var map = new google.maps.Map(document.getElementById("map"), {
            center: new google.maps.LatLng(locations[0].coord.lat, locations[0].coord.lng),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            zoomControl: true,
        });
            
        var marker, i, contentSide;

        // FUNCTION CLOSE DETAIL CONTENT
        $('#close').click(function() {
            $("[id*='rightMenu']").css("display", "none");
            if(markers.length !== 0){
                markers.map((data) => {
                    data.setIcon(normalIcon);
                })
            }
            $('#menu1').removeClass('active')
        })

        // PLOTING TO MAPS
        for (i = 0; i < locations.length; i++) {

            // ASSIGN DATA
            /* This tag, using example from https://www.w3schools.com/w3css/w3css_sidebar.asp, and then custom add side-content-container, add class img-fluid */
            contentSide = '<div class="w3-sidebar w3-bar-block w3-card w3-animate-right side-content-container" style="display:none;right:0;" id="rightMenu'+ i +'"> <img src="'+ locations[i].header +'" alt="'+ locations[i].name +'" class="img-fluid"> <h3>'+ locations[i].name +'</h3> <p>'+ locations[i].description +'</p> <p><small><i class="fa fa-map-marker" aria-hidden="true"></i> &nbsp;'+locations[i].address +'</small> <br /> <small><i style="color:#92d72e" class="fa fa-globe" aria-hidden="true"></i> &nbsp;&nbsp;'+locations[i].website +'</small></p></div>'
            
            // DATA APPEND
            $(".side-content").append(contentSide);

            // CREATE NEW MARKER
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i].coord.lat, locations[i].coord.lng),
                map: map,
                icon: {
                    url :"http://reka.web.id/marker-unhover.png",
                    size: new google.maps.Size(105,67.62),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(30, 67.62)
                },
                label : {
                    text : locations[i].name,
                    color : "white",
                    fontSize :"13pt"
                }
            });

            // FUNCTION WHEN CLICK MENU MAIN SIDENAV
            $('#menu1').click(function() {
                map.setZoom(17);
                map.setCenter(markers[0].getPosition());
                markers[0].setIcon(activeIcon)
                $('#menu1').addClass('active')
                $("[id*='rightMenu']").css("display", "none");
                $("#rightMenu0").css("display", "block");
            })
            
            // COLLECT ALL MARKER
            markers.push(marker);
            
            // EVENT LISTENER CLICK
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    
                    // SET ALL MARKER
                    for (var j = 0; j < markers.length; j++) {
                        map.setZoom(15);
                        map.setCenter(marker.getPosition());
                    }

                    // CHECK IF MENU 1
                    if(i === 0){
                        $('#menu1').addClass('active')
                    }else{
                        $('#menu1').removeClass('active') 
                    }

                    // SET IF ACTIVE
                    map.setZoom(17);
                    $("[id*='rightMenu']").css("display", "none");
                    $("#rightMenu"+i).css("display", "block");
                    map.setCenter(locations[0].coord.lat, locations[0].coord.lng);
                }
            })(marker, i));
            
            // EVENT MOUSE OVER
            google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
                return function() {
                    for (var j = 0; j < markers.length; j++) {
                        markers[j].setIcon(normalIcon);
                    }

                    this.setIcon(activeIcon)
                }
            })(marker, i));
            
            // EVENT MOUSE OUT
            google.maps.event.addListener(marker, 'mouseout', (function(marker, i) {
                return function() {
                    for (var j = 0; j < markers.length; j++) {
                        
                        markers[j].setIcon(normalIcon);
                    }
                    this.setIcon(activeIcon)
                }
            })(marker, i));

        } 
    });


    
    
})();
    
   

