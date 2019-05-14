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
	// external dark filler
	context.globalAlpha = 0.75;
	if (currPos.y < selection.startY) {
		context.fillRect(0, 0, canvas.width, currPos.y);
		context.fillRect(0, selection.startY, canvas.width, canvas.height - currPos.y);
	} else {
		context.fillRect(0, 0, canvas.width, selection.startY);
		context.fillRect(0, currPos.y, canvas.width, canvas.height - currPos.y);
	}
	if (currPos.x < selection.startX) {
		context.fillRect(0, currPos.y, currPos.x, selection.startY - currPos.y);
		context.fillRect(selection.startX, selection.startY, canvas.width - selection.startX, currPos.y - selection.startY);
	} else {
		context.fillRect(0, currPos.y, selection.startX, selection.startY - currPos.y);
		context.fillRect(currPos.x, currPos.y, canvas.width - selection.startX, selection.startY - currPos.y);
	}
	context.globalAlpha = 1;

	// border
	context.strokeStyle = '#FFFFFF';
	context.lineWidth = 1;
	context.strokeRect(selection.startX, selection.startY, currPos.x - selection.startX, currPos.y - selection.startY);

	// lines
	context.lineWidth = 0.75;
	context.beginPath();
	context.moveTo(selection.startX + ((currPos.x - selection.startX) / 3), selection.startY);
	context.lineTo(selection.startX + ((currPos.x - selection.startX) / 3), currPos.y);
	context.moveTo(selection.startX + ((currPos.x - selection.startX) * 2 / 3), selection.startY);
	context.lineTo(selection.startX + ((currPos.x - selection.startX) * 2 / 3), currPos.y);
	context.moveTo(selection.startX, selection.startY + ((currPos.y - selection.startY) / 3));
	context.lineTo(currPos.x, selection.startY + ((currPos.y - selection.startY) / 3));
	context.moveTo(selection.startX, selection.startY + ((currPos.y - selection.startY) * 2 / 3));
	context.lineTo(currPos.x, selection.startY + ((currPos.y - selection.startY) * 2 / 3));
	context.stroke();
}

function drawFilters() {
	context.save();

	// context.filter = 'contrast(1.4) sepia(1) drop-shadow(9px 9px 2px #e81)'; // compatibility problems

	// context.globalCompositeOperation = 'luminosity';
	// context.fillStyle = 'hsl(0, ' + brightness + '%, 100%)';

	context.globalCompositeOperation = 'saturation';
	context.globalAlpha = Math.abs(saturation - (100 - saturation)) / 100;
	context.fillStyle = 'hsl(0, ' + saturation + '%, 50%)';

	// draw filter layer
	context.fillRect(selection.startX, selection.startY, currPos.x - selection.startX, currPos.y - selection.startY);
	
	context.globalCompositeOperation = 'source-over';

	context.restore();
}
