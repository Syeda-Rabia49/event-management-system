import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import { GuestRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          {/* Temporary placeholders: replaced when these pages are built */}
          <Route path="/events" element={<p className="empty">Events page coming next.</p>} />
          <Route path="/my-events" element={<p className="empty">My Events page coming next.</p>} />
          <Route path="*" element={
            <p className="empty">Page not found. <Link to="/login" className="link">Go to login</Link></p>
          } />
        </Routes>
      </main>
    </>
  );
}