import { Color } from "../../color/Color.js";
import { FrameBuffer } from "../../framebuffer/FrameBuffer.js";
import { Rasterize } from "../../pipeline/Rasterize.js";
import { LineSegment } from "../../scene/LineSegment.js";
import { Matrix } from "../../scene/Matrix.js";
import { Model } from "../../scene/Model.js";
import { ModelShading } from "../../scene/ModelShading.js";
import { Position } from "../../scene/Position.js";
import { Pipeline } from "../../pipeline/Pipeline.js";
import { Scene } from "../../scene/Scene.js";
import { Vertex } from "../../scene/Vertex.js";

/**
   Draw an interactive robot arm with shoulder, elbow, wrist, and finger joints.
   Make each part of the robot arm extendable.
   Make the robot arm translatable in the x and y directions.
<p>
   The tree for this scene is shown below.
<p>
   Remember that every position node in the tree contains a matrix,
   a model and a list of nested positions. The model may be empty,
   and the list of nested positions may also be empty, but the matrix
   cannot be "empty" (if you don't give it a value, then it is the
   identity matrix, I).
<p>
<pre>{@code
          Scene
         /     \
        /       \
  Camera   List<Position>
               |
               |
            Position
            /  |    \
           /   |     \
     Matrix    |     List<Position>
      TRS      |           |
               |           |
              /        Position
             /         /   |   \
            /         /    |    \
           /     Matrix   /      List<Position>
          |       TRS    /             |
          |             /              |
          |            /            Position
          |           /             /  |   \
          |          /             /   |    \
          |         /        Matrix    |     List<Position>
          |        /          TRS      |           |
          |       /                   /            |
           \     /                   /          Position
            Model ------------------/           /  |   \
          armSegment                           /   |    \
                    \                    Matrix    |     List<Position>
                     \                    TRS     /             |
                      \                          /            empty
                       \------------------------/

</pre>
* @overview
*/

const resizer = document.getElementById("resizer");
const ctx = document.getElementById("pixels").getContext("2d");
var fb = new FrameBuffer(undefined, resizer.offsetWidth, resizer.offsetHeight);

var xTranslation = 0.0;
var yTranslation = 0.0;

var rotate = true;
var shoulderRotation = 0.0;
var elbowRotation = 0.0;
var wristRotation = 0.0;
var fingerRotation = 0.0;

var shoulderLength = 0.4;
var elbowLength = 0.3;
var wristLength = 0.2;
var fingerLength = 0.1;

var scene;
var shoulder_p;
var elbow_p;
var wrist_p;
var finger_p;

var scene = new Scene();
scene.camera.projOrthoReset();

var shoulder_p = new Position();
scene.addPosition([shoulder_p]);
shoulder_p.matrix = Matrix.translate(0, 0, -1);

/*
    Create the scene graph.
*/
// Create one Model that can be used
// for each part of the robot arm.
const v0 = new Vertex(0, 0, 0);
const v1 = new Vertex(1, 0, 0);
const armSegment = new Model("arm segment");
armSegment.addVertex([v0, v1]);
armSegment.addLineSegment([new LineSegment(0, 1)]);
ModelShading.setColor(armSegment, Color.Blue);

// Add the armSegment Model to the Scene's Position.
shoulder_p.model = armSegment;

elbow_p = new Position(armSegment);
shoulder_p.addNestedPosition([elbow_p]);

wrist_p = new Position(armSegment);
elbow_p.addNestedPosition([wrist_p]);

finger_p = new Position(armSegment);
wrist_p.addNestedPosition([finger_p]);

// Initialize the nested matrices for the sub models.
shoulder_p.matrix.mult(Matrix.scale(shoulderLength,
									shoulderLength,
									1));
elbow_p.matrix.mult(Matrix.translate(1, 0, 0));
elbow_p.matrix.mult(Matrix.scale(elbowLength/shoulderLength,
									elbowLength/shoulderLength,
									1));
wrist_p.matrix.mult(Matrix.translate(1, 0, 0));
wrist_p.matrix.mult(Matrix.scale(wristLength/elbowLength,
									wristLength/elbowLength,
									1));
finger_p.matrix.mult(Matrix.translate(1, 0, 0));
finger_p.matrix.mult(Matrix.scale(fingerLength/wristLength,
									fingerLength/wristLength,
									1));

print_help_message();
display(true);

/**
 * Render the FrameBuffer and display it on the canvas.
 * @param {boolean} b Whether to reuse the current FrameBuffer object or not.
 */
function display(b){
	if (ctx == null) {
		console.log("cn.getContext(2d) is null");
		return;
	}
    if (b){
        fb.clearFB();
    } else {
        const w = resizer.offsetWidth;
        const h = resizer.offsetHeight;
        ctx.canvas.width = w;
        ctx.canvas.height = h;
        fb = new FrameBuffer(undefined, w, h);
    }
	Pipeline.render(scene, fb.vp);

	ctx.putImageData(new ImageData(fb.pixel_buffer,fb.width, fb.height), fb.vp.vp_ul_x, fb.vp.vp_ul_y);
}

function keyPressed(e){
	const c = e.key;
	if ('h' == c) {
		print_help_message();
		return;
	}
	else if ('D' == c) {
		Rasterize.debug = ! Rasterize.debug;
	}
	else if ('a' == c) {
		Rasterize.doAntialiasing = ! Rasterize.doAntialiasing;
		console.log("Anti-aliasing is turned " + (Rasterize.doAntialiasing ? "On" : "Off"));
	}
	else if ('g' == c) {
		Rasterize.doGamma = ! Rasterize.doGamma;
		console.log("Gamma correction is turned " + (Rasterize.doGamma ? "On" : "Off"));
	}
	else if ('c' == c) {
		// Change the solid random color of the robot arm.
		const color = ModelShading.randomColor();
		ModelShading.setColor(shoulder_p.model, color);
		ModelShading.setColor(elbow_p.model, color);
		ModelShading.setColor(wrist_p.model, color);
		ModelShading.setColor(finger_p.model, color);
	}
	else if ('C' == c) {
		// Change the solid random color of each segment of the robot arm.
		ModelShading.setRandomColor(shoulder_p.model);
		ModelShading.setRandomColor(elbow_p.model);
		ModelShading.setRandomColor(wrist_p.model);
		ModelShading.setRandomColor(finger_p.model);
	}
	else if ('r' == c) {
		// Change the random color at each end of each segment of the robot arm.
		ModelShading.setRainbowLineSegmentColors(shoulder_p.model);
		ModelShading.setRainbowLineSegmentColors(elbow_p.model);
		ModelShading.setRainbowLineSegmentColors(wrist_p.model);
		ModelShading.setRainbowLineSegmentColors(finger_p.model);
	}
	else if ('R' == c) {
		// Change the random color at each vertex of the robot arm.
		const c1 = ModelShading.randomColor();
		const c2 = ModelShading.randomColor();
		const c3 = ModelShading.randomColor();
		const c4 = ModelShading.randomColor();
		const c5 = ModelShading.randomColor();
		shoulder_p.model.colorList = [c1, c2];
		elbow_p.model.colorList = [c2, c3];
		wrist_p.model.colorList = [c3, c4];
		finger_p.model.colorList = [c4, c5];
		shoulder_p.model.lineSegmentList[0].setColors(0, 1);
		elbow_p.model.lineSegmentList[0].setColors(0, 1);
		wrist_p.model.lineSegmentList[0].setColors(0, 1);
		finger_p.model.lineSegmentList[0].setColors(0, 1);
	}
	else if ('=' == c) {
		xTranslation = 0.0;
		yTranslation = 0.0;

		shoulderRotation = 0.0;
		elbowRotation = 0.0;
		wristRotation = 0.0;
		fingerRotation = 0.0;

		shoulderLength = 0.4;
        elbowLength = 0.3;
        wristLength = 0.2;
        fingerLength = 0.1;
	}
	else if ('x' == c) {
	   xTranslation += 0.02;
	}
	else if ('X' == c) {
	   xTranslation -= 0.02;
	}
	else if ('y' == c) {
	   yTranslation += 0.02;
	}
	else if ('Y' == c) {
	   yTranslation -= 0.02;
	}
	else if (rotate) {
		if ('s' == c) {
			shoulderRotation += 2.0;
		}
		else if ('S' == c) {
			shoulderRotation -= 2.0;
		}
		else if ('e' == c) {
			elbowRotation += 2.0;
		}
		else if ('E' == c) {
			elbowRotation -= 2.0;
		}
		else if ('w' == c) {
			wristRotation += 2.0;
		}
		else if ('W' == c) {
			wristRotation -= 2.0;
		}
		else if ('f' == c) {
			fingerRotation += 2.0;
		}
		else if ('F' == c) {
			fingerRotation -= 2.0;
		}
	} else if (!rotate) {
		if ('s' == c) {
			shoulderLength += 0.02;
		}
		else if ('S' == c) {
			shoulderLength -= 0.02;
		}
		else if ('e' == c) {
			elbowLength += 0.02;
		}
		else if ('E' == c) {
			elbowLength -= 0.02;
		}
		else if ('w' == c) {
			wristLength += 0.02;
		}
		else if ('W' == c) {
			wristLength -= 0.02;
		}
		else if ('f' == c) {
			fingerLength += 0.02;
		}
		else if ('F' == c) {
			fingerLength -= 0.02;
		}
	}

	// Update the nested matrices for the sub models.
	shoulder_p.matrix2Identity();
	shoulder_p.matrix.mult(Matrix.translate(xTranslation, yTranslation, -1));
	shoulder_p.matrix.mult(Matrix.rotateZ(shoulderRotation));
	shoulder_p.matrix.mult(Matrix.scale(shoulderLength,
										shoulderLength,
										1));

	elbow_p.matrix2Identity();
	elbow_p.matrix.mult(Matrix.translate(1, 0, 0));
	elbow_p.matrix.mult(Matrix.rotateZ(elbowRotation));
	elbow_p.matrix.mult(Matrix.scale(elbowLength/shoulderLength,
									 elbowLength/shoulderLength,
									 1));

	wrist_p.matrix2Identity();
	wrist_p.matrix.mult(Matrix.translate(1, 0, 0));
	wrist_p.matrix.mult(Matrix.rotateZ(wristRotation));
	wrist_p.matrix.mult(Matrix.scale(wristLength/elbowLength,
									 wristLength/elbowLength,
									 1));

	finger_p.matrix2Identity();
	finger_p.matrix.mult(Matrix.translate(1, 0, 0));
	finger_p.matrix.mult(Matrix.rotateZ(fingerRotation));
	finger_p.matrix.mult(Matrix.scale(fingerLength/wristLength,
									  fingerLength/wristLength,
									  1));

	// Render again.
    display(true);
}

function print_help_message()
{
    console.log("Use the 'a' key to toggle antialiasing on and off.");
    console.log("Use the 'g' key to toggle gamma correction on and off.");
    console.log("Use the 'c' key to change the random solid arm color.");
    console.log("Use the 'C' key to randomly change arm segment colors.");
    console.log("Use the 'r' key to randomly change arm segment end colors.");
    console.log("Use the 'R' key to randomly change arm hinge colors.");
	if (rotate){
		console.log("Use the s/S keys to rotate the arm at the shoulder.");
		console.log("Use the e/E keys to rotate the arm at the elbow.");
		console.log("Use the w/W keys to rotate the arm at the wrist.");
		console.log("Use the f/F keys to rotate the arm at the finger.");
	} else {
		console.log("Use the s/S keys to extend the length of the arm at the shoulder.");
		console.log("Use the e/E keys to extend the length of the arm at the elbow.");
		console.log("Use the w/W keys to extend the length of the arm at the wrist.");
		console.log("Use the f/F keys to extend the length of the arm at the finger.");
	}
	console.log("Use the x/X keys to translate the arm along the x-axis.");
	console.log("Use the y/Y keys to translate the arm along the y-axis.");
    console.log("Use the '=' key to reset the robot arm.");
    console.log("Use the 'h' key to redisplay this help message.");
}

var rotateElement = document.getElementById("rotate");
rotateElement.onclick = function () {
	rotate = ! rotate;
	rotateElement.innerText = (rotate ? "Rotate" : "Lengthen");
	document.getElementById("rotateHelp").style.display = rotate ? "block" : "none";
	document.getElementById("lengthenHelp").style.display = rotate ? "none" : "block";
}
document.addEventListener("keypress", keyPressed);
var resizeObserver = new ResizeObserver(function () { display(false); });
resizeObserver.observe(document.getElementById("resizer"));