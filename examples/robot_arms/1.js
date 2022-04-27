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
   Draw an interactive robot arm with one shoulder,
   two elbow, two wrist, and two finger joints.
<p>
   Here is a simplified version of this program's scene graph.
<p>
<pre>{@code
              Scene
                |
                |
            Position
            / | \   \
           /  |  \   \--------------------\
     Matrix   |   \                        \
      TRS    /  Position                 Position
            /     / |  \                  /  |  \
           /     /  |   \                /   |   \
          / Matrix  |    \          Matrix   |    \
         /   TRS   /    Position     TRS    /  Position
         \        /      / |  \            /    / |   \
          \      /      /  |   \          /    /  |    \
           \    /  Matrix  |    \        / Matrix |     \
            \   \   TRS   /   Position  |   TRS   /   Position
             \   \       /      /  |    |        /     /  |
              \   \     /      /   |    |       /     /   |
               \   \   /  Matrix   |    |      /  Matrix  |
                \   \  \   TRS     |    |     /    TRS   /
                 \   \  \          |    |    /          /
                  \   \  \-----\   |    /   /          /
                   \   \--------\  |   /---/          /
                    \------------\ |  /--------------/
                                 Model
                               armSegment
</pre>
*/

const resizer = document.getElementById("resizer");
const ctx = document.getElementById("pixels").getContext("2d");
var fb = new FrameBuffer(undefined, resizer.offsetWidth, resizer.offsetHeight);

var xTranslation = 0.0;
var yTranslation = 0.0;

var rotate = true;
var shoulderRotation = 0.0;
var elbowRotation1 = 15.0;
var elbowRotation2 = -15.0;
var wristRotation1 = 0.0;
var wristRotation2 = 0.0;
var fingerRotation1 = 0.0;
var fingerRotation2 = 0.0;

var shoulderLength = 0.4;
var elbowLength1 = 0.3;
var elbowLength2 = 0.3;
var wristLength1 = 0.2;
var wristLength2 = 0.2;
var fingerLength1 = 0.1;
var fingerLength2 = 0.1;

var scene;
var shoulder_p;
var elbow1_p;
var elbow2_p;
var wrist1_p;
var wrist2_p;
var finger1_p;
var finger2_p;

var scene = new Scene();
scene.camera.projOrthoReset();

var shoulder_p = new Position();
scene.addPosition([shoulder_p]);
shoulder_p.matrix = Matrix.translate(0, 0, -1);

/*
    Create the scene graph.
*/
// Create one Model that can be used
// for each part of the robot arms.
const v0 = new Vertex(0, 0, 0);
const v1 = new Vertex(1, 0, 0);
const armSegment = new Model("arm segment");
armSegment.addVertex([v0, v1]);
armSegment.addLineSegment([new LineSegment(0, 1)]);
ModelShading.setColor(armSegment, Color.Blue);

// Add the armSegment Model to the Scene's Position.
shoulder_p.model = armSegment;

elbow1_p = new Position(armSegment);
elbow2_p = new Position(armSegment);
shoulder_p.addNestedPosition([elbow1_p]);
shoulder_p.addNestedPosition([elbow2_p]);

wrist1_p = new Position(armSegment);
wrist2_p = new Position(armSegment);
elbow1_p.addNestedPosition([wrist1_p]);
elbow2_p.addNestedPosition([wrist2_p]);

finger1_p = new Position(armSegment);
finger2_p = new Position(armSegment);
wrist1_p.addNestedPosition([finger1_p]);
wrist2_p.addNestedPosition([finger2_p]);

// Initialize the nested matrices for the sub models.
shoulder_p.matrix2Identity();
shoulder_p.matrix.mult(Matrix.translate(xTranslation,
										yTranslation,
										-1));
shoulder_p.matrix.mult(Matrix.rotateZ(shoulderRotation));
shoulder_p.matrix.mult(Matrix.scale(shoulderLength,
									shoulderLength,
									1));
elbow1_p.matrix2Identity();
elbow1_p.matrix.mult(Matrix.translate(1, 0, 0));
elbow1_p.matrix.mult(Matrix.rotateZ(elbowRotation1));
elbow1_p.matrix.mult(Matrix.scale(elbowLength1/shoulderLength,
								  elbowLength1/shoulderLength,
								  1));
elbow2_p.matrix2Identity();
elbow2_p.matrix.mult(Matrix.translate(1, 0, 0));
elbow2_p.matrix.mult(Matrix.rotateZ(elbowRotation2));
elbow2_p.matrix.mult(Matrix.scale(elbowLength2/shoulderLength,
								  elbowLength2/shoulderLength,
								  1));
wrist1_p.matrix2Identity();
wrist1_p.matrix.mult(Matrix.translate(1, 0, 0));
wrist1_p.matrix.mult(Matrix.rotateZ(wristRotation1));
wrist1_p.matrix.mult(Matrix.scale(wristLength1/elbowLength1,
								  wristLength1/elbowLength1,
								  1));
wrist2_p.matrix2Identity();
wrist2_p.matrix.mult(Matrix.translate(1, 0, 0));
wrist2_p.matrix.mult(Matrix.rotateZ(wristRotation2));
wrist2_p.matrix.mult(Matrix.scale(wristLength2/elbowLength2,
								  wristLength2/elbowLength2,
								  1));
finger1_p.matrix2Identity();
finger1_p.matrix.mult(Matrix.translate(1, 0, 0));
finger1_p.matrix.mult(Matrix.rotateZ(fingerRotation1));
finger1_p.matrix.mult(Matrix.scale(fingerLength1/wristLength1,
								   fingerLength1/wristLength1,
								   1));
finger2_p.matrix2Identity();
finger2_p.matrix.mult(Matrix.translate(1, 0, 0));
finger2_p.matrix.mult(Matrix.rotateZ(fingerRotation2));
finger2_p.matrix.mult(Matrix.scale(fingerLength2/wristLength2,
								   fingerLength2/wristLength2,
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
	// else if ('a' == c) {
	// 	Rasterize.doAntialiasing = ! Rasterize.doAntialiasing;
	// 	console.log("Anti-aliasing is turned " + (Rasterize.doAntialiasing ? "On" : "Off"));
	// }
	// else if ('g' == c) {
	// 	Rasterize.doGamma = ! Rasterize.doGamma;
	// 	console.log("Gamma correction is turned " + (Rasterize.doGamma ? "On" : "Off"));
	// }
	else if ('c' == c) {
		// Change the solid random color of the robot arms.
		const color = ModelShading.randomColor();
		ModelShading.setColor(shoulder_p.model, color);
		ModelShading.setColor(elbow1_p.model, color);
		ModelShading.setColor(elbow2_p.model, color);
		ModelShading.setColor(wrist1_p.model, color);
		ModelShading.setColor(wrist2_p.model, color);
		ModelShading.setColor(finger1_p.model, color);
		ModelShading.setColor(finger2_p.model, color);
	}
	else if ('C' == c) {
		// Change the solid random color of each segment of the robot arms.
		ModelShading.setRandomColor(shoulder_p.model);
		ModelShading.setRandomColor(elbow1_p.model);
		ModelShading.setRandomColor(elbow2_p.model);
		ModelShading.setRandomColor(wrist1_p.model);
		ModelShading.setRandomColor(wrist2_p.model);
		ModelShading.setRandomColor(finger1_p.model);
		ModelShading.setRandomColor(finger2_p.model);
	}
	else if ('r' == c) {
		// Change the random color at each end of each segment of the robot arms.
		ModelShading.setRainbowLineSegmentColors(shoulder_p.model);
		ModelShading.setRainbowLineSegmentColors(elbow1_p.model);
		ModelShading.setRainbowLineSegmentColors(elbow2_p.model);
		ModelShading.setRainbowLineSegmentColors(wrist1_p.model);
		ModelShading.setRainbowLineSegmentColors(wrist2_p.model);
		ModelShading.setRainbowLineSegmentColors(finger1_p.model);
		ModelShading.setRainbowLineSegmentColors(finger2_p.model);
	}
	else if ('R' == c) {
		// Change the random color at each vertex of the robot arms.
		const c1 = ModelShading.randomColor();
		const c2 = ModelShading.randomColor();
		const c3 = ModelShading.randomColor();
		const c4 = ModelShading.randomColor();
		const c5 = ModelShading.randomColor();
		const c6 = ModelShading.randomColor();
		const c7 = ModelShading.randomColor();
		const c8 = ModelShading.randomColor();
		shoulder_p.model.colorList = [c1, c2];
		  elbow1_p.model.colorList = [c2, c3];
		  elbow2_p.model.colorList = [c2, c4];
		  wrist1_p.model.colorList = [c3, c5];
		  wrist2_p.model.colorList = [c4, c6];
		 finger1_p.model.colorList = [c5, c7];
		 finger2_p.model.colorList = [c6, c8];
		shoulder_p.model.lineSegmentList[0].setColors(0, 1);
		  elbow1_p.model.lineSegmentList[0].setColors(0, 1);
		  elbow2_p.model.lineSegmentList[0].setColors(0, 1);
		  wrist1_p.model.lineSegmentList[0].setColors(0, 1);
		  wrist2_p.model.lineSegmentList[0].setColors(0, 1);
		 finger1_p.model.lineSegmentList[0].setColors(0, 1);
		 finger2_p.model.lineSegmentList[0].setColors(0, 1);
	}
	else if ('=' == c) {
		xTranslation = 0.0;
		yTranslation = 0.0;

		shoulderRotation = 0.0;
		  elbowRotation1 =  15.0;
		  elbowRotation2 = -15.0;
		  wristRotation1 = 0.0;
		  wristRotation2 = 0.0;
		 fingerRotation1 = 0.0;
		 fingerRotation2 = 0.0;

		  shoulderLength = 0.4;
			elbowLength1 = 0.3;
			elbowLength2 = 0.3;
			wristLength1 = 0.2;
			wristLength2 = 0.2;
		   fingerLength1 = 0.1;
		   fingerLength2 = 0.1;
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
			elbowRotation1 += 2.0;
		}
		else if ('E' == c) {
			elbowRotation1 -= 2.0;
		}
		else if ('w' == c) {
			wristRotation1 += 2.0;
		}
		else if ('W' == c) {
			wristRotation1 -= 2.0;
		}
		else if ('f' == c) {
			fingerRotation1 += 2.0;
		}
		else if ('F' == c) {
			fingerRotation1 -= 2.0;
		}
		else if ('q' == c) {
			elbowRotation2 += 2.0;
		}
		else if ('Q' == c) {
			elbowRotation2 -= 2.0;
		}
		else if ('z' == c) {
			wristRotation2 += 2.0;
		}
		else if ('Z' == c) {
			wristRotation2 -= 2.0;
		}
		else if ('d' == c) {
			fingerRotation2 += 2.0;
		}
		else if ('D' == c) {
			fingerRotation2 -= 2.0;
		}
	} else if (!rotate) {
		if ('s' == c) {
			shoulderLength += 0.02;
		}
		else if ('S' == c) {
			shoulderLength -= 0.02;
		}
		else if ('e' == c) {
			elbowLength1 += 0.02;
		}
		else if ('E' == c) {
			elbowLength1 -= 0.02;
		}
		else if ('w' == c) {
			wristLength1 += 0.02;
		}
		else if ('W' == c) {
			wristLength1 -= 0.02;
		}
		else if ('f' == c) {
			fingerLength1 += 0.02;
		}
		else if ('F' == c) {
			fingerLength1 -= 0.02;
		}
		else if ('d' == c) {
			elbowLength2 += 0.02;
		}
		else if ('D' == c) {
			elbowLength2 -= 0.02;
		}
		else if ('z' == c) {
			wristLength2 += 0.02;
		}
		else if ('Z' == c) {
			wristLength2 -= 0.02;
		}
		else if ('d' == c) {
			fingerLength2 += 0.02;
		}
		else if ('D' == c) {
			fingerLength2 -= 0.02;
		}
	}

	// Set the model matrices for the sub models.
	shoulder_p.matrix2Identity();
	shoulder_p.matrix.mult(Matrix.translate(xTranslation,
											yTranslation,
											-1));
	shoulder_p.matrix.mult(Matrix.rotateZ(shoulderRotation));
	shoulder_p.matrix.mult(Matrix.scale(shoulderLength,
										shoulderLength,
										1));

	elbow1_p.matrix2Identity();
	elbow1_p.matrix.mult(Matrix.translate(1, 0, 0));
	elbow1_p.matrix.mult(Matrix.rotateZ(elbowRotation1));
	elbow1_p.matrix.mult(Matrix.scale(elbowLength1/shoulderLength,
									  elbowLength1/shoulderLength,
									  1));

	elbow2_p.matrix2Identity();
	elbow2_p.matrix.mult(Matrix.translate(1, 0, 0));
	elbow2_p.matrix.mult(Matrix.rotateZ(elbowRotation2));
	elbow2_p.matrix.mult(Matrix.scale(elbowLength2/shoulderLength,
									  elbowLength2/shoulderLength,
									  1));

	wrist1_p.matrix2Identity();
	wrist1_p.matrix.mult(Matrix.translate(1, 0, 0));
	wrist1_p.matrix.mult(Matrix.rotateZ(wristRotation1));
	wrist1_p.matrix.mult(Matrix.scale(wristLength1/elbowLength1,
									  wristLength1/elbowLength1,
									  1));

	wrist2_p.matrix2Identity();
	wrist2_p.matrix.mult(Matrix.translate(1, 0, 0));
	wrist2_p.matrix.mult(Matrix.rotateZ(wristRotation2));
	wrist2_p.matrix.mult(Matrix.scale(wristLength2/elbowLength2,
									  wristLength2/elbowLength2,
									  1));

	finger1_p.matrix2Identity();
	finger1_p.matrix.mult(Matrix.translate(1, 0, 0));
	finger1_p.matrix.mult(Matrix.rotateZ(fingerRotation1));
	finger1_p.matrix.mult(Matrix.scale(fingerLength1/wristLength1,
									   fingerLength1/wristLength1,
									   1));

	finger2_p.matrix2Identity();
	finger2_p.matrix.mult(Matrix.translate(1, 0, 0));
	finger2_p.matrix.mult(Matrix.rotateZ(fingerRotation2));
	finger2_p.matrix.mult(Matrix.scale(fingerLength2/wristLength2,
									   fingerLength2/wristLength2,
									   1));

	// Render again.
    display(true);
}

function print_help_message()
{
    // console.log("Use the 'a' key to toggle antialiasing on and off.");
    // console.log("Use the 'g' key to toggle gamma correction on and off.");
    console.log("Use the 'c' key to change the random solid arm color.");
    console.log("Use the 'C' key to randomly change arm segment colors.");
    console.log("Use the 'r' key to randomly change arm segment end colors.");
    console.log("Use the 'R' key to randomly change arm hinge colors.");
	if (rotate){
		console.log("Use the s/S keys to rotate the arm at the shoulder.");
		console.log("Use the e/E keys to rotate the arm at elbow 1.");
		console.log("Use the w/W keys to rotate the arm at wrist 1.");
		console.log("Use the f/F keys to rotate the arm at finger 1.");
		console.log("Use the q/Q keys to rotate the arm at elbow 2.");
		console.log("Use the z/Z keys to rotate the arm at wrist 2.");
		console.log("Use the d/D keys to rotate the arm at finger 2.");
	} else {
		console.log("Use the s/S keys to extend the length of the arm at the shoulder.");
		console.log("Use the e/E keys to extend the length of the arm at elbow 1.");
		console.log("Use the w/W keys to extend the length of the arm at wrist 1.");
		console.log("Use the f/F keys to extend the length of the arm at finger 1.");
		console.log("Use the q/Q keys to extend the length of the arm at elbow 2.");
		console.log("Use the z/Z keys to extend the length of the arm at wrist 2.");
		console.log("Use the d/D keys to extend the length of the arm at finger 2.");
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
	document.getElementById("lengthenHelp").style.display = rotate ? "none"  : "block";
}
document.addEventListener("keypress", keyPressed);
var resizeObserver = new ResizeObserver(function () { display(false); });
resizeObserver.observe(document.getElementById("resizer"));