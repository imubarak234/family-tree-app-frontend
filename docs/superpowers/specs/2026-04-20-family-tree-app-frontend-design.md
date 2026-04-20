# Family Tree App Frontend - Design Specification

**Project:** Ahman Patigi Family Tree Application  
**Date:** 2026-04-20  
**Design Approach:** Hybrid Explorer (Dashboard + Tree Immersion)  
**Status:** Approved

---

## 1. Project Overview

### Purpose
Build a vibrant, engaging React frontend for the Ahman Patigi family tree that makes genealogy accessible and fun for all family members across different ages and technical skill levels.

### Key Requirements
- **Primary Users:** All family members (mixed ages, varying tech comfort levels)
- **Primary Use Case:** Mostly viewing/browsing with occasional admin edits
- **Visual Style:** Vibrant and engaging while maintaining clean, clear aesthetics
- **Device Strategy:** Desktop-first with full features; mobile gets functional subset
- **Data Richness:** Start simple with room to expand (photos, bios, basic relationships initially)
- **Permissions:** Users can edit own profile; admins can edit all profiles and manage tree

### Design Philosophy
- Prioritize exploration and discovery over complex data entry
- Make genealogy feel approachable, not academic
- Balance visual richness with clarity
- Desktop experience is premium; mobile is functional

---

## 2. Application Architecture

### Tech Stack

**Core Framework:**
- React 18+ with Vite for fast builds and HMR
- React Router v6 for client-side routing

**Styling:**
- Tailwind CSS for utility classes and rapid development
- CSS Modules for component-specific styles
- CSS Variables for design tokens (colors, spacing, typography)

**State Management:**
- React Context API for global auth state (simpler than Redux for this use case)
- Custom hooks wrapping axios for data fetching
- Local component state for UI interactions

**Data & Forms:**
- Axios for HTTP client with request/response interceptors
- React Hook Form for form handling
- Yup for validation schemas
- date-fns for date formatting and manipulation

**UI & Visualization:**
- Lucide React for modern, tree-shakeable icons
- React D3 Tree or custom SVG solution for family tree visualization
- CSS animations and Framer Motion (optional) for smooth transitions

### State Management Strategy

**Global State (React Context):**
```javascript
AuthContext provides:
- user: { id, email, firstName, lastName, isAdmin, ... }
- isAuthenticated: boolean
- login(credentials): Promise
- logout(): void
- updateUser(data): void
```

**Data Fetching (Custom Hooks):**
```javascript
useMembers(filters) → { data, loading, error, refetch }
useMemberDetail(id) → { member, loading, error, refetch }
useCreateMember() → { createMember, loading, error }
useUpdateMember() → { updateMember, loading, error }
useDeleteMember() → { deleteMember, loading, error }
// Similar patterns for relationships, tree data, birthdays
```

**Local State:**
- Form state (React Hook Form)
- UI state (modals, filters, tree zoom/pan)
- Temporary state (search queries, selected items)

### Project Structure

```
family-tree-app-frontend/
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-04-20-family-tree-app-frontend-design.md
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   ├── client.js              # Axios instance with interceptors
│   │   ├── auth.js                # Auth API: login, signup, profile, etc.
│   │   └── family.js              # Family API: members, relationships, tree queries
│   ├── contexts/
│   │   └── AuthContext.jsx        # Auth state provider
│   ├── hooks/
│   │   ├── useAuth.js             # Auth context consumer
│   │   ├── useMembers.js          # Fetch members list with filters
│   │   ├── useMemberDetail.js     # Fetch single member with relationships
│   │   ├── useCreateMember.js     # Create member mutation
│   │   ├── useUpdateMember.js     # Update member mutation
│   │   ├── useDeleteMember.js     # Delete member mutation
│   │   ├── useTreeData.js         # Fetch tree data (ancestors/descendants)
│   │   ├── useBirthdays.js        # Fetch birthday data
│   │   └── useDebounce.js         # Debounce utility hook
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx         # Main navigation bar
│   │   │   ├── MemberCard.jsx     # Reusable member card
│   │   │   ├── StatusBadge.jsx    # Living/Deceased badge
│   │   │   ├── RelationshipBadge.jsx # Relationship type badge
│   │   │   ├── LoadingSpinner.jsx # Loading indicator
│   │   │   ├── ErrorMessage.jsx   # Error display component
│   │   │   ├── EmptyState.jsx     # Empty state with illustration
│   │   │   ├── Toast.jsx          # Toast notification
│   │   │   └── ConfirmDialog.jsx  # Confirmation modal
│   │   ├── forms/
│   │   │   ├── Input.jsx          # Form input wrapper
│   │   │   ├── Select.jsx         # Form select wrapper
│   │   │   ├── DatePicker.jsx     # Date input wrapper
│   │   │   └── PhotoUpload.jsx    # Photo upload component
│   │   ├── tree/
│   │   │   ├── TreeVisualization.jsx # Main tree SVG component
│   │   │   ├── TreeNode.jsx       # Individual tree node
│   │   │   ├── TreeControls.jsx   # Zoom/pan/reset controls
│   │   │   ├── ViewModeSelector.jsx # Ancestors/Descendants/Full/Focus tabs
│   │   │   └── TreeSidePanel.jsx  # Member details side panel
│   │   └── layout/
│   │       ├── MainLayout.jsx     # Main app layout wrapper
│   │       ├── ProtectedRoute.jsx # Auth guard for routes
│   │       └── ErrorBoundary.jsx  # Error boundary wrapper
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Signup.jsx         # Registration page
│   │   │   ├── VerifyEmail.jsx    # Email verification page
│   │   │   ├── ForgotPassword.jsx # Forgot password page
│   │   │   ├── ResetPassword.jsx  # Reset password page
│   │   │   ├── Confirm2FA.jsx     # 2FA verification page
│   │   │   └── Profile.jsx        # User profile page
│   │   ├── Home.jsx               # Hybrid explorer landing page
│   │   ├── TreeExplorer.jsx       # Full-screen tree visualization
│   │   ├── MemberList.jsx         # Browse all members (grid/list)
│   │   ├── MemberDetail.jsx       # Single member profile page
│   │   ├── MemberForm.jsx         # Add/Edit member form
│   │   └── Birthdays.jsx          # Birthday calendar page
│   ├── utils/
│   │   ├── validation.js          # Yup validation schemas
│   │   ├── formatters.js          # Date/name formatting utilities
│   │   ├── permissions.js         # Permission checking helpers
│   │   └── constants.js           # App constants
│   ├── styles/
│   │   └── globals.css            # Tailwind imports + CSS variables
│   ├── App.jsx                    # Root component with routing
│   ├── main.jsx                   # Entry point
│   └── index.html                 # HTML template
├── .env.example                   # Environment variables template
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 3. Components & UI Design

### Core Pages

#### 3.1 Home Page (Hybrid Explorer)

**Layout:**
```
┌─────────────────────────────────────────┐
│  Navbar                                 │
├─────────────────────────────────────────┤
│  Hero: "Welcome to the Ahman Patigi     │
│         Family Tree"                    │
│  ┌───────────────────────────────────┐  │
│  │  Mini Tree Visualization          │  │
│  │  (2-3 generations, centered on    │  │
│  │   logged-in user or patriarch)    │  │
│  │                                   │  │
│  │  [Explore Full Tree Button]      │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Quick Stats Cards (Row):              │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │ 156  │ │ 142  │ │  5   │ │  3   │  │
│  │Total │ │Living│ │ Gens │ │Recent│  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
│                                         │
│  Upcoming Birthdays Widget:            │
│  ┌───────────────────────────────────┐  │
│  │ 📅 Next 5 Birthdays               │  │
│  │ • John Doe - Apr 25 (in 5 days)   │  │
│  │ • Jane Smith - Apr 30             │  │
│  │ ...                               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Features:**
- Mini tree is interactive (hover highlights, click navigates to member detail)
- "Explore Full Tree" button has gradient background and hover animation
- Stats cards have vibrant colors and count-up animation on load
- Birthday widget links to full Birthdays page

#### 3.2 Tree Explorer Page (Full-Screen)

**Layout:**
```
┌─────────────────────────────────────────┐
│  Navbar                                 │
├─────────────────────────────────────────┤
│ View Mode: [Ancestors][Descendants]...  │
│ Controls: [🔍 Search] [+ -] [Reset]     │
├─────────────────────────────────────────┤
│                                         │
│     ┌─ Tree SVG Canvas ──────────────┐ │
│     │  (Zoomable, Pannable)          │ │
│     │                                │ │
│     │    [Node]──[Node]──[Node]     │ │
│     │      │       │       │        │ │
│     │    [Node]  [Node]  [Node]     │ │
│     │                                │ │
│     └────────────────────────────────┘ │
│                                         │
│  Side Panel (when node clicked):       │
│  ┌───────────────────────────────────┐  │
│  │ Photo, Name, Dates                │  │
│  │ Quick relationships               │  │
│  │ [View Full Profile]               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**View Modes:**
1. **Ancestors View:** Vertical tree showing ancestors (parents → grandparents → great-grandparents)
2. **Descendants View:** Vertical tree showing descendants (children → grandchildren → great-grandchildren)
3. **Full Family Tree:** Horizontal or radial layout showing all members and connections
4. **Focus Mode:** Center on selected member, show immediate circle (parents, spouse, children, siblings)

**Interactions:**
- Click node: show side panel with quick info
- Double-click node: navigate to full member detail page
- Zoom: mouse wheel or +/- buttons
- Pan: click and drag background
- Search: highlights matching nodes
- Color coding: Green border = living, Gray border = deceased

#### 3.3 Member List Page

**Layout:**
```
┌─────────────────────────────────────────┐
│  Navbar                                 │
├─────────────────────────────────────────┤
│  Family Members                         │
│  [+ Add Member]                         │
│                                         │
│  Search & Filters:                      │
│  [🔍 Search by name...]                 │
│  [Gender ▼] [Status ▼] [Sort ▼]        │
│  [Grid View] [List View]                │
│                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │ Photo  │ │ Photo  │ │ Photo  │      │
│  │ Name   │ │ Name   │ │ Name   │      │
│  │ Dates  │ │ Dates  │ │ Dates  │      │
│  │ Badge  │ │ Badge  │ │ Badge  │      │
│  │[View]  │ │[View]  │ │[View]  │      │
│  └────────┘ └────────┘ └────────┘      │
│                                         │
│  Pagination: [< 1 2 3 4 5 >]            │
└─────────────────────────────────────────┘
```

**Features:**
- Grid view: 3-4 cards per row on desktop, 1-2 on mobile
- List view: Table with columns (Name, Gender, Birth Date, Status, Actions)
- Search: Debounced (300ms), searches first/middle/last names
- Filters: Dropdown for gender, vital status; sort by name (A-Z), age, recently added
- Pagination: 20-30 members per page

#### 3.4 Member Detail Page

**Layout:**
```
┌─────────────────────────────────────────┐
│  Navbar                                 │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐│
│  │ Profile Header                      ││
│  │ ┌────────┐  John Michael Doe        ││
│  │ │        │  (Maiden: Smith)          ││
│  │ │ Photo  │  Born: Jan 15, 1960       ││
│  │ │        │  Age: 66 | Living         ││
│  │ └────────┘  [Edit Profile]          ││
│  └─────────────────────────────────────┘│
│                                         │
│  Tabs: [Personal] [Biography]          │
│        [Relationships] [Family Tree]    │
│                                         │
│  Personal Info:                         │
│  Gender: Male                           │
│  Occupation: Engineer                   │
│  Birth Place: Lagos, Nigeria            │
│  Contact: john@example.com              │
│                                         │
│  Relationships:                         │
│  Parents:                               │
│    ┌────────┐ ┌────────┐               │
│    │Father  │ │Mother  │               │
│    └────────┘ └────────┘               │
│  Spouse:                                │
│    ┌────────┐                           │
│    │Wife    │                           │
│    └────────┘                           │
│  Children:                              │
│    ┌────────┐ ┌────────┐ ┌────────┐   │
│    │Child 1 │ │Child 2 │ │Child 3 │   │
│    └────────┘ └────────┘ └────────┘   │
│                                         │
│  Admin Actions:                         │
│  [🗑️ Delete Member]                    │
└─────────────────────────────────────────┘
```

**Features:**
- Large profile photo (or placeholder with initials)
- Tabs or accordion for different info sections
- Relationship cards link to respective member pages
- Mini tree shows this person's position in family
- Edit button visible only if admin or own profile
- Delete button only for admins, requires confirmation

#### 3.5 Member Form (Add/Edit)

**Layout:**
```
┌─────────────────────────────────────────┐
│  Navbar                                 │
├─────────────────────────────────────────┤
│  Add Family Member                      │
│                                         │
│  Photo Upload:                          │
│  ┌──────────────────┐                   │
│  │ Drop photo here  │                   │
│  │ or click to      │                   │
│  │ browse           │                   │
│  └──────────────────┘                   │
│                                         │
│  Basic Information:                     │
│  [First Name*] [Middle] [Last Name*]    │
│  [Maiden Name]                          │
│  [Gender ▼]                             │
│                                         │
│  Life Details:                          │
│  [Birth Date] [Birth Place]             │
│  [Vital Status ▼]                       │
│  [Death Date] [Death Place]             │
│  (Death fields shown only if Deceased)  │
│                                         │
│  Additional Information:                │
│  [Occupation]                           │
│  [Biography]                            │
│  ┌──────────────────────────────────┐   │
│  │ Multi-line text area for bio     │   │
│  │                                  │   │
│  └──────────────────────────────────┘   │
│                                         │
│  Contact (Living members only):         │
│  [Email] [Phone]                        │
│                                         │
│  [Cancel] [Save Member]                 │
└─────────────────────────────────────────┘
```

**Features:**
- Photo upload: Drag-drop or file picker, shows preview
- Required fields marked with asterisk (*)
- Death date/place fields conditionally shown based on vital status
- Contact fields only shown if vital status is "Living"
- Real-time validation on blur
- Clear error messages below fields
- Save button disabled until form is valid
- Success toast and navigate to member detail on save

### Reusable Components

**MemberCard:**
```javascript
<MemberCard
  member={{ photo, firstName, lastName, birthDate, deathDate, vitalStatus }}
  onClick={() => navigate to detail}
  showActions={isAdmin || isOwnProfile}
/>
```
- Used in: Home page, Member list, Search results
- Displays: Photo, name, life span, status badge
- Actions: View, Edit (if permitted)

**StatusBadge:**
```javascript
<StatusBadge status="Living" /> // Green pill
<StatusBadge status="Deceased" /> // Gray pill
```

**RelationshipBadge:**
```javascript
<RelationshipBadge type="parent" /> // Parent icon + label
<RelationshipBadge type="spouse" /> // Ring icon + label
```

**ConfirmDialog:**
```javascript
<ConfirmDialog
  open={isOpen}
  title="Delete Member?"
  message="This will also remove their relationships."
  confirmText="Delete"
  confirmColor="danger"
  onConfirm={handleDelete}
  onCancel={handleCancel}
/>
```

**Toast:**
```javascript
<Toast
  type="success" // or "error", "info"
  message="Member added successfully!"
  autoClose={4000}
/>
```

**EmptyState:**
```javascript
<EmptyState
  illustration="family-tree-empty"
  title="No members yet"
  message="Start building your family tree"
  action={<Button onClick={addMember}>Add First Member</Button>}
/>
```

### Design Tokens (CSS Variables)

```css
:root {
  /* Colors - Vibrant palette */
  --color-primary: #3B82F6;        /* Vibrant blue */
  --color-primary-hover: #2563EB;
  --color-secondary: #8B5CF6;      /* Vibrant purple */
  --color-accent: #F59E0B;         /* Amber for highlights */
  
  /* Status colors */
  --color-success: #10B981;        /* Green for living */
  --color-neutral: #6B7280;        /* Gray for deceased */
  --color-danger: #EF4444;         /* Red for delete */
  --color-warning: #F59E0B;        /* Amber for warnings */
  
  /* Background colors */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F9FAFB;
  --color-bg-tertiary: #F3F4F6;
  
  /* Text colors */
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --color-text-inverse: #FFFFFF;
  
  /* Spacing (4px base unit) */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  
  /* Border radius */
  --radius-sm: 0.375rem;   /* 6px */
  --radius-md: 0.75rem;    /* 12px - primary */
  --radius-lg: 1rem;       /* 16px */
  --radius-full: 9999px;   /* Fully rounded */
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* Typography */
  --font-family: 'Inter', system-ui, -apple-system, sans-serif;
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-base: 1rem;    /* 16px */
  --font-size-lg: 1.125rem;  /* 18px */
  --font-size-xl: 1.25rem;   /* 20px */
  --font-size-2xl: 1.5rem;   /* 24px */
  --font-size-3xl: 1.875rem; /* 30px */
  
  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 200ms ease-in-out;
  --transition-slow: 300ms ease-in-out;
}
```

### Visual Aesthetic

**Vibrant but Clean:**
- Generous white space (padding, margins)
- Soft shadows for depth (elevation)
- Bright accent colors for CTAs, status badges, highlights
- Smooth transitions on hover, click, page changes (200-300ms)
- Rounded corners throughout (12px default)
- Gradient backgrounds on hero sections (subtle, not aggressive)
- Playful illustrations for empty states
- Photography-forward (member photos prominent)

**Typography:**
- Font: Inter (or system font stack fallback)
- Headings: Bold, larger sizes
- Body: Regular weight, comfortable line height (1.5)
- Labels: Smaller, uppercase, medium weight

**Buttons:**
- Primary: Gradient blue background, white text, shadow on hover
- Secondary: Outline style, colored text
- Danger: Red background for destructive actions
- Icon buttons: Transparent, hover shows background

**Cards:**
- White background
- Soft shadow
- Rounded corners
- Hover: lift effect (increase shadow)

---

## 4. Data Flow & API Integration

### API Client Setup

**Axios Instance (`src/api/client.js`):**
```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // http://localhost:5001/api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401, refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
            { refreshToken }
          );
          
          localStorage.setItem('accessToken', data.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
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

export default apiClient;
```

### API Modules

**`src/api/auth.js`:**
```javascript
import apiClient from './client';

export const authAPI = {
  signup: (data) => apiClient.post('/auth/signup', data),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  confirmEmail: (token) => apiClient.post('/auth/confirm-email', { token }),
  resendConfirmation: (email) => apiClient.post(`/auth/resend-confirmation/${email}`),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (data) => apiClient.post('/auth/reset-password', data),
  confirm2FA: (data) => apiClient.post('/auth/confirm-2fa', data),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  changePassword: (data) => apiClient.put('/auth/profile/password', data),
  logout: () => apiClient.post('/auth/logout'),
};
```

**`src/api/family.js`:**
```javascript
import apiClient from './client';

export const familyAPI = {
  // Members
  getMembers: (params) => apiClient.get('/family/members', { params }),
  getMember: (id) => apiClient.get(`/family/members/${id}`),
  createMember: (data) => apiClient.post('/family/members', data),
  updateMember: (id, data) => apiClient.put(`/family/members/${id}`, data),
  deleteMember: (id) => apiClient.delete(`/family/members/${id}`),
  
  // Relationships
  createRelationship: (data) => apiClient.post('/family/relationships', data),
  createParentChild: (data) => apiClient.post('/family/relationships/parent-child', data),
  createSpouse: (data) => apiClient.post('/family/relationships/spouse', data),
  deleteRelationship: (id) => apiClient.delete(`/family/relationships/${id}`),
  
  // Tree queries
  getAncestors: (memberId, maxDepth) => 
    apiClient.get(`/family/tree/ancestors/${memberId}`, { params: { maxDepth } }),
  getDescendants: (memberId, maxDepth) => 
    apiClient.get(`/family/tree/descendants/${memberId}`, { params: { maxDepth } }),
  getSiblings: (memberId) => apiClient.get(`/family/tree/siblings/${memberId}`),
  getChildren: (memberId) => apiClient.get(`/family/tree/children/${memberId}`),
  getParents: (memberId) => apiClient.get(`/family/tree/parents/${memberId}`),
  
  // Birthdays
  getUpcomingBirthdays: (days = 30) => 
    apiClient.get('/family/queries/birthdays/upcoming', { params: { days } }),
  getBirthdaysToday: () => apiClient.get('/family/queries/birthdays/today'),
  getBirthdaysByMonth: (month) => apiClient.get(`/family/queries/birthdays/month/${month}`),
  
  // Statistics
  getStatistics: () => apiClient.get('/family/queries/statistics'),
};
```

### Custom Hooks for Data Fetching

**Pattern: Fetch on mount with loading/error states**

**`src/hooks/useMembers.js`:**
```javascript
import { useState, useEffect } from 'react';
import { familyAPI } from '../api/family';

export function useMembers(filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await familyAPI.getMembers(filters);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMembers();
  }, [JSON.stringify(filters)]); // Re-fetch when filters change
  
  return { data, loading, error, refetch: fetchMembers };
}
```

**`src/hooks/useMemberDetail.js`:**
```javascript
import { useState, useEffect } from 'react';
import { familyAPI } from '../api/family';

export function useMemberDetail(id) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchMember = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await familyAPI.getMember(id);
      setMember(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch member');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMember();
  }, [id]);
  
  return { member, loading, error, refetch: fetchMember };
}
```

**Mutations with Optimistic Updates:**

**`src/hooks/useCreateMember.js`:**
```javascript
import { useState } from 'react';
import { familyAPI } from '../api/family';

export function useCreateMember() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const createMember = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await familyAPI.createMember(data);
      return response.data.data; // Return created member
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create member';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return { createMember, loading, error };
}
```

### Auth Flow

**Login Process:**
1. User submits email + password
2. API call to `/auth/login`
3. Response:
   - Success with 2FA: `{ require2FA: true }` → Navigate to 2FA page
   - Success without 2FA: `{ user, tokens: { accessToken, refreshToken } }`
4. Store tokens in localStorage
5. Update AuthContext with user data
6. Redirect to Home page

**2FA Flow:**
1. User enters 6-digit code from email
2. API call to `/auth/confirm-2fa` with email + code
3. Response: `{ user, tokens }`
4. Store tokens, update context, redirect to Home

**Token Refresh:**
- Axios response interceptor catches 401
- Attempts token refresh with stored refreshToken
- On success: updates accessToken, retries original request
- On failure: clears storage, redirects to login

**Logout:**
1. User clicks logout
2. API call to `/auth/logout` (invalidates refresh token on backend)
3. Clear localStorage (accessToken, refreshToken)
4. Update AuthContext (user = null, isAuthenticated = false)
5. Redirect to Login page

### Permissions

**Permission Helpers (`src/utils/permissions.js`):**
```javascript
export function isAdmin(user) {
  return user?.isAdmin === true;
}

export function canEditMember(user, member) {
  if (!user) return false;
  if (isAdmin(user)) return true;
  return user.id === member.userId; // Can edit own profile
}

export function canDeleteMember(user) {
  return isAdmin(user);
}

export function canCreateMember(user) {
  return isAdmin(user); // Only admins can add new members
}
```

**Usage in components:**
```javascript
import { canEditMember, canDeleteMember } from '../utils/permissions';

// In MemberDetail component:
const { user } = useAuth();
const showEditButton = canEditMember(user, member);
const showDeleteButton = canDeleteMember(user);
```

### Data Caching Strategy

**Simple approach (no external library):**
- Custom hooks fetch on mount and when dependencies change
- Local state holds fetched data
- Refetch manually after mutations (call `refetch()` from hook)
- No persistent cache across page navigations (acceptable for family tree size)
- Future enhancement: Add React Query if caching/sync becomes critical

**Example refetch after mutation:**
```javascript
const { data, loading, refetch } = useMembers();
const { createMember } = useCreateMember();

const handleCreate = async (formData) => {
  await createMember(formData);
  refetch(); // Re-fetch member list
};
```

### Tree Data Structure

**API Response for Tree Queries:**
```javascript
// GET /family/tree/ancestors/:memberId
{
  success: true,
  data: {
    member: { id, firstName, lastName, photo, birthDate, deathDate, vitalStatus },
    ancestors: [
      {
        member: { ... }, // Parent
        ancestors: [
          { member: { ... }, ancestors: [] }, // Grandparent
          { member: { ... }, ancestors: [] }
        ]
      }
    ]
  }
}
```

**Tree Visualization Transform:**
- Tree component receives hierarchical data
- Transforms to D3 hierarchy format
- Renders SVG nodes and connections
- Handles zoom/pan with D3 or custom logic

---

## 5. Error Handling & User Feedback

### Error Handling Strategy

**Network Errors:**
- Axios catches network failures (no internet, server down)
- Display toast: "Unable to connect. Please check your internet connection."
- Show retry button in error state components
- Fallback to cached data if available (future enhancement)

**API Errors by Status Code:**

| Status | Handling |
|--------|----------|
| 400 | Show validation errors inline on forms (field-specific messages from API response) |
| 401 | Handled by axios interceptor (token refresh or logout) |
| 403 | Toast: "You don't have permission to perform this action" |
| 404 | Show "Member not found" empty state with back/home button |
| 500+ | Toast: "Something went wrong. Please try again later." + error ID if provided by API |

**Form Validation:**
- **Client-side:** Yup schemas validate before submission
- **Timing:** Validate on blur (not on every keystroke to avoid annoyance)
- **Display:** Error messages below fields in red text
- **Submit button:** Disabled until form is valid (all required fields filled, no errors)
- **Server validation:** Override client validation if server returns different errors

**Example Validation Schema:**
```javascript
// src/utils/validation.js
import * as yup from 'yup';

export const memberSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  middleName: yup.string(),
  maidenName: yup.string(),
  gender: yup.string().oneOf(['Male', 'Female', 'Other', 'PreferNotToSay']),
  birthDate: yup.date().nullable(),
  deathDate: yup.date().nullable(),
  vitalStatus: yup.string().oneOf(['Living', 'Deceased', 'Unknown']),
  email: yup.string().email('Invalid email format'),
  phone: yup.string(),
  bio: yup.string(),
});
```

**Error Boundaries:**
- Wrap app sections in `<ErrorBoundary>` components
- Catch React rendering errors (component crashes)
- Show friendly fallback UI: "Something went wrong. Please reload the page."
- Provide "Reload Page" button
- Log errors to console (future: send to error tracking service like Sentry)

### Loading States

**Page-Level Loading:**
- Full-page spinner with family tree logo animation
- Used for: Initial page load, auth redirects, large data fetches

**Component-Level Loading:**
- Skeleton screens for member lists: ghost cards that pulse
- Used for: List pages, search results, filters

**Inline Loading:**
- Spinner inside buttons during form submission
- Button text changes to "Saving..." with spinner
- Button is disabled during loading

**Tree Visualization Loading:**
- Progressive rendering: Show nodes as they load (if data is large)
- Smooth fade-in animations
- Loading indicator in center of tree canvas while fetching data

### User Feedback

**Success Messages (Toast Notifications):**
- Auto-dismiss after 4 seconds
- Positioned top-right of screen
- Stack if multiple toasts
- Green checkmark icon + message
- Examples:
  - "Member added successfully!"
  - "Profile updated"
  - "Relationship created"
  - "Password changed"

**Toast Component API:**
```javascript
import { useToast } from '../hooks/useToast';

const { showToast } = useToast();

showToast({
  type: 'success', // 'success' | 'error' | 'info' | 'warning'
  message: 'Member added successfully!',
  duration: 4000 // optional, default 4000ms
});
```

**Confirmation Dialogs:**
- Required for destructive actions
- Modal overlay (blur background)
- Clear title and message
- Two buttons: Cancel (secondary, left) and Confirm (danger red, right)
- Keyboard: Escape to cancel, Enter to confirm
- Examples:
  - Delete member: "Are you sure you want to delete [Name]? This will also remove their relationships."
  - Delete relationship: "Remove relationship between [Name A] and [Name B]?"

**Empty States:**
- Friendly illustrations (simple SVG graphics)
- Clear message explaining why it's empty
- Call-to-action button to resolve
- Examples:
  - No members: Illustration of family + "No family members yet" + "Add First Member" button
  - No search results: Magnifying glass + "No members found matching '[query]'" + "Clear Filters" button
  - No birthdays: Cake + "No birthdays this month"

**Progressive Disclosure:**
- Advanced filters: Collapsed by default, "Show Filters" toggle
- Optional form fields: Hidden under "Show More" accordion
- Tree controls: Collapsible side panel (don't clutter desktop view)

### Mobile Considerations

**Desktop-First with Mobile Fallbacks:**

**Navigation:**
- Desktop: Horizontal navbar with links
- Mobile: Hamburger menu (slide-in drawer)

**Member List:**
- Desktop: Grid (3-4 columns) or table view toggle
- Mobile: Force grid view (1-2 columns), hide table option

**Member Detail:**
- Desktop: Side-by-side layout (photo left, info right)
- Mobile: Vertical stack (photo top, info below)

**Tree Explorer:**
- Desktop: Full interactive tree with all controls
- Mobile: Show message: "For the best tree visualization experience, please visit on a desktop or tablet" + option to view simplified tree (1-2 generations, no zoom/pan)

**Forms:**
- Desktop: Multi-column layout where appropriate
- Mobile: Single column, full-width inputs
- Touch targets: Minimum 44px height for buttons, inputs
- Larger font sizes for readability

**Mobile-Specific Features:**
- Swipe to delete: On member cards (admins only) - swipe left reveals delete button
- Pull-to-refresh: On member list and home page
- Bottom sheet modals: Instead of centered modals (easier to reach)

---

## 6. Testing Strategy

### Testing Philosophy

**Pragmatic approach:**
- Manual testing during development for all features
- Automated tests for critical paths and complex logic
- Not aiming for 100% coverage initially
- Focus on areas that break often or are hard to test manually

### Manual Testing Checklist

**Authentication Flows:**
- [ ] Sign up → Email verification → Login
- [ ] Login → 2FA → Dashboard (if 2FA enabled)
- [ ] Login → Dashboard (if no 2FA)
- [ ] Forgot password → Reset password → Login
- [ ] Edit own profile (first name, email, password)
- [ ] Logout → Verify tokens cleared → Redirect to login
- [ ] Token expiration → Auto-refresh → Continue working
- [ ] Token refresh failure → Logout → Redirect to login

**Member Management:**
- [ ] Create new member with all fields
- [ ] Create member with only required fields
- [ ] Upload photo during member creation
- [ ] Edit member as admin
- [ ] Edit own profile as regular user
- [ ] Cannot edit other's profile as regular user
- [ ] Delete member (admin only) with confirmation
- [ ] Cannot delete member as regular user
- [ ] View member detail page with all relationships

**Member List & Search:**
- [ ] View all members in grid view
- [ ] View all members in list/table view
- [ ] Search members by name (debounced)
- [ ] Filter by gender
- [ ] Filter by vital status
- [ ] Sort by name A-Z
- [ ] Sort by recently added
- [ ] Pagination works correctly
- [ ] Empty state when no members

**Tree Visualization:**
- [ ] Switch to Ancestors view
- [ ] Switch to Descendants view
- [ ] Switch to Full Tree view
- [ ] Switch to Focus Mode
- [ ] Zoom in/out with buttons
- [ ] Zoom in/out with mouse wheel
- [ ] Pan by dragging background
- [ ] Reset view to default
- [ ] Click node to show side panel
- [ ] Double-click node to navigate to detail page
- [ ] Search highlights matching nodes
- [ ] Tree handles 50+ members without lag
- [ ] Tree handles 100+ members (performance check)

**Relationships:**
- [ ] Add parent-child relationship
- [ ] Add spouse relationship
- [ ] Add sibling relationship (via shared parents)
- [ ] View member's relationships on detail page
- [ ] Navigate to related members
- [ ] Delete relationship (admin only)

**Birthdays:**
- [ ] View today's birthdays
- [ ] View upcoming birthdays (next 30 days)
- [ ] Filter birthdays by month
- [ ] Birthday widget on home page shows next 5

**Permissions:**
- [ ] Admin can create members
- [ ] Regular user cannot create members
- [ ] Admin can edit any member
- [ ] Regular user can edit own profile only
- [ ] Admin can delete members
- [ ] Regular user cannot delete members
- [ ] Edit button shows/hides based on permissions
- [ ] Delete button shows only for admins

**Responsive Design:**
- [ ] Desktop 1920px - All features work, layout looks good
- [ ] Desktop 1440px - No horizontal scroll, content fits
- [ ] Desktop 1024px - Responsive layout adjusts
- [ ] Tablet 768px - Simplified but functional
- [ ] Mobile 414px (iPhone) - Mobile layout, simplified tree or desktop prompt
- [ ] Mobile 375px (smaller phones) - Everything still accessible

**Error Handling:**
- [ ] Network error shows retry option
- [ ] 404 member not found shows empty state
- [ ] Form validation errors display correctly
- [ ] Server errors show toast notification
- [ ] Token refresh works on 401
- [ ] Token refresh failure logs out user

**User Feedback:**
- [ ] Success toast appears after member creation
- [ ] Error toast appears on failure
- [ ] Loading spinner shows during form submission
- [ ] Skeleton screens show while loading lists
- [ ] Confirmation dialog shows before delete
- [ ] Empty states show when no data

### Automated Testing (Future Enhancement)

**If automated tests become necessary:**

**Unit Tests (Vitest):**
- Utility functions: `formatters.js`, `permissions.js`
- Validation schemas: Yup schemas in `validation.js`
- Pure logic functions

**Component Tests (React Testing Library):**
- `MemberCard` - renders correctly, handles clicks
- `StatusBadge` - shows correct color for Living/Deceased
- `ConfirmDialog` - shows/hides, calls callbacks
- Form components - validation, submission

**Integration Tests:**
- Auth flow: login → store tokens → redirect
- Member CRUD: create → appears in list → edit → delete
- Mock axios responses

**E2E Tests (Playwright - only critical paths):**
- Full user journey: Signup → Verify → Login → Create member → View tree → Logout
- Only if absolutely necessary (time-consuming to maintain)

**Test Priority (if implementing):**
1. Auth logic (login, logout, token refresh, permissions)
2. Permission helpers (`canEdit`, `isAdmin`)
3. Validation schemas (Yup)
4. API error handling
5. Critical user flows (create member, view tree)

### Development Testing Workflow

**Local Development:**
1. Run backend API on `http://localhost:5001`
2. Run frontend dev server: `npm run dev` (Vite default: `http://localhost:5173`)
3. Create test users:
   - Admin user: `admin@example.com`
   - Regular user: `user@example.com`
4. Populate with test data: 10-20 family members across 3-4 generations
5. Test flows in browser with DevTools open (check console for errors)

**Browser Testing:**
- **Primary:** Chrome (desktop + mobile device emulation)
- **Secondary:** Safari (desktop + iOS Safari), Firefox
- **Mobile:** Test on actual devices (iOS, Android) for touch interactions

### Performance Considerations

**What to Monitor:**
- Tree rendering with 100+ members - should stay smooth (60fps)
- Image loading - lazy load member photos (use `loading="lazy"` or Intersection Observer)
- Initial page load - code splitting for tree visualization library
- Search responsiveness - debounce input (300ms)
- Filter application - should update in <300ms

**Performance Budget:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s on fast 3G
- Tree initial render: < 1s for 50 members
- Search results update: < 300ms after typing stops
- Image size: Compress photos to <200KB each

**Performance Tools:**
- Chrome Lighthouse for overall scores
- React DevTools Profiler for component render times
- Network tab for bundle size and image loading

### Accessibility Testing

**Basic Accessibility (Must Have):**
- [ ] Keyboard navigation works (tab through forms, Enter to submit)
- [ ] Focus indicators visible on all interactive elements (buttons, links, inputs)
- [ ] Alt text on all images (member photos, illustrations)
- [ ] Color contrast meets WCAG AA (4.5:1 for text, 3:1 for UI components)
- [ ] Form labels properly associated with inputs
- [ ] Error messages announced (use ARIA live regions)
- [ ] Semantic HTML (`<button>`, `<nav>`, `<main>`, `<article>`)

**Nice to Have (Future):**
- Full screen reader testing (NVDA, JAWS, VoiceOver)
- WCAG AAA compliance (7:1 contrast)
- Voice control compatibility

**Accessibility Tools:**
- Chrome DevTools Lighthouse accessibility audit
- axe DevTools browser extension
- Keyboard-only navigation testing (unplug mouse)

---

## 7. Implementation Phases

### Phase 1: Core Setup & Authentication (Week 1)
- Set up Vite + React project
- Install dependencies (Tailwind, React Router, axios, etc.)
- Configure Tailwind with design tokens
- Create project structure (folders, files)
- Implement axios client with interceptors
- Build AuthContext provider
- Create auth pages: Login, Signup, Profile
- Implement ProtectedRoute component
- Test full auth flow (signup → login → logout)

### Phase 2: Member Management (Week 2)
- Create API hooks: `useMembers`, `useMemberDetail`, mutations
- Build MemberList page (grid + list views)
- Build MemberDetail page
- Build MemberForm (add/edit)
- Implement search and filters
- Add pagination
- Test CRUD operations
- Test permissions (admin vs regular user)

### Phase 3: Tree Visualization (Week 3)
- Research and choose tree library (React D3 Tree or custom SVG)
- Implement TreeVisualization component
- Add view mode selector (Ancestors, Descendants, Full, Focus)
- Implement zoom/pan controls
- Add node click interactions
- Build side panel for quick member info
- Test with different family sizes (10, 50, 100 members)
- Optimize performance if needed

### Phase 4: Home Page & Dashboard (Week 4)
- Build Home page with hybrid explorer layout
- Implement mini tree visualization
- Create stats cards with animations
- Build upcoming birthdays widget
- Create Birthdays full page
- Add recent updates feed (admin only)
- Polish UI, animations, transitions

### Phase 5: Polish & Testing (Week 5)
- Responsive design testing (desktop, tablet, mobile)
- Cross-browser testing (Chrome, Safari, Firefox)
- Accessibility audit and fixes
- Performance optimization (code splitting, image lazy loading)
- Error handling edge cases
- Empty states for all pages
- Loading states polish
- User feedback (toasts, confirmations)
- Final manual testing checklist

### Phase 6: Deployment Prep (Week 6)
- Environment variable setup for production
- Build optimization
- Deployment to hosting (Vercel, Netlify, or similar)
- Connect to production backend API
- SSL/HTTPS setup
- Performance testing on production
- Create user documentation (optional)
- Final walkthrough with stakeholders

---

## 8. Future Enhancements

**Not in initial scope, but designed to accommodate:**

1. **Rich Member Profiles:**
   - Multiple photos per member (gallery)
   - Life events timeline (birth, marriage, education, career, death)
   - Documents (birth certificate, marriage license, etc.)
   - Stories and anecdotes submitted by family members

2. **Advanced Tree Features:**
   - Export family tree as PDF or GEDCOM format
   - Print-friendly tree layout
   - Genetic relationship calculator (e.g., "second cousin once removed")
   - Family tree comparison (compare two members' relationships)

3. **Social Features:**
   - News feed for family updates
   - Comments on member profiles
   - Family chat or messaging
   - Event planning (reunions, birthdays)
   - Photo albums shared by family

4. **Search & Discovery:**
   - Advanced search (by location, occupation, date range)
   - Relationship path finder (how are two people related?)
   - Family statistics dashboard (most common names, locations, professions)

5. **Collaboration:**
   - Notification system (new members added, birthdays, updates)
   - Contribution requests (admins request info from family members)
   - Version history for member profiles (who changed what, when)

6. **Technical:**
   - Offline support (PWA with service workers)
   - Mobile app (React Native)
   - Data import from GEDCOM files
   - Integration with ancestry services (Ancestry.com, FamilySearch)
   - Real-time updates (WebSockets for live collaboration)

---

## 9. Success Criteria

**The frontend is successful if:**

1. **Usability:** Family members of all ages can navigate, browse, and explore the tree without confusion
2. **Performance:** Tree loads and renders smoothly even with 100+ members
3. **Accessibility:** Keyboard navigation works, WCAG AA standards met
4. **Mobile:** Mobile users can browse members and view simplified tree; prompted to use desktop for full experience
5. **Permissions:** Admins can manage everything; regular users can only edit their own profiles
6. **Visual Appeal:** Design is vibrant, engaging, and makes genealogy feel approachable
7. **Error Handling:** Network issues, API errors, and edge cases are handled gracefully with clear user feedback
8. **Reliability:** Auth flow (login, token refresh, logout) works consistently without token issues
9. **Extensibility:** Code structure supports future features (timeline, documents, social features) without major rewrites
10. **Delight:** Users enjoy exploring the family tree and feel connected to their heritage

---

## 10. Open Questions / Decisions Needed

**Resolved during brainstorming:**
- ✅ State management: Context API (not Redux)
- ✅ HTTP client: Axios (not RTK Query)
- ✅ Design style: Vibrant and engaging, clean and clear
- ✅ Device priority: Desktop-first, mobile functional but simplified
- ✅ Permissions: Self-edit + admin model

**Still to decide during implementation:**
- Tree visualization library: React D3 Tree vs. custom SVG solution (research during Phase 3)
- Photo storage: Base64 in database vs. file upload to cloud storage (backend decision, affects frontend upload component)
- Animation library: CSS animations only vs. Framer Motion (decide based on complexity needs)

---

## Conclusion

This design specifies a vibrant, accessible family tree application that prioritizes exploration and discovery. The Hybrid Explorer approach balances immersive tree visualization with casual browsing features, making genealogy engaging for all family members. The desktop-first strategy ensures a premium experience without compromising mobile usability. The simple state management approach (Context + custom hooks) keeps the codebase maintainable while leaving room for future enhancements like timeline, documents, and social features.

**Next Step:** Create detailed implementation plan with file-by-file tasks, dependencies, and acceptance criteria.
