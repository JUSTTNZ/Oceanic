import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
const UserSchema = new Schema({
    supabase_user_id: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (email) => validator.isEmail(email),
            message: 'Please provide a valid email address',
        },
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin'],
        default: 'user',
    },
    phoneNumber: {
        type: String,
        trim: true,
        // keep your NG pattern if you want:
        match: [/^\+?\d{7,15}$/, 'Invalid phone'],
    },
    bankDetails: {
        bankName: String,
        accountNumber: String,
        accountName: String,
    },
    isVerified: { type: Boolean, default: true },
    isGoogleAuth: { type: Boolean, default: false },
}, { timestamps: true });
// ⚠️ No password fields, no bcrypt hooks, no JWT methods anymore.
export const User = mongoose.model('User', UserSchema);
//# sourceMappingURL=user.model.js.map