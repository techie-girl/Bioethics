# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.utils import timezone
from django.utils.safestring import mark_safe

# Create your models here.

class Case(models.Model):
    title = models.CharField(max_length=512, null=False)
    html = models.TextField(default="")
    category = models.ForeignKey('Category', on_delete=models.DO_NOTHING, null=True)
    description = models.TextField(default="")
    published_date = models.DateTimeField(blank=True, null=True)

    def publish(self):
            self.published_date = timezone.now()
            self.save()

    def __str__(self):
            return self.title

class Category(models.Model) :
    name = models.CharField(max_length = 512, null=False)
    # TODO: Make this not bad. (Use an imagefield)
    path = models.CharField(max_length = 1024, null=False)
