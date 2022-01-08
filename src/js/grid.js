
function Cell(row, column, colour, count, gridRow, gridColumn)
{
    this.row = row;
    this.colour = colour;
    this.column = column;
    this.count = count;
    if((row === 0 && column === 0) || (row === 0 && column === (gridColumn - 1)) 
    || (row === (gridRow - 1) && column === 0) || (row === (gridRow - 1) && column === (gridColumn - 1)))
    {
        this.neighbour = 2;
        this.corner = true;
        this.edge = false;
        this.middle = false;
    }
    else if( row === 0 || row === (gridRow - 1) || column === 0 || column === (gridColumn - 1))
    {
        this.neighbour = 3;
        this.corner = false;
        this.edge = true;
        this.middle = false;
    }
    else
    {
        this.neighbour = 4;
        this.corner = false;
        this.edge = false;
        this.middle = true;
    }

    this.setCountZero = function (){
        this.count = 0;
    };

    this.addCount = function (){
        this.count = this.count + 1;
    };

    this.setColour = function(colour){
        this.colour = colour;
    };
    
    this.isCorner = function() {
        return this.corner;
    };

    this.isEdge = function() {
        return this.edge;
    };
    
    this.isMiddle = function() {
        return this.middle;
    };
}

function Grid(rows, columns)
{
    this.rows = rows;
    this.columns = columns;
    this.grid = [];
    let  i, j;
    for(i = 0; i < rows; i++)
    {
        this.grid.push([]);
        for(j = 0; j < columns; j++)
        {
            this.grid[i].push(new Cell(i, j, null, 0, rows, columns));
        }
    }

    this.setColourCell = function(i, j, colour){
        this.grid[i][j].setColour(colour);
    };

    this.addCountCell = function(i, j) {
        this.grid[i][j].addCount();
    };

    this.cellAttainedCritical = function(i, j) {
        //if reached critical state, return true
        if(this.grid[i][j].count >= this.grid[i][j].neighbour)
        {
            return true;
        }
        else
        {
            return false;
        }
    };

    this.returnCountofCell = function (i , j) {
        return this.grid[i][j].count;
    };

    this.returnColourofCell = function (i, j) {
        return this.grid[i][j].colour;
    };

    this.returnNeighbourofCell = function (i, j) {
        return this.grid[i][j].neighbour;
    }; 


    this.checkIsCornerCell = function (i, j) {
        return this.grid[i][j].isCorner();
    };

    this.checkIsEdgeCell = function(i,j) {
        return this.grid[i][j].isEdge();
    };

    this.checkIsMiddleCell = function (i, j) {
        return this.grid[i][j].isMiddle();
    };

    this.checkNature = function(i, j){
        if(this.checkIsCornerCell(i,j))
        {
            return "corner";
        }
        else if (this.checkIsEdgeCell(i, j))
        {
            return "edge";
        }
        else
        {
            return "middle";
        }
    };

    this.whichCorner = function (i, j) {

        if(!this.checkIsCornerCell(i, j))
        {
            return "none";
        }
        else if(i === 0 && j === 0)
        {
            return "tl";
        } 
        else if (i === 0 && j === (this.columns - 1)) 
        {
            return "tr";
        }
        else if (i === (this.rows - 1) && j === 0)
        {
            return "bl";
        }
        else
        {
            return "br";
        }
    };

    this.whichEdge = function (i, j) {
        if(!this.checkIsEdgeCell(i, j))
        {
            return "none";
        }
        else if( i === 0)
        {
            return "t";
        } 
        else if (i === (this.rows - 1)) 
        {
            return "b";
        } 
        else if ( j === 0 )
        {
            return "l";
        }
        else
        {
            return "r";
        } 
    };

    this.neighoboursOfCell = function (i , j) 
    {
        const neigh = [[i - 1, j], [i + 1, j], [i, j -1], [i, j+1]];
        var output = [], x, y, temp;
        for(temp = 0; temp < 4; temp++)
        {
            x = neigh[temp][0];
            y = neigh[temp][1];
            if( x>= 0 && x < this.rows && y>= 0 && y < this.columns)
            {
                output.push(neigh[temp]);
            }
        }
        return output;
    };

    this.handleAnimation = function (i, j)
    {
        //no game won is kown
        var x, y, temp1,temp2, neigh, present, redCount = 0, blueCount = 0;

        //add the critical cell to queue
        var q = [[i , j]];

        while(q.length !== 0)
        {
            //pop the critical cell
            var curCell = q.shift();
            x = curCell[0];
            y = curCell[1];

            //reduce its count
            this.grid[x][y].count -= this.grid[x][y].neighbour;

            //for its neighbour
            neigh = this.neighoboursOfCell(x, y);
            for(temp1 = 0; temp1 < neigh.length; temp1 ++)
            {
                //add count
                this.grid[neigh[temp1][0]][neigh[temp1][1]].count += 1;

                //change the colour
                this.grid[neigh[temp1][0]][neigh[temp1][1]].colour = this.grid[x][y].colour;

                //check if reached critical state
                if(this.grid[neigh[temp1][0]][neigh[temp1][1]].count >= this.grid[neigh[temp1][0]][neigh[temp1][1]].neighbour)
                {
                    //if reached, check whether it already present in queue
                    present = false;
                    for(temp2 = 0; temp2 < q.length; temp2 ++)
                    {
                        if(q[temp2][0] === neigh[temp1][0] && q[temp2][1] === neigh[temp1][1])
                        {
                            present = true;
                            break;
                        }
                    }

                    //if it is not present, add it
                    if(!present)
                    {
                        q.push(neigh[temp1]);
                    }
                }
            }

            //if the current cell count becomes 0, declare the colour to none
            if(this.grid[x][y].count === 0)
            {
                this.grid[x][y].colour = null;
            }
        }

        //after updation done, add all values to grid
        for(temp1 = 0; temp1 < this.rows; temp1++)
        {
            for(temp2 = 0; temp2 < this.columns; temp2++)
            {
                if(this.grid[temp1][temp2].count === 0)
                {
                    document.getElementById("r" + temp1.toString() + "c" + temp2.toString()).src = "assests/images/noApproach/count0/default.jpg";
                }
                else
                {
                    if(this.grid[temp1][temp2].colour === "Red")
                    {
                        redCount += 1;
                        this.grid[temp1][temp2].count -= 1;
                        const temp = this.handleClick(temp1, temp2, "Red");
                        document.getElementById("r" + temp1.toString() + "c" + temp2.toString()).src = "assests/images/" + temp.path;
                    }
                    else
                    {
                        blueCount += 1;
                        this.grid[temp1][temp2].count -= 1;
                        const temp = this.handleClick(temp1, temp2, "Blue");
                        document.getElementById("r" + temp1.toString() + "c" + temp2.toString()).src = "assests/images/" + temp.path;
                    }
                }
            }
        }

        if(redCount === 0)
        {
            return [true, "Blue"];
        }
        else if(blueCount === 0)
        {
            return [true, "Red"];
        }
        else
        {
            return [false, null];
        }

    };

    this.handleClick = function (i, j, colour) {
        var animationStatus = false;
        var path = "";

        //if the cell is empty
        if(this.returnCountofCell(i,j) === 0)
        {
            //then add an orb
            this.addCountCell(i,j);

            //set colour
            this.setColourCell(i, j, colour);

            path = "noApproach/count1/" + colour + ".jpg";

            const output = {
                "animationStatus" : animationStatus,
                "path": path,
            };
            return output;
        }
        //if the cell has orbs already
        else 
        {
            //add an orb
            this.addCountCell(i,j);

            //check animation status whether critical 

            //if attained critical
            if(this.cellAttainedCritical(i, j))
            {
                animationStatus = true;
            }

            //path part

            // if current is corner
            if(this.checkIsCornerCell(i, j))
            {
                //since count 0 case already handled, it has single orb already
                //we have to display image of two orbs based on location

                //if this a top left corner
                var cornerType = this.whichCorner(i, j);
                if(cornerType === "tl")
                {
                    path = "noApproach/count2/RightBottom/"+colour+".jpg";
                }
                //if this is top right
                else if(cornerType === "tr")
                {
                    path = "noApproach/count2/LeftBottom/" + colour + ".jpg";
                }
                //if this is bottom left
                else if(cornerType === "bl")
                {
                    path = "noApproach/count2/TopRight/" + colour + ".jpg";
                }
                //bottom right case
                else
                {
                    path = "noApproach/count2/TopLeft/" + colour + ".jpg";
                }
                const output = {
                    "animationStatus" : animationStatus,
                    "path": path,
                };
                return output;
            }
            //else if current cell is edge
            else if(this.checkIsEdgeCell(i, j))
            {
                //two cases, it might have count1, count2 at initial
                //or count2 or count3 accordingly

                //if the count is 2
                const edgeType = this.whichEdge(i, j);
                const count = this.returnCountofCell(i, j);

                if(count === 2)
                {
                    //which edge
                    //if it is top or bottom
                    if(edgeType === "t" || edgeType === "b")
                    {
                        path = "noApproach/count2/LeftRight/"+colour+".jpg";
                    }
                    //if it is for left or right
                    else
                    {
                        path = "noApproach/count2/TopBottom/" + colour + ".jpg";
                    }
                    const output = {
                        "animationStatus" : animationStatus,
                        "path": path,
                    };
                    return output;
                }
                //has count 3
                else 
                {
                    if(edgeType === "t")
                    {
                        path = "noApproach/count3/top/" + colour + ".jpg";
                    }
                    else if(edgeType === "b")
                    {
                        path = "noApproach/count3/bottom/" + colour + ".jpg";
                    }
                    else if(edgeType === "l")
                    {
                        path = "noApproach/count3/left/" + colour + ".jpg";
                    }
                    else
                    {
                        path = "noApproach/count3/right/" + colour + ".jpg";
                    }
                    const output = {
                        "animationStatus" : animationStatus,
                        "path": path,
                    };
                    return output;
                }
            }
            //middle cell
            else
            {
                const count = this.returnCountofCell(i, j);
                //if the cell is count2
                if(count === 2)
                {
                    path = "noApproach/count2/TopBottom/" + colour + ".jpg";
                }
                else if (count === 3)
                {
                    path = "noApproach/count3/bottom/" + colour + ".jpg";
                }
                else
                {
                    path = "noApproach/count4/" + colour + ".jpg";
                }
                const output = {
                    "animationStatus" : animationStatus,
                    "path": path,
                };
                return output;
            }
        }
    };
}

module.exports = Grid;