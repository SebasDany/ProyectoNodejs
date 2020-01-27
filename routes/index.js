const express = require('express');
const router = express.Router();
var XLSX = require('xlsx')

router.get('/', async (req, res) => {
    res.render('index');
});


router.get('/cargar-usuarios', function (req, res) {

    //cargarUser.cargaraDato(path);
        res.render('cargar-usuarios');
    
    });

    router.post('/cargar-usuarios', function (req, res) {
        let path=req.body;
        //cargarUser.cargarDato(path.path);
        console.log(path.path);
      
        var workbook = XLSX.readFile(path.path);
      
       
      var sheet_name_list = workbook.SheetNames;
      var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
      console.log(xlData);
      
      for ( let i=0; i< xlData.length; i++){
        
       console.log(xlData[i].nombre)
       password =  helpers.encryptPassword(xlData[i].cedula)
       console.log(password)
       console.log("INSERT INTO users (id, username, password, fullname, id_perfiles) VALUES (NULL, '"+xlData[i].correopersona+"', '"+xlData[i].cedula+"', '"+xlData[i].nombre+"',"+1+")")
       var query = pool.query("INSERT INTO users (id, username, password, fullname, id_perfiles) VALUES (NULL, '"+xlData[i].correopersona+"', '"+password+"', '"+xlData[i].nombre+"',"+1+");", function(error, result){
          
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
module.exports = router;