# Generated by Django 5.1.6 on 2025-03-13 14:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_tax_unique_acronym_per_company'),
    ]

    operations = [
        migrations.CreateModel(
            name='SuppliesPriceList',
            fields=[
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Data de Criação')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='Última Atualização')),
                ('enabled', models.BooleanField(default=True, verbose_name='Ativo')),
                ('value', models.DecimalField(decimal_places=4, max_digits=15, verbose_name='Valor')),
                ('sequence', models.IntegerField(default=1, help_text='Ordem de prioridade na listagem', verbose_name='Sequência')),
                ('suppliespricelist_id', models.BigAutoField(editable=False, primary_key=True, serialize=False)),
                ('company', models.ForeignKey(help_text='Empresa à qual este registro pertence', on_delete=django.db.models.deletion.PROTECT, related_name='company_suppliespricelists', to='api.company', verbose_name='Empresa')),
                ('supply', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='price_lists', to='api.supply', verbose_name='Insumo')),
                ('tax', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='supply_prices', to='api.tax', verbose_name='Imposto')),
            ],
            options={
                'verbose_name': 'Lista de Preços de Insumos',
                'verbose_name_plural': 'Listas de Preços de Insumos',
                'db_table': 'supplies_price_list',
                'ordering': ['sequence', 'supply__name'],
                'indexes': [models.Index(fields=['company_id'], name='supplies_pr_company_0ce0da_idx'), models.Index(fields=['supply', 'tax'], name='supplies_pr_supply__ded735_idx')],
                'constraints': [models.UniqueConstraint(fields=('supply', 'tax', 'company'), name='unique_supply_tax_per_company')],
            },
        ),
    ]
