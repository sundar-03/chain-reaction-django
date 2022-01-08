from .grid import *
import sys
import random


class AI:
    def __init__(self):
        self.qDict = dict()
        self.alphaValue = 0.2
        self.epsilon = 0.34

    def addMove(self, oldGridTupified, move, newGrid, reward):
        oldQvalue = 0
        if (oldGridTupified, move) in self.qDict:
            oldQvalue = self.qDict[(oldGridTupified, move)]

        # future reward case
        moves = newGrid.possibleMoves("Blue")
        maxValue = -100000

        maxValue = 0
        
        temp = newGrid.giveTupifiedCopy()
        
        for move in moves:
            if (temp, move) in self.qDict.keys():
                qValue = self.qDict[(temp, move)]
            else:
                qValue = 0

            if(qValue > maxValue):
                maxValue = qValue

        self.qDict[(oldGridTupified, move)] = oldQvalue + \
            (self.alphaValue * ((reward + maxValue) - oldQvalue))

    def aiMove(self, grid):
        moves = grid.possibleMoves("Blue")
        bestMove = None
        bestReward = -100000

        if(len(moves) == 0):
            return bestMove
        
        temp = grid.giveTupifiedCopy()
            
        for move in moves:
            if (temp, move) in self.qDict:
                qValue = self.qDict[(temp, move)]
            else:
                qValue = 0

            if(bestMove is None or qValue > bestReward):
                bestReward = qValue
                bestMove = move

        weights = []
        for move in moves:

            if move == bestMove:
                weights.append(1 - self.epsilon)
            else:
                weights.append(self.epsilon / (len(moves) - 1))

        bestAction = random.choices(list(moves), weights=weights, k=1)[0]
        return bestAction


