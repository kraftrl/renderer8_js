import { Model } from '../../scene/Model.js';
import { LineSegment } from '../../scene/LineSegment.js';
import { Vertex } from '../../scene/Vertex.js';

export class Model_1 extends Model {
    constructor(r = 1) {
        super("Model_1");
        
        r = Math.abs(r);

        // a square
        let v0 = new Vertex( r,  r, 0);  
        let v1 = new Vertex(-r,  r, 0);
        let v2 = new Vertex(-r, -r, 0);
        let v3 = new Vertex( r, -r, 0);

        this.addVertex([v0, v1, v2, v3]);

        this.addLineSegment([new LineSegment(0, 1),
                             new LineSegment(1, 2),
                             new LineSegment(2, 3),
                             new LineSegment(3, 0)]);

        // another square                     
        let v4 = new Vertex( 2*r,  2*r, 0);
        let v5 = new Vertex(-2*r,  2*r, 0);
        let v6 = new Vertex(-2*r, -2*r, 0);
        let v7 = new Vertex( 2*r, -2*r, 0);

        this.addVertex([v4,v5,v6,v7]);

        this.addLineSegment([new LineSegment(4, 5),
                             new LineSegment(5, 6),
                             new LineSegment(6, 7),
                             new LineSegment(7, 4)]);

        
        // // two more line segments
        let v8 = new Vertex(-2*r,    r, 0);
        let v9 = new Vertex(   r, -2*r, 0);

        this.addVertex([v8,v9]);
        this.addLineSegment([new LineSegment(0, 4),
                             new LineSegment(8, 9)]);
    }
}//Model_1