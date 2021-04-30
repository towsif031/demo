/* --- service worker --- */
/* check if service worker supported */
if ('serviceWorker' in navigator) {
	addEventListener('load', () => {
		navigator.serviceWorker
			.register('../../sw.js')
			.then((reg) => console.log('Service Worker: Registered'))
			.catch((err) => console.log(`Service Worker: Error: ${err}`));
	});
}
/* --- -------------- --- */

const video = document.getElementById('video');
let videoStarted = false;

const initVideoFrame = document.querySelector('.init-video-frame');

const outputCanvas = document.getElementById('output-canvas');
const outputVideoWrapper = document.getElementById('outputVideoWrapper');

const processStartBtn = document.querySelector('.start-processing-btn');
const functionalSectionWrapper = document.querySelector(
	'.functional-section-wrapper'
);
const solveBtnSectionWrapper = document.querySelector(
	'.solve-btn-section-wrapper'
);
const resultsSection = document.querySelector('.results-section');

let canvasWidth;
let canvasHeight;

let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;
let deviceLayout = null;
if (viewportWidth > 768) {
	deviceLayout = 'desktop';
	canvasWidth = 504;
	canvasHeight = 378;
} else if (viewportWidth > 425) {
	deviceLayout = 'tablet';
	canvasWidth = 504; /* same as desktop */
	canvasHeight = 378; /* same as desktop */
} else if (viewportWidth > 375) {
	deviceLayout = 'mobile-L';
	canvasWidth = 396;
	canvasHeight = 528;
} else if (viewportWidth > 320) {
	deviceLayout = 'mobile-M';
	canvasWidth = 366;
	canvasHeight = 488;
} else {
	deviceLayout = 'mobile-S';
	canvasWidth = 310;
	canvasHeight = 414;
}
// alert(deviceLayout);

let processStarted = false;
let createOutputCubeFacesView = true;
let isReDetecting = false;
let faceNumberToReDetect = null;

let showAlert = '';

let mainCanvas;
let mainCanvas_ctx;
let tempCanvas;
let tempCanvas_ctx;

/* initialized colors */
const whiteColor = [255, 255, 255, 255];
const orangeColor = [255, 140, 0, 255];
const blueColor = [0, 0, 255, 255];
const redColor = [255, 0, 0, 255];
const greenColor = [0, 255, 0, 255];
const yellowColor = [255, 255, 0, 255];
const blackColor = [0, 0, 0, 255];

let canvasCenterPoint = {
	x: Math.round(canvasWidth / 2),
	y: Math.round(canvasHeight / 2)
};

let distInPixels = 74;
let centerRadius = 20;
let centerRadiusForDisplay = 24;

if (viewportWidth > 768) {
	distInPixels = 64;
	centerRadius = 16;
	centerRadiusForDisplay = 20;
}

/* get cubelet centers by calculating distances from the center */
const point_00 = {
	x: canvasCenterPoint.x - distInPixels,
	y: canvasCenterPoint.y - distInPixels
};
const point_01 = {
	x: canvasCenterPoint.x,
	y: canvasCenterPoint.y - distInPixels
};
const point_02 = {
	x: canvasCenterPoint.x + distInPixels,
	y: canvasCenterPoint.y - distInPixels
};

const point_10 = {
	x: canvasCenterPoint.x - distInPixels,
	y: canvasCenterPoint.y
};
const point_11 = { x: canvasCenterPoint.x, y: canvasCenterPoint.y };
const point_12 = {
	x: canvasCenterPoint.x + distInPixels,
	y: canvasCenterPoint.y
};

const point_20 = {
	x: canvasCenterPoint.x - distInPixels,
	y: canvasCenterPoint.y + distInPixels
};
const point_21 = {
	x: canvasCenterPoint.x,
	y: canvasCenterPoint.y + distInPixels
};
const point_22 = {
	x: canvasCenterPoint.x + distInPixels,
	y: canvasCenterPoint.y + distInPixels
};

const sideColorSequence = [
	whiteColor,
	orangeColor,
	blueColor,
	redColor,
	greenColor,
	yellowColor
];

const processStartBtnTxt = document.createElement('div');
processStartBtnTxt.setAttribute('class', 'start-processing-btn-text');
if (deviceLayout === 'desktop') {
	processStartBtnTxt.innerHTML = `Get the <span class='next-center-color-name'>WHITE</span> center Facing Forward`;
} else {
	processStartBtnTxt.innerHTML = `Get <span class='next-center-color-name'>WHITE</span> center`;
}

/* detected face counter */
let detectedCubeFacePatternCount = 0;

/* store previously detected face's patterns */
let previousCubeFacePatterns = [];

/* whole cube pattern detection completion flag */
let isDetectionCompleted = false;

/* ------- track color count ------- */
let colorsCountOfAllFaces = [];
for (let i = 0; i < 6; i++) {
	colorsCountOfAllFaces[i] = {
		colorsCountTotal: {},
		colorsCountOfThisFace: {}
	};
}
/* --------------------------------- */

/* ---------------------------------------------------------------------- */
/* -------------------- video utility functions start ------------------- */

/* request front camera */
let constraints = {
	video: { facingMode: { exact: 'user' } }
};

/* request rear camera on mobile device */
const constraintsForPhones = {
	video: { facingMode: { exact: 'environment' } }
};

if (window.innerWidth <= 768) {
	constraints = constraintsForPhones;
}

/* webcam start function */
function startWebcam() {
	// alert(`facingMode , ${constraints.video.facingMode.exact}`);

	if (navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices
			.getUserMedia(constraints)
			.then(function (stream) {
				video.srcObject = stream;

				processStartBtn.appendChild(processStartBtnTxt);
			})
			.catch(function (err) {
				alert('Camera is not responding.');
			});
	}
	video.autoplay = true;
}

/* set output canvas resolution */
video.onloadeddata = () => {
	/* start playing video on canvas */
	videoStarted = true;

	outputCanvas.setAttribute('width', canvasWidth);
	outputCanvas.setAttribute('height', canvasHeight);

	processVideo();

	/* make output canvas visible */
	outputVideoWrapper.style.display = 'flex';
	initVideoFrame.style.display = 'none';
};

function startProcess() {
	if (!videoStarted) {
		alert('Camera is off! Please turn on Camera.');
	} else {
		if (!processStarted && !isDetectionCompleted) {
			processStarted = true;
			// processStartBtn.style.display = 'none';
			functionalSectionWrapper.style.display = 'initial';
			/* display output cubeFaces */
			displayOutputCubeFaces();
			console.log('Process STARTED.');
		} else {
			console.log('Process is running.');
		}
	}
}

/* --------------------- video utility functions end -------------------- */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* ------------------ video processing functions start ------------------ */

/* process frame function */
function processFrame(src) {
	/* initializing a cubeFace pattern */
	let cubeFacePattern = [];
	for (let i = 0; i < 3; i++) {
		cubeFacePattern[i] = [];
	}
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			cubeFacePattern[i][j] = '_';
		}
	}

	/* display bounding box for positioning */
	drawCubeBoundingBoxesOnCanvas_forDisplay(
		src,
		detectedCubeFacePatternCount,
		greenColor,
		1
	);

	/* get pattern from bounding boxes */
	detectCubeFacePattern(src, cubeFacePattern);

	let currentCubeFaceNumber = null;
	if (isReDetecting) {
		currentCubeFaceNumber = faceNumberToReDetect;
	} else {
		currentCubeFaceNumber = detectedCubeFacePatternCount + 1;
	}

	/* if valid cubeFace then draw output and stop processing */
	if (isCubeFaceValid(cubeFacePattern, currentCubeFaceNumber)) {
		/* create a temp pattern to store for pattern checking */
		let tempPatternToStore = [];
		for (let i = 0; i < 3; i++) {
			tempPatternToStore[i] = [];
		}
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				tempPatternToStore[i][j] = cubeFacePattern[i][j];
			}
		}

		if (isReDetecting) {
			isReDetecting = false;
			/* replace the previous pattern of the position */
			let patternIndex = faceNumberToReDetect - 1;
			previousCubeFacePatterns.splice(
				patternIndex,
				1,
				tempPatternToStore
			);
		} else {
			detectedCubeFacePatternCount++;
			/* store in previousCubeFacePatterns array */
			previousCubeFacePatterns.push(tempPatternToStore);

			createReDetectBtn(currentCubeFaceNumber);
		}

		switch (currentCubeFaceNumber) {
			case 1:
				getFirstFace(cubeFacePattern);
				break;
			case 2:
				getSecondFace(cubeFacePattern);
				break;
			case 3:
				getThirdFace(cubeFacePattern);
				break;
			case 4:
				getForthFace(cubeFacePattern);
				break;
			case 5:
				getFifthFace(cubeFacePattern);
				break;
			case 6:
				getSixthFace(cubeFacePattern);
				isDetectionCompleted = true;
				break;
		}

		updateColorsCount(currentCubeFaceNumber, cubeFacePattern);
		colorOutputCubeFaces(currentCubeFaceNumber, cubeFacePattern);
		getCubeFromInput(inputCubePattern);
		colorVirtualCube(cube);
	} else if (showAlert.length > 0) {
		alert(showAlert);
	}

	processStarted = false;
	changeProcessStartBtn();

	/* clear cubeFacePattern array */
	cubeFacePattern = [];
}

/* process video frames */
function computeFrame() {
	/* draw a frame of the video on a temporary canvas */
	tempCanvas_ctx.drawImage(video, 0, 0, mainCanvas.width, mainCanvas.height);
	const frame = tempCanvas_ctx.getImageData(
		0,
		0,
		mainCanvas.width,
		mainCanvas.height
	);
	const src = cv.matFromImageData(frame);
	// let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8U);
	let dst = src.clone();

	if (processStarted) {
		/* process each frame */
		processFrame(src);
	} else {
		/* display bounding box for positioning */
		drawCubeBoundingBoxesOnCanvas_forDisplay(
			src,
			detectedCubeFacePatternCount,
			greenColor,
			1
		);
	}

	/* display output on output-canvas */
	cv.imshow('output-canvas', src);

	src.delete();
	dst.delete();

	setTimeout(computeFrame, 0);
}

/* process video on canvas */
function processVideo() {
	mainCanvas = document.getElementById('output-canvas');

	mainCanvas_ctx = mainCanvas.getContext('2d');

	/* temporary canvas */
	tempCanvas = document.createElement('canvas');
	tempCanvas.setAttribute('width', canvasWidth);
	tempCanvas.setAttribute('height', canvasHeight);
	tempCanvas_ctx = tempCanvas.getContext('2d');

	video.play();

	computeFrame();
}

/* ------------------- video processing functions end ------------------- */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* ------------------ canvas drawing functions starts ------------------- */

/* draw bounding square on canvas */
function drawBoundingSquareOnCanvas(
	srcImg,
	point,
	radius,
	color,
	rectThickness,
	lineType = cv.LINE_8
) {
	cv.rectangle(
		srcImg,
		new cv.Point(point.x - radius, point.y - radius),
		new cv.Point(point.x + radius, point.y + radius),
		color,
		rectThickness,
		lineType
	);
}

/* draw cube bounding boxes on canvas in the middle for positioning */
function drawCubeBoundingBoxesOnCanvas_forDisplay(
	img,
	detectedCubeFacePatternCount,
	color,
	rectThickness
) {
	const s_radius = centerRadiusForDisplay / 4;

	/* draw a squared area for placing the cube */
	drawBoundingSquareOnCanvas(
		img,
		point_11,
		centerRadiusForDisplay * 5,
		color,
		rectThickness,
		cv.LINE_AA
	);

	let nextFaceColorToGet = null;
	switch (detectedCubeFacePatternCount) {
		case 0:
			nextFaceColorToGet = whiteColor;
			break;
		case 1:
			nextFaceColorToGet = orangeColor;
			break;
		case 2:
			nextFaceColorToGet = blueColor;
			break;
		case 3:
			nextFaceColorToGet = redColor;
			break;
		case 4:
			nextFaceColorToGet = greenColor;
			break;
		case 5:
		case 6:
			nextFaceColorToGet = yellowColor;
			break;
	}

	/* draw surrounding cubeFace colors */
	drawSideColorsOnCanvas(img, nextFaceColorToGet);

	/* -- first layer -- */
	/* position [00] */
	drawBoundingSquareOnCanvas(img, point_00, s_radius, color, rectThickness);
	/* position [01] */
	drawBoundingSquareOnCanvas(img, point_01, s_radius, color, rectThickness);
	/* position [02] */
	drawBoundingSquareOnCanvas(img, point_02, s_radius, color, rectThickness);

	/* -- second layer -- */
	/* position [10] */
	drawBoundingSquareOnCanvas(img, point_10, s_radius, color, rectThickness);
	/* ----- draw a large square with the next face's color ----- */
	/* position [11] */
	drawBoundingSquareOnCanvas(
		img,
		point_11,
		centerRadiusForDisplay,
		nextFaceColorToGet,
		10,
		cv.LINE_AA
	);
	/* -------------------------------------------------------- */
	/* position [12] */
	drawBoundingSquareOnCanvas(img, point_12, s_radius, color, rectThickness);

	/* -- third layer -- */
	/* position [20] */
	drawBoundingSquareOnCanvas(img, point_20, s_radius, color, rectThickness);
	/* position [21] */
	drawBoundingSquareOnCanvas(img, point_21, s_radius, color, rectThickness);
	/* position [22] */
	drawBoundingSquareOnCanvas(img, point_22, s_radius, color, rectThickness);
}

/* draw cube bounding boxes on canvas in the middle */
function drawCubeBoundingBoxesOnCanvas(img, color, rectThickness) {
	const s_radius = centerRadius / 4;
	/* -- first layer -- */
	/* position [00] */
	drawBoundingSquareOnCanvas(img, point_00, s_radius, color, rectThickness);
	/* position [01] */
	drawBoundingSquareOnCanvas(img, point_01, s_radius, color, rectThickness);
	/* position [02] */
	drawBoundingSquareOnCanvas(img, point_02, s_radius, color, rectThickness);

	/* -- second layer -- */
	/* position [10] */
	drawBoundingSquareOnCanvas(img, point_10, s_radius, color, rectThickness);
	// /* position [11] */
	// drawBoundingSquareOnCanvas(img, point_11, center_radius, color, rectThickness);
	/* position [12] */
	drawBoundingSquareOnCanvas(img, point_12, s_radius, color, rectThickness);

	/* -- third layer -- */
	/* position [20] */
	drawBoundingSquareOnCanvas(img, point_20, s_radius, color, rectThickness);
	/* position [21] */
	drawBoundingSquareOnCanvas(img, point_21, s_radius, color, rectThickness);
	/* position [22] */
	drawBoundingSquareOnCanvas(img, point_22, s_radius, color, rectThickness);
}

/* draw large side line on canvas */
function drawSideLineOnCanvas(img, point, color) {
	let x1,
		y1,
		x2,
		y2 = null;

	switch (point) {
		case point_01:
			x1 = -30;
			x2 = 30;
			y1 = -55;
			y2 = -55;
			break;
		case point_10:
			x1 = -55;
			x2 = -55;
			y1 = 30;
			y2 = -30;
			break;
		case point_12:
			x1 = 55;
			x2 = 55;
			y1 = -30;
			y2 = 30;
			break;
		case point_21:
			x1 = 30;
			x2 = -30;
			y1 = 55;
			y2 = 55;
			break;
	}

	cv.line(
		img,
		new cv.Point(point.x + x1, point.y + y1),
		new cv.Point(point.x + x2, point.y + y2),
		color,
		5,
		cv.LINE_AA
	);
}

/* draw surrounding cubeFace colors function */
function drawSideColorsOnCanvas(img, faceColor) {
	let topColor = null;
	let leftColor = null;
	let rightColor = null;
	let bottomColor = null;

	switch (faceColor) {
		case whiteColor:
			topColor = redColor;
			leftColor = blueColor;
			rightColor = greenColor;
			bottomColor = orangeColor;
			break;
		case orangeColor:
			topColor = whiteColor;
			leftColor = blueColor;
			rightColor = greenColor;
			bottomColor = yellowColor;
			break;
		case blueColor:
			topColor = whiteColor;
			leftColor = redColor;
			rightColor = orangeColor;
			bottomColor = yellowColor;
			break;
		case redColor:
			topColor = whiteColor;
			leftColor = greenColor;
			rightColor = blueColor;
			bottomColor = yellowColor;
			break;
		case greenColor:
			topColor = whiteColor;
			leftColor = orangeColor;
			rightColor = redColor;
			bottomColor = yellowColor;
			break;
		case yellowColor:
			topColor = greenColor;
			leftColor = orangeColor;
			rightColor = redColor;
			bottomColor = blueColor;
			break;
	}

	drawSideLineOnCanvas(img, point_01, topColor);
	drawSideLineOnCanvas(img, point_10, leftColor);
	drawSideLineOnCanvas(img, point_12, rightColor);
	drawSideLineOnCanvas(img, point_21, bottomColor);
}

/* ------------------ canvas drawing functions ends --------------------- */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* change process start button display */
function changeProcessStartBtn() {
	let nextCenterColor = null;

	if (!isDetectionCompleted) {
		switch (detectedCubeFacePatternCount) {
			case 0:
				nextCenterColor = 'WHITE';
				break;
			case 1:
				nextCenterColor = 'ORANGE';
				break;
			case 2:
				nextCenterColor = 'BLUE';
				break;
			case 3:
				nextCenterColor = 'RED';
				break;
			case 4:
				nextCenterColor = 'GREEN';
				break;
			case 5:
				nextCenterColor = 'YELLOW';
				break;
		}

		/* Get NEXT Pattern */
		const nextCenterColorName = document.querySelector(
			'.next-center-color-name'
		);
		nextCenterColorName.textContent = nextCenterColor;

		const nextSideColor = sideColorSequence[detectedCubeFacePatternCount];
		nextCenterColorName.style.color = `rgba(${nextSideColor[0]}, ${nextSideColor[1]}, ${nextSideColor[2]}, ${nextSideColor[3]})`;
		/* display process button */
		processStartBtn.style.display = 'initial';
	} else {
		solveBtnSectionWrapper.style.display = 'initial';
		console.log('PATTERN DETECTION COMPLETE!');
	}
}
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* ---------------------- utility functions start ----------------------- */

/* calculate distance between two points */
function getDistanceBetween(point1, point2) {
	return ((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2) ** 0.5;
}

/* function for re-detect the side if wrong color pattern detected */
function reDetectSide() {
	console.log('Re-Detecting the Side again.');
	isReDetecting = true;
	processStarted = true;
}

/* ----------------------- utility functions end ------------------------ */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* ------------------ display output cubeFaces starts ------------------- */

/* create output cubeFaces */
function createOutputCubeFaces() {
	const stepOutputDiv = document.querySelector('.input-pattern-view');

	for (let i = 1; i <= 6; i++) {
		const outputCubeFaceWrapper = document.createElement('div');
		outputCubeFaceWrapper.setAttribute(
			'class',
			`output-cubeFace-wrapper_${i}`
		);
		stepOutputDiv.appendChild(outputCubeFaceWrapper);

		const outputCubeFaceSpan = document.createElement('SPAN');
		outputCubeFaceWrapper.appendChild(outputCubeFaceSpan);

		const outputCubeFaceID = `output-cubeFace_${i}`;
		const outputCubeFaceDiv = document.createElement('div');
		outputCubeFaceDiv.setAttribute(
			'class',
			`output-cubeFace ${outputCubeFaceID}`
		);
		for (let m = 0; m < 3; m++) {
			for (let n = 0; n < 3; n++) {
				outputCubeFaceSpan.appendChild(outputCubeFaceDiv);
				const outputCubeletDiv = document.createElement('div');
				outputCubeletDiv.setAttribute(
					'class',
					`output-cubelet output-cubelet_id${m}${n}`
				);
				document
					.querySelector(`.${outputCubeFaceID}`)
					.appendChild(outputCubeletDiv);
			}
		}
	}
}

/* draw the output face pattern */
function displayOutputCubeFaces() {
	/* create at initial state */
	if (createOutputCubeFacesView) {
		createOutputCubeFacesView = false;
		createOutputCubeFaces();
	}
	for (let i = 1; i <= 6; i++) {
		const outputCubeFace = document.querySelector(`.output-cubeFace_${i}`);
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				const outputCubeletID = outputCubeFace.querySelector(
					`.output-cubelet_id${i}${j}`
				);

				/* color at initial state */
				if (detectedCubeFacePatternCount === 0) {
					outputCubeletID.style.background = 'rgb(100, 100, 100)';
				}
			}
		}
	}
}

/* create re-detect button function */
function createReDetectBtn(faceNum) {
	const currentOutputCubeFaceWrapper = document.querySelector(
		`.output-cubeFace-wrapper_${faceNum}`
	);

	/* create tooltip for adding re-detect click function */
	const spanForTooltip = document.createElement('SPAN');
	spanForTooltip.textContent = 'Re-DETECT';
	spanForTooltip.setAttribute('class', 'tooltip-text');
	currentOutputCubeFaceWrapper.appendChild(spanForTooltip);

	const currentOutputCubeFace = document.querySelector(
		`.output-cubeFace_${faceNum}`
	);
	currentOutputCubeFace.style.border = '1px solid rgb(45, 45, 45)';

	spanForTooltip.onmouseover = function () {
		currentOutputCubeFace.style.borderColor = 'rgb(85, 85, 85)';
	};
	spanForTooltip.onmouseleave = function () {
		currentOutputCubeFace.style.borderColor = 'rgb(45, 45, 45)';
	};

	/* add re-detect click function */
	spanForTooltip.style.cursor = 'pointer';
	spanForTooltip.onclick = function () {
		faceNumberToReDetect = faceNum;
		reDetectSide();
	};

	switch (faceNum) {
		case 1:
			spanForTooltip.style.color = 'rgb(255, 255, 255)';
			break;
		case 2:
			spanForTooltip.style.color = 'rgb(255, 122, 30)';
			break;
		case 3:
			spanForTooltip.style.color = 'rgb(85, 185, 255)';
			break;
		case 4:
			spanForTooltip.style.color = 'rgb(244, 64, 54)';
			break;
		case 5:
			spanForTooltip.style.color = 'rgb(100, 248, 108)';
			break;
		case 6:
			spanForTooltip.style.color = 'rgb(255, 245, 50)';
			break;
	}
}

/* color outputCubeFace according to detected cubeFacePattern */
function colorOutputCubeFaces(faceNum, cubeFacePattern) {
	const currentOutputCubeFaceDiv = document.querySelector(
		`.output-cubeFace_${faceNum}`
	);

	/* color current output cubelets */
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			const currentOutputCubeletID = currentOutputCubeFaceDiv.querySelector(
				`.output-cubelet_id${i}${j}`
			);

			const rgbColor = getColorCode(cubeFacePattern[i][j]);
			currentOutputCubeletID.style.background = `rgb(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]})`;
		}
	}
}

/* ------------------- display output cubeFaces ends -------------------- */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* ------------------ color detection functions start ------------------- */

/* convert rgb color to hsl */
function convertToHsl(rgbColorCode) {
	const r = Number(rgbColorCode.r) / 255;
	const g = Number(rgbColorCode.g) / 255;
	const b = Number(rgbColorCode.b) / 255;
	const maxColorValue = Math.max(r, g, b);
	const minColorValue = Math.min(r, g, b);
	let H = 0;
	let S = 0;
	let L = (maxColorValue + minColorValue) / 2;

	if (maxColorValue !== minColorValue) {
		if (L < 0.5) {
			S =
				(maxColorValue - minColorValue) /
				(maxColorValue + minColorValue);
		} else {
			S =
				(maxColorValue - minColorValue) /
				(2.0 - maxColorValue - minColorValue);
		}
		if (r === maxColorValue) {
			H = (g - b) / (maxColorValue - minColorValue);
		} else if (g === maxColorValue) {
			H = 2.0 + (b - r) / (maxColorValue - minColorValue);
		} else {
			H = 4.0 + (r - g) / (maxColorValue - minColorValue);
		}
	}

	H = H * 60;
	S = S * 100;
	L = L * 100;

	if (H < 0) {
		H += 360;
	}

	const hslColorCode = { h: H, s: S, l: L };

	return hslColorCode;
}

/* get the base color of the cubeletFace */
function getBaseColorName(hsl) {
	const h = Math.floor(hsl.h);
	const s = Math.floor(hsl.s);
	const l = Math.floor(hsl.l);

	const hslColorCode = `hsl(${h}, ${s}%, ${l}%)`;

	let color = null;

	/* log style for console display */
	const logStyle = `background: ${hslColorCode}; color: #fff`;

	/* --- white --- */
	if (
		l > 90 ||
		(s < 20 && l > 50) ||
		(s < 30 && l > 80) ||
		(s < 50 && l > 85) ||
		(h > 140 && h < 220 && s < 40 && l > 50)
	) {
		color = 'W';
		console.log(`%c    ${color}    ${hslColorCode}`, logStyle);
		return color;
	}

	/* --- blue --- */
	if (
		h > 190 &&
		h < 265 &&
		((s > 35 && l > 5 && l < 60) || (s > 50 && l > 5 && l < 65))
	) {
		color = 'B';
		console.log(`%c    ${color}    ${hslColorCode}`, logStyle);
		return color;
	}

	/* --- green --- */
	if (
		(h > 95 && h <= 125 && s > 50 && l > 5 && l < 65) ||
		(h > 125 && h < 190 && s > 40 && l > 5 && l < 50)
	) {
		color = 'G';
		console.log(`%c    ${color}    ${hslColorCode}`, logStyle);
		return color;
	}

	/* --- yellow --- */
	if (h > 45 && h < 85 && s > 35 && l > 25 && l < 80) {
		color = 'Y';
		console.log(`%c    ${color}    ${hslColorCode}`, logStyle);
		return color;
	}

	/* --- orange --- */
	if (
		(h > 12 && h < 40 && s >= 35 && l > 30 && l < 70) ||
		(h > 5 && h < 40 && s > 55 && l > 45 && l < 70) ||
		(h > 17 && h < 30 && s > 70 && l > 15 && l < 75) ||
		(h > 17 && h < 35 && s > 90 && l > 15 && l < 82)
	) {
		color = 'O';
		console.log(`%c    ${color}    ${hslColorCode}`, logStyle);
		return color;
	}

	/* --- red --- */
	if (
		(h >= 335 && s > 35 && l > 10 && l < 65) ||
		(h >= 335 && s > 25 && l > 30 && l < 50) ||
		(h <= 6 && s > 30 && l > 10 && l < 65) ||
		(h < 14 && s > 80 && l > 10 && l < 55)
	) {
		color = 'R';
		console.log(`%c    ${color}    ${hslColorCode}`, logStyle);
		return color;
	}

	/* --- default --- */
	color = 'unknown';
	console.log(`%c   unknown   ${hslColorCode}`, logStyle);

	return color;
}

/* get color code from color's name */
function getColorCode(colorName) {
	if (colorName === 'R') {
		return redColor;
	} else if (colorName === 'G') {
		return greenColor;
	} else if (colorName === 'B') {
		return blueColor;
	} else if (colorName === 'Y') {
		return yellowColor;
	} else if (colorName === 'O') {
		return orangeColor;
	} else if (colorName === 'W') {
		return whiteColor;
	} else {
		return blackColor;
	}
}

/* ------------------- color detection functions end -------------------- */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* --------------- cube pattern detection functions start --------------- */

/* detect square color */
function detectCubeFacePattern(src, cubeFacePattern) {
	let mask = src.clone();
	mask.setTo(blackColor);

	/* draw bounding boxes for masking */
	drawCubeBoundingBoxesOnCanvas(mask, whiteColor, -1);

	/* convert to grayscale */
	cv.cvtColor(mask, mask, cv.COLOR_RGBA2GRAY, 0);

	/* blurring src with gaussian blur */
	const kernelSize = new cv.Size(5, 5);
	cv.GaussianBlur(mask, mask, kernelSize, 0, 0, cv.BORDER_DEFAULT);

	cv.threshold(mask, mask, 80, 240, cv.THRESH_BINARY);

	/* find contours */
	let contours = new cv.MatVector();
	let hierarchy = new cv.Mat();

	cv.findContours(
		mask,
		contours,
		hierarchy,
		cv.RETR_EXTERNAL,
		cv.CHAIN_APPROX_SIMPLE
	);

	mask.delete();

	/* check every contour to detect shape */
	for (let i = 0; i < contours.size(); i++) {
		const cnt = contours.get(i);

		/* determine coordinates */
		const moment = cv.moments(cnt, false);

		const x =
			moment['m00'] === 0 ? 0 : Math.round(moment['m10'] / moment['m00']);
		const y =
			moment['m00'] === 0 ? 0 : Math.round(moment['m01'] / moment['m00']);
		const squareCenterPoint = { x: x, y: y };

		/* determine the cubelet's position */
		const cubeletPosition = getPointPosition(squareCenterPoint);

		/* assign cubelet's color in their appropriate position in the cubeFacePattern array */
		getColorFromMask(
			src,
			contours,
			i,
			cnt,
			cubeFacePattern,
			cubeletPosition
		);

		cnt.delete();
	}

	contours.delete();
	hierarchy.delete();
}

/* get color from the canvas under the squares */
function getColorFromMask(
	imgSrc,
	contours,
	cntIndex,
	cnt,
	cubeFacePattern,
	cubeletPosition
) {
	let srcClone = imgSrc.clone();
	let mask2 = cv.Mat.zeros(srcClone.rows, srcClone.cols, cv.CV_8U);
	srcClone.delete();

	/* draw current contour on the mask */
	cv.drawContours(mask2, contours, cntIndex, whiteColor, -1);

	/* get roi for color detection */
	const boundingAreaRect = cv.boundingRect(cnt);
	const imgSrcRoi = imgSrc.roi(boundingAreaRect);
	const mask2Roi = mask2.roi(boundingAreaRect);

	mask2.delete();

	/* get mean color of roi in src */
	const colorBelow = cv.mean(imgSrcRoi, mask2Roi);

	imgSrcRoi.delete();
	mask2Roi.delete();

	/* get rgb code */
	const rgbColorCode = {
		r: Math.round(colorBelow[0]),
		g: Math.round(colorBelow[1]),
		b: Math.round(colorBelow[2])
	};

	// const rgbValue = `rgb(${rgbColorCode.r}, ${rgbColorCode.g}, ${rgbColorCode.b})`;
	// console.log('rgb = > ', rgbValue);

	const currentSquareColor = getBaseColorName(convertToHsl(rgbColorCode));

	cubeFacePattern[cubeletPosition[0]][
		cubeletPosition[1]
	] = currentSquareColor;
}

/* get position from points on the canvas */
function getPointPosition(point) {
	const radius = centerRadius / 4;
	const upLeftSquare = {
		rowIndex: 0,
		colIndex: 0,
		points: [
			new cv.Point(point_00.x - radius, point_00.y - radius),
			new cv.Point(point_00.x + radius, point_00.y + radius)
		]
	};
	const upSquare = {
		rowIndex: 0,
		colIndex: 1,
		points: [
			new cv.Point(point_01.x - radius, point_01.y - radius),
			new cv.Point(point_01.x + radius, point_01.y + radius)
		]
	};
	const upRightSquare = {
		rowIndex: 0,
		colIndex: 2,
		points: [
			new cv.Point(point_02.x - radius, point_02.y - radius),
			new cv.Point(point_02.x + radius, point_02.y + radius)
		]
	};
	const leftSquare = {
		rowIndex: 1,
		colIndex: 0,
		points: [
			new cv.Point(point_10.x - radius, point_10.y - radius),
			new cv.Point(point_10.x + radius, point_10.y + radius)
		]
	};
	// const centerSquare = {
	// 	rowIndex: 1,
	// 	colIndex: 1,
	// 	points: [
	// 		new cv.Point(point_11.x - radius, point_11.y - radius),
	// 		new cv.Point(point_11.x + radius, point_11.y + radius)
	// 	]
	// };
	const rightSquare = {
		rowIndex: 1,
		colIndex: 2,
		points: [
			new cv.Point(point_12.x - radius, point_12.y - radius),
			new cv.Point(point_12.x + radius, point_12.y + radius)
		]
	};
	const downLeftSquare = {
		rowIndex: 2,
		colIndex: 0,
		points: [
			new cv.Point(point_20.x - radius, point_20.y - radius),
			new cv.Point(point_20.x + radius, point_20.y + radius)
		]
	};
	const downSquare = {
		rowIndex: 2,
		colIndex: 1,
		points: [
			new cv.Point(point_21.x - radius, point_21.y - radius),
			new cv.Point(point_21.x + radius, point_21.y + radius)
		]
	};
	const downRightSquare = {
		rowIndex: 2,
		colIndex: 2,
		points: [
			new cv.Point(point_22.x - radius, point_22.y - radius),
			new cv.Point(point_22.x + radius, point_22.y + radius)
		]
	};

	const squarePositions = [
		upLeftSquare,
		upSquare,
		upRightSquare,
		leftSquare,
		// centerSquare,
		rightSquare,
		downLeftSquare,
		downSquare,
		downRightSquare
	];

	let minDist = 10000;
	let pointPosition = null;
	squarePositions.forEach((p) => {
		const theCenterBetween = {
			x: (p.points[0].x + p.points[1].x) / 2,
			y: (p.points[0].y + p.points[1].y) / 2
		};

		const rad = getDistanceBetween(p.points[0], p.points[1]) / 2;
		const distBetween = getDistanceBetween(point, theCenterBetween);
		if (distBetween <= rad && distBetween < minDist) {
			minDist = distBetween;
			pointPosition = [p.rowIndex, p.colIndex];
		}
	});

	return pointPosition;
}

/* ---------------- cube pattern detection functions end ---------------- */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* ------------------ cube pattern processing starts -------------------- */

// 		[0]  [1]  [2]  [3]  [4]  [5]  [6]  [7]  [8]  [9]  [10] [11]
// [0] ["W", "W", "W", "_", "_", "_", "_", "_", "_", "_", "_", "_"]
// [1] ["W", "W", "W", "_", "_", "_", "_", "_", "_", "_", "_", "_"]
// [2] ["W", "W", "W", "_", "_", "_", "_", "_", "_", "_", "_", "_"]
// [3] ["B", "B", "B", "O", "O", "O", "G", "G", "G", "R", "R", "R"]
// [4] ["B", "B", "B", "O", "O", "O", "G", "G", "G", "R", "R", "R"]
// [5] ["B", "B", "B", "O", "O", "O", "G", "G", "G", "R", "R", "R"]
// [6] ["_", "_", "_", "_", "_", "_", "_", "_", "_", "Y", "Y", "Y"]
// [7] ["_", "_", "_", "_", "_", "_", "_", "_", "_", "Y", "Y", "Y"]
// [8] ["_", "_", "_", "_", "_", "_", "_", "_", "_", "Y", "Y", "Y"]

/* ------------------------------------------------------------------ */
/* ========================= solver pattern ========================= */

// 		[0]  [1]  [2]  [3]  [4]  [5]  [6]  [7]  [8]  [9]  [10] [11]
// [0] ["_", "_", "_", "W", "W", "W", "_", "_", "_", "_", "_", "_"]
// [1] ["_", "_", "_", "W", "W", "W", "_", "_", "_", "_", "_", "_"]
// [2] ["_", "_", "_", "W", "W", "W", "_", "_", "_", "_", "_", "_"]
// [3] ["O", "O", "O", "G", "G", "G", "R", "R", "R", "B", "B", "B"]
// [4] ["O", "O", "O", "G", "G", "G", "R", "R", "R", "B", "B", "B"]
// [5] ["O", "O", "O", "G", "G", "G", "R", "R", "R", "B", "B", "B"]
// [6] ["_", "_", "_", "Y", "Y", "Y", "_", "_", "_", "_", "_", "_"]
// [7] ["_", "_", "_", "Y", "Y", "Y", "_", "_", "_", "_", "_", "_"]
// [8] ["_", "_", "_", "Y", "Y", "Y", "_", "_", "_", "_", "_", "_"]

/* ------------------------------------------------------------------ */

let inputCubePattern = [];

for (let i = 0; i < 9; i++) {
	inputCubePattern[i] = [];
}

for (let i = 0; i < 9; i++) {
	for (let j = 0; j < 12; j++) {
		inputCubePattern[i][j] = '_';
	}
}

function getFirstFace(currentFacePattern) {
	/* white center */
	inputCubePattern[0][0] = currentFacePattern[0][0];
	inputCubePattern[0][1] = currentFacePattern[0][1];
	inputCubePattern[0][2] = currentFacePattern[0][2];
	inputCubePattern[1][0] = currentFacePattern[1][0];
	inputCubePattern[1][1] = currentFacePattern[1][1];
	inputCubePattern[1][2] = currentFacePattern[1][2];
	inputCubePattern[2][0] = currentFacePattern[2][0];
	inputCubePattern[2][1] = currentFacePattern[2][1];
	inputCubePattern[2][2] = currentFacePattern[2][2];
}

function getThirdFace(currentFacePattern) {
	/* orange center */
	inputCubePattern[3][3] = currentFacePattern[0][0];
	inputCubePattern[3][4] = currentFacePattern[0][1];
	inputCubePattern[3][5] = currentFacePattern[0][2];
	inputCubePattern[4][3] = currentFacePattern[1][0];
	inputCubePattern[4][4] = currentFacePattern[1][1];
	inputCubePattern[4][5] = currentFacePattern[1][2];
	inputCubePattern[5][3] = currentFacePattern[2][0];
	inputCubePattern[5][4] = currentFacePattern[2][1];
	inputCubePattern[5][5] = currentFacePattern[2][2];
}

function getSecondFace(currentFacePattern) {
	/* blue center */
	inputCubePattern[3][0] = currentFacePattern[0][0];
	inputCubePattern[3][1] = currentFacePattern[0][1];
	inputCubePattern[3][2] = currentFacePattern[0][2];
	inputCubePattern[4][0] = currentFacePattern[1][0];
	inputCubePattern[4][1] = currentFacePattern[1][1];
	inputCubePattern[4][2] = currentFacePattern[1][2];
	inputCubePattern[5][0] = currentFacePattern[2][0];
	inputCubePattern[5][1] = currentFacePattern[2][1];
	inputCubePattern[5][2] = currentFacePattern[2][2];
}

function getFifthFace(currentFacePattern) {
	/* red center */
	inputCubePattern[3][9] = currentFacePattern[0][0];
	inputCubePattern[3][10] = currentFacePattern[0][1];
	inputCubePattern[3][11] = currentFacePattern[0][2];
	inputCubePattern[4][9] = currentFacePattern[1][0];
	inputCubePattern[4][10] = currentFacePattern[1][1];
	inputCubePattern[4][11] = currentFacePattern[1][2];
	inputCubePattern[5][9] = currentFacePattern[2][0];
	inputCubePattern[5][10] = currentFacePattern[2][1];
	inputCubePattern[5][11] = currentFacePattern[2][2];
}

function getForthFace(currentFacePattern) {
	/* green center */
	inputCubePattern[3][6] = currentFacePattern[0][0];
	inputCubePattern[3][7] = currentFacePattern[0][1];
	inputCubePattern[3][8] = currentFacePattern[0][2];
	inputCubePattern[4][6] = currentFacePattern[1][0];
	inputCubePattern[4][7] = currentFacePattern[1][1];
	inputCubePattern[4][8] = currentFacePattern[1][2];
	inputCubePattern[5][6] = currentFacePattern[2][0];
	inputCubePattern[5][7] = currentFacePattern[2][1];
	inputCubePattern[5][8] = currentFacePattern[2][2];
}

function getSixthFace(currentFacePattern) {
	/* yellow center */
	inputCubePattern[6][9] = currentFacePattern[0][0];
	inputCubePattern[6][10] = currentFacePattern[0][1];
	inputCubePattern[6][11] = currentFacePattern[0][2];
	inputCubePattern[7][9] = currentFacePattern[1][0];
	inputCubePattern[7][10] = currentFacePattern[1][1];
	inputCubePattern[7][11] = currentFacePattern[1][2];
	inputCubePattern[8][9] = currentFacePattern[2][0];
	inputCubePattern[8][10] = currentFacePattern[2][1];
	inputCubePattern[8][11] = currentFacePattern[2][2];
}

/* ------------------- cube pattern processing ends --------------------- */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* ----------------- pattern validation functions start ----------------- */

/* get colors count from detected pattern */
function getColorsCount(pattern, colorsCountObj) {
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			switch (pattern[i][j]) {
				case 'W':
					colorsCountObj.white++;
					break;

				case 'O':
					colorsCountObj.orange++;
					break;

				case 'B':
					colorsCountObj.blue++;
					break;

				case 'R':
					colorsCountObj.red++;
					break;

				case 'G':
					colorsCountObj.green++;
					break;

				case 'Y':
					colorsCountObj.yellow++;
					break;
			}
		}
	}
}

/* check if detected colors count are valid based on previously detected patterns   */
function isColorsCountValid(colorsCountObj, faceNum) {
	let idx = faceNum - 1;
	/* for first face, there is no previous colors count total */
	let tempDetectedColorsCount = {
		white: 0,
		orange: 0,
		blue: 0,
		red: 0,
		green: 0,
		yellow: 0
	};

	if (idx > 0) {
		let prevIdx = idx - 1;
		/* get detected colors count until this faceNumber */
		tempDetectedColorsCount = {
			...colorsCountOfAllFaces[prevIdx].colorsCountTotal
		};
	}

	for (let c in tempDetectedColorsCount) {
		if (tempDetectedColorsCount[c] + colorsCountObj[c] > 9) {
			return false;
		}
	}

	return true;
}

/* update colors count objects */
function updateColorsCount(cubeFaceNum, pattern) {
	let colorsCountOfCurrentFace = {
		white: 0,
		orange: 0,
		blue: 0,
		red: 0,
		green: 0,
		yellow: 0
	};
	getColorsCount(pattern, colorsCountOfCurrentFace);

	let idx = cubeFaceNum - 1;
	/* for first face, there is no previous colors count total */
	let tempDetectedColorsCount = {
		white: 0,
		orange: 0,
		blue: 0,
		red: 0,
		green: 0,
		yellow: 0
	};

	if (idx > 0) {
		let prevIdx = idx - 1;
		/* get detected colors count till this faceNumber */
		tempDetectedColorsCount = {
			...colorsCountOfAllFaces[prevIdx].colorsCountTotal
		};
	}

	/* add new colors count with the total */
	for (let c in tempDetectedColorsCount) {
		tempDetectedColorsCount[c] += colorsCountOfCurrentFace[c];
	}

	colorsCountOfAllFaces[idx].colorsCountTotal = {
		...tempDetectedColorsCount
	};

	colorsCountOfAllFaces[idx].colorsCountOfThisFace = {
		...colorsCountOfCurrentFace
	};
}

/* pattern matching function */
function matchPatterns(p1, p2) {
	let isEqual = true;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (p1[i][j] !== p2[i][j]) {
				isEqual = false;
				break;
			}
		}
		if (!isEqual) {
			break;
		}
	}

	return isEqual;
}

/* verify cubeFacePattern's validity */
function isCubeFaceValid(pattern, faceNumber) {
	/* ------- get center color ------- */
	let currentCenterColor = null;
	switch (faceNumber) {
		case 1:
			currentCenterColor = 'W';
			break;
		case 2:
			currentCenterColor = 'O';
			break;
		case 3:
			currentCenterColor = 'B';
			break;
		case 4:
			currentCenterColor = 'R';
			break;
		case 5:
			currentCenterColor = 'G';
			break;
		case 6:
			currentCenterColor = 'Y';
			break;
	}
	pattern[1][1] = currentCenterColor;
	/* -------------------------------- */

	let isPatternValid = true;
	/* check if any color is 'unknown' */
	pattern.forEach((row) => {
		if (row.includes('unknown')) {
			isPatternValid = false;
		}
	});

	/* if re-detecting then side pattern might match with previous patterns. */
	/* so ignoring same pattern checking during re-detection. */
	if (!isReDetecting) {
		/* check if the side is already taken */
		if (isPatternValid) {
			/* match with previously detected patterns */
			let isSame = previousCubeFacePatterns.some((e) => {
				return matchPatterns(e, pattern);
			});

			if (isSame) {
				showAlert = 'This SIDE is already taken!';
				return false;
			}
		}
	}

	/* since colors count won't be an issue for the first face */
	if (faceNumber > 1) {
		if (isPatternValid) {
			let colorsCountOfCurrentFace = {
				white: 0,
				orange: 0,
				blue: 0,
				red: 0,
				green: 0,
				yellow: 0
			};
			getColorsCount(pattern, colorsCountOfCurrentFace);

			if (!isColorsCountValid(colorsCountOfCurrentFace, faceNumber)) {
				showAlert = 'Invalid Colors Count!';
				return false;
			}
		}
	}

	return isPatternValid;
}

/* ------------------ pattern validation functions end ------------------ */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* ----------------------------- key binding ---------------------------- */
// bind space key to toggle process
window.addEventListener('keydown', (event) => {
	// prevent key default movements
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
	}

	switch (event.key) {
		case 'Enter':
			console.log('ENTER pressed. Webcam streaming started.');
			startWebcam();
			break;
		case ' ':
			if (isDetectionCompleted) {
				console.log('PATTERN DETECTION ALREADY COMPLETED!');
			} else {
				console.log('SPACE pressed.');
				startProcess();
			}
			break;
	}
});
/* ---------------------------------------------------------------------- */
