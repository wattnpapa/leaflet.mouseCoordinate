# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dev dependencies
grunt                # Full build: lint, concat, uglify, cssmin, jsdoc
grunt check          # JS and CSS lint only (jshint + csslint)
grunt test           # Run QUnit tests
```

The build outputs go to `dist/`: `leaflet.mousecoordinate.js`, `.min.js`, and `.css`.

## Architecture

This is a Leaflet control plugin that displays mouse coordinates on a map in multiple coordinate systems.

**Source files** (`src/`):
- `leaflet.mouseCoordinate.js` — The `L.Control.mouseCoordinate` class. Listens to the Leaflet `mousemove` event and renders an HTML table of coordinates into its container div. Delegates coordinate conversion to the global helper objects below.
- `utm.js` — `UTM` global object with `fromLatLng` / `toLatLng`. Converts WGS84 ↔ UTM (includes special zones for Norway and Svalbard).
- `utmref.js` — `UTMREF` global object. Converts UTM → MGRS/UTMREF grid reference.
- `qth.js` — `QTH` global object. Converts lat/lng → Maidenhead locator.
- `nac.js` — `NAC` global object. Converts lat/lng → Natural Area Code.

The build concatenates all `src/*.js` files into a single `dist/` bundle. The helper globals (`UTM`, `UTMREF`, `QTH`, `NAC`) must be concatenated before `leaflet.mouseCoordinate.js` uses them — the `concat` task handles this via glob order (alphabetical), so file naming matters.

**Control options** (all Boolean, default false unless noted):
`gps` (true), `gpsLong` (true), `utm`, `utmref`, `qth`, `nac`, `position` (string, `'bottomright'`).

The control is a no-op on mobile browsers (returns an empty div from `onAdd`).
