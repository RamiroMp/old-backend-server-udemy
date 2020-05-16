// requires 

const express = require('express');
const mongoose = require('mongoose');




// Inicializar Variables

const app = express();


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {

    if (err) throw err;
    console.log('Base de datos port 27017: \x1b[32m%s\x1b[0m', 'online');

});


// rutas
app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        message: ' Enviado ok'
    });
});


// Escuchar puerto

app.listen(3000, () => {
    console.log('Express Server en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})