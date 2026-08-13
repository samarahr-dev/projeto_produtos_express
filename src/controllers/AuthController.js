function login(req, res) {
  const { access_token } = req.body;

  if (!access_token || access_token !== process.env.ACCESS_TOKEN) {
    return res.status(401).json({ erro: 'access_token inválido' });
  }

  req.session.autenticado = true;
  req.session.logadoEm = new Date().toISOString();
  req.session.contaAcessos = 0;

  res.status(200).json({ mensagem: 'sessão iniciada com sucesso' });
}

function perfil(req, res) {
  res.status(200).json({
    autenticado: req.session.autenticado,
    logadoEm: req.session.logadoEm,
  });
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ erro: 'erro ao encerrar sessão' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ mensagem: 'sessão encerrada' });
  });
}

function acessos(req, res) {
  res.status(200).json({ acessos: req.session.contaAcessos });
}

module.exports = { login, perfil, logout, acessos };
