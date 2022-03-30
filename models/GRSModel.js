import { Model } from './../scene/Model.js';
import { Vertex } from './../scene/Vertex.js';
import { LineSegment } from './../scene/LineSegment.js';

export class GRSModel extends Model {
    constructor(fileName) {
        super("GRS Model");
        
        // Open the GRS Model
        var grsName = fileName;

        // Make an AJAX request to retrieve the GRS file
        var xhttp = new XMLHttpRequest();
        var data;
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                data = xhttp.responseText;
            }
        };
        xhttp.open("GET", fileName, false);
        xhttp.send();

        // Get the geometry from the GRS file.
        var dataSplit = data.split("\n"); // Split the contents of the file into an array
        var lineNumber = 0; // Keep track of the line number

        // skip over the comment lines
        while (!dataSplit[lineNumber].startsWith("*")) {
            lineNumber++;
        }
        lineNumber++;

        // read the figure extents
        var extent = dataSplit[lineNumber].split(/ +/);
        this.left = parseFloat(extent[0]);
        this.top = parseFloat(extent[1]);
        this.right = parseFloat(extent[2]);
        this.bottom = parseFloat(extent[3]);
        lineNumber++;

        // read the number of line-strips
        this.numLineStrips = parseInt(dataSplit[lineNumber]);
        lineNumber++;

        var index = -1;

        for (var j = 0; j < this.numLineStrips; j++) {
            var numVerticies = parseInt(dataSplit[lineNumber]);
            lineNumber++;

            // put this line-strip in the Model object
            var vertexSplit = dataSplit[lineNumber].split(/ +/); // read the first vertex in the line-strip
            var x = parseFloat(vertexSplit[1]);
            var y = parseFloat(vertexSplit[2]);
            this.addVertex([new Vertex(x, y, 0)]);
            index++;
            lineNumber++;

            for (var i = 1; i < numVerticies; i++) {
                // read the next model coordinate pair
                vertexSplit = dataSplit[lineNumber].split(/ +/);
                x = parseFloat(vertexSplit[1]);
                y = parseFloat(vertexSplit[2]);
                this.addVertex([new Vertex(x, y, 0)]);
                index++;
                // create a new LineSegment in the Model
                this.addLineSegment([new LineSegment(index - 1, index)]);
                lineNumber++;
            }
        }
    //console.log(this);
    }
}
