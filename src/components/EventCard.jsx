import { Link } from 'react-router-dom';
import { formatDate, formatTime, formatLocation } from '../utils/format';

export default function EventCard({ event, badge, children }) {
  const location = formatLocation(event);
  return (
    <article className="card">
      <Link to={`/events/${event.id}`} className="card-img">
        {event.image ? (
          <img src={event.image} alt={event.name} loading="lazy" />
        ) : (
          <div className="img-fallback">No image</div>
        )}
        <span className="tag">{event.category}</span>
      </Link>
      <div className="card-body">
        {badge && <span className="badge">{badge}</span>}
        <h3><Link to={`/events/${event.id}`}>{event.name}</Link></h3>
        <p className="muted">📅 {formatDate(event)} · {formatTime(event)}</p>
        <p className="muted">📍 {event.venue}{location ? `, ${location}` : ''}</p>
        {children && <div className="card-actions">{children}</div>}
      </div>
    </article>
  );
}