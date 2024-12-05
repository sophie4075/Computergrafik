import * as common from './common.js'


// creates a new zero initialized array
export function zero() {
	return [0, 0, 0]
}

// sets the vector's values
export function set(out, x, y, z) {
	out[0] = x
	out[1] = y
	out[2] = z
}

// copies a's values to out
export function copy(out, a) {
	out[0] = a[0]
	out[1] = a[1]
	out[2] = a[2]
}

// creates a new vector with the same values
export function clone(v) {
	return [ v[0], v[1], v[2] ]
}

// adds a and b
export function add(out, a, b) {
	out[0] = a[0] + b[0]
	out[1] = a[1] + b[1]
	out[2] = a[2] + b[2]
}

// subtracts b from a
export function subtract(out, a, b) {
	out[0] = a[0] - b[0]
	out[1] = a[1] - b[1]
	out[2] = a[2] - b[2]
}

// multipies v with a scalar
export function scale(out, v, scale) {
	out[0] = v[0] * scale
	out[1] = v[1] * scale
	out[2] = v[2] * scale
}

// mad = multiply and add
// a commonly used operation, thus optimized to one call
export function mad(out, a, b, scale) {
	out[0] = a[0] + b[0] * scale
	out[1] = a[1] + b[1] * scale
	out[2] = a[2] + b[2] * scale
}

// computes the dot product of a and b
export function dot(a, b) {
	return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
}

// performs vector cross product
export function cross(out, a, b) {
	out[0] = a[1]*b[2] - a[2]*b[1]
	out[1] = a[2]*b[0] - a[0]*b[2]
	out[2] = a[0]*b[1] - a[1]*b[0]
}

// multiplies component wise
export function hadamard(out, a, b) {
	out[0] = a[0] * b[0]
	out[1] = a[1] * b[1]
	out[2] = a[2] * b[2]
}

// snaps the vector to the next smaller integers
export function floor(out, a) {
	let floor = Math.floor
	out[0] = floor(a[0])
	out[1] = floor(a[1])
	out[2] = floor(a[2])
}

// snaps the vector to the next bigger integers
export function ceil(out, a) {
	let ceil = Math.ceil
	out[0] = ceil(a[0])
	out[1] = ceil(a[1])
	out[2] = ceil(a[2])
}

// returns the minima of a and b componentwise 
export function min(out, a, b) {
	let min = Math.min
	out[0] = min(a[0], b[0])
	out[1] = min(a[1], b[1])
	out[2] = min(a[2], b[2])
}

// returns the maxima of a and b componentwise 
export function max(out, a, b) {
	let max = Math.max
	out[0] = max(a[0], b[0])
	out[1] = max(a[1], b[1])
	out[2] = max(a[2], b[2])
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
	return Math.hypot(v[0], v[1], v[2])
}

// computes a vector of unit length in the direction of v
export function normalize(out, v) {
	let len = dot(v, v)
	if (len > 0) {
		len = 1 / Math.sqrt(len);
	}
	out[0] = v[0] * len
	out[1] = v[1] * len
	out[2] = v[2] * len
}

// interpolates linearly from a to b
export function lerp(out, a, b, t) {
	let oot = 1 - t
	out[0] = a[0] * oot + t * b[0]
	out[1] = a[1] * oot + t * b[1]
	out[2] = a[2] * oot + t * b[2]
}

// calculates the barycentric point of a,b and c
// with corresponding weights u,v and w
export function barylerp(out, a,b,c, uvw) {
	let [u, v, w] = uvw
	out[0] = a[0]*u + b[0]*v + c[0]*w
	out[1] = a[1]*u + b[1]*v + c[1]*w
	out[2] = a[2]*u + b[2]*v + c[2]*w
}

// generates a random unit vector (or with scale)
export function random(out, scale=1) {
	let r = Math.random() * 2.0 * Math.PI
	let z = (Math.random() * 2.0) - 1.0
	let zScale = Math.sqrt(1.0 - z*z) * scale

	out[0] = Math.cos(r) * zScale
	out[1] = Math.sin(r) * zScale
	out[2] = z * scale
}

// multiplies v with a 3x3 matrix
export function transform(out, m, v) {
	let x = v[0]
	let y = v[1]
	let z = v[2]
	out[0] = m[0]*x + m[3]*y + m[6]*z
	out[1] = m[1]*x + m[4]*y + m[7]*z
	out[2] = m[2]*x + m[5]*y + m[8]*z
}

// checks if two vectors are considered equal
export function equals(a, b) {
	return Math.abs(a[0] - b[0]) < common.EPSILON &&
		   Math.abs(a[1] - b[1]) < common.EPSILON &&
		   Math.abs(a[2] - b[2]) < common.EPSILON
}

// returns a string representation of a vector
export function string(v) {
	return `vec3(
		${v[0].toFixed(3)},
		${v[1].toFixed(3)},
		${v[2].toFixed(3)}
	)`
}



