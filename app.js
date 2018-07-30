// Requires

var express = require('express');
var mongoose = require('mongoose');


// inicializar variables
var app = express();

// conexión a la BD

mongoose.connection.openUri('mongodb://127.0.0.1:27017/sosDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas recibe  2 parámetros path o raíz, call back function ( tiene 3 parámetros request, response y un next "Lo que le dices que cuando se ejecute con un middlewere" )
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});

// Escuchar peticiones

app.listen(3000, () => {
    console.log('Espress server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});