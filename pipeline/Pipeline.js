import { Position } from './../scene/Position.js';
import { Rasterize } from './Rasterize.js';
import { Model2View } from './Model2View.js';
import { Projection } from './Projection.js';
import { View2Camera } from './View2Camera.js';
import { Clip } from './Clip.js';

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
      @param vp     Viewport to hold the {@link Scene}
    */
	static render(scene, vp) {
        // Render every Model in the Scene.
		for(var position of scene.positionList) {
			if (!position.model.visible) continue;
            // else if model is visible

            // 1. Apply the Position's model-to-view coordinate transformation
            var model2 = Model2View.model2view(position.model, position.matrix);

            // 2. Apply the Camera's normalizing view-to-camera coordinate transformation
            var model3 = View2Camera.view2camera(model2, scene.camera.normalizeMatrix);

            // 3. Apply the projection transformation.
            var model4 = Projection.project(model3, scene.camera);

            //console.log(model4.lineSegmentList);
            
            // 4. Clip each line segment to the camera's view rectangle.
            /*
            var lineSegmentList2 = [];
            for (var ls of model4.lineSegmentList) {
                if (Clip.clip(model4, ls)) {
                    lineSegmentList2.push(ls);
                }
            }
            model4.lineSegmentList = lineSegmentList2;
            */
            var model5 = Clip.clip(model4);
            

            // 5. Rasterize each visible line segment into pixels.
            for(var ls of model5.lineSegmentList) {
                if (ls != []) {
                    Rasterize.rasterize(model5, ls, vp);
                }
            }
		}
	}
}
