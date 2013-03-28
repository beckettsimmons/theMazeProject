/*
        Cell State Convention:
    -1 empty bridge
    0 is empty maze
    1 is used in maze
    2 is active maze cell
    3 is bridge
    4 is potential cell
*/

//TODO: Why is curRow and Col a global variable? Fix it!
function Cell(state){
    this.state = state;
    this.visited = "none";
}

function resetMaze(){
    
    
    // reset all cells to default values
    for (var row_ = 0; row_ < numRows; row_ += 1) {
        window.cells[row_] = [];
        for (var col_ = 0; col_ < numCols; col_ += 1) {
            if(col_ %2===1 && row_%2===1) //if odd row and column make empty maze
                { window.cells[row_][col_] = new Cell(0);}
            else {window.cells[row_][col_] = new Cell(-1);}
            
        }
    }
    curRow = Math.random()*numRows-1;
    curCol = Math.random()*numCols-1;
    curRow = Math.floor(curRow);
    curCol = Math.floor(curCol);
    //ensure that thestarting row anc col are on odd odd spots
    curRow = (curRow%2===1)?curRow:curRow-1;
    curCol = (curCol%2===1)?curCol:curCol-1;
    // if -1 (out of range) set it to 1
    curRow = (curRow<=-1)?1:curRow;
    curCol = (curCol<=-1)?1:curCol;
    
    console.log(curRow, curCol);
    window.cells[curRow][curCol] = 1;
    // an array of cells adjacent to a used cell, that can be potentially populated.
    potentialCells= getNeighbors(curRow, curCol);
    
    //set player position to the starting point. Multiply by 2 because cells are doubel space and player can go between on 'bridges'.
    playerPos = [curRow, curCol];
    //re draw the background
    redrawBackground();
    //re init the grid to earease previouse stuff
    initGrid();
    // reseting the maze solver array of past positions.
    window.solverCells = [[curRow,curCol, 0, 1]];
}

// returns a bool value
function isInBounds(row, col){
    //unsing ternary operator to reverse the value.
    return (row< 0 || col< 0 || row>= numRows || col>= numCols)?false:true;
}
function isInMaze(row, col) {
    if (!isInBounds(row, col)) { // if point isn't in boudns it won't be in maze.
        return false;
    }
    return (window.cells[row][col].state !== 1);
}

//reutrns a list of empty cells that verticalaly and horizontally (not diagonally) next to specified
function getNeighbors(row, col) {
    var neighbors = [];
    var s = 2; //the seperation of the main cells
    if (isInMaze(row, col - s)) {
        neighbors.push([[row, col], [row, col - s]]);
    }
    if (isInMaze(row - s, col)) {
        neighbors.push([[row, col], [row - s, col]]);
    }
    if (isInMaze(row, col + s)) {
        neighbors.push([[row, col], [row, col + s]]);
    }
    if (isInMaze(row + s, col)) {
        neighbors.push([[row, col], [row + s, col]]);
    }
    
    return neighbors;
}
//TDOD: MAke this function a bit more pretty and readable.
var avgCellDrawTime = 0;
var startTime;
var runTime = 0;
function drawCustomCell(row,  col, state, visited, reset) {
    startTime = new Date();
    
    processing = Processing.getInstanceById('targetcanvas');
    //quto set reset to false, reset is true if the grid is being reset and to draw brdiges.
    reset = typeof reset !== 'undefined' ? reset : false;
    if (state ===-1){
        if(reset ===true)
            {processing.fill(window.backgroundColor[0], window.backgroundColor[1], window.backgroundColor[2]);}
        else {return false;}
    }
    else if (state === 1) {    // white if cell is part of maze
        processing.fill(window.mazeColor[0],window.mazeColor[1],window.mazeColor[2]); 
    } else if( state ===0) {                    //black if unused
        processing.fill(window.emptyColor[0],window.emptyColor[1],window.emptyColor[2]);
    }else if(state === 3) { // white again for bridges
        processing.fill(window.mazeColor[0],window.mazeColor[1],window.mazeColor[2]);
    }else if(state === 4){   // light bluey if potential cell
        processing.fill(window.potentialColor[0],window.potentialColor[1],window.potentialColor[2]);
    }else if (state === 2) {            // if cell is active cell color red
        processing.fill(window.activeColor[0],window.activeColor[1],window.activeColor[2]);
    }  else { // if bridge or some other error
        return -1;
    }
    
    processing.rect(2 + cellSize * col-1, 
         2 + cellSize * row-1,
         cellSize, cellSize);
         
    //now draw the vistied type.
    if(visited !== 'none'){
        if(visited === 'visited'){ 
            processing.fill(window.visitedFillColor[0],window.visitedFillColor[1],window.visitedFillColor[2]);
        }
        else if(visited === 'backtracked'){
            processing.fill(window.backtrackedFillColor[0],window.backtrackedFillColor[1],window.backtrackedFillColor[2]);
        }
        processing.rect(2 + cellSize * col-1 + cellSize/1.5/4, 
             2 + cellSize * row-1 + cellSize/1.5/4,
             cellSize/1.5, cellSize/1.5);
    }
    runTime = (new Date() - startTime);
    avgCellDrawTime = (avgCellDrawTime + runTime)/2;
}
function redrawBackground(){
    processing = Processing.getInstanceById('targetcanvas');
    processing.background(backgroundColor[0],backgroundColor[1],backgroundColor[2]);
}
function drawCell(row, col){
    drawCustomCell(row, col, window.cells[row][col].state,window.cells[row][col].visited ,false);
}

// initgrid( has a special uses the last paremeter value 'true' to tell the drawer that we are starting over.
// this makes it different from drawAllCells()
function initGrid (){
    for (var row = 0; row < numRows; row += 1) {
        for (var col = 0; col < numCols; col += 1) {
            drawCustomCell(row, col, window.cells[row][col].state,'none', true);
        }
    }
}
function drawAllCells(){
    for (var row = 0; row < numRows; row += 1) {
        for (var col = 0; col < numCols; col += 1) {
            drawCell(row, col, window.cells[row][col].state,'none', true);
        }
    }
}



function addRandomCell(){
    if (potentialCells.length !== 0) {
            var wall = potentialCells.splice(
                Math.random()*potentialCells.length, 1)[0];
            
            var sourceRow = wall[0][0];
            var sourceCol = wall[0][1];
            var destRow = wall[1][0];
            var destCol = wall[1][1];
            var destCell = window.cells[destRow][destCol];
            
            if (destCell.state === 1) {
                return true;
            }
            
            window.cells[destRow][destCol].state = 1;
            
            var newPotentials = getNeighbors(destRow, destCol);
            potentialCells = potentialCells.concat(newPotentials);
            
            //draw new ptoential cells
            for(var i=0; i<newPotentials.length; i+=1){
                // TODO:NEED TO FIX THIS SO THAT POTENTIAL CELL ARE STORED IN THE GLOBAL CELLS VARIABLE! BUT ARE ALSO NOT REDRAWN
                drawCustomCell(newPotentials[i][1][0], newPotentials[i][1][1], 4,'none', false);
            }
            
            // draw new cells (including the new active cell);
            window.cells[curRow][curCol].state = 1;
            window.cells[destRow][destCol].state = 2;
            drawCell(curRow, curCol);
            drawCell(destRow, destCol);
            // set the bridge then draw it. equation gives is +- 1 in one dirrection
            var bridgePos = [sourceRow+(destRow-sourceRow)/2, sourceCol+(destCol-sourceCol)/2];
            window.cells[bridgePos[0]][bridgePos[1]].state = 1;
            drawCell(bridgePos[0], bridgePos[1]);
                 
            curRow = destRow;
            curCol = destCol;
            
            //TODO: Why is curRow and Col a global variable? Fix it!
            
            return true;   
        } 
        else{
            return false;
        }
}
