import * as yup from 'yup';

const shapes = {
  name: yup.string().required('Name is required'),
  email: yup.string().email('Email is invalid').required('Email is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.])(?=.{8,})/, // Regex thanks to https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
      'Must Contain Minimum 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
};
const { name, email, newPassword, confirmPassword } = shapes;

export const registerSchema = yup.object().shape({
  name,
  email,
  newPassword,
  confirmPassword,
});

export const updatePasswordSchema = yup.object().shape({
  newPassword,
  confirmPassword,
});
