import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';

export class Circle extends Model {

    constructor(r = 1, n = 12) {
        super("circle");        

        if (n < 3) {
            n = 3;        
        }

        

        for (var i = 0; i < n; ++i)
		{
			var c = Math.cos(i*(2.0*Math.PI)/n);
			var s = Math.sin(i*(2.0*Math.PI)/n);
			var v = new Vertex(r * c, r * s, 0);
			this.addVertex( [v] );
		}

        for (var i = 0; i < n - 1; ++i)
		{
			this.addLineSegment( [new LineSegment(i, i+1)] );
		}

        this.addLineSegment( [new LineSegment(n-1, 0)] );
    }
}

