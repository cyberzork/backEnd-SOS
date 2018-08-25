var express = require('express');

var Auth = require('../middlewares/auth');

var app = express();


var Device = require('../models/device');


// ==================================================
// Listar Dispositivos
// ==================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Device.find({})
        .skip(desde)
        .limit(10)
        .populate('usuario', 'nombre email')
        .populate('corp')
        .exec(

            (err, devices) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Dispositivos',
                        errors: err
                    });
                } else {
                    Device.count({}, (err, conteo) => {
                        res.status(200).json({
                            ok: true,
                            devices: devices,
                            total: conteo
                        });

                    });
                }
            });

});


// ==================================================
// Actualizar Dispositivos
// ===================================================
app.put('/:id', Auth.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Device.findById(id, (err, device) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Dispositivo no encontrado',
                errors: err
            });
        }

        if (!device) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El dispositivo con id: ' + id + 'no existe',
                errors: { message: 'No existe un dispositivo con ese id' }
            });

        }

        device.tipo = body.tipo;
        device.nombre = body.nombre;
        device.corp = body.corp;


        device.save((err, deviceGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el dispositivo',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                device: deviceGuardado
            });

        });

    });

});

// ==================================================
// Alta un Dispositivo
// ===================================================
app.post('/', Auth.verificaToken, (req, res) => {
    var body = req.body;

    var device = new Device({

        imei: body.imei,
        tipo: body.tipo,
        nombre: body.nombre,
        usuario: req.usuario._id,
        corp: body.corp
    });

    device.save((err, deviceGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el Dispositivo',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            device: deviceGuardado,

        });

    });
});

// ==================================================
// Borrar dispositivo by ID
// ===================================================
app.delete('/:id', Auth.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Device.findByIdAndRemove(id, (err, deviceBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Device Borrado correctamente',
                errors: err
            });
        }
        if (!deviceBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El dispositivo no existe',
                errors: { message: 'Verifique su id' }
            });
        }
        res.status(200).json({
            ok: true,
            device: deviceBorrado
        });

    });
});
module.exports = app;