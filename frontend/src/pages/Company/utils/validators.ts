// src/pages/Company/utils/validators.ts
export const companyValidators = {
    name: {
      required: 'Nome da empresa é obrigatório',
      minLength: {
        value: 3,
        message: 'Nome deve ter no mínimo 3 caracteres'
      }
    },
    document: {
      required: 'CNPJ é obrigatório',
      pattern: {
        value: /^\d{14}$/,
        message: 'CNPJ inválido'
      }
    }
  };