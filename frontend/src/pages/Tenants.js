import React, { useState, useEffect } from 'react';
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

const initialTenants = [
  { id: 1, name: 'Juan Pérez', department: 'A1', status: 'Al día' },
  { id: 2, name: 'Ana García', department: 'B2', status: 'Atrasado' },
  { id: 3, name: 'Carlos López', department: 'C3', status: 'Al día' },
];

// Pagos simulados para cada inquilino
const paymentsData = {
  1: [
    { date: '2024-09-01', amount: 50000 },
    { date: '2024-08-01', amount: 50000 },
  ],
  2: [
    { date: '2024-09-01', amount: 30000 },
    { date: '2024-07-01', amount: 30000 },
  ],
  3: [
    { date: '2024-09-01', amount: 40000 },
    { date: '2024-08-01', amount: 40000 },
  ],
};

const Tenants = () => {
  const [tenants, setTenants] = useState(initialTenants);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [openPaymentsDialog, setOpenPaymentsDialog] = useState(false);
  const [openCreateTenantDialog, setOpenCreateTenantDialog] = useState(false)
  const [newTenant, setNewTenant] = useState({ name: '', department: '' });

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

  const handleCreateTenant = () => {
    const newId = tenants.length > 0 ? tenants[tenants.length - 1].id + 1 : 1;
    const newTenantData = { ...newTenant, id: newId, status: 'Al día' };
    setTenants([...tenants, newTenantData]);
    handleCloseCreateTenantDialog(); // Cerrar el diálogo al guardar
  };
    
  const handleViewPayments = (tenantId) => {
    const payments = paymentsData[tenantId] || [];
    setSelectedPayments(payments);
    setOpenPaymentsDialog(true);
  };

  const handleClosePaymentsDialog = () => {
    setOpenPaymentsDialog(false);
  };

  const handleDeleteTenant = (id) => {
    const updatedTenants = tenants.filter(tenant => tenant.id !== id);
    setTenants(updatedTenants);
  };

  const handleOpenEditDialog = (tenant) => {
    setEditableTenant(tenant);
    setOpenEditDialog(true);
  };

  const handleSaveEdit = () => {
    setTenants(prevTenants =>
      prevTenants.map(tenant =>
        tenant.id === editableTenant.id ? editableTenant : tenant
      )
    );
    setOpenEditDialog(false);
  };

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Lista de Inquilinos
      </Typography>
      {/* Botón para abrir el diálogo de crear inquilino */}
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
                    onClick={() => handleViewPayments(tenant.id)}
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
                    onClick={() => handleDeleteTenant(tenant.id)}
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
          {selectedPayments.length > 0 ? (
            <List>
              {selectedPayments.map((payment, index) => (
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
