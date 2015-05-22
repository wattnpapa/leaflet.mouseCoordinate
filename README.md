Installation
====
Add the .js and the .css file to your HTML

Add this to your Javascript Code

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