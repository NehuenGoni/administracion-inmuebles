import React, { useState, useEffect } from 'react';
import moment from 'moment'
import axios from 'axios';
import api from '../apiConfig'
import {
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
  TextField,
  TableSortLabel,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [tenantsList, setTenantsList] = useState([])
  const [paymentsList, setPaymentsList] = useState([])
  const [successMessage, setSuccessMessage] = useState('');
  const [newPayment, setNewPayment] = useState({
    tenantId: '',
    tenantName: '',
    amount: '',
    date: moment().format('DD-MM-YYYY'),
    description: '',
  });

  useEffect(() => {
    fetchTenants();
    fetchPayments();
  }, []);


  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('amount');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const comparator = (a, b) => {
    return order === 'desc'
      ? descendingComparator(a, b, orderBy)
      : descendingComparator(a, b, orderBy);
  };

  const sortedPayments = stableSort(payments, comparator);

  const formatDate = (date) => {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };

  const parseDate = (date) => {
    if (!date) return '';
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date') {
      setNewPayment((prev) => ({
        ...prev,
        [name]: value ? formatDate(value) : '',
      }));
    } else {
      setNewPayment((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDialogToggle = () => {
    setOpenModal(!openModal);
  };



  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments');
      setPaymentsList(response.data); 
    } catch (error) {
      console.error('Error al obtener los pagos:', error);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await api.get('/tenants');
      setTenantsList(response.data);
    } catch (error) {
      console.error('Error al obtener inquilinos:', error);
    }
  };


  const handleCreatePayment = async () => {
    try {
      const response = await api.post('/payments', newPayment);
      setSuccessMessage('Pago creado correctamente');
      fetchPayments();
      setNewPayment({ amount: '', date: moment().format('DD-MM-YYYY'), description: '', tenantId: '' });
      setOpenModal(false); 
    } catch (error) {
      console.error('Error al crear el pago:', error);
      setSuccessMessage('Error al crear el pago');
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await api.put(`/payments/${newPayment._id}`, newPayment);
      setSuccessMessage('Pago actualizado correctamente');
      fetchPayments();
      setOpenModal(false); 
    } catch (error) {
      console.error('Error al actualizar el pago:', error);
    }
  };

  const [openModal, setOpenModal] = useState(false)

  const handleOpenModal = (payment = null) => {
    if (payment) {
      setNewPayment(payment);
      setIsEditMode(true); 
    } else {
      setNewPayment({ tenantId: '', amount: '', date: moment().format('DD-MM-YYYY'), description: '' })
      setIsEditMode(false);
    }
    setOpenModal(true);
  };
  
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const handleDeletePayment = async (paymentId) => {
    try {
      const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este pago?');
      if (!confirmDelete) return

      await api.delete(`/payments/${paymentId}`);
      setSnackbarMessage('Pago eliminado correctamente')
      setOpenSnackbar(true)
      setSuccessMessage('Pago eliminado correctamente');
      fetchPayments()
    } catch (error) {
        console.error('Error al eliminar el pago:', error.response?.data || error.message);
        setSnackbarMessage('Hubo un problema al eliminar el pago');
        setOpenSnackbar(true);
    }
  };


  
  return (
    <div>
      <h1>Gestión de Pagos</h1>
      <Button variant="contained" color="primary" onClick={handleDialogToggle}>
        Agregar Pago
      </Button>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'tenantName'}
                  direction={orderBy === 'tenantName' ? order : 'asc'}
                  onClick={() => handleRequestSort('tenantName')}
                >
                  Inquilino
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'amount'}
                  direction={orderBy === 'amount' ? order : 'asc'}
                  onClick={() => handleRequestSort('amount')}
                >
                  Monto
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderBy === 'date' ? order : 'asc'}
                  onClick={() => handleRequestSort('date')}
                >
                  Fecha
                </TableSortLabel>
              </TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Número de Recibo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentsList.map((payment) => (
              <TableRow key={payment._id}>
                <TableCell>{payment.tenantName}</TableCell> {/* Nombre del inquilino */}
                <TableCell>${payment.amount}</TableCell>
                <TableCell>{ payment.date}</TableCell>
                <TableCell>{payment.description}</TableCell>
                <TableCell>{payment.receiptNumber}</TableCell>
                <TableCell>
                <Button color="primary" onClick={() => handleOpenModal(payment)}>
                    Editar
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeletePayment(payment._id)}>
                    Eliminar
                </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      {/* Modal para agregar un nuevo pago */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
      <DialogTitle>{isEditMode ? 'Editar Pago' : 'Crear Pago'}</DialogTitle>
        <DialogContent>
        <TextField
            name="tenantId"
            select
            label="Inquilino"
            fullWidth
            margin="normal"
            value={newPayment.tenantId}
            onChange={handleChange}
        >
        {tenantsList.map((tenant) => (
        <MenuItem key={tenant._id} value={tenant._id}>
          {tenant.name}
        </MenuItem>
        ))}
        </TextField>
          <TextField
            name="amount"
            label="Monto"
            type="number"
            fullWidth
            margin="normal"
            value={newPayment.amount}
            onChange={handleChange}
          />
          <TextField
            name="date"
            label="Fecha"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={parseDate(newPayment.date)}
            onChange={handleChange}
          />
          <TextField
            name="description"
            label="Descripción"
            fullWidth
            margin="normal"
            value={newPayment.description}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogToggle} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={isEditMode ? handleSaveEdit : handleCreatePayment}
            color="primary"
            variant="contained"
        >
            {isEditMode ? 'Guardar Cambios' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
      {successMessage && (
      <Snackbar
      open={openSnackbar}
      autoHideDuration={6000}
      onClose={() => setOpenSnackbar(false)}
    >
      <Alert onClose={() => setOpenSnackbar(false)} severity="success">
        {snackbarMessage}
      </Alert>
    </Snackbar>
    )}

    </div>
  );
};

export default Payments;
