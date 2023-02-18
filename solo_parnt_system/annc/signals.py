from django.dispatch import receiver
from django.db.models.signals import (
    post_save
)
from .models import (
    Announcement,
    broadcast_announcement,
)

@receiver(post_save, sender=Announcement)
def parent_pre_save(sender, instance, created, *args, **kwargs):

    if(created):
        broadcast_announcement(str(instance.id), schedule=instance.schedule)