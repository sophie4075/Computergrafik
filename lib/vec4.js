import * as common from './common.js'


// creates a new zero initialized array
export function zero() {
	return [0, 0, 0, 0]
}

// sets the vector's values
export function set(out, x, y, z, w) {
	out[0] = x
	out[1] = y
	out[2] = z
	out[3] = w
}

// copies a's values to out
export function copy(out, a) {
	out[0] = a[0]
	out[1] = a[1]
	out[2] = a[2]
	out[3] = a[3]
}

// creates a new vector with the same values
export function clone(v) {
	return [ v[0], v[1], v[2], v[3] ]
}

// adds a and b
export function add(out, a, b) {
	out[0] = a[0] + b[0]
	out[1] = a[1] + b[1]
	out[2] = a[2] + b[2]
	out[3] = a[3] + b[3]
}

// subtracts b from a
export function subtract(out, a, b) {
	out[0] = a[0] - b[0]
	out[1] = a[1] - b[1]
	out[2] = a[2] - b[2]
	out[3] = a[3] - b[3]
}

// multipies v with a scalar
export function scale(out, v, scale) {
	out[0] = v[0] * scale
	out[1] = v[1] * scale
	out[2] = v[2] * scale
	out[3] = v[3] * scale
}

// mad = multiply and add
// a commonly used operation, thus optimized to one call
export function mad(out, a, b, scale) {
	out[0] = a[0] + b[0] * scale
	out[1] = a[1] + b[1] * scale
	out[2] = a[2] + b[2] * scale
	out[3] = a[3] + b[3] * scale
}

// computes the dot product of a and b
export function dot(a, b) {
	return a[0]*b[0] +
		   a[1]*b[1] +
		   a[2]*b[2] +
		   a[3]*b[3]
}

// multiplies component wise
export function hadamard(out, a, b) {
	out[0] = a[0] * b[0]
	out[1] = a[1] * b[1]
	out[2] = a[2] * b[2]
	out[3] = a[3] * b[3]
}

// snaps the vector to the next smaller integers
export function floor(out, a) {
	let floor = Math.floor
	out[0] = floor(a[0])
	out[1] = floor(a[1])
	out[2] = floor(a[2])
	out[3] = floor(a[3])
}

// snaps the vector to the next bigger integers
export function ceil(out, a) {
	let ceil = Math.ceil
	out[0] = ceil(a[0])
	out[1] = ceil(a[1])
	out[2] = ceil(a[2])
	out[3] = ceil(a[3])
}

// returns the minima of a and b componentwise 
export function min(out, a, b) {
	let min = Math.min
	out[0] = min(a[0], b[0])
	out[1] = min(a[1], b[1])
	out[2] = min(a[2], b[2])
	out[3] = min(a[3], b[3])
}

// returns the maxima of a and b componentwise 
export function max(out, a, b) {
	let max = Math.max
	out[0] = max(a[0], b[0])
	out[1] = max(a[1], b[1])
	out[2] = max(a[2], b[2])
	out[3] = max(a[3], b[3])
}

// euclidean distance between two points
export function distance(a, b) {
	return Math.hypot(
		b[0] - a[0],
		b[1] - a[1],
		b[2] - a[2],
		b[3] - a[3]
	)
}

// euclidean length
export function length(v) {
	return Math.hypot(v[0], v[1], v[2], v[3])
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
	out[3] = v[3] * len
}

// interpolates linearly from a to b
export function lerp(out, a, b, t) {
	let oot = 1 - t
	out[0] = a[0] * oot + t * b[0]
	out[1] = a[1] * oot + t * b[1]
	out[2] = a[2] * oot + t * b[2]
	out[3] = a[3] * oot + t * b[3]
}

// calculates the barycentric point of a,b,c and d
// with corresponding weights u,v,w and q
export function barylerp(out, a,b,c,d, uvwq) {
	let [u, v, w, q] = uvwq
	out[0] = a[0]*u + b[0]*v + c[0]*w + d[0]*q
	out[1] = a[1]*u + b[1]*v + c[1]*w + d[1]*q
	out[2] = a[2]*u + b[2]*v + c[2]*w + d[2]*q
	out[3] = a[3]*u + b[3]*v + c[3]*w + d[3]*q
}

// generates a random vector with the given scale
export function random(out, scale=1) {
	// Marsaglia, George. Choosing a Point from the Surface of a
	// Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
	// http://projecteuclid.org/euclid.aoms/1177692644
	let v1, v2, v3, v4
	let s1, s2
	let random = Math.random

	do {
		v1 = random() * 2 - 1
		v2 = random() * 2 - 1
		s1 = v1 * v1 + v2 * v2
	} while (s1 >= 1)

	do {
		v3 = random() * 2 - 1
		v4 = random() * 2 - 1
		s2 = v3 * v3 + v4 * v4
	} while (s2 >= 1)

	let d = Math.sqrt((1 - s1) / s2)
	out[0] = scale * v1
	out[1] = scale * v2
	out[2] = scale * v3 * d
	out[3] = scale * v4 * d
}

// multiplies v with a 4x4 matrix
export function transform(out, m, v) {
	let x = v[0]
	let y = v[1]
	let z = v[2]
	let w = v[3]
	out[0] = m[0]*x + m[4]*y + m[8] *z + m[12]*w
	out[1] = m[1]*x + m[5]*y + m[9] *z + m[13]*w
	out[2] = m[2]*x + m[6]*y + m[10]*z + m[14]*w
	out[3] = m[3]*x + m[7]*y + m[11]*z + m[15]*w
}

// checks if two vectors are considered equal
export function equals(a, b) {
	let abs = Math.abs
	return abs(a[0] - b[0]) < common.EPSILON &&
		   abs(a[1] - b[1]) < common.EPSILON &&
		   abs(a[2] - b[2]) < common.EPSILON &&
		   abs(a[3] - b[3]) < common.EPSILON
}

// returns a string representation of a vector
export function string(v) {
	return `vec4(
		${v[0].toFixed(3)},
		${v[1].toFixed(3)},
		${v[2].toFixed(3)},
		${v[3].toFixed(3)}
	)`
}
