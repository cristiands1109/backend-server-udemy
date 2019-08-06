var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


// ============================================================
// ===============BUSQUEDA ESPECIFICA=============================
// ============================================================

app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var parametro = new RegExp(busqueda, 'i'); // convertimos la busqueda en una expresion regular
    var tabla = req.params.tabla;
    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = busquedaUsuarios(busqueda, parametro);
            break;
        case 'medicos':
            promesa = busquedaMedicos(busqueda, parametro);
            break;
        case 'hospitales':
            promesa = busquedaHospitales(busqueda, parametro);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busquedas son solo: usuarios, hospitales y medicos',
                error: { message: 'Tipo de tabla/coleccion no valido' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });

});


// ============================================================
// ===============BUSQUEDA GENERAL=============================
// ============================================================


app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var parametro = new RegExp(busqueda, 'i'); // convertimos la busqueda en una expresion regular

    Promise.all([
        busquedaHospitales(busqueda, parametro),
        busquedaMedicos(busqueda, parametro),
        busquedaUsuarios(busqueda, parametro)
    ]).then(respuestas => {

        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });

    });
});


function busquedaHospitales(busqueda, parametro) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: parametro })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function busquedaMedicos(busqueda, parametro) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: parametro })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar Medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function busquedaUsuarios(busqueda, parametro) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email rol')
            .or([{ 'nombre': parametro }, { 'email': parametro }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuuario', err)
                } else {
                    resolve(usuarios);
                }
            });
    });
}







module.exports = app;