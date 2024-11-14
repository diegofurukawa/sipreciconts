# sessions/middleware.py
from django.utils import timezone
from ..services.usersession import UserSessionService

# No seu middleware ou views.py
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

@csrf_exempt
@require_http_methods(["OPTIONS", "POST"])
def handle_preflight(request):
    response = HttpResponse()
    response["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type, Authorization, x-session-id"
    response["Access-Control-Allow-Credentials"] = "true"
    return response

class UserSessionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Extrai o session_id do header
        session_id = request.META.get('HTTP_X_SESSION_ID')
        
        if session_id:
            # Tenta obter a sessão
            session = UserSessionService.get_active_session(session_id)
            if session:
                # Atualiza última atividade
                session.update_activity()
                # Adiciona a sessão ao request
                request.user_session = session
            else:
                request.user_session = None
        else:
            request.user_session = None

        response = self.get_response(request)
        return response