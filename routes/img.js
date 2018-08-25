var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');


// Rutas recibe  2 parámetros path o raíz, call back function ( tiene 3 parámetros request, response y un next "Lo que le dices que cuando se ejecute con un middlewere" )
app.get('/:type/:img', (req, res, next) => {

    var type = req.params.type;
    var img = req.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${  type }/${ img }`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImagen);
    }
});



module.exports = app;