const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema;

const rolesValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es un rol permitido'
};


const usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, "El nombre es requerido"]
    },
    email: {
        type: String,
        required: [true, "El correo es requerido"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "El password es requerido"],

    },
    img: {
        type: String

    },
    role: {
        type: String,
        required: true,
        default: "USER_ROLE",
        enum: rolesValidos
    }




});
usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);