var express = require('express');

var Auth = require('../middlewares/auth');

var app = express();


var Corp = require('../models/corp');


// ==================================================
// Listar Empresas
// ==================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Corp.find({})
        .skip(desde)
        .limit(10)
        .populate('usuario', 'nombre email')
        .exec(

            (err, corps) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Empresa',
                        errors: err
                    });
                } else {
                    Corp.count({}, (err, conteo) => {
                        res.status(200).json({
                            ok: true,
                            corps: corps,
                            total: conteo
                        });

                    });
                }
            });

});

// ==================================================
// Alta una Empresa
// ===================================================
app.post('/', Auth.verificaToken, (req, res) => {
    var body = req.body;

    var corp = new Corp({

        nombre: body.nombre,
        usuario: req.usuario._id,
    });

    corp.save((err, corpGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al dar de alta la Empresa',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            corp: corpGuardado,

        });

    });
});

// ==================================================
// Actualizar Empresas
// ===================================================
app.put('/:id', Auth.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Corp.findById(id, (err, corp) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Empresa no encontrada',
                errors: err
            });
        }

        if (!corp) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La Empresa con id: ' + id + 'no existe',
                errors: { message: 'No existe un dispositivo con ese id' }
            });

        }

        corp.nombre = body.nombre;


        corp.save((err, corpGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la Empresa',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                corp: corpGuardado
            });

        });

    });

});



// ==================================================
// Borrar Empresa by ID
// ===================================================
app.delete('/:id', Auth.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Corp.findByIdAndRemove(id, (err, corpBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Empresa borrada correctamente',
                errors: err
            });
        }
        if (!corpBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La empresa no existe',
                errors: { message: 'Verifique su id' }
            });
        }
        res.status(200).json({
            ok: true,
            corp: corpBorrado
        });

    });
});
module.exports = app;