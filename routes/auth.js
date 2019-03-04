const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/User');

const saltRounds = 10;

/* Cliente se conecta al servidor si no tiene cookies el servidor genera una session con una cookie y se la da al cliente
la proxima peticion que hace el cliente, ya passa la cookie y el servidor sabe quien es
en el momento de hacer el login (POST) el cliente manda la cookie + username + password y el servidor comprueba la cookie, y le assigna una session
guardando la informacion de la cookie, user y passw */

router.get('/signup', (req, res, next) => {
  // protegemos la ruta para que si ya estas logueado no puedas acceder al signup
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }
  res.render('auth/signup');
});

router.post('/signup', async (req, res, next) => {
  // no haria falta, pero siempre lo protegemos todo --> protegemos la ruta para que si ya estas logueado no puedas acceder al signup
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }
  // Extraer body --> Comprovar que username y passw no estan vacios
  const { username, password } = req.body;
  if (!password || !username) {
    res.redirect('/auth/signup');
    return;
  }
  // --> comprovar que el usuario no existe
  try {
    const result = await User.findOne({ username: username });
    if (result) {
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

router.get('/login', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }
  res.render('auth/login');
});

router.post('/login', async (req, res, next) => {
  // proteccion si estamos logeados no podemos acceder a login
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }
  // Extraer informacion del body
  const { username, password } = req.body;
  // Comprobar que hay usuario y password
  if (!password || !username) {
    res.redirect('/auth/login');
    return;
  }
  // Comprovar que el usuario existe
  try {
    const user = await User.findOne({ username });
    if (!user) {
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
      res.redirect('/auth/login');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/');
    return;
  }
  delete req.session.currentUser;
  res.redirect('/');
});
module.exports = router;
