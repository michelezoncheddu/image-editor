'use strict';

/**
 * Detects the key pressing
 */
function onKeyDown(evt) {
	if (evt.key == 'Escape') {
		evt.preventDefault();
		selection = null;
		update();
	} else if (evt.ctrlKey) {
		evt.preventDefault();
		switch(evt.key) {
		case 'a': // ctrl-a
			selection = new Rectangle(marginX, marginY, scaledWidth, scaledHeight);
			update();
			break;

		case 'z': // ctrl-z
			var tmp = image;
			image = lastImage;
			lastImage = tmp;
			setScaledSize();
			update();
			break;
		}
	} else if (evt.key == 'Enter' && currTool == 'crop' && selection != null) { // enter
		evt.preventDefault();
		cropImage();
		update();
	}
}


/**
 * Changes the canvas size, the scaled image size and updates the context
 */
function onResize() {
	canvas.height = window.innerHeight * 0.65;
	canvas.width = window.innerWidth * 0.65;
	setScaledSize();
	update();
}
