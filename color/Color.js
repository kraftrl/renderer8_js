/**
 * 
 */
export class Color{

    static Black = new Uint8ClampedArray([0,0,0,255]);
    static White = new Uint8ClampedArray([255,255,255,255]);
    static Red = new Uint8ClampedArray([255,0,0,255]);
    static Green = new Uint8ClampedArray([0,255,0,255]);
    static Blue = new Uint8ClampedArray([0,0,255,255]);
    static Orange = new Uint8ClampedArray([255, 127, 0, 255]);
    static GAMMA = 1/2.2;

    // Apply gamma-encoding (gamma-compression) to the colors.
    // https://www.scratchapixel.com/lessons/digital-imaging/digital-images
    // http://blog.johnnovak.net/2016/09/21/what-every-coder-should-know-about-gamma/
    static applyGamma(rgba) {
        return new Uint8ClampedArray([
            Math.round(Math.pow(rgba[0],  Color.GAMMA)),
            Math.round(Math.pow(rgba[1],  Color.GAMMA)),
            Math.round(Math.pow(rgba[2],  Color.GAMMA)),
            255
        ]);
    }

    static interpolate(c, slope, dx){
        return new Uint8ClampedArray([
            Math.abs(c[0] + slope[0]*dx),
            Math.abs(c[1] + slope[1]*dx),
            Math.abs(c[2] + slope[2]*dx),
            255
        ]);
        // We need the Math.abs() because otherwise, we sometimes get -0.0.
    }

    // The smaller the weight is, the closer y is to the lower
    // pixel, so we give the lower pixel more emphasis when
    // weight is small.
    static interpolateAA(c1, c2, weight){
        const rgbLow = new Uint8ClampedArray([
            (1 - weight) * c1[0] + weight * (c2[0] / 255.0),
            (1 - weight) * c1[1] + weight * (c2[1] / 255.0),
            (1 - weight) * c1[2] + weight * (c2[2] / 255.0),
            255
        ]);
        const rgbHigh = new Uint8ClampedArray([
            weight * c1[0] + (1 - weight) * (c2[0]/255.0),
            weight * c1[1] + (1 - weight) * (c2[1]/255.0),
            weight * c1[2] + (1 - weight) * (c2[2]/255.0),
            255
        ]);
        return [rgbLow, rgbHigh];
    }

    static slope(c1, c0, dx){
        return new Uint8ClampedArray([
            (c1[0] - c0[0]) / dx,
            (c1[1] - c0[1]) / dx,
            (c1[2] - c0[2]) / dx,
            255
        ]);
    }

    static hexToRgba(hex){
        if(hex.match(/^#[A-Fa-f0-9]{6}/)){
            return new Uint8ClampedArray([parseInt(hex.substring(1, 3), 16), parseInt(hex.substring(3,5), 16), parseInt(hex.substring(5,7), 16), 255]);
        }
        return new Uint8ClampedArray([0, 0, 0, 255]);
    }

    static RgbToHex(color) {
        return "#" + Color.intToHex(color[0]) + Color.intToHex(color[1]) + Color.intToHex(color[2]);
    }

    static intToHex(x) {
        if (x < 10) {
            return "0" + x.toString(16);
        }
        return x.toString(16);
    }

}

