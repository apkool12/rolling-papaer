from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Letter
from .serializers import LetterSerializer
from django.shortcuts import get_object_or_404
from django.db.models import Q

class LetterViewSet(viewsets.ModelViewSet):
    queryset = Letter.objects.all()
    serializer_class = LetterSerializer

    def list(self, request):
        recipient = request.query_params.get('recipient', None)
        if recipient:
            letters = Letter.objects.filter(recipient=recipient)
        else:
            letters = Letter.objects.all()
        
        serializer = self.get_serializer(letters, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        letter = get_object_or_404(Letter, pk=pk)
        if not letter.is_read and request.user.get_username() == letter.recipient:
            letter.is_read = True
            letter.save()
        serializer = self.get_serializer(letter)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        letter = get_object_or_404(Letter, pk=pk)
        letter.delete()
        return Response({"message": "편지가 삭제되었습니다."}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def sent_messages(self, request):
        author = request.query_params.get('author', None)
        if not author:
            return Response({"error": "발신자를 지정해야 합니다."}, status=status.HTTP_400_BAD_REQUEST)
        
        letters = Letter.objects.filter(author=author)
        serializer = self.get_serializer(letters, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def notifications(self, request):
        recipient = request.query_params.get('recipient', None)
        if not recipient:
            return Response({"error": "수신자를 지정해야 합니다."}, status=status.HTTP_400_BAD_REQUEST)
        
        letters = Letter.objects.filter(recipient=recipient).order_by('-created_at')
        serializer = self.get_serializer(letters, many=True)
        return Response(serializer.data)