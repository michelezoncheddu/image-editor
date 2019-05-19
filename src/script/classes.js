'use strict';

class Rectangle {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.dragged = false;
	}

	contains(point) {
		return point.x.between(this.x, this.x + this.width) && point.y.between(this.y, this.y + this.height)
	}
}
