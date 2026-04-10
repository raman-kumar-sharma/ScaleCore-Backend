import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  updateProfile, updateUsername, updateEmail, updatePassword,
} from '../api/user.api';

const API_BASE = 'http://localhost:3000';

function Section({ title, children }) {
  return (
    <div className="card section-card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function useForm(initial) {
  const [form, setForm] = useState(initial);
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  return [form, handleChange, setForm];
}

function StatusMsg({ error, success }) {
  if (error) return <p className="error-msg">{error}</p>;
  if (success) return <p className="success-msg">{success}</p>;
  return null;
}

export default function Dashboard() {
  const { user, logoutUser, refreshUser } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');

  // Profile update
  const [profileForm, handleProfileChange] = useForm({ dob: '', gender: '' });
  const [profilePic, setProfilePic] = useState(null);
  const [profileMsg, setProfileMsg] = useState({ error: '', success: '' });

  // Username
  const [usernameForm, handleUsernameChange] = useForm({ username: '' });
  const [usernameMsg, setUsernameMsg] = useState({ error: '', success: '' });

  // Email
  const [emailForm, handleEmailChange] = useForm({ email: '' });
  const [emailMsg, setEmailMsg] = useState({ error: '', success: '' });

  // Password
  const [pwForm, handlePwChange] = useForm({ currentPassword: '', newPassword: '' });
  const [pwMsg, setPwMsg] = useState({ error: '', success: '' });

  const submit = async (apiFn, payload, setMsg, onSuccess) => {
    setMsg({ error: '', success: '' });
    try {
      await apiFn(payload);
      await refreshUser();
      setMsg({ error: '', success: 'Updated successfully!' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setMsg({ error: err.response?.data?.message || 'Update failed', success: '' });
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    if (profileForm.dob) fd.append('dob', profileForm.dob);
    if (profileForm.gender) fd.append('gender', profileForm.gender);
    if (profilePic) fd.append('profilePicture', profilePic);
    submit(updateProfile, fd, setProfileMsg);
  };

  const avatarSrc = user?.profilePicture
    ? `${API_BASE}/${user.profilePicture.replace(/\\/g, '/')}`
    : null;

  const navItems = [
    { key: 'profile', label: '👤 Profile' },
    { key: 'username', label: '✏️ Username' },
    { key: 'email', label: '📧 Email' },
    { key: 'password', label: '🔒 Password' },
  ];

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">ScaleCore</div>
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`sidebar-link ${activeSection === item.key ? 'active' : ''}`}
            onClick={() => setActiveSection(item.key)}
          >
            {item.label}
          </button>
        ))}
        <div className="sidebar-spacer" />
        <button className="sidebar-link" onClick={logoutUser}>🚪 Logout</button>
      </aside>

      <main className="main-content">
        <div className="profile-header">
          <div className="avatar">
            {avatarSrc ? <img src={avatarSrc} alt="avatar" /> : user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem' }}>{user?.username}</h2>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{user?.email}</p>
            <p style={{ color: user?.isActive ? '#10b981' : '#ef4444', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              {user?.isActive ? '● Active' : '● Inactive'}
            </p>
          </div>
        </div>

        {activeSection === 'profile' && (
          <Section title="Update Profile">
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label>Profile Picture</label>
                <input type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files[0])} />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input name="dob" type="date" value={profileForm.dob} onChange={handleProfileChange} />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={profileForm.gender} onChange={handleProfileChange}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <StatusMsg {...profileMsg} />
              <button className="btn btn-primary">Save Changes</button>
            </form>
          </Section>
        )}

        {activeSection === 'username' && (
          <Section title="Update Username">
            <form onSubmit={(e) => { e.preventDefault(); submit(updateUsername, usernameForm.username, setUsernameMsg); }}>
              <div className="form-group">
                <label>New Username</label>
                <input name="username" value={usernameForm.username} onChange={handleUsernameChange} required />
              </div>
              <StatusMsg {...usernameMsg} />
              <button className="btn btn-primary">Update Username</button>
            </form>
          </Section>
        )}

        {activeSection === 'email' && (
          <Section title="Update Email">
            <form onSubmit={(e) => { e.preventDefault(); submit(updateEmail, emailForm.email, setEmailMsg); }}>
              <div className="form-group">
                <label>New Email</label>
                <input name="email" type="email" value={emailForm.email} onChange={handleEmailChange} required />
              </div>
              <StatusMsg {...emailMsg} />
              <button className="btn btn-primary">Update Email</button>
            </form>
          </Section>
        )}

        {activeSection === 'password' && (
          <Section title="Update Password">
            <form onSubmit={(e) => { e.preventDefault(); submit(updatePassword, pwForm, setPwMsg); }}>
              <div className="form-group">
                <label>Current Password</label>
                <input name="currentPassword" type="password" value={pwForm.currentPassword} onChange={handlePwChange} required />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input name="newPassword" type="password" value={pwForm.newPassword} onChange={handlePwChange} required />
              </div>
              <StatusMsg {...pwMsg} />
              <button className="btn btn-primary">Update Password</button>
            </form>
          </Section>
        )}
      </main>
    </div>
  );
}
