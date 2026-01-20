from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Announcement
from .email_service import send_announcement_email

@receiver(post_save, sender=Announcement)
def announcement_created(sender, instance, created, **kwargs):
    if created:
        send_announcement_email(instance)
