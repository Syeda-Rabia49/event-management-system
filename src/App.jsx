import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute, { GuestRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import MyEvents from './pages/MyEvents';

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
          <Route path="/my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
          <Route path="*" element={
            <p className="empty">Page not found. <Link to="/events" className="link">Go to events</Link></p>
          } />
        </Routes>
      </main>
    </>
  );
}