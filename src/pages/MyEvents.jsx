import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cancelRegistration, selectUserRegistrations } from '../features/registrations/registrationsSlice';
import EventCard from '../components/EventCard';
import { eventDate, isPastEvent } from '../utils/format';

export default function MyEvents() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const registrations = useSelector(selectUserRegistrations);
  const [tab, setTab] = useState('upcoming');
  const [message, setMessage] = useState(null);

  const sorted = [...registrations].sort(
    (a, b) => (eventDate(a) || 0) - (eventDate(b) || 0)
  );
  const upcoming = sorted.filter((e) => !isPastEvent(e));
  const completed = sorted.filter(isPastEvent).reverse();
  const list = tab === 'upcoming' ? upcoming : completed;

  const handleCancel = (event) => {
    if (!window.confirm(`Cancel your registration for "${event.name}"?`)) return;
    dispatch(cancelRegistration({ userId: user.id, eventId: event.id }));
    setMessage(`Registration cancelled for "${event.name}".`);
  };

  return (
    <section>
      <h1>My Events</h1>
      <div className="tabs">
        <button className={`chip ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => setTab('upcoming')}>
          Upcoming ({upcoming.length})
        </button>
        <button className={`chip ${tab === 'completed' ? 'active' : ''}`} onClick={() => setTab('completed')}>
          Completed ({completed.length})
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      {list.length === 0 ? (
        <p className="empty">
          {tab === 'upcoming' ? 'No upcoming registrations yet. ' : 'No completed events yet. '}
          <Link to="/events" className="link">Browse events</Link>
        </p>
      ) : (
        <div className="grid">
          {list.map((event) => (
            <EventCard key={event.id} event={event}
              badge={tab === 'upcoming' ? '✓ Registered' : 'Completed'}>
              <p className="muted small">
                Registered on {new Date(event.registeredAt).toLocaleDateString()}
              </p>
              {tab === 'upcoming' && (
                <button className="btn btn-danger" onClick={() => handleCancel(event)}>
                  Cancel registration
                </button>
              )}
            </EventCard>
          ))}
        </div>
      )}
    </section>
  );
}