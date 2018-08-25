// Requires

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// inicializar variables
var app = express();

//Body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var corpRoutes = require('./routes/corp');
var deviceRoutes = require('./routes/device');
var searchRoutes = require('./routes/search');
var uploadRoutes = require('./routes/upload');
var imgRoutes = require('./routes/img');

// conexión a la BD

mongoose.connection.openUri('mongodb://127.0.0.1:27017/sosDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Server index config

//var serverIndex = require('serve-index');
//app.use(express.static(__dirname + '/'));
//app.use('/uploads', serverIndex(__dirname + '/uploads'));

// Rutas
app.use('/usuarios', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/devices', deviceRoutes);
app.use('/corps', corpRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imgRoutes);
app.use('/', appRoutes);


// Escuchar peticiones

app.listen(3000, () => {
    console.log('Espress server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});