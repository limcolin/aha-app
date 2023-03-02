import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import ErrorPage from './pages/error/ErrorPage';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Reset from './pages/reset/Reset';
import Verify from './pages/verify/Verify';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/profile/Profile';
import reportWebVitals from './reportWebVitals';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'dashboard/',
        element: <Dashboard />,
      },
      {
        path: 'profile/',
        element: <Profile />,
      },
      {
        path: 'login/',
        element: <Login />,
      },
      {
        path: 'register/',
        element: <Register />,
      },
      {
        path: 'reset/',
        element: <Reset />,
      },
      {
        path: 'verify/',
        element: <Verify />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
