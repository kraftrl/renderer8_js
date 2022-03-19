import { Camera } from './Camera.js';
import { Position } from './Position.js';

/**
   A {@code Scene} data structure is a {@link List} of {@link Position}
   data structures and a {@link Camera} data structure.
<p>
   Each {@link Position} object represents a {@link Model} object in a
   distict position in three-dimensional camera space. Each {@link Model}
   object represents a distinct geometric object in the scene.
<p>
   The {@link Camera} object determines a "view volume", which
   determines how much of the scene is actually visible (to the
   camera) and gets rendered into the framebuffer.
*/
export class Scene {

   /**
      Construct a {@code Scene} with a default {@link Camera} object.
   */
    constructor(camera = new Camera()) {
        this.camera = camera;
        this.positionList = [];
    }

   /**
      Change this {@code Scene}'s {@link Camera} to the given {@link Camera} object.

      @param camera  new {@link Camera} object for this {@code Scene}
   */
    setCamera(camera) {
        this.camera = camera;
    }

    /**
      Add a {@link Position} (or Positions) to this {@code Scene}.

      @param pArray  array of {@link Position}s to add to this {@code Scene}
    */
    addPosition(positionsAdded) {
        for (var p of positionsAdded) {
          this.positionList.push(p);  
        }
    }

    /**
      Get a reference to the {@link Position} object at the given index in this {@code Scene}'s
      {@link List} of {@link Position}s.

      @param index  index of the {@link Position} to return
      @return {@link Position} at the specified index in the {@link List} of {@link Position}s
    */
    getPosition(number) {
        return this.positionList[number];
    }

    getPositionList() {
        return this.positionList;
    }
}
