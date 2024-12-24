from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError
from django.http import JsonResponse

def register(request):
    return JsonResponse({'message': '회원가입 성공'})

def login_view(request):
    return JsonResponse({'message': '로그인 성공'})

class SignUpView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "이메일과 비밀번호는 필수 항목입니다."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=email).exists():
            return Response({"error": "이미 존재하는 이메일입니다."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=email, password=password)
        return Response({"message": "회원가입 성공!"}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "이메일과 비밀번호를 입력하세요."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=email, password=password)
        if not user:
            return Response({"error": "유효하지 않은 이메일 또는 비밀번호입니다."}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({"message": "로그인 성공!"}, status=status.HTTP_200_OK)
