const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const { generateVerificationCode } = require('../../utils/generateCode');

const UserSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        trim: true,
        default: null
    },
    lastName: {
        type: String,
        trim: true,
        default: null
    },
    birthDate: {
        type: Date,
        default: null
    },
    profilePicture: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    }, 
    emailVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
        required: true,
        default: generateVerificationCode,
    },
    verificationAttempts: {
        type: Number,
        default: 3, // Si el usuario falla 3 veces, se bloquea
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});


UserSchema.plugin(mongooseDelete, {deletedAt: true, overrideMethods: 'all' });
module.exports = mongoose.model('User', UserSchema);
