const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  status: { type: String, default: 'Al día' },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  }
});

module.exports = mongoose.model('Tenant', tenantSchema);
