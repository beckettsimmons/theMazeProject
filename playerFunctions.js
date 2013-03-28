function drawPlayer(row,  col) {
    processing = Processing.getInstanceById('targetcanvas');
    
    processing.fill(0,0,200);
    processing.rect(2 + cellSize * col, 
         2 + cellSize * row,
         cellSize, cellSize);
}

function isWall(pos){
    var x = pos[0];
    var y = pos[1];
    //div and floor and add remainder because player pos is twices as many as each list.
    if(window.cells[x][y].state===-1 || window.cells[x][y].state===0)
    {
        return true;
    }
    else {
        return false;
    }
}

function movePlayer(dir){
    processing = Processing.getInstanceById('targetcanvas');
    
    //eareas last cell
    drawCell(playerPos[0], playerPos[1]);
    //update to new cell
    if(dir===1 && !isWall([playerPos[0]-1, playerPos[1]] )){ // dir 1
        playerPos[0]-=1;
    }
    else if(dir===2 && !isWall([playerPos[0], playerPos[1]+1] )){ /// dir1
        playerPos[1]+=1;
    }
    else if(dir===3 && !isWall([playerPos[0]+1, playerPos[1]] )){ // dir 3
        playerPos[0]+=1;
    }
    else if(dir===4 && !isWall([playerPos[0], playerPos[1]-1] )){ // dir 4
        playerPos[1]-=1;
    }
    drawPlayer(playerPos[0], playerPos[1]);
}