# Family Tree App - Frontend Implementation Plan

## Project Overview

Build a React frontend application that integrates with the existing Family Tree App backend APIs. This implementation covers Phase 1 (Authentication) and Phase 2 (Family Management) features.

**Tech Stack:**
- **Framework:** React 18+ with Vite
- **Styling:** Tailwind CSS + Material-UI (MUI) + CSS/SCSS
- **State Management:** Redux Toolkit with RTK Query
- **Routing:** React Router v6
- **Form Handling:** React Hook Form with Yup validation
- **HTTP Client:** RTK Query (built into Redux Toolkit)
- **Date Handling:** date-fns
- **Icons:** Material Icons (from MUI)

**Backend API Base URL:** `http://localhost:5001/api`

---

## Project Setup

### Step 1: Create Vite React Project

```bash
npm create vite@latest family-tree-app-frontend -- --template react
cd family-tree-app-frontend
npm install
```

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install react-router-dom@6 @reduxjs/toolkit react-redux

# UI libraries
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Form handling
npm install react-hook-form yup @hookform/resolvers

# Utilities
npm install date-fns axios

# Development
npm install -D @types/node sass
```

### Step 3: Configure Tailwind CSS

**Update `tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to avoid conflicts with MUI
  },
}
```

**Update `src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Global styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Step 4: Configure Environment Variables

**Create `.env`:**
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

**Create `.env.example`:**
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

---

## Project Structure

```
src/
├── app/
│   ├── store.js                 # Redux store configuration
│   └── theme.js                 # MUI theme configuration
├── features/
│   ├── auth/
│   │   ├── authSlice.js         # Auth state slice
│   │   ├── authApi.js           # Auth API endpoints (RTK Query)
│   │   ├── Login.jsx            # Login page
│   │   ├── Signup.jsx           # Signup page
│   │   ├── VerifyEmail.jsx      # Email verification page
│   │   ├── ForgotPassword.jsx   # Forgot password page
│   │   ├── ResetPassword.jsx    # Reset password page
│   │   ├── Confirm2FA.jsx       # 2FA verification page
│   │   ├── Profile.jsx          # User profile page
│   │   └── ChangePassword.jsx   # Change password page
│   ├── family/
│   │   ├── familyApi.js         # Family API endpoints (RTK Query)
│   │   ├── MemberList.jsx       # Family members list page
│   │   ├── MemberDetail.jsx     # Member details page
│   │   ├── MemberForm.jsx       # Add/Edit member form
│   │   ├── RelationshipForm.jsx # Add relationship form
│   │   ├── FamilyTree.jsx       # Family tree visualization
│   │   └── Birthdays.jsx        # Birthdays page
│   └── common/
│       ├── Navbar.jsx           # Navigation bar
│       ├── Sidebar.jsx          # Sidebar navigation
│       ├── Footer.jsx           # Footer component
│       └── LoadingSpinner.jsx   # Loading indicator
├── components/
│   ├── ProtectedRoute.jsx       # Route protection HOC
│   ├── ErrorBoundary.jsx        # Error boundary wrapper
│   ├── FormInput.jsx            # Reusable form input
│   ├── FormSelect.jsx           # Reusable form select
│   ├── FormDatePicker.jsx       # Reusable date picker
│   ├── ConfirmDialog.jsx        # Confirmation dialog
│   └── Snackbar.jsx             # Toast notifications
├── hooks/
│   ├── useAuth.js               # Auth hook
│   └── useDebounce.js           # Debounce hook
├── utils/
│   ├── api.js                   # Axios instance
│   ├── validation.js            # Validation schemas
│   └── helpers.js               # Helper functions
├── styles/
│   ├── components/              # Component-specific SCSS
│   └── globals.scss             # Global SCSS styles
├── App.jsx                      # Root component
├── main.jsx                     # Entry point
└── index.css                    # Tailwind imports
```

---

## Implementation Steps

### Phase 1: Core Setup

#### Step 1.1: Configure Redux Store

**File:** `src/app/store.js`

```javascript
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice';
import { authApi } from '../features/auth/authApi';
import { familyApi } from '../features/family/familyApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [familyApi.reducerPath]: familyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, familyApi.middleware),
});

setupListeners(store.dispatch);
```

#### Step 1.2: Configure MUI Theme

**File:** `src/app/theme.js`

```javascript
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});
```

#### Step 1.3: Setup Main App

**File:** `src/main.jsx`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './app/store';
import { theme } from './app/theme';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

#### Step 1.4: Create Axios Instance

**File:** `src/utils/api.js`

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
            { refreshToken }
          );
          
          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

### Phase 2: Authentication Feature

#### Step 2.1: Create Auth Slice

**File:** `src/features/auth/authSlice.js`

```javascript
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, tokens } = action.payload;
      state.user = user;
      state.accessToken = tokens.accessToken;
      state.refreshToken = tokens.refreshToken;
      state.isAuthenticated = true;
      
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
```

#### Step 2.2: Create Auth API

**File:** `src/features/auth/authApi.js`

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (credentials) => ({
        url: '/auth/signup',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    confirmEmail: builder.mutation({
      query: (data) => ({
        url: '/auth/confirm-email',
        method: 'POST',
        body: data,
      }),
    }),
    resendConfirmation: builder.mutation({
      query: (email) => ({
        url: `/auth/resend-confirmation/${email}`,
        method: 'POST',
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    confirm2FA: builder.mutation({
      query: (data) => ({
        url: '/auth/confirm-2fa',
        method: 'POST',
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => '/auth/profile',
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/auth/profile/password',
        method: 'PUT',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useConfirmEmailMutation,
  useResendConfirmationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useConfirm2FAMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = authApi;
```

#### Step 2.3: Create Login Page

**File:** `src/features/auth/Login.jsx`

```jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import { useLoginMutation } from './authApi';
import { setCredentials } from './authSlice';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  rememberMe: yup.boolean(),
});

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      const result = await login(data).unwrap();

      if (result.require2FA) {
        navigate('/confirm-2fa', { state: { email: data.email } });
      } else {
        dispatch(setCredentials(result.data));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm" className="mt-20">
      <Paper elevation={3} className="p-8">
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('email')}
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            {...register('password')}
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <FormControlLabel
            control={<Checkbox {...register('rememberMe')} />}
            label="Remember me"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={isLoading}
            className="mt-4"
          >
            {isLoading ? <CircularProgress size={24} /> : 'Login'}
          </Button>

          <Box className="mt-4 text-center">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </Box>

          <Box className="mt-2 text-center">
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
```

#### Step 2.4: Create Signup Page

**File:** `src/features/auth/Signup.jsx`

```jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useSignupMutation } from './authApi';

const schema = yup.object({
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

export default function Signup() {
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      setSuccess('');
      
      const { confirmPassword, ...signupData } = data;
      const result = await signup(signupData).unwrap();
      
      setSuccess(result.message);
      setTimeout(() => {
        navigate('/verify-email', { state: { email: data.email } });
      }, 2000);
    } catch (err) {
      setError(err.data?.message || 'Signup failed');
    }
  };

  return (
    <Container maxWidth="sm" className="mt-20">
      <Paper elevation={3} className="p-8">
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sign Up
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" className="mb-4">
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('firstname')}
                label="First Name"
                fullWidth
                error={!!errors.firstname}
                helperText={errors.firstname?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('lastname')}
                label="Last Name"
                fullWidth
                error={!!errors.lastname}
                helperText={errors.lastname?.message}
              />
            </Grid>
          </Grid>

          <TextField
            {...register('email')}
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            {...register('phone')}
            label="Phone (Optional)"
            fullWidth
            margin="normal"
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />

          <TextField
            {...register('password')}
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            {...register('confirmPassword')}
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={isLoading}
            className="mt-4"
          >
            {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>

          <Typography variant="body2" align="center" className="mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
}
```

#### Step 2.5: Create Protected Route Component

**File:** `src/components/ProtectedRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

---

### Phase 3: Family Management Feature

#### Step 3.1: Create Family API

**File:** `src/features/family/familyApi.js`

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const familyApi = createApi({
  reducerPath: 'familyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Member', 'Relationship', 'Tree'],
  endpoints: (builder) => ({
    // Family Members
    getMembers: builder.query({
      query: (params) => ({
        url: '/family/members',
        params,
      }),
      providesTags: ['Member'],
    }),
    getMember: builder.query({
      query: (id) => `/family/members/${id}`,
      providesTags: (result, error, id) => [{ type: 'Member', id }],
    }),
    createMember: builder.mutation({
      query: (data) => ({
        url: '/family/members',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Member', 'Tree'],
    }),
    updateMember: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/family/members/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Member', id },
        'Member',
        'Tree',
      ],
    }),
    deleteMember: builder.mutation({
      query: (id) => ({
        url: `/family/members/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Member', 'Tree'],
    }),

    // Relationships
    createRelationship: builder.mutation({
      query: (data) => ({
        url: '/family/relationships',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Relationship', 'Tree'],
    }),
    createParentChild: builder.mutation({
      query: (data) => ({
        url: '/family/relationships/parent-child',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Relationship', 'Tree'],
    }),
    createSpouse: builder.mutation({
      query: (data) => ({
        url: '/family/relationships/spouse',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Relationship', 'Tree'],
    }),
    deleteRelationship: builder.mutation({
      query: (id) => ({
        url: `/family/relationships/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Relationship', 'Tree'],
    }),

    // Family Tree Queries
    getAncestors: builder.query({
      query: ({ memberId, maxDepth }) => ({
        url: `/family/tree/ancestors/${memberId}`,
        params: { maxDepth },
      }),
      providesTags: (result, error, { memberId }) => [
        { type: 'Tree', id: memberId },
      ],
    }),
    getDescendants: builder.query({
      query: ({ memberId, maxDepth }) => ({
        url: `/family/tree/descendants/${memberId}`,
        params: { maxDepth },
      }),
      providesTags: (result, error, { memberId }) => [
        { type: 'Tree', id: memberId },
      ],
    }),
    getSiblings: builder.query({
      query: (memberId) => `/family/tree/siblings/${memberId}`,
    }),
    getChildren: builder.query({
      query: (memberId) => `/family/tree/children/${memberId}`,
    }),
    getParents: builder.query({
      query: (memberId) => `/family/tree/parents/${memberId}`,
    }),

    // Birthday Queries
    getUpcomingBirthdays: builder.query({
      query: (days = 30) => ({
        url: '/family/queries/birthdays/upcoming',
        params: { days },
      }),
    }),
    getBirthdaysToday: builder.query({
      query: () => '/family/queries/birthdays/today',
    }),
    getBirthdaysByMonth: builder.query({
      query: (month) => `/family/queries/birthdays/month/${month}`,
    }),

    // Statistics
    getStatistics: builder.query({
      query: () => '/family/queries/statistics',
    }),
  }),
});

export const {
  useGetMembersQuery,
  useGetMemberQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useCreateRelationshipMutation,
  useCreateParentChildMutation,
  useCreateSpouseMutation,
  useDeleteRelationshipMutation,
  useGetAncestorsQuery,
  useGetDescendantsQuery,
  useGetSiblingsQuery,
  useGetChildrenQuery,
  useGetParentsQuery,
  useGetUpcomingBirthdaysQuery,
  useGetBirthdaysTodayQuery,
  useGetBirthdaysByMonthQuery,
  useGetStatisticsQuery,
} = familyApi;
```

#### Step 3.2: Create Family Members List Page

**File:** `src/features/family/MemberList.jsx`

```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { Edit, Delete, Visibility, Add } from '@mui/icons-material';
import {
  useGetMembersQuery,
  useDeleteMemberMutation,
} from './familyApi';
import { format } from 'date-fns';

export default function MemberList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    name: '',
    gender: '',
    vitalStatus: '',
  });

  const { data, isLoading, error } = useGetMembersQuery({
    page,
    limit: 20,
    ...filters,
  });

  const [deleteMember] = useDeleteMemberMutation();

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteMember(id).unwrap();
      } catch (err) {
        alert('Failed to delete member');
      }
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">Failed to load members</Alert>;

  return (
    <Container maxWidth="lg" className="py-8">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1">
          Family Members
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate('/family/members/new')}
        >
          Add Member
        </Button>
      </div>

      {/* Filters */}
      <Paper className="p-4 mb-4">
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Search by name"
              fullWidth
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Gender"
              select
              fullWidth
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Status"
              select
              fullWidth
              value={filters.vitalStatus}
              onChange={(e) => handleFilterChange('vitalStatus', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Living">Living</MenuItem>
              <MenuItem value="Deceased">Deceased</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Members Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Birth Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data?.members?.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  {member.firstName} {member.middleName} {member.lastName}
                </TableCell>
                <TableCell>{member.gender || '-'}</TableCell>
                <TableCell>
                  {member.birthDate
                    ? format(new Date(member.birthDate), 'MMM dd, yyyy')
                    : '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={member.vitalStatus}
                    color={member.vitalStatus === 'Living' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/family/members/${member.id}`)}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/family/members/${member.id}/edit`)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() =>
                      handleDelete(
                        member.id,
                        `${member.firstName} ${member.lastName}`
                      )
                    }
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Info */}
      <div className="mt-4 text-center">
        <Typography variant="body2">
          Showing {data?.data?.members?.length || 0} of {data?.data?.total || 0}{' '}
          members
        </Typography>
      </div>
    </Container>
  );
}
```

#### Step 3.3: Create Member Form Component

**File:** `src/features/family/MemberForm.jsx`

```jsx
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useGetMemberQuery,
} from './familyApi';

const schema = yup.object({
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
  email: yup.string().email(),
  phone: yup.string(),
  bio: yup.string(),
});

export default function MemberForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: memberData, isLoading: loadingMember } = useGetMemberQuery(id, {
    skip: !isEdit,
  });

  const [createMember, { isLoading: creating }] = useCreateMemberMutation();
  const [updateMember, { isLoading: updating }] = useUpdateMemberMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      vitalStatus: 'Living',
    },
  });

  useEffect(() => {
    if (memberData?.data) {
      reset(memberData.data);
    }
  }, [memberData, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateMember({ id, ...data }).unwrap();
      } else {
        await createMember(data).unwrap();
      }
      navigate('/family/members');
    } catch (err) {
      alert('Failed to save member');
    }
  };

  if (loadingMember) return <CircularProgress />;

  return (
    <Container maxWidth="md" className="py-8">
      <Paper className="p-6">
        <Typography variant="h4" component="h1" gutterBottom>
          {isEdit ? 'Edit' : 'Add'} Family Member
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    required
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="middleName"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Middle Name" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    required
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="maidenName"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Maiden Name" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Gender" select fullWidth>
                    <MenuItem value="">Select...</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                    <MenuItem value="PreferNotToSay">Prefer not to say</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Birth Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="birthPlace"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Birth Place" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="vitalStatus"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Status" select fullWidth>
                    <MenuItem value="Living">Living</MenuItem>
                    <MenuItem value="Deceased">Deceased</MenuItem>
                    <MenuItem value="Unknown">Unknown</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="deathDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Death Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="deathPlace"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Death Place" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="occupation"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Occupation" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Phone" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Biography"
                    multiline
                    rows={4}
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>

          <div className="mt-6 flex gap-4">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={creating || updating}
            >
              {creating || updating ? <CircularProgress size={24} /> : 'Save'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/family/members')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Paper>
    </Container>
  );
}
```

---

### Phase 4: Routing Setup

**File:** `src/App.jsx`

```jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import VerifyEmail from './features/auth/VerifyEmail';
import ForgotPassword from './features/auth/ForgotPassword';
import ResetPassword from './features/auth/ResetPassword';
import Confirm2FA from './features/auth/Confirm2FA';
import Profile from './features/auth/Profile';

// Family Pages
import MemberList from './features/family/MemberList';
import MemberDetail from './features/family/MemberDetail';
import MemberForm from './features/family/MemberForm';
import FamilyTree from './features/family/FamilyTree';
import Birthdays from './features/family/Birthdays';

// Layout
import Navbar from './features/common/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-2fa" element={<Confirm2FA />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navigate to="/family/members" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/family/members"
          element={
            <ProtectedRoute>
              <MemberList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/family/members/new"
          element={
            <ProtectedRoute>
              <MemberForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/family/members/:id"
          element={
            <ProtectedRoute>
              <MemberDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/family/members/:id/edit"
          element={
            <ProtectedRoute>
              <MemberForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/family/tree"
          element={
            <ProtectedRoute>
              <FamilyTree />
            </ProtectedRoute>
          }
        />
        <Route
          path="/family/birthdays"
          element={
            <ProtectedRoute>
              <Birthdays />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
```

---

## Additional Components to Implement

### 1. Navbar Component
- Logo and app title
- Navigation links (Members, Tree, Birthdays)
- User menu with profile and logout
- Responsive mobile menu

### 2. Member Detail Page
- Display all member information
- Show family relationships (parents, children, siblings, spouse)
- View ancestors and descendants
- Add relationship buttons
- Edit and delete actions

### 3. Family Tree Visualization
- Interactive tree diagram (use a library like react-d3-tree or vis-network)
- Zoom and pan controls
- Click on members to view details
- Different layouts (vertical, horizontal)

### 4. Birthdays Page
- Today's birthdays section
- Upcoming birthdays (next 30 days)
- Filter by month
- Calendar view

### 5. Relationship Form
- Select relationship type (parent, child, spouse, sibling)
- Select two members
- Add marriage/divorce dates for spouse relationships
- Add notes

---

## Testing Plan

1. **Authentication Flow:**
   - Sign up new user
   - Verify email with code
   - Login with credentials
   - Test 2FA if enabled
   - Update profile
   - Change password
   - Logout

2. **Family Members:**
   - Create new member
   - List all members with filters
   - View member details
   - Update member information
   - Delete member (with confirmation)

3. **Relationships:**
   - Add parent-child relationship
   - Add spouse relationship
   - Add sibling relationship
   - View member's relationships
   - Delete relationship

4. **Family Tree:**
   - View ancestors
   - View descendants
   - Navigate through tree
   - Visualize relationships

5. **Birthdays:**
   - View today's birthdays
   - View upcoming birthdays
   - Filter by month

---

## Key Implementation Notes

1. **Error Handling:**
   - Show user-friendly error messages
   - Handle network errors
   - Validate forms before submission
   - Display loading states

2. **Performance:**
   - Use RTK Query caching
   - Implement pagination
   - Lazy load components
   - Optimize re-renders

3. **Security:**
   - Store tokens securely
   - Implement token refresh
   - Protected routes
   - HTTPS in production

4. **UX Improvements:**
   - Loading spinners
   - Success/error notifications
   - Confirm dialogs for destructive actions
   - Form validation feedback
   - Responsive design

5. **Code Organization:**
   - Feature-based folder structure
   - Reusable components
   - Custom hooks
   - Consistent naming conventions

---

## Development Workflow

1. **Start Backend:** Ensure backend is running on `http://localhost:5001`
2. **Start Frontend:** `npm run dev` (usually runs on `http://localhost:5173`)
3. **Test Authentication:** Sign up → Verify → Login
4. **Test Family Features:** Create members → Add relationships → View tree
5. **Iterate:** Fix bugs and improve UX

---

## Future Enhancements

- Photo uploads and galleries
- Document management
- Timeline of events
- News feed
- Search functionality
- Export family tree (PDF, GEDCOM)
- Mobile app
- Real-time notifications
- Family chat/messaging

---

This plan provides a complete foundation for building the frontend application. The VS Code AI Agent can use this to implement the features step by step, starting with the core setup and authentication, then moving to family management features.
