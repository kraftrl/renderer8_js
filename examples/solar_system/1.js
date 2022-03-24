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
   In this version, the planet orbits around the sun at the same rate as the sun
   rotates on its axis. Similarly, the moon orbits around the planet at the same
   rate as the planet rotates on its axis.
<p>
   But the orbit of the planet should be independent of the rotation of the sun,
   and the orbit of the moon should be independent of the rotation of the planet.
<pre>{@code
           Scene
             |
             |
          Position
         /   |     \
        /    |      \
  Matrix   Model    nested Positions
    R      (sun)          |
                          |
                       Position
                      /   |   \
                     /    |    \
               Matrix   Model   nested Positions
                 TR    (planet)      |
                                     |
                                  Position
                                 /   |    \
                                /    |     \
                            Matrix  Model   nested Positions
                              TR   (moon)       |
                                                |
                                              empty
}</pre>
*/

var fps;
var timer = null;

var planetOrbitRadius = 5.0;
var moonOrbitRadius = 1.0;

var planetOrbitRot = 0.0;
var moonOrbitRot = 0.0;

var moonAxisRot = 0.0;

var ecliptic = 7.0; // angle of the ecliptic plane

var sun_p = null;
var planetMoon_p = null;
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

// Create the sun.
scene.addPosition([new Position(new Sphere(1.0, 10, 10))]);
ModelShading.setColor(scene.getPosition(0).model, Color.Yellow);
sun_p = scene.getPosition(0);

// Create the planet.
sun_p.addNestedPosition([new Position(new Sphere(0.5, 10, 10))]);
ModelShading.setColor(sun_p.getNestedPosition(0).model, Color.Blue);
planetMoon_p = sun_p.getNestedPosition(0);

// Create the planet's moon.
planetMoon_p.addNestedPosition([new Position(new Sphere(0.2, 10, 10))]);
ModelShading.setColor(planetMoon_p.getNestedPosition(0).model, Color.Green);
moon_p = planetMoon_p.getNestedPosition(0);

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
	sun_p.matrix2Identity();
	//sun_p.matrix.mult(Matrix.translate(0, 0, -8));
	// Rotate the plane of the ecliptic
	// (rotate the sun's xz-plane about the x-axis).
	sun_p.matrix.mult(Matrix.rotateX(ecliptic));

	// Rotate the sun on it axis.
	sun_p.matrix.mult(Matrix.rotateY(planetOrbitRot));

	// Place the planet-moon away from the sun and rotate the planet-moon on its axis.
	planetMoon_p.matrix2Identity();
	planetMoon_p.matrix.mult(Matrix.translate(planetOrbitRadius, 0, 0));
	planetMoon_p.matrix.mult(Matrix.rotateY(moonOrbitRot));

	// Place the moon away from the planet and rotate the moon on its axis.
	moon_p.matrix2Identity();
	moon_p.matrix.mult(Matrix.translate(moonOrbitRadius, 0, 0));
	moon_p.matrix.mult(Matrix.rotateY(moonAxisRot));

	// Update the parameters for the next frame.
	planetOrbitRot += 1.0;
	moonOrbitRot += 5.0;
	moonAxisRot -= 10.0;
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