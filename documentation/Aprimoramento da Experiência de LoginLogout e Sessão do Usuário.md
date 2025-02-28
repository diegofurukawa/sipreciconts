# Aprimoramento da Experiência de Login/Logout e Sessão do Usuário

Levando em conta as boas práticas que já discutimos, quero aprimorar a experiência de login, logout e informações da sessão de login do usuário (AuthContext). O objetivo é:

- Mostrar, em um atalho, o máximo possível de informações "permitidas".
- Sempre focar e zelar pela segurança.

## Ajustes Propostos

### 1. Toast de Logout
- **Toast - "Logout - realizado com sucesso"**  
  - *Problema*: Este NÃO está sendo apresentado.  
  - *Solução*: Precisamos mostrá-lo, assim como o de login.  
- **Toast - "Login - realizado com sucesso"**  
  - *Status*: Está sendo apresentado corretamente.

### 2. Informações de Sessão do Usuário
- **Exibição do "user_name"**  
  - Vamos mostrar o campo `user_name` na área de usuário para fácil identificação.
- **Mini Página de Informações de Autenticação**  
  - Criar uma mini página com os detalhes de autenticação do usuário.  
  - **Endpoint**: `http://localhost:8000/api/auth/validate/`  
  - **Resposta da API** (exemplo em JSON):
    ```json
    {
        "is_valid": true,
        "user": {
            "id": 1,
            "user_name": "Administrador",
            "email": "admin@example.com",
            "login": "admin",
            "type": "Admin",
            "company": "ADMIN",
            "company_name": "Empresa Admin",
            "enabled": true,
            "created": "2025-02-25T07:50:05.725879-03:00",
            "updated": "2025-02-25T07:50:05.725908-03:00",
            "last_login": "2025-02-27T19:47:34.804922-03:00"
        },
        "token_type": "Bearer"
    }