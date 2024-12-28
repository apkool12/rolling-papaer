from rest_framework import serializers
from .models import Letter  # Letter 모델을 가져옴

class LetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Letter
        fields = ['id', 'author', 'content', 'recipient', 'is_anonymous', 'created_at']
    
    def validate_content(self, value):
        if len(value) < 3: 
            raise serializers.ValidationError("한글자 이상 보내야합니다.")
        return value

    def validate_recipient(self, value):
        if not value:
            raise serializers.ValidationError("수신자는 필수입니다.")
        return value
