from rest_framework import serializers
from .models import (
    Announcement,
)

class AnnouncementSerializer (serializers.ModelSerializer):
    str_schedule = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = '__all__'

    def get_str_schedule(self, obj):
        return obj.get_str_schedule()