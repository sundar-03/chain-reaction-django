from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from .serializers import *
import uuid
from .grid import *
from .ai import *
# Create your views here.

users = dict()
ai = AI()


class CreateGameView(APIView):

    serializer_class = GamesSerializer

    def get(self, request):

        if(len(users) < 1):
            idValue = str(uuid.uuid4())
            g = Grid(4, 4)
            users[idValue] = dict()
            users[idValue]["grid"] = g
            users[idValue]["lastGrid"] = None
            users[idValue]["lastMove"] = None
            data = Game(moves="", whoWon="nill", gameIdentifier=idValue)
            data.save()
            serialized = GamesSerializer(data)
            return Response({"data": serialized.data, "success": True, "message": ""})
        else:
            qValues = list(ai.qDict.values())
            s = ""
            for i in range(len(qValues)):
                s = s + str(qValues[i]) + ","

            return Response({"success": False, "message": "Server Busy", "string": s})


class MoveView(APIView):

    serializer_class = GamesSerializer

    # def get(self, request):
    # detail = [ {"name": detail.name,"detail": detail.detail}
    # for detail in React.objects.all()]
    # return Response(detail)

    parser_classes = [JSONParser]

    def post(self, request, format=None):

        x = request.data["x"]
        y = request.data["y"]
        whichPlayer = request.data["whichPlayer"]
        gameIdentifier = request.data["gameIdentifier"]
        playerWon = request.data["playerWon"]

        s = '(' + str(x) + ',' + str(y) + ',' + str(whichPlayer) + ')'

        if Game.objects.filter(gameIdentifier=gameIdentifier).exists():
            game = Game.objects.get(gameIdentifier=gameIdentifier)
            game.moves = game.moves + s
            game.save()

            # based on move take action
            oldenGrid = users[gameIdentifier]["grid"]
            userMove = (int(x), int(y))

            if users[gameIdentifier]["lastGrid"] is not None:
                # if player won, previous move made by ai is givem negative reward
                if playerWon:
                    ai.addMove(users[gameIdentifier]["lastGrid"],
                               users[gameIdentifier]["lastMove"], oldenGrid, -1)
                    game.whoWon = "Player"
                    game.save()
                    removed = users.pop(gameIdentifier, "Deleted")
                    return Response({"success": True, "message": "Ok", "AIwon": False})
                else:
                    # if player doesn't won, no reward to ai for its previous move
                    ai.addMove(users[gameIdentifier]["lastGrid"],
                               users[gameIdentifier]["lastMove"], oldenGrid, 0)

            # upgrade grid
            oldenGrid.makeMove(userMove, "Red")

            # call ai to get next move
            bestMove = ai.aiMove(oldenGrid)

            if bestMove is None:
                return Response({"success": False, "message": "Kunthakkedu"})
            else:
                aibeforeTupified = oldenGrid.giveTupifiedCopy()

                game.moves = game.moves + \
                    '(' + str(bestMove[0]) + ',' + \
                    str(bestMove[1]) + ',' + "ai)"
                game.save()

                # make the ai move
                oldenGrid.makeMove(bestMove, "Blue")

                users[gameIdentifier]["lastGrid"] = aibeforeTupified
                users[gameIdentifier]["lastMove"] = bestMove

                status = oldenGrid.isWon()

                # if game is finished
                if(status[0]):
                    if(status[1] == "Red"):
                        return Response({"success": False, "message": "Kunthakkedu. Showing red player won"})
                    else:
                        # if ai won, give reward
                        ai.addMove(aibeforeTupified, bestMove, oldenGrid, 1)
                        game.whoWon = "AI"
                        game.save()

                        # remve user
                        removed = users.pop(gameIdentifier, "Deleted")

                        return Response({"success": True, "message": "Ok", "x": bestMove[0], "y": bestMove[1], "AIwon": True})
                else:
                    # if game not finished
                    return Response({"success": True, "message": "Ok", "x": bestMove[0], "y": bestMove[1], "AIwon": False})
        else:
            return Response({"success": False, "message": "Incorrect Room. Internal error"})
