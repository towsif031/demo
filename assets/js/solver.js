/* ========================= detector pattern ========================= */

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

/* -------------------------------------------------------------------- */
/* ========================== solver pattern ========================== */

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

/* -------------------------------------------------------------------- */

let alreadySolved = false;

let wbo = false;
let wog = false;
let wgr = false;
let wrb = false;

let bottomLayerCornersSolved = false;

let corner_OGY_inPosition = false;
let corner_GRY_inPosition = false;
let corner_RBY_inPosition = false;
let corner_BOY_inPosition = false;

/* get cube from display input */
function getCubeFromInput(inputPattern) {
	// white center
	cube[3][0] = inputPattern[0][0];
	cube[3][1] = inputPattern[0][1];
	cube[3][2] = inputPattern[0][2];
	cube[4][0] = inputPattern[1][0];
	cube[4][1] = inputPattern[1][1];
	cube[4][2] = inputPattern[1][2];
	cube[5][0] = inputPattern[2][0];
	cube[5][1] = inputPattern[2][1];
	cube[5][2] = inputPattern[2][2];

	// orange center
	cube[15][2] = inputPattern[3][3];
	cube[16][2] = inputPattern[3][4];
	cube[17][2] = inputPattern[3][5];
	cube[15][1] = inputPattern[4][3];
	cube[16][1] = inputPattern[4][4];
	cube[17][1] = inputPattern[4][5];
	cube[15][0] = inputPattern[5][3];
	cube[16][0] = inputPattern[5][4];
	cube[17][0] = inputPattern[5][5];

	// green center
	cube[6][0] = inputPattern[3][0];
	cube[6][1] = inputPattern[3][1];
	cube[6][2] = inputPattern[3][2];
	cube[7][0] = inputPattern[4][0];
	cube[7][1] = inputPattern[4][1];
	cube[7][2] = inputPattern[4][2];
	cube[8][0] = inputPattern[5][0];
	cube[8][1] = inputPattern[5][1];
	cube[8][2] = inputPattern[5][2];

	// red center
	cube[14][0] = inputPattern[3][9];
	cube[13][0] = inputPattern[3][10];
	cube[12][0] = inputPattern[3][11];
	cube[14][1] = inputPattern[4][9];
	cube[13][1] = inputPattern[4][10];
	cube[12][1] = inputPattern[4][11];
	cube[14][2] = inputPattern[5][9];
	cube[13][2] = inputPattern[5][10];
	cube[12][2] = inputPattern[5][11];

	// blue center
	cube[2][2] = inputPattern[3][6];
	cube[2][1] = inputPattern[3][7];
	cube[2][0] = inputPattern[3][8];
	cube[1][2] = inputPattern[4][6];
	cube[1][1] = inputPattern[4][7];
	cube[1][0] = inputPattern[4][8];
	cube[0][2] = inputPattern[5][6];
	cube[0][1] = inputPattern[5][7];
	cube[0][0] = inputPattern[5][8];

	// yellow center
	cube[9][0] = inputPattern[8][9];
	cube[9][1] = inputPattern[7][9];
	cube[9][2] = inputPattern[6][9];
	cube[10][0] = inputPattern[8][10];
	cube[10][1] = inputPattern[7][10];
	cube[10][2] = inputPattern[6][10];
	cube[11][0] = inputPattern[8][11];
	cube[11][1] = inputPattern[7][11];
	cube[11][2] = inputPattern[6][11];

	// console.log(cubePattern);
}

/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

// ----------------------------------------
// ----------------------------------------

/*
 **	top layer solver functions
 */

// check daisy layer
let leftWhiteLeafEdge = false;
let frontWhiteLeafEdge = false;
let rightWhiteLeafEdge = false;
let backWhiteLeafEdge = false;

// ----------get daisy's leaf edges----------
function get_leftWhiteLeafEdge() {
	if (
		cubePattern[4][0] === cubePattern[1][4] ||
		cubePattern[4][11] === cubePattern[1][4]
	) {
		// OB
		move_L_prime();
	} else if (
		cubePattern[1][3] === cubePattern[1][4] ||
		cubePattern[3][1] === cubePattern[1][4]
	) {
		// WO
		move_L();
		move_L();
	} else if (
		cubePattern[4][2] === cubePattern[1][4] ||
		cubePattern[4][3] === cubePattern[1][4]
	) {
		// OG
		move_L();
	}

	// check top layer edges except left side for white
	else if (
		cubePattern[2][4] === cubePattern[1][4] ||
		cubePattern[3][4] === cubePattern[1][4]
	) {
		// WG
		move_U();
		move_L();
		move_L();
	} else if (
		cubePattern[1][5] === cubePattern[1][4] ||
		cubePattern[3][7] === cubePattern[1][4]
	) {
		// WR
		move_U();
		move_U();
		move_L();
		move_L();
	} else if (
		cubePattern[0][4] === cubePattern[1][4] ||
		cubePattern[3][10] === cubePattern[1][4]
	) {
		// WB
		move_U_prime();
		move_L();
		move_L();
	}

	// check other 2 middle layer edges
	else if (
		cubePattern[4][5] === cubePattern[1][4] ||
		cubePattern[4][6] === cubePattern[1][4]
	) {
		// GR
		move_F_prime();
		move_U();
		move_F();
		move_L();
		move_L();
	} else if (
		cubePattern[4][8] === cubePattern[1][4] ||
		cubePattern[4][9] === cubePattern[1][4]
	) {
		// RB
		move_B();
		move_U_prime();
		move_B_prime();
		move_L();
		move_L();
	}

	// check leftWhiteLeafEdge
	if (
		cubePattern[5][1] === cubePattern[1][4] ||
		cubePattern[7][3] === cubePattern[1][4]
	) {
		// OY
		leftWhiteLeafEdge = true;
	} else {
		console.log('failed getOrangeSideWhitetoBottom');
	}
}

function get_frontWhiteLeafEdge() {
	if (
		cubePattern[4][2] === cubePattern[1][4] ||
		cubePattern[4][3] === cubePattern[1][4]
	) {
		// OG
		move_F_prime();
	} else if (
		cubePattern[2][4] === cubePattern[1][4] ||
		cubePattern[3][4] === cubePattern[1][4]
	) {
		// WG
		move_F();
		move_F();
	} else if (
		cubePattern[4][5] === cubePattern[1][4] ||
		cubePattern[4][6] === cubePattern[1][4]
	) {
		// GR
		move_F();
	}

	// check top layer edges except front side for white
	else if (
		cubePattern[1][5] === cubePattern[1][4] ||
		cubePattern[3][7] === cubePattern[1][4]
	) {
		// WR
		move_U();
		move_F();
		move_F();
	} else if (
		cubePattern[0][4] === cubePattern[1][4] ||
		cubePattern[3][10] === cubePattern[1][4]
	) {
		// WB
		move_U();
		move_U();
		move_F();
		move_F();
	} else if (
		cubePattern[1][3] === cubePattern[1][4] ||
		cubePattern[3][1] === cubePattern[1][4]
	) {
		// WO
		move_U_prime();
		move_F();
		move_F();
	}

	// check other 2 middle layer edges
	else if (
		cubePattern[4][8] === cubePattern[1][4] ||
		cubePattern[4][9] === cubePattern[1][4]
	) {
		// RB
		move_R_prime();
		move_U();
		move_R();
		move_F();
		move_F();
	} else if (
		cubePattern[4][0] === cubePattern[1][4] ||
		cubePattern[4][11] === cubePattern[1][4]
	) {
		// OB
		move_L();
		move_U_prime();
		move_L_prime();
		move_F();
		move_F();
	}

	// check frontWhiteLeafEdge
	if (
		cubePattern[5][4] === cubePattern[1][4] ||
		cubePattern[6][4] === cubePattern[1][4]
	) {
		// GY
		frontWhiteLeafEdge = true;
	} else {
		console.log('failed getGreenSideWhitetoBottom');
	}
}

function get_rightWhiteLeafEdge() {
	if (
		cubePattern[4][5] === cubePattern[1][4] ||
		cubePattern[4][6] === cubePattern[1][4]
	) {
		// GR
		move_R_prime();
	} else if (
		cubePattern[1][5] === cubePattern[1][4] ||
		cubePattern[3][7] === cubePattern[1][4]
	) {
		// WR
		move_R();
		move_R();
	} else if (
		cubePattern[4][8] === cubePattern[1][4] ||
		cubePattern[4][9] === cubePattern[1][4]
	) {
		// RB
		move_R();
	}

	// check top layer edges except right side for white
	else if (
		cubePattern[0][4] === cubePattern[1][4] ||
		cubePattern[3][10] === cubePattern[1][4]
	) {
		// WB
		move_U();
		move_R();
		move_R();
	} else if (
		cubePattern[1][3] === cubePattern[1][4] ||
		cubePattern[3][1] === cubePattern[1][4]
	) {
		// WO
		move_U();
		move_U();
		move_R();
		move_R();
	} else if (
		cubePattern[2][4] === cubePattern[1][4] ||
		cubePattern[3][4] === cubePattern[1][4]
	) {
		// WG
		move_U_prime();
		move_R();
		move_R();
	}

	// check other 2 middle layer edges
	else if (
		cubePattern[4][0] === cubePattern[1][4] ||
		cubePattern[4][11] === cubePattern[1][4]
	) {
		// OB
		move_B_prime();
		move_U();
		move_B();
		move_R();
		move_R();
	} else if (
		cubePattern[4][2] === cubePattern[1][4] ||
		cubePattern[4][3] === cubePattern[1][4]
	) {
		// OG
		move_F();
		move_U_prime();
		move_F_prime();
		move_R();
		move_R();
	}

	// check rightWhiteLeafEdge
	if (
		cubePattern[5][7] === cubePattern[1][4] ||
		cubePattern[7][5] === cubePattern[1][4]
	) {
		// RY
		rightWhiteLeafEdge = true;
	} else {
		console.log('failed getRedSideWhitetoBottom');
	}
}

function get_backWhiteLeafEdge() {
	if (
		cubePattern[4][8] === cubePattern[1][4] ||
		cubePattern[4][9] === cubePattern[1][4]
	) {
		// RB
		move_B_prime();
	} else if (
		cubePattern[0][4] === cubePattern[1][4] ||
		cubePattern[3][10] === cubePattern[1][4]
	) {
		// WB
		move_B();
		move_B();
	} else if (
		cubePattern[4][0] === cubePattern[1][4] ||
		cubePattern[4][11] === cubePattern[1][4]
	) {
		// OB
		move_B();
	}

	// check top layer edges except back side for white
	else if (
		cubePattern[1][3] === cubePattern[1][4] ||
		cubePattern[3][1] === cubePattern[1][4]
	) {
		// WO
		move_U();
		move_B();
		move_B();
	} else if (
		cubePattern[2][4] === cubePattern[1][4] ||
		cubePattern[3][4] === cubePattern[1][4]
	) {
		// WG
		move_U();
		move_U();
		move_B();
		move_B();
	} else if (
		cubePattern[1][5] === cubePattern[1][4] ||
		cubePattern[3][7] === cubePattern[1][4]
	) {
		// WR
		move_U_prime();
		move_B();
		move_B();
	}

	// check other 2 middle layer edges
	else if (
		cubePattern[4][2] === cubePattern[1][4] ||
		cubePattern[4][3] === cubePattern[1][4]
	) {
		// OG
		move_L_prime();
		move_U();
		move_L();
		move_B();
		move_B();
	} else if (
		cubePattern[4][5] === cubePattern[1][4] ||
		cubePattern[4][6] === cubePattern[1][4]
	) {
		// GR
		move_R();
		move_U_prime();
		move_R_prime();
		move_B();
		move_B();
	}

	// check backWhiteLeafEdge
	if (
		cubePattern[5][10] === cubePattern[1][4] ||
		cubePattern[8][4] === cubePattern[1][4]
	) {
		// BY
		backWhiteLeafEdge = true;
	} else {
		console.log('failed getBlueSideWhitetoBottom');
	}
}
// ----------get daisy's leaf edges (end)----------

// daisy solver function for white cross
function solveDaisy() {
	if (
		cubePattern[5][1] === cubePattern[1][4] ||
		cubePattern[7][3] === cubePattern[1][4]
	) {
		// OY
		leftWhiteLeafEdge = true;
	} else {
		leftWhiteLeafEdge = false;
	}
	if (
		cubePattern[5][4] === cubePattern[1][4] ||
		cubePattern[6][4] === cubePattern[1][4]
	) {
		// GY
		frontWhiteLeafEdge = true;
	} else {
		frontWhiteLeafEdge = false;
	}
	if (
		cubePattern[5][7] === cubePattern[1][4] ||
		cubePattern[7][5] === cubePattern[1][4]
	) {
		// RY
		rightWhiteLeafEdge = true;
	} else {
		rightWhiteLeafEdge = false;
	}
	if (
		cubePattern[5][10] === cubePattern[1][4] ||
		cubePattern[8][4] === cubePattern[1][4]
	) {
		// BY
		backWhiteLeafEdge = true;
	} else {
		backWhiteLeafEdge = false;
	}

	// daisy layer solver
	if (
		leftWhiteLeafEdge &&
		frontWhiteLeafEdge &&
		rightWhiteLeafEdge &&
		backWhiteLeafEdge
	) {
		console.log(
			'Daisy Layer. All White edges are around the Yellow center.'
		);
	} else {
		console.log('Not a Daisy Layer');
		console.log('leftWhiteLeafEdge = ', leftWhiteLeafEdge);
		console.log('frontWhiteLeafEdge = ', frontWhiteLeafEdge);
		console.log('rightWhiteLeafEdge = ', rightWhiteLeafEdge);
		console.log('backWhiteLeafEdge = ', backWhiteLeafEdge);

		if (!leftWhiteLeafEdge) {
			get_leftWhiteLeafEdge();
		} else {
			console.log('Left edge has white');
		}

		if (!frontWhiteLeafEdge) {
			get_frontWhiteLeafEdge();
		} else {
			console.log('Front edge has white');
		}

		if (!rightWhiteLeafEdge) {
			get_rightWhiteLeafEdge();
		} else {
			console.log('Right edge has white');
		}

		if (!backWhiteLeafEdge) {
			get_backWhiteLeafEdge();
		} else {
			console.log('Back edge has white');
		}
	}

	// Daisy solver
	console.log('Get a Daisy');

	// L side
	if (cubePattern[5][1] === cubePattern[1][4]) {
		// OY-O
		move_L_prime();
		move_D();
		move_F_prime();
		move_D_prime();
	}
	// F side
	if (cubePattern[5][4] === cubePattern[1][4]) {
		// GY-G
		move_F_prime();
		move_D();
		move_R_prime();
		move_D_prime();
	}
	// R side
	if (cubePattern[5][7] === cubePattern[1][4]) {
		// RY-R
		move_R();
		move_D_prime();
		move_F();
		move_D();
	}
	// B side
	if (cubePattern[5][10] === cubePattern[1][4]) {
		// BY-B
		move_B();
		move_D_prime();
		move_R();
		move_D();
	}

	console.log(
		cubePattern[7][3] === cubePattern[1][4] &&
			cubePattern[7][5] === cubePattern[1][4] &&
			cubePattern[6][4] === cubePattern[1][4] &&
			cubePattern[8][4] === cubePattern[1][4]
	);

	console.log(
		cubePattern[7][3],
		cubePattern[7][5],
		cubePattern[6][4],
		cubePattern[8][4]
	);

	console.log("Now that's a Daisy");
}

// white cross solver
function solveWhiteCross() {
	do {
		// OY edge - O
		if (cubePattern[7][3] === cubePattern[1][4]) {
			if (cubePattern[5][1] === cubePattern[4][1]) {
				move_L();
				move_L();
			} else if (cubePattern[5][1] === cubePattern[4][4]) {
				move_D();
				move_F();
				move_F();
			} else if (cubePattern[5][1] === cubePattern[4][7]) {
				move_D();
				move_D();
				move_R();
				move_R();
			} else if (cubePattern[5][1] === cubePattern[4][10]) {
				move_D_prime();
				move_B();
				move_B();
			}
		}

		// GY edge - G
		if (cubePattern[6][4] === cubePattern[1][4]) {
			if (cubePattern[5][4] === cubePattern[4][4]) {
				move_F();
				move_F();
			} else if (cubePattern[5][4] === cubePattern[4][7]) {
				move_D();
				move_R();
				move_R();
			} else if (cubePattern[5][4] === cubePattern[4][10]) {
				move_D();
				move_D();
				move_B();
				move_B();
			} else if (cubePattern[5][4] === cubePattern[4][1]) {
				move_D_prime();
				move_L();
				move_L();
			}
		}

		// RY edge - R
		if (cubePattern[7][5] === cubePattern[1][4]) {
			if (cubePattern[5][7] === cubePattern[4][7]) {
				move_R();
				move_R();
			} else if (cubePattern[5][7] === cubePattern[4][10]) {
				move_D();
				move_B();
				move_B();
			} else if (cubePattern[5][7] === cubePattern[4][1]) {
				move_D();
				move_D();
				move_L();
				move_L();
			} else if (cubePattern[5][7] === cubePattern[4][4]) {
				move_D_prime();
				move_F();
				move_F();
			}
		}

		// BY edge - B
		if (cubePattern[8][4] === cubePattern[1][4]) {
			if (cubePattern[5][10] === cubePattern[4][10]) {
				move_B();
				move_B();
			} else if (cubePattern[5][10] === cubePattern[4][1]) {
				move_D();
				move_L();
				move_L();
			} else if (cubePattern[5][10] === cubePattern[4][4]) {
				move_D();
				move_D();
				move_F();
				move_F();
			} else if (cubePattern[5][10] === cubePattern[4][7]) {
				move_D_prime();
				move_R();
				move_R();
			}
		}
	} while (
		cubePattern[7][3] === cubePattern[1][4] ||
		cubePattern[6][4] === cubePattern[1][4] ||
		cubePattern[7][5] === cubePattern[1][4] ||
		cubePattern[8][4] === cubePattern[1][4]
	);

	console.log(
		cubePattern[1][3],
		cubePattern[1][5],
		cubePattern[0][4],
		cubePattern[2][4]
	);

	console.log("Now that's a White Cross");
}

// fix the white corner with last layer white
function getLastLayerWhiteToCorner() {
	// if white on the lower-right corner
	// OYG corner
	if (cubePattern[5][2] === cubePattern[1][4]) {
		if (cubePattern[5][3] === cubePattern[4][1]) {
			move_D_prime();
			move_D_prime();
			move_L_prime();
			move_D();
			move_L();
		} else if (cubePattern[5][3] === cubePattern[4][4]) {
			move_D_prime();
			move_F_prime();
			move_D();
			move_F();
		} else if (cubePattern[5][3] === cubePattern[4][7]) {
			move_R_prime();
			move_D();
			move_R();
		} else if (cubePattern[5][3] === cubePattern[4][10]) {
			move_D();
			move_B_prime();
			move_D();
			move_B();
		}
	}

	// GYR corner
	if (cubePattern[5][5] === cubePattern[1][4]) {
		if (cubePattern[5][6] === cubePattern[4][1]) {
			move_D();
			move_L_prime();
			move_D();
			move_L();
		} else if (cubePattern[5][6] === cubePattern[4][4]) {
			move_D_prime();
			move_D_prime();
			move_F_prime();
			move_D();
			move_F();
		} else if (cubePattern[5][6] === cubePattern[4][7]) {
			move_D_prime();
			move_R_prime();
			move_D();
			move_R();
		} else if (cubePattern[5][6] === cubePattern[4][10]) {
			move_B_prime();
			move_D();
			move_B();
		}
	}

	// RYB corner
	if (cubePattern[5][8] === cubePattern[1][4]) {
		if (cubePattern[5][9] === cubePattern[4][1]) {
			move_L_prime();
			move_D();
			move_L();
		} else if (cubePattern[5][9] === cubePattern[4][4]) {
			move_D();
			move_F_prime();
			move_D();
			move_F();
		} else if (cubePattern[5][9] === cubePattern[4][7]) {
			move_D_prime();
			move_D_prime();
			move_R_prime();
			move_D();
			move_R();
		} else if (cubePattern[5][9] === cubePattern[4][10]) {
			move_D_prime();
			move_B_prime();
			move_D();
			move_B();
		}
	}

	// BYO corner
	if (cubePattern[5][11] === cubePattern[1][4]) {
		if (cubePattern[5][0] === cubePattern[4][1]) {
			move_D_prime();
			move_L_prime();
			move_D();
			move_L();
		} else if (cubePattern[5][0] === cubePattern[4][4]) {
			move_F_prime();
			move_D();
			move_F();
		} else if (cubePattern[5][0] === cubePattern[4][7]) {
			move_D();
			move_R_prime();
			move_D();
			move_R();
		} else if (cubePattern[5][0] === cubePattern[4][10]) {
			move_D_prime();
			move_D_prime();
			move_B_prime();
			move_D();
			move_B();
		}
	}
	// ------------

	// if white on the lower-left corner
	// OYB corner
	if (cubePattern[5][0] === cubePattern[1][4]) {
		if (cubePattern[5][11] === cubePattern[4][1]) {
			move_D();
			move_D();
			move_L();
			move_D_prime();
			move_L_prime();
		} else if (cubePattern[5][11] === cubePattern[4][4]) {
			move_D_prime();
			move_F();
			move_D_prime();
			move_F_prime();
		} else if (cubePattern[5][11] === cubePattern[4][7]) {
			move_R();
			move_D_prime();
			move_R_prime();
		} else if (cubePattern[5][11] === cubePattern[4][10]) {
			move_D();
			move_B();
			move_D_prime();
			move_B_prime();
		}
	}

	// GYO corner
	if (cubePattern[5][3] === cubePattern[1][4]) {
		if (cubePattern[5][2] === cubePattern[4][1]) {
			move_D();
			move_L();
			move_D_prime();
			move_L_prime();
		} else if (cubePattern[5][2] === cubePattern[4][4]) {
			move_D();
			move_D();
			move_F();
			move_D_prime();
			move_F_prime();
		} else if (cubePattern[5][2] === cubePattern[4][7]) {
			move_D_prime();
			move_R();
			move_D_prime();
			move_R_prime();
		} else if (cubePattern[5][2] === cubePattern[4][10]) {
			move_B();
			move_D_prime();
			move_B_prime();
		}
	}

	// RYG corner
	if (cubePattern[5][6] === cubePattern[1][4]) {
		if (cubePattern[5][5] === cubePattern[4][1]) {
			move_L();
			move_D_prime();
			move_L_prime();
		} else if (cubePattern[5][5] === cubePattern[4][4]) {
			move_D();
			move_F();
			move_D_prime();
			move_F_prime();
		} else if (cubePattern[5][5] === cubePattern[4][7]) {
			move_D();
			move_D();
			move_R();
			move_D_prime();
			move_R_prime();
		} else if (cubePattern[5][5] === cubePattern[4][10]) {
			move_D_prime();
			move_B();
			move_D_prime();
			move_B_prime();
		}
	}

	// BYR corner
	if (cubePattern[5][9] === cubePattern[1][4]) {
		if (cubePattern[5][8] === cubePattern[4][1]) {
			move_D_prime();
			move_L();
			move_D_prime();
			move_L_prime();
		} else if (cubePattern[5][8] === cubePattern[4][4]) {
			move_F();
			move_D_prime();
			move_F_prime();
		} else if (cubePattern[5][8] === cubePattern[4][7]) {
			move_D();
			move_R();
			move_D_prime();
			move_R_prime();
		} else if (cubePattern[5][8] === cubePattern[4][10]) {
			move_D();
			move_D();
			move_B();
			move_D_prime();
			move_B_prime();
		}
	}
	// ------------

	// bring to white corner to front face from down face
	// YRG corner
	if (cubePattern[6][5] === cubePattern[1][4]) {
		move_F();
		move_D_prime();
		move_F_prime();
		move_D();
		move_D();
	}

	// YBR corner
	if (cubePattern[8][5] === cubePattern[1][4]) {
		move_R();
		move_D_prime();
		move_R_prime();
		move_D();
		move_D();
	}

	// YOB corner
	if (cubePattern[8][3] === cubePattern[1][4]) {
		move_B();
		move_D_prime();
		move_B_prime();
		move_D();
		move_D();
	}

	// YGO corner
	if (cubePattern[6][3] === cubePattern[1][4]) {
		move_L();
		move_D_prime();
		move_L_prime();
		move_D();
		move_D();
	}
}

// bring the white corner from top layer to bottom layer
function bringWhiteFromTopToBottomLayer() {
	// WBO corner
	if (!wbo) {
		move_B();
		move_D();
		move_B_prime();
	}

	// WOG corner
	if (!wog) {
		move_L();
		move_D();
		move_L_prime();
	}

	// WGR corner
	if (!wgr) {
		move_R_prime();
		move_D_prime();
		move_R();
	}

	// WRB corner
	if (!wrb) {
		move_B_prime();
		move_D_prime();
		move_B();
	}
}

// check if white corner are in position
function whiteCornerPositionChecker() {
	// WBO corner
	if (
		cubePattern[0][3] === cubePattern[1][4] &&
		cubePattern[3][11] === cubePattern[4][10] &&
		cubePattern[3][0] === cubePattern[4][1]
	) {
		wbo = true;
	} else {
		wbo = false;
	}

	// WOG corner
	if (
		cubePattern[2][3] === cubePattern[1][4] &&
		cubePattern[3][2] === cubePattern[4][1] &&
		cubePattern[3][3] === cubePattern[4][4]
	) {
		wog = true;
	} else {
		wog = false;
	}

	// WGR corner
	if (
		cubePattern[2][5] === cubePattern[1][4] &&
		cubePattern[3][5] === cubePattern[4][4] &&
		cubePattern[3][6] === cubePattern[4][7]
	) {
		wgr = true;
	} else {
		wgr = false;
	}

	// WRB corner
	if (
		cubePattern[0][5] === cubePattern[1][4] &&
		cubePattern[3][8] === cubePattern[4][7] &&
		cubePattern[3][11] === cubePattern[4][10]
	) {
		wrb = true;
	} else {
		wrb = false;
	}
}

// white corners solver
function solveWhiteCorners() {
	do {
		while (
			cubePattern[5][2] === cubePattern[1][4] ||
			cubePattern[5][3] === cubePattern[1][4] ||
			cubePattern[5][5] === cubePattern[1][4] ||
			cubePattern[5][6] === cubePattern[1][4] ||
			cubePattern[5][8] === cubePattern[1][4] ||
			cubePattern[5][9] === cubePattern[1][4] ||
			cubePattern[5][11] === cubePattern[1][4] ||
			cubePattern[5][0] === cubePattern[1][4] ||
			cubePattern[6][5] === cubePattern[1][4] ||
			cubePattern[8][5] === cubePattern[1][4] ||
			cubePattern[8][3] === cubePattern[1][4] ||
			cubePattern[6][3] === cubePattern[1][4]
		) {
			getLastLayerWhiteToCorner();
		}

		whiteCornerPositionChecker();
		bringWhiteFromTopToBottomLayer();
	} while (!wbo || !wog || !wgr || !wrb);
}

/*
 **	top layer solver
 */

function solveTopLayer() {
	/*
	 **	white cross
	 */
	// check if there is already a white cross
	if (
		cubePattern[3][1] === cubePattern[4][1] &&
		cubePattern[1][3] === cubePattern[1][4] &&
		cubePattern[1][4] === cubePattern[1][4] &&
		cubePattern[1][5] === cubePattern[1][4] &&
		cubePattern[3][7] === cubePattern[4][7] &&
		cubePattern[3][10] === cubePattern[4][10] &&
		cubePattern[0][4] === cubePattern[1][4] &&
		cubePattern[2][4] === cubePattern[1][4] &&
		cubePattern[3][4] === cubePattern[4][4]
	) {
		console.log('Already a White Cross');
	} else {
		console.log('Need to solve White Cross');

		// check if daisy
		if (
			cubePattern[7][3] === cubePattern[1][4] &&
			cubePattern[7][5] === cubePattern[1][4] &&
			cubePattern[6][4] === cubePattern[1][4] &&
			cubePattern[8][4] === cubePattern[1][4]
		) {
			console.log("That's already a Daisy");
		} else {
			solveDaisy();
		}

		// get the white cross
		solveWhiteCross();
	}

	/*
	 **	white corners
	 */
	// check if white corners are in position
	whiteCornerPositionChecker();

	if (wbo && wog && wgr && wrb) {
		console.log('White Corners are in position');
	} else {
		console.log('Need to solve White Corners');

		// console.log('wbo', wbo);
		// console.log('wog', wog);
		// console.log('wgr', wgr);
		// console.log('wrb', wrb);

		solveWhiteCorners();
	}
}

// ----------------------------------------
// ----------------------------------------

/*
 **	middle layer solver functions
 */

function bottomLayerEdgeFace_Orange() {
	if (cubePattern[7][3] === cubePattern[4][4]) {
		move_D_prime();
		move_F_prime();
		move_D();
		move_F();
		move_D();
		move_L();
		move_D_prime();
		move_L_prime();
	}

	if (cubePattern[7][3] === cubePattern[4][10]) {
		move_D();
		move_B();
		move_D_prime();
		move_B_prime();
		move_D_prime();
		move_L_prime();
		move_D();
		move_L();
	}
}

function bottomLayerEdgeFace_Green() {
	if (cubePattern[6][4] === cubePattern[4][7]) {
		move_D_prime();
		move_R_prime();
		move_D();
		move_R();
		move_D();
		move_F();
		move_D_prime();
		move_F_prime();
	}

	if (cubePattern[6][4] === cubePattern[4][1]) {
		move_D();
		move_L();
		move_D_prime();
		move_L_prime();
		move_D_prime();
		move_F_prime();
		move_D();
		move_F();
	}
}

function bottomLayerEdgeFace_Red() {
	if (cubePattern[7][5] === cubePattern[4][10]) {
		move_D_prime();
		move_B_prime();
		move_D();
		move_B();
		move_D();
		move_R();
		move_D_prime();
		move_R_prime();
	}

	if (cubePattern[7][5] === cubePattern[4][4]) {
		move_D();
		move_F();
		move_D_prime();
		move_F_prime();
		move_D_prime();
		move_R_prime();
		move_D();
		move_R();
	}
}

function bottomLayerEdgeFace_Blue() {
	if (cubePattern[8][4] === cubePattern[4][1]) {
		move_D_prime();
		move_L_prime();
		move_D();
		move_L();
		move_D();
		move_B();
		move_D_prime();
		move_B_prime();
	}

	if (cubePattern[8][4] === cubePattern[4][7]) {
		move_D();
		move_R();
		move_D_prime();
		move_R_prime();
		move_D_prime();
		move_B_prime();
		move_D();
		move_B();
	}
}

// wrong OG edge
function getWrong_OG_EdgeToBottom() {
	if (
		cubePattern[4][2] !== cubePattern[4][1] ||
		cubePattern[4][3] !== cubePattern[4][4]
	) {
		if (
			cubePattern[4][2] !== cubePattern[7][4] &&
			cubePattern[4][3] !== cubePattern[7][4]
		) {
			move_F_prime();
			move_D();
			move_F();
			move_D();
			move_L();
			move_D_prime();
			move_L_prime();
		}
	}
}

// wrong GR edge
function getWrong_GR_EdgeToBottom() {
	if (
		cubePattern[4][5] !== cubePattern[4][4] ||
		cubePattern[4][6] !== cubePattern[4][7]
	) {
		if (
			cubePattern[4][5] !== cubePattern[7][4] &&
			cubePattern[4][6] !== cubePattern[7][4]
		) {
			move_R_prime();
			move_D();
			move_R();
			move_D();
			move_F();
			move_D_prime();
			move_F_prime();
		}
	}
}

// wrong RB edge
function getWrong_RB_EdgeToBottom() {
	if (
		cubePattern[4][8] !== cubePattern[4][7] ||
		cubePattern[4][9] !== cubePattern[4][10]
	) {
		if (
			cubePattern[4][8] !== cubePattern[7][4] &&
			cubePattern[4][9] !== cubePattern[7][4]
		) {
			move_B_prime();
			move_D();
			move_B();
			move_D();
			move_R();
			move_D_prime();
			move_R_prime();
		}
	}
}

// wrong BO edge
function getWrong_BO_EdgeToBottom() {
	if (
		cubePattern[4][11] !== cubePattern[4][10] ||
		cubePattern[4][0] !== cubePattern[4][1]
	) {
		if (
			cubePattern[4][11] !== cubePattern[7][4] &&
			cubePattern[4][0] !== cubePattern[7][4]
		) {
			move_L_prime();
			move_D();
			move_L();
			move_D();
			move_B();
			move_D_prime();
			move_B_prime();
		}
	}
}

/*
 **	middle layer solver
 */
function solveMiddleLayer() {
	// check if middle layer already solved
	if (
		cubePattern[4][2] === cubePattern[4][1] &&
		cubePattern[4][3] === cubePattern[4][4] &&
		cubePattern[4][5] === cubePattern[4][4] &&
		cubePattern[4][6] === cubePattern[4][7] &&
		cubePattern[4][8] === cubePattern[4][7] &&
		cubePattern[4][9] === cubePattern[4][10] &&
		cubePattern[4][11] === cubePattern[4][10] &&
		cubePattern[4][0] === cubePattern[4][1]
	) {
		console.log('Middle Layer already solved.');
	} else {
		console.log('Middle Layer needs to be solved.');

		do {
			// OY edge
			if (
				cubePattern[5][1] !== cubePattern[7][4] &&
				cubePattern[7][3] !== cubePattern[7][4]
			) {
				if (cubePattern[5][1] === cubePattern[4][1]) {
					bottomLayerEdgeFace_Orange();
				}

				if (cubePattern[5][1] === cubePattern[4][4]) {
					move_D();
					bottomLayerEdgeFace_Green();
				}

				if (cubePattern[5][1] === cubePattern[4][7]) {
					move_D();
					move_D();
					bottomLayerEdgeFace_Red();
				}

				if (cubePattern[5][1] === cubePattern[4][10]) {
					move_D_prime();
					bottomLayerEdgeFace_Blue();
				}
			}

			// GY edge
			if (
				cubePattern[5][4] !== cubePattern[7][4] &&
				cubePattern[6][4] !== cubePattern[7][4]
			) {
				if (cubePattern[5][4] === cubePattern[4][1]) {
					move_D_prime();
					bottomLayerEdgeFace_Orange();
				}

				if (cubePattern[5][4] === cubePattern[4][4]) {
					bottomLayerEdgeFace_Green();
				}

				if (cubePattern[5][4] === cubePattern[4][7]) {
					move_D();
					bottomLayerEdgeFace_Red();
				}

				if (cubePattern[5][4] === cubePattern[4][10]) {
					move_D();
					move_D();
					bottomLayerEdgeFace_Blue();
				}
			}

			// RY edge
			if (
				cubePattern[5][7] !== cubePattern[7][4] &&
				cubePattern[7][5] !== cubePattern[7][4]
			) {
				if (cubePattern[5][7] === cubePattern[4][1]) {
					move_D();
					move_D();
					bottomLayerEdgeFace_Orange();
				}

				if (cubePattern[5][7] === cubePattern[4][4]) {
					move_D_prime();
					bottomLayerEdgeFace_Green();
				}

				if (cubePattern[5][7] === cubePattern[4][7]) {
					bottomLayerEdgeFace_Red();
				}

				if (cubePattern[5][7] === cubePattern[4][10]) {
					move_D();
					bottomLayerEdgeFace_Blue();
				}
			}

			// BY edge
			if (
				cubePattern[5][10] !== cubePattern[7][4] &&
				cubePattern[8][4] !== cubePattern[7][4]
			) {
				if (cubePattern[5][10] === cubePattern[4][1]) {
					move_D();
					bottomLayerEdgeFace_Orange();
				}

				if (cubePattern[5][10] === cubePattern[4][4]) {
					move_D();
					move_D();
					bottomLayerEdgeFace_Green();
				}

				if (cubePattern[5][10] === cubePattern[4][7]) {
					move_D_prime();
					bottomLayerEdgeFace_Red();
				}

				if (cubePattern[5][10] === cubePattern[4][10]) {
					bottomLayerEdgeFace_Blue();
				}
			}

			getWrong_OG_EdgeToBottom();
			getWrong_GR_EdgeToBottom();
			getWrong_RB_EdgeToBottom();
			getWrong_BO_EdgeToBottom();
		} while (
			cubePattern[4][2] !== cubePattern[4][1] ||
			cubePattern[4][3] !== cubePattern[4][4] ||
			cubePattern[4][5] !== cubePattern[4][4] ||
			cubePattern[4][6] !== cubePattern[4][7] ||
			cubePattern[4][8] !== cubePattern[4][7] ||
			cubePattern[4][9] !== cubePattern[4][10] ||
			cubePattern[4][11] !== cubePattern[4][10] ||
			cubePattern[4][0] !== cubePattern[4][1]
		);
	}
}

// ----------------------------------------
// ----------------------------------------

/*
 **	bottom layer solver functions
 */

// F R U R' U' F'
function moveFRURiUiFi() {
	move_F();
	move_L();
	move_D();
	move_L_prime();
	move_D_prime();
	move_F_prime();
}

// form yellow cross
function getYellowCross() {
	if (
		cubePattern[7][3] !== cubePattern[7][4] &&
		cubePattern[7][5] !== cubePattern[7][4] &&
		cubePattern[6][4] !== cubePattern[7][4] &&
		cubePattern[8][4] !== cubePattern[7][4]
	) {
		moveFRURiUiFi();
		moveFRURiUiFi();
		move_D();
		moveFRURiUiFi();
	} else if (
		cubePattern[6][4] === cubePattern[7][4] &&
		cubePattern[7][3] === cubePattern[7][4]
	) {
		moveFRURiUiFi();
	} else if (
		cubePattern[7][3] === cubePattern[7][4] &&
		cubePattern[8][4] === cubePattern[7][4]
	) {
		move_D();
		moveFRURiUiFi();
	} else if (
		cubePattern[8][4] === cubePattern[7][4] &&
		cubePattern[7][5] === cubePattern[7][4]
	) {
		move_D();
		move_D();
		moveFRURiUiFi();
	} else if (
		cubePattern[7][5] === cubePattern[7][4] &&
		cubePattern[6][4] === cubePattern[7][4]
	) {
		move_D_prime();
		moveFRURiUiFi();
	}

	if (
		cubePattern[7][3] === cubePattern[7][4] &&
		cubePattern[7][5] === cubePattern[7][4] &&
		cubePattern[6][4] === cubePattern[7][4] &&
		cubePattern[8][4] === cubePattern[7][4]
	) {
		console.log('Got Yellow Cross.');
	} else if (
		cubePattern[7][3] === cubePattern[7][4] &&
		cubePattern[7][5] === cubePattern[7][4]
	) {
		console.log('Horizontal Yellow Line');
		moveFRURiUiFi();
	} else if (
		cubePattern[6][4] === cubePattern[7][4] &&
		cubePattern[8][4] === cubePattern[7][4]
	) {
		console.log('Vertical Yellow Line');
		move_D();
		moveFRURiUiFi();
	}
}

function positionBottomLayerEdges() {
	let edgeMatchForYellowPositioning = false;

	do {
		if (
			cubePattern[5][1] === cubePattern[4][7] &&
			cubePattern[5][7] === cubePattern[4][1]
		) {
			move_D();
			move_D();
		}

		if (
			cubePattern[5][4] === cubePattern[4][1] &&
			cubePattern[5][10] === cubePattern[4][7]
		) {
			move_D_prime();
		}

		if (
			cubePattern[5][4] === cubePattern[4][7] &&
			cubePattern[5][10] === cubePattern[4][1]
		) {
			move_D();
		}

		// matching edges in line OR
		if (
			cubePattern[5][1] === cubePattern[4][1] &&
			cubePattern[5][7] === cubePattern[4][7]
		) {
			move_F();
			move_D();
			move_D();
			move_F_prime();
			move_D_prime();
			move_F();
			move_D_prime();
			move_F_prime();
			move_D_prime();
		}

		if (
			cubePattern[5][1] === cubePattern[4][1] &&
			cubePattern[5][10] === cubePattern[4][10]
		) {
			edgeMatchForYellowPositioning = true;
			move_F();
			move_D();
			move_D();
			move_F_prime();
			move_D_prime();
			move_F();
			move_D_prime();
			move_F_prime();
			move_D_prime();
		} else if (
			cubePattern[5][1] === cubePattern[4][1] &&
			cubePattern[5][4] === cubePattern[4][4]
		) {
			edgeMatchForYellowPositioning = true;
			move_R();
			move_D();
			move_D();
			move_R_prime();
			move_D_prime();
			move_R();
			move_D_prime();
			move_R_prime();
			move_D_prime();
		} else if (
			cubePattern[5][4] === cubePattern[4][4] &&
			cubePattern[5][7] === cubePattern[4][7]
		) {
			edgeMatchForYellowPositioning = true;
			move_B();
			move_D();
			move_D();
			move_B_prime();
			move_D_prime();
			move_B();
			move_D_prime();
			move_B_prime();
			move_D_prime();
		} else if (
			cubePattern[5][7] === cubePattern[4][7] &&
			cubePattern[5][10] === cubePattern[4][10]
		) {
			edgeMatchForYellowPositioning = true;
			move_L();
			move_D();
			move_D();
			move_L_prime();
			move_D_prime();
			move_L();
			move_D_prime();
			move_L_prime();
			move_D_prime();
		}

		if (!edgeMatchForYellowPositioning) {
			move_D();
		}
	} while (!edgeMatchForYellowPositioning);
}

// checking if bottom layer corners are already solved
function checkBottomLayerCorners() {
	if (
		cubePattern[5][2] === cubePattern[4][1] &&
		cubePattern[5][3] === cubePattern[4][4] &&
		cubePattern[5][5] === cubePattern[4][4] &&
		cubePattern[5][6] === cubePattern[4][7] &&
		cubePattern[5][8] === cubePattern[4][7] &&
		cubePattern[5][9] === cubePattern[4][10] &&
		cubePattern[5][11] === cubePattern[4][10] &&
		cubePattern[5][0] === cubePattern[4][1]
	) {
		bottomLayerCornersSolved = true;
	} else {
		bottomLayerCornersSolved = false;
	}
}

// checking if bottom layer corner pieces are in their position
function checkBottomLayerCornerPiecePosition() {
	// OGY corner
	if (
		(cubePattern[5][2] === cubePattern[4][1] &&
			cubePattern[5][3] === cubePattern[4][4] &&
			cubePattern[6][3] === cubePattern[7][4]) ||
		(cubePattern[5][2] === cubePattern[7][4] &&
			cubePattern[5][3] === cubePattern[4][1] &&
			cubePattern[6][3] === cubePattern[4][4]) ||
		(cubePattern[5][2] === cubePattern[4][4] &&
			cubePattern[5][3] === cubePattern[7][4] &&
			cubePattern[6][3] === cubePattern[4][1])
	) {
		corner_OGY_inPosition = true;
		console.log('OGY corner in position.');
	} else {
		corner_OGY_inPosition = false;
	}

	// GRY corner
	if (
		(cubePattern[5][5] === cubePattern[4][4] &&
			cubePattern[5][6] === cubePattern[4][7] &&
			cubePattern[6][5] === cubePattern[7][4]) ||
		(cubePattern[5][5] === cubePattern[7][4] &&
			cubePattern[5][6] === cubePattern[4][4] &&
			cubePattern[6][5] === cubePattern[4][7]) ||
		(cubePattern[5][5] === cubePattern[4][7] &&
			cubePattern[5][6] === cubePattern[7][4] &&
			cubePattern[6][5] === cubePattern[4][4])
	) {
		corner_GRY_inPosition = true;
		console.log('GRY corner in position.');
	} else {
		corner_GRY_inPosition = false;
	}

	// RBY corner
	if (
		(cubePattern[5][8] === cubePattern[4][7] &&
			cubePattern[5][9] === cubePattern[4][10] &&
			cubePattern[8][5] === cubePattern[7][4]) ||
		(cubePattern[5][8] === cubePattern[7][4] &&
			cubePattern[5][9] === cubePattern[4][7] &&
			cubePattern[8][5] === cubePattern[4][10]) ||
		(cubePattern[5][8] === cubePattern[4][10] &&
			cubePattern[5][9] === cubePattern[7][4] &&
			cubePattern[8][5] === cubePattern[4][7])
	) {
		corner_RBY_inPosition = true;
		console.log('RBY corner in position.');
	} else {
		corner_RBY_inPosition = false;
	}

	// BOY corner
	if (
		(cubePattern[5][11] === cubePattern[4][10] &&
			cubePattern[5][0] === cubePattern[4][1] &&
			cubePattern[8][3] === cubePattern[7][4]) ||
		(cubePattern[5][11] === cubePattern[7][4] &&
			cubePattern[5][0] === cubePattern[4][10] &&
			cubePattern[8][3] === cubePattern[4][1]) ||
		(cubePattern[5][11] === cubePattern[4][1] &&
			cubePattern[5][0] === cubePattern[7][4] &&
			cubePattern[8][3] === cubePattern[4][10])
	) {
		corner_BOY_inPosition = true;
		console.log('BOY corner in position.');
	} else {
		corner_BOY_inPosition = false;
	}
}

// function to get the bottom layer corner pieces in position
function getBottomLayerCornersInPosition() {
	checkBottomLayerCornerPiecePosition();

	do {
		if (
			!corner_OGY_inPosition &&
			!corner_GRY_inPosition &&
			!corner_RBY_inPosition &&
			!corner_BOY_inPosition
		) {
			console.log('No piece in position.');
			move_R_prime();
			move_D();
			move_L();
			move_D_prime();
			move_R();
			move_D();
			move_L_prime();
			move_D_prime();
		}

		checkBottomLayerCornerPiecePosition();

		if (corner_OGY_inPosition) {
			move_R_prime();
			move_D();
			move_L();
			move_D_prime();
			move_R();
			move_D();
			move_L_prime();
			move_D_prime();
		} else if (corner_GRY_inPosition) {
			move_B_prime();
			move_D();
			move_F();
			move_D_prime();
			move_B();
			move_D();
			move_F_prime();
			move_D_prime();
		} else if (corner_RBY_inPosition) {
			move_L_prime();
			move_D();
			move_R();
			move_D_prime();
			move_L();
			move_D();
			move_R_prime();
			move_D_prime();
		} else if (corner_BOY_inPosition) {
			move_F_prime();
			move_D();
			move_B();
			move_D_prime();
			move_F();
			move_D();
			move_B_prime();
			move_D_prime();
		}

		checkBottomLayerCornerPiecePosition();
	} while (
		!corner_OGY_inPosition ||
		!corner_GRY_inPosition ||
		!corner_RBY_inPosition ||
		!corner_BOY_inPosition
	);
}

// fix the color orientation of the bottom layer corner pieces
function fixBottomLayerCorners() {
	// fix corners
	if (
		(cubePattern[5][2] === cubePattern[7][4] &&
			cubePattern[5][3] === cubePattern[4][1] &&
			cubePattern[6][3] === cubePattern[4][4]) ||
		(cubePattern[5][2] === cubePattern[4][4] &&
			cubePattern[5][3] === cubePattern[7][4] &&
			cubePattern[6][3] === cubePattern[4][1])
	) {
		do {
			do {
				move_L_prime();
				move_U_prime();
				move_L();
				move_U();
			} while (
				cubePattern[5][2] !== cubePattern[5][1] ||
				cubePattern[5][3] !== cubePattern[5][4]
			);

			checkBottomLayerCorners();

			if (!bottomLayerCornersSolved) {
				move_D();
			}
		} while (!bottomLayerCornersSolved);
	} else if (
		(cubePattern[5][5] === cubePattern[7][4] &&
			cubePattern[5][6] === cubePattern[4][4] &&
			cubePattern[6][5] === cubePattern[4][7]) ||
		(cubePattern[5][5] === cubePattern[4][7] &&
			cubePattern[5][6] === cubePattern[7][4] &&
			cubePattern[6][5] === cubePattern[4][4])
	) {
		do {
			do {
				move_F_prime();
				move_U_prime();
				move_F();
				move_U();
			} while (
				cubePattern[5][5] !== cubePattern[5][4] ||
				cubePattern[5][6] !== cubePattern[5][7]
			);

			checkBottomLayerCorners();

			if (!bottomLayerCornersSolved) {
				move_D();
			}
		} while (!bottomLayerCornersSolved);
	} else if (
		(cubePattern[5][8] === cubePattern[7][4] &&
			cubePattern[5][9] === cubePattern[4][7] &&
			cubePattern[8][5] === cubePattern[4][10]) ||
		(cubePattern[5][8] === cubePattern[4][10] &&
			cubePattern[5][9] === cubePattern[7][4] &&
			cubePattern[8][5] === cubePattern[4][7])
	) {
		do {
			do {
				move_R_prime();
				move_U_prime();
				move_R();
				move_U();
			} while (
				cubePattern[5][8] !== cubePattern[5][7] ||
				cubePattern[5][9] !== cubePattern[5][10]
			);

			checkBottomLayerCorners();

			if (!bottomLayerCornersSolved) {
				move_D();
			}
		} while (!bottomLayerCornersSolved);
	} else if (
		(cubePattern[5][11] === cubePattern[7][4] &&
			cubePattern[5][0] === cubePattern[4][10] &&
			cubePattern[8][3] === cubePattern[4][1]) ||
		(cubePattern[5][11] === cubePattern[4][1] &&
			cubePattern[5][0] === cubePattern[7][4] &&
			cubePattern[8][3] === cubePattern[4][10])
	) {
		do {
			do {
				move_B_prime();
				move_U_prime();
				move_B();
				move_U();
			} while (
				cubePattern[5][11] !== cubePattern[5][10] ||
				cubePattern[5][0] !== cubePattern[5][1]
			);

			checkBottomLayerCorners();

			if (!bottomLayerCornersSolved) {
				move_D();
			}
		} while (!bottomLayerCornersSolved);
	}
}

/*
 **	bottom layer solver
 */
function solveBottomLayer() {
	// check for yellow cross
	if (
		cubePattern[7][3] === cubePattern[7][4] &&
		cubePattern[7][5] === cubePattern[7][4] &&
		cubePattern[6][4] === cubePattern[7][4] &&
		cubePattern[8][4] === cubePattern[7][4]
	) {
		console.log('Already a Yellow Cross.');
	} else {
		console.log('Needs a Yellow Cross.');
		getYellowCross();
	}

	// position bottom layer edges
	if (
		cubePattern[5][1] === cubePattern[4][1] &&
		cubePattern[5][4] === cubePattern[4][4] &&
		cubePattern[5][7] === cubePattern[4][7] &&
		cubePattern[5][10] === cubePattern[4][10]
	) {
		console.log('Bottom Layer Edges in position.');
	} else {
		console.log('Get Bottom Layer Edges in position.');
		positionBottomLayerEdges();
	}

	// orient bottom layer corners
	checkBottomLayerCorners();

	if (bottomLayerCornersSolved) {
		console.log('Corners are in position.');
	} else {
		console.log('Get Bottom Layer corner pieces in position.');

		// get bottom layer corners on their position
		getBottomLayerCornersInPosition();

		checkBottomLayerCorners();

		if (!bottomLayerCornersSolved) {
			// fix bottom layer corners
			console.log('Bottom Layer Corners to be fixed.');
			fixBottomLayerCorners();
		}
	}
}

// ----------------------------------------
// ----------------------------------------

// cube state check
function cubeStateCheck() {
	if (
		// white center
		cubePattern[0][3] === cubePattern[1][4] &&
		cubePattern[0][4] === cubePattern[1][4] &&
		cubePattern[0][5] === cubePattern[1][4] &&
		cubePattern[1][3] === cubePattern[1][4] &&
		cubePattern[1][4] === cubePattern[1][4] &&
		cubePattern[1][5] === cubePattern[1][4] &&
		cubePattern[2][3] === cubePattern[1][4] &&
		cubePattern[2][4] === cubePattern[1][4] &&
		cubePattern[2][5] === cubePattern[1][4] &&
		// orange center
		cubePattern[3][0] === cubePattern[4][1] &&
		cubePattern[3][1] === cubePattern[4][1] &&
		cubePattern[3][2] === cubePattern[4][1] &&
		cubePattern[4][0] === cubePattern[4][1] &&
		cubePattern[4][1] === cubePattern[4][1] &&
		cubePattern[4][2] === cubePattern[4][1] &&
		cubePattern[5][0] === cubePattern[4][1] &&
		cubePattern[5][1] === cubePattern[4][1] &&
		cubePattern[5][2] === cubePattern[4][1] &&
		// green center
		cubePattern[3][3] === cubePattern[4][4] &&
		cubePattern[3][4] === cubePattern[4][4] &&
		cubePattern[3][5] === cubePattern[4][4] &&
		cubePattern[4][3] === cubePattern[4][4] &&
		cubePattern[4][4] === cubePattern[4][4] &&
		cubePattern[4][5] === cubePattern[4][4] &&
		cubePattern[5][3] === cubePattern[4][4] &&
		cubePattern[5][4] === cubePattern[4][4] &&
		cubePattern[5][5] === cubePattern[4][4] &&
		// red center
		cubePattern[3][6] === cubePattern[4][7] &&
		cubePattern[3][7] === cubePattern[4][7] &&
		cubePattern[3][8] === cubePattern[4][7] &&
		cubePattern[4][6] === cubePattern[4][7] &&
		cubePattern[4][7] === cubePattern[4][7] &&
		cubePattern[4][8] === cubePattern[4][7] &&
		cubePattern[5][6] === cubePattern[4][7] &&
		cubePattern[5][7] === cubePattern[4][7] &&
		cubePattern[5][8] === cubePattern[4][7] &&
		// blue center
		cubePattern[3][9] === cubePattern[4][10] &&
		cubePattern[3][10] === cubePattern[4][10] &&
		cubePattern[3][11] === cubePattern[4][10] &&
		cubePattern[4][9] === cubePattern[4][10] &&
		cubePattern[4][10] === cubePattern[4][10] &&
		cubePattern[4][11] === cubePattern[4][10] &&
		cubePattern[5][9] === cubePattern[4][10] &&
		cubePattern[5][10] === cubePattern[4][10] &&
		cubePattern[5][11] === cubePattern[4][10] &&
		// yellow center
		cubePattern[6][3] === cubePattern[7][4] &&
		cubePattern[6][4] === cubePattern[7][4] &&
		cubePattern[6][5] === cubePattern[7][4] &&
		cubePattern[7][3] === cubePattern[7][4] &&
		cubePattern[7][4] === cubePattern[7][4] &&
		cubePattern[7][5] === cubePattern[7][4] &&
		cubePattern[8][3] === cubePattern[7][4] &&
		cubePattern[8][4] === cubePattern[7][4] &&
		cubePattern[8][5] === cubePattern[7][4]
	) {
		alreadySolved = true;
		console.log('Cube already Solved!');
	} else {
		alreadySolved = false;
		console.log('Cube need to be Solved!');
	}
}

/*
 **	the main cube solver function
 */
function solve() {
	storeScrambledCube();
	getCubeFromInput(inputCubePattern);
	getCubePattern(cube);
	// validateCubePattern();
	cubeStateCheck();

	if (patternValid) {
		if (!alreadySolved) {
			move = 0;
			movements = [];

			console.log("Let's solve the Cube!");
			getCubePattern(cube);

			// top layer
			solveTopLayer();

			// middle layer
			solveMiddleLayer();

			// bottom layer
			solveBottomLayer();

			getMovements();

			resultsSection.style.display = 'initial';

			stepsViewer();

			cubeStateCheck();
			if (!alreadySolved) {
				alert('Invalid Cube Pattern.');
			}
		}
	}
}
