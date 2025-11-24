import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Moodify API',
      version: '1.0.0',
      description: 'AI-powered mood-based playlist generation API for Spotify',
      contact: {
        name: 'Moodify Team'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://moodify-production-2519.up.railway.app'
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'userId'
        }
      }
    }
  },
  apis: ['./routes/*.js', './index.js']
};

export const swaggerSpec = swaggerJsdoc(options);
