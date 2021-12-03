import { degreesLat, degreesLong, eciToGeodetic, gstime, propagate, twoline2satrec } from 'satellite.js';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import { uniq, random } from 'lodash'

export var sizeMap = {
    SMALL: .5,
    MEDIUM: 1,
    LARGE: 2,
};

export var sizeColor = {
    SMALL: 'yellow',
    MEDIUM: 'blue',
    LARGE: 'red',
};

export const Globe = new ThreeGlobe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')

export function createCoordPoint(x) {
    var coord = getPosition(x.tle1, x.tle2, new Date());
    return {
        origin: x,
        lat: coord.lat,
        lng: coord.lng,
        alt: coord.alt * 100 / 6371,
        radius: sizeMap[x.size] * random(0.8, 1.2),
        color: sizeColor[x.size],
    }
}

export function getPosition(tle1, tle2, date) {
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

export function updatePoints(globe, data) {

    document.querySelector('.console1').innerHTML = `<b style="font-size:40px;">${data.length}</b> object rendered now\n\n`;

    document.querySelector('.console1').innerHTML += data.slice(0, 100).map(x =>
        `${x.origin.name}: ${x.lat.toFixed(2)}, ${x.lng.toFixed(2)}`
    ).join('\n')

    return globe.customLayerData(data)
        .customThreeObject((d, globRadius) => {
            var mesh = new THREE.Mesh(
                new THREE.SphereBufferGeometry(d.radius),
                new THREE.MeshLambertMaterial({ color: d.color })
            );

            mesh.on('mouseover', function(ev) {
                document.querySelector('.console2').innerHTML = [
                    `<b style="color: greenyellow;font-size: 30px">${d.origin.name}</b>`,
                    `${d.origin.comment}`,
                    `LAT: ${d.lat.toFixed(3)}`,
                    `LNG: ${d.lng.toFixed(3)}`,
                    `ALT: ${d.alt.toFixed(2)}KM`,
                    `CENTER: ${d.origin.center}`,
                    `LAUNCH DATE: ${d.origin.launch_date}`,
                    `PERIOD: ${d.origin.period} minutes`,
                    `SIZE: <span style="color:${sizeColor[d.origin.size]}">${d.origin.size}</span>`,
                ].join('\n');
            })



            return mesh;
        })
        .customThreeObjectUpdate((obj, d) => {
            Object.assign(obj.position, globe.getCoords(d.lat, d.lng, d.alt / 100));
        });
}

export function getNumberFamily(number) {
    if (number < 11) return 10;
    if (number < 101) return 100;
    if (number < 1001) return 1000;
    if (number < 10001) return 10000;
}