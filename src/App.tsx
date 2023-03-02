import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { auth } from './config/firebase';
import ThemeSwitch from './components/ThemeSwitch';

const themeLight = createTheme({
  palette: {
    background: {
      default: '#e4f0e2',
    },
  },
});

const themeDark = createTheme({
  palette: {
    background: {
      default: '#222222',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

function App() {
  const [light, setLight] = useState(true);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loading) return;
    if (error) console.log(error);
  }, [user, loading, error]);

  return (
    <ThemeProvider theme={light ? themeLight : themeDark}>
      <CssBaseline />

      <Outlet />

      <ThemeSwitch setLight={setLight} />
    </ThemeProvider>
  );
}

export default App;
