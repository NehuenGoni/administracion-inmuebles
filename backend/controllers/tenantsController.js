const Tenant = require('../models/Tenant');

const getTenants = async (req, res) => {
  const userId = req.user.id;

  try {
    const tenants = await Tenant.find({ user: userId });
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTenant = async (req, res) => {
  const userId = req.user.id;
  const { name, department, email, status } = req.body;

  if (!name || !department || !email) {
    return res.status(400).json({ message: 'Nombre, email y departamento son obligatorios' });
  }

  const tenant = new Tenant({
    name,
    email,
    department,
    status: status || 'Al día',
    user: userId,
  });

  try {
    const newTenant = await tenant.save();
    res.status(201).json(newTenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: 'Inquilino no encontrado' });
    }

    if (tenant.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Sin autorización para esta acción.' });
    }

    const updatedTenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: 'Inquilino no encontrado' });
    }

    if (tenant.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Sin autorización para esta acción.' });
    }

    await Tenant.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Inquilino eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  getTenants,
  updateTenant,
  deleteTenant,
  createTenant
};