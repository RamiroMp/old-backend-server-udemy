const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore-node');
const SEED = require('../config/config').SEED;
const jwt = require('jsonwebtoken');

let app = express();

let Usuario = require('../models/usuario');

const saltRounds = 10;

app.post('/', (req, res) => {

    let body = req.body;

    Usuario.findOne({ 'email': body.email }, (err, usuarioDb) => {

        if (err) {
            return res.status('500').json({
                ok: false,
                err,
                message: 'No se pudo completar la peticion'
            });
        }
        if (!usuarioDb) {
            return res.status('400').json({
                ok: false,
                message: `usuario ó password incorrectos`
            });

        }

        bcrypt.compare(body.password, usuarioDb.password, (err, result) => {

            if (err) {
                return res.status('500').json({
                    ok: false,
                    err,
                    message: 'No se pudo completar la peticion'
                });

            }

            if (result === false) {
                return res.status('500').json({
                    ok: false,
                    message: `usuario ó password incorrectos`
                });

            }

            usuarioDb.password = '(:';

            // Crear un token

            let token = jwt.sign({ usuario: usuarioDb }, SEED, { expiresIn: 14400 }); // 4horas

            res.status(200).json({
                ok: true,
                message: 'logeado',
                id: usuarioDb._id,
                usuario: usuarioDb,
                token
            });



        });

    });


});






module.exports = app;