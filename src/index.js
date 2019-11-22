'use strict';
const _ = require('lodash');
const { getCache, setCache } = require('./cachingService');

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBtg-c3At_KWlvkfSo5NahzeYD3_MP9Xnw',
    Promise: Promise
});
const getPolylineHashes = (data) => {
    return data.routes[0].legs[0].steps.map(({ polyline }) => {
        return polyline.points;
    });
}
const getStartAddress = (data) => {
    return data.routes[0].legs[0].start_address;
}
async function getMatchPercentageAPI(startLoc) {
    const locCacheKey = _.camelCase(startLoc);
    const cashedData = await getCache(locCacheKey);
    let data;
    if (cashedData) {
        data = cashedData;
    } else {
        const { json } = await googleMapsClient.directions({
            origin: startLoc,
            destination: 'Airport+Terminal+3+-+Dubai+International+Airport'
        }).asPromise();
        data = json;
        setCache(locCacheKey, data);
    }
    return data;
}
const combinations = (list, iterator) => {
    const length = list.length;
    let iterations = 0;
    for (let i = 0; i < length - 1; i++) {
        for (let j = i + 1; j < length; j++) {
            iterator(list[i], list[j]);
            iterations++;
        }
    }
    return iterations;
}
async function getMatchse() {
    const data = await Promise.all(locations.map(getMatchPercentageAPI));
    const results = [];
    console.log('points =', data.length);
    const iterations = combinations(data, (data1, data2) => {
        const segments1 = getPolylineHashes(data1);
        const segments2 = getPolylineHashes(data2);
        const segments1MissmatchCount = _.difference(segments1, segments2).length
        const segments2MissmatchCount = _.difference(segments2, segments1).length
        const matchCount = _.intersection(segments2, segments1).length;
        results.push({
            point1: getStartAddress(data1),
            point2: getStartAddress(data2),
            segments1MissmatchCount,
            segments2MissmatchCount,
            matchCount
        });
    });
    console.log('combinations =', iterations);
    console.log('+++++++++++++++++++++++++++++++++++')
    console.log(results)
}

getMatchse([
    'DUBAI+GRAND+HOTEL+BY+FORTUNE',
    'FORTUNE+CLASSIC+HOTEL+APARTMENT',
    'Fortune+Plaza+Hotel',
    'Hampton+by+Hilton+Dubai+Airport',
    'Al+Bustan+Center+and+Residence',
    'Boulevard+City+Suites+Al+Nahda2',
    'Emirates+Stars+Hotel+Apartments+Dubai',
    'TIME+Dunes+Hotel+Apartments+Al+Qusais',

    'Garlic+Routes+Restaurant+LLC',
    'Calicut+Saawariya+Restaurant+LLC',
    'Yoko+Sizzlers+al+nahda',

    'Food+Village+Restaurant+al+nahda',
    'Sultan+palace+restaurant+&+cafe+al+nahda',
    'Abad+Plaza+Restaurant+&+Cafeteria+al+nahda'
]);
module.exports = getMatchPercentage;