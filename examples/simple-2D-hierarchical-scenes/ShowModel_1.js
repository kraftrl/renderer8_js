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
   This file just shows what Model_1 looks like.
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
          Matrix   Model_1   List<Position>
            R                      |
                                 empty
}</pre>
* @overview
*/

// Create the Scene object that we shall render.
const scene = new Scene();

const right  = 6;
const left   = -right;
const top    = 6;
const bottom = -top;
const near = 2;

scene.camera.projPerspective(left, right, bottom, top, near);

// Add the model to the Scene.
scene.addPosition([new Position(new Model_1())]);
// Set the model's color.
ModelShading.setColor(scene.getPosition(0).model, Color.Black);

// Setup a variabls for animation
let frame = 0;
let fps = 20;
let timer;

// Setup timer
timer = setInterval(function () {
   nextFrame();
   display();
}, 1000 / fps);


// Spin the model by 10 degrees
function nextFrame() {
   scene.getPosition(0).matrix2Identity();
   // Push the model away from where the camera is.
   scene.getPosition(0).matrix.mult(Matrix.translate(0, 0, -1.5));

   scene.getPosition(0).matrix.mult(Matrix.rotateZ(10 * frame));

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