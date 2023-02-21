from rest_framework import viewsets
from .models import (
    Parent,
    FamilyComposition,
    ProgramsServicesAvailed,
    HealthCard,
    TenurialStatus,
)
from .serializers import (
    ParentSerializer,
    FamilyCompositionSerializer,
    ProgramsServicesAvailedSerializer,
    HealthCardSerializer,
    TenurialStatusSerializer,
)
from django.utils import timezone
from datetime import date
from django.db.models import Count
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from django_pivot.pivot import pivot
from django_pivot.histogram import histogram

class ParentViewset (viewsets.ModelViewSet):
    
    # family_composition = models.ForeignKey('FamilyComposition', on_delete=models.CASCADE)
    # # II
    # classification = models.TextField()
    # # III
    # needs_of_solor_parent = models.TextField()
    # # IV
    # progs_srvcs_availed = models.OneToOneField('ProgramsServicesAvailed', on_delete=models.CASCADE)
    # # V
    # health_cards = models.OneToOneField('HealthCard', on_delete=models.CASCADE)
    # # VI
    # tenurial_status = models.OneToOneField('TenurialStatus', on_delete=models.CASCADE)

    serializer_class = ParentSerializer
    queryset = Parent.objects.all()

    filter_backends = (
        filters.SearchFilter,
        DjangoFilterBackend,
    )

    search_fields = (
        'first_name',
        'mid_name',
        'last_name',
        '=barangay',
        '=age',
        '=gender',
        '=civil_status',
    )
    filterset_fields = (
        'active',
    )

    @action(detail=True, methods=['POST'])
    def activate(self, request, pk=None):
        parent = self.get_object()

        if parent.expiration_date != None and parent.expiration_date < timezone.localtime():
            return Response(status=400)

        if(not parent.active):
            parent.reset_expiry()

        return Response()

    @action(detail=True, methods=['POST'])
    def deactivate(self, request, pk=None):
        parent = self.get_object()

        if(parent.active):
            parent.active = False
            parent.expiration_date = None
            parent.save()

        return Response()

    @action(detail=True, methods=['POST'])
    def renew(self, request, pk=None):
        parent = self.get_object()

        parent.reset_expiry()

        serialized_parent = ParentSerializer(parent, many=False)

        return Response(serialized_parent.data)

    @action(detail=False, methods=['GET'])
    def dashboard(self, request, pk=None):

        tot_solo_parent_per_brng = pivot(Parent.objects.filter(active=True, date_registered__month=date.today().month), 'barangay', 'column', 'first_name', aggregation=Count)
        num_solo_parent_by_gender = pivot(Parent.objects.filter(active=True), 'gender', 'column', 'first_name', aggregation=Count)
        num_act_inact_solo_parent = pivot(Parent, 'active', 'column', 'first_name', aggregation=Count)

        return Response(data={
            "tot_solo_parent_per_brng": tot_solo_parent_per_brng,
            "num_solo_parent_by_gender": num_solo_parent_by_gender,
            "num_act_inact_solo_parent": num_act_inact_solo_parent,
        })

class FamilyCompositionViewset (viewsets.ModelViewSet):
    pass

class ProgramsServicesAvailedViewset (viewsets.ModelViewSet):
    pass

class HealthCardViewset (viewsets.ModelViewSet): 
    pass

class TenurialStatusViewset (viewsets.ModelViewSet):
    pass