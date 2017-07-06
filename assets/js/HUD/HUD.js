"use strict";
function Hud() {
	this.scene;
	this.HudElements = [];
	this.isVisible = true;
}

Hud.prototype.getScene = function() {
	return this.scene;
};

Hud.prototype.toggle = function() {
	if (this.isVisible) {
		this.hide();
	} else {
		this.show();
	}
};

Hud.prototype.hide = function() {
	this.isVisible = false;
	// Loop through each Hud element and hide it
	this.HudElements.forEach(function(item, index) {
		item.hide();
	})
};

Hud.prototype.show = function() {
	this.isVisible = true;
	// Loop through each Hud element and show it
	this.HudElements.forEach(function(item, index) {
		item.show();
	})
};

Hud.prototype.addHudElement = function(HudElement) {
	this.HudElements.push(HudElement);
};

Hud.prototype.getHudElementByName = function(name) {
	for (var i = 0; i < this.HudElements.length; i++) {
		if (this.HudElements[i].name == name) {
			return this.HudElements[i];
		}
	}
}