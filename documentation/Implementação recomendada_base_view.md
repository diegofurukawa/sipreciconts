Você está absolutamente certo! A solução 1 é a abordagem ideal para seu sistema, pois estabelece um padrão consistente para todos os cadastros relacionados à empresa.

Vamos generalizar essa abordagem para todos os ViewSets do seu sistema:

### Implementação recomendada:

1. **Crie ou modifique uma classe base** - Uma vez que todos os modelos herdam de BaseModel e precisam de company:

```python
# Em core/utils/mixins.py ou api/views/base_view.py

class BaseViewSetMixin:
    """
    Mixin para automaticamente associar registros à empresa do usuário autenticado
    """
    
    def perform_create(self, serializer):
        """
        Associa automaticamente o objeto à empresa do usuário
        """
        if self.request.user.company:
            serializer.save(company=self.request.user.company)
        else:
            raise ValidationError("Usuário não está associado a uma empresa")
    
    # Opcionalmente, filtrar queryset por empresa
    def get_queryset(self):
        """
        Filtra registros pela empresa do usuário autenticado
        """
        queryset = super().get_queryset()
        if self.request.user.company:
            return queryset.filter(company=self.request.user.company)
        return queryset.none()  # Retorna queryset vazio se não tiver empresa
```

1. **Aplique essa classe base a todos os ViewSets** (exceto CompanyViewSet):

```python
class TaxViewSet(BaseViewSetMixin, viewsets.ModelViewSet):
    # configurações específicas para Tax...

class CustomerViewSet(BaseViewSetMixin, viewsets.ModelViewSet):
    # configurações específicas para Customer...

# etc...
```

### Vantagens dessa abordagem:

1. **Segurança por padrão** - Os registros só são acessíveis por usuários da mesma empresa
2. **DRY (Don't Repeat Yourself)** - Elimina código repetitivo em cada ViewSet
3. **Consistência** - Todos os registros seguem o mesmo padrão
4. **Simplicidade para o cliente** - Não precisa enviar company em cada requisição

Essa implementação torna seu sistema mais robusto, seguro e fácil de manter, estabelecendo clara separação entre dados de diferentes empresas (multi-tenancy).

É exatamente o padrão correto para um sistema como o SiPreciConts, onde tudo (exceto a própria empresa) deve ser associado à empresa do usuário logado.