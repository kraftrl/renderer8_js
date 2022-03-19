import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';
import { Cube } from './../models/Cube.js';

export class Cube4 extends Cube {
    constructor(xCount = 2, yGrid = 1, zCount = 2) {
        super("Cube4");
        
        var index = 8;
        
        if (xCount < 1) xCount = 1;
        if (yGrid  < 0) yGrid  = 0;
        if (zCount < 1) zCount = 1;

        var xStep = 2.0 / xCount;
        var yStep = 2.0 / (1 + yGrid);
        var zStep = 2.0 / zCount;

        this.addVertex([ new Vertex(0,  1,  0) ]);
        var centerTop = index++;
        this.addVertex([ new Vertex(0, -1,  0) ]);
        var centerBottom = index++;

        // Triangles along all four edges parallel to the x-axis.
        var x = -1.0;
        for (var i = 0; i <= xCount; ++i) {
            // top face, front and back edges
            this.addVertex([new Vertex(x,  1,  1),
                            new Vertex(x,  1, -1)]);
            this.addLineSegment([new LineSegment(index+0, centerTop),
                                 new LineSegment(index+1, centerTop)]);
            // bottom face, front and back edges
            this.addVertex([new Vertex(x, -1,  1),
                            new Vertex(x, -1, -1)]);
            this.addLineSegment([new LineSegment(index+2, centerBottom),
                                 new LineSegment(index+3, centerBottom)]);
            index += 4;
            x += xStep;
        }

        // Grid lines perpendicular to the x-axis.
        x = -1.0;
        for (var i = 0;i < xCount; ++i) {
            x += xStep;
            // front and back faces only
            this.addVertex([new Vertex(x,  1,  1),
                            new Vertex(x, -1,  1)]);
            this.addLineSegment([new LineSegment(index+0, index+1)]);
            this.addVertex([new Vertex(x, -1, -1),
                            new Vertex(x,  1, -1)]);
            this.addLineSegment([new LineSegment(index+2, index+3)]);
            index += 4;
        }

        // Grid lines perpendicular to the y-axis.
        var y = -1.0;
        for (var i = 0; i < yGrid; ++i) {
            y += yStep;
            // Start at the front, right edge, go left across the front face, and around the cube.
            this.addVertex([new Vertex( 1, y,  1),
                            new Vertex(-1, y,  1),
                            new Vertex(-1, y, -1),
                            new Vertex( 1, y, -1)]);
            this.addLineSegment([new LineSegment(index+0, index+1),
                                 new LineSegment(index+1, index+2),
                                 new LineSegment(index+2, index+3),
                                 new LineSegment(index+3, index+0)]);
            index += 4;
        }
        // Grid lines perpendicular to the z-axis.
        var z = -1.0;
        for (var i = 0; i < zCount; ++i) {
            z += zStep;
            // left and right faces only
            this.addVertex([new Vertex(-1,  1, z),
                            new Vertex(-1, -1, z)]);
            this.addLineSegment([new LineSegment(index+0, index+1)]);
            this.addVertex([new Vertex( 1, -1, z),
                            new Vertex( 1,  1, z)]);
            this.addLineSegment([new LineSegment(index+2, index+3)]);
            index += 4;
        }

        // Triangles along all four edges parallel to the z-axis.
        z = -1.0;
        for (var i = 0; i <= zCount; ++i) {
            // top face, right and left edges
            this.addVertex([new Vertex( 1,  1, z),
                            new Vertex(-1,  1, z)]);
            this.addLineSegment([new LineSegment(index+0, centerTop),
                                 new LineSegment(index+1, centerTop)]);
            // bottom face, right and left edges
            this.addVertex([new Vertex( 1, -1, z),
                            new Vertex(-1, -1, z)]);
            this.addLineSegment([new LineSegment(index+2, centerBottom),
                                 new LineSegment(index+3, centerBottom)]);
            index += 4;
            z += zStep;
        }
    }
}
