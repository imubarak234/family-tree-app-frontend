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

// Phase 4 - News
export const newsCreateSchema = yup.object({
  title: yup.string().min(3, 'Title must be at least 3 characters').max(200).required('Title is required'),
  excerpt: yup.string().max(500).nullable().transform((value, originalValue) => (originalValue === '' ? null : value)),
  content: yup.string().min(10, 'Content must be at least 10 characters').required('Content is required'),
  status: yup.string().oneOf(['Draft', 'Published', 'Archived', '']).optional(),
  coverMediaId: yup.string().uuid('Cover media ID must be a valid UUID').nullable().transform((value, originalValue) => (originalValue === '' ? null : value)),
  relatedMemberIds: yup.array().of(yup.string().uuid('Member ID must be a valid UUID')).optional(),
});

export const newsUpdateSchema = yup.object({
  title: yup.string().min(3).max(200).optional(),
  excerpt: yup.string().max(500).nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).optional(),
  content: yup.string().min(10).optional(),
  status: yup.string().oneOf(['Draft', 'Published', 'Archived']).optional(),
  coverMediaId: yup.string().uuid('Cover media ID must be a valid UUID').nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).optional(),
  relatedMemberIds: yup.array().of(yup.string().uuid('Member ID must be a valid UUID')).optional(),
});

// Phase 4 - Events
const parseNullableDate = (value, originalValue) => {
  if (originalValue === '' || originalValue === null || originalValue === undefined) return null;
  const date = new Date(originalValue);
  return Number.isNaN(date.getTime()) ? new Date('') : date;
};

export const eventCreateSchema = yup.object({
  title: yup.string().min(3).max(200).required('Title is required'),
  description: yup.string().min(5).max(10000).required('Description is required'),
  startsAt: yup.date().typeError('Start date/time is required').required('Start date/time is required'),
  endsAt: yup.date().nullable().transform(parseNullableDate).test('ends-after-start', 'End date/time must be after start date/time', function(value) {
    const { startsAt } = this.parent;
    if (!value || !startsAt) return true;
    return value > new Date(startsAt);
  }),
  location: yup.string().max(255).nullable().transform((value, originalValue) => (originalValue === '' ? null : value)),
  isVirtual: yup.boolean().default(false),
  meetingUrl: yup.string().url('Meeting URL must be valid').nullable().transform((value, originalValue) => (originalValue === '' ? null : value)),
  capacity: yup.number().integer().min(1).nullable().transform((value, originalValue) => (originalValue === '' ? null : value)),
  isPublished: yup.boolean().default(false),
  coverMediaId: yup.string().uuid('Cover media ID must be a valid UUID').nullable().transform((value, originalValue) => (originalValue === '' ? null : value)),
  relatedMemberIds: yup.array().of(yup.string().uuid('Member ID must be a valid UUID')).optional(),
});

export const eventUpdateSchema = eventCreateSchema.shape({
  title: yup.string().min(3).max(200).optional(),
  description: yup.string().min(5).max(10000).optional(),
  startsAt: yup.date().optional(),
});

// Phase 4 - RSVP
export const rsvpSchema = yup.object({
  status: yup.string().oneOf(['Going', 'Maybe', 'NotGoing']).required('Status is required'),
  guestCount: yup.number().integer().min(1).nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).optional(),
  note: yup.string().max(2000).nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).optional(),
});

// Phase 4 - Engagement
export const commentCreateSchema = yup.object({
  content: yup.string().min(1).max(5000).required('Comment content is required'),
  parentCommentId: yup.string().uuid('Parent comment ID must be a valid UUID').nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).optional(),
});

export const commentUpdateSchema = yup.object({
  content: yup.string().min(1).max(5000).required('Comment content is required'),
});

export const reactionCreateSchema = yup.object({
  reactionType: yup.string().oneOf(['Like', 'Love', 'Celebrate', 'Support']).required('Reaction type is required'),
});
