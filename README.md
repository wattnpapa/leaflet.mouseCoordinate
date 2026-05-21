# leaflet.mouseCoordinate

[![GitHub version](https://badge.fury.io/gh/PowerPan%2Fleaflet.mouseCoordinate.svg)](http://badge.fury.io/gh/PowerPan%2Fleaflet.mouseCoordinate)
[![Build Status](https://github.com/PowerPan/leaflet.mouseCoordinate/actions/workflows/ci.yml/badge.svg)](https://github.com/PowerPan/leaflet.mouseCoordinate/actions)

A Leaflet control that displays the current mouse position in multiple coordinate systems.

**[→ Live Demo](https://powerpan.github.io/leaflet.mouseCoordinate/)**

## Installation

**npm**
```
npm install leaflet.mousecoordinate
```

**Manual**  
Download and include `dist/leaflet.mousecoordinate.js` and `dist/leaflet.mousecoordinate.css` in your project.

## Usage

```js
L.control.mouseCoordinate({ utm: true, utmref: true }).addTo(map);
```

## Options

| Option   | Type    | Default       | Description |
|----------|---------|---------------|-------------|
| gps      | Boolean | true          | Show GPS coordinates (decimal degrees) |
| gpsLong  | Boolean | true          | Show GPS in three formats: dd.ddddd / dd mm.mmm / dd mm ss.s |
| utm      | Boolean | false         | Show [UTM](https://en.wikipedia.org/wiki/Universal_Transverse_Mercator_coordinate_system) coordinates |
| utmref   | Boolean | false         | Show [UTMREF / MGRS](https://en.wikipedia.org/wiki/Military_grid_reference_system) coordinates |
| qth      | Boolean | false         | Show [QTH / Maidenhead](https://en.wikipedia.org/wiki/Maidenhead_Locator_System) locator |
| nac      | Boolean | false         | Show [Natural Area Code](https://en.wikipedia.org/wiki/Natural_Area_Code) |
| position | String  | 'bottomright' | Leaflet [control position](https://leafletjs.com/reference.html#control-positions) |

## Custom Styling

The control adds CSS classes to its container based on which options are enabled (e.g. `.gps`, `.gpsLong`, `.utm`, `.utmref`, `.qth`, `.nac`). Each row in the coordinate table also carries a class like `.gps-coordinates`, `.utm-coordinates`, etc., making it easy to target individual rows via CSS.

## Development

```bash
npm install
npx grunt          # lint, build, minify, generate docs
npx grunt check    # lint only (ESLint + CSSLint)
npm run docs       # regenerate doc/ only
```
