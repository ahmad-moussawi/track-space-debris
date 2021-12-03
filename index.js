const fs = require('fs');
const { degreesLat, degreesLong, eciToGeodetic, gstime, propagate, twoline2satrec } = require('satellite.js');
const { random } = require('lodash')


const sizeMap = {
    SMALL: .5,
    MEDIUM: 1,
    LARGE: 2,
};

const sizeColor = {
    SMALL: 'yellow',
    MEDIUM: 'blue',
    LARGE: 'red',
};

function getPosition(tle1, tle2, date) {
    const gmst = gstime(date);
    const satrec = twoline2satrec(tle1, tle2);
    const { position } = propagate(satrec, date);

    if (!position) return false;

    const gd = eciToGeodetic(position, gmst);


    return {
        lat: degreesLat(gd.latitude),
        lng: degreesLong(gd.longitude),
        alt: gd.height
    };

}


function createCoordPoint(x) {
    var coord = getPosition(x.TLE_LINE1, x.TLE_LINE2, new Date());

    if (!coord) return false;

    return {
        lat: coord.lat,
        lng: coord.lng,
        alt: coord.alt * 100 / 6371,
        radius: sizeMap[x.RCS_SIZE] * random(0.8, 1.2),
        color: sizeColor[x.RCS_SIZE],
    }
}



let data = JSON.parse(fs.readFileSync('./data/data.json', { encoding: 'utf-8' }));

var result = data.filter(x => x.RCS_SIZE && x.TLE_LINE1).map(x => ({
    id: x.OBJECT_ID,
    name: x.OBJECT_NAME,
    comment: x.COMMENT,
    period: x.PERIOD,
    // originator: x.ORIGINATOR,
    center: x.CENTER_NAME,
    type: x.OBJECT_TYPE,
    size: x.RCS_SIZE,
    country: x.COUNTRY_CODE,
    launch_date: x.LAUNCH_DATE,
    tle1: x.TLE_LINE1,
    tle2: x.TLE_LINE2,
    // coord: createCoordPoint(x),
}));

// fs.writeFileSync('./data/data_10000.compact.json', JSON.stringify(result), { encoding: 'utf-8' });

fs.writeFileSync('./src/data.js', 'export const DATA = ' + JSON.stringify(result), { encoding: 'utf-8' });