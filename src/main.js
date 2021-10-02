import './style.css'
import { TrackballControls } from './TrackballControls';
import { data as DATA } from './data'
import * as THREE from 'three';
import { addSeconds } from 'date-fns';
import { Globe, createCoordPoint, getPosition, updatePoints, getNumberFamily } from './helper'
import { uniq, groupBy, chain } from 'lodash';
// import { Interaction } from 'three.interaction';
import { Interaction } from './three.interaction/index'

const fps = 30;

// You will need GMST for some of the coordinate transforms.
// http://en.wikipedia.org/wiki/Sidereal_time#Definition

// OBJECT_TYPE: PAYLOAD, DEBRIS, ROCKET BODY, TBA
// COUNTRY: US, PRC, JPN, NETH, POL, CIS, TBD, CA, SVN, UK, ARGN, FR, IT, FIN, GER, NZ, IND, UAE, LUXE, SPN, SWTZ, INDO, LTU, EUTE, ISRA, AC, BELA, TURK, DEN, SING, SES, ROC, NKOR, SKOR, KAZ, IM, ITSO, EGYP, SEAL, CHBZ, SAFR, ESA, STCT, AB, BRAZ, AUS, ALG, NOR, EUME, ECU, ISS
// LAUNCH_DATE
// console.log(uniq(data.map(x => x.)).join(', '));

const ALL_COUNTRIES = groupBy(DATA.map(x => x.COUNTRY_CODE), x => x);

document.querySelector('#filter_country').innerHTML =
  `<option>ALL</option>` + Object.keys(ALL_COUNTRIES)
    .map(x => `<option value=${x}>${x} (${ALL_COUNTRIES[x].length})</option>`)





let filter = {
  objectType: 'ALL',
  countryCode: 'ALL',
  period: 'ALL',
};


export function filterData(data, filter) {
  let all = chain(data);

  console.log(filter);


  if (filter.objectType !== 'ALL') {
    all = all.filter(x => x.OBJECT_TYPE === filter.objectType);
  }

  if (filter.countryCode !== 'ALL') {
    all = all.filter(x => x.COUNTRY_CODE === filter.countryCode);
  }

  if (filter.period !== 'ALL') {
    all = all.filter(x => x.PERIOD <= +filter.period);
  }

  return all.value();
}


document.querySelector('#filter_object_type').addEventListener('change', ev => {
  filter.objectType = ev.target.value;
  gData = filterData(DATA, filter).map(x => createCoordPoint(x));
  console.log(gData);
  updatePoints(Globe, gData);
});

document.querySelector('#filter_country').addEventListener('change', ev => {
  filter.countryCode = ev.target.value;
  gData = filterData(DATA, filter).map(x => createCoordPoint(x));;
  updatePoints(Globe, gData);
});

document.querySelector('#filter_period').addEventListener('change', ev => {
  filter.period = ev.target.value;
  gData = filterData(DATA, filter).map(x => createCoordPoint(x));;
  updatePoints(Globe, gData);
});



let gData = DATA.map(x => createCoordPoint(x));
updatePoints(Globe, gData);

document.querySelector('.console').innerHTML = gData.slice(0, 100).map(x =>
  `${x.origin.OBJECT_NAME}: ${x.lat.toFixed(2)}, ${x.lng.toFixed(2)}`
).join('\n')

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

// new a interaction, then you can add interaction-event with your free style
const interaction = new Interaction(renderer, scene, camera);

// Add camera controls
const tbControls = new TrackballControls(camera, renderer.domElement);
tbControls.minDistance = 101;
tbControls.rotateSpeed = 5;
tbControls.zoomSpeed = 0.8;

const date = new Date();


function moveSpheres() {

  gData.forEach(x => {
    var coord = getPosition(x.origin.TLE_LINE1, x.origin.TLE_LINE2, date);

    x.lat += random(.1, .2) //coord.lat;
    // x.lng += random(.1, .2) //coord.lng;
    x.alt = coord.alt * 100 / 6371;
  })

  Globe.customLayerData(Globe.customLayerData());
}

const start = new Date();
let i = 1;


// Kick-off renderer
function animate() { // IIFE

  i++;
  if (i % 10 === 0) {
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, 1000 / fps);
    return;
  }

  if (i > 100000) {
    i = 0;
  }

  const newTime = addSeconds(start, i);

  gData.forEach(d => {
    const newPosition = getPosition(
      d.origin.TLE_LINE1, d.origin.TLE_LINE2,
      newTime
    );



    d.lat = newPosition.lat // * Math.random()
    d.lng = newPosition.lng // * Math.random()
    d.alt = newPosition.alt * 100 / 6371;
    // d.lng += 0.05 //* Math.random()
  });
  Globe.customLayerData(Globe.customLayerData());
  // Frame cycle
  tbControls.update();
  renderer.render(scene, camera);

  setTimeout(() => {
    requestAnimationFrame(animate);
  }, 1000 / fps);
}

animate();