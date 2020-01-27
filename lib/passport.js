const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');


const express = require('express');
const router = express.Router();

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Bienvenido ' + user.username));
    } else {
      done(null, false, req.flash('message', 'Contraseña Incorrecta'));
    }
  } else {
    return done(null, false, req.flash('message', 'El usuario no existe.'));
  }
}));



passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {

  

  const { fullname } = req.body;
  const { id_perfiles } = req.body;
  
  let newUser = {

    fullname,
    username,
    password,
    id_perfiles
  
  
  
  };
  newUser.password = await helpers.encryptPassword(password);
  console.log(newUser);
  // Saving in the Database
  const result = await pool.query('INSERT INTO users SET ? ', newUser);
 
  
  newUser.id = result.insertId;
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});

router.post  ('/cargar-usuarios', function (req, res) {
  let path=req.body;
  //cargarUser.cargarDato(path.path);
  console.log(path.path);

  var workbook = XLSX.readFile(path.path);

 
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
console.log(xlData);

for ( let i=0; i< xlData.length; i++){
 console.log(xlData[i].nombre)
 
 //password = helpers.encryptPassword(xlData[i].cedula)
 console.log(password)
 console.log("INSERT INTO users (id, username, password, fullname, id_perfiles) VALUES (NULL, '"+xlData[i].correopersona+"', '"+xlData[i].cedula+"', '"+xlData[i].nombre+"',"+1+")")
 var query = pool.query("INSERT INTO users (id, username, password, fullname, id_perfiles) VALUES (NULL, '"+xlData[i].correopersona+"', '"+xlData[i].cedula +"', '"+xlData[i].nombre+"',"+1+");", function(error, result){
    
    if(error){
       throw error;
    }else{
       console.log(result);
    }
  }
 );
}



res.render('cargar-usuarios');
});





