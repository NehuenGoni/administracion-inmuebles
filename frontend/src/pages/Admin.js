import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  IconButton,
  Chip,
  Box,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  fetchAllUsers,
  fetchValidPermissions,
  updateUserRole,
  updateUserPermissions,
  deleteUser,
} from '../api/adminApi';

const PERMISSION_LABELS = {
  'tenants:read': 'Ver Inquilinos',
  'tenants:write': 'Editar Inquilinos',
  'payments:read': 'Ver Pagos',
  'payments:write': 'Editar Pagos',
  'receipts:read': 'Ver Recibos',
};

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [validPermissions, setValidPermissions] = useState([]);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [openPermissionsDialog, setOpenPermissionsDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      const [usersData, permsData] = await Promise.all([
        fetchAllUsers(),
        fetchValidPermissions(),
      ]);
      setUsers(usersData);
      setValidPermissions(permsData);
    } catch (err) {
      setError('Error al cargar los datos');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenRoleDialog = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setOpenRoleDialog(true);
  };

  const handleOpenPermissionsDialog = (user) => {
    setSelectedUser(user);
    setSelectedPermissions([...user.permissions]);
    setOpenPermissionsDialog(true);
  };

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleUpdateRole = async () => {
    try {
      await updateUserRole(selectedUser._id, selectedRole);
      setSuccess(`Rol de ${selectedUser.name} actualizado`);
      setOpenRoleDialog(false);
      loadData();
    } catch (err) {
      setError('Error al actualizar el rol');
    }
  };

  const handleUpdatePermissions = async () => {
    try {
      await updateUserPermissions(selectedUser._id, selectedPermissions);
      setSuccess(`Permisos de ${selectedUser.name} actualizados`);
      setOpenPermissionsDialog(false);
      loadData();
    } catch (err) {
      setError('Error al actualizar los permisos');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUser._id);
      setSuccess(`Usuario ${selectedUser.name} eliminado`);
      setOpenDeleteDialog(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar el usuario');
    }
  };

  const handlePermissionToggle = (permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Administración de Usuarios
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Rol</strong></TableCell>
              <TableCell><strong>Permisos</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                    color={user.role === 'superadmin' ? 'secondary' : 'primary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {user.role === 'superadmin' ? (
                      <Chip label="Todos los permisos" size="small" color="secondary" variant="outlined" />
                    ) : (
                      user.permissions?.map((perm) => (
                        <Chip
                          key={perm}
                          label={PERMISSION_LABELS[perm] || perm}
                          size="small"
                          variant="outlined"
                        />
                      ))
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenRoleDialog(user)}
                    title="Cambiar rol"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="info"
                    onClick={() => handleOpenPermissionsDialog(user)}
                    title="Editar permisos"
                    disabled={user.role === 'superadmin'}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDeleteDialog(user)}
                    title="Eliminar usuario"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog: Cambiar Rol */}
      <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)}>
        <DialogTitle>Cambiar rol de {selectedUser?.name}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Rol</InputLabel>
            <Select
              value={selectedRole}
              label="Rol"
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="superadmin">Super Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoleDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdateRole} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Editar Permisos */}
      <Dialog open={openPermissionsDialog} onClose={() => setOpenPermissionsDialog(false)}>
        <DialogTitle>Permisos de {selectedUser?.name}</DialogTitle>
        <DialogContent>
          <FormGroup>
            {validPermissions.map((perm) => (
              <FormControlLabel
                key={perm}
                control={
                  <Checkbox
                    checked={selectedPermissions.includes(perm)}
                    onChange={() => handlePermissionToggle(perm)}
                  />
                }
                label={PERMISSION_LABELS[perm] || perm}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPermissionsDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdatePermissions} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Confirmar Eliminación */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Eliminar usuario</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que querés eliminar a <strong>{selectedUser?.name}</strong>?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin;
