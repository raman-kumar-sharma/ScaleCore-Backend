import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/user.api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setMsg(`Reset token: ${res.data.data.resetToken} (use this on the reset page)`);
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box card">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a reset token</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          {error && <p className="error-msg">{error}</p>}
          {msg && <p className="success-msg">{msg}</p>}
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Token'}
          </button>
        </form>
        <p className="auth-link"><Link to="/reset-password">Have a token? Reset password</Link></p>
        <p className="auth-link"><Link to="/login">Back to login</Link></p>
      </div>
    </div>
  );
}
