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
    SMALL: 'green',
    MEDIUM: 'blue',
    LARGE: 'red',
};

export const Globe = new ThreeGlobe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')

export function createCoordPoint(x) {
    var coord = getPosition(x.TLE_LINE1, x.TLE_LINE2, new Date());
    return {
        origin: x,
        lat: coord.lat,
        lng: coord.lng,
        alt: coord.alt * 100 / 6371,
        radius: sizeMap[x.RCS_SIZE] * random(0.8, 1.2),
        color: sizeColor[x.RCS_SIZE],
    }
}

export
    function getPosition(tle1, tle2, date) {
    const gmst = gstime(date);
    const satrec = twoline2satrec(tle1, tle2);
    const { position } = propagate(satrec, date);
    const gd = eciToGeodetic(position, gmst);

    return {
        lat: degreesLat(gd.latitude),
        lng: degreesLong(gd.longitude),
        alt: gd.height
    };

}

export function updatePoints(globe, data) {
    return globe.customLayerData(data)
        .customThreeObject((d, globRadius) => {
            return new THREE.Mesh(
                new THREE.SphereBufferGeometry(d.radius),
                new THREE.MeshLambertMaterial({ color: d.color })
            )
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