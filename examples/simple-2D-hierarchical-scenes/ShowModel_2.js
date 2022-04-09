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
   This file defines a hierarchical scene out of two instances of Model_1.
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
                   Position              Position
                    /     \             /      \
                   /       \           /        \
               Matrix    Model_1    Matrix     Model_1
                 I                   TSR
}</pre>
* @overview
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

// Add two instances of Model_1 to the Scene.
const m1 = new Model_1();
const m2 = new Model_1();
ModelShading.setColor(m1, Color.Red);
ModelShading.setColor(m2, Color.Blue);

// Add references to Models m1 and m2 to Positions p1 and p2.
p1.model = m1;
p2.model = m2;

// Initialize the nested matrices in the Positions.
p2.matrix.mult(Matrix.translate(1, -2 - Math.sqrt(2), 0));
p2.matrix.mult(Matrix.scale(0.5, 0.5, 1));
p2.matrix.mult(Matrix.rotateZ(-45));

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
    p.matrix.mult(Matrix.translate(0, 0, -2));

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