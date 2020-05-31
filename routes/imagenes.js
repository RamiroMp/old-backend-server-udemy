const express = require('express');
const fs = require('fs');

let app = express();

const path = require('path');



app.get('/:tipo/:img', (req, res) => {


    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        pathImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathImagen);
    }


});





module.exports = app;