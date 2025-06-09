import React, { useState, useEffect } from 'react';
import moment from 'moment'
import jsPDF from "jspdf";
import { getTenants } from '../api/tenantsApi';
import { fetchPayments, createPayment, updatePayment, deletePayment  } from '../api/paymentsApi';

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
  const [isEditMode, setIsEditMode] = useState(false)
  const [tenantsList, setTenantsList] = useState([])
  const [paymentsList, setPaymentsList] = useState([])
  const [successMessage, setSuccessMessage] = useState('');
  const [newPayment, setNewPayment] = useState({
    tenantId: '',
    amount: '',
    date: moment().format('YYYY-MM-DD'),
    description: '',
  });



  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('amount');

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

    useEffect(() => {
      fetchTenants();
      fetchPaymentsUser();
    }, []);

  // const stableSort = (array, comparator) => {
  //   const stabilizedThis = array.map((el, index) => [el, index]);
  //   stabilizedThis.sort((a, b) => {
  //     const order = comparator(a[0], b[0]);
  //     if (order !== 0) return order;
  //     return a[1] - b[1];
  //   });
  //   return stabilizedThis.map((el) => el[0]);
  // };

  // const descendingComparator = (a, b, orderBy) => {
  //   if (b[orderBy] < a[orderBy]) {
  //     return -1;
  //   }
  //   if (b[orderBy] > a[orderBy]) {
  //     return 1;
  //   }
  //   return 0;
  // };

  // const comparator = (a, b) => {
  //   return order === 'desc'
  //     ? descendingComparator(a, b, orderBy)
  //     : descendingComparator(a, b, orderBy);
  // };

  // const formatDate = (date) => {
  //   if (!date) return '';
  //   const [year, month, day] = date.split('-');
  //   return `${day}-${month}-${year}`;
  // };

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
        [name]: value ? parseDate(value) : '',
      }));
    } else {
      setNewPayment((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDialogToggle = () => {
    setOpenModal(!openModal);
  };

  
  const fetchPaymentsUser = async () => {
    try {
      const response = await fetchPayments()
      setPaymentsList(response); 
    } catch (error) {
      console.error('Error al obtener los pagos:', error);
    }
  };

  const fetchTenants = async () => {
    try {
      const tenantsData = await getTenants()
      setTenantsList(tenantsData);
    } catch (error) {
      console.error('Error al obtener inquilinos:', error);
    }
  };

  const handleCreatePayment = async () => {
    try {
      const paymentToSubmit = { ...newPayment };
  
      if (paymentToSubmit.tenantId && typeof paymentToSubmit.tenantId === 'object') {
        paymentToSubmit.tenantId = paymentToSubmit.tenantId._id;
      }
      await createPayment(paymentToSubmit);

      setSuccessMessage('Pago creado correctamente');
      fetchPaymentsUser();
      setNewPayment({ amount: '', date: moment().format('DD-MM-YYYY'), description: '', tenantId: '' });
      setOpenModal(false); 
    } catch (error) {
      console.error('Error al crear el pago:', error);
      setSuccessMessage('Error al crear el pago');
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updatePayment(newPayment)
      setSuccessMessage('Pago actualizado correctamente');
      fetchPaymentsUser();
      setOpenModal(false); 
    } catch (error) {
      console.error('Error al actualizar el pago:', error);
    }
  };

  const [openModal, setOpenModal] = useState(false)

  const handleOpenModal = (payment = null) => {
    console.log(payment)
    if (payment) {
      setNewPayment(payment);
      setIsEditMode(true); 
    } else {
      setNewPayment({ tenantId: '', amount: '', date: moment().format('DD-MM-YYYY'), description: '' })
      setIsEditMode(false);
    }
    setOpenModal(true);
  };
  
  const handleDeletePayment = async (paymentId) => {
    try {
      const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este pago?');
      if (!confirmDelete) return;

      await deletePayment(paymentId);
      setSnackbarMessage('Pago eliminado correctamente');
      setOpenSnackbar(true);
      setSuccessMessage('Pago eliminado correctamente');
      fetchPaymentsUser();
    } catch (error) {
      console.error('Error al eliminar el pago:', error.response?.data || error.message);
      setSnackbarMessage('Hubo un problema al eliminar el pago');
      setOpenSnackbar(true);
    }
  };

  const handlePrintReceipt = (payment) => {
    const doc = new jsPDF();

    // Dimensiones
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const receiptHeight = pageHeight / 2;

    // Borde rectangular
    doc.rect(10, 10, pageWidth - 20, receiptHeight - 20); 

    // Encabezado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Recibo de Pago", pageWidth / 2, 20, { align: "center" });

    // Línea divisoria
    doc.setLineWidth(0.5);
    doc.line(20, 25, pageWidth - 20, 25);

    // Contenido
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const startY = 40;
    const lineSpacing = 10;

    doc.text(`Fecha: ${payment.date}`, 20, startY + lineSpacing * 2);
    doc.text(`Nombre del inquilino: ${payment.tenantId.name}`, 20, startY);
    doc.text(`Monto: $${payment.amount}`, 20, startY + lineSpacing);
    doc.text(`Descripción: ${payment.description}`, 20, startY + lineSpacing * 3);
    doc.text(`Número de Recibo: ${payment.receiptNumber}`, 20, startY + lineSpacing * 4);

    // Pie de recibo dentro del área definida
    const footerY = receiptHeight - 20;
    doc.setLineWidth(0.2);
    doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);
    doc.setFontSize(10);
    doc.text("Gracias por su pago", pageWidth / 2, footerY, { align: "center" });

    // Guardar como PDF
    doc.save(`Recibo_${payment.receiptNumber}.pdf`);
  };

  
  return (
    <div>
      <h1>Gestión de Pagos</h1>
      <Button variant="contained" 
              color="primary" 
              onClick={() => {
                setNewPayment({ amount: '', date: moment().format('DD-MM-YYYY'), description: '', tenantId: ''})
                handleOpenModal();     
              }}
      >
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
            {paymentsList?.map((payment) => (
              <TableRow key={payment?._id}>
                <TableCell>{payment?.tenantId.name}</TableCell>
                <TableCell>${payment?.amount}</TableCell>
                <TableCell>{ payment?.date}</TableCell>
                <TableCell>{payment?.description}</TableCell>
                <TableCell>{payment?.receiptNumber}</TableCell>
                <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePrintReceipt(payment)}>
                    Imprimir
                </Button>
                <Button                   
                  variant="contained"
                  color="default" 
                  onClick={() => handleOpenModal(payment)}>
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


      {/* Create Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
      <DialogTitle>{isEditMode ? 'Editar Pago' : 'Crear Pago'}</DialogTitle>
        <DialogContent>
        <TextField
          name="tenantId"
          select
          label="Inquilino"
          fullWidth
          margin="normal"
          value={newPayment?.tenantId?._id || ''}
          onChange={handleChange}
        >
        {tenantsList?.map((tenant) => (
        <MenuItem key={tenant} value={tenant}>
          {tenant.name}
        </MenuItem>
        ))}
        </TextField>
        <TextField
          name="department"
          label="Departamento"
          fullWidth
          margin="normal"
          value={newPayment?.tenantId?.department || ''}
          InputProps={{
            readOnly: true,
          }}
        />
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
