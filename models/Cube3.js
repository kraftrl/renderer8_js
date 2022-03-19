import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';
import { Cube } from './../models/Cube.js';

export class Cube3 extends Cube {

    constructor (xCount = 1, yCount = 1, zCount = 1) {
        super(); // create the basic cube with 8 vertices and 12 edges
        this.name = "Cube3";
        
        var index = 8;

        if (xCount < 1) xCount = 1;
        if (yCount < 1) yCount = 1;
        if (zCount < 1) zCount = 1;

        var xStep = 2.0 / xCount;
        var yStep = 2.0 / yCount;
        var zStep = 2.0 / zCount;

        this.addVertex([ new Vertex(0,  0,  1) ]);
        var centerFront = index++;
        this.addVertex([ new Vertex(0,  0, -1) ]);
        var centerBack = index++;
        this.addVertex([ new Vertex(0,  1,  0) ]);
        var centerTop = index++;
        this.addVertex([ new Vertex(0, -1,  0) ]);
        var centerBottom = index++;
        this.addVertex([ new Vertex( 1, 0,  0) ]);
        var centerRight = index++;
        this.addVertex([ new Vertex(-1, 0,  0) ]);
        var centerLeft = index++;

        // Triangles along all four edges parallel to the x-axis.
        var x = -1.0;
        for (var i = 0; i <= xCount; ++i) {
            this.addVertex([new Vertex(x,  1,  1),
                            new Vertex(x, -1,  1),
                            new Vertex(x,  1, -1),
                            new Vertex(x, -1, -1)]);
            // front face, top and bottom edges
            this.addLineSegment([new LineSegment(index+0, centerFront),
                                 new LineSegment(index+1, centerFront)]);
            // back face, top and bottom edges
            this.addLineSegment([new LineSegment(index+2, centerBack),
                                 new LineSegment(index+3, centerBack)]);
            // top face, front and back edges
            this.addLineSegment([new LineSegment(index+0, centerTop),
                                 new LineSegment(index+2, centerTop)]);
            // bottom face, front and back edges
            this.addLineSegment([new LineSegment(index+1, centerBottom),
                                 new LineSegment(index+3, centerBottom)]);
            x += xStep;
            index += 4;
        }
        
        // Triangles along all four edges parallel to the y-axis.
        var y = -1.0;
        for (var i = 0; i <= yCount; ++i) {
            this.addVertex([new Vertex( 1, y,  1),
                            new Vertex(-1, y,  1),
                            new Vertex( 1, y, -1),
                            new Vertex(-1, y, -1)]);
            // front face, right and left edges
            this.addLineSegment([new LineSegment(index+0, centerFront),
                                 new LineSegment(index+1, centerFront)]);
            // back face, right and left edges
            this.addLineSegment([new LineSegment(index+2, centerBack),
                                 new LineSegment(index+3, centerBack)]);
            // right face, front and back edges
            this.addLineSegment([new LineSegment(index+0, centerRight),
                                 new LineSegment(index+2, centerRight)]);
            // left face, front and back edges
            this.addLineSegment([new LineSegment(index+1, centerLeft),
                                 new LineSegment(index+3, centerLeft)]);
            y += yStep;
            index += 4;
        }

        // Triangles along all four edges parallel to the z-axis.
        var z = -1.0;
        for (var i = 0; i <= zCount; ++i) {
            this.addVertex([new Vertex( 1,  1, z),
                            new Vertex(-1,  1, z),
                            new Vertex( 1, -1, z),
                            new Vertex(-1, -1, z)]);
        // top face, right and left edges
        this.addLineSegment([new LineSegment(index+0, centerTop),
                             new LineSegment(index+1, centerTop)]);
        // bottom face, right and left edges
        this.addLineSegment([new LineSegment(index+2, centerBottom),
                             new LineSegment(index+3, centerBottom)]);
        // right face, top and bottom edges
        this.addLineSegment([new LineSegment(index+0, centerRight),
                             new LineSegment(index+2, centerRight)]);
        // left face, top and bottom edges
        this.addLineSegment([new LineSegment(index+1, centerLeft),
                             new LineSegment(index+3, centerLeft)]);
        z += zStep;
        index += 4;
        }
    }
}
