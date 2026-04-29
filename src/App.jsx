import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/layout/ErrorBoundary';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/common/Navbar';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Confirm2FA from './pages/auth/Confirm2FA';
import Profile from './pages/auth/Profile';

// Family Pages
import Dashboard from './pages/Dashboard';
import BirthdayPage from './pages/BirthdayPage';
import FamilyTree from './pages/FamilyTree';
import MemberList from './pages/MemberList';
import MemberDetail from './pages/MemberDetail';
import MemberForm from './pages/MemberForm';

// Media Pages
import PhotosPage from './pages/media/PhotosPage';
import DocumentsPage from './pages/media/DocumentsPage';
import MediaDetail from './pages/media/MediaDetail';

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

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
