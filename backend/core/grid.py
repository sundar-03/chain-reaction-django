import copy

def isCorner(x, y, rows, columns):
    if(x == 0 and y == 0):
        return True
    elif (x == 0 and y == (columns - 1)):
        return True
    elif(x == (rows - 1) and y == 0):
        return True
    elif(x == (rows - 1) and y == (columns - 1)):
        return True
    else:
        return False


def isEdge(x, y, rows, columns):
    if(isCorner(x, y, rows, columns)):
        return False
    elif(x == 0):
        return True
    elif(x == (rows - 1)):
        return True
    elif(y == 0):
        return True
    elif(y == (columns - 1)):
        return True
    else:
        return False


def neighbours(i, j, rows, columns):
    output = []
    neighbour = [(i - 1, j), (i+1, j), (i, j - 1), (i, j + 1)]
    for x, y in neighbour:
        if(x >= 0 and x < rows and y >= 0 and y < columns):
            output.append((x, y))
    return output

#our convention of cell data
#(i, j, count, colour, neighbour)
class Grid:
    def __init__(self, rows, columns):
        self.rows = rows
        self.columns = columns
        self.grid = []
        for i in range(rows):
            self.grid.append([])
            for j in range(columns):
                if(isCorner(i ,j, rows, columns)):
                    neighbour = 2
                elif(isEdge(i, j, rows, columns)):
                    neighbour = 3
                else:
                    neighbour = 4
                self.grid[i].append([i, j, 0, None, neighbour])
    
    def giveTupifiedCopy(self):
        temp = copy.deepcopy(self.grid)
        for i in range(self.rows):
            for j in range(self.columns):
                temp[i][j] = tuple(temp[i][j])
            temp[i] = tuple(temp[i])
        temp = tuple(temp)
        return temp
    
    def isWon(self):
        redCount = 0
        blueCount = 0
        for i in range(self.rows):
            for j in range(self.columns):
                if(not (self.grid[i][j][3] is None)):
                    if(self.grid[i][j][3] == "Blue"):
                        blueCount += 1
                    else:
                        redCount += 1
        if(redCount == 0):
            return (True, "Blue")
        elif(blueCount == 0):
            return (True, "Red")
        else:
            return (False, None)

    def makeMove(self, move, colour):

        x = move[0]
        y = move[1]
        q = []
        # increase
        self.grid[x][y][2] += 1

        #if colour is none, assign colour
        if self.grid[x][y][3] is None and ((self.grid[x][y][2] - 1) == 0):
            self.grid[x][y][3] = colour

        # check status and make chain reaction if attained critical
        if(self.grid[x][y][2] >= self.grid[x][y][4]):
            q.append((x, y))

        while(len(q) != 0):
            # get the critical cell
            criticalCell = q.pop(0)

            # reduce the count
            self.grid[criticalCell[0]][criticalCell[1]][2] -= self.grid[criticalCell[0]][criticalCell[1]][4]

            # get all the neighbours
            neighbor = neighbours(
                criticalCell[0], criticalCell[1], self.rows, self.columns)

            # for each neighbour
            for i, j in neighbor:

                # add count
                self.grid[i][j][2] += 1

                # set the colour
                self.grid[i][j][3] = self.grid[criticalCell[0]][criticalCell[1]][3]

                if(self.grid[i][j][2] >= self.grid[i][j][4]):
                    temp = (i, j)
                    if not (temp in q):
                        q.append(temp)
            
            #if count of cell is 0, colour of that cell is none
            if(self.grid[criticalCell[0]][criticalCell[1]][2] == 0):
                self.grid[criticalCell[0]][criticalCell[1]][3] = None


    def possibleMoves(self, colour):
        result = []
        for i in range(self.rows):
            for j in range(self.columns):
                if(self.grid[i][j][2] == 0):
                    result.append((i, j))

                if(self.grid[i][j][3] == colour):
                    result.append((i, j))

        return result        



