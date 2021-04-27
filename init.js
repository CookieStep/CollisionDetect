var {
    cos,
    sin,
    tan,
    atan2,
    sqrt,
    PI,
    round
} = Math;

var COLOR_MODE = false;

var canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");

var scale = 40;

var loop = (value, max) => (value % max + max) % max;
var rotate = (value, range) => {
	if(value > +range/2) value -= range;
	if(value < -range/2) value += range;
	return value;
}
var rDis = (r, r2=0) => rotate(loop(r - r2, PI * 2), PI * 2);