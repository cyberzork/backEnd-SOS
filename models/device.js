var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var devicesValidos = {
    values: ['MOTOCICLETA', 'TRANSPORTISTA', 'BOTON', 'MASCOTA'],
    message: '{VALUE no es un tipo permitido'
};


var Schema = mongoose.Schema;
var devicesSchema = new Schema({

    imei: { type: String, required: [true, 'Es necesario indicar un IMEI'] },
    tipo: { type: String, required: [true, 'Indique el tipo de dispositivo'] },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    corp: { type: Schema.Types.ObjectId, ref: 'Corp' }
}, { collection: 'devices' });


module.exports = mongoose.model('Device', devicesSchema);