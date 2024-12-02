function isAuthenticated(req, res, next) {
  if (req.session.professorId) {
    return next();
  }
  // res.status(401).json({ error: 'Você precisa estar logado para acessar esta funcionalidade.' });
  res.redirect('/LoginPG.html')
}

function preventGoToIndex(req, res, next) {
  if (req.session.professorId) {
    return res.redirect('/perfil_prof.html');
  }
  next();
}

module.exports = {isAuthenticated, preventGoToIndex};
