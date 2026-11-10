# CollabRun Frontend
CollabRun is a project-discovery and collaboration website for developers, designers, and teams looking for collaborators.
This React frontend provides project browsing, applications, messaging, profiles, and persistent light/dark themes.

![Frontend screenshot placeholder](./SCREENSHOT_PLACEHOLDER.png)

> **Screenshot:** Replace `SCREENSHOT_PLACEHOLDER.png` with an image captured from the running app. No screenshot asset is currently included.

## Features
- Browse and search community projects, including skill and goal text.
- Sort projects by newest, oldest, or title.
- Apply to projects and view collaboration conversations.
- Edit profile details, skills, links, and avatar.
- Switch between light and dark themes; theme choice persists in browser storage.
- Responsive navigation, loading feedback, empty states, and accessible controls.

## Tech Stack
- React 18 with Create React App (`react-scripts`).
- JavaScript and JSX.
- Framer Motion for transitions, Lucide React for icons, and React Toastify for notifications.
- Styling uses Tailwind utility classes plus custom CSS variables for theme colors.

## Getting Started

### Prerequisites
- Node.js and npm. **Exact supported Node version: [TODO: declare and validate Node version].**
- The CollabRun FastAPI backend running on port `8000`, unless `REACT_APP_API_BASE_URL` is set to another API base.

### Install and run
From the repository root:

```powershell
cd frontend
npm ci
npm start
```

Open <http://localhost:3000>.

### Environment variables
Create `frontend/.env.local` if you need to override the API URL (for example, use the deployed API origin):

```dotenv
REACT_APP_API_URL=https://dev-cloud-4t37.onrender.com
```

The default API URL is `https://dev-cloud-4t37.onrender.com`; use `http://127.0.0.1:8000` for local backend development. Do not place secrets in frontend variables; values compiled into a browser app are public.

### Run with the backend
In a second terminal, configure `backend/.env` using `backend/.env.example`, then follow `backend/README.md` to start FastAPI and configure PostgreSQL. Frontend and backend are started in separate terminals; **one-command combined development startup: [TODO: add a root-level development script or Compose file].**

## Usage
- Use **Explore Projects** to browse, search, sort, and apply.
- Sign in or create an account to post projects, view messages, and edit a profile.
- Use the sun/moon control in navigation to change the color theme.
- Authenticated user details are retained in browser session storage for the current session. This is client-side state, not a replacement for server-side session authentication.

## API Documentation
The frontend calls the FastAPI backend at `REACT_APP_API_BASE_URL`.
Interactive API documentation is served by FastAPI at <http://127.0.0.1:8000/docs> while the backend is running.

## Design Decisions
- A small set of CSS custom properties drives both themes so components share structure and stay visually consistent.
- The visual system uses neutral surfaces and one green accent instead of gradients on every control.
- Project search and sorting happen client-side over the currently loaded result page. Pagination comes from the backend; cross-page searching is not currently implemented.
- UI route state is held in React state rather than a router; refreshable deep links for each page are not implemented.

## Testing
```powershell
cd frontend
npm test -- --watchAll=false --runInBand
```
Current check: **8 test suites, 11 tests**. For the optimized bundle:

```powershell
npm run build
```

## Deployment
**Deployment provider, public URL, and frontend deployment workflow: [TODO: fill in after deployment].** For production, set `REACT_APP_API_URL` to the HTTPS origin of the deployed API and configure backend CORS for the frontend origin.

## Troubleshooting
- **API requests fail:** confirm the backend is running and the API URL points to `/api/v1`.
- **Browser CORS error:** add the deployed frontend origin to the backend CORS allowlist.
- **Port 3000 is busy:** stop the other process using it or accept the alternate port offered by the development server.
- **Dependency install differs from local setup:** use `npm ci` so npm follows `package-lock.json`.
- **Changes do not show:** hard-refresh the browser; the production build is separate from the development server.

## License
**License: [TODO: choose and add a license before distribution].**
