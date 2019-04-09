"use strict";

$(function() {
	var canvas = document.getElementById("editor");
	canvas.height = window.innerHeight * 0.8;
	canvas.width = window.innerWidth * 0.8;
	$("#main").css("width", canvas.width);
	var context = canvas.getContext("2d");
	context.imageSmoothingQuality = "High";
	context.mozImageSmoothingEnabled = false;
	context.webkitImageSmoothingEnabled = false;
	context.msImageSmoothingEnabled = false;
	context.imageSmoothingEnabled = false;

	var angleInDegrees = 0;

	var mouseClicked = false, mouseReleased = true;
	document.addEventListener("click", onMouseClick, false);
	document.addEventListener("mousemove", onMouseMove, false);

	function onMouseClick(e) {
		mouseClicked = !mouseClicked;
	}

	function onMouseMove(e) {
		if (mouseClicked) {
			context.beginPath();
			console.log(e.clientX + " - " + e.clientY);
			context.arc(e.clientX, e.clientY, 7.5, 0, Math.PI * 2, false);
			context.lineWidth = 5;
			context.strokeStyle = "#fff";
			context.stroke();
		}
	}

	var image = new Image();
	image.onload = function() {
		drawImage(canvas, image);
	}
	image.src = "img/test_2.jpg";

	$("#clockwise").click(function() {
		angleInDegrees++;
		drawRotated(canvas, image, angleInDegrees);
	});
	
	$("#counterclockwise").click(function() {
		angleInDegrees--;
		drawRotated(canvas, image, angleInDegrees);
	});	
});
