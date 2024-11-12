export const environment = {
    production: true,
    msalConfig: {
      auth: {
        clientId: '6cc185d2-aca1-412a-86f2-f850cfbc0bb9',
        authority: 'https://proyectoDeTitulo2024.b2clogin.com/proyectoDeTitulo2024.onmicrosoft.com/B2C_1_signupsignin1',
      },
    },
    apiConfig: {
      scopes: ['read'],
      uri: 'https://proyectoDeTitulo2024.onmicrosoft.com/tasks-api/tasks.read',
    },
  };