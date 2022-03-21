import { Position } from './../scene/Position.js';
import { Rasterize } from './Rasterize.js';
import { Model2View } from './Model2View.js';
import { Projection } from './Projection.js';
import { View2Camera } from './View2Camera.js';
import { Clip } from './Clip.js';
import { Matrix } from './../scene/Matrix.js';

/**
   This renderer takes as its input a {@link Scene} data structure
   and a {@link FrameBuffer.Viewport} within a {@link FrameBuffer}
   data structure. This renderer mutates the {@link FrameBuffer.Viewport}
   so that it is filled in with the rendered image of the geometric
   scene represented by the {@link Scene} object.
<p>
   This implements our seventh rendering pipeline. It adds a vertex
   transformation stage, {@link Model2View}, that converts vertex
   coordinates from the {@link Model}'s (private) coordinate system
   to the {@link Camera}'s (shared) view coordinate system. There are
   five pipeline stages.
*/
export class Pipeline {

    static debug = false;

    /**
     Mutate the {@link FrameBuffer}'s given {@link FrameBuffer.Viewport}
    so that it holds the rendered image of the {@link Scene} object.

    @param scene  {@link Scene} object to render
    @param vp     {@link FrameBuffer.Viewport} to hold rendered image of the {@link Scene}
   */
    static render(scene, vp) {
        // For every Position in the Scene, render the Position's Model
        // and every nested Position.
        for (var position of scene.positionList) {
            if ( position.visible ) {
                // Begin a pre-order, depth-first-traversal from this Position.
                Pipeline.render_position(scene, position, Matrix.identity(), vp);
            }
        }
    }

    /**
      Recursively renderer a {@link Position}.
      <p>
      This method does a pre-order, depth-first-traversal of the tree of
      {@link Position}'s rooted at the parameter {@code position}.
      <p>
      The pre-order "visit node" operation in this traversal first updates the
      "current transformation matrix", ({@code ctm}), using the {@link Matrix}
      in {@code position} and then renders the {@link Model} in {@code position}
      using the updated {@code ctm} in the {@link Model2View} stage.

      @param scene     the {@link Scene} that we are rendering
      @param position  the current {@link Position} object to recursively render
      @param ctm       current model-to-view transformation {@link Matrix}
      @param vp       {@link FrameBuffer.Viewport} to hold rendered image of the {@link Scene}
   */
	static render_position(scene, position, ctm, vp) {
        // Update the current model-to-view transformation matrix.
        ctm = ctm.timesMatrix( position.matrix );

        // Render the Position's Model (if it exits and is visible).
        if ( position.model != null && position.model.visible ) {
            // 1. Apply the current model-to-view coordinate transformation.
            var model1 = Model2View.model2view(position.model, ctm);

            // 2. Apply the Camera's normalizing view-to-camera coordinate transformation.
            var model2 = View2Camera.view2camera(model1, scene.camera.normalizeMatrix);

            // 3. Apply the Camera's projection transformation.
            var model3 = Projection.project(model2, scene.camera);

            // 4. Clip line segments to the camera's view rectangle.
            var model4 = Clip.clip(model3);

            // 5. Rasterize each visible line segment into pixels.
            for (var ls of model4.lineSegmentList) {

                Rasterize.rasterize(model4, ls, vp);
            }
        }

        // Recursively render every nested Position of this Position.
        for (var p of position.nestedPositions) {
            if ( p.visible ) {
                // Do a pre-order, depth-first-traversal from this nested Position.
                Pipeline.render_position(scene, p, ctm, vp);
            }
        }
	}
}
