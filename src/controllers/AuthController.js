const AuthService = require('../services/AuthService');
const HttpError = require('../utils/HttpError');

function login(req, res, next) {
  try {
    AuthService.autenticar(req.body.access_token);

    req.session.autenticado = true;
    req.session.logadoEm = new Date().toISOString();
    req.session.contaAcessos = 0;

    res.status(200).json({ mensagem: 'sessão iniciada com sucesso' });
  } catch (erro) {
    next(erro);
  }
}

function perfil(req, res) {
  res.status(200).json({
    autenticado: req.session.autenticado,
    logadoEm: req.session.logadoEm,
  });
}

function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      return next(new HttpError(500, 'erro ao encerrar sessão'));
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ mensagem: 'sessão encerrada' });
  });
}

function acessos(req, res) {
  res.status(200).json({ acessos: req.session.contaAcessos });
}

module.exports = { login, perfil, logout, acessos };
