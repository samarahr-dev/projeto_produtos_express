const produtoRoutes = require('./produtoRoutes');
const authRoutes = require('./authRoutes');
const utilRoutes = require('./utilRoutes');

function registrarRotas(app) {
  app.use('/api', authRoutes);
  app.use('/api', utilRoutes);
  app.use('/api/produtos', produtoRoutes);
}

module.exports = registrarRotas;
