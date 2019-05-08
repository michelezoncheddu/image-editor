'use strict';

function init() {
	// @ts-ignore
	canvas = document.getElementById('image');
	canvas.height = window.innerHeight * 0.8;
	canvas.width = window.innerWidth * 0.8;
	$('#tools').css('top', canvas.height + (canvas.height / 20));

	// TEST
	image.src = 'test_images/test_2.jpg';
	var ratio = image.width / image.height;
	scaledWidth = canvas.width;
	scaledHeight = scaledWidth / ratio;
	if (scaledHeight > canvas.height) {
		scaledHeight = canvas.height;
		scaledWidth = scaledHeight * ratio;
	}

	context = canvas.getContext('2d');
	context.imageSmoothingQuality = 'high';
	context.imageSmoothingEnabled = true;

	// background color
	context.fillStyle = '#262626';

	window.addEventListener('resize', onResize);
	document.addEventListener('mousedown', onMouseDown);
	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('mouseup', onMouseUp);

	canvas.onmouseenter = () => inside = true;
	canvas.onmouseleave = () => inside = false;

	$('.icon').click(function() {
		if ($(this).prop('id') == 'upload') { // TODO: good string check?
			// deselect other icons
			var icons = document.getElementsByClassName('icon');
			for (var i = 0; i < icons.length; i++)
				if (icons[i].classList.contains('active'))
					icons[i].classList.remove('active');
			currTool = 'none';
			return;
		}

		// user deselected the current tool
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			currTool = 'none';
			return;
		}

		// user selected an another tool
		var icons = document.getElementsByClassName('icon');
		for (var i = 0; i < icons.length; i++) { // disable the current tool
			if (icons[i].classList.contains('active')) {
				icons[i].classList.remove('active');
				break;
			}
		}
		$(this).addClass('active');
		currTool = $(this).attr('id');
	})

	update();

	// TEST
	var slider = document.getElementById('rotateSlider');
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
