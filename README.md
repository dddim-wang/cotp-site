# COTP Official Website

A minimal, sharp, forward-looking full-stack website for the band COTP.

## Structure

```txt
cotp-site/
├── frontend/   React + Vite website
└── backend/    Flask API
```

## Pages / Sections

- Merch
- Music
- Contact

## Run locally

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs at:

```txt
http://localhost:5000
```

Test API:

```txt
http://localhost:5000/api/health
http://localhost:5000/api/merch
http://localhost:5000/api/music
```

### 2. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at the URL printed by Vite, usually:

```txt
http://localhost:5173
```

## Configure API URL

Create `frontend/.env`:

```env
VITE_API_BASE=http://localhost:5000/api
```

For deployment, change this to your deployed backend URL.

## Customize content

Frontend fallback data is in:

```txt
frontend/src/main.jsx
```

Backend API data is in:

```txt
backend/app.py
```

Edit these arrays:

- `MERCH`
- `MUSIC`

## Deploy notes

### Frontend

Deploy `frontend` to Vercel, Netlify, Railway, or any static hosting service.

Build command:

```bash
npm run build
```

Output folder:

```txt
dist
```

### Backend

Deploy `backend` to Railway or Render.

Start command:

```bash
gunicorn app:app --bind 0.0.0.0:$PORT
```

## Visual direction

- Black background
- White typography
- High contrast borders
- Sharp diagonal blade shapes
- Minimal product cards
- No unnecessary decoration
