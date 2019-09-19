class Gmap {
    constructor (elemId, coord) {
        this._lineCoordinatesArray = [];
        this._map = null;
        this._mapMarker = null;
        this._initMap(elemId, coord);
    }

    _initMap(elemId, coord) {
        const {lintang, bujur} = coord;

        // wait for google to be loaded perfectly
        while (!google) {}

        // Make map
        this._map = new google.maps.Map(document.getElementById(elemId), {
            zoom: 17,
            center: {
                lat: lintang,
                lng : bujur,
                alt : 0
            }
        });

        //make marker
        this._mapMarker = new google.maps.Marker({
            position: {
                lat: lintang,
                lng: bujur
            },
            icon: {
                url: "../icon/icon-drone-micro-red.png",
                anchor: new google.maps.Point(24, 24)
            },
            map: this._map
        });

        this._mapMarker.setMap(this._map);
    }

    update (coord) {
        const {lintang, bujur} = coord;
        this._map.setCenter({lat: lintang, lng : bujur, alt: 0}); // biar map ketengah
        this._mapMarker.setPosition({lat: lintang, lng : bujur, alt: 0}); // biar marker map ketengah

        this._pushCoordToArray(coord); //masukin nilai lintan dan bujur ke array coordinates

        const lineCoordinatesPath = new google.maps.Polyline({
            path: this._lineCoordinatesArray,
            geodesic: true,
            strokeColor: '#ffeb3b',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        lineCoordinatesPath.setMap(this._map);
    }

    _pushCoordToArray(coord) {
        const {lintang, bujur} = coord;
        if (this._lineCoordinatesArray.length > 20)
            this._lineCoordinatesArray.shift();
        this._lineCoordinatesArray.push(new google.maps.LatLng(lintang, bujur));
    }
}

const labAPTRG = {
	lintang: -6.976508,
	bujur: 107.630290
}
const Bandung = {
	lintang 	: -6.9147439 , //Bandung
	bujur 		: 107.609809875, //Bandung
}

const coord = { lintang: labAPTRG.lintang, bujur: labAPTRG.bujur };
let map = null;

function initMap() {
    map = new Gmap('map', coord); //pass by ref {coord}
}
