# Generated by Django 5.0 on 2024-11-14 13:38

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0002_usersession"),
    ]

    operations = [
        migrations.AlterField(
            model_name="usersession",
            name="refresh_token",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]