import { useState, useCallback, useEffect } from 'react';
import { adminAPI } from '../../api/admin';
import {
  Users, UserPlus, Search, RefreshCw, Edit, Trash2,
  ShieldOff, ShieldCheck, Link2, Unlink, ChevronDown, ChevronUp, Shield,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import MemberSearchDropdown from '../../components/relationships/MemberSearchDropdown';

const STATUS_COLORS = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-gray-100 text-gray-800',
  Suspended: 'bg-red-100 text-red-800',
};

function UserStatusPill({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [actionError, setActionError] = useState('');

  // Edit profile dialog
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Status change dialog
  const [statusTarget, setStatusTarget] = useState(null); // { id, currentStatus }

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Link / Unlink dialog
  const [linkTarget, setLinkTarget] = useState(null);
  const [linkMemberId, setLinkMemberId] = useState('');
  const [linkNotes, setLinkNotes] = useState('');
  const [linkSubmitting, setLinkSubmitting] = useState(false);

  // Role management dialog
  const [roleTarget, setRoleTarget] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [rolesLoading, setRolesLoading] = useState(false);
  const [roleSubmitting, setRoleSubmitting] = useState(false);
  const [roleError, setRoleError] = useState('');

  // Create user dialog
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ email: '', password: '', firstname: '', lastname: '', phone: '' });
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminAPI.getUsers();
      setUsers(res.data?.data ?? res.data ?? []);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      !q ||
      `${u.firstname} ${u.lastname}`.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const handleStatusToggle = async () => {
    const newStatus = statusTarget.currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      setActionError('');
      await adminAPI.updateUserStatus(statusTarget.id, newStatus);
      setStatusTarget(null);
      fetchUsers();
    } catch (err) {
      setActionError(err.response?.data?.error?.message || 'Status update failed');
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteSubmitting(true);
      setActionError('');
      await adminAPI.deleteUser(deleteTarget);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      setActionError(err.response?.data?.error?.message || 'Delete failed');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const openEdit = (u) => {
    setEditUser(u);
    setEditForm({ firstname: u.firstname, lastname: u.lastname, email: u.email, phone: u.phone || '' });
    setActionError('');
  };

  const handleEditSave = async () => {
    try {
      setEditSubmitting(true);
      setActionError('');
      await adminAPI.updateUser(editUser.id, editForm);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      const fields = err.response?.data?.error?.fields;
      setActionError(fields ? fields.map((f) => f.message).join(', ') : (err.response?.data?.error?.message || 'Update failed'));
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleCreate = async () => {
    try {
      setCreateSubmitting(true);
      setCreateError('');
      await adminAPI.createUser(createForm);
      setShowCreate(false);
      setCreateForm({ email: '', password: '', firstname: '', lastname: '', phone: '' });
      fetchUsers();
    } catch (err) {
      const fields = err.response?.data?.error?.fields;
      setCreateError(fields ? fields.map((f) => `${f.field}: ${f.message}`).join('; ') : (err.response?.data?.error?.message || 'Create failed'));
    } finally {
      setCreateSubmitting(false);
    }
  };

  const openLinkDialog = (user) => {
    setLinkTarget(user);
    setLinkMemberId(user.linkedFamilyMemberId || '');
    setLinkNotes('');
    setActionError('');
  };

  const handleLinkSave = async () => {
    if (!linkMemberId) {
      setActionError('Please select a family member to link.');
      return;
    }

    try {
      setLinkSubmitting(true);
      setActionError('');
      await adminAPI.linkMember(linkTarget.id, linkMemberId, linkNotes.trim() || undefined);
      setLinkTarget(null);
      setLinkMemberId('');
      setLinkNotes('');
      fetchUsers();
    } catch (err) {
      const fields = err.response?.data?.error?.fields;
      setActionError(fields ? fields.map((f) => f.message).join(', ') : (err.response?.data?.error?.message || 'Failed to link member'));
    } finally {
      setLinkSubmitting(false);
    }
  };

  const handleUnlinkMember = async (userId) => {
    try {
      setActionError('');
      await adminAPI.unlinkMember(userId);
      if (linkTarget?.id === userId) {
        setLinkTarget(null);
        setLinkMemberId('');
        setLinkNotes('');
      }
      fetchUsers();
    } catch (err) {
      const fields = err.response?.data?.error?.fields;
      setActionError(fields ? fields.map((f) => f.message).join(', ') : (err.response?.data?.error?.message || 'Failed to unlink member'));
    }
  };

  const openRolesDialog = async (user) => {
    try {
      setRoleError('');
      setRolesLoading(true);
      setRoleTarget(user);
      setSelectedRoleId('');
      const res = await adminAPI.getRoles();
      setAvailableRoles(res.data?.data ?? res.data ?? []);
    } catch (err) {
      setRoleError(err.response?.data?.error?.message || 'Failed to load roles');
    } finally {
      setRolesLoading(false);
    }
  };

  const refreshRoleTarget = async (userId) => {
    const res = await adminAPI.getUserById(userId);
    const latestUser = res.data?.data ?? res.data;
    setRoleTarget(latestUser);
  };

  const handleAssignRole = async () => {
    if (!selectedRoleId) {
      setRoleError('Please select a role to assign.');
      return;
    }

    try {
      setRoleSubmitting(true);
      setRoleError('');
      await adminAPI.assignRole(roleTarget.id, Number(selectedRoleId));
      await refreshRoleTarget(roleTarget.id);
      await fetchUsers();
      setSelectedRoleId('');
    } catch (err) {
      const fields = err.response?.data?.error?.fields;
      setRoleError(fields ? fields.map((f) => f.message).join(', ') : (err.response?.data?.error?.message || 'Failed to assign role'));
    } finally {
      setRoleSubmitting(false);
    }
  };

  const handleRemoveRole = async (roleId) => {
    try {
      setRoleSubmitting(true);
      setRoleError('');
      await adminAPI.removeRole(roleTarget.id, roleId);
      await refreshRoleTarget(roleTarget.id);
      await fetchUsers();
    } catch (err) {
      const fields = err.response?.data?.error?.fields;
      setRoleError(fields ? fields.map((f) => f.message).join(', ') : (err.response?.data?.error?.message || 'Failed to remove role'));
    } finally {
      setRoleSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-1">Manage all registered users</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchUsers}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => { setShowCreate(true); setCreateError(''); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No users found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Roles</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((u) => (
                  <>
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <button
                          className="text-left"
                          onClick={() => setExpandedId(expandedId === u.id ? null : u.id)}
                        >
                          <p className="text-sm font-medium text-gray-900">{u.firstname} {u.lastname}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </button>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(u.roles || []).map((r) => (
                            <span key={r.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-800 font-medium">
                              {r.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <UserStatusPill status={u.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(u)}
                            title="Edit"
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setStatusTarget({ id: u.id, currentStatus: u.status }); setActionError(''); }}
                            title={u.status === 'Active' ? 'Suspend' : 'Activate'}
                            className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                          >
                            {u.status === 'Active' ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openRolesDialog(u)}
                            title="Manage roles"
                            className="p-1.5 text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openLinkDialog(u)}
                            title={u.linkedFamilyMemberId ? 'Change linked member' : 'Link member'}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                          >
                            <Link2 className="w-4 h-4" />
                          </button>
                          {u.linkedFamilyMemberId && (
                            <button
                              onClick={() => handleUnlinkMember(u.id)}
                              title="Unlink member"
                              className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                            >
                              <Unlink className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => { setDeleteTarget(u.id); setActionError(''); }}
                            title="Delete"
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setExpandedId(expandedId === u.id ? null : u.id)}
                            className="p-1.5 text-gray-400"
                          >
                            {expandedId === u.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === u.id && (
                      <tr key={`${u.id}-detail`} className="bg-blue-50">
                        <td colSpan={4} className="px-4 py-4">
                          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                            <div>
                              <dt className="text-gray-500 text-xs">Phone</dt>
                              <dd className="text-gray-900">{u.phone || '—'}</dd>
                            </div>
                            <div>
                              <dt className="text-gray-500 text-xs">Email Verified</dt>
                              <dd className="text-gray-900">{u.emailVerifiedAt ? new Date(u.emailVerifiedAt).toLocaleDateString() : 'No'}</dd>
                            </div>
                            <div>
                              <dt className="text-gray-500 text-xs">Linked Member</dt>
                              <dd className="text-gray-900 flex items-center gap-1">
                                {u.linkedFamilyMemberId ? (
                                  <><Link2 className="w-3 h-3" /> {u.linkedFamilyMemberId.slice(0, 8)}…</>
                                ) : '—'}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-gray-500 text-xs">Created</dt>
                              <dd className="text-gray-900">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</dd>
                            </div>
                          </dl>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit User</h3>
            <div className="space-y-3">
              {['firstname', 'lastname', 'email', 'phone'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={editForm[field]}
                    onChange={(e) => setEditForm((p) => ({ ...p, [field]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            {actionError && <p className="text-sm text-red-700 mt-2">{actionError}</p>}
            <div className="flex gap-3 justify-end mt-4">
              <button onClick={() => setEditUser(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleEditSave} disabled={editSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                {editSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Toggle Modal */}
      {statusTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {statusTarget.currentStatus === 'Active' ? 'Suspend User' : 'Activate User'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {statusTarget.currentStatus === 'Active'
                ? 'The user will lose access immediately.'
                : 'The user will regain access to the application.'}
            </p>
            {actionError && <p className="text-sm text-red-700 mb-3">{actionError}</p>}
            <div className="flex gap-3 justify-end">
              <button onClick={() => setStatusTarget(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700">Cancel</button>
              <button
                onClick={handleStatusToggle}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${statusTarget.currentStatus === 'Active' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {statusTarget.currentStatus === 'Active' ? 'Suspend' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete User</h3>
            <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
            {actionError && <p className="text-sm text-red-700 mb-3">{actionError}</p>}
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700">Cancel</button>
              <button onClick={handleDelete} disabled={deleteSubmitting} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">
                {deleteSubmitting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Member Modal */}
      {linkTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Link Family Member</h3>
            <p className="text-sm text-gray-600 mb-4">
              Link a family member to <span className="font-medium">{linkTarget.firstname} {linkTarget.lastname}</span>.
            </p>

            <div className="space-y-4">
              <MemberSearchDropdown
                value={linkMemberId}
                onChange={setLinkMemberId}
                label="Family Member"
                placeholder="Search by member name..."
                required={false}
                showLabel
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  rows={3}
                  value={linkNotes}
                  onChange={(e) => setLinkNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Add context for this link..."
                />
              </div>

              {actionError && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{actionError}</p>
              )}
            </div>

            <div className="flex justify-between mt-5 gap-3">
              <button
                onClick={() => handleUnlinkMember(linkTarget.id)}
                disabled={!linkTarget.linkedFamilyMemberId || linkSubmitting}
                className="px-4 py-2 border border-rose-300 text-rose-700 rounded-lg text-sm hover:bg-rose-50 disabled:opacity-50"
              >
                Unlink Current
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setLinkTarget(null);
                    setLinkMemberId('');
                    setLinkNotes('');
                    setActionError('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLinkSave}
                  disabled={linkSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {linkSubmitting ? 'Saving...' : 'Save Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Roles Modal */}
      {roleTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Roles</h3>
            <p className="text-sm text-gray-600 mb-4">
              Assign or remove roles for <span className="font-medium">{roleTarget.firstname} {roleTarget.lastname}</span>.
            </p>

            {rolesLoading ? (
              <div className="py-8 flex justify-center">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Roles</p>
                  {roleTarget.roles?.length ? (
                    <div className="space-y-2">
                      {roleTarget.roles.map((role) => (
                        <div key={role.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                          <span className="text-sm text-gray-800">{role.name}</span>
                          <button
                            onClick={() => handleRemoveRole(role.id)}
                            disabled={roleSubmitting}
                            className="text-xs px-2.5 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No roles assigned.</p>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign Role</label>
                  <div className="flex gap-2">
                    <select
                      value={selectedRoleId}
                      onChange={(e) => setSelectedRoleId(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="">Select a role...</option>
                      {availableRoles
                        .filter((r) => !(roleTarget.roles || []).some((ur) => ur.id === r.id))
                        .map((role) => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                    </select>
                    <button
                      onClick={handleAssignRole}
                      disabled={roleSubmitting}
                      className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50"
                    >
                      {roleSubmitting ? 'Saving...' : 'Assign'}
                    </button>
                  </div>
                </div>

                {roleError && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2 mt-4">{roleError}</p>
                )}
              </>
            )}

            <div className="flex justify-end mt-5">
              <button
                onClick={() => {
                  setRoleTarget(null);
                  setSelectedRoleId('');
                  setRoleError('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create User</h3>
            <div className="space-y-3">
              {[
                { field: 'firstname', label: 'First Name', type: 'text' },
                { field: 'lastname', label: 'Last Name', type: 'text' },
                { field: 'email', label: 'Email', type: 'email' },
                { field: 'password', label: 'Password', type: 'password' },
                { field: 'phone', label: 'Phone (optional)', type: 'text' },
              ].map(({ field, label, type }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={createForm[field]}
                    onChange={(e) => setCreateForm((p) => ({ ...p, [field]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            {createError && <p className="text-sm text-red-700 mt-2">{createError}</p>}
            <div className="flex gap-3 justify-end mt-4">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700">Cancel</button>
              <button onClick={handleCreate} disabled={createSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                {createSubmitting ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
