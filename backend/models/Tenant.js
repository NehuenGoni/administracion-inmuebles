const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  status: { type: String, default: 'Al día' },
});

module.exports = mongoose.model('Tenant', tenantSchema);
