function HUD(scene) {
	this.scene = scene;
	this.hudElements = [];
	this.isVisible = true;
}

HUD.prototype.getScene = function() {
	return this.scene;
};

HUD.prototype.toggle = function() {
	if (this.isVisible) {
		this.hide();
	} else {
		this.show();
	}
};

HUD.prototype.hide = function() {
	this.isVisible = false;
	// Loop through each hud element and hide it
	this.hudElements.forEach(function(item, index) {
		item.hide();
	})
};

HUD.prototype.show = function() {
	this.isVisible = true;
	// Loop through each hud element and show it
	this.hudElements.forEach(function(item, index) {
		item.show();
	})
};

HUD.prototype.addHUDElement = function(HUDElement) {
	this.hudElements.push(HUDElement);
};

HUD.prototype.getHUDElementByName = function(name) {
	for (var i = 0; i < this.hudElements.length; i++) {
		if (this.hudElements[i].namme == name) {
			return this.hudElements[i];
		}
	}
}