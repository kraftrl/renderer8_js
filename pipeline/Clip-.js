import { Color } from '../color/Color.js';
import { Vertex } from './../scene/Vertex.js';

export class Clip {

    static clip (model, ls) {
        
        // Make local copies of several values
        // console.log(model.vertexList);
        var v0 = model.vertexList[ls.vIndex[0]];
        var v1 = model.vertexList[ls.vIndex[1]];
        // console.log(v0);
        // console.log(v1);
        var x0 = v0.x;
        var x1 = v1.x;
        var y0 = v0.y;
        var y1 = v1.y;

        // 1. Check for trivial accept.
        if (!(Math.abs(x0) > 1 || Math.abs(x1) > 1 || Math.abs(y0) > 1 || Math.abs(y1) > 1)) {
            console.log("-Trivial accept.");
            return true;
        }
        // 2. Check for trivial delete.
        else if ( (x0 >  1 && x1 >  1) || (x0 < -1 && x1 < -1) || (y0 >  1 && y1 >  1) || (y0 < -1 && y1 < -1) ) {
            console.log("-Trivial delete.");
            return false;
        }
        // 3. Need to clip this line segment.
        else if (x0 > 1 || x1 > 1) {
            if (x1 > 1) {
                console.log("-Clip off v1 at x = 1.");
                Clip.interpolateNewVertex(model, ls, 1, 1);
            }
            else { // x1 > 1
                console.log("-Clip off v0 at x = 1.");
                Clip.interpolateNewVertex(model, ls, 0, 1);
            }
        }
        else if (x0 < -1 || x1 < -1) { // ls crosses the line x = -1
            if (x1 < -1) {
                // Create a new Vertex between v0 and v1.
                console.log("-Clip off v1 at x = -1.");
                Clip.interpolateNewVertex(model, ls, 1, 2);
            }
            else { // x1 < -1
                console.log("-Clip off v0 at x = -1.");
                Clip.interpolateNewVertex(model, ls, 0, 2);
            }
        }
        else if (y0 > 1 || y1 > 1) { // ls crosses the line y=1
            if (y1 > 1) {
                console.log("-Clip off v1 at y = 1.")
                Clip.interpolateNewVertex(model, ls, 1, 3);
            }
            else { // y0 > 1
                console.log("-Clip off v0 at y = 1.");
                Clip.interpolateNewVertex(model, ls, 0, 3);
            }
        }
        else if (y0 < -1 || y1 < -1) { // ls crosses the line y = -1
            if (y1 < -1)
            {
                console.log("-Clip off v1 at y = -1.");
                // Create a new Vertex between v0 and v1.
                Clip.interpolateNewVertex(model, ls, 1, 4);
            }
            else // (y0 < -1)
            {
                console.log("-Clip off v0 at y = -1.");
                // Create a new Vertex between v1 and v0.
                Clip.interpolateNewVertex(model, ls, 0, 4);
            }
        }
        return Clip.clip(model, ls); // recursively clip this line segment again
    }

    static interpolateNewVertex(model, ls, outside, eqn_number) {
        var inside = 1 - outside;

        // Make local copies of several values.
        // "i" for inside
        var vix = model.vertexList[ls.vIndex[inside]].x;
        var viy = model.vertexList[ls.vIndex[inside]].y;
        var ci = model.colorList[ls.cIndex[inside]];
        // console.log(ci);
        // and "o" for outside
        var vox = model.vertexList[ls.vIndex[outside]].x;
        var voy = model.vertexList[ls.vIndex[outside]].y;
        var co = model.colorList[ls.cIndex[outside]];

        // Interpolate between v_outside and v_inside.
        
        // console.log(ci);
        var t = 0.0;
        if (1 == eqn_number) {
            t = (1 - vox) / (vix - vox);
        }
        else if (2 == eqn_number) {
            t = (-1 - vox) / (vix - vox);
        }
        else if (3 == eqn_number) {
            t = (1 - voy) / (viy - voy);
        }
        else if (4 == eqn_number) {
            t = (-1 - voy) / (viy - voy);
        }

        // Use the value of t to interpolate the coordinates of the new vertex.
        var x = (1-t) * vox + t * vix;
        alert(x);
        var y = (1-t) * voy + t * viy;
        alert(y);

        var v_new = new Vertex(x, y, 0);
        alert(v_new);

        var t_ = t;
        // console.log(ci);
        var r = (1-t_) * co.r + t_ * ci.r;
        var g = (1-t_) * co.g + t_ * ci.g;
        var b = (1-t_) * co.b + t_ * ci.b;

        var c_new = new Uint8ClampedArray([r, g, b, 255]);

        // Modify the Model and LineSegment to contain the new Vertex and Color
        var vIndex = model.vertexList.length;
        var cIndex = model.colorList.length;
        model.vertexList.push(v_new);
        model.colorList.push(c_new);
        // console.log(model.vertexList);
        ls.vIndex[outside] = vIndex;
        ls.cIndex[outside] = cIndex;
    }
}
