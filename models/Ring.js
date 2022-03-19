import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';

export class Ring extends Model {

    constructor(r1 = 1.0, r2 = 0.33, n = 4, k = 12) {
        super("Ring");
        
        if (n < 1) n = 1;
        if (k < 3) k = 3;

        // Create the rings's geometry.
        var deltaR = (r1 - r2) / n;
        var deltaTheta = (2 * Math.PI) / k;

        // An array of vertices to be used to create line segments.
        var v = [];
        for (var j = 0; j < n+1; ++j) {
            v.push([]);
            for (var i = 0; i < k; ++k) {
                v[j].push([])
            }
        }

        // Create all the vertices.
        for (var j = 0; j < k; ++j) {
            var c = Math.cos(j * deltaTheta);
            var s = Math.sin(j * deltaTheta);
            for (var i = 0; i < n + 1; ++i) {
                var ri = r2 + i * deltaR;
                v[i][j] = new Vertex(ri * c,
                                     ri * s,
                                     0);
            }
        }

        // Add all of the vertices to this model.
        for (var i = 0; i < n+1; ++i) {
            for (var j = 0; j < k; ++j) {
                this.addVertex([ v[i][j] ]);
            }
        }
        
        // Create line segments around each concentric ring.
        for (var i = 0; i < n + 1; ++i) { // chose a ring
            for (var j = 0; j < k - 1; ++j) {
                this.addLineSegment([ new LineSegment( (i * k) + j, (i * k) + (j+1) ) ]);
            }
            // close the circle
            this.addLineSegment([ new LineSegment( (i * k) + (k-1), (i * k) + 0 ) ]);
        }

        for (var j = 0; j < k; ++j) {  // choose a spoke
            for (var i = 0; i < n; ++i) {
                this.addLineSegment([ new LineSegment( (i * k) + j, ((i+1) * k) + j ) ]);
            }
        }        
    }
}
