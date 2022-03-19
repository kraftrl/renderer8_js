import { Model } from './../scene/Model.js';
import { Vertex } from './../scene/Vertex.js';

export class Model2View {

    static model2view(model, modelMatrix) {
        var newVertexList = [];

        for (var v of model.vertexList) {
            newVertexList.push(modelMatrix.timesVertex(v));
        }

        return new Model(model.name,
            newVertexList,
            model.lineSegmentList,
            model.colorList,
            model.visible,
            model.debug);
    }
}
