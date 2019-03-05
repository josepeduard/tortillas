const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/User');
const { requireAnon, requireUser, requireFields } = require('../middlewares/auth');

const saltRounds = 10;

/* Cliente se conecta al servidor si no tiene cookies el servidor genera una session con una cookie y se la da al cliente
la proxima peticion que hace el cliente, ya passa la cookie y el servidor sabe quien es
en el momento de hacer el login (POST) el cliente manda la cookie + username + password y el servidor comprueba la cookie, y le assigna una session
guardando la informacion de la cookie, user y passw */

/*
if (req.session.currentUser) {
 res.redirect('/');
 return;
}
*/

router.get('/signup', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/signup', data);
});

router.post('/signup', requireAnon, requireFields, async (req, res, next) => {
  // Extraer body --> Comprovar que username y passw no estan vacios
  const { username, password } = req.body;

  // --> comprovar que el usuario no existe
  try {
    const result = await User.findOne({ username: username });
    if (result) {
      req.flash('validation', 'This username is taken');
      res.redirect('/auth/signup');
      return;
    }
    // --> encriptar passw --> Crear el usuario
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = {
      username,
      password: hashedPassword
    };
    const createUser = await User.create(newUser);
    // Guardamos el usuario en la session
    req.session.currentUser = createUser;
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.get('/login', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/login', data);
});

router.post('/login', requireAnon, requireFields, async (req, res, next) => {
  // Extraer informacion del body
  const { username, password } = req.body;
  // Comprobar que hay usuario y password

  // Comprovar que el usuario existe
  try {
    const user = await User.findOne({ username });
    if (!user) {
      req.flash('validation', 'Username or passsword incorrect');
      res.redirect('/auth/login');
      return;
    }
    // Comparar la contraseña
    if (bcrypt.compareSync(password, user.password)) {
      // Guardar la sesion
      req.session.currentUser = user;
      // Redirigir
      res.redirect('/');
    } else {
      req.flash('validation', 'Username or passsword incorrect');
      res.redirect('/auth/login');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/logout', requireUser, (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
});

module.exports = router;
