import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';

/**
   Create a wireframe model of a frustum of a right circular cone
   with its base in the xz-plane.
<p>
   See <a href="https://en.wikipedia.org/wiki/Frustum" target="_top">
                https://en.wikipedia.org/wiki/Frustum</a>

   @see Cone
   @see ConeSector
*/
export class ConeFrustum extends Model {
   /**
      Create a frustum of a right circular cone with its base in the
      xz-plane, a base radius of {@code r1}, top radius of {@code r2},
      and height {@code h}.
   <p>
      This model works with either {@code r1 > r2} or {@code r1 < r2}.
      In other words, the frustum can have its "apex" either above or
      below the xz-plane.
   <p>
      There must be at least three lines of longitude and at least
      two circles of latitude.

      @param r1  radius of the base of the frustum
      @param h   height of the frustum
      @param r2  radius of the top of the frustum
      @param n   number of circles of latitude
      @param k   number of lines of longitude
   */
   constructor(r1, h, r2, n, k)
   {
      super("Cone Frustum");

      if (n < 2) n = 2;
      if (k < 3) k = 3;

      // Create the frustum's geometry.

      const deltaTheta = (2 * Math.PI) / k;

      // An array of indexes to be used to create line segments.
      var indexes = new Array(n);
      for (var i = 0; i < n; i++) {
          indexes[i] = new Array(k);
      }

      // Create all the vertices.
      var index = 0;
      for (var j = 0; j < k; ++j) { // choose an angle of longitude
         var c = Math.cos(j * deltaTheta);
         var s = Math.sin(j * deltaTheta);
         for (var i = 0; i < n; ++i) {  // choose a circle of latitude
            var slantRadius = (i/(n-1)) * r1 + ((n-1-i)/(n-1)) * r2;
            this.addVertex( [new Vertex(slantRadius * c,
                                  h - (i*h)/(n-1),
                                  slantRadius * s)] );
            indexes[i][j] = index++;
         }
      }
      this.addVertex( [new Vertex(0, h, 0)] );  // top center
      const topCenterIndex = index++;
      this.addVertex( [new Vertex(0, 0, 0)] );  // bottom center
      const bottomCenterIndex = index++;

      // Create all the horizontal circles of latitude around the frustum wall.
      for (var i = 0; i < n; ++i) {
         for (var j = 0; j < k-1; ++j) {
            this.addLineSegment([new LineSegment(indexes[i][j], indexes[i][j+1])]);
         }
         // close the circle
         this.addLineSegment([new LineSegment(indexes[i][k-1], indexes[i][0])]);
      }

      // Create the vertical half-trapazoids of longitude from north to south pole.
      for (var j = 0; j < k; ++j) {
         // Create the triangle fan at the top.
         this.addLineSegment([new LineSegment(topCenterIndex, indexes[0][j])]);
         // Create the slant lines from the top to the base.
         this.addLineSegment([new LineSegment(indexes[0][j], indexes[n-1][j])]);
         // Create the triangle fan at the base.
         this.addLineSegment([new LineSegment(indexes[n-1][j], bottomCenterIndex)]);
      }
   }
}//ConeFrustum
