import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema (
    {
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    role: {
        type: String,
        enum: ["user", "admin", "superadmin"],
        default: "user"
        },
    bankDetails: {
        bankName: String,
        accountNumber: String,
        accountName: String
    },
    isVerified: {
        type: Boolean,
        default: false
    }
    }, {  timestamps: true}
)

export const User = mongoose.model('User', userSchema);