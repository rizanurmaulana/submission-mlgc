require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

(async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const model = await loadModel();
  server.app.model = model;

  server.route(routes);

  server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    if (response instanceof InputError) {
      return h
        .response({
          status: 'fail',
          message: `${response.message}`,
        })
        .code(response.statusCode);
    }

    if (response.isBoom) {
      if (response.statusCode === 413) {
        return h
          .response({
            status: 'fail',
            message: 'Payload content length greater than maximum allowed: 1000000',
          })
          .code(413);
      }
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();
