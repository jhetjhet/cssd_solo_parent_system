from django.db import models
from django.utils import timezone
from django.conf import settings
from background_task import background
from twilio.rest import Client
import uuid
import re

def format_phone_number(phone_number):

    match = re.search(r'(?P<zer_beg>0)(?P<rest>\d{10})', phone_number)

    if(match):
        return f"+63{match.group('rest')}"

    return None

# Create your models here.
class Parent (models.Model):
    GENDER_MALE = 'M'
    GENDER_FEMALE = 'F'
    GENDERS = [
        (GENDER_MALE, 'Male'),
        (GENDER_FEMALE, 'Female'),
    ]

    EMP_STAT_REGULAR = 'RG'
    EMP_STAT_CONTRACTUAL = 'CT'
    EMP_STAT_SELFEMP = 'SE'
    EMP_STATUSES = [
        (EMP_STAT_REGULAR, 'Regular'),
        (EMP_STAT_CONTRACTUAL, 'Contractual'),
        (EMP_STAT_SELFEMP, 'Self-Employed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    active = models.BooleanField(default=True)
    expiration_date = models.DateTimeField(blank=True, null=True)
    date_registered = models.DateField(auto_now_add=True, editable=False)
    column = models.CharField(max_length=6, default='column', editable=False, blank=True, null=True)

    first_name = models.CharField(max_length=128)
    mid_name = models.CharField(max_length=128)
    last_name = models.CharField(max_length=128)
    birth_date = models.DateField()
    birth_place = models.CharField(max_length=128)
    civil_status = models.CharField(max_length=128)
    complete_present_address = models.TextField()
    barangay = models.CharField(max_length=255)
    age = models.IntegerField()
    contact_number = models.CharField(max_length=11)
    gender = models.CharField(max_length=128)
    highest_educ_attain = models.CharField(max_length=255)
    occup_emp = models.CharField(max_length=128)
    occup_address = models.CharField(max_length=128)
    monthly_income = models.DecimalField(max_digits=16, decimal_places=2)
    status_of_emp = models.CharField(max_length=128)
    other_incom_src = models.CharField(max_length=255)
    current_org_pos = models.CharField(max_length=255)
    pos_if_offcr = models.CharField(max_length=255, blank=True, null=True)
    # I
    # family_composition = models.ForeignKey('FamilyComposition', on_delete=models.CASCADE)
    # II
    classification = models.TextField()
    # III
    needs_of_solor_parent = models.TextField()
    # IV
    # progs_srvcs_availed = models.OneToOneField('ProgramsServicesAvailed', on_delete=models.CASCADE)
    # # V
    # health_cards = models.OneToOneField('HealthCard', on_delete=models.CASCADE)
    # # VI
    # tenurial_status = models.OneToOneField('TenurialStatus', on_delete=models.CASCADE)

    def get_full_name(self):
        return f"{self.first_name}, {self.mid_name}, {self.last_name}"

    def get_str_expr_date(self):

        if not self.expiration_date:
            return ""

        return timezone.localtime(self.expiration_date).strftime(r"%b %d %Y, %I:%M:%S %p")

    def reset_expiry(self):

        try:
            expry_time = settings.EXPIRY_LIFE
            notif_time = expry_time - settings.EXPIRY_DEL

            local_now = timezone.localtime()
            new_expiration_date = local_now + expry_time

            membership_expired_notif_task(str(self.id), schedule=(local_now + notif_time))
            membership_expired_task(str(self.id), schedule=new_expiration_date)
            
            self.active = True
            self.expiration_date = new_expiration_date

            self.save()
        except:
            pass

class FamilyComposition (models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    _parent = models.ForeignKey('Parent', on_delete=models.CASCADE, related_name='family_composition')

    first_name = models.CharField(max_length=128)
    mid_name = models.CharField(max_length=128)
    last_name = models.CharField(max_length=128)
    birth_date = models.DateField()
    relationship = models.CharField(max_length=128)
    age = models.IntegerField()
    status = models.CharField(max_length=128)
    educ_attainment = models.CharField(max_length=255)
    school_name = models.CharField(max_length=255)
    occupation = models.CharField(max_length=255)

class ProgramsServicesAvailed (models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    _parent = models.OneToOneField('Parent', on_delete=models.CASCADE, related_name='progs_srvcs_availed')

    ppp_benf = models.BooleanField(default=False)
    slp_benf = models.BooleanField(default=False)
    other_benf = models.CharField(max_length=255, blank=True, null=True)
    prnt_leader = models.BooleanField(default=False)
    slp_officer = models.BooleanField(default=False)
    skills = models.TextField()

class HealthCard (models.Model): 
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    _parent = models.OneToOneField('Parent', on_delete=models.CASCADE, related_name='health_cards')

    blue_card = models.BooleanField(default=False)
    phil_health = models.BooleanField(default=False)
    hmo = models.BooleanField(default=False)
    phil_health_masa_num = models.CharField(max_length=128, blank=True, null=True)
    indiv_player = models.BooleanField(default=False)
    family_benf = models.BooleanField(default=False)

class TenurialStatus (models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    _parent = models.OneToOneField('Parent', on_delete=models.CASCADE, related_name='tenurial_status')

    owned = models.BooleanField(default=False)
    sharer = models.BooleanField(default=False)
    priv_prop = models.BooleanField(default=False)
    rent = models.BooleanField(default=False)
    gov_prop = models.BooleanField(default=False)
    riv_side = models.BooleanField(default=False)
    pnr_site = models.BooleanField(default=False)
    rent_per_month = models.DecimalField(max_digits=16, decimal_places=2, blank=True, null=True)



@background(schedule=30, remove_existing_tasks=True)
def membership_expired_task(id):

    parent = Parent.objects.filter(pk=id).first()

    if(parent):
        print('x'*128)
        print(f'User: {parent.get_full_name()} account has expired')
        print(f'Deactivating parent with id {id} ...')
        print('x'*128)

        parent.active = False
        parent.save()

@background(schedule=30, remove_existing_tasks=True)
def membership_expired_notif_task(id):

    parent = Parent.objects.filter(pk=id).first()

    if(parent):
        to_num = format_phone_number(parent.contact_number)

        print('-'*128)
        print(f'Notifying User: {parent.get_full_name()} ({to_num}) via SMS')
        

        if(to_num):
            try:
                client = Client(settings.TWILIO_ACC_SID, settings.TWILIO_AUTH_TOKEN)
        
                message = client.messages.create(
                    body=f"CSSD Notice: Good day sir/ma'am {parent.get_full_name()} Your Solo Parent ID will expire on {parent.get_str_expr_date()}. For renewal, you may visit us & bring a COPY of ff: Voter's ID/Cert.,Brgy.Cert, ITR(working),1x1Pic,Birth Cert,Home add. sketch, Affidavit of abandonment/Non-marital child,Old ID.",
                    from_=settings.TWILIO_FROM_NUMBER,
                    to=to_num,
                )

                print(message.sid)
            except:
                pass

        print('-'*128)