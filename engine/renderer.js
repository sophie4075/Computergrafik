import Mesh from './mesh.js'
import * as vec3 from '../lib/vec3.js'
import * as vec4 from "../lib/vec4.js";
import * as vec2 from "../lib/vec2.js";


// A renderer is more high level than a rasterizer.
// He decides which geometric primitives have to be rasterized at all.
// Deciding this has to do with scene setup, visibility detection, culling and so on.

export default {

    rasterizer: null,
    scale: 40,


    init: function (rasterizer) {
        this.rasterizer = rasterizer
    },

    transformPosition: function (out, position) {

        vec3.copy(out, position);

        //Mirror y
        out[1] = -out[1];

        //Scale
        vec3.scale(out, out, this.scale);


        const canvasCenterX = (this.rasterizer.canvasWidth / this.rasterizer.canvasPixelSize) / 2 ;
        const canvasCenterY = (this.rasterizer.canvasHeight / this.rasterizer.canvasPixelSize) / 2 ;
        const canvasCenter = [canvasCenterX, canvasCenterY, 0];

        //Center
        vec3.add(out, out, canvasCenter);


        const focalLength = this.scale * 5
        if (out[2] !== 0) {
            console.log("out 0 ",(out[0])/40, "out 1 ",(out[1])/40, "out 2",(out[2])/40)
            console.log((out[0] * 200), "/", out[2] + 200)
            out[0] = (out[0] * 200) / (out[2] + 200);
            out[1] = (out[1] * 200) / (out[2] + 200);
        }


    },

    draw: function (meshes = []) {
        console.assert(this.rasterizer !== null)
        console.log('renderer.draw(meshes) has been called.')

        for (let mesh of meshes) {

            // the renderer will not change the contents of the attributes
            // so its ok we access them here (this avoids a lot of get/set boilerplate)
            let positions = mesh._positions
            let indices = mesh._indices
            let colors = mesh._colors

            // detect if individual vertex color are defined
            let multipleColors = colors.length > 1
            //console.log("color length: ", colors[0].length);
            let singleColor = colors[0]

            // temporary variable for vertex transformations
            let transformedA = vec3.zero()

            switch (mesh._primitiveType) {
                case Mesh.POINT:
                    for (let i = 0; i < mesh._indices.length; i++) {
                        let vi = indices[i]
                        this.transformPosition(transformedA, positions[vi])
                        this.rasterizer.setPixel(
                            transformedA[0], transformedA[1],
                            multipleColors ? colors[vi] : singleColor
                        )
                    }
                    break

                case Mesh.LINE:

                    for (let i = 0; i < mesh._indices.length; i += 2) {
                        let A = indices[i];
                        let B = indices[i + 1];

                        this.transformPosition(transformedA, positions[A]);
                        let endPoint = vec3.zero();
                        this.transformPosition(endPoint, positions[B]);


                        for (let t = 0; t <= 1; t += 1 / this.scale) {
                            vec3.lerp(transformedA, positions[A], positions[B], t);
                            this.transformPosition(transformedA, transformedA);

                            this.rasterizer.setPixel(
                                transformedA[0], transformedA[1],
                                multipleColors
                                    ? vec4.lerp([], colors[A], colors[B], t)
                                    : singleColor
                            );
                        }
                    }
                    break

                case Mesh.TRIANGLE:

                    for (let i = 0; i < mesh._indices.length; i += 3) {
                        let A = indices[i];
                        let B = indices[i + 1];
                        let C = indices[i + 2];


                        this.transformPosition(transformedA, positions[A]);
                        const a = [transformedA[0], transformedA[1]];
                        const colorA = multipleColors ? colors[A] : singleColor;

                        this.transformPosition(transformedA, positions[B]);
                        const b = [transformedA[0], transformedA[1]];
                        const colorB = multipleColors ? colors[B] : singleColor;

                        this.transformPosition(transformedA, positions[C]);
                        const c = [transformedA[0], transformedA[1]];
                        const colorC = multipleColors ? colors[C] : singleColor;

                        const winding = vec2.signedTriangleArea(a, b, c) > 0 ? 1 : -1;

                        const xmin = Math.min(a[0], b[0], c[0]);
                        const xmax = Math.max(a[0], b[0], c[0]);
                        const ymin = Math.min(a[1], b[1], c[1]);
                        const ymax = Math.max(a[1], b[1], c[1]);

                        for (let y = ymin; y <= ymax; y++) {
                            for (let x = xmin; x <= xmax; x++) {
                                const p = [x, y];

                                if (winding * vec2.signedTriangleArea(p, a, b) >= 0 &&
                                    winding * vec2.signedTriangleArea(p, b, c) >= 0 &&
                                    winding * vec2.signedTriangleArea(p, c, a) >= 0) {

                                    const denominator = vec2.signedTriangleArea(a, b, c)
                                    const alpha = vec2.signedTriangleArea(p, b, c) / denominator;
                                    const beta = vec2.signedTriangleArea(p, c, a) / denominator;
                                    const gamma = 1 - alpha - beta;

                                    const interpolatedColor = [
                                        alpha * colorA[0] + beta * colorB[0] + gamma * colorC[0],
                                        alpha * colorA[1] + beta * colorB[1] + gamma * colorC[1],
                                        alpha * colorA[2] + beta * colorB[2] + gamma * colorC[2],
                                        alpha * colorA[3] + beta * colorB[3] + gamma * colorC[3],
                                    ];

                                    this.rasterizer.setPixel(x, y, interpolatedColor);
                                }
                            }
                        }
                    }
                    break
            }
        }
    }
}
