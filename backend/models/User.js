import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    department: { type: String, default: '' },
    year: { type: Number, required: true, enum: [1, 2] },
    otp: { type: String },
    otpExpiry: { type: Date }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
