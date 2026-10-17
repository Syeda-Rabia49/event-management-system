import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadEvents, loadCategories, setFilters, resetFilters, setPage,
} from '../features/events/eventsSlice';
import { selectUserRegistrations } from '../features/registrations/registrationsSlice';
import EventCard from '../components/EventCard';
import SearchFilters from '../components/SearchFilters';
import { Loader, ErrorMessage } from '../components/UI';

export default function Events() {
  const dispatch = useDispatch();
  const { items, status, error, page, totalPages, totalElements, filters, categories } =
    useSelector((s) => s.events);
  const registeredIds = new Set(useSelector(selectUserRegistrations).map((e) => e.id));

  useEffect(() => { dispatch(loadCategories()); }, [dispatch]);
  useEffect(() => { dispatch(loadEvents()); }, [dispatch, filters, page]);

  const goToPage = (p) => {
    dispatch(setPage(p));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section>
      <h1>Upcoming events</h1>
      <p className="muted">
        {status === 'succeeded' && `${totalElements.toLocaleString()} events found`}
      </p>

      <div className="chips">
        <button className={`chip ${filters.category === '' ? 'active' : ''}`}
          onClick={() => dispatch(setFilters({ ...filters, category: '' }))}>
          All
        </button>
        {categories.map((c) => (
          <button key={c} className={`chip ${filters.category === c ? 'active' : ''}`}
            onClick={() => dispatch(setFilters({ ...filters, category: c }))}>
            {c}
          </button>
        ))}
      </div>

      <SearchFilters
        filters={filters}
        onApply={(f) => dispatch(setFilters(f))}
        onReset={() => dispatch(resetFilters())}
      />

      {status === 'loading' && <Loader text="Finding events…" />}
      {status === 'failed' && <ErrorMessage message={error} onRetry={() => dispatch(loadEvents())} />}
      {status === 'succeeded' && items.length === 0 && (
        <p className="empty">No events match your search. Try different filters.</p>
      )}

      {status === 'succeeded' && items.length > 0 && (
        <>
          <div className="grid">
            {items.map((event) => (
              <EventCard key={event.id} event={event}
                badge={registeredIds.has(event.id) ? '✓ Registered' : null} />
            ))}
          </div>
          <div className="pagination">
            <button className="btn btn-outline" disabled={page === 0} onClick={() => goToPage(page - 1)}>← Previous</button>
            <span>Page {page + 1} of {totalPages}</span>
            <button className="btn btn-outline" disabled={page + 1 >= totalPages} onClick={() => goToPage(page + 1)}>Next →</button>
          </div>
        </>
      )}
    </section>
  );
}