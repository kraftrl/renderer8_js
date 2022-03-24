import { Scene } from '../../scene/Scene.js';
import { ModelShading } from '../../scene/ModelShading.js';
import { Matrix } from '../../scene/Matrix.js';
import { Position } from '../../scene/Position.js';
import { Pipeline } from '../../pipeline/Pipeline.js';
import { FrameBuffer } from '../../framebuffer/FrameBuffer.js';
import { Color } from '../../color/Color.js';
import {Sphere} from '../../models/Sphere.js';
import { Rasterize } from "../../pipeline/Rasterize.js";

/**
   Draw an animation of a solar system with a sun, planet, and moon.
<p>
   In this version, the orbit of the planet is independent of the
   rotation of the sun, and the orbit of the moon is independent
   of the rotation of the planet.
<pre>{@code
           Scene
             |
             |
          Position
         /   |     \
        /    |      \
  Matrix   Model    nested Positions
    I     (empty)    /           \
                    /             \
               Position            Position
               /     \             /   |   \
              /       \           /    |    \
         Matrix     Model     Matrix  Model  nested Positions
           R        (sun)       RT   (empty)  /            \
                                             /              \
                                            /                \
                                      Position            Position
                                      /     \              /     \
                                     /       \            /       \
                                 Matrix     Model      Matrix     Model
                                   R       (planet)     RTR      (moon)
}</pre>
*/

var fps;
var timer = null;

var planetOrbitRadius = 5.0;
var moonOrbitRadius = 1.0;

var planetOrbitRot = 0.0;
var moonOrbitRot = 0.0;

var sunAxisRot = 0.0;
var planetAxisRot = 0.0;
var moonAxisRot = 0.0;

var ecliptic = 7.0; // angle of the ecliptic plane

var solarSys_p = null;
var sun_p = null;
var planetMoon_p = null;
var planet_p = null;
var moon_p = null;

/*
    See the above picture of the tree that this code creates.
*/

// Create the Scene object that we shall render
const scene = new Scene(); // A Solar System

const right  = 6;
const left   = -right;
const top    = 6;
const bottom = -top;
const near = 2;
scene.camera.projOrtho(left, right, bottom, top);

// Create the Position that holds the whole solar system.
scene.addPosition([new Position()]);
solarSys_p = scene.getPosition(0);

// Create the sun.
solarSys_p.addNestedPosition([new Position(new Sphere(1.0, 10, 10))]);
ModelShading.setColor(solarSys_p.getNestedPosition(0).model, Color.Yellow);
sun_p = solarSys_p.getNestedPosition(0);

// Create the Position that holds the planet-moon system.
solarSys_p.addNestedPosition([new Position()]);
planetMoon_p = solarSys_p.getNestedPosition(1);

// Create the planet.
planetMoon_p.addNestedPosition([new Position(new Sphere(0.5, 10, 10))]);
ModelShading.setColor(planetMoon_p.getNestedPosition(0).model, Color.Blue);
planet_p = planetMoon_p.getNestedPosition(0);

// Create the moon.
planetMoon_p.addNestedPosition([new Position(new Sphere(0.2, 10, 10))]);
ModelShading.setColor(planetMoon_p.getNestedPosition(1).model, Color.Green);
moon_p = planetMoon_p.getNestedPosition(1);

print_help_message();

fps = 20;
timer = setInterval(function() {
	rotateModels();
	display();
}, 1000/fps);

document.addEventListener('keypress', keyPressed);

function keyPressed(event) {

	const c = event.key;
	if ('h' == c) {
		print_help_message();
	}
	else if ('p' == c) {
		scene.camera.perspective = ! scene.camera.perspective;
		let p = scene.camera.perspective ? "perspective" : "orthographic";
		console.log("Using " + p + " projection");
	}
	else if ('f' == c) {
	   fps -= 1;
	   clearInterval(timer);
	   if (0 >= fps) {
		   fps = 0;
		   clearInterval(timer);    
		} else {
			setFPS();
		}  
		console.log("fps = " + fps);
	}
	else if ('F' == c) {
	   fps += 1;
	   console.log("fps = " + fps);
	   clearInterval(timer);
	   setFPS();
	}
	else if ('e' == c) {
	   ecliptic -= 1;
	   console.log("ecliptic = " + ecliptic);
	}
	else if ('E' == c) {
	   ecliptic += 1;
	   console.log("ecliptic = " + ecliptic);
	}
	else if ('a' == c) {
		Rasterize.doAntialiasing = ! Rasterize.doAntialiasing;
		console.log("Anti-aliasing is turned " + (Rasterize.doAntialiasing ? "On" : "Off"));
	}
	else if ('g' == c) {
		Rasterize.doGamma = ! Rasterize.doGamma;
		console.log("Gamma correction is turned " + (Rasterize.doGamma ? "On" : "Off"));
	}

	// Set up the camera's view volume.
	if (scene.camera.perspective)
	{
	   scene.camera.projPerspective(-1, 1, -1, 1, 1);
	}
	else
	{
	   scene.camera.projOrtho(-6, 6, -6, 6);
	}
}

function setFPS() {
    	timer = setInterval(function() {
        rotateModels();
        display();
    }, 1000/fps);
}

function display(){
	const resizer = document.getElementById("resizer");
	const w = resizer.offsetWidth;
	const h = resizer.offsetHeight;
	const ctx = document.getElementById("pixels").getContext("2d");
	if (ctx == null) {
		console.log("cn.getContext(2d) is null");
		return;
	}
	ctx.canvas.width = w;
	ctx.canvas.height = h;
	const fb = new FrameBuffer(undefined, w, h);
	Pipeline.render(scene, fb.vp);

	ctx.putImageData(new ImageData(fb.pixel_buffer,fb.width, fb.height), fb.vp.vp_ul_x, fb.vp.vp_ul_y);
}

function rotateModels() {
	// Push the solar system away from where the camera is.
	solarSys_p.matrix2Identity();
	solarSys_p.matrix.mult(Matrix.translate(0, 0, -8));
	// Rotate the plane of the ecliptic
	// (rotate the solar system's xz-plane about the x-axis).
	solarSys_p.matrix.mult(Matrix.rotateX(ecliptic));

	// Set the model matrices for the nested positions.
	sun_p.matrix2Identity();
	sun_p.matrix.mult(Matrix.rotateY(sunAxisRot));

	planetMoon_p.matrix2Identity();
	planetMoon_p.matrix.mult(Matrix.rotateY(planetOrbitRot));
	planetMoon_p.matrix.mult(Matrix.translate(planetOrbitRadius, 0, 0));

	planet_p.matrix2Identity();
	planet_p.matrix.mult(Matrix.rotateY(planetAxisRot));

	moon_p.matrix2Identity();
	moon_p.matrix.mult(Matrix.rotateY(moonOrbitRot));
	moon_p.matrix.mult(Matrix.translate(moonOrbitRadius, 0, 0));
	moon_p.matrix.mult(Matrix.rotateY(moonAxisRot));

	// Update the parameters for the next frame.
	sunAxisRot -= 10.0;
	planetOrbitRot += 1.0;
	planetAxisRot -= 5.0;
	moonOrbitRot += 5.0;
	moonAxisRot += 10.0;
}

function print_help_message()
{
	console.log("Use the 'd' key to toggle debugging information on and off.");
	console.log("Use the 'a' key to toggle antialiasing on and off.");
	console.log("Use the 'g' key to toggle gamma correction on and off.");
	console.log("Use the f/F keys to slow down or speed up the frame rate.");
	console.log("Use the 'p' key to toggle between parallel and orthographic projection.");
	console.log("Use the e/E keys to change the angle of the ecliptic plane.");
	console.log("Use the 'h' key to redisplay this help message.");
}

// window.onresize = display;

var resizer = new ResizeObserver(display);
resizer.observe(document.getElementById("resizer"));