from django.db import models

# Create your models here.

class Game(models.Model):
    moves = models.TextField()
    whoWon = models.CharField(max_length=10)
    gameIdentifier = models.CharField(max_length=100)

    def __str__(self):
        x = '(' + self.gameIdentifier + ',' + self.whoWon + ')'
        return x
