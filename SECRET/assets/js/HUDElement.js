function HUDElement(name, DOM) {
	this.name = name;
	this.DOM = DOM;
	this.isVisible = true;
}

HUDElement.prototype.hide = function() {
	this.isVisible = false
	this.DOM.hide();
};

HUDElement.prototype.show = function() {
	this.isVisible = true
	this.DOM.show();
};