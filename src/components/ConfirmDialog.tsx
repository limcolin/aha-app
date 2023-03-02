/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { reauthenticate } from '../config/firebase';
import { ReauthenticateFormData } from '../config/types';

interface Props {
  open: boolean;
  onClose: (value?: boolean) => void;
  provider: string;
}

export default function ConfirmDialog({ open, onClose, provider }: Props) {
  const [authenticating, setAuthenticating] = useState(false);

  const validationSchema = yup.object().shape({
    password: yup.string().required('Password is required'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReauthenticateFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: ReauthenticateFormData) => {
    setAuthenticating(true);
    const { password } = data;
    const success = await reauthenticate(password);
    reset();
    setAuthenticating(false);
    onClose(success);
  };

  const handleConfirm = async () => {
    const success = await reauthenticate();
    onClose(success);
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Enter your password to delete your account.</DialogTitle>
      <DialogContent>
        This action is irreversible and you will lose all your data.
      </DialogContent>
      <DialogActions>
        {provider === 'password' ? (
          <Box
            component="form"
            noValidate
            sx={{
              width: '100%',
            }}
          >
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
              >
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  {...register('password', { required: true })}
                  error={!!errors.password}
                  helperText={errors.password ? errors.password?.message : ''}
                />
              </Grid>
              <Grid
                item
                container
                spacing={2}
                xs={12}
                alignItems="center"
                justifyContent="flex-end"
              >
                <Grid item>
                  <LoadingButton
                    type="button"
                    variant="contained"
                    onClick={handleCancel}
                    loading={authenticating}
                  >
                    Cancel
                  </LoadingButton>
                </Grid>
                <Grid item>
                  <LoadingButton
                    type="button"
                    variant="contained"
                    color="error"
                    onClick={handleSubmit(onSubmit)}
                    loading={authenticating}
                  >
                    Yes Delete My Account
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box
            component="form"
            sx={{ mt: 2 }}
          >
            <Grid
              item
              container
              spacing={2}
              xs={12}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Grid item>
                <LoadingButton
                  type="button"
                  variant="contained"
                  onClick={handleCancel}
                  loading={authenticating}
                >
                  Cancel
                </LoadingButton>
              </Grid>
              <Grid item>
                <LoadingButton
                  type="button"
                  variant="contained"
                  color="error"
                  onClick={handleConfirm}
                  loading={authenticating}
                >
                  Yes Delete My Account
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
}
