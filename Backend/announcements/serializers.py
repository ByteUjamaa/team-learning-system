from rest_framework import serializers
from .models import Announcement

class AnnouncementSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    short_content = serializers.SerializerMethodField()  # Truncated content field

    class Meta:
        model = Announcement
        # Ongeza short_content kwenye fields
        fields = ['id', 'title', 'content', 'short_content', 'date', 'author_name']

    def get_author_name(self, obj):
        author = getattr(obj, 'author', None)
        if not author:
            return None
        return getattr(author, 'username', str(author))

    def get_short_content(self, obj):
        """Return content truncated to 50 characters"""
        if len(obj.content) > 50:
            return obj.content[:50] + "..."
        return obj.content
