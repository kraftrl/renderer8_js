import { Model } from './../scene/Model.js';
import { Vertex } from './../scene/Vertex.js';
import { LineSegment } from './../scene/LineSegment.js';

export class Triangle extends Model {

    constructor (theta = 0, n) {
        super("Triangle");
        var theta1 = theta * Math.PI/180.0;
        var theta2 = 2.0 * Math.PI / 3.0;
        
        this.addVertex([new Vertex(Math.cos(theta1),
                                  Math.sin(theta1),
                                  0.0)]);

        this.addVertex([new Vertex(Math.cos(theta1 + theta2),
                                  Math.sin(theta1 + theta2),
                                  0.0)]);
        this.addVertex([new Vertex(Math.cos(theta1 + 2*theta2),
                                  Math.sin(theta1 + 2*theta2),
                                  0.0)]);

        this.addLineSegment([new LineSegment(0, 1)]);
        this.addLineSegment([new LineSegment(1, 2)]);
        this.addLineSegment([new LineSegment(2, 0)]);

        if (n > 0) {
            this.barycentric(0, 1, 2, n);
        }
    }

    barycentric(vIndex0, vIndex1, vIndex2, n) {
        v0 = this.vertexList[vIndex0];
        v1 = this.vertexList[vIndex1];
        v2 = this.vertexList[vIndex2];
        index = this.vertexList.length;

        if (n > 0) {
            // Barycentric subdivision.
            // https://en.wikipedia.org/wiki/Barycentric_subdivision
            
            // Add four vertices to the model.
            this.addVertex(new Vertex(
                            (v0.x + v1.x + v2.x)/3.0,
                            (v0.y + v1.y + v2.y)/3.0,
                            (v0.z + v1.z + v2.z)/3.0));
            this.addVertex(new Vertex(
                            (v0.x + v1.x)/2.0,
                            (v0.y + v1.y)/2.0,
                            (v0.z + v1.z)/2.0));
            this.addVertex(new Vertex(
                            (v1.x + v2.x)/2.0,
                            (v1.y + v2.y)/2.0,
                            (v1.z + v2.z)/2.0));
            this.addVertex(new Vertex(
                            (v2.x + v0.x)/2.0,
                            (v2.y + v0.y)/2.0,
                            (v2.z + v0.z)/2.0));
            // Give a name to the index of each of the four new vertices.
            var vIndexCenter = index;
            var vIndex01     = index + 1;
            var vIndex12     = index + 2;
            var vIndex20     = index + 3;
            // 6 new line segments
            this.addLineSegment([new LineSegment(vIndex0,  vIndexCenter)]);
            this.addLineSegment([new LineSegment(vIndex1,  vIndexCenter)]);
            this.addLineSegment([new LineSegment(vIndex2,  vIndexCenter)]);
            this.addLineSegment([new LineSegment(vIndex01, vIndexCenter)]);
            this.addLineSegment([new LineSegment(vIndex12, vIndexCenter)]);
            this.addLineSegment([new LineSegment(vIndex20, vIndexCenter)]);

            this.barycentric(vIndex0, vIndex01, vIndexCenter, n-1);
            this.barycentric(vIndex0, vIndex20, vIndexCenter, n-1)
            this.barycentric(vIndex1, vIndex01, vIndexCenter, n-1);
            this.barycentric(vIndex1, vIndex12, vIndexCenter, n-1);
            this.barycentric(vIndex2, vIndex12, vIndexCenter, n-1);
            this.barycentric(vIndex2, vIndex20, vIndexCenter, n-1);

        }
    }
}
