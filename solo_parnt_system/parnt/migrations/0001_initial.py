# Generated by Django 4.1.6 on 2023-02-17 17:15

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Parent',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('active', models.BooleanField(default=True)),
                ('expiration_date', models.DateTimeField(blank=True, null=True)),
                ('date_registered', models.DateField(auto_now_add=True)),
                ('column', models.CharField(blank=True, default='column', editable=False, max_length=6, null=True)),
                ('first_name', models.CharField(max_length=128)),
                ('mid_name', models.CharField(max_length=128)),
                ('last_name', models.CharField(max_length=128)),
                ('birth_date', models.DateField()),
                ('birth_place', models.CharField(max_length=128)),
                ('civil_status', models.CharField(max_length=128)),
                ('complete_present_address', models.TextField()),
                ('barangay', models.CharField(max_length=255)),
                ('age', models.IntegerField()),
                ('contact_number', models.CharField(max_length=11)),
                ('gender', models.CharField(max_length=128)),
                ('highest_educ_attain', models.CharField(max_length=255)),
                ('occup_emp', models.CharField(max_length=128)),
                ('occup_address', models.CharField(max_length=128)),
                ('monthly_income', models.DecimalField(decimal_places=2, max_digits=16)),
                ('status_of_emp', models.CharField(max_length=128)),
                ('other_incom_src', models.CharField(max_length=255)),
                ('current_org_pos', models.CharField(max_length=255)),
                ('pos_if_offcr', models.CharField(blank=True, max_length=255, null=True)),
                ('classification', models.TextField()),
                ('needs_of_solor_parent', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='TenurialStatus',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('owned', models.BooleanField(default=False)),
                ('sharer', models.BooleanField(default=False)),
                ('priv_prop', models.BooleanField(default=False)),
                ('rent', models.BooleanField(default=False)),
                ('gov_prop', models.BooleanField(default=False)),
                ('riv_side', models.BooleanField(default=False)),
                ('pnr_site', models.BooleanField(default=False)),
                ('rent_per_month', models.DecimalField(blank=True, decimal_places=2, max_digits=16, null=True)),
                ('_parent', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='tenurial_status', to='parnt.parent')),
            ],
        ),
        migrations.CreateModel(
            name='ProgramsServicesAvailed',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('ppp_benf', models.BooleanField(default=False)),
                ('slp_benf', models.BooleanField(default=False)),
                ('other_benf', models.CharField(blank=True, max_length=255, null=True)),
                ('prnt_leader', models.BooleanField(default=False)),
                ('slp_officer', models.BooleanField(default=False)),
                ('skills', models.TextField()),
                ('_parent', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='progs_srvcs_availed', to='parnt.parent')),
            ],
        ),
        migrations.CreateModel(
            name='HealthCard',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('blue_card', models.BooleanField(default=False)),
                ('phil_health', models.BooleanField(default=False)),
                ('hmo', models.BooleanField(default=False)),
                ('phil_health_masa_num', models.CharField(blank=True, max_length=128, null=True)),
                ('indiv_player', models.BooleanField(default=False)),
                ('family_benf', models.BooleanField(default=False)),
                ('_parent', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='health_cards', to='parnt.parent')),
            ],
        ),
        migrations.CreateModel(
            name='FamilyComposition',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=128)),
                ('mid_name', models.CharField(max_length=128)),
                ('last_name', models.CharField(max_length=128)),
                ('birth_date', models.DateField()),
                ('relationship', models.CharField(max_length=128)),
                ('age', models.IntegerField()),
                ('status', models.CharField(max_length=128)),
                ('educ_attainment', models.CharField(max_length=255)),
                ('school_name', models.CharField(max_length=255)),
                ('occupation', models.CharField(max_length=255)),
                ('_parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='family_composition', to='parnt.parent')),
            ],
        ),
    ]
