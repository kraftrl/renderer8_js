import { Matrix } from './Matrix.js';
import { Vector } from './Vector.js';

export class OrthographicNormalizeMatrix {

    static build(l, r, b, t) {
        var m1 = Matrix.build(new Vector(1.0,          0.0,          0.0, 0.0),
                          new Vector(0.0,          1.0,          0.0, 0.0),
                          new Vector(0.0,          0.0,          1.0, 0.0),
                          new Vector(-(r + l) / 2, -(t + b) / 2, 0.0, 1.0));

        var m2 = Matrix.build(new Vector(2 / (r - l), 0.0,         0.0, 0.0),
                          new Vector(0.0,         2 / (t - b), 0.0, 0.0),
                          new Vector(0.0,         0.0,         1.0, 0.0),
                          new Vector(0.0,         0.0,         0.0, 1.0));

        return m2.timesMatrix(m1);
    }
}
