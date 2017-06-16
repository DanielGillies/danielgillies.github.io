"use strict";
function HUDElement(name, DOM, HUD) {
	this.name = name;
	this.DOM = DOM;
	this.isVisible = true;
	this.HUD = HUD;

	this.HUD.addHudElement(this);
}

HUDElement.prototype.hide = function() {
	this.isVisible = false
	this.DOM.hide();
};

HUDElement.prototype.show = function() {
	this.isVisible = true
	this.DOM.show();
};