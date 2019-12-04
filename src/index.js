'use strict';
const fs = require('fs').promises;
require('dotenv').config()
const _ = require('lodash');
const table = require('text-table');
const { getCache, setCache } = require('./cachingService');

const googleMapsClient = require('@google/maps').createClient({
    key: process.env['GOOGLE_KEY'],
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
const getPathHash = (data) => {
    return data.routes[0].overview_polyline.points;
}
async function getPaths(startLoc) {
    const locCacheKey = _.camelCase(startLoc);
    const cashedData = await getCache(locCacheKey);
    let data;
    if (cashedData) {
        data = cashedData;
    } else {
        // console.log(startLoc);
        try {
            const { json } = await googleMapsClient.directions({
                origin: startLoc,
                destination: 'Airport+Terminal+3+-+Dubai+International+Airport'
            }).asPromise();
            data = json;
            setCache(locCacheKey, data);
        } catch (e) {
            console.log(e);
        }
    }
    data.startLoc = startLoc;
    return data;
}
async function getPlaces(places = 'places') {
    const locCacheKey = _.camelCase(places);
    const cashedData = await getCache(locCacheKey, 'places');
    let data = [];
    if (cashedData) {
        data = cashedData;
    } else {
        try {
            let pagetoken;
            for (let i = 0; i <= 2; i++) {
                const { json } = await googleMapsClient.places({
                    location: [25.292653, 55.365428],
                    radius: 1500,
                    type: 'restaurant',
                    pagetoken,
                }).asPromise();
                pagetoken = json.next_page_token;
                data.push(...json.results);
            }
            await setCache('places', data, places);
        } catch (e) {
            console.log(e);
        }
    }
    return data.map(item => item.place_id);
    // return data.map(item => `place_id:${item.place_id}`);
}
const combinations = (list, iterator) => {
    const length = list.length;
    let iterations = 0;
    for (let i = 0; i < length - 1; i++) {
        for (let j = i + 1; j < length; j++) {
            iterator(list[i], list[j], i, j);
            iterations++;
        }
    }
    return iterations;
}
const getSegmentMaps = (paths) => {
    const hashMap = {};
    paths.map(path => path.routes[0].legs[0].steps).flat().map(item => {
        hashMap[item.polyline.points] = item;
    });
    return hashMap;
}
const getSegmentDistance = (segmentHashes, segmentMaps) => {
    let totalDistance = 0
    try {
        segmentHashes.map(hash => {
            totalDistance += segmentMaps[hash].distance.value;
        });
    } catch (e) {
        console.log(segmentHashes);
    }
    return totalDistance;
}
const getPathDistance = (path) => {
    return path.routes[0].legs[0].distance.value;
}

const percentage = (numerator, denominator, percission = 0) => {
    return _.round(numerator / denominator * 100, percission);
}
const sanitizeName = (input) => {
    return _.map(input, char => {
        const charF = char.charCodeAt(0) <= 127 ? char : '';
        return charF;
    }).join('')
};
async function getMatchse() {
    const locations = await getPlaces();
    const paths = await Promise.all(locations.map(getPaths));
    const results = [];
    const segmentMaps = getSegmentMaps(paths);
    // const segmentMaps = _.keyBy(paths, getPathHash);
    console.log('points =', paths.length);
    const placeMap = _.keyBy(require('./places/places.json'), 'place_id');
    const iterations = combinations(paths, (path1, path2, idx1, idx2) => {
        const path1Segments = getPolylineHashes(path1);
        const path2Segments = getPolylineHashes(path2);
        const path1Delta = _.difference(path1Segments, path2Segments);
        const path2Delta = _.difference(path2Segments, path1Segments);
        const deltaP1 = getSegmentDistance(path1Delta, segmentMaps);
        const deltaP2 = getSegmentDistance(path2Delta, segmentMaps);
        const distanceP1 = getPathDistance(path1);
        const distanceP2 = getPathDistance(path2);
        const match = distanceP1 - deltaP1;
        const delta = deltaP1 + deltaP2;
        results.push({
            // path1: getPathHash(path1),
            // path2: getPathHash(path2),
            // matchedNodes,
            sPoint1: sanitizeName(placeMap[path1.startLoc].name),
            sPoint2: sanitizeName(placeMap[path2.startLoc].name),
            idx1, idx2,
            deltaPercent: percentage(delta, match + delta),
            deltaPercentP1: percentage(deltaP1, distanceP1),
            deltaPercentP2: percentage(deltaP2, distanceP2),
            delta,
            match,
            deltaP1,
            deltaP2,
        });
    });
    console.log('combinations =', iterations);
    console.log('+++++++++++++++++++++++++++++++++++')
    return results;
}

getMatchse().then(routeCombinations => {
    routeCombinations = routeCombinations.filter(({ deltaPercent }) => deltaPercent < 30)
    const sortedData = _.orderBy(routeCombinations, ['deltaPercent', 'delta', 'match']);
    const columns = _.keys(sortedData[0]).map(keyName => keyName.replace('Percent', '%')
        .replace('delta', '\u2207'));
    const rows = sortedData.map(item => _.map(item, (value) => value));

    const tableData = table([columns, ...rows], {
        hsep: ' | ',
        align: ['l', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r']
    });
    console.log(tableData);
    fs.writeFile('./output.PSV', tableData, 'utf-8');
});