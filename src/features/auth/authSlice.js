import { createSlice } from '@reduxjs/toolkit';
import { loadFromStorage } from '../../utils/storage';

// Frontend-only simulation: accounts live in localStorage (passwords are NOT secure here).
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: loadFromStorage('session', null),
    users: loadFromStorage('users', []),
    error: null,
  },
  reducers: {
    register(state, { payload }) {
      const email = payload.email.trim().toLowerCase();
      if (state.users.some((u) => u.email === email)) {
        state.error = 'An account with this email already exists.';
        return;
      }
      const user = {
        id: Date.now().toString(),
        name: payload.name.trim(),
        email,
        password: payload.password,
      };
      state.users.push(user);
      state.user = { id: user.id, name: user.name, email: user.email };
      state.error = null;
    },
    login(state, { payload }) {
      const email = payload.email.trim().toLowerCase();
      const found = state.users.find(
        (u) => u.email === email && u.password === payload.password
      );
      if (!found) {
        state.error = 'Invalid email or password.';
        return;
      }
      state.user = { id: found.id, name: found.name, email: found.email };
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { register, login, logout, clearError } = authSlice.actions;
export default authSlice.reducer; 