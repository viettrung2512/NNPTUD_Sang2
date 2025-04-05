const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    text: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, default: 0 },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', default: null } // Liên kết với menu cha
});

module.exports = mongoose.model('Menu', menuSchema);
