export class Vector {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;        
        //this.set(x, y, z, w);
    }

    set(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    plus (s) {
        // console.log(new Vector(s.x + this.x, s.y + this.y, s.z + this.z, s.w + this.w));
        return new Vector(s.x + this.x, s.y + this.y, s.z + this.z, s.w + this.w);
    }

    times(s) {
        //console.log(s);
        //console.log(new Vector(s * this.x, s * this.y, s * this.z, s * this.w));
        return new Vector(s * this.x, s * this.y, s * this.z, s * this.w);
    }

    timesEquals(s) {
        this.x = s * this.x;
        this.y = s * this.y;
        this.z = s * this.z;
        this.w = s * this.w;

        return this;
    }
}
