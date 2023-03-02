import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Avatar,
  CircularProgress,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { auth, sendPasswordReset } from '../../config/firebase';
import Copyright from '../../components/Copyright';

function Reset() {
  const [authenticating, setAuthenticating] = useState(false);
  const [email, setEmail] = useState('');

  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthenticating(true);
    await sendPasswordReset(email);
    setAuthenticating(false);
  };

  useEffect(() => {
    if (loading) return;
    if (error) console.log(error);
    if (user) navigate('/dashboard');
  }, [user, loading, error, navigate]);

  if (!loading && !user)
    return (
      <Container
        component="main"
        maxWidth="xs"
      >
        <Box
          sx={{
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
            Reset Password
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={handleSubmit}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              autoFocus
              label="Email Address"
              placeholder="E-mail Address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={authenticating}
            >
              Send Password Reset Email
            </LoadingButton>
            <Grid container>
              <Grid
                item
                xs
              >
                <Link
                  to="/login"
                  component={RouterLink}
                  variant="body2"
                  underline="hover"
                >
                  Back to Sign in
                </Link>
              </Grid>
              <Grid item>
                <Link
                  to="/register"
                  component={RouterLink}
                  variant="body2"
                  underline="hover"
                >
                  Don&apos;t have an account? Sign Up
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

export default Reset;
