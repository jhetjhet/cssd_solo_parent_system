from django.db import models
from django.conf import settings
from django.utils import timezone
from background_task import background
import uuid
from twilio.rest import Client
from parnt.models import (
    Parent,
    format_phone_number,
)

class Announcement (models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    schedule = models.DateTimeField()
    description = models.CharField(max_length=255)
    message = models.TextField()

    def get_str_schedule(self):

        if not self.schedule:
            return ""

        return timezone.localtime(self.schedule).strftime(r"%b %d %Y, %I:%M:%S %p")

@background()
def broadcast_announcement(id):

    print('+'*128)
    print(f'Announcement {id}')
    try:
        annc = Announcement.objects.filter(pk=id).first()
        if(annc):
            print(f'Preparing to broadcast scheduled @ {annc.get_str_schedule()}')
            contact_numbers = Parent.objects.filter(active=False).values_list('contact_number', flat=True).distinct()
            print(f'Number of recipients: {len(contact_numbers)}')
            annc.delete()
            if len(contact_numbers) > 0:
                client = Client(settings.TWILIO_ACC_SID, settings.TWILIO_AUTH_TOKEN)
                for number in contact_numbers:
                    try:
                        message = client.messages.create(
                            body=annc.message,
                            from_=settings.TWILIO_FROM_NUMBER,
                            to=format_phone_number(str(number)),
                        )

                        print(message.sid)
                    except:
                        pass

    except Exception as e:
        print(e)

    print('+'*128)