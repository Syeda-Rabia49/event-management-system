import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchEvents,
  fetchEventById,
  fetchClassifications,
  normalizeEvent,
} from '../../services/ticketmaster';

const PAGE_SIZE = 12;
const isoNow = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

export const defaultFilters = {
  keyword: '',
  category: '',
  city: '',
  sort: 'date,asc',
  startDate: '',
};

export const loadEvents = createAsyncThunk('events/loadEvents', async (_, { getState }) => {
  const { filters, page } = getState().events;
  const data = await fetchEvents({
    keyword: filters.keyword,
    classificationName: filters.category,
    city: filters.city,
    sort: filters.sort,
    // default = upcoming events only
    startDateTime: filters.startDate ? `${filters.startDate}T00:00:00Z` : isoNow(),
    size: PAGE_SIZE,
    page,
  });
  return {
    items: (data._embedded?.events ?? []).map(normalizeEvent),
    // API doesn't allow paging past 1000 results
    totalPages: Math.min(data.page?.totalPages ?? 0, Math.floor(1000 / PAGE_SIZE)),
    totalElements: data.page?.totalElements ?? 0,
  };
});

export const loadEventDetails = createAsyncThunk('events/loadEventDetails', async (id) =>
  normalizeEvent(await fetchEventById(id))
);

export const loadCategories = createAsyncThunk(
  'events/loadCategories',
  async () => {
    const data = await fetchClassifications();
    const names = (data._embedded?.classifications ?? [])
      .map((c) => c.segment?.name)
      .filter((n) => n && n !== 'Undefined');
    return [...new Set(names)].sort();
  },
  { condition: (_, { getState }) => getState().events.categoriesStatus === 'idle' }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    requestId: null,
    page: 0,
    totalPages: 0,
    totalElements: 0,
    filters: defaultFilters,
    categories: [],
    categoriesStatus: 'idle',
    selected: null,
    selectedStatus: 'idle',
    selectedError: null,
  },
  reducers: {
    setFilters(state, { payload }) {
      state.filters = payload;
      state.page = 0;
    },
    resetFilters(state) {
      state.filters = defaultFilters;
      state.page = 0;
    },
    setPage(state, { payload }) {
      state.page = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadEvents.pending, (s, a) => {
        s.status = 'loading';
        s.error = null;
        s.requestId = a.meta.requestId;
      })
      .addCase(loadEvents.fulfilled, (s, a) => {
        if (s.requestId !== a.meta.requestId) return; // ignore stale responses
        s.status = 'succeeded';
        Object.assign(s, a.payload);
      })
      .addCase(loadEvents.rejected, (s, a) => {
        if (s.requestId !== a.meta.requestId) return;
        s.status = 'failed';
        s.error = a.error.message;
      })
      .addCase(loadEventDetails.pending, (s, a) => {
        s.selectedStatus = 'loading';
        s.selectedError = null;
        if (s.selected?.id !== a.meta.arg) s.selected = null;
      })
      .addCase(loadEventDetails.fulfilled, (s, a) => {
        s.selectedStatus = 'succeeded';
        s.selected = a.payload;
      })
      .addCase(loadEventDetails.rejected, (s, a) => {
        s.selectedStatus = 'failed';
        s.selectedError = a.error.message;
      })
      .addCase(loadCategories.pending, (s) => {
        s.categoriesStatus = 'loading';
      })
      .addCase(loadCategories.fulfilled, (s, a) => {
        s.categoriesStatus = 'succeeded';
        s.categories = a.payload;
      })
      .addCase(loadCategories.rejected, (s) => {
        s.categoriesStatus = 'failed';
      });
  },
});

export const { setFilters, resetFilters, setPage } = eventsSlice.actions;
export default eventsSlice.reducer;