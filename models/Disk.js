import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';

export class Disk extends Model {

    constructor(r = 1, n = 6, k = 12) {
        super("Disk");
        
        if (n < 1) n = 1;
        if (k < 3) k = 3;

        // Create the disk's geometry.

        var deltaR = r / n;
        var deltaTheta = 2 * Math.PI / k;

        // An array of vertices to be used to create line segments.
        var v = [];
        for (var j = 0; j < n; ++j) {
            v.push([]);
            for (var i = 0; i < k; ++i) {
             v[j].push([]);   
            }
        }

        // Create all the verticies
        for (var j = 0; j < k; ++j) {
            var c = Math.cos(j * deltaTheta);
            var s = Math.sin(j * deltaTheta);
            for (var i = 0; i < n; ++i) { // move along the spoke
                var ri = (i + 1) * deltaR;
                v[i][j] = new Vertex( ri * c,
                                      ri * s,
                                      0);

            }
        }
        var center = new Vertex(0,0,0);

        // Add all of the vertices to this model.
        for (var i = 0; i < n; ++i) {
            for (var j = 0; j < k; ++j) {
                this.addVertex([ v[i][j] ]);
            }
        }
        this.addVertex([ center ]);
        var centerIndex = n * k;
        
        // Create the spokes connecting the center to the outer circle.
        for (var j = 0; j < k; ++j) { // choose a spoke
            this.addLineSegment([ new LineSegment( centerIndex, (0 * k) + j ) ]);
            for (var i = 0; i < n - 1; ++i) {
                this.addLineSegment([ new LineSegment( (i * k) + j, ((i+1) * k) + j ) ]);
            }
        }

        // Create the line segments around each concentric circle.
        for (var i = 0; i < n; ++i) { // choose a circle
            for (var j = 0; j < k - 1; ++j) {
                this.addLineSegment([ new LineSegment( (i * k) + j, (i * k) + (j + 1) ) ]);
            }
            // close the circle
            this.addLineSegment([ new LineSegment( (i * k) + (k-1), (i * k) + 0 ) ]);
        }

        // console.log(this.lineSegmentList);
        
    }

}
