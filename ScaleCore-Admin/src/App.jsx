import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminPrivateRoute from './components/AdminPrivateRoute';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
