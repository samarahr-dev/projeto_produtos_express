function exigeLogin(req, res, next) {
  if (!req.session.autenticado) {
    return res.status(401).json({
      erro: 'Faça login para continuar',
    });
  }

  next();
}

module.exports = exigeLogin;
