var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

// inicializar los modelos de las colecciones

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // validar tipo de archivos 
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Error de coleccion',
            errors: { message: 'Los tipos de colecciones validos son: ' + tiposValidos.join(', ') }
        });

    }

    // validar si viene un archivo

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error no selecciono imagen',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArch = nombreCortado[nombreCortado.length - 1];


    // las extensiones aceptadas son
    var extensionesValidas = ['png', 'gif', 'jpg', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArch) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension invalida',
            errors: { message: 'Las extensiones validas son: ' + extensionesValidas.join(', ') }
        });
    }

    // nombre de archivo personalizado
    // 1321321313-123.png
    var nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extensionArch}`;


    // mover el archivo a un path temporal
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);




    });


});


function subirPorTipo(tipo, id, nombreArchivo, res) {

    // =================================================
    // ===========SUBIR IMAGEN POR USUARIOS=============
    // =================================================

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {

                return res.status(400).json({

                    ok: false,

                    mensaje: 'El usuario con el id ' + id + ' no existe',

                    errors: { message: 'No existe un usuario con ese ID' }

                });

            }
            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe elimina la imagen anterior

            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo, (error) => {

                    if (error) {

                        return res.status(400).json({

                            ok: false,

                            mensaje: 'No se pudo eliminar la imagen',

                            errors: error

                        });

                    }

                });

            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Usuario actualizada',
                    usuario: usuarioActualizado
                });

            });

        });

    }


    // =================================================
    // ===========SUBIR IMAGEN POR MEDICOS=============
    // =================================================

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {

                return res.status(400).json({

                    ok: false,

                    mensaje: 'El medico con el id ' + id + ' no existe',

                    errors: { message: 'No existe un usuario con ese ID' }

                });

            }
            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existe elimina la imagen anterior

            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo, (error) => {

                    if (error) {

                        return res.status(400).json({

                            ok: false,

                            mensaje: 'No se pudo eliminar la imagen',

                            errors: error

                        });

                    }

                });

            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {


                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Medico actualizado',
                    usuario: medicoActualizado
                });

            });

        });

    }


    // =================================================
    // ==========SUBIR IMAGEN POR HOSPITALES============
    // =================================================

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {

                return res.status(400).json({

                    ok: false,

                    mensaje: 'El hospital con el id ' + id + ' no existe',

                    errors: { message: 'No existe un usuario con ese ID' }

                });

            }
            var pathViejo = './uploads/hospitales/' + hospital.img;

            // Si existe elimina la imagen anterior

            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo, (error) => {

                    if (error) {

                        return res.status(400).json({

                            ok: false,

                            mensaje: 'No se pudo eliminar la imagen',

                            errors: error

                        });

                    }

                });

            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {


                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Hospital actualizado',
                    usuario: hospitalActualizado
                });

            });

        });

    }

}



module.exports = app;