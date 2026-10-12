# Mini Ticket Tracker Frontend

React, TypeScript, and Vite frontend for viewing and managing support tickets.

## Requirements

- Git
- Node.js and npm
- The Mini Ticket Tracker backend running on port `8000`

## Setup

These commands work in macOS, Linux, Windows PowerShell, and Windows Command Prompt.

### 1. Clone the repository

```bash
git clone https://github.com/petermirithu/Mini-Ticket-Tracker-Frontend.git
cd Mini-Ticket-Tracker-Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the backend URL

The frontend uses `http://127.0.0.1:8000` by default. If the backend uses another address, create a `.env` file in the project root:

```dotenv
VITE_API_URL=http://127.0.0.1:8000
```

The backend must allow `http://localhost:5173` through its CORS configuration.

### 4. Start the frontend

Ensure the Django backend is running, then run:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Screenshot

![Mini Ticket Tracker landing page](./docs/landing-page.png)

## Features

- Status summary cards for open, in-progress, and closed ticket counts
- Responsive ticket table with title, description, status, priority, and creation date
- Client-side pagination with six tickets per page
- Popup form for creating tickets
- Inline status updates using each row's status selector
- Loading, empty, API error, and update error states
- Responsive mobile and desktop layouts

## API usage

The frontend uses these backend endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/tickets` | Fetch all paginated ticket results |
| `GET` | `/tickets/stats` | Fetch ticket counts grouped by status |
| `POST` | `/tickets` | Create a ticket |
| `PATCH` | `/tickets/:id` | Change a ticket's status |

## Validation

```bash
npm run lint
npm run build
```

## Decisions and tradeoffs

The interface uses one responsive page to keep ticket management simple. API calls live in a small typed client rather than adding a data-fetching dependency. The frontend follows every backend result page before applying client-side table pagination. Status counts are loaded from the stats endpoint and updated locally after successful ticket mutations. Status changes wait for the API response before updating the row, and failures are shown above the table. The create form uses a modal so users remain within the ticket queue context. Styling uses custom CSS instead of a UI framework. With more time, focus trapping, toast notifications, server-driven table pagination, and end-to-end browser tests could be added.