'use strict';

/**
 * Chooses what to draw according to the current tool
 */
function draw() {
	context.fillStyle = '#262626'; // background color
	context.fillRect(0, 0, canvas.width, canvas.height); // draw background
	switch (currTool) {
		case 'none':
		drawImage();
		break;

		case 'zoom':
		drawImageMoved();
		break;

		case 'crop':
		drawImage();
		if (selection != null)
			drawCrop();
		break;

		case 'rotate':
		drawImageRotated();
		break;

		case 'filters':
		drawImage();
		if (selection != null)
			drawFilters();
		break;

		default:
		currTool = 'none';
		alert(';)');
	}
}

/**
 * Draws the image (wow!)
 */
function drawImage() {
	context.drawImage(image,
		(canvas.width - scaledWidth) / 2,
		(canvas.height - scaledHeight) / 2,
		scaledWidth, scaledHeight
	);
}

/**
 * Draws the image rotated around the center
 */
function drawImageRotated() {
	context.save();

	// rotate context around the center
	context.translate(canvas.width / 2, canvas.height / 2);
	context.rotate(angleInDegrees * Math.PI / 180);
	context.translate(-canvas.width / 2, -canvas.height / 2);

	drawImage();

	context.restore();
}

/**
 * Draws the image moved and zoomed inside the canvas
 */
function drawImageMoved() {
	context.save();

	context.translate(canvas.width / 2, canvas.height / 2);
	context.scale(zoom, zoom);
	context.drawImage(image,
		deltaStart.x - (scaledWidth / 2),
		deltaStart.y - (scaledHeight / 2),
		scaledWidth,
		scaledHeight
	);

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

	drawContrastFilter(context, startX, startY, width, height);
	drawExposureFilter(context, startX, startY, width, height);
	drawSepiaFilter(context, startX, startY, width, height);
}

/**
 * Draws the brightness filter in the specified rectangle
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
 * Draws the saturation filter in the specified rectangle
 */
function drawSaturationFilter(context, startX, startY, width, height) {
	var adjust = saturation > 0 ? (parseInt(saturation) + 50) : 0;
	context.globalCompositeOperation = 'saturation';
	context.globalAlpha = Math.abs(saturation) / 100;
	context.fillStyle = 'hsl(0, ' + adjust + '%, 50%)';
	context.fillRect(startX, startY, width, height);
}

/**
 * Draws the contrast filter in the specified rectangle
 */
function drawContrastFilter(context, startX, startY, width, height) {
	var adjust = contrast / 100 + 1; // + 1 because the slider starts at 0
	var imgData = context.getImageData(startX, startY, width, height);
	var original = context.getImageData(marginX, marginY, scaledWidth, scaledHeight);

	var pxData = imgData.data;
	for (var x = 0; x < pxData.length; x += 4) {
		var r = pxData[x],
			g = pxData[x + 1],
			b = pxData[x + 2],
			newR = r,
			newG = g,
			newB = b;
		
		newR /= 255;
		newR -= 0.5;
		newR *= adjust;
		newR += 0.5;
		newR *= 255;
		
		newG /= 255;
		newG -= 0.5;
		newG *= adjust;
		newG += 0.5;
		newG *= 255;
		
		newB /= 255;
		newB -= 0.5;
		newB *= adjust;
		newB += 0.5;
		newB *= 255;

		pxData[x] = newR;
		pxData[x + 1] = newG;
		pxData[x + 2] = newB;
	}
	context.putImageData(original, marginX, marginY);
	context.putImageData(imgData, Math.min(startX, startX + width), Math.min(startY, startY + height));
}

/**
 * Draws the exposure filter in the specified rectangle
 */
function drawExposureFilter(context, startX, startY, width, height) {
	var adjust = exposure / 100 + 1; // + 1 because the slider starts at 0
	var imgData = context.getImageData(startX, startY, width, height);
	var original = context.getImageData(marginX, marginY, scaledWidth, scaledHeight);

	var pxData = imgData.data;
	for (var x = 0; x < pxData.length; x += 4) {
		var r = pxData[x],
			g = pxData[x + 1],
			b = pxData[x + 2],
			newR = r,
			newG = g,
			newB = b;
		
		newR *= adjust;
		newG *= adjust;
		newB *= adjust;

		pxData[x] = newR;
		pxData[x + 1] = newG;
		pxData[x + 2] = newB;
	}
	context.putImageData(original, marginX, marginY);
	context.putImageData(imgData, Math.min(startX, startX + width), Math.min(startY, startY + height));
}

/**
 * Draws the sepia filter in the specified rectangle
 */
function drawSepiaFilter(context, startX, startY, width, height) {
	var imgData = context.getImageData(startX, startY, width, height);
	var original = context.getImageData(marginX, marginY, scaledWidth, scaledHeight);

	var pxData = imgData.data;
	for (var x = 0; x < pxData.length; x += 4) {
		var r = pxData[x],
			g = pxData[x + 1],
			b = pxData[x + 2],
			sepiaR = r * (1 - (.607 * sepia)) + g * (.769 * sepia) + b * (.189 * sepia),
			sepiaG = r * (.349 * sepia) + g * (1 - (.314 * sepia)) + b * (.168 * sepia),
			sepiaB = r * (.272 * sepia) + g * (.534 * sepia) + b * (1 - (.869 * sepia));

		pxData[x] = sepiaR;
		pxData[x + 1] = sepiaG;
		pxData[x + 2] = sepiaB;
	}
	context.putImageData(original, marginX, marginY);
	context.putImageData(imgData, Math.min(startX, startX + width), Math.min(startY, startY + height));
}
