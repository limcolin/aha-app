import React, { useEffect, useState, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Avatar,
  CircularProgress,
  Divider,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  auth,
  logInWithEmailAndPassword,
  signInWithProvider,
} from '../../config/firebase';
import Copyright from '../../components/Copyright';

function Login() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [authenticating, setAuthenticating] = useState(false);

  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthenticating(true);
    if (emailRef.current && passwordRef.current) {
      await logInWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value,
      );
    }
    setAuthenticating(false);
  };

  useEffect(() => {
    if (loading) return;
    if (error) console.log(error);
    if (!authenticating && user) navigate('/dashboard');
  }, [user, loading, error, navigate, authenticating]);

  if (!loading && !user)
    return (
      <Box sx={{ display: 'flex' }}>
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
              Sign in
            </Typography>
            <Box
              component="form"
              sx={{ mt: 1 }}
              onSubmit={handleSubmit}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                autoFocus
                label="Email"
                placeholder="E-mail"
                autoComplete="email"
                inputRef={emailRef}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                inputRef={passwordRef}
              />
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                loading={authenticating}
              >
                Sign In
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
              <LoadingButton
                type="button"
                fullWidth
                variant="contained"
                sx={{ mb: 2 }}
                onClick={handleFacebookAuth}
                loading={authenticating}
              >
                Sign In with Facebook
              </LoadingButton>
              <Grid container>
                <Grid
                  item
                  xs
                >
                  <Link
                    to="/reset"
                    component={RouterLink}
                    variant="body2"
                    underline="hover"
                  >
                    Forgot password?
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
      </Box>
    );

  return <CircularProgress />;
}

export default Login;
