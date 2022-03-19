/**
    A {@code LineSegment} object has four integers that
    represent the endpoints of the line segment and the
    color at each endpoint. Two of the integers are indices
    into the {@link Vertex} list of a {@link Model} object
    and the other two integers are indices into the {@link Color}
    list of that {@link Model} object.
*/
export class LineSegment {
    constructor (i0, i1, c0 = i0, c1 = i1) {
        this.vIndex = [i0, i1];
        this.cIndex = [c0, c1];
    }

   /**
        Set this {@code LineSegment}'s two integer indices for its colors.
        <p>
        NOTE: This method does not put any {@link Color} objects into this
        {@code LineSegment}'s {@link Model}. This method assumes that the
        given {@link Color} indices are valid (or will be valid by the time
        this {@code LineSegment} gets rendered).

        @param c0  index of 1st endpoint {@link Color} for this {@code LineSegment}
        @param c1  index of 2nd endpoint {@link Color} for this {@code LineSegment}
   */
    setColors(c0, c1) {
        this.cIndex[0] = c0;
        this.cIndex[1] = c1;
    }
}
