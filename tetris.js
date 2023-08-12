// creating all needed variables
let canvas;
let context;
let gameBoardArrayHeigh = 20;
let gameBoardArrayWidht = 12;
let startX=4;
let startY=0;

// Used as a look up table, where each value in the array
// contains the x and y position we can use to draw the
// box on the canvas
let coordinateArray=[...Array(gameBoardArrayHeigh)].map(e => Array(gameBoardArrayWidht).fill(0));
let currentTetromino = [ [1,0], [0,1], [1,1], [2,1] ];


const txtColor = 'rgb(69,69,69)';
const backgroundColor = 'rgb(80,160,96)'

let score = 0;
let points = 10;
let level = 1;
let levelrequirement= 20;
let speed = 1;
let pause = true;
let winOrLose = 'Playing';
let tetrisLogo;

const pauseMessageElement = document.getElementById('pauseMessage');
const pauseMessageTextElement = document.querySelector('[data-pause-message-text]')


let tetrominos = [];
let tetrominoColor = ['purple', 'yellowgreen' , 'orange' , 'red' , 'darkgreen' , '#f444' , '#f76']
let currentTetrominoColor;
//reate gameboard array so we know where other squares are
let gameBoardArray=[...Array(gameBoardArrayHeigh)].map(e => Array(gameBoardArrayWidht).fill(0));
// array to store stopped shapes
// it holds colors when shape stops and added
let StoppedShapeArray = [...Array(gameBoardArrayHeigh)].map(e => Array(gameBoardArrayWidht).fill(0));
// direction to control tetrominos
let DIRECTION = {
	IDLE: 0,
	DOWM: 1,
	LEFT: 2,
	RIGHT:3 
};

// all keys for plaing
let KEYS = {
    LEFT: 65,
    RIGHT: 68,
    DOWN: 83,
    ROTATE: 87,
    PAUSE: 32
}


class Coordinates {
	constructor(x,y){
		this.x = x;
		this.y = y
	}
}

// setup canvas when page looded
document.addEventListener('DOMContentLoaded', SetupCanvas);

// Creates the array with square coordinates
function CreateCoordinateArray() {

	let i = 0, j = 0;

	for (let y =9; y  <= 446; y+=23){
		for (let x = 11; x<=264; x+=23){
			coordinateArray[i][j] = new Coordinates(x,y);
			i++;

		}
		j++;
		i=0;
	}

}



function SetupCanvas(){

// paint all information for plaing
	canvas = document.getElementById('my-canvas')
	context = canvas.getContext('2d')

	canvas.width=936;
	canvas.height=956;

	context.scale(2,2);

	context.fillStyle = backgroundColor;
	context.fillRect(0,0, canvas.width , canvas.height);

	context.strokeStyle = txtColor
	context.strokeRect( 8,8,280,462);


	tetrisLogo = new Image(649, 427 ) // original 1015, 635
	tetrisLogo.onload = DrawTetrisLogo;
	tetrisLogo.src = "image/chlogo.png"

	context.fillStyle = txtColor;
	context.font = '21px Arial';
	context.fillText('SCORE', 300 , 98);
	context.strokeRect(300,107,161,24);
	context.fillText(score.toString(), 310, 127);

	context.fillText('LEVEL', 300, 160)
	context.strokeRect(300, 171, 161, 24);
	context.fillText(level.toString(), 310, 190);

	context.fillText('WIN / LOSE', 300 ,221);
	context.fillText(winOrLose, 310 , 261);
	context.strokeRect(300, 232, 161, 80);

    context.fillText("CONTROLS", 300, 335);
    context.strokeRect(300, 341, 160, 129);
    context.font = '19px Arial';
    context.fillText("A: Move Left", 305, 363);
    context.fillText("D: Move Right", 305, 388);
    context.fillText("S: Move Down", 305, 413);
    context.fillText("W: Rotate Right", 305, 438);
    context.fillText("SPACE: Pause", 305, 463);

// check for key presses
	document.addEventListener('keydown',HandleKeyPress);

// creating tetrominos and game board
	CreateTetrominos();
	CreateTetromino()

	CreateCoordinateArray();

// starting game
	DrawTetromino();

}


function DrawTetromino(){
	// Cycle through the x and y array for the tetromino 
    // looking for all the places a square would be drawn

	for (let i = 0; i < currentTetromino.length; i++){
		let x = currentTetromino[i][0] + startX;
		let y = currentTetromino[i][1] + startY;

// Put Tetromino shape in the gameboard array
		gameBoardArray[x][y] =  1;

// taking x and y from look up table
		let coordinateX = coordinateArray[x][y].x;
		let coordinateY = coordinateArray[x][y].y;
// drawin oir tetromino
		context.fillStyle = currentTetrominoColor;
		context.fillRect(coordinateX, coordinateY, 21, 21);

	}
}


// function to check for keys and move tetrominos
// drawing tetromino on nwe position and delete old tetromnio
function HandleKeyPress(key){
	if (winOrLose != 'Game Over'){

		if (key.keyCode === KEYS.LEFT && !pause){
			direction = DIRECTION.LEFT;
// check for hitting the wall or floor
			if (!HittingTheWall() && !CheckForHorizontalCollision()){
				DeleteTetromino();
				startX--;
				DrawTetromino();
			}


		} else if (key.keyCode === KEYS.RIGHT && !pause){
			direction = DIRECTION.RIGHT;
// check for hitting the wall or floor
			if (!HittingTheWall() && !CheckForHorizontalCollision()){
				DeleteTetromino();
				startX++;
				DrawTetromino();
			}
			

		} else if (key.keyCode === KEYS.DOWN && !pause) {
			MoveTetrominoDown();

		} else if (key.keyCode === KEYS.ROTATE && !pause){
			RotateTetromino();

		} else if (key.keyCode === KEYS.PAUSE) {
			pause = !pause;

			PauseMenuShow();
		}
	}
	
}


// move tetromino down
function MoveTetrominoDown(){
// indicate our direction
	direction = DIRECTION.DOWN;

	// cheking for collision
	if(!CheckForVerticalCollision()){
		DeleteTetromino();
		startY++;
		DrawTetromino();
	}

}

// run our game
setSpeed(speed);

// delete old tetromino and create new
// also return background color on old tetromino place
function DeleteTetromino(){
	for (let i = 0; i < currentTetromino.length ; i++){
		let x = currentTetromino[i][0]+startX;
		let y = currentTetromino[i][1]+startY;

// deleting tetromino from game board arrey
		gameBoardArray[x][y] = 0;

// return background to it color
		let coordinateX = coordinateArray[x][y].x;
		let coordinateY = coordinateArray[x][y].y;

		context.fillStyle = backgroundColor;
		context.fillRect(coordinateX, coordinateY, 21, 21)


	}
}

// generate all kind of tetrominos
function CreateTetrominos(){
	// // T
	// tetrominos.push([[1,0], [0,1], [1,1] , [2,1]])
	// I
	tetrominos.push([[0,0], [1,0], [2,0] , [3,0]])
	// // J
	// tetrominos.push([[0,0], [0,1], [1,1] , [2,1]])
	// // Square
	// tetrominos.push([[0,0], [1,0], [0,1] , [1,1]])
	// // L
	// tetrominos.push([[2,0], [0,1], [1,1] , [2,1]])
	// // S
	// tetrominos.push([[1,0], [2,0], [0,1] , [1,1]])
	// // Z
	// tetrominos.push([[0,0], [1,0], [1,1] , [2,1]])

}

// creating random tetromino and choose it color
function CreateTetromino(){
	let randomTetramino = Math.floor(Math.random()* tetrominos.length);
	currentTetromino = tetrominos[randomTetramino];
	randomTetramino = Math.floor(Math.random()* tetrominos.length);
	currentTetrominoColor = tetrominoColor[randomTetramino];
}


// checking for wall hit. Chekking all squares of tetramino
// direction that would be off the board stop movement
function HittingTheWall(){

	for (let i = 0; i < currentTetromino.length; i++){
		let newX = currentTetromino[i][0]+startX;

		if (newX <= 0 && direction === DIRECTION.LEFT) {
			return true;
		} else if ( newX >= 11 && direction === DIRECTION.RIGHT) {
			return true;
		}
	}

	return false;
}


function DrawTetrisLogo(){
	context.drawImage(tetrisLogo, 314,8, 128, 64);
}


function CheckForVerticalCollision(){
// making a copy of the tetromino, so that we can move fake one
// and check for collisipn before moving original 
	let tetrominoCopy = currentTetromino;
	let collision = false;

// cheking all tetramino squares
	for (let i = 0; i< tetrominoCopy.length; i++){

// adjust the square position so we can check for collisions
		let square = tetrominoCopy[i];
		let x = square[0] + startX;
		let y = square[1] + startY;
// when mowing down
		if (direction === DIRECTION.DOWN) {
			y++;
		}
// cheking that we hit stoppeds hape arrey(we have color at the end)
		if (typeof StoppedShapeArray[x][y+1] === 'string'){
// if true then we draw original tetromino except BU
			DeleteTetromino();
			startY++;
			DrawTetromino();
			collision = true;
			break
		}

		if (y >= 20) {
			collision = true;
			break
		}
	}


	if (collision) {
		if (startY <= 2){
// check for end of the game and show result(if ended)
			winOrLose = 'Game Over';
			context.fillStyle = 'red';
			context.fillRect(310, 242 ,140 , 30);
			context.fillStyle = txtColor;
			context.fillText(winOrLose, 310 , 261)

		} else {
// added stopped tetromino and it color for stopped shape array
			for (let i= 0 ; i < tetrominoCopy.length; i++){
				let square  = tetrominoCopy[i];
				let x = square[0] + startX;
				let y = square[1] + startY;
				StoppedShapeArray[x][y] = currentTetrominoColor;
			}

// cheking for completed rows and creating new tetromino
			CheckForCompletedRows();
			CreateTetromino();
			direction = DIRECTION.IDLE;
			startY = 0;
			startX = 4;

			DrawTetromino();

		
		}	
	}
}


function CheckForHorizontalCollision(){
// same as verticl collision
	var tetrominoCopy = currentTetromino;
	var collision=false;

	for (var i = 0; i< tetrominoCopy.length; i++){

		var square = tetrominoCopy[i];
		var  x = square[0] + startX;
		var y = square[1] + startY;
// move relying on direction
 		if (direction === DIRECTION.LEFT){
			x--;

		} else if(direction === DIRECTION.RIGHT){
			x++;
		}
// cheking for stopped shape
		var stoppedShapeValue = StoppedShapeArray[x][y];

		if(typeof stoppedShapeValue === 'string'){
			collision = true;
			break;
		}
	}

	return collision;
}


function CheckForCompletedRows(){
// from what and what we want to delete
	let rowsToDelete = 0;
	let startOfDeletion = 0;

// check every row
	for (let y  = 0; y < gameBoardArrayHeigh; y++ ){
		let completed = true

		for (let x = 0; x < gameBoardArrayWidht; x++ ){
// cycle all stopped sheps
			let square = StoppedShapeArray[x][y];

			if ( square === 0 || (typeof square === 'undefined')){
// if at leat 1 square absent we jump out
				completed = false;
				break;
			}
		}
// here we delete all completed rows
		if (completed) {

			if (startOfDeletion === 0) {
				startOfDeletion = y;
			}
			rowsToDelete++;

			for ( let  i= 0; i < gameBoardArrayWidht; i++){
// Update the arrays by deleting previous squares
				StoppedShapeArray[i][y] = 0;
				gameBoardArray[i][y] = 0

				let coordinateX = coordinateArray[i][y].x;
				let coordinateY = coordinateArray[i][y].y;
// fill background color from deleted squuares
				context.fillStyle = backgroundColor;
				context.fillRect(coordinateX, coordinateY , 21, 21);
			}
		}
	}

	if (rowsToDelete > 0){

		if (rowsToDelete < 4) {
			score += (points*rowsToDelete);
			UpdateScore(score);
			MoveAllRowsDown(rowsToDelete, startOfDeletion);

		} else if (rowsToDelete < 8){
			score+= (points*2*rowsToDelete);
			UpdateScore(score);
			MoveAllRowsDown(rowsToDelete, startOfDeletion);

		} else if (rowsToDelete < 12){
			score += (points*3*rowsToDelete);
			UpdateScore(score);
			MoveAllRowsDown(rowsToDelete, startOfDeletion);

		} else if (rowsToDelete < 16){
			score += (points*4*rowsToDelete);
			UpdateScore(score);
			MoveAllRowsDown(rowsToDelete, startOfDeletion);

		} else if (rowsToDelete >= 16){
			score += (points*10*rowsToDelete);
			UpdateScore(score);
			MoveAllRowsDown(rowsToDelete, startOfDeletion);

		}

	}

}

// update score, level and speed
function UpdateScore(score){
	context.fillStyle = backgroundColor;
	context.fillRect(310,109,140,19);
	context.fillStyle = txtColor;
	context.fillText(score.toString(), 310 , 127);
	
// rise dificult if we have enough points
	if (score >= levelrequirement) {
	speed++;
	level++;
	levelrequirement*=2

	    
	context.fillStyle = backgroundColor;
	context.fillRect(310, 174, 140, 19);
	context.fillStyle = txtColor;
	context.fillText(level.toString(), 310, 190);
	clearInterval(timer);
    setSpeed(speed);
	}
}


// moving rows down after deletion
function MoveAllRowsDown(rowsToDelete, startOfDeletion) { 


	for ( var i = (startOfDeletion - 1); i >= 0; i--){

		for (var x = 0; x < gameBoardArrayWidht; x++ ){
			var y2 = i + rowsToDelete;
			var square = StoppedShapeArray[x][i];
			var nextSquare = StoppedShapeArray[x][y2];

			if (typeof square === 'string'){
				nextSquare = square;
				gameBoardArray[x][y2] = 1;
				StoppedShapeArray[x][y2] = square;

				let coordinateX = coordinateArray[x][y2].x;
				let coordinateY = coordinateArray[x][y2].y;

				context.fillStyle = nextSquare;
				context.fillRect(coordinateX, coordinateY , 21, 21);

				square =  0;
				gameBoardArray[x][i] = 0;
				StoppedShapeArray[x][i] = 0;

				coordinateX = coordinateArray[x][i].x;
				coordinateY = coordinateArray[x][i].y;

				context.fillStyle = backgroundColor;
				context.fillRect(coordinateX, coordinateY , 21, 21);


			}
		}
	}
}


function RotateTetromino(){
// same as collision
	let newRotation = new Array();

	
	let tetrominoCopy = currentTetromino;
	let currentTetrominoBU;

	for (let i = 0; i < tetrominoCopy.length; i++){
		currentTetrominoBU = [...currentTetromino];
		

		let x = tetrominoCopy[i][0];
		let y = tetrominoCopy[i][1];
		let newX = (GetLastSquareX() - y);
		let newY = x;

		newRotation.push([newX, newY]);
	}

	DeleteTetromino();
// trying to draw new teromino
	try{
		currentTetromino = newRotation;
		DrawTetromino();
	}
	// if we have error draw BU copy
	catch(e){
		if (e instanceof TypeError){
			currentTetromino = currentTetrominoBU;
			DeleteTetromino();
			DrawTetromino();
		}
	}
}


// Gets the x value for the last square in the Tetromino
// so we can orientate all other squares using that
function GetLastSquareX(){
	let lastX = 0;
	for ( let i = 0; i < currentTetromino.length; i++){
		let square = currentTetromino[i];

		if (square[0]  > lastX){
			lastX = square[0];
		}
	}
	return lastX;
}



// set speed for increasing difficulty lvl
function setSpeed(speed) {
    timer = window.setInterval(() => {
        if (!pause) {
            if (winOrLose != "Game Over") {
                MoveTetrominoDown();
            }
        }
    }, 1000 / speed);

    console.log(speed);
}


function PauseMenuShow(){

	if (pause){
		pauseMessageTextElement.innerText = 'PAUSE \nPRESS SPACE TO PLAY';
		pauseMessageElement.classList.add('show');
	} else if (!pause) {
		pauseMessageElement.classList.remove('show');
	}
}
























