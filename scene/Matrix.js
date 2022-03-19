import { Vector } from './Vector.js';
import { Vertex } from './Vertex.js'

/**
   A {@code Matrix} object has four {@link Vector} objects.
<p>
   The four {@link Vector} objects represent the four column vectors
   of the 4-by-4 matrix (as in a Linear Algebra course).
<p>
   In computer graphics, the points and vectors of 3-dimensional space
   are represented using 4-dimensional homogeneous coordinates.
   So each transformation of 3-dimensional space is represented by
   a 4-by-4 (homogeneous) matrix.
<p>
   A 4-by-4 matrix represents a transformation of 3-dimensional space.
   The most common transformations are translation, rotation, and
   scaling. A 4-by-4 matrix can also represent a projection transformation.
*/
export class Matrix {
    constructor() {
        this.v1 = new Vector(0, 0, 0, 0);
        this.v2 = new Vector(0, 0, 0, 0);
        this.v3 = new Vector(0, 0, 0, 0);
        this.v4 = new Vector(0, 0, 0, 0);    
    }

     /**
      Construct an arbitrary 4-by-4 {@code Matrix}
      with the given column {@link Vector}s.
      <p>
      Notice that this is a private constructor. Other
      objects should use the static facory methods to
      create new {@code Matrix} objects.

      @param v1  1st column {@link Vector} for the new {@code Matrix}
      @param v2  2nd column {@link Vector} for the new {@code Matrix}
      @param v3  3rd column {@link Vector} for the new {@code Matrix}
      @param v4  4th column {@link Vector} for the new {@code Matrix}
      @return a new {@code Matrix} object
    */
    static build(v1, v2, v3, v4) {     
        var m = new Matrix();
        m.v1 = v1;
        m.v2 = v2;
        m.v3 = v3;
        m.v4 = v4;

        return m;
    }

    //return identity matrix
    static identity() {
        console.log(Matrix.scaleConst(1.0));
        return Matrix.scaleConst(1.0);
    }

    // Return a new translated matrix
    static translate(x, y, z) {
        var b = Matrix.build(new Vector(1.0, 0.0, 0.0, 0.0),
            new Vector(0.0, 1.0, 0.0, 0.0),
            new Vector(0.0, 0.0, 1.0, 0.0),
            new Vector(  x,   y,   z, 1.0));
        //console.log("Translated matrix:")
        //console.log(b);
        return b;
    }

    // Uniform scaling matrix
    static scaleConst(d) {
        var newMatrix = Matrix.scale(d, d, d);
        //console.log(newMatrix);
        return newMatrix;
    }

    // Construct a diagonal matrix that scales in the x, y, and z directions by the given factors
    static scale(x, y, z) {
        return Matrix.build(new Vector(x, 0.0, 0.0, 0.0),
            new Vector(0.0,   y, 0.0, 0.0),
            new Vector(0.0, 0.0,   z, 0.0),
            new Vector(0.0, 0.0, 0.0, 1.0));
    }

    // Construct a matrix rotated by theta degrees along the x axis
    static rotateX(theta) {
        return Matrix.rotate(theta, 1, 0, 0);
    }

    // Construct a matrix rotated by theta degrees along the y axis
    static rotateY(theta) {
        return Matrix.rotate(theta, 0, 1, 0);
    }

    // Construct a matrix rotated by theta degrees along the z axis
    static rotateZ(theta) {
        return Matrix.rotate(theta, 0, 0, 1);
    }

    // Construct a matrix rotated by theta along the axis vector (x, y, z)
    static rotate(theta, x, y, z) {
        const norm = Math.sqrt(x * x + y * y + z * z);
        const ux = x / norm;
        const uy = y / norm;
        const uz = z / norm;

        const c = Math.cos((Math.PI / 180.0) * theta);
        const s = Math.sin((Math.PI / 180.0) * theta);

        var newMatrix = Matrix.build(
            new Vector(ux * ux * (1 - c) + c,        uy * ux * (1 - c) + (uz * s), uz * ux * (1 - c) - (uy * s), 0.0),
            new Vector(ux * uy * (1 - c) - (uz * s), uy * uy * (1 - c) + c,        uz * uy * (1 - c) + (ux * s), 0.0),
            new Vector(ux * uz * (1 - c) + (uy * s), uy * uz * (1 - c) - (ux * s), uz * uz * (1 - c) + c,        0.0),
            new Vector(0.0,                          0.0,                          0.0,                          1.0)
        );
        //console.log(newMatrix);
        return newMatrix;
    }

    // Product of two matrices. Matrix m is on the right, while this is on the left
    // Mutates this matrix
    mult(m) {
        /*
        const vec1 = this.timesVector(m.v1);
        const vec2 = this.timesVector(m.v2);
        const vec3 = this.timesVector(m.v3);
        const vec4 = this.timesVector(m.v4);

        this.v1 = vec1;
        this.v2 = vec2;
        this.v3 = vec3;
        this.v4 = vec4;
        */

        /*
        console.log("1st matrix:")
        console.log(this);
        console.log("2nd matrix:")
        console.log(m);
        */
        
        // this.v1 = this * m.v1
        var x = m.v1.x;
        var y = m.v1.y;
        var z = m.v1.z;
        var w = m.v1.w;
        var x1 = (this.v1.x * x) + (this.v2.x * y) + (this.v3.x * z) + (this.v4.x * w);
        var y1 = (this.v1.y * x) + (this.v2.y * y) + (this.v3.y * z) + (this.v4.y * w);
        var z1 = (this.v1.z * x) + (this.v2.z * y) + (this.v3.z * z) + (this.v4.z * w);
        var w1 = (this.v1.w * x) + (this.v2.w * y) + (this.v3.w * z) + (this.v4.w * w);

        // this.v2 = this * m.v2
        x = m.v2.x;
        y = m.v2.y;
        z = m.v2.z;
        w = m.v2.w;
        var x2 = (this.v1.x * x) + (this.v2.x * y) + (this.v3.x * z) + (this.v4.x * w);
        var y2 = (this.v1.y * x) + (this.v2.y * y) + (this.v3.y * z) + (this.v4.y * w);
        var z2 = (this.v1.z * x) + (this.v2.z * y) + (this.v3.z * z) + (this.v4.z * w);
        var w2 = (this.v1.w * x) + (this.v2.w * y) + (this.v3.w * z) + (this.v4.w * w);

        // this.v3 = this * m.v3
        x = m.v3.x;
        y = m.v3.y;
        z = m.v3.z;
        w = m.v3.w;
        var x3 = (this.v1.x * x) + (this.v2.x * y) + (this.v3.x * z) + (this.v4.x * w);
        var y3 = (this.v1.y * x) + (this.v2.y * y) + (this.v3.y * z) + (this.v4.y * w);
        var z3 = (this.v1.z * x) + (this.v2.z * y) + (this.v3.z * z) + (this.v4.z * w);
        var w3 = (this.v1.w * x) + (this.v2.w * y) + (this.v3.w * z) + (this.v4.w * w);
        
        // this.v4 = this * m.v4
        x = m.v4.x;
        y = m.v4.y;
        z = m.v4.z;
        w = m.v4.w;
        var x4 = (this.v1.x * x) + (this.v2.x * y) + (this.v3.x * z) + (this.v4.x * w);
        var y4 = (this.v1.y * x) + (this.v2.y * y) + (this.v3.y * z) + (this.v4.y * w);
        var z4 = (this.v1.z * x) + (this.v2.z * y) + (this.v3.z * z) + (this.v4.z * w);
        var w4 = (this.v1.w * x) + (this.v2.w * y) + (this.v3.w * z) + (this.v4.w * w);

        // Mutate each column Vector of this Matrix.
        this.v1.x = x1;
        this.v1.y = y1;
        this.v1.z = z1;
        this.v1.w = w1;

        this.v2.x = x2;
        this.v2.y = y2;
        this.v2.z = z2;
        this.v2.w = w2;

        this.v3.x = x3;
        this.v3.y = y3;
        this.v3.z = z3;
        this.v3.w = w3;

        this.v4.x = x4;
        this.v4.y = y4;
        this.v4.z = z4;
        this.v4.w = w4;

        //console.log("New matrix:")
        //console.log(this);

        return this;
    }

    // Product of two matrices. Matrix m is on the left, while this is on the right
    // Mutates this matrix
    multLeft(m) {
        const vec1 = m.timesVector(this.v1);
        const vec2 = m.timesVector(this.v2);
        const vec3 = m.timesVector(this.v3);
        const vec4 = m.timesVector(this.v4);

        this.v1 = vec1;
        this.v2 = vec2;
        this.v3 = vec3;
        this.v4 = vec4;
        return this;
    }

    // Scalar times this matrix, returns new matrix
    timesConst(s) {
        return Matrix.build(this.v1.times(s), this.v2.times(s), this.v3.times(s), this.v4.times(s));
    }

    // Scalar times this matrix, modifying it
    timesEquals(s) {
        this.v1.timesEquals(s);
        this.v2.timesEquals(s);
        this.v3.timesEquals(s);
        this.v4.timesEquals(s);
        return this;
    }

    // Matrix times a vector, returns a new vector
    timesVector(v) {
        /*
        var mat = this.v1.times(v.x).plus(this.v2.times(v.y).plus(this.v3.times(v.z).plus(this.v4.times(v.w))));
        console.log("New vector")
        console.log(mat);
        return mat;
        */
        // dot product of each row of this matrix with the vertex v
        var x = (this.v1.x * v.x) + (this.v2.x * v.y)  + (this.v3.x * v.z) + (this.v4.x * v.w);
        var y = (this.v1.y * v.x) + (this.v2.y * v.y)  + (this.v3.y * v.z) + (this.v4.y * v.w);
        var z = (this.v1.z * v.x) + (this.v2.z * v.y)  + (this.v3.z * v.z) + (this.v4.z * v.w);
        var w = (this.v1.w * v.x) + (this.v2.w * v.y)  + (this.v3.w * v.z) + (this.v4.w * v.w);
        return new Vector(x, y, z, w);
    }

    // Matrix times Matrix, returns a new matrix
    timesMatrix(m) {
        return Matrix.build(this.timesVector(m.v1),
            this.timesVector(m.v2),
            this.timesVector(m.v3),
            this.timesVector(m.v4));
    }

    // Multiply a vertex by a matrix and return a new vertex
    timesVertex(v) {
        /*
        console.log(v);
        const vec = this.v1.times(v.x).plus(this.v2.times(v.y).plus(this.v3.times(v.z).plus(this.v4.times(v.w))));
        console.log(vec);
        return new Vertex(vec.x, vec.y, vec.z, vec.w);
        */
        // dot product of each row of this matrix with the vertex v
        var x = (this.v1.x * v.x) + (this.v2.x * v.y)  + (this.v3.x * v.z) + (this.v4.x * v.w);
        var y = (this.v1.y * v.x) + (this.v2.y * v.y)  + (this.v3.y * v.z) + (this.v4.y * v.w);
        var z = (this.v1.z * v.x) + (this.v2.z * v.y)  + (this.v3.z * v.z) + (this.v4.z * v.w);
        var w = (this.v1.w * v.x) + (this.v2.w * v.y)  + (this.v3.w * v.z) + (this.v4.w * v.w);
        return new Vector(x, y, z, w);
    }

}
