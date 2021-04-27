class Point{
	/**@param {number} x @param {number} y*/
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	/**@param {Point} point*/
	distanceTo(point) {
		return Point.distanceTo(this, point);
	}
	/**@param {Point} point*/
	radianTo(point) {
		return Point.radianTo(this, point);
	}
	toString() {
		return `(${this.x}, ${this.y})`;
	}
	/**@param {Point} point @param {Point} point2*/
	static radianTo(point, point2) {
		return atan2(point2.y - point.y, point2.x - point.x);
	}
	/**@param {Point} point @param {Point} point2*/
	static distanceTo(point, point2) {
		return sqrt((point.x - point2.x) ** 2 + (point.y - point2.y) ** 2);
	}
	draw() {
		ctx.beginPath();
		ctx.arc(this.x * scale, this.y * scale, scale/10, 0, PI * 2);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}
class PolyPoint extends Point{
	/**@param {number} x @param {number} y @param {Polygon} polygon*/
	constructor(x, y, polygon) {
		super(0, 0);
		this.sx = x;
		this.sy = y;
		this.shape = polygon;
	}
	set x(x) {}
	set y(y) {}
	get x() {
		var {shape} = this;
		return this.sx * shape.radius + shape.x;
	}
	get y() {
		var {shape} = this;
		return this.sy * shape.radius + shape.y;
	}
}
class Polygon extends Point{
	/**@param {number} x @param {number} y*/
	constructor(x, y, sides=4, radius=1, radian=0) {
		super(x, y);
		this.radius = radius;
		this._radian = radian;
		this.sides = sides;
	}
	set radian(radian) {
		this._radian = radian;
		var {length: sides} = this.points;
		for(let i = 0; i < sides; i++) {
			let point = this.points[i];
			let rad = radian + i * (PI * 2)/sides;
			point.sx = cos(rad);
			point.sy = sin(rad);
		}
	}
	get radian() {
		return this._radian;
	}
	set sides(sides) {
		var {radian} = this;
		this.points = [];
		this._sides = sides;
		for(let i = 0; i < sides; i++) {
			let rad = radian + i * (PI * 2)/sides;
			this.points.push(new PolyPoint(
				cos(rad),
				sin(rad),
				this
			));
		}
	}
	get sides() {
		return this._sides;
	}
	draw() {
		var {points} = this;
		var {length: sides} = points;

		ctx.beginPath();
		for(let i = 0; i < sides; i++) {
			let point = points[i];
			if(i == 0) ctx.moveTo(point.x * scale, point.y * scale);
			else ctx.lineTo(point.x * scale, point.y * scale);
		}
		ctx.closePath();

		ctx.strokeStyle = "black";
		ctx.stroke();
	}
	/**@param {Polygon} shape*/
	isTouching(shape, color="#0000") {
		var sides = this.points.length;
		var intRad = PI/sides;
		var d = this.radius * cos(intRad);
		var l = intRad * 2;
		// ctx.beginPath();
		// for(let point of this.points) {
		// 	ctx.line(this, point);
		// }
		// ctx.strokeStyle = color;
		// ctx.stroke();
		var i = 0;
		for(let point of shape.points) {
			var radian = this.radianTo(point);
			var dis = loop(radian - this.radian, l);
			var cenRad = intRad - dis;
			let length = d / cos(cenRad);
			let distance = this.distanceTo(point);

			let pnt = new Point(this.x + cos(radian) * length, this.y + sin(radian) * length);

			let hue = i * 360/shape.sides;
			// console.log("len:", small(length), "dis:", small(distance), "rad:", small(dis/PI * 180), "cen:", small(cenRad/PI * 180), "hue:", hue, point.toString());
			ctx.beginPath();
			ctx.line(this, point);
			let color;
			if(!COLOR_MODE) {
				if(length > distance) {
					color = "red";
				}else{
					color = "green";
				}
			}else color = `hsl(${hue}, 100%, 50%)`;

			ctx.strokeStyle = color;
			pnt.color = color;
			ctx.stroke();
			pnt.draw();
			++i;
		}
		function small(num) {
			return round(num * 100)/100;
		}
		// ctx.strokeStyle = color;
		// ctx.stroke();
	}
	/**@param {Polygon} shape @param {Polygon} shape2*/
	static isTouching(shape, shape2) {
		return shape.isTouching(shape2) || shape2.isTouching(shape);
	}
	/**@type {PolyPoint[]}*/
	points = [];
}
ctx.line = (point, point2) => {
	ctx.moveTo(point.x * scale, point.y * scale);
	ctx.lineTo(point2.x * scale, point2.y * scale);
}