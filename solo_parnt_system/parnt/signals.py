from django.dispatch import receiver
from django.db.models.signals import (
    post_save
)
from .models import (
    Parent,
)

@receiver(post_save, sender=Parent)
def parent_pre_save(sender, instance, created, *args, **kwargs):

    if(created):
        instance.reset_expiry()