import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';

export class Sphere extends Model {
    constructor (r = 1, n = 15, k = 16) {
        super("Sphere");
        
        if (n < 1) n = 1;
        if (k < 3) k = 3;
        
        // Create the sphere's geometry.       

        var deltaPhi = Math.PI / (n + 1);
        var deltaTheta = (2 * Math.PI) / k;

        // An array of vertices to be used to create line segments.
        var v = [];
        for (var j = 0; j < n; ++j) {
            v.push([]);
            for (var i = 0; i < k; ++i) {
             v[j].push([]);   
            }
        }
        
        for (var j = 0; j < k; ++j) { // choose an angle of longitude
            var c1 = Math.cos(j * deltaTheta);
            var s1 = Math.sin(j * deltaTheta);
            for (var i = 0; i < n; ++i) { // choose an angle of latitude
                var c2 = Math.cos(deltaPhi + i * deltaPhi);
                var s2 = Math.sin(deltaPhi + i * deltaPhi);
                // console.log(v[i]);
                v[i][j] = new Vertex( r * s2 * c1,
                                      r * c2,
                                     -r * s2 * s1 );
            }
        }
        var northPole = new Vertex(0,  r, 0);
        var southPole = new Vertex(0, -r, 0);
        
        // Add all of the verticies to this model
        for (var i = 0; i < n; ++i) {
            for (var j = 0; j < k; ++j) {
                this.addVertex( [ v[i][j] ] );
            }
        }

        this.addVertex( [ northPole ] );
        this.addVertex( [ southPole ] );
        var northPoleIndex = n * k;
        var southPoleIndex = northPoleIndex + 1;

        // Create the horizontal circles of latitude around the sphere.
        for (var i = 0; i < n; ++i) {
            for (var j = 0; j < k - 1; ++j) {
                this.addLineSegment([ new LineSegment( (i * k) + j,  (i * k) + (j+1) ) ]);
            }
            // close the circle
            this.addLineSegment([ new LineSegment( (i * k) + (k-1), (i * k) + 0 ) ]);
        }

        for (var j = 0; j < k; ++j) {
            this.addLineSegment([ new LineSegment( northPoleIndex, (0 * k) + j ) ]);
            for (var i = 0; i < n - 1; ++i) {
                this.addLineSegment([ new LineSegment( (i * k) + j, ((i+1) * k) + j ) ]);
            }
            this.addLineSegment([ new LineSegment( ((n-1) * k) + j, southPoleIndex ) ]);
        }
    }
}
