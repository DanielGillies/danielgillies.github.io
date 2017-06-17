function Manager() {
	this.index = 0;
	this.list = [];
	this.numItems = 0;
}

Manager.prototype.addItem = function(item) {
	this.list.push(item);
	this.numItems++;
}

Manager.prototype.next = function() {
	if (this.index < this.numItems - 1) {
		this.index++;
		this.buildCurrent();
	}
};

Manager.prototype.prev = function() {
	if (this.index > 0) {
		this.index--;
		this.buildCurrent();
	}
};

Manager.prototype.buildCurrent = function() {
	this.list[this.index].generateHTML();
	this.list[this.index].buildDom();
};