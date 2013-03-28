//TODO: Fix keys from not have a quick response time by manually make a queue.
//TODO: Get the sovler to attempt to make an educated guess on the correct path based on direction of target.
var cellSize = 40; //TODO: FIGURE out how in the world large cell size means slower llops. Would this be longer drawing times?
var numRows = 400 /cellSize;
var numCols = 800/cellSize;

//speeds
window.generatorCellsPerMinute = 100;
window.solverCellsPerMinute = 50;

var generatorTickTime = new Date();
var solverTickTime = new Date();

//colors
window.backgroundColor = [50, 50, 50];
window.mazeColor = [255,255,255];
window.activeColor = [255, 0, 0];
window.emptyColor = [0,0,0];
window.potentialColor = [0,170,200];
//fill colors
window.visitedFillColor = [70,170,200];
window.backtrackedFillColor = [200,200,23];

window.cells = [];
window.solverCells = 0;


var curRow;
var curCol;
// an array of cells adjacent to a used cell, that can be potentially populated.
var potentialCells;
//set player position to the starting point. Multiply by 2 because cells are doubel space and player can go between on 'bridges'.
var playerPos;

function setterupper(processing){
    processing.setup = function() {
    processing.size(1000,600); //size must be first line.
    processing.frameRate(1000);
    
    resetMaze();
    processing.background(backgroundColor[0],backgroundColor[1],backgroundColor[2]);
    processing.noStroke();
    initGrid(processing, window.cells);
    window.solverCells = [[curRow,curCol, 0, 1]];
	};
}
var programState = "gen";
var addCell;
function sketchProc(processing) {
    // Override draw function, by default it will be called 60 times per second
	processing.draw = function() {
        
        //generator
        addCell = new Date() - generatorTickTime > 6000/window.generatorCellsPerMinute;
        if(programState === "gen" && addCell) //there are 6000 milliseconds in a minute
        {
            programState = addRandomCell()?"gen":"solve"; // draw a cell at a constant rate.
            generatorTickTime = new Date(); // then refresh tick time.
        }
        
        // solver
        addCell = new Date() - solverTickTime > 6000/window.solverCellsPerMinute;
        if(programState === "solve" && addCell){
            programState = solver2(window.solverCells)?"gen":"solve";
            solverTickTime = new Date(); // then refresh tick time.
            
            if(programState === "gen"){
                resetMaze();
            }
        }
        
        // draw the draw time.
        processing.textSize(20);
        processing.fill(100,100,100);
        processing.rect(100,435,100,80);
        processing.fill(255,255,255);
        processing.text(avgCellDrawTime*1000, 100, 450);
        processing.text(runTime, 100, 480);
        
	};
	setterupper(processing);
    processing.keyPressed = function() {
        if (processing.keyCode === processing.UP) {
            movePlayer(1);
        }
        else if (processing.keyCode === processing.RIGHT) {
            movePlayer(2);
        } 
        else if (processing.keyCode === processing.DOWN) {
            movePlayer(3);
        }
        else if (processing.keyCode === processing.LEFT) {
            movePlayer(4);
        }
    };
}