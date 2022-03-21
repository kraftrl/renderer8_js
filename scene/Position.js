import { Model } from './Model.js';
import { Matrix } from './Matrix.js';

export class Position {
    constructor(model) {
        this.model = model;
        this.matrix = Matrix.identity();
        this.nestedPositions = [];
        this.visible = true;
    }

    setModel(model) {
        this.model = model;
    }

    matrix2Identity() {
        this.matrix = Matrix.identity();
        return this.matrix;
    }

    /**
      Get a reference to the nested {@code Position} at the given index in
      this {@code Position}'s {@link List} of nested {@code Position}s.

      @param index  index of the nested {@code Position} to return
      @return nested {@code Position} at the specified index in the {@link List} of nested {@code Position}s
   */
    getNestedPosition(index)
    {
        return this.nestedPositions[index];
    }

   /**
      Set a reference to the given {@link Position} object at the given index in this {@code Position}'s
      {@link List} of nested {@link Position}s.

      @param index     index of the nested {@link Position} to set
      @param position  {@link Position} object to place at the specified index in the {@link List} of nested {@link Position}s
      @throws IndexOutOfBoundsException if the index is out of range
              {@code (index < 0 || index >= size())}
   */
    setNestedPosition(index, position)
    {
        this.nestedPositions[index] = position;
    }

   /**
      Add a nested {@code Position} (or Positions) to this {@code Position}'s
      {@link List} of nested {@code Position}s.

      @param pArray  array of nested {@code Position}s to add to this {@code Position}
   */
    addNestedPosition(pArray)
    {
        for (var p of pArray)
        {
            this.nestedPositions.push(p);
        }
    }
}
