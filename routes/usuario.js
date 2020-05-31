const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore-node');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let Usuario = require('../models/usuario');

const saltRounds = 10;
//===============================
//Obtener todos los usuarios
//===============================



app.get('/', (req, res, next) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);


    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec((err, usuariosDb) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error cargando usuarios',
                    err
                });
            }
            Usuario.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    usuariosDb,
                    total: conteo
                });

            });



        });




});

//===============================
//Crear un usuario
//===============================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, saltRounds),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error crear usuario',
                err
            });
        }
        usuarioDB = _.pick(usuarioDB, 'nombre', 'email', 'img', 'role');

        res.status(201).json({
            ok: true,
            usuarioDB,
            usuarioToken: req.usuario


        });


    });


});





//===============================
//Actualizar un usuario
//===============================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;
    let id = req.params.id;


    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                message: 'No existe usuario con el id:' + id,
                errors: { message: 'No existe un usuario con ese Id' }
            });

        }

        usuarioDB.nombre = body.nombre;
        usuarioDB.email = body.email;
        usuarioDB.role = body.role;

        usuarioDB.save((err, usuarioSave) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar usuario',
                    err
                });
            }
            usuarioSave = _.pick(usuarioSave, 'nombre', 'email', 'img', 'role');

            res.status(201).json({
                ok: true,
                usuarioSave,
                usuarioToken: req.usuario


            });

        });

    });

});

//===============================
// Borrar un usuario
//===============================

app.delete('/:id', (req, res) => {

    const id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioDel) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al borrar usuario',
                err
            });
        }
        if (!usuarioDel) {
            return res.status(400).json({
                ok: false,
                message: 'no existe usuario',
                err: { message: 'no existe usuario' }
            });
        }


        res.status(200).json({
            ok: true,
            usuario: usuarioDel


        });




    });

});






module.exports = app;