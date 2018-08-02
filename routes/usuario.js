var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var Auth = require('../middlewares/auth');

var app = express();


var Usuario = require('../models/usuario');


// ==================================================
// Listar Usuarios
// ===================================================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(

            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios
                    });
                }
            });

});


// ==================================================
// Actualizar usuarios
// ===================================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'usuario no encontrado',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con id' + id + 'no existe',
                errors: { message: 'No existe un usuario con ese id' }
            });

        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;


        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar al usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = '';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});

// ==================================================
// Crear usuarios
// ===================================================
app.post('/', Auth.verificaToken, (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role

    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el usuario',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotken: req.usuario
        });

    });
});

// ==================================================
// Borrar usuario by ID
// ===================================================
app.delete('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Usuario Borrado correctamente',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no existe',
                errors: { message: 'Verifique su id' }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});
module.exports = app;