import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Chip,
} from '@mui/material';

const VoucherCard = ({ voucher, onRedeem, isLoading }) => {
  const { tokenId, name, description, image, isRedeemed } = voucher;

  const handleRedeem = () => {
    if (!isRedeemed) {
      onRedeem(tokenId);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        opacity: isRedeemed ? 0.6 : 1,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ':hover': {
          transform: 'translateY(-5px)',
          boxShadow: (theme) => `0 8px 25px ${theme.palette.primary.main}33`,
        },
      }}
    >
      <CardMedia component="img" height="200" image={image} alt={name} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Chip label={`#${tokenId.toString()}`} sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          fullWidth
          variant="contained"
          color={isRedeemed ? 'success' : 'secondary'}
          onClick={handleRedeem}
          disabled={isRedeemed || isLoading}
        >
          {isRedeemed ? 'Telah Digunakan' : 'Gunakan Voucher'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default VoucherCard;
