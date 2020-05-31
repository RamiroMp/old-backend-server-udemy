const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const medicoSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', requried: [true, 'el Id hospital es obligatorio'] }

}, { collection: 'medicos' });




module.exports = mongoose.model('Medico', medicoSchema);