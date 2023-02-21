from rest_framework import serializers
from .models import (
    Parent,
    FamilyComposition,
    ProgramsServicesAvailed,
    HealthCard,
    TenurialStatus,
)
from uuid import UUID
from django.utils import timezone
from datetime import datetime
import re
from rest_framework.validators import UniqueTogetherValidator

def is_valid_uuid(str_id, version=4):

    try:
        UUID(str(str_id), version=version)
        return True
    except ValueError:
        return False

def assign_dict_to_obj(obj, dict):

    for k in dict.keys():
        try:
            setattr(obj, k, dict[k])
        except:
            pass

def age_cap_validator(value, cap=0, above=True, err_message="Invalid Input"):

    if value <= 0:
        raise serializers.ValidationError(f"Age {value} is not valid")

    if (above and (value < cap)) or (not above and (value > cap)):
        raise serializers.ValidationError(err_message)

    return

def birth_date_age_cap_validator(value, cap=timezone.timedelta(), above=True, err_message="Invalid Input"):
    comp_date = timezone.localdate() - cap

    if (above and (value < comp_date)) or (not above and (value > comp_date)):
        raise serializers.ValidationError(err_message.format(comp_date.strftime(r"%Y-%m-%d")))

    return

def contact_number_format_validator(value):

    m = re.search(r'09\d{9}', value)

    if not m:
        raise serializers.ValidationError("Invalid input, must be number w/ this format 09XXXXXXXXX")

    return

class FamilyCompositionSerializer (serializers.ModelSerializer):
    id = serializers.ModelField(model_field=FamilyComposition()._meta.get_field('id'))

    class Meta:
        model = FamilyComposition 
        exclude = (
            '_parent',
        )
        extra_kwargs = {
            'age': {
                'validators': [lambda x : age_cap_validator(
                    value=x,
                    cap=23,
                    above=False,
                    err_message=f"Age must be below {23}"
                )],
            },
            'birth_date': {
                'validators': [
                    lambda x : birth_date_age_cap_validator(
                        value=x,
                        cap=timezone.timedelta(days=(365 * 23)),
                        err_message='Birth date must be above {0}'
                    ),
                    lambda x : birth_date_age_cap_validator(
                        value=x,
                        cap=timezone.timedelta(days=0),
                        above=False,
                        err_message='No future birth dates are allowed'
                    ),
                ],
            },
        }

class ProgramsServicesAvailedSerializer (serializers.ModelSerializer):
    
    class Meta:
        model = ProgramsServicesAvailed
        exclude = (
            '_parent',
        )

class HealthCardSerializer (serializers.ModelSerializer): 
    class Meta:
        model = HealthCard
        exclude = (
            '_parent',
        )

class TenurialStatusSerializer (serializers.ModelSerializer):
    
    class Meta:
        model = TenurialStatus
        exclude = (
            '_parent',
        )

class ParentSerializer (serializers.ModelSerializer):

    full_name = serializers.SerializerMethodField()
    expiration_date = serializers.SerializerMethodField()
    
    family_composition = FamilyCompositionSerializer(many=True)
    # IV
    progs_srvcs_availed = ProgramsServicesAvailedSerializer(many=False)
    # V
    health_cards = HealthCardSerializer(many=False)
    # VI
    tenurial_status = TenurialStatusSerializer(many=False)

    
    class Meta:
        model = Parent
        fields = (
            "id",
            "active",
            "expiration_date",

            "suffix",
            "first_name",
            "mid_name",
            "last_name",
            "full_name",
            "birth_date",
            "birth_place",
            "civil_status",
            "complete_present_address",
            "barangay",
            "age",
            "contact_number",
            "gender",
            "highest_educ_attain",
            "occup_emp",
            "occup_address",
            "monthly_income",
            "status_of_emp",
            "other_incom_src",
            "current_org_pos",
            "pos_if_offcr",
            "classification",
            "needs_of_solor_parent",

            "family_composition",
            "progs_srvcs_availed",
            "health_cards",
            "tenurial_status",   
        )
        extra_kwargs = {
            'age': {
                'validators': [lambda x : age_cap_validator(
                    value=x,
                    cap=18,
                    err_message=f"Age must be {18} above"
                )],
            },
            'birth_date': {
                'validators': [
                    lambda x : birth_date_age_cap_validator(
                        value=x,
                        cap=timezone.timedelta(days=(365 * 18)),
                        above=False,
                        err_message='Birth date must be below {0}'
                    ),
                ],
            },
            'contact_number': {
                'validators': [contact_number_format_validator],
            }
        }
        validators = [
            UniqueTogetherValidator(
                queryset=Parent.objects.all(),
                fields=[
                    "suffix",
                    "first_name",
                    "mid_name",
                    "last_name",
                    "age",
                ],
                message="Solo Parent's Information Already Exists."
            ),
        ]

    def create(self, validated_data):
        family_composition_datas = validated_data.pop("family_composition")
        progs_srvcs_availed_data = validated_data.pop("progs_srvcs_availed")
        health_cards_data = validated_data.pop("health_cards")
        tenurial_status_data = validated_data.pop("tenurial_status")

        parent = Parent.objects.create(**validated_data)

        for family_composition_data in family_composition_datas:
            FamilyComposition.objects.create(_parent=parent, **family_composition_data)

        ProgramsServicesAvailed.objects.create(_parent=parent, **progs_srvcs_availed_data)
        HealthCard.objects.create(_parent=parent, **health_cards_data)
        TenurialStatus.objects.create(_parent=parent, **tenurial_status_data)

        return parent

    def update(self, instance, validated_data):
        family_composition_datas = validated_data.pop("family_composition")
        progs_srvcs_availed_data = validated_data.pop("progs_srvcs_availed")
        health_cards_data = validated_data.pop("health_cards")
        tenurial_status_data = validated_data.pop("tenurial_status")


        if family_composition_datas:
            fam_comp_to_remain = []

            for family_composition_data in family_composition_datas:
                fc_id = family_composition_data.pop('id', None)

                # save
                if not fc_id or not is_valid_uuid(fc_id):
                    new_fam_comp = instance.family_composition.create(**family_composition_data) # assumes every data is intact :)
                    fam_comp_to_remain.append(new_fam_comp.id)
                    continue

                # update
                fam_comp = instance.family_composition.filter(pk=fc_id).first()
                
                if fam_comp:
                    fam_comp_to_remain.append(fc_id)

                    assign_dict_to_obj(fam_comp, family_composition_data)  # assumes every data is intact :)
                    fam_comp.save()
                else:
                    new_fam_comp = instance.family_composition.create(**family_composition_data) # assumes every data is intact :)
                    fam_comp_to_remain.append(new_fam_comp.id)
                    continue

            instance.family_composition.exclude(pk__in=fam_comp_to_remain).delete()

        else:
            # clean family compositions
            instance.family_composition.all().delete()

        if progs_srvcs_availed_data:

            psa = instance.progs_srvcs_availed
            assign_dict_to_obj(psa, progs_srvcs_availed_data)
            psa.save()

        if health_cards_data:

            hc = instance.health_cards
            assign_dict_to_obj(hc, health_cards_data)
            hc.save()

        if tenurial_status_data:

            ts = instance.tenurial_status
            assign_dict_to_obj(ts, tenurial_status_data)
            ts.save()

        if validated_data:

            assign_dict_to_obj(instance, validated_data)
            instance.save()

        return instance

    def get_full_name(self, obj):
        return obj.get_full_name()

    def get_expiration_date(self, obj):
        return obj.get_str_expr_date()