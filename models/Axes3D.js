import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';
import { Color } from '../color/Color.js';

export class Axes3D extends Model {
    /**
      Create an x, y, and z axis with the
      given endpoints for each axis.
      Use the given {@link Color} for each axis.

      @param xMin  left endpoint of the x-axis
      @param xMax  right endpoint of the x-axis
      @param yMin  bottom endpoint of the y-axis
      @param yMax  top endpoint of the y-axis
      @param zMin  back endpoint of the z-axis
      @param zMax  front endpoint of the z-axis
      @param cX    color for the x-axis
      @param cY    color for the y-axis
      @param cZ    color for the z-axis
    */
    constructor(xMin = -1.0, xMax = 1.0, yMin = -1.0, yMax = 1.0, zMin = -1.0, zMax = 1.0, cX = Color.Black, cY = Color.Black, cZ = Color.Black) {
        super("Axes 3D");
        this.addVertex([new Vertex (xMin, 0, 0),
                        new Vertex (xMax, 0, 0),
                        new Vertex (0, yMin, 0),
                        new Vertex (0, yMax, 0),
                        new Vertex (0, 0, zMin),
                        new Vertex (0, 0, zMax)]);

        this.addColor(cX, cY, cZ);

        this.addLineSegment([new LineSegment(0, 1, 0, 0),
                             new LineSegment(2, 3, 1, 1),
                             new LineSegment(4, 5, 2, 2)]);

    }
}
