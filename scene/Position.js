import { Model } from './Model.js';
import { Matrix } from './Matrix.js';

export class Position {
    constructor(model) {
        this.model = model;
        this.matrix = Matrix.identity();
    }

    setModel(model) {
        this.model = model;
    }

    matrix2Identity() {
        this.matrix = Matrix.identity();
        return this.matrix;
    }
}
