import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadEventDetails } from '../features/events/eventsSlice';
import {
  registerEvent, cancelRegistration, selectUserRegistrations,
} from '../features/registrations/registrationsSlice';
import { Loader, ErrorMessage } from '../components/UI';
import { formatDate, formatTime, formatLocation, isPastEvent } from '../utils/format';

export default function EventDetails() {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { selected: event, selectedStatus, selectedError } = useSelector((s) => s.events);
  const user = useSelector((s) => s.auth.user);
  const registrations = useSelector(selectUserRegistrations);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    dispatch(loadEventDetails(id));
    setMessage(null);
  }, [dispatch, id]);

  if (event?.id !== id) {
    return selectedStatus === 'failed'
      ? <ErrorMessage message={selectedError} onRetry={() => dispatch(loadEventDetails(id))} />
      : <Loader text="Loading event…" />;
  }

  const isRegistered = registrations.some((e) => e.id === event.id);
  const past = isPastEvent(event);
  const cancelled = event.status === 'cancelled';
  const place = formatLocation(event);
  const price = event.priceMin != null
    ? `${event.currency} ${event.priceMin}${event.priceMax !== event.priceMin ? ` – ${event.priceMax}` : ''}`
    : 'Not listed';

  const handleRegister = () => {
    if (isRegistered) return;
    dispatch(registerEvent({ userId: user.id, event }));
    setMessage({ type: 'success', text: `You're registered for ${event.name}!` });
  };

  const handleCancel = () => {
    if (!window.confirm('Cancel your registration for this event?')) return;
    dispatch(cancelRegistration({ userId: user.id, eventId: event.id }));
    setMessage({ type: 'info', text: 'Your registration has been cancelled.' });
  };

  return (
    <article className="details">
      <Link to="/events" className="link back">← Back to events</Link>
      {event.image && <img className="details-hero" src={event.image} alt={event.name} />}
      <div className="details-body">
        <span className="badge">{event.category}{event.genre ? ` · ${event.genre}` : ''}</span>
        <h1>{event.name}</h1>

        <dl className="info-grid">
          <div><dt>Date</dt><dd>{formatDate(event)}</dd></div>
          <div><dt>Time</dt><dd>{formatTime(event)}</dd></div>
          <div><dt>Venue</dt><dd>{event.venue}</dd></div>
          {event.address && <div><dt>Address</dt><dd>{event.address}</dd></div>}
          {place && <div><dt>Location</dt><dd>{place}</dd></div>}
          <div><dt>Price</dt><dd>{price}</dd></div>
          {event.status && <div><dt>Status</dt><dd style={{ textTransform: 'capitalize' }}>{event.status}</dd></div>}
          {event.promoter && <div><dt>Promoter</dt><dd>{event.promoter}</dd></div>}
        </dl>

        {event.info && <><h3>About</h3><p>{event.info}</p></>}
        {event.pleaseNote && <><h3>Please note</h3><p>{event.pleaseNote}</p></>}

        {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

        <div className="actions">
          {!user ? (
            <Link to="/login" state={{ from: location }} className="btn">Login to register</Link>
          ) : isRegistered ? (
            <>
              <span className="badge">✓ You're registered</span>
              {!past && <button className="btn btn-danger" onClick={handleCancel}>Cancel registration</button>}
            </>
          ) : past ? (
            <p className="muted">This event has already taken place.</p>
          ) : cancelled ? (
            <p className="muted">This event has been cancelled.</p>
          ) : (
            <button className="btn" onClick={handleRegister}>Register for this event</button>
          )}
          {event.url && (
            <a className="btn btn-outline" href={event.url} target="_blank" rel="noreferrer">
              View on Ticketmaster ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}