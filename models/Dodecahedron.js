import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';

export class Dodecahedron extends Model {

    constructor() {
        super("Dodecahedron");

        // Create the dodecahedron's geometry.
        // It has 20 vertices and 30 edges.
        var t = (1 + Math.sqrt(5))/2;   // golden ratio
        var r = 1/t;
        var r2 = r * r;
        //https://en.wikipedia.org/wiki/Regular_dodecahedron#Cartesian_coordinates
        // (±r, ±r, ±r)
        this.addVertex([new Vertex(-r, -r, -r),
                        new Vertex(-r, -r,  r),
                        new Vertex(-r,  r, -r),
                        new Vertex(-r,  r,  r),
                        new Vertex( r, -r, -r),
                        new Vertex( r, -r,  r),
                        new Vertex( r,  r, -r),
                        new Vertex( r,  r,  r)]);

        // (0, ±r2, ±1)
        this.addVertex([new Vertex( 0, -r2, -1),
                        new Vertex( 0, -r2,  1),
                        new Vertex( 0,  r2, -1),
                        new Vertex( 0,  r2,  1)]);

        // (±r2, ±1, 0)
        this.addVertex([new Vertex(-r2, -1,  0),
                        new Vertex(-r2,  1,  0),
                        new Vertex( r2, -1,  0),
                        new Vertex( r2,  1,  0)]);

        // (±1, 0, ±r2)
        this.addVertex([new Vertex(-1,  0, -r2),
                        new Vertex( 1,  0, -r2),
                        new Vertex(-1,  0,  r2),
                        new Vertex( 1,  0,  r2)]);


        // Create 30 line segments (that make up 12 faces).
        this.addLineSegment([new LineSegment( 3, 11),
                             new LineSegment(11,  7),
                             new LineSegment( 7, 15),
                             new LineSegment(15, 13),
                             new LineSegment(13,  3)]);

        this.addLineSegment([new LineSegment( 7, 19),
                             new LineSegment(19, 17),
                             new LineSegment(17,  6),
                             new LineSegment( 6, 15)]);

        this.addLineSegment([new LineSegment(17,  4),
                             new LineSegment( 4,  8),
                             new LineSegment( 8, 10),
                             new LineSegment(10,  6)]);

        this.addLineSegment([new LineSegment( 8,  0),
                             new LineSegment( 0, 16),
                             new LineSegment(16,  2),
                             new LineSegment( 2, 10)]);

        this.addLineSegment([new LineSegment( 0, 12),
                             new LineSegment(12,  1),
                             new LineSegment( 1, 18),
                             new LineSegment(18, 16)]);

        this.addLineSegment([new LineSegment( 2, 13)]);

        this.addLineSegment([new LineSegment(18,  3)]);

        this.addLineSegment([new LineSegment( 1,  9),
                             new LineSegment( 9, 11)]);

        this.addLineSegment([new LineSegment( 4, 14),
                             new LineSegment(14, 12)]);

        this.addLineSegment([new LineSegment( 9,  5),
                             new LineSegment( 5, 19)]);

        this.addLineSegment([new LineSegment( 5, 14)]);
    }

}
