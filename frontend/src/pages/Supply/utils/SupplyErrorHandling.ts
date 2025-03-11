// Em utils/errorHandling.ts ou diretamente no SupplyService.ts
export const extractErrorMessages = (error: any): string => {
    // Se o erro tiver uma resposta com dados
    if (error.response && error.response.data) {
      const data = error.response.data;
      
      // Se os dados forem um objeto, podemos tentar extrair as mensagens
      if (typeof data === 'object') {
        // Coletamos todas as mensagens de erro em um array
        const messages: string[] = [];
        
        Object.entries(data).forEach(([field, errors]) => {
          // Se errors for um array (como esperado da API)
          if (Array.isArray(errors)) {
            errors.forEach(err => {
              messages.push(`${field}: ${err}`);
            });
          } else if (typeof errors === 'string') {
            messages.push(`${field}: ${errors}`);
          }
        });
        
        // Retornamos todas as mensagens concatenadas
        if (messages.length > 0) {
          return messages.join('\n');
        }
      }
      
      // Se data for uma string, retornamos diretamente
      if (typeof data === 'string') {
        return data;
      }
    }
    
    // Fallback para a mensagem de erro padrão
    return error.message || 'Ocorreu um erro inesperado';
  };