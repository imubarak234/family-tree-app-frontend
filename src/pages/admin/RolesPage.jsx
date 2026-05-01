import { useState, useCallback, useEffect } from 'react';
import { adminAPI } from '../../api/admin';
import { Shield, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create dialog
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '', permissions: '' });
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');

  // Edit dialog
  const [editRole, setEditRole] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', permissions: '' });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminAPI.getRoles();
      setRoles(res.data?.data ?? res.data ?? []);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRoles();
  }, [fetchRoles]);

  const parsePermissions = (raw) =>
    raw.split(',').map((p) => p.trim()).filter(Boolean);

  const handleCreate = async () => {
    try {
      setCreateSubmitting(true);
      setCreateError('');
      await adminAPI.createRole({
        name: createForm.name.trim(),
        description: createForm.description.trim() || undefined,
        permissions: parsePermissions(createForm.permissions),
      });
      setShowCreate(false);
      setCreateForm({ name: '', description: '', permissions: '' });
      fetchRoles();
    } catch (err) {
      const fields = err.response?.data?.error?.fields;
      setCreateError(fields ? fields.map((f) => f.message).join(', ') : (err.response?.data?.error?.message || 'Create failed'));
    } finally {
      setCreateSubmitting(false);
    }
  };

  const openEdit = (role) => {
    setEditRole(role);
    setEditForm({
      name: role.name,
      description: role.description || '',
      permissions: (role.permissions || []).join(', '),
    });
    setEditError('');
  };

  const handleEditSave = async () => {
    try {
      setEditSubmitting(true);
      setEditError('');
      await adminAPI.updateRole(editRole.id, {
        name: editForm.name.trim(),
        description: editForm.description.trim() || null,
        permissions: parsePermissions(editForm.permissions),
      });
      setEditRole(null);
      fetchRoles();
    } catch (err) {
      setEditError(err.response?.data?.error?.message || 'Update failed');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteSubmitting(true);
      setDeleteError('');
      await adminAPI.deleteRole(deleteTarget.id);
      setDeleteTarget(null);
      fetchRoles();
    } catch (err) {
      setDeleteError(err.response?.data?.error?.message || 'Delete failed');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Roles</h1>
            <p className="text-gray-600 mt-1">Manage roles and their permissions</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchRoles}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => { setShowCreate(true); setCreateError(''); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Role
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : roles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No roles defined yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {roles.map((role) => (
              <div key={role.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <h3 className="font-semibold text-gray-900">{role.name}</h3>
                    </div>
                    {role.description && (
                      <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {(role.permissions || []).map((perm) => (
                        <span key={perm} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700 font-mono">
                          {perm}
                        </span>
                      ))}
                      {(!role.permissions || role.permissions.length === 0) && (
                        <span className="text-xs text-gray-400 italic">No permissions</span>
                      )}
                    </div>
                  </div>
                  {role.name !== 'Admin' && (
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEdit(role)}
                        title="Edit"
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setDeleteTarget(role); setDeleteError(''); }}
                        title="Delete"
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Role Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create Role</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Editor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <input
                  type="text"
                  value={createForm.description}
                  onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Short description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permissions <span className="font-normal text-gray-500">(comma-separated)</span>
                </label>
                <textarea
                  value={createForm.permissions}
                  onChange={(e) => setCreateForm((p) => ({ ...p, permissions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-mono"
                  rows="3"
                  placeholder="read:members, write:members"
                />
              </div>
            </div>
            {createError && <p className="text-sm text-red-700 mt-2">{createError}</p>}
            <div className="flex gap-3 justify-end mt-4">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700">Cancel</button>
              <button onClick={handleCreate} disabled={createSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                {createSubmitting ? 'Creating...' : 'Create Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editRole && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Role: {editRole.name}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permissions <span className="font-normal text-gray-500">(comma-separated, replaces existing)</span>
                </label>
                <textarea
                  value={editForm.permissions}
                  onChange={(e) => setEditForm((p) => ({ ...p, permissions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-mono"
                  rows="3"
                />
              </div>
            </div>
            {editError && <p className="text-sm text-red-700 mt-2">{editError}</p>}
            <div className="flex gap-3 justify-end mt-4">
              <button onClick={() => setEditRole(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700">Cancel</button>
              <button onClick={handleEditSave} disabled={editSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                {editSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Role</h3>
            <p className="text-sm text-gray-600 mb-1">
              Delete <strong>{deleteTarget.name}</strong>?
            </p>
            <p className="text-sm text-gray-500 mb-4">
              This will fail if the role is currently assigned to any users.
            </p>
            {deleteError && <p className="text-sm text-red-700 mb-3">{deleteError}</p>}
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700">Cancel</button>
              <button onClick={handleDelete} disabled={deleteSubmitting} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">
                {deleteSubmitting ? 'Deleting...' : 'Delete Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
