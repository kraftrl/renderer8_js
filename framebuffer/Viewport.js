import { FrameBuffer } from "./FrameBuffer.js";

/**
     A {@code Viewport} is a two-dimensional sub array of its
    "parent" {@link FrameBuffer}. A {@code Viewport} is
    represented by its upper-left-hand corner and its
    lower-right-hand corner in the {@link FrameBuffer}.
<p>
    When you set a pixel in a {@code Viewport}, you are really
    setting a pixel in its parent {@link FrameBuffer}.
<p>
    A {@link FrameBuffer} can have multiple {@code Viewport}s.
<p>
    {@code Viewport} coordinates act like Java {@link java.awt.Graphics2D}
    coordinates; the positive {@code x} direction is to the right and the
    positive {@code y} direction is downward.
*/

export class Viewport
{
    // Coordinates of the viewport within the framebuffer.
    vp_ul_x;     // upper-left-hand corner
    vp_ul_y;
    vp_lr_x;     // lower-right-hand corner
    vp_lr_y;
    bgColorVP; // the viewport's background color
    parent;

    /**
     Create a {@code Viewport} with the given upper-left-hand corner,
        width and height within its parent {@link FrameBuffer}, and with
        the given background color. (Note: This constructor does not use
        the background color to set the pixels of this {@code Viewport}.
        If you want the pixels of this {@code Viewport} to be cleared to
        the background color, call the {@link clearVP} method.)
    <p>
        (Using upper-left-hand corner, width, and height is
        like Java's {@link java.awt.Rectangle} class and
        {@link java.awt.Graphics#drawRect} method.)

        @param parent parent {@link FrameBuffer}
        @param source source {@link FrameBuffer} or {@link Viewport}.
        @param c        background {@link Color} for the {@code Viewport}
        @param vp_ul_x  upper left hand x-coordinate of new {@code Viewport} rectangle
        @param vp_ul_y  upper left hand y-coordinate of new {@code Viewport} rectangle
        @param width    {@code Viewport}'s width
        @param height   {@code Viewport}'s height
    */
    constructor(parent, source, c, vp_ul_x, vp_ul_y, width, height) {
        if (source instanceof FrameBuffer) {
            this.setViewport(vp_ul_x, vp_ul_y, source.getWidthFB(), source.getHeightFB());
            this.bgColorVP = source.bgColorFB;

            // Read pixel data, one pixel at a time, from the source FrameBuffer.
            for (var y = 0; y < source.height; ++y) {
                for (var x = 0; x < source.width; ++x) {
                    this.setPixelVP(x, y, source.getPixelFB(x,y));
                }
            }
        } else if (source instanceof Viewport) {
            this.setViewport(vp_ul_x, vp_ul_y, source.getWidthVP(), source.getHeightVP());
            this.bgColorVP = source.bgColorVP;
    
            // Read pixel data, one pixel at a time, from the source Viewport.
            for (var y = 0; y < source.getHeightVP(); ++y) {
                for (var x = 0; x < source.getWidthVP(); ++x) {
                    this.setPixelVP(x, y, source.getPixelVP(x,y));
                }
            }
        } else {
            this.setViewport(vp_ul_x ?? 0, vp_ul_y ?? 0, width ?? parent.width, height ?? parent.height);
            this.bgColorVP = c ?? parent.bgColorFB;
        }

        this.parent = parent;
    }

    /**
     Mutate this {@code Viewport} into the given upper-left-hand corner,
        width and height within its parent {@link FrameBuffer}.
    <p>
        (Using upper-left-hand corner, width, and height is
        like Java's {@link java.awt.Rectangle} class and
        {@link java.awt.Graphics#drawRect} method.)

        @param vp_ul_x  new upper left hand x-coordinate of this {@code Viewport} rectangle
        @param vp_ul_y  new upper left hand y-coordinate of this {@code Viewport} rectangle
        @param width    {@code Viewport}'s new width
        @param height   {@code Viewport}'s new height
    */
    setViewport(vp_ul_x, vp_ul_y, width, height) {
        this.vp_ul_x = vp_ul_x;
        this.vp_ul_y = vp_ul_y;
        this.vp_lr_x = vp_ul_x + width;
        this.vp_lr_y = vp_ul_y + height;
    }

    /**
     Get the width of this {@code Viewport}.

        @return width of this {@code Viewport} rectangle
    */
    getWidthVP() {
        return this.vp_lr_x - this.vp_ul_x;
    }

    /**
     Get the height of this {@code Viewport}.

        @return height of this {@code Viewport} rectangle
    */
    getHeightVP() {
        return this.vp_lr_y - this.vp_ul_y;
    }

    /**
     Get the {@code Viewport}'s background color.

        @return the {@code Viewport}'s background {@link Color}
    */
    getBackgroundColorVP() {
        return this.bgColorVP;
    }

    /**
     Set the {@code Viewport}'s background color.
        <p>
        NOTE: This method does not clear the pixels of the
        {@code Viewport} to the given {@link Color}. To
        actually change all the {@code Viewport}'s pixels
        to the given {@link Color}, use the {@link clearVP}
        method.

        @param c  {@code Viewport}'s new background {@link Color}
    */
    setBackgroundColorVP(c) {
        this.bgColorVP = c;
    }

    /**
     Clear this {@code Viewport} using the given {@link Color}.

        @param c  {@link Color} to clear this {@code Viewport} with
    */
    clearVP(c) {
        const wVP = this.getWidthVP();
        const hVP = this.getHeightVP();
        for (var y = 0; y < hVP; ++y) {
            for (var x = 0; x < wVP; ++x) {
                this.setPixelVP(x, y, c ?? this.bgColorVP);
            }
        }
    }

    /**
     Get the {@link Color} of the pixel with coordinates
        {@code (x,y)} relative to this {@code Viewport}.

        @param x  horizontal coordinate within this {@code Viewport}
        @param y  vertical coordinate within this {@code Viewport}
        @return the {@link Color} of the current pixel at the given {@code Viewport} coordinates
    */
    getPixelVP(x, y) {
        return this.parent.getPixelFB(this.vp_ul_x + x, this.vp_ul_y + y);
    }


    /**
     Set the {@link Color} of the pixel with coordinates
        {@code (x,y)} relative to this {@code Viewport}.

        @param x  horizontal coordinate within this {@code Viewport}
        @param y  vertical coordinate within this {@code Viewport}
        @param c  color (Uint8ClampedArray) for the pixel at the given {@code Viewport} coordinates
    */
    setPixelVP(x, y, c) {
        this.parent.setPixelFB(this.vp_ul_x + x, this.vp_ul_y + y, c);
    }

    /**
     Create a new {@link FrameBuffer} containing the pixel data
        from this {@code Viewport} rectangle.

        @return {@code FrameBuffer} object holding pixel data from this {@code Viewport}
    */
    convertVP2FB() {
        const wVP = this.getWidthVP();
        const hVP = this.getHeightVP();

        const vp_fb = new FrameBuffer(undefined, wVP, hVP);
        vp_fb.bgColorFB = this.bgColorVP;

        // Copy the current viewport into the new framebuffer's pixel buffer.
        for (var y = 0; y < hVP; y++) {
            for (var x = 0; x < wVP; x++) {
                vp_fb.setPixelFB( x, y, this.getPixelVP(x, y) );
            }
        }

        return vp_fb;
    }
}// Viewport