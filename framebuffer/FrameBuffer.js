import { Color } from '../color/Color.js';
import { Viewport } from './Viewport.js';

/**
    A {@code FrameBuffer} represents a two-dimensional array of pixel data.
    The pixel data is stored as a one dimensional array in row-major order.
    The first row of data should be displayed as the top row of pixels
    in the image.
<p>
    A {@link Viewport} is a two-dimensional sub array of a {@code FrameBuffer}.
<p>
    A {@code FrameBuffer} has a default {@link Viewport}. The current {@link Viewport}
    is represented by its upper-left-hand corner and its lower-right-hand
    corner.
<p>
    {@code FrameBuffer} and {@link Viewport} coordinates act like 
    Java coordinates; the positive x direction is
    to the right and the positive y direction is downward.
*/
export class FrameBuffer
{
    width;  // framebuffer's width
    height; // framebuffer's height
    pixel_buffer = []; // contains each pixel's color data for a rendered frame
    bgColorFB = Color.Black;        // default background color
    vp;          // default viewport

    /**
        Construct a {@link FrameBuffer} with the given dimensions.
    <p>
        Initialize the {@link FrameBuffer} to the given color.
    <p>
        The default {@link Viewport} is the whole {@link FrameBuffer}.

        @param source source {@link FrameBuffer} or {@link Viewport}.
        @param w  width of the {@code FrameBuffer}.
        @param h  height of the {@code FrameBuffer}.
        @param c  background color for the {@code FrameBuffer}
    */
    constructor(source, w, h, c) {
      if (source instanceof FrameBuffer) {
         this.width  = source.getWidthFB();
         this.height = source.getHeightFB();
         this.bgColorFB = source.bgColorFB;

         // Create the pixel buffer.
         this.pixel_buffer = new Uint8ClampedArray(this.width * this.height * 4);

         // Read pixel data, one pixel at a time, from the source FrameBuffer.
         for (var y = 0; y < this.height; ++y) {
            for (var x = 0; x < this.width; ++x) {
               this.setPixelFB(x, y, source.getPixelFB(x,y));
            }
         }
      } else if (source instanceof Viewport) {
         this.width  = source.getWidthVP();
         this.height = source.getHeightVP();
         this.bgColorFB = source.bgColorVP;
   
         // Create the pixel buffer.
         this.pixel_buffer = new Uint8ClampedArray(this.width * this.height * 4);
   
         // Read pixel data, one pixel at a time, from the source Viewport.
         for (var y = 0; y < this.height; ++y) {
            for (var x = 0; x < this.width; ++x) {
               this.setPixelFB(x, y, source.getPixelVP(x,y));
            }
         }
      } else {
         this.width  = w ?? 0;
         this.height = h ?? 0;

         // Create the pixel buffer
         this.pixel_buffer = new Uint8ClampedArray(this.width * this.height * 4);

         // Initialize the pixel buffer.
         this.bgColorFB = c ?? Color.Black;
         this.clearFB(this.bgColorFB);
      }

        // Create the default viewport.
        this.vp = new Viewport(this);
    }

   /**
      Get the width of this {@code FrameBuffer}.

      @return width of this {@code FrameBuffer}
   */
   getWidthFB() {
      return this.width;
   }

   /**
      Get the height of this {@code FrameBuffer}.

      @return height of this {@code FrameBuffer}
   */
   getHeightFB() {
      return this.height;
   }

   /**
      Get this {@code FrameBuffer}'s default {@code Viewport}.

      @return this {@code FrameBuffer}'s default {@code Viewport}
   */
   getViewport() {
      return this.vp;
   }

   /**
      Set the default {@code Viewport} with the given upper-left-hand corner,
      width and height within this {@code FrameBuffer}.

      @param vp_ul_x  upper left hand x-coordinate of default {@code Viewport}
      @param vp_ul_y  upper left hand y-coordinate of default {@code Viewport}
      @param width    default {@code Viewport}'s width
      @param height   default {@code Viewport}'s height
   */
   setViewport(vp_ul_x, vp_ul_y, width, height) {
      this.vp.setViewport(vp_ul_x ?? 0, vp_ul_y ?? 0, width ?? this.width, height ?? this.height);
   }

   /**
      Get the {@code FrameBuffer}'s background color.

      @return the {@code FrameBuffer}'s background color
   */
   getBackgroundColorFB() {
      return this.bgColorFB;
   }

   /**
      Set the {@code FrameBuffer}'s background color.
      <p>
      NOTE: This method does not clear the pixels of the
      {@code FrameBuffer} to the given color. To
      actually change all the {@code FrameBuffer}'s pixels
      to the given color, use the {@link clearFB}
      method.

      @param c  {@code FrameBuffer}'s new background color
   */
   setBackgroundColorFB(c) {
      this.bgColorFB = c;
   }

   /**
      Clear the {@code FrameBuffer} using the given {@link Color}.

      @param c color (Uint8ClampedArray) to clear {@code FrameBuffer} with
   */
   clearFB(c) {
      for (var y = 0; y < this.height; ++y) {
         for (var x = 0; x < this.width; ++x) {
            this.setPixelFB(x, y, c ?? this.bgColorFB);
         }
      }
   }

   /**
      Get the color of the pixel with coordinates
      {@code (x,y)} in the {@link FrameBuffer}.

      @param x  horizontal coordinate within the {@link FrameBuffer}
      @param y  vertical coordinate within the {@link FrameBuffer}
      @return the color of the pixel at the given pixel coordinates
   */
   getPixelFB(x, y) {
       const index = y * (this.width * 4) + (4 * x);
       if (index < this.pixel_buffer.length) {
           return new Uint8ClampedArray([this.pixel_buffer[index], this.pixel_buffer[index + 1], this.pixel_buffer[index + 2], this.pixel_buffer[index + 3]]);
       }
       else {
           console.log('FrameBuffer: Bad pixel coordinate (' + x + ', ' + y + ')');
           return new Uint8ClampedArray([255, 255, 255, 255]);
       }
   }

   /**
      Set the color of the pixel with coordinates
      {@code (x,y)} in the {@link FrameBuffer}.

      @param x  horizontal coordinate within the {@link FrameBuffer}
      @param y  vertical coordinate within the {@link FrameBuffer}
      @param c  color for the pixel at the given pixel coordinates (Uint8ClampedArray)
   */
   setPixelFB(x, y, c) {
       //const index = y * this.width + x;
       const index = y * (4 * this.width) + (4 * x);
       if (index < this.pixel_buffer.length) {
           this.pixel_buffer[index] = c[0];
           this.pixel_buffer[index + 1] = c[1];
           this.pixel_buffer[index + 2] = c[2];
           this.pixel_buffer[index + 3] = c[3];
       }
       else {
           //console.log('FrameBuffer: Bad pixel coordinate (' + x + ', ' + y + '); Color: ' + c);
           //return new Uint8ClampedArray([255, 255, 255, 255]);
       }
   }

   /**
      Create a new {@link FrameBuffer} containing the pixel data
      from just the red plane of this {@link FrameBuffer}.

      @return {@link FrameBuffer} object holding just red pixel data from this {@link FrameBuffer}
   */
  convertRed2FB() {
      const red_fb = new FrameBuffer(this.width, this.height, this.bgColorFB);
      for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
              const c = new Uint8ClampedArray([this.getPixelFB(x, y)[0], 0, 0, 0]);
              red_fb.setPixelFB(x, y, c);
          }
      }
      return red_fb;
  }

   /**
      Create a new {@code FrameBuffer} containing the pixel data
      from just the green plane of this {@code FrameBuffer}.

      @return {@code FrameBuffer} object holding just green pixel data from this {@code FrameBuffer}
   */
    convertGreen2FB() {
      const green_fb = new FrameBuffer(this.width, this.height, this.bgColorFB);
      for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
              const c = new Uint8ClampedArray([0, this.getPixelFB(x, y)[1], 0, 0]);
              green_fb.setPixelFB(x, y, c);
          }
      }
      return green_fb;
  }

   /**
      Create a new {@code FrameBuffer} containing the pixel data
      from just the blue plane of this {@code FrameBuffer}.

      @return {@code FrameBuffer} object holding just blue pixel data from this {@code FrameBuffer}
   */
    convertBlue2FB() {
      const blue_fb = new FrameBuffer(this.width, this.height, this.bgColorFB);
      for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
              const c = new Uint8ClampedArray([0, 0, this.getPixelFB(x, y)[2], 0]);
              blue_fb.setPixelFB(x, y, c);
          }
      }
      return blue_fb;
  }

   /**
      For debugging very small {@code FrameBuffer} objects.

      @return a string representation of this {@code FrameBuffer}
   */
   toString() {
       let result = "FrameBuffer [w = " + this.width + ", h = " + this.height + "]\n";
       for (var j = 0; j < this.height; ++j) {
           for (var i = 0; i < this.width; ++i) {
              let color = this.getPixelFB(i, j);
               result += color[0] + " " + color[1] + " " + color[2] + " " + color[3] + " | ";
           }
           result += "\n";
       }
       return result;
   } 

   /**
      Write this {@code FrameBuffer} to the specified PPM file.
   <p>
      <a href="https://en.wikipedia.org/wiki/Netpbm_format" target="_top">
               https://en.wikipedia.org/wiki/Netpbm_format</a>

      @param filename  name of PPM image file to hold {@code FrameBuffer} data
   */
   dumpFB2File(filename) {
      this.dumpPixels2File(0, 0, this.width, this.height, filename);
   }

   /**
      Write a rectangular sub array of pixels from this {@code FrameBuffer}
      to the specified PPM file.
   <p>
      <a href="https://en.wikipedia.org/wiki/Netpbm_format#PPM_example" target="_top">
               https://en.wikipedia.org/wiki/Netpbm_format#PPM_example</a>
   <p>
   <a href="http://stackoverflow.com/questions/2693631/read-ppm-file-and-store-it-in-an-array-coded-with-c" target="_top">
         http://stackoverflow.com/questions/2693631/read-ppm-file-and-store-it-in-an-array-coded-with-c</a>

      @param ul_x      upper left hand x-coordinate of pixel data rectangle
      @param ul_y      upper left hand y-coordinate of pixel data rectangle
      @param lr_x      lower right hand x-coordinate of pixel data rectangle
      @param lr_y      lower right hand y-coordinate of pixel data rectangle
      @param filename  name of PPM image file to hold pixel data
   */
   dumpPixels2File(ul_x, ul_y, lr_x, lr_y, filename) {

      let p_width  = lr_x - ul_x;
      let p_height = lr_y - ul_y;

      // This doesn't work and I don't understand why.
      // This example never resolves the promise in fs.
      //const fs = (async () => {
      //   const fs = await import('node:fs/promises');
      //   return fs;
      //})();
      //console.log(fs);

      // call the imported function
      //fs.writeFile(filename, "P6\n" + p_width + " " + p_height + "\n" + 255 + "\n",
      //             err => {if (err) throw err;});


      // dynamically import and then call writeFile (use async/await notation)
      (async () => {
         const fs = await import('node:fs/promises');
         fs.writeFile(filename, "P6\n" + p_width + " " + p_height + "\n" + 255 + "\n",
                        err => {if (err) throw err;});
      })();

      // dynamically import and then call writeFile (use the notation of promises)
      //import('node:fs/promises').then(fs => {
      //   fs.writeFile(filename, "P6\n" + p_width + " " + p_height + "\n" + 255 + "\n",
      //                err => {if (err) throw err;});
      //});

      var tempPB = new Uint8ClampedArray(p_width * p_height * 3);

      var tempIndex = 0;
      for (let y = 0; y < p_height; y++) {
         for (let x = 0; x < p_width; x++) {
            let index = (y+ul_y) * (this.width * 4) + (x+ul_x) * 4;
            tempPB[tempIndex] = this.pixel_buffer[index];
            tempPB[tempIndex+1] = this.pixel_buffer[index+1];
            tempPB[tempIndex+2] = this.pixel_buffer[index+2];
            tempIndex+=3;
         }
      }

      // call the imported function
      //fs.appendFile(filename, Buffer.from(tempPB),
      //              err => {if (err) throw err;});

      // dynamically import and then call appendFile (use async/await notation)
      //(async () => {
      //   const fs = await import ('node:fs/promises');
      //   fs.appendFile(filename, Buffer.from(tempPB),
      //                 err => {if (err) throw err;});
      //})();

      // dynamically import and then call appendFile (use the notation of promises)
      import('node:fs/promises').then(fs => {
         fs.appendFile(filename, Buffer.from(tempPB),
                        err => {if (err) throw err;});
      });
   }
   
}//FrameBuffer