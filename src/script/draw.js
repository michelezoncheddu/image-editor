'use strict';

function draw() {
	switch (currTool) {
		case "none":
		drawImage();
		break;

		case "crop":
		if (mouseDown) {
			drawImage();
	
			// filler
			context.globalAlpha = 0.75;
			if (currPos.y < clickPos.y) {
				context.fillRect(0, 0, canvas.width, currPos.y);
				context.fillRect(0, clickPos.y, canvas.width, canvas.height - currPos.y);
			} else {
				context.fillRect(0, 0, canvas.width, clickPos.y);
				context.fillRect(0, currPos.y, canvas.width, canvas.height - currPos.y);
			}
			if (currPos.x < clickPos.x) {
				context.fillRect(0, currPos.y, currPos.x, clickPos.y - currPos.y);
				context.fillRect(clickPos.x, clickPos.y, canvas.width - clickPos.x, currPos.y - clickPos.y);
			} else {
				context.fillRect(0, currPos.y, clickPos.x, clickPos.y - currPos.y);
				context.fillRect(currPos.x, currPos.y, canvas.width - clickPos.x, clickPos.y - currPos.y);
			}
			context.globalAlpha = 1;
	
			// border
			context.strokeStyle = '#FFFFFF';
			context.lineWidth = 1;
			context.strokeRect(clickPos.x, clickPos.y, currPos.x - clickPos.x, currPos.y - clickPos.y);
	
			// lines
			context.lineWidth = 0.75;
			context.beginPath();
			context.moveTo(clickPos.x + ((currPos.x - clickPos.x) / 3), clickPos.y);
			context.lineTo(clickPos.x + ((currPos.x - clickPos.x) / 3), currPos.y);
			context.moveTo(clickPos.x + ((currPos.x - clickPos.x) * 2 / 3), clickPos.y);
			context.lineTo(clickPos.x + ((currPos.x - clickPos.x) * 2 / 3), currPos.y);
			context.moveTo(clickPos.x, clickPos.y + ((currPos.y - clickPos.y) / 3));
			context.lineTo(currPos.x, clickPos.y + ((currPos.y - clickPos.y) / 3));
			context.moveTo(clickPos.x, clickPos.y + ((currPos.y - clickPos.y) * 2 / 3));
			context.lineTo(currPos.x, clickPos.y + ((currPos.y - clickPos.y) * 2 / 3));
			context.stroke();
		} else {
			if (releasePos.x == clickPos.x && releasePos.y == clickPos.y) // click without drag
				drawImage();
		}
		break;

		case "rotate":
		drawImage();
		break;

		default:
		alert('Unknown tool: ' + currTool);
	}
}

function drawImage() {
	var context = canvas.getContext('2d');
	context.fillRect(0, 0, canvas.width, canvas.height); // draw backgruound
	context.save();

	if (angleInDegrees != 0) {
		context.translate(canvas.width / 2, canvas.height / 2); // rotate on center
		context.rotate(angleInDegrees * Math.PI / 180);
		context.translate(-canvas.width / 2, -canvas.height / 2);
	}
	
	// draw
	var ratio = image.width / image.height;
	var width = canvas.width;
	var height = width / ratio;
	if (height > canvas.height) {
		height = canvas.height;
		width = height * ratio;
	}
	context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);

	context.restore();
}
