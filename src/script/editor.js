'use strict';

/**
 * Initializes the editor state
 */
function init() {
	canvas = $('#editor')[0];
	canvas.width = window.innerWidth * widthPercentage;
	canvas.height = window.innerHeight * heightPercentage;
	canvasBorder = canvas.getBoundingClientRect();

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

	canvas.onmouseenter = () => inside = true;
	canvas.onmouseleave = () => inside = false;

	$('.tool-button').click(toolSelector);

	// slider color progress
	$('.slider').on('input', onSliderChange);

	// sliders handlers
	$('#zoomSlider').on('input', onZoomChange);
	$('#rotateSlider').on('input', onRotateChange);
	$('#brightnessSlider').on('input', onBrightnessChange);
	$('#saturationSlider').on('input', onSaturationChange);
	$('#contrastSlider').on('input', onContrastChange);
	$('#exposureSlider').on('input', onExposureChange);
	$('#sepiaSlider').on('input', onSepiaChange);

	// because these sliders don't start from the center
	$('#zoomSlider').trigger('input');
	$('#exposureSlider').trigger('input');
	$('#sepiaSlider').trigger('input');
	
	// TEST
	image.onload = () => (resetEditor(), setScaledSize(), update());
	image.src = 'test_images/merda.jpg';

	// first draw
	update();
}

/**
 * Detects the selected tool and enables its related button
 */
function toolSelector() {
	var lastTool = currTool;
	currTool = $(this).prop('id');

	$('#' + lastTool).removeClass('selected');
	if (currTool != lastTool && currTool != 'upload' && currTool != 'download')
		$('#' + currTool).addClass('selected');
	else
		currTool = 'none';

	$('#' + lastTool + 'Div').addClass('hidden');
	$('#' + currTool + 'Div').removeClass('hidden');

	// saving image
	if ((lastTool == 'rotate' && angleInDegrees != 0) || (lastTool == 'filters' && selection != null)) {
		saveImage();
		setScaledSize();
		resetEditor();
	}

	update();
}
