import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';
import  fs  from 'fs';

export class ObjSimpleModelNode extends Model {
    constructor(fileName) {
        super("Obj Model");
        
        var data;

        data = fs.readFileSync(fileName).toString();
        
        var lines = data.split('\n');
        for (var line of lines) {
            if (line.startsWith("#") ||
                line.startsWith("vt") ||
                line.startsWith("vn") ||
                line.startsWith("s") ||
                line.startsWith("g") ||
                line.startsWith("o") ||
                line.startsWith("usemtl") ||
                line.startsWith("mtllib")) {
                
                continue;
            }
            else if (line.startsWith("v")) {
                var vertCoords = line.split(/ +/g);
                this.vertexList.push(new Vertex(parseFloat(vertCoords[1]), parseFloat(vertCoords[2]), parseFloat(vertCoords[3])))
            }
            else if (line.startsWith("f")) {
                var verticies = line.split(/ +/);
                verticies.shift();
                var vIndex = [];
                for (var i = 0; i < 3; i++) {
                    var faceGroup = verticies.shift();
                    var m = faceGroup.split("/");
                    vIndex[i] = parseInt(m[0]) - 1;
                }
                this.addLineSegment([new LineSegment(vIndex[0], vIndex[1]), new LineSegment(vIndex[1], vIndex[2])]);
                while (verticies.length != 0) {
                    vIndex[1] = vIndex[2];
                    var faceGroup = verticies.shift();
                    var m = faceGroup.split("/");
                    vIndex[2] = parseInt(m[0]) - 1;
                    
                    this.addLineSegment([new LineSegment(vIndex[1], vIndex[2])]);
                }
                this.addLineSegment([new LineSegment(vIndex[2], vIndex[0])]);
            }
        }

        
    }
}
