import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';

function TransferDialog({ open, onClose, onConfirm, voucherName, isPending }) {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const handleConfirm = () => {
    onConfirm(recipient, message);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Send "{voucherName}" as a Gift</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Enter the recipient's wallet address and an optional gift message.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Recipient Address"
          type="text"
          fullWidth
          variant="outlined"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Gift Message (Optional)"
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 24px' }}>
        <Button onClick={onClose} disabled={isPending}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!recipient || isPending}>
          {isPending ? <CircularProgress size={24} /> : 'Confirm & Send'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TransferDialog;
