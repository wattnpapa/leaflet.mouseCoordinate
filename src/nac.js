/**
 * Created by Johannes Rudolph <johannes.rudolph@gmx.com> on 01.09.2016.
 */

/**
 *
 * @type {{fromLatLng: NAC.fromLatLng, _nac2Letter: NAC._nac2Letter}}
 */
var NAC = {

    /**
     *
     * @param {{lat: number, lng: number}}
     * @returns {string}
     */
    fromLatLng: function(latlng) {

        var lat = latlng.lat;
        var lon = latlng.lng;
        var x = [];
        var y = [];
        var xy = [];
        xy.x = '';
        xy.y = '';
        if (lon >= -180 && lon <= 180) {
            var xlon = (lon + 180) / 360;
            x[0] = parseInt(xlon * 30);
            x[1] = parseInt((xlon * 30 - x[0]) * 30);
            x[2] = parseInt(((xlon * 30 - x[0]) * 30 - x[1]) * 30);
            x[3] = parseInt((((xlon * 30 - x[0]) * 30 - x[1]) * 30 - x[2]) * 30);
            x[4] = parseInt(((((xlon * 30 - x[0]) * 30 - x[1]) * 30 - x[2]) * 30 - x[3]) * 30);
            x[5] = parseInt((((((xlon * 30 - x[0]) * 30 - x[1]) * 30 - x[2]) * 30 - x[3]) * 30 - x[4]) * 30);
        } else {
            x[0] = 0;
        }
        if (lat >= -90 && lat <= 90) {
            var ylat = (lat + 90) / 180;
            y[0] = parseInt(ylat * 30);
            y[1] = parseInt((ylat * 30 - y[0]) * 30);
            y[2] = parseInt(((ylat * 30 - y[0]) * 30 - y[1]) * 30);
            y[3] = parseInt((((ylat * 30 - y[0]) * 30 - y[1]) * 30 - y[2]) * 30);
            y[4] = parseInt(((((ylat * 30 - y[0]) * 30 - y[1]) * 30 - y[2]) * 30 - y[3]) * 30);
            y[5] = parseInt((((((ylat * 30 - y[0]) * 30 - y[1]) * 30 - y[2]) * 30 - y[3]) * 30 - y[4]) * 30);
        } else {
            y[0] = 0;
        }
        for (var i = 0; i < x.length; i++) {
            xy.x += this._nac2Letter(x[i]);
        }
        for (i = 0; i < y.length; i++) {
            xy.y += this._nac2Letter(y[i]);
        }
        return xy;
    },

    /**
     *
     * @param number
     * @returns {string}
     * @private
     */
    _nac2Letter: function(number){
        var nac_letters = "0123456789BCDFGHJKLMNPQRSTVWXZ";
        if(!isNaN(number) && number < 30)
            return nac_letters.substr(number,1);
        else return 0;
    }

};