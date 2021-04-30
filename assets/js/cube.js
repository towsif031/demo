const cube = [];
for (let i = 0; i < 18; i++) {
	cube[i] = [];
}

const cubePattern = [];
for (let i = 0; i < 9; i++) {
	cubePattern[i] = [];
}

for (let i = 0; i < 9; i++) {
	for (let j = 0; j < 12; j++) {
		cubePattern[i][j] = '_';
	}
}

let move = 0;
let movements = [];
let stepsToSolve = '';

let f_prime = false;
let r_prime = false;
let u_prime = false;
let b_prime = false;
let l_normal = false;
let d_normal = false;

let patternValid = true;

const stepsCountText = document.querySelector('.steps-count-text');
const goBackToUnsolvedStateBtn = document.querySelector(
	'.go-back-to-unsolved-state-btn'
);
const autoSolverBtn = document.querySelector('.auto-solver-btn');
const stepsToFollow = document.querySelector('.steps-to-follow');

let eachStep = '';
let allStepsDiv = '';

/* ---------------------------------------------------------------------- */
/* --------- virtual cube creation and colorizing functions start ------- */

/* initialize cube */
function setCube() {
	move = 0;
	for (let i = 0; i < 18; i++) {
		for (let j = 0; j < 3; j++) {
			if (i < 3) cube[i][j] = '_';
			if (i >= 3 && i < 6) cube[i][j] = '_';
			if (i >= 6 && i < 9) cube[i][j] = '_';
			if (i >= 9 && i < 12) cube[i][j] = '_';
			if (i >= 12 && i < 15) cube[i][j] = '_';
			if (i >= 15 && i < 18) cube[i][j] = '_';
		}
	}

	getCubePattern(cube);
	colorVirtualCube(cube);
}

/* create the virtual cube */
function createVirtualCube() {
	const cubeContainerDiv = document.querySelector('.cube-container');
	let virtualCubeFaceColors = [
		'blue',
		'white',
		'green',
		'yellow',
		'red',
		'orange'
	];

	let lastIndex = 0;
	virtualCubeFaceColors.forEach((color) => {
		let endIndex = lastIndex + 3;
		const cubeFaceDiv = document.createElement('div');
		cubeFaceDiv.setAttribute('class', `cubeFace ${color}`);
		cubeContainerDiv.appendChild(cubeFaceDiv);
		for (let startIndex = lastIndex; startIndex < endIndex; startIndex++) {
			for (let j = 0; j < 3; j++) {
				const cubeletDiv = document.createElement('div');
				cubeletDiv.setAttribute(
					'class',
					`cubelet cubelet_id${startIndex}${j}`
				);
				cubeFaceDiv.appendChild(cubeletDiv);
			}
		}
		lastIndex = endIndex;
	});

	setCube();
}

/* color the virtual cube according to input pattern */
function colorVirtualCube(cube) {
	for (let i = 0; i < 18; i++) {
		for (let j = 0; j < 3; j++) {
			const cubeletSelector = document.querySelector(
				'.cubelet_id' + i + j
			);

			switch (cube[i][j]) {
				case '_':
					cubeletSelector.style.background = 'rgb(100, 100, 100)';
					break;
				case 'W':
					cubeletSelector.style.background = 'rgb(255, 255, 255)';
					break;
				case 'B':
					cubeletSelector.style.background = 'rgb(25, 118, 210)';
					break;
				case 'O':
					cubeletSelector.style.background = 'rgb(251, 140, 0)';
					break;
				case 'G':
					cubeletSelector.style.background = 'rgb(67, 160, 71)';
					break;
				case 'R':
					cubeletSelector.style.background = 'rgb(244, 67, 54)';
					break;
				case 'Y':
					cubeletSelector.style.background = 'rgb(255, 235, 59)';
					break;
			}
		}
	}
	// getCubePattern(cube);
}

/* ---------- virtual cube creation and colorizing functions end -------- */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* ---------- virtual cube controller validation functions start -------- */

let staticY = -30;
let staticX = -35;

function rotateUp() {
	document.getElementsByClassName('cube-container')[0].style.transform =
		' rotateX(-35deg) rotateY(' + staticY + 'deg) ';
	document.getElementsByClassName('up-btn')[0].disabled = true;
	document.getElementsByClassName('up-arrow-btn')[0].style =
		'border: solid #757575; border-width: 0 3px 3px 0;';
	document.getElementsByClassName('down-btn')[0].disabled = false;
	document.getElementsByClassName('down-arrow-btn')[0].style =
		'border: solid #00E676; border-width: 0 3px 3px 0;';
	staticX = -35;
}

function rotateLeft() {
	document.getElementsByClassName('cube-container')[0].style.transform =
		'rotateX(' + staticX + 'deg) rotateY(135deg)';
	document.getElementsByClassName('left-btn')[0].disabled = true;
	document.getElementsByClassName('left-arrow-btn')[0].style =
		'border: solid #757575; border-width: 0 3px 3px 0;';
	document.getElementsByClassName('right-btn')[0].disabled = false;
	document.getElementsByClassName('right-arrow-btn')[0].style =
		'border: solid #00E676; border-width: 0 3px 3px 0;';
	staticY = 135;
}

function rotateRight() {
	document.getElementsByClassName('cube-container')[0].style.transform =
		' rotateX(' + staticX + 'deg) rotateY(-30deg) ';
	document.getElementsByClassName('right-btn')[0].disabled = true;
	document.getElementsByClassName('right-arrow-btn')[0].style =
		'border: solid #757575; border-width: 0 3px 3px 0;';
	document.getElementsByClassName('left-btn')[0].disabled = false;
	document.getElementsByClassName('left-arrow-btn')[0].style =
		'border: solid #00E676; border-width: 0 3px 3px 0;';
	staticY = -30;
}

function rotateDown() {
	document.getElementsByClassName('cube-container')[0].style.transform =
		' rotateX(35deg) rotateY(' + staticY + 'deg) ';
	document.getElementsByClassName('down-btn')[0].disabled = true;
	document.getElementsByClassName('down-arrow-btn')[0].style =
		'border: solid #757575; border-width: 0 3px 3px 0;';
	document.getElementsByClassName('up-btn')[0].disabled = false;
	document.getElementsByClassName('up-arrow-btn')[0].style =
		'border: solid #00E676; border-width: 0 3px 3px 0;';
	staticX = 35;
}

/* ----------- virtual cube controller validation functions end --------- */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* --------------------- cube movement functions start ------------------ */

function moveCount() {
	console.log('total moves: ' + move);
}

function move_F() {
	if (move > 500) {
		alert('Invalid Cube!');
		throw new Error('Something went wrong!');
	}

	if (!f_prime) {
		move++;
		movements.push('F');
		console.log(move + ' F');
	}

	const buffer1 = cube[5][0];
	const buffer2 = cube[5][1];
	const buffer3 = cube[5][2];

	const buffer4 = cube[6][0];
	const buffer5 = cube[6][1];

	cube[5][0] = cube[17][0];
	cube[5][1] = cube[17][1];
	cube[5][2] = cube[17][2];

	cube[17][2] = cube[9][0];
	cube[17][1] = cube[9][1];
	cube[17][0] = cube[9][2];

	cube[9][0] = cube[14][2];
	cube[9][1] = cube[14][1];
	cube[9][2] = cube[14][0];

	cube[14][0] = buffer1;
	cube[14][1] = buffer2;
	cube[14][2] = buffer3;

	cube[6][0] = cube[8][0];
	cube[8][0] = cube[8][2];
	cube[8][2] = cube[6][2];
	cube[6][2] = buffer4;

	cube[6][1] = cube[7][0];
	cube[7][0] = cube[8][1];
	cube[8][1] = cube[7][2];
	cube[7][2] = buffer5;

	colorVirtualCube(cube);
	getCubePattern(cube);
}

function move_2F() {
	move_F();
	move_F();
}

function move_F_prime() {
	f_prime = true;

	move++;
	movements.push('f');
	console.log(move + ` F'`);

	move_F();
	move_F();
	move_F();

	f_prime = false;
}

function move_2F_prime() {
	move_F_prime();
	move_F_prime();
}

function move_R() {
	if (move > 500) {
		alert('Invalid Cube!');
		throw new Error('Something went wrong!');
	}

	if (!r_prime) {
		move++;
		movements.push('R');
		console.log(move + ' R');
	}

	const buffer1 = cube[3][2];
	const buffer2 = cube[4][2];
	const buffer3 = cube[5][2];

	const buffer4 = cube[13][0];
	const buffer5 = cube[14][0];

	cube[3][2] = cube[6][2];
	cube[4][2] = cube[7][2];
	cube[5][2] = cube[8][2];

	cube[6][2] = cube[9][2];
	cube[7][2] = cube[10][2];
	cube[8][2] = cube[11][2];

	cube[9][2] = cube[0][2];
	cube[10][2] = cube[1][2];
	cube[11][2] = cube[2][2];

	cube[0][2] = buffer1;
	cube[1][2] = buffer2;
	cube[2][2] = buffer3;

	cube[13][0] = cube[14][1];
	cube[14][1] = cube[13][2];
	cube[13][2] = cube[12][1];
	cube[12][1] = buffer4;

	cube[14][0] = cube[14][2];
	cube[14][2] = cube[12][2];
	cube[12][2] = cube[12][0];
	cube[12][0] = buffer5;

	colorVirtualCube(cube);
	getCubePattern(cube);
}

function move_2R() {
	move_R();
	move_R();
}

function move_R_prime() {
	r_prime = true;

	move++;
	movements.push('r');
	console.log(move + ` R'`);

	move_R();
	move_R();
	move_R();

	r_prime = false;
}

function move_2R_prime() {
	move_R_prime();
	move_R_prime();
}

function move_U() {
	if (move > 500) {
		alert('Invalid Cube!');
		throw new Error('Something went wrong!');
	}

	if (!u_prime) {
		move++;
		movements.push('U');
		console.log(move + ' U');
	}

	const buffer1 = cube[6][0];
	const buffer2 = cube[6][1];
	const buffer3 = cube[6][2];

	const buffer4 = cube[4][0];
	const buffer5 = cube[5][2];

	cube[6][0] = cube[14][0];
	cube[6][1] = cube[13][0];
	cube[6][2] = cube[12][0];

	cube[12][0] = cube[2][0];
	cube[13][0] = cube[2][1];
	cube[14][0] = cube[2][2];

	cube[2][0] = cube[17][2];
	cube[2][1] = cube[16][2];
	cube[2][2] = cube[15][2];

	cube[17][2] = buffer3;
	cube[16][2] = buffer2;
	cube[15][2] = buffer1;

	cube[4][0] = cube[5][1];
	cube[5][1] = cube[4][2];
	cube[4][2] = cube[3][1];
	cube[3][1] = buffer4;

	cube[5][2] = cube[3][2];
	cube[3][2] = cube[3][0];
	cube[3][0] = cube[5][0];
	cube[5][0] = buffer5;

	colorVirtualCube(cube);
	getCubePattern(cube);
}

function move_2U() {
	move_U();
	move_U();
}

function move_U_prime() {
	u_prime = true;

	move++;
	movements.push('u');
	console.log(move + ` U'`);

	move_U();
	move_U();
	move_U();

	u_prime = false;
}

function move_2U_prime() {
	move_U_prime();
	move_U_prime();
}

function move_L_prime() {
	if (move > 500) {
		alert('Invalid Cube!');
		throw new Error('Something went wrong!');
	}

	if (!l_normal) {
		move++;
		movements.push('l');
		console.log(move + ` L'`);
	}

	const buffer1 = cube[3][0];
	const buffer2 = cube[4][0];
	const buffer3 = cube[5][0];

	const buffer4 = cube[16][2];
	const buffer5 = cube[17][2];

	cube[3][0] = cube[6][0];
	cube[4][0] = cube[7][0];
	cube[5][0] = cube[8][0];

	cube[6][0] = cube[9][0];
	cube[7][0] = cube[10][0];
	cube[8][0] = cube[11][0];

	cube[9][0] = cube[0][0];
	cube[10][0] = cube[1][0];
	cube[11][0] = cube[2][0];

	cube[0][0] = buffer1;
	cube[1][0] = buffer2;
	cube[2][0] = buffer3;

	cube[16][2] = cube[17][1];
	cube[17][1] = cube[16][0];
	cube[16][0] = cube[15][1];
	cube[15][1] = buffer4;

	cube[17][2] = cube[17][0];
	cube[17][0] = cube[15][0];
	cube[15][0] = cube[15][2];
	cube[15][2] = buffer5;

	colorVirtualCube(cube);
	getCubePattern(cube);
}

function move_2L() {
	move_L();
	move_L();
}

function move_L() {
	l_normal = true;

	move++;
	movements.push('L');
	console.log(move + ' L');

	move_L_prime();
	move_L_prime();
	move_L_prime();

	l_normal = false;
}

function move_2L_prime() {
	move_L_prime();
	move_L_prime();
}

function move_D_prime() {
	if (move > 500) {
		alert('Invalid Cube!');
		throw new Error('Something went wrong!');
	}

	if (!d_normal) {
		move++;
		movements.push('d');
		console.log(move + ` D'`);
	}

	const buffer1 = cube[8][0];
	const buffer2 = cube[8][1];
	const buffer3 = cube[8][2];

	const buffer4 = cube[9][0];
	const buffer5 = cube[9][1];

	cube[8][0] = cube[14][2];
	cube[8][1] = cube[13][2];
	cube[8][2] = cube[12][2];

	cube[14][2] = cube[0][2];
	cube[13][2] = cube[0][1];
	cube[12][2] = cube[0][0];

	cube[0][2] = cube[15][0];
	cube[0][1] = cube[16][0];
	cube[0][0] = cube[17][0];

	cube[17][0] = buffer3;
	cube[16][0] = buffer2;
	cube[15][0] = buffer1;

	cube[9][0] = cube[9][2];
	cube[9][2] = cube[11][2];
	cube[11][2] = cube[11][0];
	cube[11][0] = buffer4;

	cube[9][1] = cube[10][2];
	cube[10][2] = cube[11][1];
	cube[11][1] = cube[10][0];
	cube[10][0] = buffer5;

	colorVirtualCube(cube);
	getCubePattern(cube);
}

function move_2D() {
	move_D();
	move_D();
}

function move_D() {
	d_normal = true;

	move++;
	movements.push('D');
	console.log(move + ' D');

	move_D_prime();
	move_D_prime();
	move_D_prime();

	d_normal = false;
}

function move_2D_prime() {
	move_D_prime();
	move_D_prime();
}

function move_B() {
	if (move > 500) {
		alert('Invalid Cube!');
		throw new Error('Something went wrong!');
	}

	if (!b_prime) {
		move++;
		movements.push('B');
		console.log(move + ' B');
	}

	const buffer1 = cube[3][0];
	const buffer2 = cube[3][1];
	const buffer3 = cube[3][2];

	const buffer4 = cube[2][0];
	const buffer5 = cube[2][1];

	cube[3][0] = cube[12][0];
	cube[3][1] = cube[12][1];
	cube[3][2] = cube[12][2];

	cube[12][0] = cube[11][2];
	cube[12][1] = cube[11][1];
	cube[12][2] = cube[11][0];

	cube[11][2] = cube[15][0];
	cube[11][1] = cube[15][1];
	cube[11][0] = cube[15][2];

	cube[15][0] = buffer1;
	cube[15][1] = buffer2;
	cube[15][2] = buffer3;

	cube[2][0] = cube[2][2];
	cube[2][2] = cube[0][2];
	cube[0][2] = cube[0][0];
	cube[0][0] = buffer4;

	cube[2][1] = cube[1][2];
	cube[1][2] = cube[0][1];
	cube[0][1] = cube[1][0];
	cube[1][0] = buffer5;

	colorVirtualCube(cube);
	getCubePattern(cube);
}

function move_2B() {
	move_B();
	move_B();
}

function move_B_prime() {
	b_prime = true;

	move++;
	movements.push('b');
	console.log(move + ` B'`);

	move_B();
	move_B();
	move_B();

	b_prime = false;
}

function move_2B_prime() {
	move_B_prime();
	move_B_prime();
}

/* ---------------------- cube movement functions end ------------------- */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* --------- virtual cube input pattern and move functions start -------- */

let scrambledCube = [];

for (let i = 0; i < 18; i++) {
	scrambledCube[i] = [];
}

/* store user's scrambled cube's pattern */
function storeScrambledCube() {
	for (let i = 0; i < 18; i++) {
		for (let j = 0; j < 3; j++) {
			scrambledCube[i][j] = cube[i][j];
		}
	}
}

/* get current cube pattern */
function getCubePattern(currentCube) {
	// white center
	cubePattern[0][3] = currentCube[3][0];
	cubePattern[0][4] = currentCube[3][1];
	cubePattern[0][5] = currentCube[3][2];
	cubePattern[1][3] = currentCube[4][0];
	cubePattern[1][4] = currentCube[4][1];
	cubePattern[1][5] = currentCube[4][2];
	cubePattern[2][3] = currentCube[5][0];
	cubePattern[2][4] = currentCube[5][1];
	cubePattern[2][5] = currentCube[5][2];

	// orange center
	cubePattern[3][0] = currentCube[15][2];
	cubePattern[3][1] = currentCube[16][2];
	cubePattern[3][2] = currentCube[17][2];
	cubePattern[4][0] = currentCube[15][1];
	cubePattern[4][1] = currentCube[16][1];
	cubePattern[4][2] = currentCube[17][1];
	cubePattern[5][0] = currentCube[15][0];
	cubePattern[5][1] = currentCube[16][0];
	cubePattern[5][2] = currentCube[17][0];

	// green center
	cubePattern[3][3] = currentCube[6][0];
	cubePattern[3][4] = currentCube[6][1];
	cubePattern[3][5] = currentCube[6][2];
	cubePattern[4][3] = currentCube[7][0];
	cubePattern[4][4] = currentCube[7][1];
	cubePattern[4][5] = currentCube[7][2];
	cubePattern[5][3] = currentCube[8][0];
	cubePattern[5][4] = currentCube[8][1];
	cubePattern[5][5] = currentCube[8][2];

	// red center
	cubePattern[3][6] = currentCube[14][0];
	cubePattern[3][7] = currentCube[13][0];
	cubePattern[3][8] = currentCube[12][0];
	cubePattern[4][6] = currentCube[14][1];
	cubePattern[4][7] = currentCube[13][1];
	cubePattern[4][8] = currentCube[12][1];
	cubePattern[5][6] = currentCube[14][2];
	cubePattern[5][7] = currentCube[13][2];
	cubePattern[5][8] = currentCube[12][2];

	// blue center
	cubePattern[3][9] = currentCube[2][2];
	cubePattern[3][10] = currentCube[2][1];
	cubePattern[3][11] = currentCube[2][0];
	cubePattern[4][9] = currentCube[1][2];
	cubePattern[4][10] = currentCube[1][1];
	cubePattern[4][11] = currentCube[1][0];
	cubePattern[5][9] = currentCube[0][2];
	cubePattern[5][10] = currentCube[0][1];
	cubePattern[5][11] = currentCube[0][0];

	// yellow center
	cubePattern[6][3] = currentCube[9][0];
	cubePattern[6][4] = currentCube[9][1];
	cubePattern[6][5] = currentCube[9][2];
	cubePattern[7][3] = currentCube[10][0];
	cubePattern[7][4] = currentCube[10][1];
	cubePattern[7][5] = currentCube[10][2];
	cubePattern[8][3] = currentCube[11][0];
	cubePattern[8][4] = currentCube[11][1];
	cubePattern[8][5] = currentCube[11][2];

	// console.log(cubePattern);
}

/* check for pattern validity */
function validateCubePattern() {
	let wCount = 0;
	let oCount = 0;
	let gCount = 0;
	let rCount = 0;
	let bCount = 0;
	let yCount = 0;

	for (let i = 0; i < 18; i++) {
		for (let j = 0; j < 3; j++) {
			// console.log(cube[i][j]);
			if (cube[i][j] === 'W') {
				wCount++;
			}
			if (cube[i][j] === 'O') {
				oCount++;
			}
			if (cube[i][j] === 'G') {
				gCount++;
			}
			if (cube[i][j] === 'R') {
				rCount++;
			}
			if (cube[i][j] === 'B') {
				bCount++;
			}
			if (cube[i][j] === 'Y') {
				yCount++;
			}
		}
	}

	if (
		wCount > 9 ||
		oCount > 9 ||
		gCount > 9 ||
		rCount > 9 ||
		bCount > 9 ||
		yCount > 9
	) {
		patternValid = false;
	} else {
		patternValid = true;
	}

	if (!patternValid) {
		alert(
			'Invalid Pattern! Please recheck colors.\n' +
				'[Each color should be present exactly 9 times]\n\n' +
				'White = ' +
				wCount +
				' times |   Blue      = ' +
				oCount +
				' times\nGreen =  ' +
				gCount +
				' times  |   Orange = ' +
				rCount +
				' times\nRed    =  ' +
				bCount +
				' times  |   Yellow   = ' +
				yCount +
				' times'
		);
	}
}

function getMovements() {
	stepsToSolve = movements.join('');
	// console.log(stepsToSolve.length);

	// stepsToSolve = 'FFFFFFuuuFFFbDRRRR';

	// remove duplicate moves
	while (
		/FFF/.test(stepsToSolve) ||
		/RRR/.test(stepsToSolve) ||
		/UUU/.test(stepsToSolve) ||
		/LLL/.test(stepsToSolve) ||
		/DDD/.test(stepsToSolve) ||
		/BBB/.test(stepsToSolve) ||
		/fff/.test(stepsToSolve) ||
		/rrr/.test(stepsToSolve) ||
		/uuu/.test(stepsToSolve) ||
		/lll/.test(stepsToSolve) ||
		/ddd/.test(stepsToSolve) ||
		/bbb/.test(stepsToSolve) ||
		/Ff/.test(stepsToSolve) ||
		/fF/.test(stepsToSolve) ||
		/Rr/.test(stepsToSolve) ||
		/rR/.test(stepsToSolve) ||
		/Uu/.test(stepsToSolve) ||
		/uU/.test(stepsToSolve) ||
		/Ll/.test(stepsToSolve) ||
		/lL/.test(stepsToSolve) ||
		/Dd/.test(stepsToSolve) ||
		/dD/.test(stepsToSolve) ||
		/Bb/.test(stepsToSolve) ||
		/bB/.test(stepsToSolve)
	) {
		if (/FFF/.test(stepsToSolve)) {
			const temp_FFF = stepsToSolve.replace(/FFF/g, 'f');
			stepsToSolve = temp_FFF;
		}

		if (/RRR/.test(stepsToSolve)) {
			const temp_RRR = stepsToSolve.replace(/RRR/g, 'r');
			stepsToSolve = temp_RRR;
		}

		if (/UUU/.test(stepsToSolve)) {
			const temp_UUU = stepsToSolve.replace(/UUU/g, 'u');
			stepsToSolve = temp_UUU;
		}

		if (/LLL/.test(stepsToSolve)) {
			const temp_LLL = stepsToSolve.replace(/LLL/g, 'l');
			stepsToSolve = temp_LLL;
		}

		if (/DDD/.test(stepsToSolve)) {
			const temp_DDD = stepsToSolve.replace(/DDD/g, 'd');
			stepsToSolve = temp_DDD;
		}

		if (/BBB/.test(stepsToSolve)) {
			const temp_BBB = stepsToSolve.replace(/BBB/g, 'b');
			stepsToSolve = temp_BBB;
		}

		if (/fff/.test(stepsToSolve)) {
			const temp_fff = stepsToSolve.replace(/fff/g, 'F');
			stepsToSolve = temp_fff;
		}

		if (/rrr/.test(stepsToSolve)) {
			const temp_rrr = stepsToSolve.replace(/rrr/g, 'R');
			stepsToSolve = temp_rrr;
		}

		if (/uuu/.test(stepsToSolve)) {
			const temp_uuu = stepsToSolve.replace(/uuu/g, 'U');
			stepsToSolve = temp_uuu;
		}

		if (/lll/.test(stepsToSolve)) {
			const temp_lll = stepsToSolve.replace(/lll/g, 'L');
			stepsToSolve = temp_lll;
		}

		if (/ddd/.test(stepsToSolve)) {
			const temp_ddd = stepsToSolve.replace(/ddd/g, 'D');
			stepsToSolve = temp_ddd;
		}

		if (/bbb/.test(stepsToSolve)) {
			const temp_bbb = stepsToSolve.replace(/bbb/g, 'B');
			stepsToSolve = temp_bbb;
		}

		// --------

		if (/Ff/.test(stepsToSolve)) {
			const temp_Ff = stepsToSolve.replace(/Ff/g, '');
			stepsToSolve = temp_Ff;
		}

		if (/fF/.test(stepsToSolve)) {
			const temp_fF = stepsToSolve.replace(/fF/g, '');
			stepsToSolve = temp_fF;
		}

		if (/Ff/.test(stepsToSolve)) {
			const temp_Ff = stepsToSolve.replace(/Ff/g, '');
			stepsToSolve = temp_Ff;
		}

		if (/fF/.test(stepsToSolve)) {
			const temp_fF = stepsToSolve.replace(/fF/g, '');
			stepsToSolve = temp_fF;
		}

		if (/Rr/.test(stepsToSolve)) {
			const temp_Rr = stepsToSolve.replace(/Rr/g, '');
			stepsToSolve = temp_Rr;
		}

		if (/rR/.test(stepsToSolve)) {
			const temp_rR = stepsToSolve.replace(/rR/g, '');
			stepsToSolve = temp_rR;
		}

		if (/Uu/.test(stepsToSolve)) {
			const temp_Uu = stepsToSolve.replace(/Uu/g, '');
			stepsToSolve = temp_Uu;
		}

		if (/uU/.test(stepsToSolve)) {
			const temp_uU = stepsToSolve.replace(/uU/g, '');
			stepsToSolve = temp_uU;
		}

		if (/Ll/.test(stepsToSolve)) {
			const temp_Ll = stepsToSolve.replace(/Ll/g, '');
			stepsToSolve = temp_Ll;
		}

		if (/lL/.test(stepsToSolve)) {
			const temp_lL = stepsToSolve.replace(/lL/g, '');
			stepsToSolve = temp_lL;
		}

		if (/Dd/.test(stepsToSolve)) {
			const temp_Dd = stepsToSolve.replace(/Dd/g, '');
			stepsToSolve = temp_Dd;
		}

		if (/dD/.test(stepsToSolve)) {
			const temp_dD = stepsToSolve.replace(/dD/g, '');
			stepsToSolve = temp_dD;
		}

		if (/Bb/.test(stepsToSolve)) {
			const temp_Bb = stepsToSolve.replace(/Bb/g, '');
			stepsToSolve = temp_Bb;
		}

		if (/bB/.test(stepsToSolve)) {
			const temp_bB = stepsToSolve.replace(/bB/g, '');
			stepsToSolve = temp_bB;
		}
	}

	// remove duplicate moves
	while (
		/FF/.test(stepsToSolve) ||
		/RR/.test(stepsToSolve) ||
		/UU/.test(stepsToSolve) ||
		/LL/.test(stepsToSolve) ||
		/DD/.test(stepsToSolve) ||
		/BB/.test(stepsToSolve) ||
		/ff/.test(stepsToSolve) ||
		/rr/.test(stepsToSolve) ||
		/uu/.test(stepsToSolve) ||
		/ll/.test(stepsToSolve) ||
		/dd/.test(stepsToSolve) ||
		/bb/.test(stepsToSolve)
	) {
		if (/FF/.test(stepsToSolve)) {
			const temp_FFF = stepsToSolve.replace(/FF/g, 'M');
			stepsToSolve = temp_FFF;
		}

		if (/RR/.test(stepsToSolve)) {
			const temp_RRR = stepsToSolve.replace(/RR/g, 'N');
			stepsToSolve = temp_RRR;
		}

		if (/UU/.test(stepsToSolve)) {
			const temp_UUU = stepsToSolve.replace(/UU/g, 'O');
			stepsToSolve = temp_UUU;
		}

		if (/LL/.test(stepsToSolve)) {
			const temp_LLL = stepsToSolve.replace(/LL/g, 'I');
			stepsToSolve = temp_LLL;
		}

		if (/DD/.test(stepsToSolve)) {
			const temp_DDD = stepsToSolve.replace(/DD/g, 'J');
			stepsToSolve = temp_DDD;
		}

		if (/BB/.test(stepsToSolve)) {
			const temp_BBB = stepsToSolve.replace(/BB/g, 'K');
			stepsToSolve = temp_BBB;
		}

		if (/ff/.test(stepsToSolve)) {
			const temp_fff = stepsToSolve.replace(/ff/g, 'm');
			stepsToSolve = temp_fff;
		}

		if (/rr/.test(stepsToSolve)) {
			const temp_rrr = stepsToSolve.replace(/rr/g, 'n');
			stepsToSolve = temp_rrr;
		}

		if (/uu/.test(stepsToSolve)) {
			const temp_uuu = stepsToSolve.replace(/uu/g, 'o');
			stepsToSolve = temp_uuu;
		}

		if (/ll/.test(stepsToSolve)) {
			const temp_lll = stepsToSolve.replace(/ll/g, 'i');
			stepsToSolve = temp_lll;
		}

		if (/dd/.test(stepsToSolve)) {
			const temp_ddd = stepsToSolve.replace(/dd/g, 'j');
			stepsToSolve = temp_ddd;
		}

		if (/bb/.test(stepsToSolve)) {
			const temp_bbb = stepsToSolve.replace(/bb/g, 'k');
			stepsToSolve = temp_bbb;
		}
	}

	console.log(stepsToSolve);
	console.log(stepsToSolve.length);
}

/* ---------- virtual cube input pattern and move functions end --------- */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* --------- solving step viewer and auto solver functions start -------- */

/* generate steps viewer table and functions */
function stepsViewer() {
	stepsCountText.textContent = `Total Steps to Solve: ${stepsToSolve.length}`;

	goBackToUnsolvedStateBtn.textContent = 'Go Back to Unsolved State';

	goBackToUnsolvedStateBtn.onmouseover = function () {
		goBackToUnsolvedStateBtn.style.color = '#00e676';
	};
	goBackToUnsolvedStateBtn.onmouseleave = function () {
		goBackToUnsolvedStateBtn.style.color = '#fff';
	};

	goBackToUnsolvedStateBtn.onclick = function () {
		goBackToUnsolvedState();
	};

	autoSolverBtn.textContent = 'Auto Solve';
	autoSolverBtn.style.cursor = 'default';

	autoSolverBtn.onclick = function () {
		autoSolveStepByStep();
	};

	for (let step of stepsToSolve) {
		if (/F/.test(step)) {
			moveToSolve = 'move_F()';
		}
		if (/R/.test(step)) {
			moveToSolve = 'move_R()';
		}
		if (/U/.test(step)) {
			moveToSolve = 'move_U()';
		}
		if (/L/.test(step)) {
			moveToSolve = 'move_L()';
		}
		if (/D/.test(step)) {
			moveToSolve = 'move_D()';
		}
		if (/B/.test(step)) {
			moveToSolve = 'move_B()';
		}

		if (/f/.test(step)) {
			const temp_f = step.replace(/f/g, "F '");
			step = temp_f;
			moveToSolve = 'move_F_prime()';
		}
		if (/r/.test(step)) {
			const temp_r = step.replace(/r/g, "R '");
			step = temp_r;
			moveToSolve = 'move_R_prime()';
		}
		if (/u/.test(step)) {
			const temp_u = step.replace(/u/g, "U '");
			step = temp_u;
			moveToSolve = 'move_U_prime()';
		}
		if (/l/.test(step)) {
			const temp_l = step.replace(/l/g, "L '");
			step = temp_l;
			moveToSolve = 'move_L_prime()';
		}
		if (/d/.test(step)) {
			const temp_d = step.replace(/d/g, "D '");
			step = temp_d;
			moveToSolve = 'move_D_prime()';
		}
		if (/b/.test(step)) {
			const temp_b = step.replace(/b/g, "B '");
			step = temp_b;
			moveToSolve = 'move_B_prime()';
		}

		//

		if (/M/.test(step)) {
			const temp_f = step.replace(/M/g, '2F');
			step = temp_f;
			moveToSolve = 'move_2F()';
		}
		if (/N/.test(step)) {
			const temp_r = step.replace(/N/g, '2R');
			step = temp_r;
			moveToSolve = 'move_2R()';
		}
		if (/O/.test(step)) {
			const temp_u = step.replace(/O/g, '2U');
			step = temp_u;
			moveToSolve = 'move_2U()';
		}
		if (/I/.test(step)) {
			const temp_l = step.replace(/I/g, '2L');
			step = temp_l;
			moveToSolve = 'move_2L()';
		}
		if (/J/.test(step)) {
			const temp_d = step.replace(/J/g, '2D');
			step = temp_d;
			moveToSolve = 'move_2D()';
		}
		if (/K/.test(step)) {
			const temp_b = step.replace(/K/g, '2B');
			step = temp_b;
			moveToSolve = 'move_2B()';
		}
		if (/m/.test(step)) {
			const temp_f = step.replace(/m/g, "2F '");
			step = temp_f;
			moveToSolve = 'move_2F_prime()';
		}
		if (/n/.test(step)) {
			const temp_r = step.replace(/n/g, "2R '");
			step = temp_r;
			moveToSolve = 'move_2R_prime()';
		}
		if (/o/.test(step)) {
			const temp_u = step.replace(/o/g, "2U '");
			step = temp_u;
			moveToSolve = 'move_2U_prime()';
		}
		if (/i/.test(step)) {
			const temp_l = step.replace(/i/g, "2L '");
			step = temp_l;
			moveToSolve = 'move_2L_prime()';
		}
		if (/j/.test(step)) {
			const temp_d = step.replace(/j/g, "2D '");
			step = temp_d;
			moveToSolve = 'move_2D_prime()';
		}
		if (/k/.test(step)) {
			const temp_b = step.replace(/k/g, "2B '");
			step = temp_b;
			moveToSolve = 'move_2B_prime()';
		}
		eachStep = `<div class="each-step" onclick=${moveToSolve}>${step}</div>`;
		allStepsDiv = allStepsDiv.concat(eachStep);
	}

	stepsToFollow.innerHTML = allStepsDiv;
	allStepsDiv = '';
}

/* bring the virtual cube back to it's unsolved state */
function goBackToUnsolvedState() {
	move = 0;

	goBackToUnsolvedStateBtn.disabled = true;
	goBackToUnsolvedStateBtn.style.borderColor = '#616161';
	goBackToUnsolvedStateBtn.style.color = '#616161';
	goBackToUnsolvedStateBtn.style.cursor = 'default';

	autoSolverBtn.disabled = false;
	autoSolverBtn.innerHTML = 'Auto Solve';
	autoSolverBtn.style.borderColor = '#7c7c7c';
	autoSolverBtn.style.color = '#fff';
	autoSolverBtn.style.cursor = 'pointer';

	autoSolverBtn.onmouseover = function () {
		autoSolverBtn.style.color = '#00e676';
	};
	autoSolverBtn.onmouseleave = function () {
		autoSolverBtn.style.color = '#fff';
	};

	colorVirtualCube(scrambledCube);
	for (let i = 0; i < 18; i++) {
		for (let j = 0; j < 3; j++) {
			cube[i][j] = scrambledCube[i][j];
		}
	}
}

/* auto solve the virtual cube following the solution moves step by step */
function autoSolveStepByStep() {
	autoSolverBtn.disabled = true;
	autoSolverBtn.innerHTML = 'Auto Solving ...';
	autoSolverBtn.style.color = '#00e676';
	autoSolverBtn.style.cursor = 'default';

	let timeDelay = 0;
	for (let step of stepsToSolve) {
		if (/F/.test(step)) {
			setTimeout(move_F, timeDelay);
		}
		if (/R/.test(step)) {
			setTimeout(move_R, timeDelay);
		}
		if (/U/.test(step)) {
			setTimeout(move_U, timeDelay);
		}
		if (/L/.test(step)) {
			setTimeout(move_L, timeDelay);
		}
		if (/D/.test(step)) {
			setTimeout(move_D, timeDelay);
		}
		if (/B/.test(step)) {
			setTimeout(move_B, timeDelay);
		}
		if (/f/.test(step)) {
			setTimeout(move_F_prime, timeDelay);
		}
		if (/r/.test(step)) {
			setTimeout(move_R_prime, timeDelay);
		}
		if (/u/.test(step)) {
			setTimeout(move_U_prime, timeDelay);
		}
		if (/l/.test(step)) {
			setTimeout(move_L_prime, timeDelay);
		}
		if (/d/.test(step)) {
			setTimeout(move_D_prime, timeDelay);
		}
		if (/b/.test(step)) {
			setTimeout(move_B_prime, timeDelay);
		}

		//
		if (/M/.test(step)) {
			setTimeout(move_2F, timeDelay);
		}
		if (/N/.test(step)) {
			setTimeout(move_2R, timeDelay);
		}
		if (/O/.test(step)) {
			setTimeout(move_2U, timeDelay);
		}
		if (/I/.test(step)) {
			setTimeout(move_2L, timeDelay);
		}
		if (/J/.test(step)) {
			setTimeout(move_2D, timeDelay);
		}
		if (/K/.test(step)) {
			setTimeout(move_2B, timeDelay);
		}

		/* ----- opposite moves ----- */

		if (/m/.test(step)) {
			setTimeout(move_2F_prime, timeDelay);
		}
		if (/n/.test(step)) {
			setTimeout(move_2R_prime, timeDelay);
		}
		if (/o/.test(step)) {
			setTimeout(move_2U_prime, timeDelay);
		}
		if (/i/.test(step)) {
			setTimeout(move_2L_prime, timeDelay);
		}
		if (/j/.test(step)) {
			setTimeout(move_2D_prime, timeDelay);
		}
		if (/k/.test(step)) {
			setTimeout(move_2B_prime, timeDelay);
		}

		timeDelay += 500;
	}

	setTimeout(function () {
		autoSolverBtn.innerHTML = 'Auto Solve';
		autoSolverBtn.style.borderColor = '#616161';
		autoSolverBtn.style.color = '#616161';

		goBackToUnsolvedStateBtn.disabled = false;
		goBackToUnsolvedStateBtn.style.borderColor = '#7c7c7c';
		goBackToUnsolvedStateBtn.style.color = '#fff';
		goBackToUnsolvedStateBtn.style.cursor = 'pointer';

		goBackToUnsolvedStateBtn.onmouseover = function () {
			goBackToUnsolvedStateBtn.style.color = '#00e676';
		};
		goBackToUnsolvedStateBtn.onmouseleave = function () {
			goBackToUnsolvedStateBtn.style.color = '#fff';
		};
	}, timeDelay);
}

/* ---------- solving step viewer and auto solver functions end --------- */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* --------------------- key bind controller movements ------------------ */
/* bind moves with keys */
window.addEventListener('keydown', (event) => {
	// prevent arrow keys default movements
	if (
		event.key === 'ArrowUp' ||
		event.key === 'ArrowDown' ||
		event.key === 'ArrowLeft' ||
		event.key === 'ArrowRight'
	) {
		event.preventDefault();
	}

	switch (event.key) {
		case 'f':
			move_F();
			break;
		case 'r':
			move_R();
			break;
		case 'u':
			move_U();
			break;
		case 'b':
			move_B();
			break;
		case 'l':
			move_L();
			break;
		case 'd':
			move_D();
			break;
		case 'ArrowUp':
			rotateUp();
			break;
		case 'ArrowDown':
			rotateDown();
			break;
		case 'ArrowLeft':
			rotateLeft();
			break;
		case 'ArrowRight':
			rotateRight();
			break;
	}
});
/* ---------------------------------------------------------------------- */
/* ---------------------------------------------------------------------- */
