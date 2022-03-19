import { LineSegment } from "../scene/LineSegment.js";
import { Model } from "../scene/Model.js";
import { Vertex } from "../scene/Vertex.js";

export class SquareGrid extends Model {
    /**
       Create a square in the xy-plane with corners {@code (�r, �r, 0)} and
       with {@code n} grid lines parallel to the y-axis and
       with {@code m} grid lines parallel to the x-axis.
    <p>
       If there are {@code n} grid lines parallel to the y-axis, then each
       grid line parallel to the x-axis will have {@code n+1} line segments.
       If there are {@code m} grid lines parallel to the x-axis, then each
       grid line parallel to the y-axis will have {@code m+1} line segments.
 
       @param r  determines the corners of the square
       @param n  number of grid lines parallel to the y-axis
       @param m  number of grid lines parallel to the x-axis
    */
    constructor(r = 1, n = 0, m = 0){
        super("Square Grid");

        if (n < 0) n = 0;
        if (m < 0) m = 0;

        r = Math.abs(r);
        const xStep = (2 * r) / (1 + n);
        const yStep = (2 * r) / (1 + m);

        // Create the square's geometry.

        // An array of vertices to be used to create the line segments.
        const v = Array.from(Array(m+2), () => new Array(n+2));

        // Create all the vertices.
        for (let i = 0; i <= m+1; ++i) {
            for (let j = 0; j <= n+1; ++j) {
                v[i][j] = new Vertex(-r + j * xStep, -r + i * yStep, 0);
            }
        }

        // Add all of the vertices to this model.
        for (let i = 0; i < m+2; ++i) {
            for (let j = 0; j < n+2; ++j) {
                this.addVertex([ v[i][j] ]);
            }
        }

        // Create the line segments parallel to the x-axis.
        for (let i = 0; i <= m+1; ++i) {
            for (let j = 0; j <= n; ++j) {//           v[i][j]            v[i][j+1]
                this.addLineSegment([new LineSegment( (i * (n+2)) + j, (i * (n+2)) + (j+1) )]);
            }
        }

        // Create the line segments parallel to the y-axis.
        for (let j = 0; j <= n+1; ++j) {
            for (let i = 0; i <= m; ++i) {//           v[i][j]           v[i+1][j]
                this.addLineSegment([new LineSegment( (i * (n+2)) + j, ((i+1) * (n+2)) + j )]);
            }
        }
    }
}