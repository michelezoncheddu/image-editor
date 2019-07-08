'use strict';

/**
 * Chooses what to draw according to the current tool
 */
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

		default:
		alert('Unknown tool: ' + currTool);
	}
}

/**
 * Draws the image (wow!)
 */
function drawImage() {
	context.fillRect(0, 0, canvas.width, canvas.height); // draw background
	context.save();

	// rotate context around the center
	context.translate(canvas.width / 2, canvas.height / 2);
	context.rotate(angleInDegrees * Math.PI / 180);
	context.translate(-canvas.width / 2, -canvas.height / 2);
	if (currTool == 'zoom') { // TODO: dedicate function to zoomed image
		context.drawImage(image,
			(canvas.width - scaledWidth * zoom) / 2, (canvas.height - scaledHeight * zoom) / 2,
			scaledWidth * zoom, scaledHeight * zoom);
	} else {
		context.drawImage(image, marginX, marginY, scaledWidth, scaledHeight);
	}

	context.restore();
}

/**
 * Draws the crop selection
 */
function drawCrop() {
	var startX = selection.x,
		startY = selection.y,
		endX   = selection.x + selection.width,
		endY   = selection.y + selection.height,
		width  = selection.width,
		height = selection.height;
	
	// external opaque filler
	context.globalAlpha = 0.75;
	context.fillRect(0, 0, canvas.width, Math.min(startY, endY)); // top wide
	context.fillRect(0, Math.max(startY, endY), canvas.width, canvas.height); // bottom wide
	context.fillRect(0, endY, Math.min(startX, endX), startY - endY); // left narrow
	context.fillRect(Math.max(startX, endX), Math.min(startY, endY), canvas.width, Math.abs(startY - endY)); // right narrow
	context.globalAlpha = 1;

	// selection border
	context.strokeStyle = '#FFFFFF';
	context.lineWidth = 1;
	context.strokeRect(startX, startY, width, height);

	// rule of thirds
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

/**
 * Draws the filter levels on the image
 */
function drawFilters() {
	var startX = selection.x,
		startY = selection.y,
		width  = selection.width,
		height = selection.height;
	
	context.save();

	// selection border
	context.strokeStyle = '#FFFFFF';
	context.lineWidth = 1;
	context.strokeRect(startX, startY, width, height);

	// context.filter = 'contrast(1.4) sepia(1) drop-shadow(9px 9px 2px #e81)'; // compatibility problems

	if (brightness < 0) {
		context.globalCompositeOperation = "multiply";
		context.fillStyle = "black";
		context.globalAlpha = -brightness / 100;
		context.fillRect(startX, startY, width, height);

	} else if (brightness > 0) {
		context.fillStyle = "white";
		context.globalCompositeOperation = "lighten";
		context.globalAlpha = 1;
		context.globalAlpha = brightness / 100;
		context.fillRect(startX, startY, width, height);
	}

	// saturarion
	context.globalCompositeOperation = 'saturation';
	context.globalAlpha = Math.abs(saturation - (100 - saturation)) / 100;
	context.fillStyle = 'hsl(0, ' + saturation + '%, 50%)';

	// draw filter layer
	context.fillRect(startX, startY, width, height);

	// sepia filter
	// var imgData = context.getImageData(startX, startY, width, height), // get image from unmodified context!
	// pxData = imgData.data,
	// length = pxData.length;
	// for (var x = 0; x < length; x += 4) {
	// 	// convert to grayscale
	// 	var r = pxData[x],
	// 		g = pxData[x + 1],
	// 		b = pxData[x + 2],
	// 		sepiaR = r * .393 + g * .769 + b * .189,
	// 		sepiaG = r * .349 + g * .686 + b * .168,
	// 		sepiaB = r * .272 + g * .534 + b * .131;
	// 	pxData[x] = sepiaR;
	// 	pxData[x + 1] = sepiaG;
	// 	pxData[x + 2] = sepiaB;
	// }
	// context.putImageData(imgData, startX, startY);

	context.restore();
}
