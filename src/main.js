import './style.css'
import { TrackballControls } from './TrackballControls';
import { DATA } from './data'
import * as THREE from 'three';
import { addSeconds } from 'date-fns';
import { Globe, createCoordPoint, getPosition, updatePoints, getNumberFamily } from './helper'
import { uniq, groupBy, chain, random } from 'lodash';
// import { Interaction } from 'three.interaction';
import { Interaction } from './three.interaction/index'

const fps = 30;

// You will need GMST for some of the coordinate transforms.
// http://en.wikipedia.org/wiki/Sidereal_time#Definition

const ALL_COUNTRIES = groupBy(DATA.map(x => x.country), x => x);

document.querySelector('#filter_country').innerHTML =
    `<option>ALL</option>` + Object.keys(ALL_COUNTRIES)
    .map(x => `<option value=${x}>${x} (${ALL_COUNTRIES[x].length})</option>`)

const alert = document.querySelector('.alert');
alert.addEventListener('click', ev => {
    alert.classList.add('hidden');
});

let filter = {
    objectType: 'DEBRIS',
    country: 'ALL',
    period: 'ALL',
    size: 'ALL',
};


export function filterData(data, filter = {}) {
    let all = chain(data);

    if (filter.objectType !== 'ALL') {
        all = all.filter(x => x.type === filter.objectType);
    }

    if (filter.country !== 'ALL') {
        all = all.filter(x => x.country === filter.country);
    }

    if (filter && filter.period && filter.period !== 'ALL') {
        let [low, high] = filter.period.split('-');
        low = +low;
        high = +high;
        all = all.filter(x => x.period >= low && x.period < high);
    }

    if (filter.size !== 'ALL') {
        all = all.filter(x => x.size === filter.size);
    }

    return all.map(x => createCoordPoint(x))
        .filter(x => x !== false)
        .filter(x => x.lat && x.lng)
        .value();
}


document.querySelector('#filter_object_type').addEventListener('change', ev => {
    filter.objectType = ev.target.value;
    gData = filterData(DATA, filter);
    updatePoints(Globe, gData);
});

document.querySelector('#filter_country').addEventListener('change', ev => {
    filter.country = ev.target.value;
    gData = filterData(DATA, filter);
    updatePoints(Globe, gData);
});

document.querySelector('#filter_period').addEventListener('change', ev => {
    filter.period = ev.target.value;
    gData = filterData(DATA, filter);
    updatePoints(Globe, gData);
});

document.querySelector('#filter_size').addEventListener('change', ev => {
    filter.size = ev.target.value;
    gData = filterData(DATA, filter);
    updatePoints(Globe, gData);
});



let gData = filterData(DATA, filter);

updatePoints(Globe, gData);

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
camera.position.z = 800;

// new a interaction, then you can add interaction-event with your free style
const interaction = new Interaction(renderer, scene, camera);

// Add camera controls
const tbControls = new TrackballControls(camera, renderer.domElement);
tbControls.minDistance = 101;
tbControls.rotateSpeed = 5;
tbControls.zoomSpeed = 0.8;

scene.on('click', function(ev) {

    console.log(ev);
    var optionConjuctionAssesment = document.querySelector('#option_conjunction').checked;

    if (optionConjuctionAssesment) {
        const alert =
            document.querySelector('.alert');
        alert.classList.remove('hidden');
        alert.innerHTML = `The probability of collision is <div style="font-size: 30px;margin-top:10px">1/10<sup>${random(6, 12)}</sup></div>`
    }
})


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
            d.origin.tle1, d.origin.tle2,
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