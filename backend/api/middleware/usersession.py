# sessions/middleware.py
from django.utils import timezone
from ..services.usersession_service import UserSessionService

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
        session_id = request.META.get('HTTP_X_SESSION_ID')
        
        if session_id:
            session = UserSessionService.get_active_session(session_id)
            if session:
                session.update_activity()
                request.user_session = session
                
                # Garantir que o usuário tem acesso à empresa
                if hasattr(request, 'user') and request.user.is_authenticated:
                    if not request.user.company:
                        return HttpResponse('Usuário sem empresa associada', status=403)
            else:
                request.user_session = None
        else:
            request.user_session = None

        response = self.get_response(request)
        return response