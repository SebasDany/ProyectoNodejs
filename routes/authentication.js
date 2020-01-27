const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const pool = require('../database');
// SIGNUP
router.get('/signup',async (req, res) => {
  const result2 = await pool.query('SELECT * FROM perfiles');
  const result1 = await pool.query('SELECT users.id, users.fullname, perfiles.nombre_perfiles FROM users, perfiles WHERE perfiles.id_perfiles=users.id_perfiles');
  console.log(result1);
  res.render('auth/signup',{result2,result1});
});





router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/signup',
  failureRedirect: '/signup',
  failureFlash: true
}));

// SINGIN
router.get('/signin', (req, res) => {
  res.render('auth/signin');
});

router.post('/signin', (req, res, next) => {
  req.check('username', 'EL USUARIO ES REQUERIDO').notEmpty();
  req.check('password', 'LA CONTRASEÑA ES REQUERIDA').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
  }
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});



module.exports = router;
