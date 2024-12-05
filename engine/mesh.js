import * as common from '../lib/common.js'

// simple mesh class
// - every position must have a color
//   as a feature, one can specify only a single color for all positions
// - indices must be a multiple of the primitive type
export default class Mesh {

	static POINT = 0
	static LINE = 1
	static TRIANGLE = 2

	constructor(primitiveType, positions=[], indices=[], colors=[common.ERROR_COLOR]) {
		// check if primitive type is supported
		if (primitiveType !== Mesh.POINT &&
			primitiveType !== Mesh.LINE &&
			primitiveType !== Mesh.TRIANGLE)
			throw new Error('Unsupported primitive type!')

		// check if line type is correct
		if (primitiveType === Mesh.LINE && indices.length % 2 !== 0)
			throw new Error('Number of indices does not match primitive type LINES')
		
		// check if triangle type is correct
		if (primitiveType === Mesh.TRIANGLE && indices.length % 3 !== 0) 
			throw new Error('Number of indices does not match primitive type TRIANGLE')

		// check if multi color attribute is correct
		if (colors.length !== 1 && positions.length !== colors.length)
			throw new Error('Number of positions and colors does not match!')

		// everything is ok, we have valid mesh data
		this._primitiveType = primitiveType
		this._positions = positions
		this._indices = indices
		this._colors = colors
	}
}
