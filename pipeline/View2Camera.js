import { Matrix } from './../scene/Matrix.js';
import { Vertex } from './../scene/Vertex.js';
import { Model } from './../scene/Model.js';

export class View2Camera {

    static view2camera(model, normalizeMatrix) {
        var newVertexList = [];
        
        for (var v of model.vertexList) {
            newVertexList.push(normalizeMatrix.timesVertex(v));
        }

        return new Model(model.name,
                        newVertexList,
                        model.lineSegmentList,
                        model.colorList,
                        model.visible,
                        model.debug);
    }

}
