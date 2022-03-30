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
    static doClipping = true;

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
            this.logMessage(position.model, "==== Render Model: " + position.model.name + " ====");

            this.check(position.model);

            this.logVertexList("0. Model    ", position.model);

            // 1. Apply the current model-to-view coordinate transformation.
            var model1 = Model2View.model2view(position.model, ctm);

            this.logVertexList("1. View     ", model1);

            // 2. Apply the Camera's normalizing view-to-camera coordinate transformation.
            var model2 = View2Camera.view2camera(model1, scene.camera.normalizeMatrix);

            this.logVertexList("2. Camera   ", model2);

            // 3. Apply the Camera's projection transformation.
            var model3 = Projection.project(model2, scene.camera);

            this.logVertexList("3. Projected", model3);

            // 4. Clip line segments to the camera's view rectangle.
            var model4 = this.doClipping ? Clip.clip(model3) : model3;

            this.logVertexList("4. Clipped  ", model4);
            this.logColorList("4. Clipped  ", model4);
            this.logLineSegmentList("4. Clipped  ", model4);

            // 5. Rasterize each visible line segment into pixels.
            for (var ls of model4.lineSegmentList) {
                this.logLineSegment("5. Rasterize", model4, ls);

                Rasterize.rasterize(model4, ls, vp);
            }

            this.logMessage(position.model, "==== End Model: " + position.model.name + " ====");
        }
        else {
            if ( position.model != null )
                this.logMessage(position.model, "==== Hidden model: " + position.model.name + " ====");
            else
                if (Pipeline.debug) System.err.println("==== Missing model. ====");
        }

        // Recursively render every nested Position of this Position.
        for (var p of position.nestedPositions) {
            if ( p.visible ) {
                // Do a pre-order, depth-first-traversal from this nested Position.
                Pipeline.render_position(scene, p, ctm, vp);
            }
        }
	}


    /**
        Determine if there are any obvious problems with the {@link Model}
        being rendered. The purpose of these checks is to make the renderer
        a bit more user friendly. If a user makes a simple mistake and tries
        to render a {@link Model} that is missing vertices, line segments,
        or colors, then the user gets a helpful error message.

        @param model  the {@link Model} being rendered
    */
    static check(model) {
        var error = false;
        if (model.vertexList.length === 0) {
            console.error("***WARNING: This model does not have any vertices.");
            error = true;
        }
        if (model.lineSegmentList.length === 0) {
            console.error("***WARNING: This model does not have any line segments.");
            error = true;
        }
        if (model.colorList.length === 0) {
            console.error("***WARNING: This model does not have any colors.");
            error = true;
        }
        if (error) {
            console.error(model);
        }
    }


    /**
        Use the pipeline's and the model's debug variables to determine
        if the given message should be printeed to stderr.

        @param model    the {@link Model} being rendered
        @param message  {@link String} to output to stderr
    */
    static logMessage(model, message) {
        if (Pipeline.debug || model.debug)
            console.log( message );
    }


    /**
         This method prints a {@link String} representation of the given
        {@link Model}'s {@link Vertex} list.

        @param stage  name for the pipeline stage
        @param model  the {@link Model} whose {@link Vertex} list is to be printed
    */
    static logVertexList(stage, model) {
        if (Pipeline.debug || model.debug) {
            var i = 0;
            for (var v of model.vertexList) {
                console.log(`${stage}: vIndex = ${i}, (x,y,z,w)=(${v.x.toFixed(5)}, ${v.y.toFixed(5)}, ${v.z.toFixed(5)}, ${v.w.toFixed(5)})\n`);
                ++i;
            }
        }
    }


    /**
         This method prints a {@link String} representation of the given
        {@link Model}'s {@link Color} list.

        @param stage  name for the pipeline stage
        @param model  the {@link Model} whose {@link Color} list is to be printed
    */
    static logColorList(stage, model) {
        if (Pipeline.debug || model.debug) {
            var i = 0;
            for (var c of model.colorList) {
                console.log(`${stage}: cIndex = ${i}, [${c}]\n`);
                ++i;
            }
        }
    }


    /**
         This method prints a {@link String} representation of the given
        {@link Model}'s {@link LineSegment} list.

        @param stage  name for the pipeline stage
        @param model  the {@link Model} whose line segment list is to be printed
    */
    static logLineSegmentList(stage, model) {
        if (Pipeline.debug || model.debug) {
            for (var ls of model.lineSegmentList) {
                console.log(`${stage}: Line Segment: ([${ls.vIndex[0]}, ${ls.vIndex[1]}], [${ls.cIndex[0]}, ${ls.cIndex[1]}])\n`);
            }
        }
    }


    /**
         This method prints a {@link String} representation of the given
        {@link LineSegment}.

        @param stage  name for the pipeline stage
        @param model  {@link Model} that the {@link LineSegment} {@code ls} comes from
        @param ls     {@link LineSegment} whose string representation is to be printed
    */
    static logLineSegment(stage, model, ls) {
        if (Pipeline.debug || model.debug) {
            console.log( stage + ": " + `Line Segment: ([${ls.vIndex[0]}, ${ls.vIndex[1]}], [${ls.cIndex[0]}, ${ls.cIndex[1]}])\n` );
            const index0 = ls.vIndex[0];
            const index1 = ls.vIndex[1];
            const v0 = model.vertexList[index0];
            const v1 = model.vertexList[index1];
            console.log(`   vIndex = ${index0}, (x,y,z,w)=(${v0.x.toFixed(5)}, ${v0.y.toFixed(5)}, ${v0.z.toFixed(5)}, ${v0.w.toFixed(5)})\n`);
            console.log(`   vIndex = ${index1}, (x,y,z,w)=(${v1.x.toFixed(5)}, ${v1.y.toFixed(5)}, ${v1.z.toFixed(5)}, ${v1.w.toFixed(5)})\n`);

            const cIndex0 = ls.cIndex[0];
            const cIndex1 = ls.cIndex[1];
            const c0 = model.colorList[cIndex0];
            const c1 = model.colorList[cIndex1];
            console.log(`   cIndex = ${cIndex0}, [${c0}]\n`);
            console.log(`   cIndex = ${cIndex1}, [${c1}]\n`);
        }
    }
}
