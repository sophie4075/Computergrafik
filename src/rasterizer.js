import * as vec4 from "../lib/vec4.js"
import * as vec2 from "../lib/vec2.js"

const Rasterizer = {

    framebuffer: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    canvasPixelSize: 0,
    error_msg: false,

    setValues(framebuffer, canvasWidth, canvasHeight, pixelSize, error_msg) {
        this.framebuffer = framebuffer;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.canvasPixelSize = pixelSize;
        this.error_msg = error_msg;
    },

    pixelIndex(x, y) {
        // EXERCISE 1
        return (y * this.framebuffer.width + x) * 4;
        // EXERCISE 1 END
    },

    // Helper method to generate a random number between 0 and max-1,
    // useful for random color selection or other random choices
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    },

    // Helper method to generate a random color,
    getRandomColor() {
        return [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256)
        ];
    },

    // ESA 1 most basic function to draw to a framebuffer
    setPixel(x, y, color, framebuffer = this.framebuffer, canvasWidth = this.canvasWidth, canvasHeight = this.canvasHeight, canvasPixelSize = this.canvasPixelSize, error_msg = this.error_msg) {

        // EXERCISE 1
        x = Math.round(x);
        y = Math.round(y);

        if (x < 0 || y < 0 || x > framebuffer.width || y > framebuffer.height) {

            error_msg = true;

            let colorName = `(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;

            console.warn(`Pixel at (${x}, ${y}) with RGB${colorName} could not be painted because it is outside the canvas boundaries.
		    Please set a x-value between 0 - ${(canvasWidth / canvasPixelSize) - 1} and a y-value between 0 - ${(canvasHeight / canvasPixelSize) - 1})`)
            return;
        }

        // EXERCISE 1 END

        let data = framebuffer.data
        let offset = this.pixelIndex(x, y, framebuffer)
        data[offset + 0] = color[0]
        data[offset + 1] = color[1]
        data[offset + 2] = color[2]
        data[offset + 3] = color[3]
    },

    //ESA 1 pattern generation
    drawCircle(xCenter, yCenter, radius, color, framebuffer = this.framebuffer) {
        // Go through all pixels in the canvas
        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                // (x - xCenter)^2 + (y - yCenter)^2 = r^2
                // -> This checks if the pixel is within the radius of the circle
                let distanceSquared = (x - xCenter) * (x - xCenter) + (y - yCenter) * (y - yCenter);

                // If the squared distance is less than or equal to the squared radius, the pixel is inside the circle
                if (distanceSquared <= radius * radius) {
                    this.setPixel(x, y, color, framebuffer);
                }

            }
        }
    },

    /* ESA 2 - This implementation is adapted from an article by Joana Borges Late:
    * https://javascript.plainenglish.io/the-bresenhams-line-algorithm-for-javascript-developers-ada1d973be76 */

    drawLine(xStart, yStart, xEnd, yEnd, color, colorTwo = [255, 0, 0, 1], colorIsAlreadyInterpolated = false, framebuffer = this.framebuffer) {
        const deltaX = Math.abs(xEnd - xStart);
        const deltaY = Math.abs(yEnd - yStart);

        const horizontalStep = (xStart < xEnd) ? 1 : -1;
        const verticalStep = (yStart < yEnd) ? 1 : -1;

        let x = xStart;
        let y = yStart;

        let difference = deltaX - deltaY;

        const totalSteps = Math.max(deltaX, deltaY);

        // Set the first pixel
        this.setPixel(x, y, color, framebuffer);
        console.log(color);

        for (let step = 1; step <= totalSteps; step++) {
            let interpolatedColor = [];

            if (!colorIsAlreadyInterpolated) {
                const t = step / totalSteps;
                vec4.lerp(interpolatedColor, color, colorTwo, t);
            } else {
                interpolatedColor = color;
                console.log("Reached", interpolatedColor);
            }

            const doubleDifference = 2 * difference;

            if (doubleDifference > -deltaY) {
                difference -= deltaY;
                x += horizontalStep;
            }

            if (doubleDifference < deltaX) {
                difference += deltaX;
                y += verticalStep;
            }

            this.setPixel(x, y, interpolatedColor, framebuffer);
        }
    },


    // ESA 3
    drawTriangleBBox(ax, ay, bx, by, cx, cy, colorA = [255, 0, 0, 255], colorB = [0, 255, 0, 255], colorC = [0, 0, 255, 255], framebuffer = this.framebuffer) {
        const A = {x: ax, y: ay};
        const B = {x: bx, y: by};
        const C = {x: cx, y: cy};

        const winding = this.orientation(A, B, C) === 1 ? 1 : -1;
        const bbox = this.getBoundingBox(A, B, C)


        for (let y = bbox.ymin; y <= bbox.ymax; y++) {
            for (let x = bbox.xmin; x <= bbox.xmax; x++) {
                let P = {x, y};

                //Aufgabe 4.2
                let denominator = this.getDeterminant(A, B, C);
                let alpha = this.getDeterminant(P, B, C) / denominator;
                let beta = this.getDeterminant(P, C, A) / denominator;
                let gamma = 1 - alpha - beta;

                if (winding * this.getDeterminant(P, A, B) >= 0 &&
                    winding * this.getDeterminant(P, B, C) >= 0 &&
                    winding * this.getDeterminant(P, C, A) >= 0) {
                    let interpolatedColor = [0, 0, 0, 0];

                    for (let i = 0; i < interpolatedColor.length; i++) {
                        interpolatedColor[i] = alpha * colorA[i] + beta * colorB[i] + gamma * colorC[i];
                    }

                    console.log("Triangle", interpolatedColor);
                    this.setPixel(P.x, P.y, interpolatedColor, framebuffer);
                }

            }
        }
    },


    getBoundingBox(A, B, C) {
        return {
            xmin: Math.min(A.x, B.x, C.x),
            ymin: Math.min(A.y, B.y, C.y),
            xmax: Math.max(A.x, B.x, C.x),
            ymax: Math.max(A.y, B.y, C.y)
        };
    },

    // Source: https://www.geeksforgeeks.org/orientation-3-ordered-points/
    orientation(p1, p2, p3) {
        const val = (p2.y - p1.y) * (p3.x - p2.x) - (p2.x - p1.x) * (p3.y - p2.y);
        // collinear
        if (val === 0) return 0;

        return (val > 0) ? 1 : 2;
    },


     getDeterminant(point, p1, p2) {
         let abx = p2.x - p1.x;
         let aby = p2.y - p1.y;
         let acx = point.x - p1.x;
         let acy = point.y - p1.y;
         return aby * acx - abx * acy;
     },



    //ESA 4
    drawBezier(p0, p1, p2, p3, c0, c1, numSamples){
        let samples = [];
        let colors=[];

        for (let t = 0; t <= 1; t+= 1/numSamples){
            let oot = 1 - t;
            let p = vec2.zero();
            //TODO: Bezier, 4 LoC
            vec2.scale(p, p0, oot * oot * oot);
            vec2.mad(p, p, p1, 3 * oot * oot * t);
            vec2.mad(p, p, p2, 3 * oot * t * t);
            vec2.mad(p, p, p3, t * t * t);

            samples.push(p);

            let c = vec4.zero()
            //TODO: Bezier, 1 LoC
            vec4.lerp(c, c0, c1, t);
            colors.push(c);

            console.log("Total Samples:", samples.length);
            console.log("Total Samples:", colors.length);

        }

        console.log(numSamples);
        for (let i = 0; i < numSamples; i++) {
           console.log(samples[i][0], samples[i][1], colors[i]);
            this.drawLine(
                samples[i][0], samples[i][1],
                samples[i + 1][0], samples[i + 1][1],
                colors[i], colors[i + 1], true
            );
        }

    }

}

export default Rasterizer;




