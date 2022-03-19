import { Scene } from './scene/Scene.js';
import { ModelShading } from './scene/ModelShading.js';
import { Matrix } from './scene/Matrix.js';
import { Position } from './scene/Position.js';
import { OrthographicNormalizeMatrix } from './scene/OrthographicNormalizeMatrix.js';
import { PerspectiveNormalizeMatrix } from './scene/PerspectiveNormalizeMatrix.js';
import { ObjSimpleModel } from './models/ObjSimpleModel.js';
import { GRSModel } from './models/GRSModel.js';
import { Cube2 } from './models/Cube2.js';
import { Pyramid } from './models/Pyramid.js';
import { Axes2D } from './models/Axes2D.js';
import { Circle } from './models/Circle.js';
import { CylinderSector } from './models/CylinderSector.js';
import { Pipeline } from './pipeline/Pipeline.js';
import { FrameBuffer } from './framebuffer/FrameBuffer.js';
import { Color } from './color/Color.js';

// Used for transformations.
var xTranslation = 0.0;
var yTranslation = 0.0;
var zTranslation = 0.0;
var xRotation = 0.0;
var yRotation = 0.0;
var zRotation = 0.0;
var scale = 1.0;

const scene = new Scene();

//scene.camera.projPerspectiveReset();
// console.log(scene.camera.normalizeMatrix);
const right  = 2;
const left   = -right;
const top    = 2;
const bottom = -top;
const near = 2;
scene.camera.projPerspective(left, right, bottom, top, near);

// scene.addPosition( [new Position(new   Cube())] );
// scene.addPosition( [new Position(Model.loadFromJSON("models/Cube.json"))])
// scene.addPosition( [new Position(new Ring(1.0, 0.33, 1, 3))]);
scene.addPosition( [new Position(new Pyramid(2.0, 1.0, 15, 4, false))]);
scene.addPosition( [new Position(new Pyramid())]);
scene.addPosition( [new Position(new ObjSimpleModel("assets/cessna.obj"))]);
scene.addPosition( [new Position(new GRSModel("assets/grs/bronto.grs"))]);
scene.addPosition( [new Position(new Cube2())] );
scene.addPosition( [new Position(new Circle())] );
scene.addPosition( [new Position(new CylinderSector())] );

for (var p of scene.positionList) {
    // console.log(p);
	ModelShading.setColor(p.model, Color.Blue);
	p.model.visible = false;
}

const axes = new Axes2D(-2, +2, -2, +2, 0, 8, 8);
ModelShading.setColor(axes, Color.Red);
const axes_p = new Position(axes);
scene.addPosition([axes_p]);

// push models back from camera
for (var p of scene.positionList) {
	p.matrix = Matrix.translate(0, 0, -near);
}

// currentModel will cycle through all but
// the last model, the axes
var currentPosition = 0;
scene.positionList[currentPosition].model.visible = true;

// console.log(scene);
print_help_message();

display();

document.addEventListener('keypress', keyPressed);

function keyPressed(event) {
	//console.log(event.code);
	//console.log(event.key);
	//console.log(event.keyCode);
	//console.log(event.charCode);
	const c = event.key;
	if ('h' == c) {
		print_help_message();
	}
	else if ('d' == c) {
		ctx.imageSmoothingEnabled = !ctx.imageSmoothingEnabled;
	}
	else if ('p' == c) {
		scene.camera.perspective = ! scene.camera.perspective;
		let p = scene.camera.perspective ? "perspective" : "orthographic";
		console.log("Using " + p + " projection");
	}
	else if ('s' == c) {
		scale /= 1.1; 
	}
	else if ('S' == c) {
		scale *= 1.1;
	}
	else if ('x' == c) {
		xTranslation += -0.1;
	}
	else if ('y' == c) {
		yTranslation += -0.1;
	}
	else if ('z' == c) {
		zTranslation += -0.1;
	}
	else if ('X' == c) {
		xTranslation += 0.1;
	}
	else if ('Y' == c) {
		yTranslation += 0.1;
	}
	else if ('Z' == c) {
		zTranslation += 0.1;
	}
	else if ('c' == c) {
		ModelShading.setRandomColor( scene.positionList[currentPosition].model );
	}
	else if ('C' == c) {
		ModelShading.setRandomVertexColors(scene.positionList[currentPosition].model );
	}
	else if ('e' == c) {
		ModelShading.setRandomLineSegmentColors(scene.positionList[currentPosition].model );
	}
	else if ('E' == c) {
		ModelShading.setRainbowLineSegmentColors(scene.positionList[currentPosition].model );
	}
	else if ('/' == c) {
		scene.positionList[currentPosition].model.visible = false;
		currentPosition = (currentPosition + 1) % (scene.positionList.length - 1);
		scene.positionList[currentPosition].model.visible = true;
	}
	else if ('1' == c) {
		// Shift camera right
		scene.camera.left += 0.1;
		scene.camera.right += 0.1;
		updateNormalizeMatrix(scene.camera);
	}
	else if ('2' == c) {
		// Shift camera left
		scene.camera.left -= 0.1;
		scene.camera.right -= 0.1;
		updateNormalizeMatrix(scene.camera);
	}
	else if ('3' == c) {
		// Shift camera up
		scene.camera.top += 0.1;
		scene.camera.bottom += 0.1;
		updateNormalizeMatrix(scene.camera);
	}
	else if ('4' == c) {
		// Shift camera down
		scene.camera.top -= 0.1;
		scene.camera.bottom -= 0.1;
		updateNormalizeMatrix(scene.camera);
	}
	else if ('5' == c) {
		// Shift camera forward
		scene.camera.n += 0.1;
		updateNormalizeMatrix(scene.camera);
	}
	else if ('6' == c) {
		// Shift camera backward
		scene.camera.n -= 0.1;
		updateNormalizeMatrix(scene.camera);
	}
	else if ('7' == c) {
		// Expand camera view horizontally
		scene.camera.left -= 0.1;
		scene.camera.right += 0.1;
		updateNormalizeMatrix(scene.camera);
	}
	else if ('8' == c) {
		// Contract camera view horizontally
		scene.camera.left += 0.1;
		scene.camera.right -= 0.1;
		updateNormalizeMatrix(scene.camera);
	}
	else if ('9' == c) {
		// Reset camera
		scene.camera.projPerspectiveReset();
		//updateNormalizeMatrix(scene.camera);
	}
	else if ('b' == c) {
		// rotate around x axis
		xRotation += 15.0;
	}
	else if ('B' == c) {
		// rotate around x axis
		xRotation += -15.0;
	}
	else if ('n' == c) {
		// rotate around y axis
		yRotation += 15.0;
	}
	else if ('N' == c) {
		// rotate around y axis
		yRotation += -15.0;
	}
	else if ('m' == c) {
		// rotate around z axis
		zRotation += 15.0;
	}
	else if ('M' == c) {
		// rotate around z axis
		zRotation += -15.0;
	}
	else if ('?' == c) {
		scene.positionList[currentPosition].model.visible = false;
		--currentPosition;
		if (currentPosition < 0) currentPosition = scene.positionList.length - 2;
		scene.positionList[currentPosition].model.visible = true;
	}
	else if ('=' == c) {
		 scale = 1.0;
         xTranslation = 0.0;
         yTranslation = 0.0;
         zTranslation = 0.0;
         xRotation = 0.0;
         yRotation = 0.0;
         zRotation = 0.0;
	}
	
	var model_p = scene.positionList[currentPosition];
	model_p.matrix = Matrix.translate(0, 0, -near).mult(
					Matrix.translate(xTranslation, yTranslation, zTranslation)).mult(
					Matrix.rotateX(xRotation).mult(Matrix.rotateY(yRotation)).mult(Matrix.rotateZ(zRotation)).mult(Matrix.scaleConst(scale))
					);
						
	// add image data
	display();
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

function print_help_message()
{
	console.log("Use the 'd/D' keys to toggle debugging information on and off for the current model.");
	console.log("Use the '/' key to cycle through the models.");

	// Camera controls
	console.log("Use the 'p' key to toggle between parallel and orthographic projection.");
	//console.log("Use the '+/-' keys to zoom in and out with the camera.");
	//console.log("Use the '1' key to pan the camera left, and the '2' key to pan the camera right.");
	//console.log("Use the '3' key to pan the camera down, and the '4' key to pan the camera up.");
	//console.log("Use the '5/6' keys to rotate the camera around the y-axis");
	//console.log("Use the '7/8' keys to rotate the camera around the z-axis");
	//console.log("Use the 'r' key to reset the camera.");

	console.log("Use the x/X, y/Y, z/Z, keys to translate the model along the x, y, z axes.");
	console.log("Use the b/B, n/N, m/M keys to rotate the model around the x, y, z axes.");
	console.log("Use the s/S keys to scale the size of the model.");
	console.log("Use the 'c' key to change the random solid model color.");
	console.log("Use the 'C' key to randomly change model's colors.");
	console.log("Use the 'e' key to change the random solid edge colors.");
	console.log("Use the 'E' key to change the random edge colors.");
	console.log("Use the 'h' key to redisplay this help message.");
}

function updateNormalizeMatrix(camera) {
	if (camera.perspective) {
		var newNormalizeMatrix = PerspectiveNormalizeMatrix.build(camera.left,
			camera.right,
			camera.bottom,
			camera.top,
			camera.n);
		camera.normalizeMatrix = newNormalizeMatrix;
	}
	else {
		var newNormalizeMatrix = OrthographicNormalizeMatrix.build(camera.left,
			camera.right,
			camera.bottom,
			camera.top);
		camera.normalizeMatrix = newNormalizeMatrix;
	}
}

// window.onresize = display;

var resizer = new ResizeObserver(display);
resizer.observe(document.getElementById("resizer"));