'use strict';
// const latFactor = 111.195; 100KM rad
// const lonFactor = 106.336;
const latFactor = 111.195; // 50KM rad
const lonFactor = 106.336;
const D = 12742; // Diameter of the earth in km
const radRatio = Math.PI / 180;
const toRadian = (deg) => deg * radRatio;
const round = (value, decimals) => {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
module.exports= class Coordinate {
    constructor(lat, lon) {
        this.lat = lat;
        this.lon = lon;
    }

    /**
     * get distance compared to other coordinate
     * @param {Coordinate} coordinate 
     */
    getDistance(coordinate) {
        // Haversine formula https://en.wikipedia.org/wiki/Haversine_formula
        const a = Math.pow(Math.sin(toRadian(coordinate.lat - this.lat) / 2), 2) + (
            Math.pow(Math.sin(toRadian(coordinate.lon - this.lon) / 2), 2) *
            Math.cos(toRadian(this.lat)) * Math.cos(toRadian(coordinate.lat))
        );
        const distance = D * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return round(distance, 3);
    }

    /**
     * get distance compared to other coordinate
     * @param {Coordinate} coordinate 
     */
    getDistance2(coordinate) {
        const distance = Math.sqrt(
            Math.pow((this.lat - coordinate.lat) * latFactor, 2)
            + Math.pow((this.lon - coordinate.lon) * lonFactor, 2)
        );
        return round(distance, 3);
    }
}