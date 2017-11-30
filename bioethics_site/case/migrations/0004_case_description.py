# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('case', '0003_auto_20170224_1651'),
    ]

    operations = [
        migrations.AddField(
            model_name='case',
            name='description',
            field=models.TextField(default=''),
        ),
    ]
