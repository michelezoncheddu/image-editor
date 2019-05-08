'use strict';

function init() {
	// @ts-ignore
	canvas = document.getElementById('editor');
	canvas.height = window.innerHeight * 0.7;
	canvas.width = window.innerWidth * 0.7;
	$('#tool-buttons').css('top', canvas.height + (canvas.height / 20));

	context = canvas.getContext('2d');
	context.imageSmoothingQuality = 'high';
	// context.imageSmoothingEnabled = true; // maybe not needed

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

	image.src = 'test_images/verticale.jpg';

	update();

	var slider = document.getElementById('rotateTool');
	slider.oninput = function() {
		// @ts-ignore
		angleInDegrees = this.value;
		update();
	}
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
		var tool = document.getElementById(lastTool + 'Tool');
		if (tool != null)
			tool.classList.add('hidden');
	}
	if (currTool != 'none') { // there's something to show
		var tool = document.getElementById(currTool + 'Tool');
		if (tool != null)
			tool.classList.remove('hidden');
	}
}
