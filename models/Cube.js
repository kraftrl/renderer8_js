import { Model } from './../scene/Model.js';
import { Vertex } from './../scene/Vertex.js';
import { LineSegment } from './../scene/LineSegment.js';

export class Cube extends Model{

	constructor() {
		super("Cube");

		// Create 8 vertices.
		this.addVertex( [
				new Vertex(-1, -1, -1), // 4 vertices around the bottom face
				new Vertex( 1, -1, -1),
				new Vertex( 1, -1,  1),
				new Vertex(-1, -1,  1),
				new Vertex(-1,  1, -1), // 4 vertices around the top face
				new Vertex( 1,  1, -1),
				new Vertex( 1,  1,  1),
				new Vertex(-1,  1,  1)] );

		// Create 12 line segments.
		this.addLineSegment( [
				new LineSegment(0, 1),  // bottom face
				new LineSegment(1, 2),
				new LineSegment(2, 3),
				new LineSegment(3, 0),
				new LineSegment(4, 5),  // top face
				new LineSegment(5, 6),
				new LineSegment(6, 7),
				new LineSegment(7, 4),
				new LineSegment(0, 4),  // back face
				new LineSegment(1, 5),
				new LineSegment(2, 6),  // front face
				new LineSegment(3, 7)] );
	}
}
