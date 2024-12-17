const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Author', 'Reader'], default: 'Reader' },
    resetToken: { type: String },
    resetTokenExpires: {type: Date },
});

UserSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetTokenExpires = Date.now() + 10 * 60 * 1000;
    return resetToken; 
};

module.exports = mongoose.model('User', UserSchema);
