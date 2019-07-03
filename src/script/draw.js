'use strict';

function draw() {
	switch (currTool) {
		case 'none':
		case 'zoom':
		case 'rotate':
		drawImage();
		break;

		case 'crop':
		drawImage();
		if (selection != null)
			drawCrop();
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
	context.translate(canvas.width / 2, canvas.height / 2);
	context.rotate(angleInDegrees * Math.PI / 180);
	context.translate(-canvas.width / 2, -canvas.height / 2);
	if (currTool == 'zoom') {
		context.drawImage(image,
			(canvas.width - scaledWidth * zoom) / 2, (canvas.height - scaledHeight * zoom) / 2,
			scaledWidth * zoom, scaledHeight * zoom);
	} else {
		context.drawImage(image,
			(canvas.width - scaledWidth) / 2, (canvas.height - scaledHeight) / 2,
			scaledWidth, scaledHeight);
	}

	context.restore();
}

function drawCrop() {
	var startX = selection.x,
		startY = selection.y,
		endX   = selection.x + selection.width,
		endY   = selection.y + selection.height,
		width  = selection.width,
		height = selection.height;
	
	// external dark filler
	context.globalAlpha = 0.75;
	context.fillRect(0, 0, canvas.width, Math.min(startY, endY)); // top wide
	context.fillRect(0, Math.max(startY, endY), canvas.width, canvas.height); // bottom wide
	context.fillRect(0, endY, Math.min(startX, endX), startY - endY); // left narrow
	context.fillRect(Math.max(startX, endX), Math.min(startY, endY), canvas.width, Math.abs(startY - endY)); // right narrow
	context.globalAlpha = 1;

	// border
	context.strokeStyle = '#FFFFFF';
	context.lineWidth = 1;
	context.strokeRect(startX, startY, width, height);

	// lines
	context.lineWidth = 0.75;
	context.beginPath();
	context.moveTo(startX + (width / 3), startY);
	context.lineTo(startX + (width / 3), endY);
	context.moveTo(startX + (width * 2 / 3), startY);
	context.lineTo(startX + (width * 2 / 3), endY);
	context.moveTo(startX, startY + (height / 3));
	context.lineTo(endX, startY + (height / 3));
	context.moveTo(startX, startY + (height * 2 / 3));
	context.lineTo(endX, startY + (height * 2 / 3));
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

	context.restore();
}
