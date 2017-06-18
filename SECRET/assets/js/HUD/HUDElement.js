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
	// this.DOM.fadeOut("fast");
	this.DOM.hide();
};

HUDElement.prototype.show = function() {
	this.isVisible = true
	// this.DOM.fadeIn("fast");
	this.DOM.show();
};

HUDElement.prototype.getHTML = function () {
    return this.DOM.html();
}

HUDElement.prototype.setHTML = function (html) {
    this.DOM.html(html);
}