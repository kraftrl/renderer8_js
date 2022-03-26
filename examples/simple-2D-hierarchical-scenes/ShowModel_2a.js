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
   This file defines a hierarchical scene out of a single instance of Model_1.
<p>
   The graph for this scene is shown below. Since two Position objects
   share a reference to the same Model_1 object, this graph is not a tree,
   it is a "directed acyclic graph" (DAG). In general, scene graphs can be
   DAGs since multiple Position objects can share a Model object, and
   Position objects can also share a (nested) Position object.
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
                   Position             Position
                    /      \            /      /
                   /        \          /      /
               Matrix        \      Matrix   /
                 I            \      TSR    /
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

// Add two nested Positions to the top level Position.
const p1 = new Position();
const p2 = new Position();
p.addNestedPosition([p1, p2]);

// Add a single instance of Model_1 to the Scene.
const m1 = new Model_1();
ModelShading.setColor(m1, Color.Red);
// Add a reference to Model m1 to each of Positions p1 and p2.
p1.model = m1;
p2.model = m1;

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