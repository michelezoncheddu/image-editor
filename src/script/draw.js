'use strict';

function draw() {
	switch (currTool) {
		case 'none':
		drawImage();
		break;

		case 'crop':
		drawImage();
		if (selection != null)
			drawCrop();
		break;

		case 'rotate':
		drawImage();
		break;

		case 'levels':
		drawImage();
		if (selection != null)
			drawFilters();
		break;

		case 'pencil':
		if (mouseDown) {
			context.strokeStyle = '#00CC99';
			context.lineWidth = 3;
			context.lineJoin = 'round';
			context.lineCap = 'round';
			context.lineTo(currPos.x, currPos.y);
			context.stroke();
		}
		break;

		default:
		alert('Unknown tool: ' + currTool);
	}
}

function drawImage() {
	var context = canvas.getContext('2d');
	context.fillRect(0, 0, canvas.width, canvas.height); // draw background
	context.save();

	// rotate context around the center
	if (currTool == 'rotate') {
		context.translate(canvas.width / 2, canvas.height / 2);
		context.rotate(angleInDegrees * Math.PI / 180);
		context.translate(-canvas.width / 2, -canvas.height / 2);
	}
	context.drawImage(image, (canvas.width - scaledWidth) / 2, (canvas.height - scaledHeight) / 2, scaledWidth, scaledHeight);

	context.restore();
}

function drawCrop() {
	var startX = selection.x,
		startY = selection.y,
		currX  = currPos.x,
		currY  = currPos.y,
		width  = selection.width,
		height = selection.height;
	
	// external dark filler
	context.globalAlpha = 0.75;
	if (currY < startY) {
		context.fillRect(0, 0, canvas.width, currY);
		context.fillRect(0, startY, canvas.width, canvas.height - currY);
	} else {
		context.fillRect(0, 0, canvas.width, startY);
		context.fillRect(0, currY, canvas.width, canvas.height - currY);
	}
	if (currX < startX) {
		context.fillRect(0, currY, currX, startY - currY);
		context.fillRect(startX, startY, canvas.width - startX, currY - startY);
	} else {
		context.fillRect(0, currY, startX, startY - currY);
		context.fillRect(currX, currY, canvas.width - startX, startY - currY);
	}
	context.globalAlpha = 1;

	// border
	context.strokeStyle = '#FFFFFF';
	context.lineWidth = 1;
	context.strokeRect(startX, startY, width, height);

	// lines
	context.lineWidth = 0.75;
	context.beginPath();
	context.moveTo(startX + (width / 3), startY);
	context.lineTo(startX + (width / 3), currY);
	context.moveTo(startX + (width * 2 / 3), startY);
	context.lineTo(startX + (width * 2 / 3), currY);
	context.moveTo(startX, startY + (height / 3));
	context.lineTo(currX, startY + (height / 3));
	context.moveTo(startX, startY + (height * 2 / 3));
	context.lineTo(currX, startY + (height * 2 / 3));
	context.stroke();
}

function drawFilters() {
	var startX = selection.x,
		startY = selection.y,
		width  = selection.width,
		height = selection.height;
	
	context.save();

	// context.filter = 'contrast(1.4) sepia(1) drop-shadow(9px 9px 2px #e81)'; // compatibility problems

	// context.globalCompositeOperation = 'luminosity';
	// context.fillStyle = 'hsl(0, ' + brightness + '%, 100%)';

	context.globalCompositeOperation = 'saturation';
	context.globalAlpha = Math.abs(saturation - (100 - saturation)) / 100;
	context.fillStyle = 'hsl(0, ' + saturation + '%, 50%)';

	// draw filter layer
	context.fillRect(startX, startY, width, height);
	
	context.globalCompositeOperation = 'source-over';

	context.restore();
}
