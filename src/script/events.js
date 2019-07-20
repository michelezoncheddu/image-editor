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
			if (currTool != 'zoom') {
				var tmp = image;
				image = lastImage;
				lastImage = tmp;
				setScaledSize();
				update();
			}
			break;
		}
	} else if (evt.key == 'Enter' && currTool == 'crop' && selection != null) { // enter
		evt.preventDefault();
		cropImage();
		setScaledSize();
		resetEditor();
		update();
	}
}

/**
 * Changes the canvas size, the scaled image size and updates the context
 */
function onResize() {
	canvas.width = window.innerWidth * widthPercentage;
	canvas.height = window.innerHeight * heightPercentage;
	setScaledSize();
	update();
}

/**
 * Opens the popup on click
 */
function showHelp() {
	$('#help-popup')[0].classList.toggle('show');
}

function updateHelp() {
	switch (currTool) {
		case 'none':
		$('#help-popup').html('Load an image and choose a tool to start editing');
		break;

		case 'zoom':
		$('#help-popup').html('Zoom and drag the image around the screen');
		break;

		case 'crop':
		$('#help-popup').html('Drag a selection area and press Enter to crop');
		break;

		case 'rotate':
		$('#help-popup').html('Rotate the image with the slider');	
		break;

		case 'filters':
		$('#help-popup').html('Drag a selection area to apply the filters<br>Ctrl-A selects the whole image');	
		break;

		default:
		$('#help-popup').html(';)');
	}
}
