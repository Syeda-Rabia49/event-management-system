# EventHub – Event Management System

A React app for exploring events, viewing event details, registering for events and managing your registrations. Event data comes from the Ticketmaster Discovery API.

## Features

- Register, login and logout (frontend simulation; the session persists after a page refresh via Local Storage)
- Browse upcoming events with search, category filters, city and date filters, sorting and pagination
- Event details page with image, date and time, venue, location, category, price and more
- Register for an event (duplicate registrations are prevented) and cancel a registration
- My Events page with Upcoming and Completed tabs
- Protected routes, loading and error states, form validation and a responsive layout

## Tech stack

- React (Vite)
- Redux Toolkit (`configureStore`, `createSlice`, `createAsyncThunk`)
- React Router
- Ticketmaster Discovery API

## Setup

1. Clone the repository and install dependencies:
```bash
   git clone https://github.com/Syeda-Rabia49/event-management-system.git
   cd event-management-system
   npm install
```
2. Get a free API key (the Consumer Key) from https://developer.ticketmaster.com/ (log in, then My Apps).
3. Create a `.env` file in the project root, using `.env.example` as a template:
```
   VITE_TM_API_KEY=your_consumer_key_here
```
4. Start the development server:
```bash
   npm run dev
```
5. Open the local address shown in the terminal (usually http://localhost:5173).

## Scripts

- `npm run dev` – start the development server
- `npm run build` – create a production build
- `npm run preview` – preview the production build

## Project structure

```
src/
  app/            Redux store
  features/       Redux slices (auth, events, registrations)
  services/       Ticketmaster API calls
  components/     Reusable components (Navbar, EventCard, SearchFilters, ...)
  pages/          Login, Register, Events, EventDetails, MyEvents
  utils/          Date formatting and storage helpers
```

## Notes

- Authentication is a frontend simulation. Accounts and registrations are stored in the browser's Local Storage, and passwords are not secure.
- The `.env` file is ignored by Git. Never commit your API key.
- The Ticketmaster API allows 5,000 requests per day and 2 requests per second.