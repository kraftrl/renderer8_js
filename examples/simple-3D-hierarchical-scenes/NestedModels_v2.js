/*

*/

import { Scene } from '../../scene/Scene.js';
import { ModelShading } from '../../scene/ModelShading.js';
import { Matrix } from '../../scene/Matrix.js';
import { Position } from '../../scene/Position.js';
import { Pipeline } from '../../pipeline/Pipeline.js';
import { FrameBuffer } from '../../framebuffer/FrameBuffer.js';
import { Color } from '../../color/Color.js';
import { Model } from '../../scene/Model.js';
import { Vertex } from '../../scene/Vertex.js';
import { LineSegment } from '../../scene/LineSegment.js';
import { PanelXZ } from '../../models/PanelXZ.js';

/**
   This is a simple hierarchical scene made up of a
   triangle with another triangle attached to each vertex.
<p>
   Here is a sketch of the scene graph for this example.
<pre>{@code
                 Scene
                   |
                   |
               Position
              /    |    \
             /     }     \
            /      |      \
      Matrix     Model     nested Positions
       RT     (triangle)  /     |        \
                         /      |         \
                        /       |          \
                       /        |           \
                      /         |            \
              Position      Position       Position
             /     \        /    \           /   \
            /       \      /      \         /     \
      Matrix    nested  Matrix  nested    Matrix   nested
        T    Positions    TR    Positions   TR     Positions
                      \            |             /
                        \          |           /
                          \        |         /
                            \      |       /
                              \    |     /
                                Position
                              /   |    \
                             /    |     \
                        Matrix   Model   nested Positions
                          R   (triangle)     (empty)
}</pre>
* @overview
*/

// Timer for frames.
var timer = null;

// Create the Scene object that we shall render.
const scene = new Scene();

// Create the top level Position.
const top_p = new Position();

// Add the top level Position to the Scene.
scene.addPosition([top_p]);

// Create a Model for the top level position.
const topModel = new Model();
top_p.model = topModel;

// Add a single triangle to the geometry of this model.
const sin2PIover3 = Math.sin(2*Math.PI/3);
const v0 = new Vertex( 1,        0,       0);
const v1 = new Vertex(-0.5,  sin2PIover3, 0);
const v2 = new Vertex(-0.5, -sin2PIover3, 0);
topModel.addVertex([v0, v1, v2]);
topModel.addLineSegment([new LineSegment(0, 1),
                        new LineSegment(1, 2),
                        new LineSegment(2, 0)]);
ModelShading.setColor(topModel, Color.Black);

// Create three nested Positions.
const p1 = new Position();
const p2 = new Position();
const p3 = new Position();

// Put these three nested Positions into the top level Position.
top_p.addNestedPosition([p1]);
top_p.addNestedPosition([p2]);
top_p.addNestedPosition([p3]);

// Place the three nested positions at the
// corners of the top level position's triangle.
p1.matrix.mult(Matrix.translate( 1.5,   0,               0));
p2.matrix.mult(Matrix.translate(-0.75,  1.5*sin2PIover3, 0));
p2.matrix.mult(Matrix.rotateZ(120));
p3.matrix.mult(Matrix.translate(-0.75, -1.5*sin2PIover3, 0));
p3.matrix.mult(Matrix.rotateZ(240));

// Create a nested Position to be shared by
// the last three Positions.
const p4 = new Position();

// Add this nested Position to the last three Positions.
p1.addNestedPosition([p4]);
p2.addNestedPosition([p4]);
p3.addNestedPosition([p4]);

// Give each of these three nested Positions a shared
// triangle Model in another (deeper) nested Position.
const triangle = new Model();
triangle.addVertex([v0, v1, v2]);
triangle.addLineSegment([new LineSegment(0, 1),
                        new LineSegment(1, 2),
                        new LineSegment(2, 0)]);
ModelShading.setColor(triangle, Color.Red);
const triangle_p = new Position(triangle);
p1.addNestedPosition([triangle_p]);
p2.addNestedPosition([triangle_p]);
p3.addNestedPosition([triangle_p]);

// Create a floor Model.
const floor = new PanelXZ(-4, 4, -4, 4);
ModelShading.setColor(floor, Color.Black);
const floor_p = new Position(floor);
floor_p.matrix.mult(Matrix.translate(0, -4, 0));
// Push this model away from where the camera is.
floor_p.matrix.mult(Matrix.translate(0, 0, -5));
// Add the floor to the Scene.
scene.addPosition([floor_p]);


// Create a framebuffer to render our scene into.
const vp_width  = 1024;
const vp_height = 1024;
const fb = new FrameBuffer(undefined, vp_width, vp_height);

// Set up the camera's view frustum.
var right  = 1.0;
var left   = -right;
var top    = 1.0;
var bottom = -top;
var near   = 1.0;
scene.camera.projPerspective(left, right, bottom, top, near);

displayNextFrame();


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
	const fb = new FrameBuffer(undefined, w, h, Color.Gray);
	Pipeline.render(scene, fb.vp);

	ctx.putImageData(new ImageData(fb.pixel_buffer,fb.width, fb.height), fb.vp.vp_ul_x, fb.vp.vp_ul_y);
}

function displayNextFrame() {
   timer = setInterval(function() {
   rotateModels();
   display();
   }, 1000/30);
}

var i = 0;
function rotateModels() {
  // Rotate the triangles WITHIN the scene.
  triangle_p.matrix.mult(Matrix.rotateX(5));

  // Rotate just one triangle WITHIN the scene.
  //p1.matrix.mult(Matrix.rotateX(5));

  // Translate and rotate the WHOLE scene.
  top_p.matrix2Identity();
  // Push the whole scene away from where the camera is.
  top_p.matrix.mult(Matrix.translate(0, 0, -5));
  // Rotate and translate the whole scene.
  top_p.matrix.mult(Matrix.rotateZ(5*i));
  top_p.matrix.mult(Matrix.translate(2, 0, 0));
  //       top_p.matrix.mult(Matrix.rotateY(5*i));
  //       top_p.matrix.mult(Matrix.rotateX(5*i));

  if (i == 72) {i = 0;} else {i++;}
}

var played = true;
document.addEventListener('keypress', keyPressed);
function keyPressed(event) {
    const c = event.key;
    //var played = true;
    if ('f' == c)
    {
        if (!played)
            rotateModels();
    }
    else if ('p' == c) {
        if (played) {
            clearInterval(timer);
            played = false;
        } else {
            displayNextFrame();
            played = true;
        }
    }
    display();
}

var resizer = new ResizeObserver(display);
resizer.observe(document.getElementById("resizer"));