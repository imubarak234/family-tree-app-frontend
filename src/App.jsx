import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/layout/ErrorBoundary';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
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

// Admin Pages
import SignupRequestsPage from './pages/admin/SignupRequestsPage';
import UsersPage from './pages/admin/UsersPage';
import RolesPage from './pages/admin/RolesPage';

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

          {/* Family Member Routes */}
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

          {/* Media Routes */}
          <Route
            path="/media/photos"
            element={
              <ProtectedRoute>
                <PhotosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/media/photos/:id"
            element={
              <ProtectedRoute>
                <MediaDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/media/documents"
            element={
              <ProtectedRoute>
                <DocumentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/media/documents/:id"
            element={
              <ProtectedRoute>
                <MediaDetail />
              </ProtectedRoute>
            }
          />

          {/* Social Routes */}
          <Route
            path="/news"
            element={
              <ProtectedRoute>
                <NewsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/news/new"
            element={
              <ProtectedRoute>
                <NewsFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/news/:id"
            element={
              <ProtectedRoute>
                <NewsDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/news/:id/edit"
            element={
              <ProtectedRoute>
                <NewsFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/new"
            element={
              <ProtectedRoute>
                <EventFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <EventDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id/edit"
            element={
              <ProtectedRoute>
                <EventFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/timeline"
            element={
              <ProtectedRoute>
                <TimelinePage />
              </ProtectedRoute>
            }
          />

          {/* Coming Soon Routes */}
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
                <BirthdayPage />
              </ProtectedRoute>
            }
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

          {/* Default Route */}
          <Route path="/" element={<Landing />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
