'use strict';

/**
 * Initializes the editor state
 */
function initializeEditor() {
	canvas = $('#editor')[0];
	canvas.widthPercentage = 0.65,
	canvas.heightPercentage = 0.65
	canvas.width = window.innerWidth * canvas.widthPercentage;
	canvas.height = window.innerHeight * canvas.heightPercentage;

	context = canvas.getContext('2d');
	context.imageSmoothingQuality = 'high';
	context.imageSmoothingEnabled = true;

	// event handlers
	document.onmousedown = onMouseDown;
	document.onmousemove = onMouseMove;
	document.onmouseup = onMouseUp;
	
	document.onkeydown = onKeyDown;

	document.ontouchstart = onTouchStart;
	document.ontouchmove = onMouseMove;
	document.ontouchend = onMouseUp;

	window.onresize = onResize;

	canvas.onmouseenter = () => canvas.inside = true;
	canvas.onmouseleave = () => canvas.inside = false;

	$('#help').click(showHelp);
	$('#title').click(showCredits);
	$('.tool-button').click(toolSelector);

	// slider color progress
	$('.slider').on('input', onSliderChange);

	// sliders handlers
	$('#zoom-slider').on('input', onZoomChange);
	$('#rotate-slider').on('input', onRotateChange);
	$('#brightness-slider').on('input', onBrightnessChange);
	$('#saturation-slider').on('input', onSaturationChange);
	$('#contrast-slider').on('input', onContrastChange);
	$('#exposure-slider').on('input', onExposureChange);
	$('#sepia-slider').on('input', onSepiaChange);

	// because these sliders don't start from the center
	$('#zoom-slider').trigger('input');
	$('#exposure-slider').trigger('input');
	$('#sepia-slider').trigger('input');

	// first draw
	update();
}

/**
 * Detects the selected tool and enables its related button
 */
function toolSelector() {
	let lastTool = currTool;
	currTool = $(this).prop('id');

	$('#' + lastTool).removeClass('selected');
	if (currTool != lastTool && currTool != 'upload')
		$('#' + currTool).addClass('selected');
	else
		currTool = 'none';

	$('#' + lastTool + '-div').addClass('hidden');
	$('#' + currTool + '-div').removeClass('hidden');

	let canvas = null; // to not draw two times when saving and downloading at the same time

	// saving image
	if ((lastTool == 'rotate' && angleInDegrees != 0) || (lastTool == 'filters' && selection != null)) {
		canvas = saveImage();
		setScaledSize();
		resetEditor();
	}

	// downloading image
	if (currTool == "download") {
		downloadImage(canvas);
		$('#download').removeClass('selected');
		currTool = 'none';
	}
	
	updateHelp();
	update();
}
