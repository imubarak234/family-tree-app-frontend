import { Link, useLocation } from 'react-router-dom';
import { Clock, Mail, CheckCircle } from 'lucide-react';

export default function PendingApproval() {
  const location = useLocation();
  const email = location.state?.email || '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Request Under Review
          </h1>
          <p className="text-gray-600">
            Your email has been verified. Your access request is now awaiting admin approval.
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* Steps */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Account created</p>
                <p className="text-xs text-gray-500">Your sign-up request was submitted successfully.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Email verified</p>
                {email && (
                  <p className="text-xs text-gray-500">Confirmed: {email}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Admin review</p>
                <p className="text-xs text-gray-500">An administrator will review your request. This usually takes 1–2 days.</p>
              </div>
            </div>
          </div>

          {/* Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              You will receive an email notification once your request is approved or if additional information is needed.
            </p>
          </div>

          {/* Back to login */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
