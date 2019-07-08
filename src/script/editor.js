'use strict';

/**
 * Initializes the editor state
 */
function init() {
	canvas = $('#editor')[0];
	canvas.height = window.innerHeight * 0.65;
	canvas.width = window.innerWidth * 0.65;
	canvasBorder = canvas.getBoundingClientRect();

	context = canvas.getContext('2d');
	context.imageSmoothingQuality = 'high';
	context.imageSmoothingEnabled = true;

	context.fillStyle = '#262626'; // background color

	// event handlers
	document.onmousedown = onMouseDown;
	document.onmousemove = onMouseMove;
	document.onmouseup = onMouseUp;
	
	document.onkeydown = onKeyDown;

	document.ontouchstart = onTouchStart;
	document.ontouchmove = onMouseMove;
	document.ontouchend = onMouseUp;

	canvas.onmouseenter = () => inside = true;
	canvas.onmouseleave = () => inside = false;

	$('.tool-button').click(toolSelector);

	// sliders handlers
	$('#zoomSlider').on('input', onZoomChange);
	$('#rotateSlider').on('input', onRotateChange);
	$('#brightnessSlider').on('input', onBrightnessChange);
	$('#saturationSlider').on('input', onSaturationChange);

	// slider color progress
	$('.slider').on('input', onSliderChange);

	// TEST
	image.onload = () => (setScaledSize(), update());
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

	// saving rotated image
	// TODO: save filters
	if (lastTool == 'rotate') {
		saveImage();
		angleInDegrees = 0;
		$('#degreesValue').html(angleInDegrees.toString() + '°');
		$('#rotateSlider').val(angleInDegrees);
		$('#rotateSlider').trigger('input');
	}

	update();
}
