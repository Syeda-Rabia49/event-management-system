import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import { GuestRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          {/* Temporary placeholder: replaced when My Events is built */}
          <Route path="/my-events" element={<p className="empty">My Events page coming next.</p>} />
          <Route path="*" element={
            <p className="empty">Page not found. <Link to="/events" className="link">Go to events</Link></p>
          } />
        </Routes>
      </main>
    </>
  );
}