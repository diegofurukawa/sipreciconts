# authentication/views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from ..services.usersession_service import UserSessionService

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Cria a sessão do usuário após login bem-sucedido
            session = UserSessionService.create_session(
                user=request.user,
                company=request.user.company,  # Ajuste conforme sua estrutura
                token=response.data['access'],
                refresh_token=response.data['refresh'],
                request=request
            )
            
            # Adiciona o session_id à resposta
            response.data['session_id'] = str(session.session_id)
            
        return response