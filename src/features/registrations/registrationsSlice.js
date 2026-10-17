import { createSlice } from '@reduxjs/toolkit';
import { loadFromStorage } from '../../utils/storage';

const EMPTY = [];

// Registrations are stored per user id: { [userId]: [event, ...] }
const registrationsSlice = createSlice({
  name: 'registrations',
  initialState: { byUser: loadFromStorage('registrations', {}) },
  reducers: {
    registerEvent(state, { payload: { userId, event } }) {
      const list = (state.byUser[userId] ??= []);
      if (list.some((e) => e.id === event.id)) return; // prevent duplicates
      list.push({ ...event, registeredAt: new Date().toISOString() });
    },
    cancelRegistration(state, { payload: { userId, eventId } }) {
      state.byUser[userId] = (state.byUser[userId] || []).filter(
        (e) => e.id !== eventId
      );
    },
  },
});

export const selectUserRegistrations = (state) => {
  const user = state.auth.user;
  return (user && state.registrations.byUser[user.id]) || EMPTY;
};

export const { registerEvent, cancelRegistration } = registrationsSlice.actions;
export default registrationsSlice.reducer;