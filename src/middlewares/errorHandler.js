function notFound(req, res) {
  res.status(404).json({ erro: 'Rota não encontrada' });
}

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ erro: err.message || 'Erro interno do servidor' });
}

module.exports = { notFound, errorHandler };
