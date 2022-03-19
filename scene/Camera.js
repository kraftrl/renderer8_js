import { Matrix } from './Matrix.js';
import { Vector } from './Vector.js';
import { PerspectiveNormalizeMatrix } from './PerspectiveNormalizeMatrix.js';
import { OrthographicNormalizeMatrix } from './OrthographicNormalizeMatrix.js';

/**
   This {@code Camera} data structure represents a camera
   located at the origin, looking down the negative z-axis.
<p>
   This {@code Camera} has a {@link normalizeMatrix} which
   associates to this camera a configurable "view volume" that
   determines what part of space the camera "sees" when we use
   the camera to take a picture (that is, when we render a
   {@link Scene}).
<p>
   This {@code Camera} can "take a picture" two ways, using
   a perspective projection or a parallel (orthographic)
   projection. Each way of taking a picture has a different
   shape for its view volume. The data in this data structure
   determines the shape of each of the two view volumes.
<p>
   For the perspective projection, the view volume (in view
   coordinates!) is an infinitely long pyramid that is formed
   by the pyramid with its apex at the origin and its base in
   the plane {@code z = -near} with edges {@code x = left},
   {@code x = right}, {@code y = top}, and {@code y = bottom}.
   The perspective view volume's shape is set by the
   {@link projPerspective} methods which instantiate a
   {@link PerspectiveNormalizeMatrix} as the value of this
   {@code Camera}'s {@link normalizeMatrix}.
<p>
   For the orthographic projection, the view volume (in view
   coordinates!) is an infinitely long rectangular cylinder
   parallel to the z-axis and with sides {@code x = left},
   {@code x = right}, {@code y = top}, and {@code y = bottom}
   (an infinite parallelepiped). The orthographic view volume's
   shape is set by the {@link projOrtho} method which instantiates
   a {@link OrthographicNormalizeMatrix} as the value of this
   {@code Camera}'s {@link normalizeMatrix}.
<p>
   When the graphics rendering {@link renderer.pipeline.Pipeline} uses
   this {@code Camera} to render a {@link Scene}, the renderer only
   "sees" the geometry from the scene that is contained in this camera's
   view volume. (Notice that this means the orthographic camera will see
   geometry that is behind the camera. In fact, the perspective camera
   also sees geometry that is behind the camera.) The renderer's
   {@link renderer.pipeline.Clip} pipeline stage is responsible for
   making sure that the scene's geometry that is outside of this
   camera's view volume is not visible.
<p>
   The plane {@code z = -near} (in view coordinates) is the camera's
   image plane. The rectangle in the image plane with corners
   {@code (left, bottom, -near)} and {@code (right, top, -near)} is
   the camera's view rectangle. The view rectangle is like the film
   in a real camera, it is where the camera's image appears when you
   take a picture. The contents of the camera's view rectangle (after
   it gets "normalized" by the renderer's {@link renderer.pipeline.View2Camera}
   stage) is what gets rasterized, by the renderer's
   {@link renderer.pipeline.RasterizeAntialias} pipeline stage,
   into a {@link renderer.framebuffer.FrameBuffer}.
*/
export class Camera {

   /**
      The default {@code Camera} has the standard (normalized)
      perspective view volume.
   */
    constructor() {
        this.left = -1.0;
        this.right = 1.0;
        this.bottom = -1.0;
        this.up = 1.0;
        this.n = 1.0;

        this.normalizeMatrix = PerspectiveNormalizeMatrix.build(this.left, this.right, this.bottom, this.top, this.n);

        this.perspective = true;
    }
    
    /**
      Set up this {@code Camera}'s view volume as a perspective projection
      of an infinite view pyramid extending along the negative z-axis.

      @param left    left edge of view rectangle in the near plane
      @param right   right edge of view rectangle in the near plane
      @param bottom  bottom edge of view rectangle in the near plane
      @param top     top edge of view rectangle in the near plane
      @param near    distance from the orgin to the near plane
    */
    projPerspective(left, right, bottom, top, near) {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.n = -near;

        this.normalizeMatrix = PerspectiveNormalizeMatrix.build(this.left, this.right, this.bottom, this.top, near);

        this.perspective = true;
    }
    
    /**
      Resets the camera to the default perspective projection.
    */
	projPerspectiveReset() {
		this.projPerspective(-1.0, 1.0, -1.0, 1.0, 1.0);
    }

    /**
      Set up this {@code Camera}'s view volume as a parallel (orthographic)
      projection of an infinite view parallelepiped extending along the
      z-axis.

      @param left    left edge of view rectangle in the xy-plane
      @param right   right edge of view rectangle in the xy-plane
      @param bottom  bottom edge of view rectangle in the xy-plane
      @param top     top edge of view rectangle in the xy-plane
    */
    projOrtho(left, right, bottom, top) {
		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;
		this.n = 0;

		this.normalizeMatrix = OrthographicNormalizeMatrix.build(this.left, this.right, this.bottom, this.top);

		this.perspective = false;
	}

    /**
      Resets the camera to the default orthographic projection.
    */
	projOrthoReset() {
		this.projOrtho(-1.0, 1.0, -1.0, 1.0);
    }

}
