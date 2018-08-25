var express = require('express');

var app = express();

var Corp = require('../models/corp');
var Device = require('../models/device');
var Usuario = require('../models/usuario');

// ==========================================
// Busqueda colección
//===========================================

app.get('/colection/:table/:search', (req, res) => {

    var table = req.params.table;
    var search = req.params.search;
    var regex = new RegExp(search, 'i');

    var promesa;

    switch (table) {
        case 'usuarios':
            promesa = buscarUsuarios(search, regex);
            break;

        case 'devices':
            promesa = buscarDevices(search, regex);
            break;

        case 'corps':
            promesa = buscarCorps(search, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Busqueda permitida a la colección es: Empresa, Usuarios, Dispositivos',
                error: { message: 'Tipo de tabla/ colección no válido' }

            });
    }
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [table]: data

        });

    });

});

// ==========================================
// Busqueda general
//===========================================

app.get('/all/:search', (req, res, next) => {

    var search = req.params.search;
    var regex = new RegExp(search, 'i');


    Promise.all([
            buscarCorps(search, regex),
            buscarDevices(search, regex),
            buscarUsuarios(search, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                corps: respuestas[0],
                devices: respuestas[1],
                usuarios: respuestas[2]
            });

        });


});

function buscarCorps(search, regex) {

    return new Promise((resolve, reject) => {


        Corp.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, corps) => {
                if (err) {
                    reject('Error al cargar', err);

                } else {
                    resolve(corps);
                }
            });
    });
}


function buscarDevices(search, regex) {

    return new Promise((resolve, reject) => {


        Device.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('corp', 'nombre')
            .exec((err, devices) => {
                if (err) {
                    reject('Error al cargar', err);

                } else {
                    resolve(devices);
                }
            });
    });
}

function buscarUsuarios(search, regex) {

    return new Promise((resolve, reject) => {


        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}
module.exports = app;