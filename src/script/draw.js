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

		case 'filters':
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
	context.fillStyle = '#262626'; // background color
	context.fillRect(0, 0, canvas.width, canvas.height); // draw background
	context.save();

	// rotate context around the center
	context.translate(canvas.width / 2, canvas.height / 2);
	context.rotate(angleInDegrees * Math.PI / 180);
	context.translate(-canvas.width / 2, -canvas.height / 2);
	if (currTool == 'zoom') {
		context.drawImage(image,
			(canvas.width - (scaledWidth * zoom)) / 2, (canvas.height - (scaledHeight * zoom)) / 2,
			scaledWidth * zoom, scaledHeight * zoom);
	} else {
		context.drawImage(image,
			(canvas.width - scaledWidth) / 2, (canvas.height - scaledHeight) / 2,
			scaledWidth, scaledHeight);
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
 * Draws the filters on the selection over the image
 */
function drawFilters() {
	var startX = selection.x,
		startY = selection.y,
		width  = selection.width,
		height = selection.height;
	
	if (width == 0 || height == 0)
		return;
	
	context.save();

	// selection border
	context.strokeStyle = '#FFFFFF';
	context.lineWidth = 1;
	context.strokeRect(startX, startY, width, height);

	drawBrightnessFilter(context, startX, startY, width, height);
	drawSaturationFilter(context, startX, startY, width, height);

	context.restore();

	// contrast
	// var adjust = contrast / 100 + 1;
	// var imgData = context.getImageData(startX, startY, width, height);
	// var original = context.getImageData(marginX, marginY, scaledWidth, scaledHeight);

	// var pxData = imgData.data;
	// for (var x = 0; x < pxData.length; x += 4) {
	// 	var r = pxData[x],
	// 		g = pxData[x + 1],
	// 		b = pxData[x + 2],
	// 		newR = r,
	// 		newG = g,
	// 		newB = b;
		
	// 	newR /= 255;
	// 	newR -= 0.5;
	// 	newR *= adjust;
	// 	newR += 0.5;
	// 	newR *= 255;
		
	// 	newG /= 255;
	// 	newG -= 0.5;
	// 	newG *= adjust;
	// 	newG += 0.5;
	// 	newG *= 255;
		
	// 	newB /= 255;
	// 	newB -= 0.5;
	// 	newB *= adjust;
	// 	newB += 0.5;
	// 	newB *= 255;

	// 	pxData[x] = newR;
	// 	pxData[x + 1] = newG;
	// 	pxData[x + 2] = newB;
	// }
	// context.putImageData(original, marginX, marginY);
	// context.putImageData(imgData, Math.min(startX, startX + width), Math.min(startY, startY + height));

	// sepia
	var imgData = context.getImageData(startX, startY, width, height);
	var original = context.getImageData(marginX, marginY, scaledWidth, scaledHeight);

	var pxData = imgData.data;
	for (var x = 0; x < pxData.length; x += 4) {
		var r = pxData[x],
			g = pxData[x + 1],
			b = pxData[x + 2],
			sepiaR = r * .393 + g * .769 + b * .189,
			sepiaG = r * .349 + g * .686 + b * .168,
			sepiaB = r * .272 + g * .534 + b * .131;
		pxData[x] = sepiaR;
		pxData[x + 1] = sepiaG;
		pxData[x + 2] = sepiaB;
	}
	context.putImageData(original, marginX, marginY);
	context.putImageData(imgData, Math.min(startX, startX + width), Math.min(startY, startY + height));
}

/**
 * TODO
 */
function drawBrightnessFilter(context, startX, startY, width, height) {
	if (brightness < 0) {
		context.globalCompositeOperation = 'multiply';
		context.fillStyle = 'black';
		context.globalAlpha = -brightness / 100;
		context.fillRect(startX, startY, width, height);

	} else if (brightness > 0) {
		context.fillStyle = 'white';
		context.globalCompositeOperation = 'lighten';
		context.globalAlpha = 1;
		context.globalAlpha = brightness / 100;
		context.fillRect(startX, startY, width, height);
	}
}

/**
 * TODO
 */
function drawSaturationFilter(context, startX, startY, width, height) {
	context.globalCompositeOperation = 'saturation';
	context.globalAlpha = Math.abs(saturation - (100 - saturation)) / 100;
	context.fillStyle = 'hsl(0, ' + saturation + '%, 50%)';
	context.fillRect(startX, startY, width, height);
}
