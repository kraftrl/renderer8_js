/*

*/

import { Scene } from '../../scene/Scene.js';
import { ModelShading } from '../../scene/ModelShading.js';
import { Matrix } from '../../scene/Matrix.js';
import { Position } from '../../scene/Position.js';
import { Pipeline } from '../../pipeline/Pipeline.js';
import { FrameBuffer } from '../../framebuffer/FrameBuffer.js';
import { Color } from '../../color/Color.js';
import { Model_1 } from "./Model_1.js";

/**
   This file defines a more complex directed acyclic graph where
   Position objects share a nested Position object and Position
   objects also share a Model object.
<p>
   The DAG for this scene is shown below. A single instance of Model_1
   ends up appearing in the scene in four places since there are four
   paths in the DAG from the root Scene object to the Model_1 object
   (make sure you can trace out all four paths in the DAG). Since each
   path through the DAG defines a different "current transformation
   matrix" (ctm), each path through the DAG places the Model_1 instance
   in a different place in camera coordinates.
<p>
<pre>{@code
           Scene
          /     \
         /       \
    Camera     List<Position>
                     |
                     |
                  Position
                 /   |    \
                /    |     \
          Matrix   Model     List<Position>
            R     (empty)   /              \
                           /                \
                          /                  \
                  Position                    Position
                 /   |    \                   /   |   \
                /    |     \                 /    |    \
          Matrix   Model List<Position>  Matrix Model   List<Position>
            T     (empty)          \      TR   (empty)  /
                                    \                  /
                                     \                /
                                      \              /
                                       \            /
                                        \          /
                                          Position
                                         /  |    \
                                        /   |     \
                                  Matrix  Model    List<Position>
                                    I    (empty)    /           \
                                                   /             \
                                                  /               \
                                           Position            Position
                                           /       \           /     /
                                          /         \         /     /
                                      Matrix         \    Matrix   /
                                        I             \    TSR    /
                                                       \         /
                                                        \       /
                                                         Model_1
}</pre>
*/
// Create the Scene object that we shall render.
const scene = new Scene();

const right = 6;
const left = -right;
const top = 6;
const bottom = -top;
const near = 2;

scene.camera.projPerspective(left, right, bottom, top, near);

// Create the top level Position.
const p = new Position();

// Add the top level Position to the Scene.
scene.addPosition([p]);

// Add two nested Positions to the top level Position.
const p1 = new Position();
const p2 = new Position();
p.addNestedPosition([p1, p2]);

// Add a reference to a Position p3 to each of Positions p1 and p2.
const p3 = new Position();
p1.addNestedPosition([p3]);
p2.addNestedPosition([p3]);

// Add two nested Positions to the Position p3.
const p4 = new Position();
const p5 = new Position();
p3.addNestedPosition([p4, p5]);

// Create a single instance of Model_1.
const m1 = new Model_1();
ModelShading.setColor(m1, Color.Red);
// Add a reference to Model m1 to each of Positions p4 and p5.
p4.model = m1;
p5.model = m1;


// Initialize the nested matrices in the Positions.
p1.matrix.mult(Matrix.translate(-2, -2, 0));
p2.matrix.mult(Matrix.translate(2, 2, 0));
p2.matrix.mult(Matrix.rotateZ(180));
p5.matrix.mult(Matrix.translate(1, -2 - Math.sqrt(2), 0));
p5.matrix.mult(Matrix.scale(0.5, 0.5, 1));
p5.matrix.mult(Matrix.rotateZ(-45));


// Setup a variabls for animation
let frame = 0;
let fps = 20;
let timer;

// Setup timer
timer = setInterval(function () {
  nextFrame();
  display();
}, 1000 / fps);

function nextFrame() {
  p.matrix2Identity();
  // Push the model away from where the camera is.
  p.matrix.mult(Matrix.translate(0, 0, -2.5));
  
  // Spin the model by 10 degrees
  p.matrix.mult(Matrix.rotateZ(10 * frame));

  // Update the parameters for the next frame.
  frame = (frame + 1) % 37;
}


// Display the Model on the page
function display() {
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
  const fb = new FrameBuffer(undefined, w, h, Color.White);
  Pipeline.render(scene, fb.vp);

  ctx.putImageData(new ImageData(fb.pixel_buffer, fb.width, fb.height), fb.vp.vp_ul_x, fb.vp.vp_ul_y);
}
