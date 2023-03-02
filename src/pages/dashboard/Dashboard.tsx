import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { sendEmailVerification } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import {
  Box,
  CircularProgress,
  Toolbar,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Lock as LockIcon } from '@mui/icons-material';
import { isToday } from 'date-fns';
import axios from 'axios';
import { auth, db } from '../../config/firebase';
import { last7Days, dedupeArray, errorHandler } from '../../config/utils';
import AppBar from '../../components/AppBar';
import Drawer from '../../components/Drawer';
import Chart from '../../components/Chart';
import Stats from '../../components/Stats';
import Users from '../../components/Users';
import Copyright from '../../components/Copyright';
import { UserInfo, ChartData } from '../../config/types';

export default function Dashboard() {
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
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [authenticating, setAuthenticating] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeToday, setActiveToday] = useState(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [rollingAverage, setRollingAverage] = useState(0);
  const [open, setOpen] = useState(true);

  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  const handleResendVerification = async () => {
    try {
      if (user) {
        setAuthenticating(true);
        await sendEmailVerification(user);
        alert('Resent Verification Email. Please check your inbox.');
        setAuthenticating(false);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        alert(err.message);
      } else {
        console.log(err);
      }
      setAuthenticating(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const querySnap = await getDocs(collection(db, 'users'));
          if (!querySnap.empty) {
            setTotalUsers(querySnap.size);

            let activeCount = 0;
            const usersArr: UserInfo[] = [];
            querySnap.forEach((userDoc) => {
              const {
                displayName,
                email,
                providerId,
                photoURL,
                creationTime,
                lastSignInTime,
                timesLoggedIn,
                accessLogs,
              } = userDoc.data();

              if (user.uid === userDoc.id)
                setUserInfo({
                  displayName,
                  email,
                  providerId,
                  photoURL,
                  creationTime,
                  lastSignInTime,
                  timesLoggedIn,
                  accessLogs,
                });

              if (isToday(new Date(lastSignInTime))) activeCount += 1;

              usersArr.push({
                displayName,
                email,
                providerId,
                photoURL,
                creationTime,
                lastSignInTime,
                timesLoggedIn,
                accessLogs,
              });
            });
            setActiveToday(activeCount);
            setUsers(usersArr);
          }
        }
      } catch (err) {
        errorHandler(err);
      }
    };

    fetchData();
    setFetchingData(false);
  }, [user]);

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get('/.netlify/functions/api/users');
        console.log(JSON.parse(response.data.body));
      } catch (err) {
        errorHandler(err);
      }
    }

    getUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      const dates = last7Days();
      const result = dates.map((date) => {
        const activeUsers = users.reduce((activeCount, currentUser) => {
          if (currentUser.accessLogs.length > 0) {
            const userAccessLogsDeduped = dedupeArray(currentUser.accessLogs);
            if (userAccessLogsDeduped.includes(date)) return activeCount + 1;
          }

          return activeCount;
        }, 0);

        return {
          date,
          activeUsers,
        };
      });

      const sum = result.reduce((total, day) => {
        return total + day.activeUsers;
      }, 0);

      setRollingAverage(sum / 7);
      setChartData(result);
    }
  }, [users]);

  useEffect(() => {
    if (loading) return;
    if (error) console.log(error);
    if (!user) navigate('/login');
  }, [user, loading, error, navigate]);

  if (!loading && user)
    return (
      <Box sx={{ display: 'flex', width: '100%' }}>
        <AppBar
          title="Dashboard"
          displayName={userInfo.displayName}
          photoURL={userInfo.photoURL}
          open={open}
          setOpen={setOpen}
        />
        <Drawer
          active="Dashboard"
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
            {(user.emailVerified ||
              user.providerData[0].providerId === 'google.com' ||
              user.providerData[0].providerId === 'facebook.com') && (
              <Grid
                container
                spacing={3}
              >
                {/* Chart */}
                <Grid
                  item
                  xs={12}
                  md={4}
                  lg={6}
                >
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 240,
                    }}
                  >
                    <Chart
                      data={chartData}
                      rollingAverage={rollingAverage}
                    />
                  </Paper>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  lg={3}
                >
                  {fetchingData && (
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 240,
                      }}
                    >
                      <CircularProgress />
                    </Paper>
                  )}
                  {!fetchingData && (
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                      }}
                    >
                      <Stats
                        title="Active Users Today"
                        data={activeToday}
                      />
                    </Paper>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  lg={3}
                >
                  {fetchingData && (
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 240,
                      }}
                    >
                      <CircularProgress />
                    </Paper>
                  )}
                  {!fetchingData && (
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                      }}
                    >
                      <Stats
                        title="Total Users"
                        data={totalUsers}
                      />
                    </Paper>
                  )}
                </Grid>

                <Grid
                  item
                  xs={12}
                >
                  <Paper
                    sx={{ p: 2, display: 'flex', flexDirection: 'column' }}
                  >
                    <Users data={users} />
                  </Paper>
                </Grid>
              </Grid>
            )}
            {!user.emailVerified &&
              user.providerData[0].providerId === 'password' && (
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
                    <LockIcon sx={{ m: 1 }} />
                    <Typography
                      component="h1"
                      variant="h5"
                      align="center"
                    >
                      Verify your email address to view this page.
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
                      <LoadingButton
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleResendVerification}
                        loading={authenticating}
                      >
                        Resend Email Verification
                      </LoadingButton>
                    </Box>
                  </Box>
                </Container>
              )}
            <Copyright />
          </Container>
        </Box>
      </Box>
    );

  return <CircularProgress />;
}
