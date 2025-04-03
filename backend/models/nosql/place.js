const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const PLACE_CATEGORIES = require('../../constants/placeCategories');

const PlaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        default: 'other'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere',
        },
    },
    address: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: false,
    },
    visitedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

PlaceSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
module.exports = mongoose.model('Place', PlaceSchema);
