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
   Draw two interactive robot arms with
   shoulder, elbow, wrist, and finger joints.
<p>
   Here is a simplified version of this program's scene graph.
<p>
<pre>{@code
                        Scene
                        /   \
                /------/     \------\
               /                     \
        Position                     Position
        / | \                         / |   \
       /  |  \                       /  |    \
 Matrix   |   \                Matrix   |     \
  TRS    /  Position            TRS    /   Position
        /     / |  \                  /     / |  \
       /     /  |   \                /     /  |   \
      / Matrix  |    \              / Matrix  |    \
     /   TRS   /    Position       |   TRS   /    Position
     \        /      / |  \        |        /      / |  \
      \      /      /  |   \       |       /      /  |   \
       \    /  Matrix  |    \      |      /  Matrix  |    \
        \   \   TRS   /   Position |      |   TRS   /   Position
         \   \       /      /  |   |      |        /      /   /
          \   \     /      /   |   |      |       /      /   /
           \   \   /  Matrix   |   |     /       /  Matrix  /
            \   \  \   TRS     |   |    /       /    TRS   /
             \   \  \          |   |   /       /          /
              \   \  \------\  |   |  /       /          /
               \   \---------\ |   | /-------/          /
                \-------------\|   |/------------------/
                               Model
                             armSegment
</pre>
*/

const resizer = document.getElementById("resizer");
const ctx = document.getElementById("pixels").getContext("2d");
var fb = new FrameBuffer(undefined, resizer.offsetWidth, resizer.offsetHeight);

var xTranslation = [0.0,  0.0];
var yTranslation = [0.5, -0.5];

var rotate = true;
var shoulderRotation = [0.0, 0.0];
var elbowRotation1 = [ 15,  15];
var elbowRotation2 = [-15, -15];
var wristRotation1 = [0.0, 0.0];
var wristRotation2 = [0.0, 0.0];
var fingerRotation1 = [0.0, 0.0];
var fingerRotation2 = [0.0, 0.0];

var shoulderLength = [0.4, 0.4];
var elbowLength1 = [0.3, 0.3];
var elbowLength2 = [0.3, 0.3];
var wristLength1 = [0.2, 0.2];
var wristLength2 = [0.2, 0.2];
var fingerLength1 = [0.1, 0.1];
var fingerLength2 = [0.1, 0.1];

var scene;
var arm_p;
var elbow1_p;
var elbow2_p;
var wrist1_p;
var wrist2_p;
var finger1_p;
var finger2_p;
var currentArm = 0;

var scene = new Scene();
scene.camera.projOrthoReset();

/*
   Create the scene graph.
*/
// Create two Position objects that will each hold a robot arm.
const arm1_s = new Position();
const arm2_s = new Position();

// Add the Position objects to the scene.
scene.addPosition([arm1_s, arm2_s]);

// Create two Models that can be used
// for each of the robot arms.
const v0 = new Vertex(0, 0, 0);
const v1 = new Vertex(1, 0, 0);
const armSegment1 = new Model();
armSegment1.addVertex([v0, v1]);
armSegment1.addLineSegment([new LineSegment(0, 1)]);
ModelShading.setColor(armSegment1, Color.Orange);
const armSegment2 = new Model();
armSegment2.addVertex([v0, v1]);
armSegment2.addLineSegment([new LineSegment(0, 1)]);
ModelShading.setColor(armSegment2, Color.Blue);

/*
   Create two robot arms.
*/
// First arm.
arm1_s.model = armSegment1;

// two elbows
const arm1_e1 = new Position(armSegment1);
const arm1_e2 = new Position(armSegment1);
arm1_s.addNestedPosition([arm1_e1]);
arm1_s.addNestedPosition([arm1_e2]);

// two wrists
const arm1_w1 = new Position(armSegment1);
const arm1_w2 = new Position(armSegment1);
arm1_e1.addNestedPosition([arm1_w1]);
arm1_e2.addNestedPosition([arm1_w2]);

// two fingers
const arm1_f1 = new Position(armSegment1);
const arm1_f2 = new Position(armSegment1);
arm1_w1.addNestedPosition([arm1_f1]);
arm1_w2.addNestedPosition([arm1_f2]);

// Second arm.
arm2_s.model = armSegment2;

// two elbows
const arm2_e1 = new Position(armSegment2);
const arm2_e2 = new Position(armSegment2);
arm2_s.addNestedPosition([arm2_e1]);
arm2_s.addNestedPosition([arm2_e2]);

// two wrists
const arm2_w1 = new Position(armSegment2);
const arm2_w2 = new Position(armSegment2);
arm2_e1.addNestedPosition([arm2_w1]);
arm2_e2.addNestedPosition([arm2_w2]);

// two fingers
const arm2_f1 = new Position(armSegment2);
const arm2_f2 = new Position(armSegment2);
arm2_w1.addNestedPosition([arm2_f1]);
arm2_w2.addNestedPosition([arm2_f2]);

arm_p     = [arm1_s,  arm2_s];
elbow1_p  = [arm1_e1, arm2_e1];
elbow2_p  = [arm1_e2, arm2_e2];
wrist1_p  = [arm1_w1, arm2_w1];
wrist2_p  = [arm1_w2, arm2_w2];
finger1_p = [arm1_f1, arm2_f1];
finger2_p = [arm1_f2, arm2_f2];

// Initialize the nested matrices for the sub models.
// First arm.
arm_p[0].matrix.mult(Matrix.translate(xTranslation[0],
									  yTranslation[0],
									  -1));
arm_p[0].matrix.mult(Matrix.scale(shoulderLength[0],
								  shoulderLength[0],
								  1));
elbow1_p[0].matrix.mult(Matrix.translate(1, 0, 0));
elbow1_p[0].matrix.mult(Matrix.rotateZ(elbowRotation1[0]));
elbow1_p[0].matrix.mult(Matrix.scale(elbowLength1[0]/shoulderLength[0],
									 elbowLength1[0]/shoulderLength[0],
									 1));
elbow2_p[0].matrix.mult(Matrix.translate(1, 0, 0));
elbow2_p[0].matrix.mult(Matrix.rotateZ(elbowRotation2[0]));
elbow2_p[0].matrix.mult(Matrix.scale(elbowLength2[0]/shoulderLength[0],
									 elbowLength2[0]/shoulderLength[0],
									 1));
wrist1_p[0].matrix.mult(Matrix.translate(1, 0, 0));
wrist1_p[0].matrix.mult(Matrix.scale(wristLength1[0]/elbowLength1[0],
									 wristLength1[0]/elbowLength1[0],
									 1));
wrist2_p[0].matrix.mult(Matrix.translate(1, 0, 0));
wrist2_p[0].matrix.mult(Matrix.scale(wristLength2[0]/elbowLength2[0],
									 wristLength2[0]/elbowLength2[0],
									 1));
finger1_p[0].matrix.mult(Matrix.translate(1, 0, 0));
finger1_p[0].matrix.mult(Matrix.scale(fingerLength1[0]/wristLength1[0],
									  fingerLength1[0]/wristLength1[0],
									  1));
finger2_p[0].matrix.mult(Matrix.translate(1, 0, 0));
finger2_p[0].matrix.mult(Matrix.scale(fingerLength2[0]/wristLength2[0],
									  fingerLength2[0]/wristLength2[0],
									  1));
// Second arm.
arm_p[1].matrix.mult(Matrix.translate(xTranslation[1],
									  yTranslation[1],
									  -1));
arm_p[1].matrix.mult(Matrix.scale(shoulderLength[1],
								  shoulderLength[1],
								  1));
elbow1_p[1].matrix.mult(Matrix.translate(1, 0, 0));
elbow1_p[1].matrix.mult(Matrix.rotateZ(elbowRotation1[1]));
elbow1_p[1].matrix.mult(Matrix.scale(elbowLength1[1]/shoulderLength[1],
									 elbowLength1[1]/shoulderLength[1],
									 1));
elbow2_p[1].matrix.mult(Matrix.translate(1, 0, 0));
elbow2_p[1].matrix.mult(Matrix.rotateZ(elbowRotation2[1]));
elbow2_p[1].matrix.mult(Matrix.scale(elbowLength2[1]/shoulderLength[1],
									 elbowLength2[1]/shoulderLength[1],
									 1));
wrist1_p[1].matrix.mult(Matrix.translate(1, 0, 0));
wrist1_p[1].matrix.mult(Matrix.scale(wristLength1[1]/elbowLength1[1],
									 wristLength1[1]/elbowLength1[1],
									 1));
wrist2_p[1].matrix.mult(Matrix.translate(1, 0, 0));
wrist2_p[1].matrix.mult(Matrix.scale(wristLength2[1]/elbowLength2[1],
									 wristLength2[1]/elbowLength2[1],
									 1));
finger1_p[1].matrix.mult(Matrix.translate(1, 0, 0));
finger1_p[1].matrix.mult(Matrix.scale(fingerLength1[1]/wristLength1[1],
									  fingerLength1[1]/wristLength1[1],
									  1));
finger2_p[1].matrix.mult(Matrix.translate(1, 0, 0));
finger2_p[1].matrix.mult(Matrix.scale(fingerLength2[1]/wristLength2[1],
									  fingerLength2[1]/wristLength2[1],
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
	else if ('/' == c) {
	   currentArm = (currentArm + 1) % 2;
	}
	else if ('c' == c) {
		// Change the solid random color of the robot arm.
		const color = ModelShading.randomColor();
		ModelShading.setColor(    arm_p[currentArm].model, color);
		ModelShading.setColor( elbow1_p[currentArm].model, color);
		ModelShading.setColor( elbow2_p[currentArm].model, color);
		ModelShading.setColor( wrist1_p[currentArm].model, color);
		ModelShading.setColor( wrist2_p[currentArm].model, color);
		ModelShading.setColor(finger1_p[currentArm].model, color);
		ModelShading.setColor(finger2_p[currentArm].model, color);
	}
	else if ('C' == c) {
		// Change the solid random color of each segment of the robot arm.
         ModelShading.setRandomColor(    arm_p[currentArm].model);
         ModelShading.setRandomColor( elbow1_p[currentArm].model);
         ModelShading.setRandomColor( elbow2_p[currentArm].model);
         ModelShading.setRandomColor( wrist1_p[currentArm].model);
         ModelShading.setRandomColor( wrist2_p[currentArm].model);
         ModelShading.setRandomColor(finger1_p[currentArm].model);
         ModelShading.setRandomColor(finger2_p[currentArm].model);
	}
	else if ('r' == c) {
		// Change the random color at each end of each segment of the robot arm.
         ModelShading.setRainbowLineSegmentColors(arm_p[currentArm].model);
         ModelShading.setRainbowLineSegmentColors(elbow1_p[currentArm].model);
         ModelShading.setRainbowLineSegmentColors(elbow2_p[currentArm].model);
         ModelShading.setRainbowLineSegmentColors(wrist1_p[currentArm].model);
         ModelShading.setRainbowLineSegmentColors(wrist2_p[currentArm].model);
         ModelShading.setRainbowLineSegmentColors(finger1_p[currentArm].model);
         ModelShading.setRainbowLineSegmentColors(finger2_p[currentArm].model);
	}
	else if ('R' == c) {
		// Change the random color at each vertex of the robot arm.
         const c1 = ModelShading.randomColor();
         const c2 = ModelShading.randomColor();
         const c3 = ModelShading.randomColor();
         const c4 = ModelShading.randomColor();
         const c5 = ModelShading.randomColor();
         const c6 = ModelShading.randomColor();
         const c7 = ModelShading.randomColor();
         const c8 = ModelShading.randomColor();
             arm_p[currentArm].model.colorList = [c1, c2];
          elbow1_p[currentArm].model.colorList = [c2, c3];
          elbow2_p[currentArm].model.colorList = [c2, c4];
          wrist1_p[currentArm].model.colorList = [c3, c5];
          wrist2_p[currentArm].model.colorList = [c4, c6];
         finger1_p[currentArm].model.colorList = [c5, c7];
         finger2_p[currentArm].model.colorList = [c6, c8];
             arm_p[currentArm].model.lineSegmentList[0].setColors(0, 1);
          elbow1_p[currentArm].model.lineSegmentList[0].setColors(0, 1);
          elbow2_p[currentArm].model.lineSegmentList[0].setColors(0, 1);
          wrist1_p[currentArm].model.lineSegmentList[0].setColors(0, 1);
          wrist2_p[currentArm].model.lineSegmentList[0].setColors(0, 1);
         finger1_p[currentArm].model.lineSegmentList[0].setColors(0, 1);
         finger2_p[currentArm].model.lineSegmentList[0].setColors(0, 1);
	}
	else if ('=' == c) {
		xTranslation[currentArm] =  0.0;
		if (0 == currentArm)
		   yTranslation[0] =  0.5;
		else
		   yTranslation[1] = -0.5;

	   shoulderRotation[currentArm] = 0.0;
		  elbowRotation1[currentArm] =  15.0;
		  elbowRotation2[currentArm] = -15.0;
		  wristRotation1[currentArm] = 0.0;
		  wristRotation2[currentArm] = 0.0;
		 fingerRotation1[currentArm] = 0.0;
		 fingerRotation2[currentArm] = 0.0;

		  shoulderLength[currentArm] = 0.4;
			elbowLength1[currentArm] = 0.3;
			elbowLength2[currentArm] = 0.3;
			wristLength1[currentArm] = 0.2;
			wristLength2[currentArm] = 0.2;
		   fingerLength1[currentArm] = 0.1;
		   fingerLength2[currentArm] = 0.1;
	}
	else if ('x' == c) {
	   xTranslation[currentArm] += 0.02;
	}
	else if ('X' == c) {
	   xTranslation[currentArm] -= 0.02;
	}
	else if ('y' == c) {
	   yTranslation[currentArm] += 0.02;
	}
	else if ('Y' == c) {
	   yTranslation[currentArm] -= 0.02;
	}
	else if (rotate) {
		if ('s' == c) {
			shoulderRotation[currentArm] += 2.0;
		}
		else if ('S' == c) {
			shoulderRotation[currentArm] -= 2.0;
		}
		else if ('e' == c) {
			elbowRotation1[currentArm] += 2.0;
		}
		else if ('E' == c) {
			elbowRotation1[currentArm] -= 2.0;
		}
		else if ('w' == c) {
			wristRotation1[currentArm] += 2.0;
		}
		else if ('W' == c) {
			wristRotation1[currentArm] -= 2.0;
		}
		else if ('f' == c) {
			fingerRotation1[currentArm] += 2.0;
		}
		else if ('F' == c) {
			fingerRotation1[currentArm] -= 2.0;
		}
		else if ('q' == c) {
			elbowRotation2[currentArm] += 2.0;
		}
		else if ('Q' == c) {
			elbowRotation2[currentArm] -= 2.0;
		}
		else if ('z' == c) {
			wristRotation2[currentArm] += 2.0;
		}
		else if ('Z' == c) {
			wristRotation2[currentArm] -= 2.0;
		}
		else if ('d' == c) {
			fingerRotation2[currentArm] += 2.0;
		}
		else if ('D' == c) {
			fingerRotation2[currentArm] -= 2.0;
		}
	} else if (!rotate) {
		if ('s' == c) {
			shoulderLength[currentArm] += 0.02;
		}
		else if ('S' == c) {
			shoulderLength[currentArm] -= 0.02;
		}
		else if ('e' == c) {
			elbowLength1[currentArm] += 0.02;
		}
		else if ('E' == c) {
			elbowLength1[currentArm] -= 0.02;
		}
		else if ('w' == c) {
			wristLength1[currentArm] += 0.02;
		}
		else if ('W' == c) {
			wristLength1[currentArm] -= 0.02;
		}
		else if ('f' == c) {
			fingerLength1[currentArm] += 0.02;
		}
		else if ('F' == c) {
			fingerLength1[currentArm] -= 0.02;
		}
		else if ('d' == c) {
			elbowLength2[currentArm] += 0.02;
		}
		else if ('D' == c) {
			elbowLength2[currentArm] -= 0.02;
		}
		else if ('z' == c) {
			wristLength2[currentArm] += 0.02;
		}
		else if ('Z' == c) {
			wristLength2[currentArm] -= 0.02;
		}
		else if ('d' == c) {
			fingerLength2[currentArm] += 0.02;
		}
		else if ('D' == c) {
			fingerLength2[currentArm] -= 0.02;
		}
	}

	// Update the nested matrices for the sub models.
	arm_p[currentArm].matrix2Identity();
	arm_p[currentArm].matrix.mult(Matrix.translate(xTranslation[currentArm],
												   yTranslation[currentArm],
												   -1));
	arm_p[currentArm].matrix.mult(Matrix.rotateZ(shoulderRotation[currentArm]));
	arm_p[currentArm].matrix.mult(Matrix.scale(shoulderLength[currentArm],
											   shoulderLength[currentArm],
											   1));

	elbow1_p[currentArm].matrix2Identity();
	elbow1_p[currentArm].matrix.mult(Matrix.translate(1, 0, 0));
	elbow1_p[currentArm].matrix.mult(Matrix.rotateZ(elbowRotation1[currentArm]));
	elbow1_p[currentArm].matrix.mult(Matrix.scale(elbowLength1[currentArm]/shoulderLength[currentArm],
												  elbowLength1[currentArm]/shoulderLength[currentArm],
												  1));

	elbow2_p[currentArm].matrix2Identity();
	elbow2_p[currentArm].matrix.mult(Matrix.translate(1, 0, 0));
	elbow2_p[currentArm].matrix.mult(Matrix.rotateZ(elbowRotation2[currentArm]));
	elbow2_p[currentArm].matrix.mult(Matrix.scale(elbowLength2[currentArm]/shoulderLength[currentArm],
												  elbowLength2[currentArm]/shoulderLength[currentArm],
												  1));

	wrist1_p[currentArm].matrix2Identity();
	wrist1_p[currentArm].matrix.mult(Matrix.translate(1, 0, 0));
	wrist1_p[currentArm].matrix.mult(Matrix.rotateZ(wristRotation1[currentArm]));
	wrist1_p[currentArm].matrix.mult(Matrix.scale(wristLength1[currentArm]/elbowLength1[currentArm],
												  wristLength1[currentArm]/elbowLength1[currentArm],
												  1));

	wrist2_p[currentArm].matrix2Identity();
	wrist2_p[currentArm].matrix.mult(Matrix.translate(1, 0, 0));
	wrist2_p[currentArm].matrix.mult(Matrix.rotateZ(wristRotation2[currentArm]));
	wrist2_p[currentArm].matrix.mult(Matrix.scale(wristLength2[currentArm]/elbowLength2[currentArm],
												  wristLength2[currentArm]/elbowLength2[currentArm],
												  1));

	finger1_p[currentArm].matrix2Identity();
	finger1_p[currentArm].matrix.mult(Matrix.translate(1, 0, 0));
	finger1_p[currentArm].matrix.mult(Matrix.rotateZ(fingerRotation1[currentArm]));
	finger1_p[currentArm].matrix.mult(Matrix.scale(fingerLength1[currentArm]/wristLength1[currentArm],
												   fingerLength1[currentArm]/wristLength1[currentArm],
												   1));

	finger2_p[currentArm].matrix2Identity();
	finger2_p[currentArm].matrix.mult(Matrix.translate(1, 0, 0));
	finger2_p[currentArm].matrix.mult(Matrix.rotateZ(fingerRotation2[currentArm]));
	finger2_p[currentArm].matrix.mult(Matrix.scale(fingerLength2[currentArm]/wristLength2[currentArm],
												   fingerLength2[currentArm]/wristLength2[currentArm],
												   1));

	// set the current arm to be a different color
	ModelShading.setColor(arm_p[currentArm].model,Color.Orange);
	ModelShading.setColor(arm_p[currentArm == 0 ? 1 : 0].model,Color.Blue);

	// Render again.
    display(true);
}

function print_help_message()
{
    // console.log("Use the 'a' key to toggle antialiasing on and off.");
    // console.log("Use the 'g' key to toggle gamma correction on and off.");
    console.log("Use the '/' key to toggle between the the two robot arms.");
    console.log("Use the 'c' key to change the random solid arm color.");
    console.log("Use the 'C' key to randomly change arm segment colors.");
    console.log("Use the 'r' key to randomly change arm segment end colors.");
    console.log("Use the 'R' key to randomly change arm hinge colors.");
	if (rotate){
		console.log("Use the s/S keys to rotate the current arm at the shoulder.");
		console.log("Use the e/E keys to rotate the current arm at elbow 1.");
		console.log("Use the w/W keys to rotate the current arm at wrist 1.");
		console.log("Use the f/F keys to rotate the current arm at finger 1.");
		console.log("Use the q/Q keys to rotate the current arm at elbow 2.");
		console.log("Use the z/Z keys to rotate the current arm at wrist 2.");
		console.log("Use the d/D keys to rotate the current arm at finger 2.");
	} else {
		console.log("Use the s/S keys to extend the length of the current arm at the shoulder.");
		console.log("Use the e/E keys to extend the length of the current arm at elbow 1.");
		console.log("Use the w/W keys to extend the length of the current arm at wrist 1.");
		console.log("Use the f/F keys to extend the length of the current arm at finger 1.");
		console.log("Use the q/Q keys to extend the length of the current arm at elbow 2.");
		console.log("Use the z/Z keys to extend the length of the current arm at wrist 2.");
		console.log("Use the d/D keys to extend the length of the current arm at finger 2.");
	}
	console.log("Use the x/X keys to translate the current arm along the x-axis.");
	console.log("Use the y/Y keys to translate the current arm along the y-axis.");
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