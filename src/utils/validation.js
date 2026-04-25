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
  title: yup.string().max(200, 'Title cannot exceed 200 characters').optional().nullable(),
  gender: yup.string().oneOf(['Male', 'Female', 'Other', 'PreferNotToSay', '']),
  birthDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  deathDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
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

export const relationshipSchema = yup.object({
  relationshipType: yup
    .string()
    .oneOf(['Parent', 'Child', 'Spouse', 'Partner', 'Sibling'])
    .required('Relationship type is required'),
  toMemberId: yup
    .string()
    .required('Please select a family member'),
  startDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .test('not-future', 'Start date cannot be in the future', function(value) {
      if (!value) return true;
      return new Date(value) <= new Date();
    }),
  endDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .test('after-start', 'End date must be after start date', function(value) {
      const { startDate } = this.parent;
      if (!value || !startDate) return true;
      return new Date(value) > new Date(startDate);
    }),
  notes: yup.string().max(500, 'Notes must be less than 500 characters'),
});

export const parentChildSchema = yup.object({
  parentId: yup.string().required('Please select a parent'),
  childId: yup.string().required('Please select a child'),
  notes: yup.string().max(500, 'Notes must be less than 500 characters'),
});

export const spouseSchema = yup.object({
  spouseId: yup.string().required('Please select a spouse'),
  startDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  endDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .test('after-start', 'End date must be after start date', function(value) {
      const { startDate } = this.parent;
      if (!value || !startDate) return true;
      return new Date(value) > new Date(startDate);
    }),
  notes: yup.string().max(500, 'Notes must be less than 500 characters'),
});
