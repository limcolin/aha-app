import React from 'react';
import Typography from '@mui/material/Typography';

interface Props {
  children: string;
}

export default function Title({ children }: Props) {
  return (
    <Typography
      component="h2"
      variant="h6"
      color="primary"
      gutterBottom
    >
      {children}
    </Typography>
  );
}
