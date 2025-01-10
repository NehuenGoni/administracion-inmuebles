import React, { useState, useEffect } from 'react';
import api from '../apiConfig'
import { Container, 
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
    List, 
    ListItem, 
    ListItemText,
    TextField
} from '@mui/material';


const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [openPaymentsDialog, setOpenPaymentsDialog] = useState(false);
  const [openCreateTenantDialog, setOpenCreateTenantDialog] = useState(false)
  const [newTenant, setNewTenant] = useState({ name: '', department: '' });
  const [selectedTenantPayments, setSelectedTenantPayments] = useState([])

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editableTenant, setEditableTenant] = useState(null)
  
  useEffect(() => {
    
  },[openPaymentsDialog, openCreateTenantDialog])

  const handleClickOpenCreateTenant = () => {
    setOpenCreateTenantDialog(true);
  };

  const handleCloseCreateTenantDialog = () => {
    setOpenCreateTenantDialog(false);
    setNewTenant({ name: '', department: '' });
  };

  const getTenants = async () => {
    try {
      const response = await api.get('/tenants');
      setTenants(response.data); 
    } catch (error) {
      console.error('Error al obtener los inquilinos:', error);
    }
  };

  const handleCreateTenant = async (tenantId) => {
    try {
      const response = await api.post('/tenants', {
        name: newTenant.name,
        department: newTenant.department,
        status: null, 
      });
      setTenants([...tenants, response.data]);
      handleCloseCreateTenantDialog();
      window.location.reload()
    } catch (error) {
      console.error('Error al crear un nuevo inquilino:', error);
    }
  };
    
  const handleViewPayments = async (tenantId) => {
    setOpenPaymentsDialog(true);
    try {
      const resp = await api.get(`/payments/tenant/${tenantId}`);
      setSelectedTenantPayments(resp.data); 
      setOpenPaymentsDialog(true); 
    } catch (error) {
      console.error('Error al obtener los pagos del inquilino:', error);
    }
  };

  const handleClosePaymentsDialog = () => {
    setOpenPaymentsDialog(false);
  };

  const handleDeleteTenant = async (tenantId) => {
    try {
      await api.delete(`/tenants/${tenantId}`);
      setTenants(prevTenants =>
        prevTenants.filter(tenant => tenant._id !== tenantId)
      );
  
    } catch (error) {
      console.error('Error al eliminar el inquilino:', error);
    }
  };

  const handleOpenEditDialog = (tenant) => {
    setEditableTenant(tenant);
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await api.put(`/tenants/${editableTenant._id}`, editableTenant);
      setTenants(prevTenants =>
        prevTenants.map(tenant =>
          tenant._id === editableTenant._id ? response.data : tenant
        )
      );
      setOpenEditDialog(false);
      window.location.reload()
    } catch (error) {
      console.error('Error al actualizar el inquilino:', error);
    }
  };

  useEffect(() => {
    getTenants();
  }, []);

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Lista de Inquilinos
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => handleClickOpenCreateTenant()} 
        sx={{ marginBottom: 2 }}>
            Crear Inquilino
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Departamento</TableCell>
              <TableCell>Estado de Pago</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>{tenant.id}</TableCell>
                <TableCell>{tenant.name}</TableCell>
                <TableCell>{tenant.department}</TableCell>
                <TableCell>{tenant.status}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="small"
                    sx={{ marginRight: 1 }}
                    onClick={() => handleViewPayments(tenant._id)}
                  >
                    Ver Pagos
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    size="small"
                    sx={{ marginRight: 1 }}
                    onClick={() => handleOpenEditDialog(tenant)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small"
                    onClick={() => handleDeleteTenant(tenant._id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openCreateTenantDialog} onClose={handleCloseCreateTenantDialog}>
        <DialogTitle>Crear Inquilino</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            value={newTenant.name}
            onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Departamento"
            fullWidth
            value={newTenant.department}
            onChange={(e) => setNewTenant({ ...newTenant, department: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateTenantDialog}>Cancelar</Button>
          <Button onClick={handleCreateTenant} variant="contained" color="primary">
            Crear
          </Button>
        </DialogActions>
        </Dialog>
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
      <DialogTitle>Editar Inquilino</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            value={editableTenant?.name || ''}
            onChange={(e) => setEditableTenant({ ...editableTenant, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Departamento"
            fullWidth
            value={editableTenant?.department || ''}
            onChange={(e) => setEditableTenant({ ...editableTenant, department: e.target.value })}
          />
          </DialogContent>
          <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Guardar 
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openPaymentsDialog} onClose={handleClosePaymentsDialog}>
        <DialogTitle>Historial de Pagos</DialogTitle>
        <DialogContent>
          {selectedTenantPayments.length > 0 ? (
            <List>
              {selectedTenantPayments.map((payment, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`Fecha: ${payment.date}`} secondary={`Monto: $${payment.amount}`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No hay pagos registrados para este inquilino.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentsDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Tenants;
