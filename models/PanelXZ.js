import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';

export class PanelXZ extends Model {
    constructor(xMin = -1, xMax = 1, zMin = -1, zMax = 1, y = 0.0) {
        super("PanelXZ");
        
        // Create the checkerboard panel's geometry.

        // An array of indexes to be used to create line segments.
        var index = [];
        for (var j = 0; j < (xMax- xMin) + 1; ++j) {
            index.push([]);
            for (var i = 0; i < (zMax - zMin) + 1; ++i) {
                index[j].push([]);
            }
        }

        // Create the checkerboard of vertices.
        var i = 0;
        for (var x = xMin; x <= xMax; ++x) {
            for (var z = zMin; z <= zMax; ++z) {
                this.addVertex([new Vertex(x, y, z)]);
                index[x - xMin][z - zMin] = i;
                ++i;
            }
        }

        // Create the line segments that run in the z-direction.
        for (var x = 0; x <= xMax - xMin; ++x) {
            for (var z = 0; z < zMax - zMin; ++z) {
                this.addLineSegment([new LineSegment(index[x][z], index[x][z + 1])]);
            }
        }

        // Create the line segments that run in the x-direction.
        for (var z = 0; z <= zMax - zMin; ++z) {
            for (var x = 0; x < xMax - xMin; ++x) {
                this.addLineSegment([new LineSegment(index[x][z], index[x + 1][z])]);
            }
        }

        console.log(this);
    }
}
