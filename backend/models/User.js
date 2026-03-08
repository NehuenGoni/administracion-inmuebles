const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['superadmin', 'admin'],
      default: 'admin',
    },
    permissions: {
      type: [String],
      default: ['tenants:read', 'tenants:write', 'payments:read', 'payments:write', 'receipts:read'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
