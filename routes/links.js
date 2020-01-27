const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    const { title, url, description } = req.body
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Nueva Tarea guardada');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', { links });
});


router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    console.log(links);
    res.render('links/edit', {link: links[0]});
});


router.get('/edit_users/:id', async (req, res) => {
    const { id } = req.params;
    const usersl = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    const userper = await pool.query('SELECT * FROM perfiles');
  
    console.log(usersl);
    console.log(userper);
    res.render('links/edit_users', {userd: usersl[0],userper});
});


router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'LINK ACTUALIZADO CORRECTAMENTE');
    res.redirect('/links');
});


router.post('/edit_users/:id', async (req, res) => {
    const { id } = req.params;
  
    const {id_perfiles} = req.body; 
    
    const newLink = {
       
        id_perfiles
    };
   
    await pool.query('UPDATE users set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'USUARIO ACTUALIZADO CORRECTAMENTE');
    res.redirect('/signup');
});

module.exports = router;