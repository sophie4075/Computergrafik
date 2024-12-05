import Mesh from '../engine/mesh.js'

// unit cube vertex positions
let _positions = [
    // front
    [-0.5, -0.5,  0.5],  // bottom left
    [ 0.5, -0.5,  0.5],  // bottom right
    [ 0.5,  0.5,  0.5],  // upper right
    [-0.5,  0.5,  0.5],  // upper left
    // back
    [-0.5, -0.5, -0.5],
    [ 0.5, -0.5, -0.5],
    [ 0.5,  0.5, -0.5],
    [-0.5,  0.5, -0.5],
]

let _pointIndices = [
    0, 1, 2, 3, 4, 5, 6, 7
]

let _lineIndices = [
    // EXERCISE
    //Front
    0, 1, 1, 2, 2, 3, 3, 0,
    //Back
    4, 5, 5, 6, 6, 7, 7, 4,
    //Connect
    0, 4, 1, 5, 2, 6, 3, 7,
]

let _triangleIndices = [
    // front
    0, 1, 2,
    2, 3, 0,
    // right
    1, 5, 6,
    6, 2, 1,
    // back
    7, 6, 5,
    5, 4, 7,
    // left
    4, 0, 3,
    3, 7, 4,
    // bottom
    4, 5, 1,
    1, 0, 4,
    // top
    3, 2, 6,
    6, 7, 3,
]

let _rgbColors = [

    [0, 0, 0, 255],
    [255, 0, 0, 255],
    [255, 255, 0, 255],
    [0, 255, 0, 255],
    [0, 0, 255, 255],
    [255, 0, 255, 255],
    [255, 255, 255, 255],
    [0, 255, 255, 255],

]


export class DefaultCube extends Mesh {
    constructor(primitiveType=Mesh.POINT, color) {
        // a default cube has only one color,
        // Mesh expects an array of vec4 for color,
        // so either we supply it or the debug color is used automatically
        color = color ? [color] : undefined

        switch (primitiveType) {
            case Mesh.POINT:
                super(primitiveType, _positions, _pointIndices, color)
                break
            case Mesh.LINE:
                super(primitiveType, _positions, _lineIndices, color)
                break
            case Mesh.TRIANGLE:
                super(primitiveType, _positions, _triangleIndices, color)
                break
        }
    }
}

export class RGBCube extends Mesh {
    constructor(primitiveType=Mesh.TRIANGLE) {
        super(primitiveType, _positions, _triangleIndices, _rgbColors);
    }
}

export default {
    DefaultCube,
    RGBCube,
}
