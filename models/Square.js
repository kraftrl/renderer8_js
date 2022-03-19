import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';

export class Square extends Model {
    constructor(r = 1) {
        super("Square");
        
        r = Math.abs(r);

        // Create the square's geometry.
        this.addVertex([new Vertex(-r, -r, 0),
                        new Vertex(-r,  r, 0),
                        new Vertex( r,  r, 0),
                        new Vertex( r, -r, 0)]);

        this.addLineSegment([new LineSegment(0, 1),
                             new LineSegment(1, 2),
                             new LineSegment(2, 3),
                             new LineSegment(3, 0)]);
    }
}//Square
