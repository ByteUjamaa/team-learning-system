from django.core.mail import send_mail
from django.contrib.auth import get_user_model

User = get_user_model()

def send_announcement_email(announcement):
    users = User.objects.filter(is_active=True)

    recipient_list = [
        user.email for user in users
        if user.email
    ]

    if not recipient_list:
        return

    subject = f"📢 TLMS new Announcement: {announcement.title}"

    content = f"""
A new announcement has been posted by the system administrator.

Title: {announcement.title}

Please log in to the system for more details.
"""

    send_mail(
        subject,
        content,
        None,
        recipient_list,
        fail_silently=False
    )
