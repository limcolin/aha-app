/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Avatar,
  CircularProgress,
  Container,
  Divider,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  auth,
  signInWithProvider,
  registerWithEmailAndPassword,
} from '../../config/firebase';
import { RegisterFormData } from '../../config/types';
import { registerSchema } from '../../config/schemas';
import Copyright from '../../components/Copyright';

function Register() {
  const [authenticating, setAuthenticating] = useState(false);

  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const handleGoogleAuth = async () => {
    setAuthenticating(true);
    await signInWithProvider('google');
    setAuthenticating(false);
  };

  const handleFacebookAuth = async () => {
    setAuthenticating(true);
    await signInWithProvider('facebook');
    setAuthenticating(false);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setAuthenticating(true);
    const { name, email, newPassword } = data;
    await registerWithEmailAndPassword(name, email, newPassword);
    reset();
    setAuthenticating(false);
  };

  useEffect(() => {
    if (loading) return;
    if (error) console.log(error);
    if (!authenticating && user) navigate('/dashboard');
  }, [user, loading, error, navigate, authenticating]);

  if (!loading && !user)
    return (
      <Container
        component="main"
        maxWidth="xs"
      >
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
          >
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 3 }}
            onSubmit={handleSubmit(onSubmit)}
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
                  autoFocus
                  label="Name"
                  autoComplete="name"
                  {...register('name', { required: true })}
                  error={!!errors.name}
                  helperText={errors.name ? errors.name?.message : ''}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  required
                  fullWidth
                  label="Email"
                  autoComplete="email"
                  {...register('email', { required: true })}
                  error={!!errors.email}
                  helperText={errors.email ? errors.email?.message : ''}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  autoComplete="new-password"
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
                  label="Re-enter Password"
                  type="password"
                  autoComplete="new-password"
                  {...register('confirmPassword', { required: true })}
                  error={!!errors.confirmPassword}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword?.message
                      : ''
                  }
                />
              </Grid>
            </Grid>
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={authenticating}
            >
              Sign Up
            </LoadingButton>
            <Divider>or</Divider>
            <LoadingButton
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleGoogleAuth}
              loading={authenticating}
            >
              Sign In with Google
            </LoadingButton>
            <Divider>or</Divider>
            <LoadingButton
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleFacebookAuth}
              loading={authenticating}
            >
              Sign In with Facebook
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
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>

          <Copyright />
        </Box>
      </Container>
    );

  return <CircularProgress />;
}

export default Register;
