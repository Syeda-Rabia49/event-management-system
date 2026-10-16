const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const API_KEY = import.meta.env.VITE_TM_API_KEY;

async function request(path, params = {}) {
  if (!API_KEY) throw new Error('Missing API key. Add VITE_TM_API_KEY to your .env file.');
  const url = new URL(`${BASE_URL}/${path}`);
  url.searchParams.set('apikey', API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });
  const res = await fetch(url);
  if (res.status === 429) throw new Error('Too many requests. Please wait a moment and try again.');
  if (res.status === 404) throw new Error('Event not found.');
  if (!res.ok) throw new Error(`Request failed (${res.status}).`);
  return res.json();
}

export const fetchEvents = (params) => request('events.json', params);
export const fetchEventById = (id) => request(`events/${id}.json`);
export const fetchClassifications = () => request('classifications.json', { size: 200 });

// Flatten the API's deeply nested response into a simple object
export function normalizeEvent(e) {
  const venue = e._embedded?.venues?.[0];
  const cls = e.classifications?.[0];
  const images = e.images ?? [];
  const image = (images.find((i) => i.ratio === '16_9' && i.width >= 600) ?? images[0])?.url ?? null;
  const price = e.priceRanges?.[0];
  const genre = cls?.genre?.name;

  return {
    id: e.id,
    name: e.name,
    image,
    url: e.url ?? null,
    date: e.dates?.start?.localDate ?? null,
    time: e.dates?.start?.localTime ?? null,
    status: e.dates?.status?.code ?? null,
    venue: venue?.name ?? 'Venue TBA',
    address: venue?.address?.line1 ?? null,
    city: venue?.city?.name ?? null,
    state: venue?.state?.name ?? null,
    country: venue?.country?.name ?? null,
    category: cls?.segment?.name ?? 'Other',
    genre: genre && genre !== 'Undefined' ? genre : null,
    priceMin: price?.min ?? null,
    priceMax: price?.max ?? null,
    currency: price?.currency ?? null,
    info: e.info ?? null,
    pleaseNote: e.pleaseNote ?? null,
    promoter: e.promoter?.name ?? null,
  };
}