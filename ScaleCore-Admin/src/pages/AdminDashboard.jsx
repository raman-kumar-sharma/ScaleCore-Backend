import { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { getUsers, toggleUserStatus, deleteUser } from '../api/admin.api';

const API_BASE = 'http://localhost:3000';

export default function AdminDashboard() {
  const { admin, logoutAdmin } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.data);
    } catch {
      // handle silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggle = async (id) => {
    setActionId(id);
    try {
      await toggleUserStatus(id);
      await fetchUsers();
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    setActionId(id);
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } finally {
      setActionId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">⚡ ScaleCore Admin</div>
        <button className="sidebar-link active">👥 Users</button>
        <div className="sidebar-spacer" />
        <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#a5b4fc' }}>
          {admin?.username}
        </div>
        <button className="sidebar-link" onClick={logoutAdmin}>🚪 Logout</button>
      </aside>

      <main className="main-content">
        <h1 className="page-title">User Management</h1>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{totalUsers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active</div>
            <div className="stat-value" style={{ color: '#10b981' }}>{activeUsers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Inactive</div>
            <div className="stat-value" style={{ color: '#ef4444' }}>{inactiveUsers}</div>
          </div>
        </div>

        <div className="card">
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '0.55rem 0.9rem',
                border: '1.5px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none',
                width: '280px',
              }}
            />
          </div>

          {loading ? (
            <p style={{ color: '#6b7280' }}>Loading users...</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>No users found</td></tr>
                  ) : (
                    filtered.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <span className="avatar-sm">
                            {user.profilePicture
                              ? <img src={`${API_BASE}/${user.profilePicture.replace(/\\/g, '/')}`} alt="" />
                              : user.username[0].toUpperCase()}
                          </span>
                          {user.username}
                        </td>
                        <td>{user.email}</td>
                        <td style={{ textTransform: 'capitalize' }}>{user.gender}</td>
                        <td>
                          <span className={`badge ${user.role === 'admin' ? 'badge-active' : ''}`}
                            style={user.role !== 'admin' ? { background: '#e0e7ff', color: '#3730a3' } : {}}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${user.isActive ? 'badge-active' : 'badge-inactive'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="actions">
                            <button
                              className={`btn ${user.isActive ? 'btn-warning' : 'btn-success'}`}
                              onClick={() => handleToggle(user._id)}
                              disabled={actionId === user._id}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(user._id)}
                              disabled={actionId === user._id}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
