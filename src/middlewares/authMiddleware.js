function isAuthenticated(req, res, next) {
  if (req.session.professorId) {
    return next();
  }
  // res.status(401).json({ error: 'Você precisa estar logado para acessar esta funcionalidade.' });
  res.redirect('/LoginPG.html')
}

module.exports = isAuthenticated;
