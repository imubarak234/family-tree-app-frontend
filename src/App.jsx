import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/layout/ErrorBoundary';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import FamilyScopeBoundary from './components/layout/FamilyScopeBoundary';
import Navbar from './components/common/Navbar';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Confirm2FA from './pages/auth/Confirm2FA';
import Profile from './pages/auth/Profile';
import PendingApproval from './pages/auth/PendingApproval';

// Family Pages
import Dashboard from './pages/Dashboard';
import BirthdayPage from './pages/BirthdayPage';
import FamilyTree from './pages/FamilyTree';
import MemberList from './pages/MemberList';
import MemberDetail from './pages/MemberDetail';
import MemberForm from './pages/MemberForm';
import Landing from './pages/Landing';
import Settings from './pages/Settings';
import BillingPage from './pages/Billing';
import BillingCheckoutReturnPage from './pages/billing/BillingCheckoutReturn';

// Admin Pages
import SignupRequestsPage from './pages/admin/SignupRequestsPage';
import UsersPage from './pages/admin/UsersPage';
import RolesPage from './pages/admin/RolesPage';
import BillingPlansPage from './pages/admin/BillingPlansPage';
import BillingSubscriptionsPage from './pages/admin/BillingSubscriptionsPage';
import BillingFamilySummaryPage from './pages/admin/BillingFamilySummaryPage';
import BillingActionsPage from './pages/admin/BillingActionsPage';

// Media Pages
import PhotosPage from './pages/media/PhotosPage';
import DocumentsPage from './pages/media/DocumentsPage';
import MediaDetail from './pages/media/MediaDetail';

// Social Pages
import NewsListPage from './pages/social/NewsListPage';
import NewsDetailPage from './pages/social/NewsDetailPage';
import NewsFormPage from './pages/social/NewsFormPage';
import EventsListPage from './pages/social/EventsListPage';
import EventDetailPage from './pages/social/EventDetailPage';
import EventFormPage from './pages/social/EventFormPage';
import TimelinePage from './pages/social/TimelinePage';

function App() {
  const familyRoute = (page) => (
    <ProtectedRoute requireFamilyContext>
      <FamilyScopeBoundary>{page}</FamilyScopeBoundary>
    </ProtectedRoute>
  );

  return (
    <ErrorBoundary>
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
          <Route path="/pending-approval" element={<PendingApproval />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/billing"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing/checkout/return"
            element={
              <ProtectedRoute>
                <BillingCheckoutReturnPage />
              </ProtectedRoute>
            }
          />

          {/* Family Member Routes */}
          <Route
            path="/family/members"
            element={familyRoute(<MemberList />)}
          />
          <Route
            path="/family/members/new"
            element={familyRoute(<MemberForm />)}
          />
          <Route
            path="/family/members/:id"
            element={familyRoute(<MemberDetail />)}
          />
          <Route
            path="/family/members/:id/edit"
            element={familyRoute(<MemberForm />)}
          />

          {/* Media Routes */}
          <Route
            path="/media/photos"
            element={familyRoute(<PhotosPage />)}
          />
          <Route
            path="/media/photos/:id"
            element={familyRoute(<MediaDetail />)}
          />
          <Route
            path="/media/documents"
            element={familyRoute(<DocumentsPage />)}
          />
          <Route
            path="/media/documents/:id"
            element={familyRoute(<MediaDetail />)}
          />

          {/* Social Routes */}
          <Route
            path="/news"
            element={familyRoute(<NewsListPage />)}
          />
          <Route
            path="/news/new"
            element={familyRoute(<NewsFormPage />)}
          />
          <Route
            path="/news/:id"
            element={familyRoute(<NewsDetailPage />)}
          />
          <Route
            path="/news/:id/edit"
            element={familyRoute(<NewsFormPage />)}
          />

          <Route
            path="/events"
            element={familyRoute(<EventsListPage />)}
          />
          <Route
            path="/events/new"
            element={familyRoute(<EventFormPage />)}
          />
          <Route
            path="/events/:id"
            element={familyRoute(<EventDetailPage />)}
          />
          <Route
            path="/events/:id/edit"
            element={familyRoute(<EventFormPage />)}
          />

          <Route
            path="/timeline"
            element={familyRoute(<TimelinePage />)}
          />

          {/* Coming Soon Routes */}
          <Route
            path="/family/tree"
            element={familyRoute(<FamilyTree />)}
          />
          <Route
            path="/family/birthdays"
            element={familyRoute(<BirthdayPage />)}
          />

          {/* Admin Routes */}
          <Route
            path="/admin/signup-requests"
            element={
              <AdminRoute>
                <SignupRequestsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/roles"
            element={
              <AdminRoute>
                <RolesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/billing/plans"
            element={
              <AdminRoute>
                <BillingPlansPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/billing/subscriptions"
            element={
              <AdminRoute>
                <BillingSubscriptionsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/billing/families"
            element={
              <AdminRoute>
                <BillingFamilySummaryPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/billing/actions"
            element={
              <AdminRoute>
                <BillingActionsPage />
              </AdminRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Landing />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
