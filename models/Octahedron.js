import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';

export class Octahedron extends Model {

    constructor() {
        super("Octahedron");
        
        // Create the octahedron's geometry.
        // It has 6 vertices and 12 edges.
        this.addVertex([new Vertex( 1,  0,  0),
                        new Vertex( 0,  0, -1),
                        new Vertex(-1,  0,  0),
                        new Vertex( 0,  0,  1),
                        new Vertex( 0,  1,  0),
                        new Vertex( 0, -1,  0)]);

        // Create 12 line segments.
        // four line segments around the center plane
        this.addLineSegment([new LineSegment(0, 1),
                             new LineSegment(1, 2),
                             new LineSegment(2, 3),
                             new LineSegment(3, 0)]);
        // edges going to the top vertex
        this.addLineSegment([new LineSegment(0, 4),
                             new LineSegment(1, 4),
                             new LineSegment(2, 4),
                             new LineSegment(3, 4)]);
        // edges going to the bottom vertex
        this.addLineSegment([new LineSegment(0, 5),
                             new LineSegment(1, 5),
                             new LineSegment(2, 5),
                             new LineSegment(3, 5)]);
    }

}
