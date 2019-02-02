# US airports

### Introduction

This page displays a map of all the airports in the US. The airports show a different icon whether they have or have not a control tower. A choropleth map visually displays a classification based on the number of airports in each State. The basemap is a CartoDB basemap called 'light all'.

### Major Functionalities

- On click each marker displays the airport's name using the popup method bindPopup() 
- Labels for the States have been added using [labelgun.js](https://github.com/Geovation/labelgun)
- Colors have been generated using [chroma.js](https://github.com/gka/chroma.js/). For example the choropleth map was generated using a scale from white to black
- The font family used for both labels and legend is a [Google font](https://fonts.google.com/) called Montserrat
- Icons for the airports are from [font-awesome](https://fontawesome.com/) v.5.0.10
- Some other standard [Leaflet](http://leafletjs.com/) functionalities, such as scale-bar, legend and attribution, have been added as well. 
- A Search function has been added, allowing to search for airports by name, using [leaflet-search.js](https://github.com/stefanocudini/leaflet-search).
- `airports.geojson` contains all the airports in United States and was generated from [here](https://catalog.data.gov/dataset/usgs-small-scale-dataset-airports-of-the-united-states-201207-shapefile)
- `us-states.geojson` is a geojson data file containing all the states boundaries of United States and was acquired from from [Mike Bostock](http://bost.ocks.org/mike).
- This project is released under the [MIT license](https://opensource.org/licenses/MIT).