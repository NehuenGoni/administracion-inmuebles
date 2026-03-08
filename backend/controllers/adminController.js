const User = require('../models/User');

const VALID_PERMISSIONS = [
  'tenants:read',
  'tenants:write',
  'payments:read',
  'payments:write',
  'receipts:read',
];

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['superadmin', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el rol' });
  }
};

const updateUserPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    if (!Array.isArray(permissions) || !permissions.every(p => VALID_PERMISSIONS.includes(p))) {
      return res.status(400).json({
        message: 'Permisos inválidos',
        validPermissions: VALID_PERMISSIONS,
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { permissions },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar los permisos' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ message: 'No podés eliminarte a vos mismo' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

const getValidPermissions = (req, res) => {
  res.status(200).json(VALID_PERMISSIONS);
};

module.exports = {
  getAllUsers,
  updateUserRole,
  updateUserPermissions,
  deleteUser,
  getValidPermissions,
};
