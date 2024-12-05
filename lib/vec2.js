import * as common from './common.js'


// creates a new zero initialized array
export function zero() {
	return [0, 0]
}

// sets the vector's values
export function set(out, x, y) {
	out[0] = x
	out[1] = y
}

// copies a's values to out
export function copy(out, a) {
	out[0] = a[0]
	out[1] = a[1]
}

// creates a new vector with the same values
export function clone(v) {
	return [ v[0], v[1] ]
}

// adds a and b
export function add(out, a, b) {
	out[0] = a[0] + b[0]
	out[1] = a[1] + b[1]
}

// subtracts b from a
export function subtract(out, a, b) {
	out[0] = a[0] - b[0]
	out[1] = a[1] - b[1]
}

// multipies v with a scalar
export function scale(out, v, scale) {
	out[0] = v[0] * scale
	out[1] = v[1] * scale
}

// mad = multiply and add
// a commonly used operation, thus optimized to one call
export function mad(out, a, b, scale) {
	out[0] = a[0] + b[0] * scale
	out[1] = a[1] + b[1] * scale
}

// computes the dot product of a and b
export function dot(a, b) {
	return a[0]*b[0] + a[1]*b[1]
}

// performs 2D vector "cross" product
export function determinant(out, a, b) {
	return a[0]*b[1] - a[1]*b[0]
}

// multiplies component wise
export function hadamard(out, a, b) {
	out[0] = a[0] * b[0]
	out[1] = a[1] * b[1]
}

// snaps the vector to the next smaller integers
export function floor(out, a) {
	let floor = Math.floor
	out[0] = floor(a[0])
	out[1] = floor(a[1])
}

// snaps the vector to the next bigger integers
export function ceil(out, a) {
	let ceil = Math.ceil
	out[0] = Math.ceil(a[0])
	out[1] = Math.ceil(a[1])
}

// returns the minima of a and b componentwise 
export function min(out, a, b) {
	let min = Math.min
	out[0] = min(a[0], b[0])
	out[1] = min(a[1], b[1])
}

// returns the maxima of a and b componentwise 
export function max(out, a, b) {
	let max = Math.max
	out[0] = max(a[0], b[0])
	out[1] = max(a[1], b[1])
}

// euclidean distance between two points
export function distance(a, b) {
	return Math.hypot(
		b[0] - a[0],
		b[1] - a[1],
		b[2] - a[2]
	)
}

// euclidean length
export function length(v) {
	return Math.hypot(v[0], v[1])
}

// computes a vector of unit length in the direction of v
export function normalize(out, v) {
	let len = dot(v, v)
	if (len > 0) {
		len = 1 / Math.sqrt(len);
	}
	out[0] = v[0] * len
	out[1] = v[1] * len
}

// interpolates linearly from a to b
export function lerp(out, a, b, t) {
	let oot = 1 - t
	out[0] = a[0] * oot + t * b[0]
	out[1] = a[1] * oot + t * b[1]
}

// generates a random unit vector (or with scale)
export function random(out, scale=1) {
  let r = Math.random() * 2.0 * Math.PI
  out[0] = Math.cos(r) * scale
  out[1] = Math.sin(r) * scale
}

// multiplies v with a 2x2 matrix
export function transform(out, m, v) {
	let x = v[0]
	let y = v[1]
	out[0] = m[0]*x + m[2]*y 
	out[1] = m[1]*x + m[3]*y
}

// checks if two vectors are considered equal
export function equals(a, b) {
	return Math.abs(a[0] - b[0]) < common.EPSILON &&
		   Math.abs(a[1] - b[1]) < common.EPSILON
}

// returns a string representation of a vector
export function string(v) {
	return `vec2(
		${v[0].toFixed(3)},
		${v[1].toFixed(3)}
	)`
}

//Returns the signed area of the triangle formed by p, p1, and p2.
export function signedTriangleArea(p, p1, p2) {
	return (p1[0] - p[0]) * (p2[1] - p[1]) - (p2[0] - p[0]) * (p1[1] - p[1]);
}
