const express = require('express');
const Medico = require('../models/medico');
const mdAutentication = require('../middlewares/autenticacion');



const app = express();

///////////////////////////////////////
//OBTENER TODOS LOS HOSPITALES
///////////////////////////////////////

app.get('/', (req, res, next) => {

    let desde = req.query.desde;
    desde = Number(desde);

    Medico.find({})
        .limit(5)
        .skip(desde)
        .populate('usuario', { password: 0 })
        .populate('hospital', { password: 0 })

    .exec((err, medicoDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo completar la peticion',
                err
            });
        }
        Medico.count({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                medicoDb,
                total: conteo
            });


        });

    });
});

///////////////////////////////////////
//CREAR UN HOSPITAL
///////////////////////////////////////

app.post('/', mdAutentication.verificaToken, (req, res) => {

    let body = req.body;

    let medico = new Medico({
        nombre: body.nombre,
        hospital: body.hospital,
        usuario: req.usuario._id
    });

    medico.save((err, medicoDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo completar la peticion',
                err
            });
        }

        res.status(200).json({
            ok: true,
            medicoDb
        });
    });




});

///////////////////////////////////////
//ACTUALIZAR UN HOSPITAL
///////////////////////////////////////

app.put('/:id', mdAutentication.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    console.log(id);

    Medico.findById(id, ((err, medicoDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo completar la peticion',
                err
            });
        }

        if (!medicoDB) {
            return res.status(400).json({
                ok: false,
                message: 'no existe ningun medico con el id: ' + id,
                err: 'Error, no existe el usuario con el id: ' + id
            });

        }

        medicoDB.nombre = body.nombre;
        medicoDB.hospital = body.hospital;


        medicoDB.save((err, medicoSave) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No se pudo completar la peticion',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoSave
            });
        });
    }));

});


///////////////////////////////////////
//BORRAR UN HOSPITAL
///////////////////////////////////////

app.delete('/:id', mdAutentication.verificaToken, (req, res) => {

    let id = req.params.id;

    Medico.findByIdAndDelete(id, (err, medicoBr) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo completar la peticion',
                err
            });
        }
        if (!medicoBr) {
            return res.status(400).json({
                ok: false,
                message: 'no existe ningun medico con el id: ' + id,
                err: 'Error, no existe el usuario con el id: ' + id
            });

        }

        res.status(200).json({
            ok: true,
            medico: medicoBr
        });




    });

});





module.exports = app;