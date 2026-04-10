import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/user.api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', dob: '', gender: '' });
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    setPicture(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (picture) fd.append('profilePicture', picture);
      await register(fd);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box card">
        <h2>Create account</h2>
        <p>Join ScaleCore today</p>
        <form onSubmit={handleSubmit}>
          {preview && (
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <img src={preview} alt="preview" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
            </div>
          )}
          <div className="form-group">
            <label>Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleFile} />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input name="dob" type="date" value={form.dob} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
