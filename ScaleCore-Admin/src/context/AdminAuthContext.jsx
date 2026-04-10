import { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    return token && user ? JSON.parse(user) : null;
  });

  const loginAdmin = (token, user) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
    setAdmin(user);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
