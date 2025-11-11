from rest_framework import serializers
from .models import Announcement

class AnnouncementSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'date', 'author_name']

    def get_author_name(self, obj):
        author = getattr(obj, 'author', None)
        if not author:
            return None
        return getattr(author, 'username', str(author))
