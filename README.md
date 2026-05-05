# CSSD Solo Parent Management System

A records management and SMS notification system built for a **City Social Services Department (CSSD)**. The system digitizes the solo parent registration process, automates membership expiry tracking, and enables administrators to broadcast scheduled SMS announcements to all registered solo parents.


## Features

- **Solo Parent Registry** — Full application form covering personal info, family composition, employment, health card membership, and tenurial status
- **Dashboard & Reports** — Visual charts (by gender, active/inactive status, barangay) with print-ready report generation
- **Automated Membership Expiry** — Background worker monitors membership validity and automatically deactivates expired records
- **SMS Notifications via Twilio** — Two automated SMS types:
  - Early expiry reminder sent ahead of the expiration date
  - Scheduled broadcast announcements sent to all active solo parents
- **Admin Authentication** — Token-based auth; all record management is restricted to admin users

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, Recharts, React Router v6 |
| Backend | Django 4.1, Django REST Framework, Djoser |
| Background Tasks | django4-background-tasks |
| SMS | Twilio |
| Database | MySQL 8 |
| Server | Gunicorn (production), Django dev server (development) |
| Containerization | Docker, Docker Compose |

## Running the Project

**Development**
```bash
docker compose up --build
```

**Production**
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

> Copy `.env.example` to `.env` and fill in the required values before starting.

## Environment Variables

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key |
| `DB_NAME` | MySQL database name |
| `DB_USER` | MySQL user |
| `DB_PASSWORD` | MySQL password |
| `DB_HOST` | MySQL host |
| `TWILIO_ACC_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_FROM_NUMBER` | Twilio sender number |
| `CSRF_TRUSTED_ORIGINS` | Comma-separated list of trusted origins |
| `REACT_APP_API_URL` | Backend API base URL (frontend) |