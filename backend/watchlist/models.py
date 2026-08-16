from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User


class Media(models.Model):

    TYPE_CHOICES = [
        ('Movie', 'Movie'),
        ('TV', 'TV'),
    ]

    STATUS_CHOICES = [
        ('Unwatched', 'Unwatched'),
        ('Watched', 'Watched'),
    ]

    title = models.CharField(max_length=200)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='Unwatched'
    )
    rating = models.IntegerField(default=0)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title