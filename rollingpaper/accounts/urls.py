from django.urls import path
from .views import SignUpView, LoginView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),  # 회원가입 처리
    path('login/', LoginView.as_view(), name='login'),    # 로그인 처리
]