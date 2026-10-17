import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import eventsReducer from '../features/events/eventsSlice';
import registrationsReducer from '../features/registrations/registrationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
  },
});

// Persist session, accounts and registrations so they survive a page refresh
let prev = store.getState();
store.subscribe(() => {
  const s = store.getState();
  if (s.auth !== prev.auth) {
    localStorage.setItem('session', JSON.stringify(s.auth.user));
    localStorage.setItem('users', JSON.stringify(s.auth.users));
  }
  if (s.registrations !== prev.registrations) {
    localStorage.setItem('registrations', JSON.stringify(s.registrations.byUser));
  }
  prev = s;
});