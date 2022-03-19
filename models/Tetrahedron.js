import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';
/**
   Create a wireframe model of a regular tetrahedron
   with its center at the origin, having edge length
   {@code 2*sqrt(2)}, and with its vertices at corners
   of the cube with vertices {@code (±1, ±1, ±1)}.
<p>
   See <a href="https://en.wikipedia.org/wiki/Tetrahedron" target="_top">
                https://en.wikipedia.org/wiki/Tetrahedron</a>

   @see Cube
   @see Octahedron
   @see Icosahedron
   @see Dodecahedron
*/
export class Tetrahedron extends Model {
    constructor(dual = false) {
        super("Tetrahedron");
        
        // Create the tetrahedron's geometry.
        // It has 4 vertices and 6 edges.
        if (!dual) {
            this.addVertex([new Vertex( 1,  1,  1),
                            new Vertex(-1,  1, -1),
                            new Vertex( 1, -1, -1),
                            new Vertex(-1, -1,  1)]);
        }
        else { // create the dual tetrahedron by inverting the coordinates given above
            this.addVertex([new Vertex(-1, -1, -1),
                            new Vertex( 1, -1,  1),
                            new Vertex(-1,  1,  1),
                            new Vertex( 1,  1, -1)]);
        }

        this.addLineSegment([new LineSegment(0, 1),   //top (bottom) edge
                             new LineSegment(2, 3),   //bottom (top) edge
                             new LineSegment(0, 2),
                             new LineSegment(0, 3),
                             new LineSegment(1, 2),
                             new LineSegment(1, 3)]);
    }
}
