import { Model } from './../scene/Model.js';
import { Vertex } from './../scene/Vertex.js';
import { LineSegment } from './../scene/LineSegment.js';

export class Pyramid extends Model {

    constructor(s = 2.0, h = 1.0, n = 15, k = 4, grid = false) {
        super("Pyramid");

        if (n < 1) n = 1;
        if (k < 1) k = 1;

        // Create the pyramid's geometry.
        this.addVertex([new Vertex(0, h, 0)]);
        var apexIndex = 0;
        var index = 1;

        // Create all the lines of "longitude" from the apex, down
        // to the base, across the base, and then back up to the apex.
        s = s/2;
        var delta = (2 * s) / k;

        // lines of "longitude" perpendicular to the x-axis
        for (var j = 0; j < k + 1; ++j) {
            d = j * delta;
            if (grid) {
                this.addVertex([new Vertex(-s+d, 0, -s),
                                new Vertex(-s+d, 0,  s)]);
            }
            else { // a fan in the base
                this.addVertex([new Vertex(-s+d, 0, -s),
                                new Vertex( s-d, 0,  s)]);
            }
            this.addLineSegment([new LineSegment(apexIndex, index+0),
                                 new LineSegment(index+0, index+1),
                                 new LineSegment(index+1, apexIndex)]);

            index += 2;
        }
        // lines of "longitude" perpendicular to the z-axis
        for (var j = 1; j < k; ++j) {
            var d = j * delta;
            if (grid) {
                this.addVertex([new Vertex( s, 0, -s+d),
                                new Vertex(-s, 0, -s+d)]);
            }
            else {
                this.addVertex([new Vertex( s, 0, -s+d),
                                new Vertex(-s, 0,  s-d)]);
            }
            this.addLineSegment([new LineSegment(apexIndex, index+0),
                                 new LineSegment(index+0, index+1),
                                 new LineSegment(index+1, apexIndex)]);
            index += 2;
        }
        // Create all the lines of "latitude" around the pyramid, starting
        // from the base and working upwards.
        var deltaH = h / n;
        var deltaS = s / n;
        for (var i = 0; i < n; ++i) {
            h = i * deltaH;
            this.addVertex([new Vertex( s, h,  s),
                            new Vertex( s, h, -s),
                            new Vertex(-s, h, -s),
                            new Vertex(-s, h,  s)]);
            this.addLineSegment([new LineSegment(index+0, index+1),
                                 new LineSegment(index+1, index+2),
                                 new LineSegment(index+2, index+3),
                                 new LineSegment(index+3, index+0)]);
            s -= deltaS;
            index += 4;
        }
    }
}
