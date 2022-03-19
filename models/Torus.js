import { Model } from './../scene/Model.js';
import { Vertex } from './../scene/Vertex.js';
import { LineSegment } from './../scene/LineSegment.js';

export class Torus extends Model {
    constructor (r1 = 0.75, r2 = 0.25, n = 12, k = 16) {
        super("Torus");

        if (n < 3) n = 3;
        if (k < 3) k = 3;

        // Create the torus's geometry.
        var deltaPhi = (2 * Math.PI) / n;
        var deltaTheta = (2 * Math.PI) / k;

        // An array of vertices to be used to create line segments.
        var v = [];
        for (var j = 0; j < n; ++j) {
            v.push([])
            for (var i = 0; i < k; ++i) {
                v[j].push([]);
            }
        }

        // Create all the vertices.
        for (var j = 0; j < k; ++j) { // choose a rotation around the y-axis
            var c1 = Math.cos(j * deltaTheta);
            var s1 = Math.sin(j * deltaTheta);
            for (var i = 0; i < n; ++i) {
                var c2 = Math.cos(i * deltaPhi);
                var s2 = Math.sin(i * deltaPhi);
                v[i][j] = new Vertex( (r1 + r2*s2) * c1,
                                            r2*c2,
                                     -(r1 + r2*s2) * s1 );
            }
        }

        // Add all of the vertices to this model.
        for (var i = 0; i < n; ++i) {
            for (var j = 0; j < k; ++j) {
                this.addVertex([ v[i][j] ]);
            }
        }

        // Create the vertical cross-section circles.
        for (var j = 0; j < k; ++j) { // choose a rotation around the y-axis
            for (var i = 0; i < n - 1; ++i) {
                this.addLineSegment([new LineSegment( (i * k) + j, ((i+1) * k) + j )]);
            }
            // close the circle
            this.addLineSegment([new LineSegment( ((n-1) * k) + j, (0 * k) + j )]);
        }

        // Create all the horizontal circles around the torus.
        for (var i = 0; i < n; ++i) {
            for (var j = 0; j < k - 1; ++j) {
                this.addLineSegment([new LineSegment( (i * k) + j, (i * k) + (j+1) )]);
            }
            this.addLineSegment([new LineSegment( (i * k) + (k-1), (i * k) + 0 )]);
        }
    }
}
