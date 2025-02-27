// src/pages/Company/utils/validators.ts
export const companyValidators = {
  company_id: {
    required: 'Código da empresa é obrigatório',
    minLength: {
      value: 2,
      message: 'Código deve ter no mínimo 2 caracteres'
    },
    maxLength: {
      value: 10,
      message: 'Código deve ter no máximo 10 caracteres'
    },
    pattern: {
      value: /^[A-Z0-9]+$/,
      message: 'Código deve conter apenas letras maiúsculas e números'
    }
  },
  name: {
    required: 'Nome da empresa é obrigatório',
    minLength: {
      value: 3,
      message: 'Nome deve ter no mínimo 3 caracteres'
    },
    maxLength: {
      value: 100,
      message: 'Nome deve ter no máximo 100 caracteres'
    }
  },
  document: {
    required: 'CNPJ é obrigatório',
    pattern: {
      value: /^\d{14}$/,
      message: 'CNPJ deve conter 14 dígitos numéricos'
    }
  },
  phone: {
    pattern: {
      value: /^\d{10,11}$/,
      message: 'Telefone deve conter entre 10 e 11 dígitos numéricos'
    }
  },
  email: {
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Email inválido'
    }
  }
};