import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  rememberMe: yup.boolean(),
});

export const signupSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  firstname: yup.string().required('First name is required'),
  lastname: yup.string().required('Last name is required'),
  phone: yup.string(),
});

export const memberSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  middleName: yup.string(),
  maidenName: yup.string(),
  gender: yup.string().oneOf(['Male', 'Female', 'Other', 'PreferNotToSay']),
  birthDate: yup.date().nullable(),
  deathDate: yup.date().nullable(),
  birthPlace: yup.string(),
  deathPlace: yup.string(),
  vitalStatus: yup.string().oneOf(['Living', 'Deceased', 'Unknown']),
  occupation: yup.string(),
  email: yup.string().email('Invalid email format'),
  phone: yup.string(),
  bio: yup.string(),
});

export const passwordChangeSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});
