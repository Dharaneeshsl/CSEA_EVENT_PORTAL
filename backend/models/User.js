import mongoose from 'mongoose';

// Basic User schema compatible with OTP login and optional password
// - email: unique identifier (normalized to lowercase)
// - year: 1 (first year) or 2 (second year)
// - password: optional (kept for compatibility if you also support password logins)
// - otp / otpExpiry: transient fields for email OTP verification
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false }, // optional hashed password
    department: { type: String, default: '' },
    year: { type: Number, required: true, enum: [1, 2] },
    otp: { type: String },
    otpExpiry: { type: Date }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.otp;
        delete ret.otpExpiry;
        return ret;
      }
    }
  }
);

// Ensure email is normalized prior to save (extra safety)
userSchema.pre('save', function(next) {
  if (this.email && typeof this.email === 'string') {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
