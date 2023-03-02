/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, TextField, Grid, Box, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { resetPassword } from '../config/firebase';
import { ResetPasswordFormData } from '../config/types';
import { updatePasswordSchema } from '../config/schemas';

interface Props {
  verified: boolean;
  redirectTimer: number;
  oobCode: string;
}

export default function ResetPasswordForm({
  verified,
  redirectTimer,
  oobCode,
}: Props) {
  const [authenticating, setAuthenticating] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(updatePasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setAuthenticating(true);
    const { newPassword } = data;
    await resetPassword(oobCode, newPassword);
    reset();
    setAuthenticating(false);
    navigate('/login');
  };

  return (
    <>
      <Typography
        component="h1"
        variant="h5"
      >
        Reset Password
      </Typography>
      {verified ? (
        <Box
          component="form"
          noValidate
          sx={{ mt: 3 }}
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
                label="New Password"
                type="newPassword"
                {...register('newPassword', { required: true })}
                error={!!errors.newPassword}
                helperText={
                  errors.newPassword ? errors.newPassword?.message : ''
                }
              />
            </Grid>
            <Grid
              item
              xs={12}
            >
              <TextField
                required
                fullWidth
                label="Confirm Password"
                type="password"
                {...register('confirmPassword', { required: true })}
                error={!!errors.confirmPassword}
                helperText={
                  errors.confirmPassword ? errors.confirmPassword?.message : ''
                }
              />
            </Grid>
          </Grid>
          <LoadingButton
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit(onSubmit)}
            loading={authenticating}
          >
            Update Password
          </LoadingButton>
          <Grid
            container
            justifyContent="center"
          >
            <Grid item>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                underline="hover"
              >
                Back to Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Typography
          component="h1"
          variant="subtitle1"
          sx={{ my: 1 }}
        >
          Invalid link. Redirecting in {redirectTimer}
        </Typography>
      )}
    </>
  );
}
