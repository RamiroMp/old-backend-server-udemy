const express = require('express');

let app = express();





app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        message: ' Enviado ok'
    });
});





module.exports = app;