import React from 'react';
import { Typography } from '@mui/material';

function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mt: 8, mb: 4 }}
    >
      {'Copyright © HireColin '}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default Copyright;
