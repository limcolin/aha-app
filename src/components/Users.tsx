import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import Title from './Title';
import { UserInfo } from '../config/types';

interface Props {
  data: Array<UserInfo>;
}

export default function Users({ data }: Props) {
  return (
    <>
      <Title>Users</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Signed Up</TableCell>
            <TableCell>Times Logged In</TableCell>
            <TableCell>Last Session</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((user) => (
            <TableRow key={user.email}>
              <TableCell>{user.displayName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.creationTime}</TableCell>
              <TableCell>{user.timesLoggedIn}</TableCell>
              <TableCell>{user.lastSignInTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
