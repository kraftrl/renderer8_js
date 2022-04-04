/*

*/

import { Scene } from '../../scene/Scene.js';
import { ModelShading } from '../../scene/ModelShading.js';
import { Matrix } from '../../scene/Matrix.js';
import { Position } from '../../scene/Position.js';
import { Pipeline } from '../../pipeline/Pipeline.js';
import { FrameBuffer } from '../../framebuffer/FrameBuffer.js';
import { Color } from '../../color/Color.js';
import { PanelXZ } from '../../models/PanelXZ.js';
import { TriangularPrism} from '../../models/TriangularPrism.js';

/**
   Here is a sketch of this program's scene graph.
   Only the TriangularPrism model holds any geometry.
   All of the other nodes hold only a matrix.
<pre>{@code
                 Scene
                   |
                   |
               Position
              /    |    \
             /     |     \
       Matrix    Model    nested Positions
         R      (empty)      / |  | \
                            /  |  |  \
                          p1  p2  p3  p4
                            \  |  |  /
                             \ |  | /
                          TriangularPrism
}</pre>
*/

// Timer for frames.
var timer = null;

const sqrt3 = Math.sqrt(3.0);

// Create the Scene object that we shall render.
const scene = new Scene();

// Create the top level Position.
const top_p = new Position();

// Add the top level Position to the Scene.
scene.addPosition([top_p]);

// Create four nested Positions each holding
// a reference to a shared prism Model.
const prism = new TriangularPrism(1.0/sqrt3, 2.0, Math.PI/4.0, 25, true);
ModelShading.setColor(prism, Color.Red);
const p1 = new Position(prism);
const p2 = new Position(prism);
const p3 = new Position(prism);
const p4 = new Position(prism);

// Put these four nested Positions into the top level Position.
top_p.addNestedPosition([p1]);
top_p.addNestedPosition([p2]);
top_p.addNestedPosition([p3]);
top_p.addNestedPosition([p4]);

// Place the four nested positions within
// the top level position.
// right
p1.matrix.mult(Matrix.translate(2+0.5/sqrt3, 0, 0));
// left
p2.matrix.mult(Matrix.translate(-2-0.5/sqrt3, 0, 0));
p2.matrix.mult(Matrix.rotateZ(180));
// top
p3.matrix.mult(Matrix.rotateZ(90));
p3.matrix.mult(Matrix.translate(2+0.5/sqrt3, 0, 0));
// bottom
p4.matrix.mult(Matrix.rotateZ(-90));
p4.matrix.mult(Matrix.translate(2+0.5/sqrt3, 0, 0));

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
// Give the framebuffer a nice background color.
fb.clearFB(Color.Gray);

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
   top_p.matrix2Identity();
   // Push the model away from where the camera is.
   top_p.matrix.mult(Matrix.translate(0, 0, -8));
   top_p.matrix.mult(Matrix.rotateX(2*i));
   top_p.matrix.mult(Matrix.rotateY(2*i));
   top_p.matrix.mult(Matrix.rotateZ(2*i));

   if (i == 180) {i = 0;} else {i++;}
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