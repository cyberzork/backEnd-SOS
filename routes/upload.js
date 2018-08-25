var express = require('express');
var fileUpload = require('express-fileupload');

var app = express();
var fs = require('fs');

var Corp = require('../models/corp');
var Device = require('../models/device');
var Usuario = require('../models/usuario');

// default options
app.use(fileUpload());

// Rutas recibe  2 parámetros path o raíz, call back function ( tiene 3 parámetros request, response y un next "Lo que le dices que cuando se ejecute con un middlewere" )
app.put('/:type/:id', (req, res, next) => {

    var type = req.params.type;
    var id = req.params.id;

    // Tipos de colecciones

    var tiposValidos = ['corps', 'devices', 'usuarios'];
    if (tiposValidos.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errors: { message: 'Tipo de colección no válida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccinó nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener el nombre del archivo

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];


    // Extensiones permitidas  
    var extensionValidas = ['png', 'jpg', 'gif', 'jpeg', 'svg'];

    if (extensionValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Sólo se permiten las siguientes extensiones: ' + extensionValidas.join(', ') }
        });
    }
    // Renombrar archivo personalizado   
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // Mover archivo del temporal a un path

    var path = `./uploads/${ type }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subiPorTipo(type, id, nombreArchivo, res);

        //res.status(200).json({
        //    ok: true,
        //    mensaje: 'Archivo movido',
        //    extensionArchivo: extensionArchivo
        //});
    });

});

function subiPorTipo(type, id, nombreArchivo, res) {
    if (type == 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'El usuario no existe por favor verifique. ',
                    errors: { mensage: 'Usuario no existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Sí existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ''; // Para no mandar en pantalla el password

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada ',
                    usuario: usuarioActualizado
                });

            });

        });
    }

    if (type == 'corps') {
        Corp.findById(id, (err, corp) => {

            if (!corp) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'La empresa no existe por favor verifique. ',
                    errors: { mensage: 'Empresa no existe' }
                });
            }

            var pathViejo = './uploads/corps/' + corp.img;

            // Sí existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            corp.img = nombreArchivo;
            corp.save((err, corpActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Empresa actualizada ',
                    corp: corpActualizado
                });

            });

        });

    }

    if (type == 'devices') {

        Device.findById(id, (err, device) => {

            if (!device) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'El dispositivo no existe por favor verifique. ',
                    errors: { mensage: 'Dispositivo no existe' }
                });
            }

            var pathViejo = './uploads/device/' + device.img;

            // Sí existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            device.img = nombreArchivo;
            device.save((err, deviceActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Empresa actualizada ',
                    device: deviceActualizado
                });

            });

        });

    }

}

module.exports = app;