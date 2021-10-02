import './style.css'
import * as THREE from 'three';
import { TrackballControls } from './TrackballControls';
import ThreeGlobe from 'three-globe';
import { twoline2satrec, sgp4, propagate, degreesToRadians, gstime, eciToEcf, geodeticToEcf, eciToGeodetic, ecfToLookAngles, dopplerFactor, degreesLong, degreesLat } from 'satellite.js'
import { data } from './data'
import { uniq, random } from 'lodash'


// Sample TLE
var tleLine1 = '1 25544U 98067A   19156.50900463  .00003075  00000-0  59442-4 0  9992',
  tleLine2 = '2 25544  51.6433  59.2583 0008217  16.4489 347.6017 15.51174618173442';

// You will need GMST for some of the coordinate transforms.
// http://en.wikipedia.org/wiki/Sidereal_time#Definition
var gmst = gstime(new Date());

var failed = [], passed = [];

function getPosition(tle1, tle2) {
  const satrec = twoline2satrec(tle1, tle2);
  const { position } = propagate(satrec, new Date());
  const gd = eciToGeodetic(position, gmst);

  return {
    lat: degreesLat(gd.latitude),
    lng: degreesLong(gd.longitude),
    alt: gd.height
  };

}


// {
//   tle1: "1 49131U 21082B   21269.58334491 -.01112494  00000-0 -91120-2 0  9997",
//   tle2: "2 49131  70.0002  91.8811 0007837 309.9221 210.8378 15.72858730  2050",
//   longitude: -0.013581390247896508,
//   latitude: 1.1135211096996576,
//   height: 394.4929419748678
// }


// Gen random data

/*
const gData = [...Array(N).keys()].map(() => {

  var obj = {
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    alt: Math.random() * 0.8 + 0.1,
    radius: Math.random() * 5,
    color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
  };

  var gd = getPosition(tleLine1, tleLine2, true);
  console.log(gd);

  return obj;
});
*/

console.log(uniq(data.map(x => x.RCS_SIZE)));

var sizeMap = {
  SMALL: .5,
  MEDIUM: 1,
  LARGE: .2,
};

const gData = data.filter(x => x.RCS_SIZE !== null).map(x => {

  var coord = getPosition(x.TLE_LINE1, x.TLE_LINE2);
  return {
    origin: x,
    lat: coord.lat,
    lng: coord.lng,
    alt: coord.alt * 100 / 6371,
    radius: sizeMap[x.RCS_SIZE] * random(0.8, 1.2),
    color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
  }

});

document.querySelector('.console').innerHTML = gData.map(x =>
  `${x.origin.OBJECT_NAME}: ${x.lat.toFixed(2)}, ${x.lng.toFixed(2)}`
).join('\n')

console.log(gData);


const Globe = new ThreeGlobe()
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
  .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
  // .pointOfView({ altitude: 3.5 })
  .customLayerData(gData)
  .customThreeObject((d, globRadius) => {
    console.log(globRadius);
    return new THREE.Mesh(
      new THREE.SphereBufferGeometry(d.radius),
      new THREE.MeshLambertMaterial({ color: d.color })
    )
  })
  .customThreeObjectUpdate((obj, d) => {
    Object.assign(obj.position, Globe.getCoords(d.lat, d.lng, d.alt / 100));
  });
// .pointsData(gData)
// .pointAltitude('size')
// .pointColor('color');

// console.log(Globe);

// Setup renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globeViz').appendChild(renderer.domElement);

// Setup scene
const scene = new THREE.Scene();
scene.add(Globe);
scene.add(new THREE.AmbientLight(0xbbbbbb));
scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

// Setup camera
const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
camera.position.z = 500;

// Add camera controls
const tbControls = new TrackballControls(camera, renderer.domElement);
tbControls.minDistance = 101;
tbControls.rotateSpeed = 5;
tbControls.zoomSpeed = 0.8;

// Kick-off renderer
(function animate() { // IIFE

  gData.forEach(d => {
    // d.lat += 0.05 // * Math.random()
    // d.lng += 0.05 //* Math.random()
  });
  Globe.customLayerData(Globe.customLayerData());
  // Frame cycle
  tbControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
})();

console.log(passed, failed);