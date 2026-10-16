export const eventDate = (e) =>
  e.date ? new Date(`${e.date}T${e.time || '00:00:00'}`) : null;

export function formatDate(e) {
  const d = eventDate(e);
  return d
    ? d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
    : 'Date TBA';
}

export function formatTime(e) {
  return e.time
    ? eventDate(e).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : 'Time TBA';
}

export const formatLocation = (e) =>
  [e.city, e.state, e.country].filter(Boolean).join(', ');

export function isPastEvent(e) {
  const d = eventDate(e);
  if (!d) return false;
  if (!e.time) d.setHours(23, 59, 59);
  return d < new Date();
}