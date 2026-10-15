import { Routes, Route, Navigate } from 'react-router-dom';
import { GuestRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <main className="container">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        {/* Temporary: replaced when the Events page is added */}
        <Route path="/events" element={<p>Logged in! Events page coming next.</p>} />
      </Routes>
    </main>
  );
}