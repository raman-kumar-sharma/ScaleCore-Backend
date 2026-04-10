import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/user.api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ token: '', newPassword: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    setLoading(true);
    try {
      await resetPassword(form);
      setMsg('Password reset! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box card">
        <h2>Reset Password</h2>
        <p>Enter your reset token and new password</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reset Token</label>
            <input name="token" value={form.token} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} required />
          </div>
          {error && <p className="error-msg">{error}</p>}
          {msg && <p className="success-msg">{msg}</p>}
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <p className="auth-link"><Link to="/login">Back to login</Link></p>
      </div>
    </div>
  );
}
