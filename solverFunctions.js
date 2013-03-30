var f = new Array();
function factorial (n){
  if (n===0 || n===1)
    return 1;
  if(f[n]>0)
      return f[n];
  else
      return f[n]=factorial(n-1)*n;
}

//TODO: Eliminate (or at least firgure out why) direction out of range errors.
function opDir(dir){
    if(dir ===1){
        return 3;
    }
    else if(dir ===2){
        return 4;
    }
    else if(dir ===3){
        return 1;
    }
    else if(dir ===4){
        return 2;
    }
    else{
        //console.log("direction is out of range!");
        return -1;
    }
}

// cellList must contaion the initial starting cell.
function solver2(cellList){
    var index = (cellList.length)-1;
    if(index === -1){
        //TODO: Fix in the maze genator why it sometimes doesn't end with an active cell.
        console.log("Error:Could not find target. Pleaes set the target!");
        return true;
    }
    
    var row = cellList[index][0];
    var col = cellList [index][1];
    var sourceDir = cellList [index][2]; // which direction we just came from (don’t go backwards)
    var destDir = cellList[index][3]; //which direction to start going in
    
    
    // if we get to target (which in this case is the active cell)
    if (window.cells[row][col].state===2){
        window.scores[1]+=1;
        return true;
    }
    // if the player gets to the tartget
    if (window.cells[playerPos[0]][playerPos[1]].state===2){
        window.scores[0]+=1;
        return true;
    }
    // go up
    // sourceDir != 3 is kinda of useless because the cell would have already been visited.
    var tRow = row+ ((destDir%2===0)? 0 : (destDir==3)?1:-1);
    var tCol = col+ ((destDir%2===1)? 0 : (destDir==4)?-1:1);
    
    // ONLY USING A CONTINUE STATEMENT IN SOME PLACES BECAUSE IT AUTO INCREMENTS!
    for( ;destDir <=4; destDir +=1){ 
        tRow = row+ ((destDir%2===0)? 0 : (destDir==3)?1:-1); // temp row and column to go out and check
        tCol = col+ ((destDir%2===1)? 0 : (destDir==4)?-1:1);
        if(isInBounds(tRow, tCol)===false){continue;} //if we are going out of bounds return false
        if(destDir === opDir(sourceDir))
            {continue;}
        if(!isWall([tRow,tCol]) && destDir !== opDir(sourceDir) && window.cells[tRow][tCol].visited ==="none"){
            cellList.push([tRow, tCol, destDir, 1]);
            window.cells[tRow][tCol].visited = "visited";
            drawCell(row, col);
            return false;
        }
    }
    //same for left
    //same for down
    //same for right
    
    // if we get to a dead end we want to backtrack
    window.cells[row][col].visited = "backtracked";
    cellList.pop();
    drawCell(row, col);
    return false;
    
}
