import Rasterizer from './rasterizer.js'
import Renderer from '../engine/renderer.js';
import {DefaultCube, RGBCube} from '../meshes/cubes.js';
import Mesh from "../engine/mesh.js";



// APP INIT

// sets up a canvas with a pixel size feature
let setupCanvas = function (canvas, width, height, pixelSize) {
    // setup internal size, this effectively zooms the canvas to its style size
    canvas.width = width / pixelSize
    canvas.height = height / pixelSize

    // set how big the canvas is on the website
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
}

// creates a framebuffer with the matching size of the canvas
let createFramebuffer = function (context, width, height) {
    let framebuffer = context.createImageData(width, height)
    console.log(framebuffer)
    return framebuffer
}

// APP RUNTIME
function renderScene(framebuffer) {

    if (error_msg) {
        alert("Not all pixels could be generated. Please check the console for further details.")
    }
}


// APP DEMO

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 400
const CANVAS_PIXELSIZE = 5
let error_msg = false;

// get and customize our canvas 
let canvas = document.getElementById('canvas')
setupCanvas(canvas, CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_PIXELSIZE)

// get our appropiate framebuffer from the context
let context = canvas.getContext('2d')
let framebuffer = createFramebuffer(context, canvas.width, canvas.height)

Rasterizer.setValues(framebuffer, CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_PIXELSIZE);



// Aufgabe 5.1
Renderer.init(Rasterizer);

// Aufgabe 5.2/5.3
const cubePoints = [new DefaultCube(Mesh.POINT)];
Renderer.draw(cubePoints);
//Aufgabe 5.4
const lineCube = [new DefaultCube(Mesh.LINE)];
Renderer.draw(lineCube);
//Aufgabe 5.4
const triangle = [new DefaultCube(Mesh.TRIANGLE)];
Renderer.draw(triangle);
//Aufgabe 5.5
const meshes = [new RGBCube()]
Renderer.draw(meshes);



// render our scene in the framebuffer and show it in the canvas
renderScene(framebuffer)
context.putImageData(framebuffer, 0, 0)





