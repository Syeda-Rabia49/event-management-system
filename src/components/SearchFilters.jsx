import { useEffect, useState } from 'react';

export default function SearchFilters({ filters, onApply, onReset }) {
  const [draft, setDraft] = useState(filters);

  useEffect(() => setDraft(filters), [filters]);

  const change = (e) => setDraft({ ...draft, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onApply({ ...draft, keyword: draft.keyword.trim(), city: draft.city.trim() });
  };

  return (
    <form className="filters" onSubmit={submit}>
      <input name="keyword" placeholder="Search events, artists, teams…" value={draft.keyword} onChange={change} />
      <input name="city" placeholder="City" value={draft.city} onChange={change} />
      <input type="date" name="startDate" value={draft.startDate} onChange={change} title="Starting from" />
      <select name="sort" value={draft.sort} onChange={change}>
        <option value="date,asc">Soonest first</option>
        <option value="date,desc">Latest first</option>
        <option value="name,asc">Name A–Z</option>
        <option value="relevance,desc">Most relevant</option>
      </select>
      <button type="submit" className="btn">Search</button>
      <button type="button" className="btn btn-outline" onClick={onReset}>Reset</button>
    </form>
  );
}