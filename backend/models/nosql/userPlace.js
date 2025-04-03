const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const UserPlaceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    status: {
        type: String,
        enum: ['visited', 'pending', 'favorite'],
        required: true
    },
    visitedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

UserPlaceSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
module.exports = mongoose.model('UserPlace', UserPlaceSchema);