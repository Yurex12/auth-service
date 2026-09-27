import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Auth service',
      version: '1.0.0',
      description: 'A authentication application',
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'session',
        },
      },
    },
    servers: [
      { url: `${process.env.BASE_URL}/api`, description: 'Url endpoint' },
    ],
  },

  apis:
    process.env.NODE_ENV === 'production'
      ? ['./dist/features/*/*.routes.js']
      : ['./src/features/*/*.routes.ts'],
};

export const swaggerSpec = swaggerJsDoc(swaggerOptions);
