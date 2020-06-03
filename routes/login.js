const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore-node');
const SEED = require('../config/config').SEED;
const jwt = require('jsonwebtoken');

// google
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = require('../config/config').CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

let app = express();

let Usuario = require('../models/usuario');

const saltRounds = 10;

//=========================================
//Autenticacion Normal
//=========================================

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

//=========================================
//Autenticacion Google
//=========================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}





app.post('/google', async(req, res) => {

    let token = req.body.token;
    var googleUser = await verify(token)
        .catch(err => {
            res.status(400).json({
                ok: false,
                message: 'Token no valido'

            });


        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDb) => {

        if (err) {
            return res.status('500').json({
                ok: false,
                err,
                message: 'No se pudo completar la peticion'
            });

        }


        if (usuarioDb) {
            if (usuarioDb.google === false) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'la autentificacion no se puede hacer por google'
                });
            } else {

                let token = jwt.sign({ usuarioDb }, SEED, { expiresIn: 14499 });
                res.status(200).json({
                    ok: false,
                    usuario: usuarioDb,
                    token,
                    id: usuarioDb._id
                })
            }

        } else {

            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDb) => {
                if (err) {
                    return res.status('500').json({
                        ok: false,
                        err,
                        message: 'No se pudo completar la peticion'
                    });

                } else {

                    let token = jwt.sign({ usuarioDb }, SEED, { expiresIn: 14499 });
                    res.status(200).json({
                        ok: true,
                        message: 'logeado',
                        id: usuarioDb._id,
                        usuario: usuarioDb,
                        token
                    });




                }

            })

        }

    });
});






module.exports = app;