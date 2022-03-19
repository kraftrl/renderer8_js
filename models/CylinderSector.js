import { Model } from './../scene/Model.js';
import { LineSegment } from './../scene/LineSegment.js';
import { Vertex } from './../scene/Vertex.js';

export class CylinderSector extends Model {

    constructor(r = 1,
				h1 = 0, h2 = 1,
				theta1 = 0, theta2 = 2.0*Math.PI,
				n = 10, k = 10) {

        super("Cylinder Sector");

        if (n < 2) n = 2;
        if (k < 4) k = 4;


        // Create the cylinder's geometry.
		const deltaH = (h2 - h1) / (n - 1);
		const deltaTheta = (theta2 - theta1)/ (k - 1);

		// An array of vertices to be used to create line segments.
		var v = Array(n).fill(null).map(() => Array(k))

		// Create all the vertices.
		for (var j = 0; j < k; ++j) // choose an angle of longitude
		{
			const c = Math.cos(theta1 + j*deltaTheta);
			const s = Math.sin(theta1 + j*deltaTheta);
			for (var i = 0; i < n; ++i) // choose a circle of latitude
			{
				v[i][j] = new Vertex( r * c,
                        		    h1 + i * deltaH,
                        		    r * s );
			}
		}
        const topCenter = new Vertex(0, h2, 0);
		const bottomCenter = new Vertex(0, h1, 0);

        // Add all of the vertices to this model.
		for (var i = 0; i < n; ++i)
		{
			for (var j = 0; j < k; ++j)
			{
				this.addVertex( [v[i][j]] );
			}
		}
		this.addVertex( [topCenter] );
		this.addVertex( [bottomCenter] );
		const topCenterIndex = n * k;
		const bottomCenterIndex = n * k + 1;

        // Create the horizontal (partial) circles of latitude around the cylinder.
		for (var i = 0; i < n; ++i)
		{
			for (var j = 0; j < k - 1; ++j)
			{   //                  v[i][j]      v[i][j+1]
				this.addLineSegment( [new LineSegment( (i * k) + j, (i * k) + (j+1) )] );
			}
		}

        // Create the lines of longitude from the bottom to the top.
		for (var j = 0; j < k; ++j)
		{   //                                     v[0][j]
			this.addLineSegment( [new LineSegment( bottomCenterIndex, (0 * k) + j )] );

			for (var i = 0; i < n - 1; ++i)
			{   //                  v[i][j]       v[i+1][j]
				this.addLineSegment( [new LineSegment( (i * k) + j, ((i+1) * k) + j )] );
			}
			//                   v[n-1][j]
			this.addLineSegment([ new LineSegment( ((n-1) * k) + j, topCenterIndex )] );
		}
    }

}
