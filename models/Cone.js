import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';

/**
   Create a wireframe model of a right circular cone with its base
   parallel to the xz-plane and its apex on the positive y-axis.
<p>
   See <a href="https://en.wikipedia.org/wiki/Cone" target="_top">
                https://en.wikipedia.org/wiki/Cone</a>
<p>
   This model can also be used to create right k-sided polygonal pyramids.
<p>
   See <a href="https://en.wikipedia.org/wiki/Pyramid_(geometry)" target="_top">
                https://en.wikipedia.org/wiki/Pyramid_(geometry)</a>

   @see ConeFrustum
*/
export class Cone extends ConeSector {
    /**
      Create a right circular cone with its base in the xz-plane,
      a base radius of 1, height 1, and apex on the positve y-axis.
    */
    constructor(r = 1, h = 1, n = 15, k = 16) {
        super(r, h, h, 0, 2*Math.PI, n, k);
    }

}
