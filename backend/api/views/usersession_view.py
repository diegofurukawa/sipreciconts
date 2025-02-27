# api/views/usersession.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from ..models.usersession_model import UserSession
from ..serializers.usersession_serializer import UserSessionSerializer
from ..services.usersession_service import UserSessionService

class UserSessionViewSet(viewsets.ModelViewSet):
    serializer_class = UserSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserSession.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def end_all(self, request):
        """Encerra todas as sessões do usuário"""
        UserSessionService.end_all_user_sessions(request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def end_session(self, request, pk=None):
        """Encerra uma sessão específica"""
        session = self.get_object()
        session.end_session()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Retorna a sessão atual do usuário"""
        session = self.get_queryset().filter(is_active=True).first()
        if session:
            serializer = self.get_serializer(session)
            return Response(serializer.data)
        return Response({"detail": "No active session"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Retorna todas as sessões ativas do usuário"""
        sessions = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(sessions, many=True)
        return Response(serializer.data)