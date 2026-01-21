from django.core.mail import send_mail
from django.contrib.auth import get_user_model

User = get_user_model()

def send_announcement_email(announcement):
    users = User.objects.filter(is_active=True)

    for user in users:
        if not user.email:
            continue


    subject = f"📢TLMS, Hello {user.first_name}, New Announcement: {announcement.title}"
    for user in users:
        content = f"""  
Please login now for more details.
"""

        send_mail(
            subject,
            content,
            None,
            [user.email],
            fail_silently=False
        )
