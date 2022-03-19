import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';

export class ConeSector extends Model  {
    constructor(r, h, t, theta1, theta2, n, k) {
        super("Cone Sector");

        if (n < 2) n = 2;
        if (k < 4) k = 4;
        if (t > h) t = h;

        // Create the cone's geometry
        const deltaH = h / (n - 1);
        const deltaTheta = (theta2 - theta1) / (k - 1);

        var indexes = [];
        for (var j = 0; j < n; ++j) {
            indexes.push([])
            for (var i = 0; i < k; ++i) {
                indexes[j].push([]);
            }
        }

        // Create all the vertices.
        var index = 0;
        for (var j = 0; j < k; ++j) { // choose an angle of longitude
            var c = Math.cos(theta1 + j * deltaTheta);
            var s = Math.sin(theta1 + j * deltaTheta);
            for (var i = 0; i < n; ++i) { // choose a circle of latitude
                var slantRadius = r * (1 - i * deltaH / h);
                this.addVertex([ new Vertex(slantRadius * c,
                                            i * deltaH,
                                            slantRadius * s)]);
                indexes[i][j] = index++;
            }
        }
        this.addVertex([ new Vertex(0, h, 0) ]); // apex
        var apexIndex = index++;
        this.addVertex([ new Vertex(0, 0, 0) ]); // bottom center
        var bottomCenterIndex = index++;

        // Create the horizontal (partial) circles of latitude around the cone.
        for (var i = 0; i < n; ++i) {
            for (var j = 0; j < k - 1; ++j) {
                this.addLineSegment([new LineSegment(indexes[i][j], indexes[i][j+1])]);
            }
        }

        // Create the slanted lines of longitude from the base to the
        // top circle of latitude, and the triangle fan in the base.
        for (var j = 0; j < k; ++j) {
            this.addLineSegment([new LineSegment(bottomCenterIndex, indexes[0][j])]);

            for (var i = 0; i < n - 1; ++i) {
                this.addLineSegment([new LineSegment(indexes[i][j], indexes[i+1][j])]);
            }
        }
    }

}
