# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import Case, Category

# Register your models here.

admin.site.register(Case)
admin.site.register(Category)
