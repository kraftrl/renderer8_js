/**
   A {@code Vertex} object has four doubles which represent the
   homogeneous coordinates of a point in 3-dimensional space.
   The fourth, homogeneous, coordinate will usually be 1, but in
   some stages of the graphics rendering pipeline it can be some
   other (non-zero) number.
<p>
   When a {@code Vertex} object is created in a client program,
   before the {@code Vertex} object moves down the graphics rendering
   pipeline, the coordinates in the {@code Vertex} will be in
   some model's local coordinate system.
<p>
   As a {@code Vertex} object moves down the graphics rendering
   pipeline, the coordinates in the {@code Vertex} will be transformed
   from one coordinate system to another.
<p>
   A {@code Vertex} object is immutable, so after it gets created it
   cannot be modified (mutated). So a {@code Vertex} object does not
   really "move" down the graphics pipeline. When a {@code Vertex}
   object needs to be transformed, we replace it, with a new
   {@code Vertex} object, instead of mutating it.
*/
export class Vertex {

    /**
      Construct a new {@code Vertex} with the given homogeneous coordinates.

      @param x  x-coordinate of the new {@code Vertex}
      @param y  y-coordinate of the new {@code Vertex}
      @param z  z-coordinate of the new {@code Vertex}
      @param w  w-coordinate of the new {@code Vertex}
    */
    constructor(x, y, z, w = 1.0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}
