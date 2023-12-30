const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }  
  req.flash('error', 'Usuario no autenticado.');
  res.redirect('/users/signInForm');
};

helpers.isAdmin = (req, res, next) => {
  if(req.user.role === 'Admin'){
    return next();
  }
  req.flash('error', 'El usuario no es admin.');
  res.redirect('/users/started');
};

helpers.isEmployee = (req, res, next) => {
  if(req.user.role === 'Empleado'){
    return next();
  }
  req.flash('error', 'El usuario no es empleado.');
  res.redirect('/users/started');
};

helpers.isCustomer = (req, res, next) => {
  if(req.user.role === 'Cliente'){
    return next();
  }
  req.flash('error', 'El usuario no es cliente.');
  res.redirect('/users/started');
};

helpers.isEmple = (req, res, next) => {
  if(req.user.role === 'Empleado'){
    return next();
  }
  req.flash('error', 'El usuario no es empleado.');
  res.redirect('/users/started');
};

helpers.isAdminCustomer = (req, res, next) => {
  if(req.user.role === 'Admin' || req.user.role === 'Cliente'){
    return next();
  }
  req.flash('error', 'El usuario no es empleado.');
  res.redirect('/users/started');
};


module.exports = helpers;
