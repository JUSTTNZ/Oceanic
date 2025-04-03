import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String },
    bankDetails: {
        accountName: String,
        accountNumber: String,
        bankName: String,
    },
}, { timestamps: true });
// ✅ Access token generator
userSchema.methods.generateAccessToken = function () {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || '1d';
    if (!accessTokenSecret) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined in environment variables');
    }
    return jwt.sign({ _id: this._id, role: this.role }, accessTokenSecret, { expiresIn: accessTokenExpiry });
};
// ✅ Refresh token generator
// ✅ Access token generator
userSchema.methods.generateAccessToken = function () {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || '1d';
    if (!accessTokenSecret) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined in environment variables');
    }
    return jwt.sign({ _id: this._id, role: this.role }, accessTokenSecret, { expiresIn: accessTokenExpiry });
};
export const User = mongoose.model('User', userSchema);
