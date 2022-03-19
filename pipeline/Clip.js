import { Model } from './../scene/Model.js';
import { Vertex } from './../scene/Vertex.js';
import { LineSegment } from './../scene/LineSegment.js';

export class Clip {
    
    static clip(model) {
        var newLineSegmentList = [];
        
        const model2 = new Model(model.name, model.vertexList.slice(), model.lineSegmentList, model.colorList.slice(), model.visible, model.debug);

        for (const ls of model2.lineSegmentList) {
            const ls_clipped = Clip.clipLS(model2, ls);
            if (ls_clipped != null) {
                newLineSegmentList.push(ls_clipped);
            }
        }

        return new Model(model2.name, model2.vertexList, newLineSegmentList, model2.colorList, model2.visible, model2.debug);
    }


    static clipLS(model, ls) {
        const v0 = model.vertexList[ls.vIndex[0]];
        const v1 = model.vertexList[ls.vIndex[1]];

        const x0 = v0.x,  y0 = v0.y;
        const x1 = v1.x,  y1 = v1.y;

        // 1. Check for trivial accept
        if (!(Math.abs(x0) > 1 || Math.abs(x1) > 1 || Math.abs(y0) > 1 || Math.abs(y1) > 1)) {
            return ls;
        }
        // 2. Check for trivial delete.
        else if ( (x0 >  1 && x1 >  1) || (x0 < -1 && x1 < -1) || (y0 >  1 && y1 >  1) || (y0 < -1 && y1 < -1) ) {
            return null;
        }
        // 3. Need to clip this line segment.
        else {
            return Clip.clipLS(model, Clip.clipOneTime(model, ls));
        }
    }

    static clipOneTime(model, ls) {
        var v0 = model.vertexList[ls.vIndex[0]];
        var v1 = model.vertexList[ls.vIndex[1]];

        var x0 = v0.x,  y0 = v0.y;
        var x1 = v1.x,  y1 = v1.y;

        var vIx,    vIy; // "I" for inside
        var vOx,    vOy; // "O" for outside
        var inside; // keep track of which vertex is inside
        // var equation; // keep track of which edge is crossed
        var t;
        var x;
        var y;
        // var vOutside;
        var vIndex;

        if (x0 > 1) {
            inside = 1;
            // equation = "x = +1";
            // vOutside = "v0";
            vOx = x0;  vOy = y0;
            vIx = x1;  vIy = y1;
            t = (1 - vOx) / (vIx - vOx);
            x = 1;  // prevent rounding error
            y = (1-t) * vOy + t * vIy;
            var newVertex = new Vertex(x, y, 0);
            // Modify the Model to contain the new Vertex.
            vIndex = model.vertexList.length;
            model.vertexList.push(newVertex);
        }
        else if (x1 > 1) {
            inside = 0;
            // equation = "x = +1";
            // vOutside = "v1";
            vIx = x0;  vIy = y0;
            vOx = x1;  vOy = y1;
            t = (1 - vOx) / (vIx - vOx);
            x = 1;  // prevent rounding error
            y = (1-t) * vOy + t * vIy;
            var newVertex = new Vertex(x, y, 0);
            vIndex = model.vertexList.length;
            model.vertexList.push(newVertex);
        }
        else if (x0 < - 1) {
            inside = 1;
            // equation = "x = -1";
            // vOutside = "v0";
            vOx = x0;  vOy = y0;
            vIx = x1;  vIy = y1;
            t = (-1 - vOx) / (vIx - vOx);
            x = -1;  // prevent rounding error
            y = (1-t) * vOy + t * vIy;
            var newVertex = new Vertex(x, y, 0);
            vIndex = model.vertexList.length;
            model.vertexList.push(newVertex);
        }
        else if (x1 < -1) {
            inside = 0;
            // equation = "x = -1";
            // vOutside = "v1";
            vIx = x0;  vIy = y0;
            vOx = x1;  vOy = y1;
            t = (-1 - vOx) / (vIx - vOx);
            x = -1;  // prevent rounding error
            y = (1-t) * vOy + t * vIy;
            var newVertex = new Vertex(x, y, 0);
            vIndex = model.vertexList.length;
            model.vertexList.push(newVertex);
        }
        else if (y0 > 1) {
            inside = 1;
            // equation = "y = +1";
            // vOutside = "v0";
            vOx = x0;  vOy = y0;
            vIx = x1;  vIy = y1;
            t = (1 - vOy) / (vIy - vOy);
            x = (1-t) * vOx + t * vIx;
            y = 1;  // prevent rounding error
            var newVertex = new Vertex(x, y, 0);
            vIndex = model.vertexList.length;
            model.vertexList.push(newVertex);
        }
        else if (y1 > 1) {
            inside = 0;
            // equation = "y = +1";
            // vOutside = "v1";
            vIx = x0;  vIy = y0;
            vOx = x1;  vOy = y1;
            t = (1 - vOy) / (vIy - vOy);
            x = (1-t) * vOx + t * vIx;
            y = 1;  // prevent rounding error
            var newVertex = new Vertex(x, y, 0);
            vIndex = model.vertexList.length;
            model.vertexList.push(newVertex);
        }
        else if (y0 < -1) {
            inside = 1;
            // equation = "y = -1";
            // vOutside = "v0";
            vOx = x0;  vOy = y0;
            vIx = x1;  vIy = y1;
            t = (-1 - vOy) / (vIy - vOy);
            x = (1-t) * vOx + t * vIx;
            y = -1;  // prevent rounding error
            var newVertex = new Vertex(x, y, 0);
            vIndex = model.vertexList.length;
            model.vertexList.push(newVertex);
        }
        else {
            inside = 0;
            // equation = "y = -1";
            // vOutside = "v1";
            vIx = x0;  vIy = y0;
            vOx = x1;  vOy = y1;
            t = (-1 - vOy) / (vIy - vOy);
            x = (1-t) * vOx + t * vIx;
            y = -1;  // prevent rounding error
            var newVertex = new Vertex(x, y, 0);
            vIndex = model.vertexList.length;
            model.vertexList.push(newVertex);
        }

        // Use the value of t to interpolate the coordinates of the new vertex.
        var cI = model.colorList.at( ls.cIndex[inside] );
        var cO = model.colorList.at( ls.cIndex[1-inside] );
        var t_ = t; 
        var r = (1-t_) * cO[0] + t_ * cI[0];
        var g = (1-t_) * cO[1] + t_ * cI[1];
        var b = (1-t_) * cO[2] + t_ * cI[2];

        // Modify the Model to contain the new Color.
        var newColor = new Uint8ClampedArray([r,g,b,255]);
        var cIndex = model.colorList.length;
        model.colorList.push(newColor);

        // Return a new LineSegment using the new Vertex and Color
        // and keeping the old LineSegment's inside Vertex and Color.
        var newLS;
        if (0 == inside) {
            newLS = new LineSegment(ls.vIndex[0], vIndex, ls.cIndex[0], cIndex);
        }
        else {
            newLS = new LineSegment(vIndex, ls.vIndex[1], cIndex, ls.cIndex[1]);
        }
        return newLS;
    }
}
