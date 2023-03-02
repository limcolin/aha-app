import React, { useState, useEffect, useRef } from 'react';
import {
  useSearchParams,
  Link as RouterLink,
  useNavigate,
} from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Link,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Container,
} from '@mui/material';
import { auth, verifyEmail, verifyPasswordReset } from '../../config/firebase';
import ResetPasswordForm from '../../components/ResetPasswordForm';

interface Parameters {
  mode?: string;
  oobCode?: string;
  apiKey?: string;
  continueUrl?: string;
  lang?: string;
}

// DELETE IN PROD
let didInit = false;

export default function Verify() {
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(5);
  const redirectTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [searchParams] = useSearchParams();
  const { mode, oobCode }: Parameters = Object.fromEntries(
    searchParams.entries(),
  );

  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  const renderForm = () => {
    switch (mode) {
      case 'resetPassword':
        return (
          <ResetPasswordForm
            verified={verified}
            redirectTimer={redirectTimer}
            oobCode={oobCode}
          />
        );
      case 'recoverEmail':
        return (
          <Typography
            component="h1"
            variant="h5"
          >
            Recover Email
          </Typography>
        );
      case 'verifyEmail':
        return (
          <>
            <Typography
              component="h1"
              variant="h5"
            >
              Verify Email
            </Typography>
            {verified ? (
              <Typography
                component="h1"
                variant="subtitle1"
                sx={{ my: 1 }}
              >
                Success - redirecting in {redirectTimer}
              </Typography>
            ) : (
              <Typography
                component="h1"
                variant="subtitle1"
                sx={{ my: 1 }}
              >
                Failed to verify your email address. Redirecting in{' '}
                {redirectTimer}
              </Typography>
            )}

            <Grid item>
              {user ? (
                <Link
                  component={RouterLink}
                  to="/dashboard"
                  variant="body2"
                  underline="hover"
                >
                  Go back now
                </Link>
              ) : (
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  underline="hover"
                >
                  Go back now
                </Link>
              )}
            </Grid>
          </>
        );
      default:
        return (
          <Typography
            component="h1"
            variant="h5"
          >
            Invalid Mode
          </Typography>
        );
    }
  };

  useEffect(() => {
    const verifyLink = async () => {
      switch (mode) {
        case 'resetPassword': {
          const email = await verifyPasswordReset(oobCode);
          if (email) setVerified(true);
          setVerifying(false);
          break;
        }
        case 'recoverEmail':
          break;
        case 'verifyEmail': {
          const success = await verifyEmail(oobCode);
          if (success) setVerified(true);
          else setVerifying(false);
          break;
        }
        default:
        // Error: invalid mode.
      }
    };

    if (mode && oobCode && !didInit) {
      didInit = true;
      verifyLink();
    }
  }, [mode, oobCode]);

  useEffect(() => {
    switch (mode) {
      case 'resetPassword': {
        if (!verifying && !verified)
          redirectTimerRef.current = setInterval(() => {
            setRedirectTimer((prev) => prev - 1);
          }, 1000);
        break;
      }
      case 'recoverEmail':
        break;
      case 'verifyEmail': {
        if (!verifying)
          redirectTimerRef.current = setInterval(() => {
            setRedirectTimer((prev) => prev - 1);
          }, 1000);
        if (verified) {
          if (user) {
            refreshTimerRef.current = setInterval(() => {
              if (user.emailVerified)
                clearInterval(
                  refreshTimerRef.current as ReturnType<typeof setInterval>,
                );
              setVerifying(false);
              if (!user.emailVerified) user.reload();
            }, 1000);
          }
        }

        break;
      }
      default:
      // Error: invalid mode.
    }

    return () =>
      clearInterval(redirectTimerRef.current as ReturnType<typeof setInterval>);
  }, [mode, verifying, verified, user]);

  useEffect(() => {
    if (redirectTimer === 0) {
      clearInterval(redirectTimerRef.current as ReturnType<typeof setInterval>);
      if (user) navigate('/dashboard');
      else navigate('/login');
    }
  }, [redirectTimer, user, navigate]);

  useEffect(() => {
    if (loading) return;
    if (error) console.log(error);
  }, [loading, error]);

  if (!loading && !verifying)
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
          <Grid
            container
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
          >
            {renderForm()}
          </Grid>
        </Box>
      </Container>
    );

  return <CircularProgress />;
}
