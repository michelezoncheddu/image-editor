'use strict';

function init() {
	// @ts-ignore
	canvas = document.getElementById('editor');
	canvas.height = window.innerHeight * 0.7;
	canvas.width = window.innerWidth * 0.7;
	$('#toolbar').css('top', canvas.height + (canvas.height / 20));

	context = canvas.getContext('2d');
	context.imageSmoothingQuality = 'high';
	context.imageSmoothingEnabled = true;

	image.onload = function() {
		setImageSize();
		update();
	}

	// background color
	context.fillStyle = '#262626';

	// window.addEventListener('resize', onResize);
	document.addEventListener('mousedown', onMouseDown);
	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('mouseup', onMouseUp);

	canvas.onmouseenter = () => inside = true;
	canvas.onmouseleave = () => inside = false;

	$('.tool-button').click(toolSelector);

	// TEST
	image.src = 'test_images/test_2.jpg';

	update();

	// sliders
	var rotateSlider = document.getElementById('rotateSlider');
	rotateSlider.oninput = function() {
		// @ts-ignore
		angleInDegrees = this.value;
		document.getElementById('degrees').innerHTML = angleInDegrees.toString() + '°';
		update();
	}
	var brightnessSlider = document.getElementById('brightnessSlider');
	brightnessSlider.oninput = function() {
		// @ts-ignore
		brightness = this.value;
		update();
	}
	var saturationSlider = document.getElementById('saturationSlider');
	saturationSlider.oninput = function() {
		// @ts-ignore
		saturation = this.value;
		document.getElementById('saturation').innerHTML = (saturation - (100 - saturation)).toString();
		update();
	}

	$('.slider').on('input', function(e) {
		// @ts-ignore
		var min = e.target.min, max = e.target.max, val = e.target.value;
		$(e.target).css({
			'backgroundSize': (val - min) * 100 / (max - min) + '% 100%'
		});
	}).trigger('input');
}

function onMouseDown(evt) {
	currPos = getMousePos(evt);
	if (inside) {
		clickPos.x = currPos.x;
		clickPos.y = currPos.y;
		mouseDown = true;
		update();
	}
}

function onMouseMove(evt) {
	if (mouseDown) {
		currPos = getMousePos(evt);
		update();
	}
}

function onMouseUp(evt) {
	mouseDown = false;
	releasePos = getMousePos(evt);
	update();
}

function toolSelector() {
	var lastTool = currTool;
	if ($(this).prop('id') == 'upload') {
		// deselect other tools
		var tools = document.getElementsByClassName('tool-button');
		for (var i = 0; i < tools.length; i++)
			if (tools[i].classList.contains('active'))
				tools[i].classList.remove('active');
		currTool = 'none';
	}
	else if ($(this).hasClass('active')) { // user deselected the current tool
		$(this).removeClass('active');
		currTool = 'none';
	}
	else { // user selected an another tool
		var tools = document.getElementsByClassName('tool-button');
		for (var i = 0; i < tools.length; i++) { // disable the current tool
			if (tools[i].classList.contains('active')) {
				tools[i].classList.remove('active');
				break;
			}
		}
		$(this).addClass('active');
		currTool = $(this).attr('id');
	}
	updateWindow(lastTool);
}

function updateWindow(lastTool) {
	if (lastTool != 'none') { // there's something to hide
		var tool = document.getElementById(lastTool + 'Div');
		if (tool != null)
			tool.classList.add('hidden');
	}
	if (currTool != 'none') { // there's something to show
		var tool = document.getElementById(currTool + 'Div');
		if (tool != null)
			tool.classList.remove('hidden');
	}
}
