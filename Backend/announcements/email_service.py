from django.core.mail import send_mail # type: ignore
from django.contrib.auth import get_user_model # type: ignore

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
new annconcement has been posted.

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
