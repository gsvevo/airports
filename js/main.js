    var hideLabel = function(label){ label.labelObject.style.opacity = 0;};
    var showLabel = function(label){ label.labelObject.style.opacity = 1;};
    var labelEngine = new labelgun.default(hideLabel, showLabel);
    var labels = [];
    var mymap = L.map('map', {
        center: [40, -95],
        zoom: 5, 
        maxZoom: 10,
        minZoom: 3,
        detectRetina: true});
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(mymap);
    var airports = null;
    var colors = chroma.scale(['#007384', '#007384']).mode('hsl').colors(3);
    for (i = 0; i < 2; i++) {
        $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 12px; text-shadow: 0 0 3px #ffffff;} </style>"));
    }
    airports= L.geoJson.ajax("assets/airports.geojson", {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.AIRPT_NAME);
        },
        pointToLayer: function(feature,latlng) {
        if (feature.properties.CNTL_TWR == "Y")
            return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane marker-color-1'})});
        else
            return L.marker(latlng, {icon: L.divIcon({className: 'fab fa-avianex marker-color-2'})})
    }
}).addTo(mymap);
    colors = chroma.scale(['white', 'black']).colors(5);
    function setColor(density) {
        var id = 0;
        if (density > 18) { id = 4; }
        else if (density > 13 && density <= 18) { id = 3; }
        else if (density > 10 && density <= 13) { id = 2; }
        else if (density > 5 &&  density <= 10) { id = 1; }
        else  { id = 0; }
        return colors[id];
    }
    function style(feature) {
        return {
            fillColor: setColor(feature.properties.count),
            fillOpacity: 0.4,
            weight: 2,
            opacity: 1,
            color: '#b4b4b4',
            dashArray: '4'
        };
    }
    var states = null;
    states = L.geoJson.ajax("assets/us-states.geojson", {
        style: style,
        onEachFeature: function (feature, label) {
            label.bindTooltip(feature.properties.name, {className: 'feature-label', permanent:true, direction: 'center'});
            labels.push(label);
        }
    }).addTo(mymap);
    var legend = L.control({position: 'topright'});
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<b># Airports</b><br />';
        div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>19+</p>';
        div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>14-18</p>';
        div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>11-13</p>';
        div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 6-10</p>';
        div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0- 5</p>';
        div.innerHTML += '<hr><b>Airport Type<b><br />';
        div.innerHTML += '<i class="fa fa-plane marker-color-1"></i><p> With Control Tower</p>';
        div.innerHTML += '<i class="fab fa-avianex marker-color-2"></i><p> W/O Control Tower</p>';
        return div;
    };
    legend.addTo(mymap);
    L.control.scale().addTo(mymap);
    function addLabel(layer, id) {
        var label = layer.getTooltip()._source._tooltip._container;
        if (label) {
            var rect = label.getBoundingClientRect();
            var bottomLeft = mymap.containerPointToLatLng([rect.left, rect.bottom]);
            var topRight = mymap.containerPointToLatLng([rect.right, rect.top]);
            var boundingBox = {
                bottomLeft : [bottomLeft.lng, bottomLeft.lat],
                topRight   : [topRight.lng, topRight.lat]
            };
            labelEngine.ingestLabel(
                boundingBox,
                id,
                parseInt(Math.random() * (5 - 1) + 1), 
                label,
                label.innerText,
                false
            );
            if (!layer.added) {
                layer.addTo(mymap);
                layer.added = true;
            }
        }
    }
    mymap.on("zoomend", function(){
        var i = 0;
        states.eachLayer(function(label){
            addLabel(label, ++i);
        });
        labelEngine.update();
    });
    
    var controlSearch = new L.Control.Search({
        layer: airports,
        initial: false,
        hideMarkerOnCollapse: true,
        propertyName: 'AIRPT_NAME'})
        mymap.addControl(controlSearch);