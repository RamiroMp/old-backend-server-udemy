const express = require('express');


const app = express();



const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

//=========================================
//Busqueda Por coleccion
//=========================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = RegExp(busqueda, 'i');




    var promesa;

    switch (tabla) {

        case 'medico':
            promesa = buscarMedico;
            break;
        case 'hospital':
            promesa = buscarHospital;
            break;
        case 'usuario':
            promesa = buscarUsuario;
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'No existe la tabla de consulta',
                err: { message: 'Tabla no existe' }
            });


    }

    promesa(busqueda, regex)
        .then(data => {
            res.status(200).json({
                ok: true,
                [tabla]: data
            });

        });



});










//=========================================
//Busqueda General
//=========================================

app.get('/todo/:busqueda', (req, res) => {

    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda, 'i');

    Promise.all([buscarHospital(busqueda, regex), buscarMedico(busqueda, regex), buscarUsuario(busqueda, regex)])
        .then(data => {
            res.status(200).json({

                ok: true,
                hospitales: data[0],
                medicos: data[1],
                usuario: data[2]

            });

        });



});

function buscarHospital(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitalDb) => {

                if (err) {
                    reject('Error al cargar hospitales', err);

                } else {
                    resolve(hospitalDb);
                }

            });
    });

}

function buscarMedico(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital', '_id nombre')
            .exec((err, medicoDb) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicoDb);
                }

            });
    });

}

function buscarUsuario(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, usuarioDb) => {

                if (err) {
                    reject('error al cargar usuario', err);
                } else {
                    resolve(usuarioDb);
                }

            });
    });

}












module.exports = app;