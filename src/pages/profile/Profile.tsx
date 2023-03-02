/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Avatar,
  CircularProgress,
  Divider,
  Box,
  Grid,
  TextField,
  Toolbar,
  Typography,
  Container,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Check as CheckIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  auth,
  updateName,
  deleteAccount,
  reauthenticate,
  changePassword,
} from '../../config/firebase';
import { getDbUser, getDbLogEntriesForUser } from '../../config/db';
import AppBar from '../../components/AppBar';
import Drawer from '../../components/Drawer';
import ConfirmDialog from '../../components/ConfirmDialog';
import Copyright from '../../components/Copyright';
import { UserInfo, PasswordUpdateFormData } from '../../config/types';
import { updatePasswordSchema } from '../../config/schemas';
import { dedupeArray, errorHandler } from '../../config/utils';

export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    displayName: '',
    email: '',
    providerId: '',
    photoURL: '',
    creationTime: '',
    lastSignInTime: '',
    timesLoggedIn: 0,
    accessLogs: [],
  });
  const [editing, setEditing] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(true);

  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  const handleNameUpdateSubmit = async () => {
    if (editing) {
      setAuthenticating(true);
      if (user) await updateName(user.uid, updatedName);
      alert('Name Updated');
      setAuthenticating(false);
    }
    setEditing((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordUpdateFormData>({
    resolver: yupResolver(updatePasswordSchema),
  });

  const onPasswordUpdateSubmit = async (data: PasswordUpdateFormData) => {
    setAuthenticating(true);
    const { oldPassword, newPassword } = data;
    const success = await reauthenticate(oldPassword);
    if (success) await changePassword(newPassword);
    reset();
    setAuthenticating(false);
  };

  const handleClose = async (confirm?: boolean) => {
    setOpenDialog(false);

    if (confirm) {
      setAuthenticating(true);
      await deleteAccount();
      setAuthenticating(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          console.log(user);
          const userData = await getDbUser(user.uid);
          const userLogsData = await getDbLogEntriesForUser(user.uid);
          const userLogsArray = userLogsData.map(
            (userLog: { entry: string }) => userLog.entry,
          );
          const userLogsDeduped = dedupeArray(userLogsArray);

          if (userData.length !== 0) {
            const {
              displayName,
              email,
              providerId,
              photoURL,
              creationTime,
              lastSignInTime,
              timesLoggedIn,
            } = userData[0];
            setUserInfo({
              displayName,
              email,
              providerId,
              photoURL,
              creationTime,
              lastSignInTime,
              timesLoggedIn,
              accessLogs: userLogsDeduped,
            });
          }
        }
      } catch (err) {
        errorHandler(err);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    setUpdatedName(userInfo.displayName);
  }, [userInfo]);

  useEffect(() => {
    if (loading) return;
    if (error) console.log(error);
    if (!user) navigate('/login');
  }, [user, loading, error, navigate]);

  if (!loading && user)
    return (
      <Box sx={{ display: 'flex', width: '100%' }}>
        <AppBar
          title="Profile"
          displayName={userInfo.displayName}
          photoURL={userInfo.photoURL}
          open={open}
          setOpen={setOpen}
        />
        <Drawer
          active="Profile"
          open={open}
          setOpen={setOpen}
        />

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container
            maxWidth="lg"
            sx={{ mt: 4, mb: 4 }}
          >
            <Container
              component="main"
              maxWidth="xs"
            >
              <Box
                sx={{
                  mt: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  sx={{ m: 1, bgcolor: 'secondary.main' }}
                  src={userInfo.photoURL}
                  alt={userInfo.displayName}
                />
                <Typography
                  component="h1"
                  variant="h5"
                  align="center"
                >
                  Edit Profile
                </Typography>

                <Box
                  component="form"
                  noValidate
                  sx={{
                    mt: 3,
                    mb: 2,
                    width: '100%',
                  }}
                >
                  <TextField
                    required
                    fullWidth
                    label="Name"
                    autoComplete="name"
                    disabled={!editing}
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <LoadingButton
                          onClick={handleNameUpdateSubmit}
                          loading={authenticating}
                        >
                          {editing ? (
                            <CheckIcon color="success" />
                          ) : (
                            <EditIcon color="action" />
                          )}
                        </LoadingButton>
                      ),
                    }}
                  />
                </Box>

                {userInfo.providerId === 'password' && (
                  <>
                    <Divider sx={{ width: '100%' }}>or</Divider>
                    <Box
                      component="form"
                      noValidate
                      sx={{ mt: 2 }}
                      onSubmit={handleSubmit(onPasswordUpdateSubmit)}
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
                            label="Old Password"
                            type="password"
                            {...register('oldPassword', { required: true })}
                            error={!!errors.oldPassword}
                            helperText={
                              errors.oldPassword
                                ? errors.oldPassword?.message
                                : ''
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
                            label="Password"
                            type="password"
                            autoComplete="new-password"
                            {...register('newPassword', { required: true })}
                            error={!!errors.newPassword}
                            helperText={
                              errors.newPassword
                                ? errors.newPassword?.message
                                : ''
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
                        Update Password
                      </LoadingButton>
                    </Box>
                  </>
                )}

                <Divider sx={{ width: '100%' }} />
                <LoadingButton
                  onClick={() => setOpenDialog(true)}
                  fullWidth
                  variant="contained"
                  color="error"
                  sx={{ mt: 3, mb: 2 }}
                  loading={authenticating}
                >
                  Danger: Delete Account
                </LoadingButton>
              </Box>
            </Container>

            <Copyright />
          </Container>
        </Box>
        <ConfirmDialog
          open={openDialog}
          onClose={handleClose}
          provider={userInfo.providerId}
        />
      </Box>
    );

  return <CircularProgress />;
}
