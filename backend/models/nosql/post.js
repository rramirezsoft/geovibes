const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const PostSchema = new mongoose.Schema({
    userPlace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserPlace',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    photos: [{
        type: String,
        trim: true
    }],
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    }
}, {
    timestamps: true
});

PostSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
module.exports = mongoose.model('Post', PostSchema);