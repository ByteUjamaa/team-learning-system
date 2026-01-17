from django.db.models.signals import post_save # type: ignore
from django.dispatch import receiver # type: ignore
from .models import Announcement
from .email_service import send_announcement_email # type: ignore

@receiver(post_save, sender=Announcement)
def announcement_created(sender, instance, created, **kwargs):
    if created:
        send_announcement_email(instance)
