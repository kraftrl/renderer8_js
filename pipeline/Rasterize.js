import { Model } from './../scene/Model.js';
import { Vertex } from './../scene/Vertex.js';
import { Color } from '../color/Color.js';

export class Rasterize {

    static doAntialiasing = false;
    static doGamma = false;

    static rasterize(model, ls, vp) {
        // Make local copies of several values.
        var w = vp.getWidthVP();
        var h = vp.getHeightVP();

        var v0 = model.vertexList[ls.vIndex[0]];
        var v1 = model.vertexList[ls.vIndex[1]];

        var c0 = model.colorList[ls.cIndex[0]];
        var c1 = model.colorList[ls.cIndex[1]];
        var bg = vp.bgColorVP;

        var x0 = 0.5 + w / 2.001 * (v0.x + 1); // x_pp = 0.5 + w/2 * (x_p+1)
        var y0 = 0.5 + h / 2.001 * (v0.y + 1); // y_pp = 0.5 + h/2 * (y_p+1)
        var x1 = 0.5 + w / 2.001 * (v1.x + 1);
        var y1 = 0.5 + h / 2.001 * (v1.y + 1);

        x0 = Math.round(x0);
        y0 = Math.round(y0);
        x1 = Math.round(x1);
        y1 = Math.round(y1);
        
        // Rasterize a degenerate line segment (a line segment
        // that projected onto a point) as a single pixel.
        if ( (x0 == x1) && (y0 == y1) ) {
            // We don't know which endpoint of the line segment
            // is in front, so just pick v0.
            const x0_vp = x0 - 1;  // viewport coordinate
            const y0_vp = h - y0;  // viewport coordinate
            vp.setPixelVP(x0_vp, y0_vp, c0);
            return;
        }

        // If abs(slope) > 1, then transpose this line so that
        // the transposed line has slope < 1. Remember that the
        // line has been transposed.
        var transposedLine = false;
        if (Math.abs(y1 - y0) > Math.abs(x1 - x0)) {
            // if abs(slope) > 1
            // swap x0 with y0 and swap x1 with y1
            const temp0 = x0;
            x0 = y0;
            y0 = temp0;
            const temp1 = x1;
            x1 = y1;
            y1 = temp1;
            transposedLine = true; // Remember that this line is transposed.
        }

        if (x1 < x0) {
            // We want to rasterize in the direction of increasing x,
            // so, if necessary, swap (x0, y0) with (x1, y1).
            const tempX = x0;
            x0 = x1;
            x1 = tempX;
            const tempY = y0;
            y0 = y1;
            y1 = tempY;
            // swap the colors too
            const tempColor = c0;
            c0 = c1;
            c1 = tempColor;
        }

        // Compute this line segment's slopes.
        const     m = (y1 - y0) / (x1 - x0);
        const slope = Color.slope(c1, c0, x1 - x0);

        // Rasterize this line segment in the direction of increasing x.
        // In the following loop, as x moves across the logical horizontal
        // (or vertical) pixels, we will compute a y value for each x.
        var y = y0;
        for (var x = x0; x < x1; x += 1, y += m) {
            // Interpolate this pixel's color between the two endpoint's colors.
            var color = Color.interpolate(c0, slope, x - x0);

            if (this.doAntialiasing) {
                // y must be between two vertical (or horizontal) logical pixel
                //  coordinates. Let y_low and y_hi be the logical pixel coordinates
                // that bracket around y.
                var y_low = y;                      // the integer part of y
                var y_hi  = y_low + 1;
                if (!transposedLine && y == h) y_hi = h; // test for the top edge
                if ( transposedLine && y == w) y_hi = w; // test for the right edge

                // Let weight be the fractional part of y. We will use
                // weight to determine how much emphasis to place on
                // each of the two pixels that bracket y.
                const weight = (y - y_low);

                // Interpolate colors for the low and high pixels.
                var [colorLow, colorHigh] = Color.interpolateAA(color, bg, weight);
                /*
                // You can try replacing the above anti-aliasing code with this
                // code to see that this simple idea doesn't work here (as it
                // did in the previous renderer). This code just distributes the
                // line's color between two adjacent pixels (instead of blending
                // each pixel's color with the back ground color). This code ends
                // up having pixels fade to black, instead of fading to the back
                // ground color.
                float r_low = (float)((1 - weight) * r);
                float g_low = (float)((1 - weight) * g);
                float b_low = (float)((1 - weight) * b);
                float r_hi  = (float)(weight * r);
                float g_hi  = (float)(weight * g);
                float b_hi  = (float)(weight * b);
                */
                if (this.doGamma) {
                    colorLow = Color.applyGamma(colorLow);
                    colorHigh = Color.applyGamma(colorHigh);
                }

                // Set this (antialiased) pixel in the framebuffer.
                if ( ! transposedLine ) {
                        const x_vp     = x - 1;      // viewport coordinate
                        const y_vp_low = h - y_low;  // viewport coordinate
                        const y_vp_hi  = h - y_hi;   // viewport coordinate
                        vp.setPixelVP(x_vp, y_vp_low, colorLow);
                        vp.setPixelVP(x_vp, y_vp_hi,  colorHigh);
                    }
                else {// a transposed line
                    const x_vp_low = y_low - 1;  // viewport coordinate
                    const x_vp_hi  = y_hi  - 1;  // viewport coordinate
                    const y_vp     = h - x;      // viewport coordinate
                    vp.setPixelVP(x_vp_low, y_vp, colorLow);
                    vp.setPixelVP(x_vp_hi,  y_vp, colorHigh);
                }
            }
            else {// no antialiasing
                if (this.doGamma) {
                    color = Color.applyGamma(color);
                }

                // The value of y will almost always be between
                // two vertical (or horizontal) pixel coordinates.
                // By rounding off the value of y, we are choosing the
                // nearest logical vertical (or horizontal) pixel coordinate.
                if ( ! transposedLine ) {
                    const x_vp = x - 1;                  // viewport coordinate
                    const y_vp = h - Math.round(y); // viewport coordinate
                    vp.setPixelVP(x_vp, y_vp, color);
                }
                else { // a transposed line
                    const x_vp = Math.round(y) - 1; // viewport coordinate
                    const y_vp = h - x;                  // viewport coordinate
                    vp.setPixelVP(x_vp, y_vp, color);
                }
            }
            // Advance (x,y) to the next pixel (delta_x is 1, so delta_y is m).
        }
        // Set the pixel for the (x1,y1) endpoint.
        // We do this separately to avoid roundoff errors.
        if (this.doGamma) {
            c1 = Color.applyGamma(c1);
        }
        if ( ! transposedLine ) {
            const x_vp = x1 - 1;  // viewport coordinate
            const y_vp = h - y1;  // viewport coordinate
            vp.setPixelVP(x_vp, y_vp, c1);
        } else {
            const x_vp = y1 - 1;  // viewport coordinate
            const y_vp = h - x1;  // viewport coordinate
            vp.setPixelVP(x_vp, y_vp, c1);
        }
    }

}
