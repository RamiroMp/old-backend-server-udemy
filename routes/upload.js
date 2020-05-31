const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
let app = express();


// default options
app.use(fileUpload());

// Importar modelos
let Usuario = require('../models/usuario');
let Medico = require('../models/medico');
let Hospital = require('../models/hospital');


app.put('/:tipo/:id', (req, res, next) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    // Tipos de colecciones
    let tiposValidos = ['hospitales', 'usuarios', 'medicos'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,

            tipo,
            message: 'No selecciono un tipo valido, tipos validos: ' + tiposValidos.join(' ,'),
            err: { message: 'No selecciono un tipo valido, tipos validos: ' + tiposValidos.join(' ,') }
        });

    }

    if (!req.files) {

        return res.status(400).json({
            ok: false,
            message: 'No selecciono nada',
            err: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo

    let archivo = req.files.imagen;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];


    // Extensiones permitidas
    let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];

    if (!extensionesValidas.includes(extension)) {
        return res.status(400).json({
            ok: false,
            message: 'Archivo no valido, extensiones permitidas: ' + extensionesValidas.join(' ,'),
            err: { message: 'Archivo no valido, extensiones permitidas: ' + extensionesValidas.join(' ,') }
        });


    }


    // Nombre de Archivo personalizado

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;



    // Mover el archivo temporal a un path
    let path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, err => {

        if (err) {

            return res.status(500).json({
                ok: false,
                message: 'Archivo no adjuntado',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);


    });





});


function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuarioDb) => {
            if (!usuarioDb) {
                return res.status(400).json({
                    ok: false,
                    mensaje: ' Usuario no existe',
                    err: { message: 'Usuario no existe' }


                });

            }

            let pathViejo = './uploads/usuarios/' + usuarioDb.img;

            borrarArchivo(pathViejo);

            usuarioDb.img = nombreArchivo;
            usuarioDb.save((err, usuarioAct) => {

                if (err) {

                    return res.status(400).json({
                        ok: false,
                        message: 'aqui da el error',
                        err
                    });
                }
                usuarioAct.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de Usuario Actualizada',
                    usuario: usuarioAct


                });


            });



        });


    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medicoDb) => {

            if (!medicoDb) {
                return res.status(400).json({
                    ok: false,
                    mensaje: ' medico no existe',
                    err: { message: 'medico no existe' }


                });
            }

            let pathViejo = './uploads/medicos/' + medicoDb.img;

            borrarArchivo(pathViejo);

            medicoDb.img = nombreArchivo;
            medicoDb.save((err, medicoAct) => {

                if (err) {

                    return res.status(400).json({
                        ok: false,
                        message: 'aqui da el error',
                        err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de medico Actualizada',
                    medico: medicoAct


                });


            });



        });


    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospitalDb) => {

            if (!hospitalDb) {
                return res.status(400).json({
                    ok: false,
                    mensaje: ' hospital no existe',
                    err: { message: 'hospital no existe' }


                });
            }

            let pathViejo = './uploads/hospitales/' + hospitalDb.img;

            borrarArchivo(pathViejo);

            hospitalDb.img = nombreArchivo;
            hospitalDb.save((err, hospitalAct) => {

                if (err) {

                    return res.status(400).json({
                        ok: false,
                        message: 'aqui da el error',
                        err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de hospital Actualizada',
                    hospital: hospitalDb


                });


            });



        });


    }




}

function borrarArchivo(pathViejo) {

    if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo, (err) => {

            if (err) throw err;

        });


    }


}




module.exports = app;