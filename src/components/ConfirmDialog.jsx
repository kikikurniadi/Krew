import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title" sx={{ fontFamily: '"Press Start 2P", cursive' }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Batal
        </Button>
        <Button onClick={onConfirm} variant="contained" color="primary" autoFocus>
          Konfirmasi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
