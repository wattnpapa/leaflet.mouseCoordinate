[![GitHub version](https://badge.fury.io/gh/PowerPan%2Fleaflet.mouseCoordinate.svg)](http://badge.fury.io/gh/PowerPan%2Fleaflet.mouseCoordinate) [![Code Climate](https://codeclimate.com/github/PowerPan/leaflet.mouseCoordinate/badges/gpa.svg)](https://codeclimate.com/github/PowerPan/leaflet.mouseCoordinate)

Installation
====
Manuell
---
Download the Source and add it into your Project Folder 

Bower
----
```
bower install --save leaflet.mouseCoordinate
```

Usage
====
```
L.control.mouseCoordinate({utm:true,utmref:true}).addTo(map);
```

Options
====
| Option | Type    | Default | Description |
|--------|---------|---------|-------------|
| gps    | Boolean | true    | Show GPS Coordinates in 3 Forms:  ddd.ddddd / ddd mm.mmm / ddd mm ss.s | 
| utm    | Boolean | false   | Show UTM Coordinates            |
| utmref | Boolean | false   | Show UTMREF/MGRS Coordinates            | 
| position | String | 'bottomright'   | The initial position of the control (one of the map corners). See [control positions](http://leafletjs.com/reference.html#control-positions).     |
