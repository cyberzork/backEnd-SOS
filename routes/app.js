var express = require('express');

var app = express();


// Rutas recibe  2 parámetros path o raíz, call back function ( tiene 3 parámetros request, response y un next "Lo que le dices que cuando se ejecute con un middlewere" )
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});



module.exports = app;