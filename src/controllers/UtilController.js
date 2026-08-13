function status(req, res) {
  res.status(200).json({ ok: true, hora: new Date().toISOString() });
}

function debugHeaders(req, res) {
  const userAgent = req.headers['user-agent'];
  const auth = req.get('Authorization');

  res.status(200).json({
    contentType: req.get('Content-Type'),
    userAgent,
    autenticado: Boolean(auth),
  });
}

module.exports = { status, debugHeaders };
