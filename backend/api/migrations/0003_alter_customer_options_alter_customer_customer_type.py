# Generated by Django 5.0 on 2024-10-26 16:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_customertype_customer"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="customer",
            options={},
        ),
        migrations.AlterField(
            model_name="customer",
            name="customer_type",
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
