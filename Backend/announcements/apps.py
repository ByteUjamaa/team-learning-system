from django.apps import AppConfig # type: ignore


class AnnouncementsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'announcements'

    def ready(self):
        import announcements.signals
