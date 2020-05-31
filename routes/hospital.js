const express = require('express');
const Hospital = require('../models/hospital');
const mdAutentication = require('../middlewares/autenticacion');



const app = express();

///////////////////////////////////////
//OBTENER TODOS LOS HOSPITALES
///////////////////////////////////////

app.get('/', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .limit(5)
        .skip(desde)

    .populate('usuario', 'nombre email')
        .exec((err, hospitalDb) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No se pudo completar la peticion',
                    err
                });
            }

            Hospital.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    hospitalDb,
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

    let hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo completar la peticion',
                err
            });
        }

        res.status(200).json({
            ok: true,
            hospitalDb
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

    Hospital.findById(id, ((err, hospitalDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo completar la peticion',
                err
            });
        }

        if (!hospitalDB) {
            return res.status(400).json({
                ok: false,
                message: 'no existe ningun hospital con el id: ' + id,
                err: 'Error, no existe el usuario con el id: ' + id
            });

        }

        hospitalDB.nombre = body.nombre;
        hospitalDB.img = body.img;


        hospitalDB.save((err, hospitalSave) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No se pudo completar la peticion',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalSave
            });
        });
    }));

});


///////////////////////////////////////
//BORRAR UN HOSPITAL
///////////////////////////////////////

app.delete('/:id', mdAutentication.verificaToken, (req, res) => {

    let id = req.params.id;

    Hospital.findByIdAndDelete(id, (err, hospitalBr) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo completar la peticion',
                err
            });
        }
        if (!hospitalBr) {
            return res.status(400).json({
                ok: false,
                message: 'no existe ningun hospital con el id: ' + id,
                err: 'Error, no existe el usuario con el id: ' + id
            });

        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBr
        });




    });

});





module.exports = app;