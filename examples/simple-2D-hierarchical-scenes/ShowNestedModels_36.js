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
   This program creates a very complex hierarchical scene
   that draws 36 copies of Model_1.
<p>
   The DAG has a top level Position that holds nine nested
   positions. Each of the nine nested positions holds a
   reference to a sub-DAG that is copied from ShowModel_4.java.
   There are 36 paths in the DAG from the root Scene object to
   the single Model_1 object at the bottom of the DAG.
<p>
<pre>{@code
         Scene
         /   \
        /     \
   Camera   List<Position>
             |
             |
         Position
         /  |    \
        /   |     \
  Matrix  Model     List<Position>
    R    (empty)    /             \
                   /               \
                  /                 \
                 /                   \
                /                     \
               /                       \
         Pos Pos Pos Pos Pos Pos Pos Pos Pos
               \                      /
                \                    /
                 \                  /
                  \                /
                   \              /
                    \            /
                       Position
                       /  |    \
                      /   |     \
                Matrix  Model     List<Position>
                  I    (empty)  /                \
                               /                  \
                              /                    \
                       Position                    Position
                      /   |    \                   /   |   \
                     /    |     \                 /    |    \
               Matrix   Model  List<Position> Matrix Model   List<Position>
                 T     (empty)         \       TR   (empty)  /
                                        \                   /
                                         \                 /
                                          \               /
                                           \             /
                                            \           /
                                              Position
                                              /  |    \
                                             /   |     \
                                       Matrix  Model     List<Position>
                                         I    (empty)    /            \
                                                        /              \
                                                       /                \
                                                Position             Position
                                                /      \            /      /
                                               /        \          /      /
                                           Matrix        \     Matrix    /
                                             I            \     TSR     /
                                                           \           /
                                                            \         /
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

// Add nine nested Position objects to the top level Position.
for (let i = 0; i <= 8; i++) {
  p.addNestedPosition([new Position()]);
}

// Create a Position that holds the complex hierarchical
// structure that draws four copies of Model_1.
const complex_p = new Position();

// Add two nested Positions to the complex position structure.
const p1 = new Position();
const p2 = new Position();
complex_p.addNestedPosition([p1, p2]);

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

// Initialize the nested matrices in these Positions.
p1.matrix.mult(Matrix.translate(-2, -2, 0));
p2.matrix.mult(Matrix.translate(2, 2, 0));
p2.matrix.mult(Matrix.rotateZ(180));
p5.matrix.mult(Matrix.translate(1, -2 - Math.sqrt(2), 0));
p5.matrix.mult(Matrix.scale(0.5, 0.5, 1));
p5.matrix.mult(Matrix.rotateZ(-45));

// Add a reference to the complex position structure
// to each of the nine nested positions in the top
// level Position object.
p.getNestedPosition(0).addNestedPosition([complex_p]);
for (let i = 1; i <= 8; i++) {
  p.getNestedPosition(i).addNestedPosition([complex_p]);
  p.getNestedPosition(i).matrix2Identity();
  p.getNestedPosition(i).matrix.mult(Matrix.rotateZ(i * 45));
  p.getNestedPosition(i).matrix.mult(Matrix.translate(0, -11, 0));
  p.getNestedPosition(i).matrix.mult(Matrix.scale(0.5));
}

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
  p.matrix.mult(Matrix.translate(0, 0, -5));

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