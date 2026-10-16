import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import eventsReducer from '../features/events/eventsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
  },
});

// Persist session and accounts so they survive a page refresh
let prev = store.getState();
store.subscribe(() => {
  const s = store.getState();
  if (s.auth !== prev.auth) {
    localStorage.setItem('session', JSON.stringify(s.auth.user));
    localStorage.setItem('users', JSON.stringify(s.auth.users));
  }
  prev = s;
});