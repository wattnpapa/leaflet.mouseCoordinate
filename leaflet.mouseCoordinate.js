/* 
    Author     : Johannes Rudolph
*/
L.Control.mouseCoordinate  = L.Control.extend({
    options: {
        gps: true,
        utm: false,
        utmref: false,
        position: 'bottomright',
        
        _sm_a: 6378137.0,
        _sm_b: 6356752.314,
        _sm_EccSquared: 6.69437999013e-03,
        _UTMScaleFactor: 0.9996
        
    },
    onAdd: function(map){
        this._map = map;
        
        var className = 'leaflet-control-mouseCoordinate';
        var container = this._container = L.DomUtil.create('div',className);
        var options = this.options;
        
        this._gpsPositionContainer = L.DomUtil.create("div","gpsPos",container);
        
        map.on("mousemove", this._update, this);
        //map.whenReady(this._update, this);
        
        return container;
    },
    _update: function(e){
        var lat = Math.round(e.latlng.lat * 100000) / 100000 ;
        var lng = Math.round(e.latlng.lng * 100000) / 100000 ;
        var gps = {lat: lat,lng: lng};
        var content = "<table>";
        if(this.options.gps){
            content += "<tr><td>GPS</td><td>" + lat + "</td><td> " + lng +"</td></tr>";
            var gpsMinuten = this._geo2geodeziminuten(gps);
            content += "<tr><td></td><td style='width: 75px'>"+ gpsMinuten.NS + " " + gpsMinuten.latgrad + "&deg; "+ gpsMinuten.latminuten+"</td><td style='width: 75px'> " + gpsMinuten.WE + " "+ gpsMinuten.lnggrad +"&deg; "+ gpsMinuten.latminuten +"</td></tr>";
            var gpsMinutenSekunden = this._geo2gradminutensekunden(gps);
            content += "<tr><td></td><td>"+ gpsMinutenSekunden.NS + " " + gpsMinutenSekunden.latgrad + "&deg; "+ gpsMinutenSekunden.latminuten + "&prime; "+ gpsMinutenSekunden.latsekunden+"&Prime;</td><td> " + gpsMinutenSekunden.WE + " "+ gpsMinutenSekunden.lnggrad +"&deg; "+ gpsMinutenSekunden.latminuten + "&prime; "+ gpsMinutenSekunden.lngsekunden+"&Prime;</td></tr>";
            
        }
        if(this.options.utm){
            var utm = this._geo2utm(gps);
            content += "<tr><td>UTM</td><td colspan='2'>"+utm.zone+"&nbsp;" +utm.x+"&nbsp;" +utm.y+"</td></tr>"; 
        }
        if(this.options.utmref){
            var utmref = this._utm2mgr(this._geo2utm(gps));
            content += "<tr><td>UTM REF</td><td colspan='2'>"+utmref.zone+"&nbsp;" +utmref.band+"&nbsp;" +utmref.x+"&nbsp;" +utmref.y+"</td></tr>"; 
        }
            
        content += "</table>";
        this._gpsPositionContainer.innerHTML = content;
    },    
    _utm2geo: function utm2geo(utm){
        /* Copyright (c) 2006, HELMUT H. HEIMEIER
         Permission is hereby granted, free of charge, to any person obtaining a
         copy of this software and associated documentation files (the "Software"),
         to deal in the Software without restriction, including without limitation
         the rights to use, copy, modify, merge, publish, distribute, sublicense,
         and/or sell copies of the Software, and to permit persons to whom the
         Software is furnished to do so, subject to the following conditions:
         The above copyright notice and this permission notice shall be included
         in all copies or substantial portions of the Software.*/

        /* Die Funktion wandelt UTM Koordinaten in geographische Koordinaten
         um. UTM Zone, Ostwert ew und Nordwert nw mÃ¼ssen gegeben sein.
         Berechnet werden geographische LÃ¤nge lw und Breite bw im WGS84 Datum.*/
        
        zone = utm.zone;
        ew = utm.x;
        nw = utm.y;
         // LÃ¤ngenzone zone, Ostwert ew und Nordwert nw im WGS84 Datum
        if (zone === "" || ew === "" || nw === ""){
            zone = "";
            ew = "";
            nw = "";
            return;
        }
        band = zone.substr(2,1);
        zone = parseFloat(zone);
        ew = parseFloat(ew);
        nw = parseFloat(nw);

        // WGS84 Datum
        // GroÃŸe Halbachse a und Abplattung f
        a = 6378137.000;
        f = 3.35281068e-3;
        pi = Math.PI;

        // PolkrÃ¼mmungshalbmesser c
        c = a/(1-f);

        // Quadrat der zweiten numerischen ExzentrizitÃ¤t
        ex2 = (2*f-f*f)/((1-f)*(1-f));
        ex4 = ex2*ex2;
        ex6 = ex4*ex2;
        ex8 = ex4*ex4;

        // Koeffizienten zur Berechnung der geographischen Breite aus gegebener
        // MeridianbogenlÃ¤nge
        e0 = c*(pi/180)*(1 - 3*ex2/4 + 45*ex4/64 - 175*ex6/256 + 11025*ex8/16384);
        f2 =   (180/pi)*(    3*ex2/8 - 3*ex4/16  + 213*ex6/2048 -  255*ex8/4096);
        f4 =              (180/pi)*(  21*ex4/256 -  21*ex6/256  +  533*ex8/8192);
        f6 =                           (180/pi)*(  151*ex6/6144 -  453*ex8/12288);

        // Entscheidung Nord-/SÃ¼d Halbkugel
        if (band >= "N"|| band === "")
            m_nw = nw;
        else
            m_nw = nw - 10e6;

        // Geographische Breite bf zur MeridianbogenlÃ¤nge gf = m_nw
        sigma = (m_nw/0.9996)/e0;
        sigmr = sigma*pi/180;
        bf = sigma + f2*Math.sin(2*sigmr) + f4*Math.sin(4*sigmr) + f6*Math.sin(6*sigmr);

        // Breite bf in Radianten
        br = bf * pi/180;
        tan1 = Math.tan(br);
        tan2 = tan1*tan1;
        tan4 = tan2*tan2;

        cos1 = Math.cos(br);
        cos2 = cos1*cos1;

        etasq = ex2*cos2;

        // QuerkrÃ¼mmungshalbmesser nd
        nd = c/Math.sqrt(1 + etasq);
        nd2 = nd*nd;
        nd4 = nd2*nd2;
        nd6 = nd4*nd2;
        nd3 = nd2*nd;
        nd5 = nd4*nd;

        // LÃ¤ngendifferenz dl zum Bezugsmeridian lh
        lh = (zone - 30)*6 - 3;
        dy = (ew-500000)/0.9996;
        dy2 = dy*dy;
        dy4 = dy2*dy2;
        dy3 = dy2*dy;
        dy5 = dy3*dy2;
        dy6 = dy3*dy3;

        b2 = - tan1*(1+etasq)/(2*nd2);
        b4 =   tan1*(5+3*tan2+6*etasq*(1-tan2))/(24*nd4);
        b6 = - tan1*(61+90*tan2+45*tan4)/(720*nd6);

        l1 =   1/(nd*cos1);
        l3 = - (1+2*tan2+etasq)/(6*nd3*cos1);
        l5 =   (5+28*tan2+24*tan4)/(120*nd5*cos1);

        // Geographische Breite bw und LÃ¤nge lw als Funktion von Ostwert ew
        // und Nordwert nw
        bw = bf + (180/pi) * (b2*dy2 + b4*dy4 + b6*dy6);
        lw = lh + (180/pi) * (l1*dy  + l3*dy3 + l5*dy5);

        return {lat: bw, lng: lw};
    },
    _geo2utm: function (gps){
        /* Copyright (c) 2006, HELMUT H. HEIMEIER
         Permission is hereby granted, free of charge, to any person obtaining a
         copy of this software and associated documentation files (the "Software"),
         to deal in the Software without restriction, including without limitation
         the rights to use, copy, modify, merge, publish, distribute, sublicense,
         and/or sell copies of the Software, and to permit persons to whom the
         Software is furnished to do so, subject to the following conditions:
         The above copyright notice and this permission notice shall be included
         in all copies or substantial portions of the Software.*/

        /* Die Funktion wandelt geographische Koordinaten in UTM Koordinaten
         um. Geographische LÃ¤nge lw und Breite bw mÃ¼ssen im WGS84 Datum
         gegeben sein. Berechnet werden UTM Zone, Ostwert ew und Nordwert nw.*/


        lw = gps.lng;
        bw = gps.lat;
        // Geographische LÃ¤nge lw und Breite bw im WGS84 Datum
        if (lw <= -180 || lw > 180 || bw <= -80 || bw >= 84){
            alert("Werte nicht im Bereich des UTM Systems\n"+
            "-180Â° <= LW < +180Â°, -80Â° < BW < 84Â° N");
            zone = "";
            ew = "";
            nw = "";
            return;
        }
        lw = parseFloat(lw);
        bw = parseFloat(bw);

        // WGS84 Datum
        // GroÃŸe Halbachse a und Abplattung f
        a = 6378137.000;
        f = 3.35281068e-3;
        pi = Math.PI;
        b_sel = 'CDEFGHJKLMNPQRSTUVWXX';

        // PolkrÃ¼mmungshalbmesser c
        c = a/(1-f);

        // Quadrat der zweiten numerischen ExzentrizitÃ¤t
        ex2 = (2*f-f*f)/((1-f)*(1-f));
        ex4 = ex2*ex2;
        ex6 = ex4*ex2;
        ex8 = ex4*ex4;

        // Koeffizienten zur Berechnung der MeridianbogenlÃ¤nge
        e0 = c*(pi/180)*(1 - 3*ex2/4 + 45*ex4/64 - 175*ex6/256 + 11025*ex8/16384);
        e2 = c*( - 3*ex2/8 + 15*ex4/32 - 525*ex6/1024 +  2205*ex8/4096);
        e4 = c*(15*ex4/256 - 105*ex6/1024 + 2205*ex8/16384);
        e6 = c*( - 35*ex6/3072 + 315*ex8/12288);

        // LÃ¤ngenzone lz und Breitenzone (Band) bz
        lzn = parseInt((lw+180)/6) + 1;
        lz = lzn;
        if (lzn < 10) 
            lz = "0" + lzn;
        bd = parseInt(1 + (bw + 80)/8);
        bz = b_sel.substr(bd-1,1);

        // Geographische Breite in Radianten br
        br = bw * pi/180;

        tan1 = Math.tan(br);
        tan2 = tan1*tan1;
        tan4 = tan2*tan2;

        cos1 = Math.cos(br);
        cos2 = cos1*cos1;
        cos4 = cos2*cos2;
        cos3 = cos2*cos1;
        cos5 = cos4*cos1;

        etasq = ex2*cos2;

        // QuerkrÃ¼mmungshalbmesser nd
        nd = c/Math.sqrt(1 + etasq);

        // MeridianbogenlÃ¤nge g aus gegebener geographischer Breite bw
        g = (e0*bw) + (e2*Math.sin(2*br)) + (e4*Math.sin(4*br)) + (e6*Math.sin(6*br));

        // LÃ¤ngendifferenz dl zum Bezugsmeridian lh
        lh = (lzn - 30)*6 - 3;
        dl = (lw - lh)*pi/180;
        dl2 = dl*dl;
        dl4 = dl2*dl2;
        dl3 = dl2*dl;
        dl5 = dl4*dl;

        // MaÃŸstabsfaktor auf dem Bezugsmeridian bei UTM Koordinaten m = 0.9996
        // Nordwert nw und Ostwert ew als Funktion von geographischer Breite und LÃ¤nge

        if ( bw < 0 ) {
            nw = 10e6 + 0.9996*(g + nd*cos2*tan1*dl2/2 + nd*cos4*tan1*(5-tan2+9*etasq)
            *dl4/24);
        }
        else {
            nw = 0.9996*(g + nd*cos2*tan1*dl2/2 + nd*cos4*tan1*(5-tan2+9*etasq)*dl4/24);
        }
        ew = 0.9996*( nd*cos1*dl + nd*cos3*(1-tan2+etasq)*dl3/6 + nd*cos5 *(5-18*tan2+tan4)*dl5/120) + 500000;

        zone = lz+bz;

        nk = nw - parseInt(nw);
        if (nk < 0.5) 
            nw = "" + parseInt(nw);
        else 
            nw = "" + (parseInt(nw) + 1);

        while (nw.length < 7) {
            nw = "0" + nw;
        }

        nk = ew - parseInt(ew);
        if (nk < 0.5) 
            ew = "0" + parseInt(ew);
        else 
            ew = "0" + parseInt(ew+1);

        return {zone: zone, x: ew, y: nw};
     },

    _utm2mgr: function (utm){
        /* Copyright (c) 2006, HELMUT H. HEIMEIER
         Permission is hereby granted, free of charge, to any person obtaining a
         copy of this software and associated documentation files (the "Software"),
         to deal in the Software without restriction, including without limitation
         the rights to use, copy, modify, merge, publish, distribute, sublicense,
         and/or sell copies of the Software, and to permit persons to whom the
         Software is furnished to do so, subject to the following conditions:
         The above copyright notice and this permission notice shall be included
         in all copies or substantial portions of the Software.*/

        /* Die Funktion wandelt zivile UTM Koordinaten in militÃ¤rische Koordinaten
         um. UTM Zone zone, Ostwert ew und Nordwert nw mÃ¼ssen gegeben sein.
         ZurÃ¼ckgegeben wird das Rasterfeld raster sowie die aus den
         letzten 5 Stellen von Ost- und Nordwert gebildete Koordinatenangabe
         UTMREF.*/
        
        zone = utm.zone;
        ew = utm.x;
        nw = utm.y;
     
        // LÃ¤ngenzone zone, Ostwert ew und Nordwert nw im WGS84 Datum
        z1 = zone.substr(0,2);
        z2 = zone.substr(2,1);
        ew1 = parseInt(ew.substr(0,2));
        nw1 = parseInt(nw.substr(0,2));
        ew2 = ew.substr(2,5);
        nw2 = nw.substr(2,5);

        m_east = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        m_north = 'ABCDEFGHJKLMNPQRSTUV';

        if (z1 < "01" || z1 > "60" || z2 < "C" ||z2 > "X")
            alert(z1 + z2 + " ist keine gültige UTM Zonenangabe");

        i = z1 % 3;
        if (i === 1) 
            m_ce = ew1 - 1;
        if (i === 2) 
            m_ce = ew1 + 7;
        if (i === 0)
            m_ce = ew1 + 15;

        i = z1 % 2;
        
        if (i === 1) 
            m_cn = 0;
        else 
            m_cn = 5;

        i = nw1;
        while (i-20 >= 0)
            i = i-20;
        
        m_cn = m_cn + i;
        if (m_cn > 19) 
            m_cn = m_cn - 20;

        band = m_east.charAt(m_ce) + m_north.charAt(m_cn);
        
        return {zone: zone,band: band, x: ew2, y: nw2};
    },
    _mgr2utm: function (mgr){
        /* Copyright (c) 2006, HELMUT H. HEIMEIER
         Permission is hereby granted, free of charge, to any person obtaining a
         copy of this software and associated documentation files (the "Software"),
         to deal in the Software without restriction, including without limitation
         the rights to use, copy, modify, merge, publish, distribute, sublicense,
         and/or sell copies of the Software, and to permit persons to whom the
         Software is furnished to do so, subject to the following conditions:
         The above copyright notice and this permission notice shall be included
         in all copies or substantial portions of the Software.*/

        /* Die Funktion wandelt militÃ¤rische UTM Koordinaten (MGR oder
         UTMREF) in zivile UTM Koordinaten um.
         UTM Zone zone, raster und utmref mÃ¼ssen gegeben sein.
         In zone muss die aus 2 Ziffern bestehende LÃ¤ngenzone enthaltens ein
         gefolgt von der aus einem Buchstaben bestehenden Bandangabe.
         In raster muss die aus 2 Buchstaben bestehende Kennung fÃ¼r das
         100 km x 100 km Rasterfeld enthalten sein.
         In UTMREF muss der 5 stellige Ostwert stehen gefolgt von einem blank
         und dem 5 stelligen Nordwert.
         Berechnet wird daraus der 7 stellige Ost- und Nordwert im zivilen
         UTM System.*/

        // LÃ¤ngenzone zone, Ostwert ew und Nordwert nw im WGS84 Datum

        m_east_0 = "STUVWXYZ";
        m_east_1 = "ABCDEFGH";
        m_east_2 = "JKLMNPQR";
        m_north_0 = "FGHJKLMNPQRSTUVABCDE";
        m_north_1 = "ABCDEFGHJKLMNPQRSTUV";

        //zone = raster.substr(0,3);
        zone = mgr.zone;
        r_east = mgr.band.substr(0,1);
        r_north = mgr.band.substr(1,1);

        i = parseInt(zone.substr(0,2)) % 3;
        if (i === 0)
           m_ce = m_east_0.indexOf(r_east) + 1;
        if (i === 1)
            m_ce = m_east_1.indexOf(r_east) + 1;
        if (i === 2)
            m_ce = m_east_2.indexOf(r_east) + 1;
        ew = "0" + m_ce + ew2;

        i = parseInt(zone.substr(0,2)) % 2;
        if (i === 0)
           m_cn = m_north_0.indexOf(r_north);
        else
           m_cn = m_north_1.indexOf(r_north);

        band = zone.substr(2,1);
        if (band >= "N"){
            if (band === "Q" && m_cn < 10)
               m_cn = m_cn + 20;
            if (band >= "R")
               m_cn = m_cn + 20;
            if (band === "S" && m_cn < 30)
               m_cn = m_cn + 20;
            if (band >= "T")
               m_cn = m_cn + 20;
            if (band === "U" && m_cn < 50)
               m_cn = m_cn + 20;
        }
        else {
            if (band === "C" && m_cn < 10)
               m_cn = m_cn + 20;
            if (band >= "D")
               m_cn = m_cn + 20;
            if (band === "F" && m_cn < 30)
               m_cn = m_cn + 20;
            if (band >= "G")
               m_cn = m_cn + 20;
            if (band === "H" && m_cn < 50)
               m_cn = m_cn + 20;
            if (band >= "J")
               m_cn = m_cn + 20;
            if (band === "K" && m_cn < 70)
               m_cn = m_cn + 20;
            if (band >= "L")
               m_cn = m_cn + 20;
        }

        if (m_cn.length === 1)
           nw = "0" + m_cn + nw2;
        else
           nw = "" + m_cn + nw2;

        return {zone: zone, x: ew, y: nw};
    },
    _geo2geodeziminuten: function (gps){
        latgrad = parseInt(gps.lat);
        latminuten = Math.round( ((gps.lat - latgrad) * 60) * 10000 ) / 10000;

        lnggrad = parseInt(gps.lng);
        lngminuten = Math.round( ((gps.lng - lnggrad) * 60) * 10000 ) / 10000;

        return this._AddNSEW({latgrad: latgrad, latminuten: latminuten, lnggrad: lnggrad, lngminuten: lngminuten});
    },
    _geo2gradminutensekunden: function (gps){
        latgrad = parseInt(gps.lat);
        latminuten = (gps.lat - latgrad) * 60;
        latsekunden = Math.round(((latminuten - parseInt(latminuten)) * 60) * 100) / 100;
        latminuten = parseInt(latminuten);

        lnggrad = parseInt(gps.lng);
        lngminuten = (gps.lng - lnggrad) * 60;
        lngsekunden = Math.round(((lngminuten - parseInt(lngminuten)) * 60) * 100) /100;
        lngminuten = parseInt(lngminuten);
        
        return this._AddNSEW({latgrad: latgrad, latminuten: latminuten,latsekunden: latsekunden, lnggrad: lnggrad, lngminuten: lngminuten, lngsekunden: lngsekunden});
    },
    _AddNSEW: function (coord){
        coord.NS = "N";
        coord.WE = "E";
        if(coord.latgrad < 0){
            coord.latgrad = coord.latgrad * (-1);
            coord.NS = "S";
        }
        if(coord.lnggrad < 0){
            coord.lnggrad = coord.lnggrad * (-1);
            coord.EW = "W";
        }
        return coord;
    }
});

L.control.mouseCoordinate = function (options) {
    return new L.Control.mouseCoordinate(options);
};
