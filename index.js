const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./data/data_10000.json', { encoding: 'utf-8' }));

var result = data.filter(x => x.RCS_SIZE && x.TLE_LINE1).map(x => ({
    id: x.OBJECT_ID,
    name: x.OBJECT_NAME,
    comment: x.COMMENT,
    creation_date: x.CREATION_DATE,
    originator: x.ORIGINATOR,
    center: x.CENTER_NAME,
    type: x.OBJECT_TYPE,
    size: x.RCS_SIZE,
    country: x.COUNTRY_CODE,
    launch_date: x.LAUNCH_DATE,
    tle1: x.TLE_LINE1,
    tle2: x.TLE_LINE2,
    originator: x.ORIGINATOR,
}));

fs.writeFileSync('./data/data_10000.compact.json', JSON.stringify(result), { encoding: 'utf-8' });

fs.writeFileSync('./src/data_10000.js', 'export const DATA_10000 = ' + JSON.stringify(result), { encoding: 'utf-8' });