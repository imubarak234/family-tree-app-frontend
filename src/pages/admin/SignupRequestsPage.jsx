import { useState, useCallback, useEffect } from 'react';
import { adminAPI } from '../../api/admin';
import { Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, Search, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const STATUS_LABELS = {
  PendingVerification: { label: 'Pending Verification', color: 'bg-yellow-100 text-yellow-800' },
  PendingApproval: { label: 'Pending Approval', color: 'bg-blue-100 text-blue-800' },
  Approved: { label: 'Approved', color: 'bg-green-100 text-green-800' },
  Rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
  Expired: { label: 'Expired', color: 'bg-gray-100 text-gray-800' },
};

function StatusPill({ status }) {
  const cfg = STATUS_LABELS[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

export default function SignupRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('PendingApproval');
  const [expandedId, setExpandedId] = useState(null);

  // Approve dialog
  const [approveId, setApproveId] = useState(null);
  const [approveSubmitting, setApproveSubmitting] = useState(false);

  // Reject dialog
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectSubmitting, setRejectSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminAPI.getSignupRequests(statusFilter || undefined);
      setRequests(res.data?.data ?? res.data ?? []);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load signup requests');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async () => {
    try {
      setApproveSubmitting(true);
      setActionError('');
      await adminAPI.approveSignupRequest(approveId);
      setApproveId(null);
      fetchRequests();
    } catch (err) {
      setActionError(err.response?.data?.error?.message || 'Approval failed');
    } finally {
      setApproveSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim() || rejectReason.trim().length < 3) {
      setActionError('Please provide a reason (at least 3 characters)');
      return;
    }
    try {
      setRejectSubmitting(true);
      setActionError('');
      await adminAPI.rejectSignupRequest(rejectId, rejectReason.trim());
      setRejectId(null);
      setRejectReason('');
      fetchRequests();
    } catch (err) {
      setActionError(err.response?.data?.error?.message || 'Rejection failed');
    } finally {
      setRejectSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Signup Requests</h1>
            <p className="text-gray-600 mt-1">Review and manage pending account requests</p>
          </div>
          <button
            onClick={fetchRequests}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['', 'PendingVerification', 'PendingApproval', 'Approved', 'Rejected', 'Expired'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {s === '' ? 'All' : STATUS_LABELS[s]?.label ?? s}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No signup requests found for the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {req.firstname} {req.lastname}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{req.email}</p>
                    </div>
                    <StatusPill status={req.status} />
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className="text-xs text-gray-400 hidden sm:block">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ''}
                    </span>
                    {expandedId === req.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedId === req.id && (
                  <div className="border-t border-gray-100 px-4 py-4 bg-gray-50">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                      <div>
                        <dt className="text-gray-500">Phone</dt>
                        <dd className="text-gray-900">{req.phone || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Submitted</dt>
                        <dd className="text-gray-900">
                          {req.createdAt ? new Date(req.createdAt).toLocaleString() : '—'}
                        </dd>
                      </div>
                    </dl>

                    {req.status === 'PendingApproval' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setApproveId(req.id); setActionError(''); }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => { setRejectId(req.id); setRejectReason(''); setActionError(''); }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approve Confirmation Modal */}
      {approveId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Approve Request</h3>
            <p className="text-sm text-gray-600 mb-4">
              This will create a user account and send an approval email. The user will be assigned the default
              Family Member role.
            </p>
            {actionError && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2 mb-3">{actionError}</p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setApproveId(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={approveSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {approveSubmitting ? 'Approving...' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Request</h3>
            <p className="text-sm text-gray-600 mb-3">
              The user will receive a rejection email with your reason.
            </p>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent"
              rows="3"
              placeholder="Reason for rejection (required)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            {actionError && (
              <p className="text-sm text-red-700 mt-2">{actionError}</p>
            )}
            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={() => { setRejectId(null); setRejectReason(''); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejectSubmitting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {rejectSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
