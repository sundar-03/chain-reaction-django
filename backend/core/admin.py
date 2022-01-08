
from django.contrib import admin
from .models import Game

# Register your models here.


class GameAdmin(admin.ModelAdmin):
    list_display = ('moves' ,'whoWon','gameIdentifier')

admin.site.register(Game, GameAdmin)
