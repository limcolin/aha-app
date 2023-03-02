import * as React from 'react';
import { Typography } from '@mui/material';
import Title from './Title';

interface Props {
  title: string;
  data: number;
}

export default function Stats({ title, data }: Props) {
  return (
    <>
      <Title>{title}</Title>
      <Typography
        component="p"
        variant="h4"
      >
        {data}
      </Typography>
    </>
  );
}
