from django.db import models
import uuid

class BrngPres (models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    barangay = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=11)