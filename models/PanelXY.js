import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';

export class PanelXY extends Model {
    constructor (xMin = -1, xMax = 1, yMin = -1, yMax = 1, z = 0.0) {
        super("PanelXY");

        // Create the checkerboard panel's geometry.
        var index = [];
        for (var j = 0; j < (xMax - xMin) + 1; ++j) {
            index.push([]);
            for (var i = 0; i < (yMax - yMin) + 1; ++i) {
                index[j].push([]);
            }
        }

        // Create the checkerboard of verticies
        var i = 0;
        for (var x = xMin; x <= xMax; ++x) {
            for (var y = yMin; y <= yMax; ++y) {
                this.addVertex([new Vertex(x, y, z)]);
                index[x - xMin][y - yMin] = i;
                ++i;
            }
        }

        // Create the line segments that run in the y-direction.
        for (var x = 0; x <= xMax - xMin; ++x) {
            for (var y = 0; y < yMax - yMin; ++y) {
                this.addLineSegment([new LineSegment(index[x][y], index[x][y+1])]);
            }
        }

        // Create the line segments that run in the x-direction.
        for (var y = 0; y <= yMax - yMin; ++y) {
            for (var x = 0; x < xMax - xMin; ++x) {
                this.addLineSegment([new LineSegment(index[x][y], index[x+1][y])]);
            }
        }
    }
}//PanelXY
