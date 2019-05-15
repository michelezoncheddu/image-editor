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
	var startX = selection.startX,
		startY = selection.startY,
		endX   = selection.endX,
		endY   = selection.endY;
	
	// external dark filler
	context.globalAlpha = 0.75;
	if (endY < startY) {
		context.fillRect(0, 0, canvas.width, endY);
		context.fillRect(0, startY, canvas.width, canvas.height - endY);
	} else {
		context.fillRect(0, 0, canvas.width, startY);
		context.fillRect(0, endY, canvas.width, canvas.height - endY);
	}
	if (endX < startX) {
		context.fillRect(0, endY, endX, startY - endY);
		context.fillRect(startX, startY, canvas.width - startX, endY - startY);
	} else {
		context.fillRect(0, endY, startX, startY - endY);
		context.fillRect(endX, endY, canvas.width - startX, startY - endY);
	}
	context.globalAlpha = 1;

	// border
	context.strokeStyle = '#FFFFFF';
	context.lineWidth = 1;
	context.strokeRect(startX, startY, endX - startX, endY - startY);

	// lines
	context.lineWidth = 0.75;
	context.beginPath();
	context.moveTo(startX + ((endX - startX) / 3), startY);
	context.lineTo(startX + ((endX - startX) / 3), endY);
	context.moveTo(startX + ((endX - startX) * 2 / 3), startY);
	context.lineTo(startX + ((endX - startX) * 2 / 3), endY);
	context.moveTo(startX, startY + ((endY - startY) / 3));
	context.lineTo(endX, startY + ((endY - startY) / 3));
	context.moveTo(startX, startY + ((endY - startY) * 2 / 3));
	context.lineTo(endX, startY + ((endY - startY) * 2 / 3));
	context.stroke();
}

function drawFilters() {
	var startX = selection.startX,
		startY = selection.startY,
		endX   = selection.endX,
		endY   = selection.endY;
	
	context.save();

	// context.filter = 'contrast(1.4) sepia(1) drop-shadow(9px 9px 2px #e81)'; // compatibility problems

	// context.globalCompositeOperation = 'luminosity';
	// context.fillStyle = 'hsl(0, ' + brightness + '%, 100%)';

	context.globalCompositeOperation = 'saturation';
	context.globalAlpha = Math.abs(saturation - (100 - saturation)) / 100;
	context.fillStyle = 'hsl(0, ' + saturation + '%, 50%)';

	// draw filter layer
	context.fillRect(startX, startY, endX - startX, endY - startY);
	
	context.globalCompositeOperation = 'source-over';

	context.restore();
}
