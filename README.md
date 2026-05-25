# CSI VIT Chennai — Student Chapter Platform

A comprehensive, full-stack web platform for the **Computer Society of India (CSI) — VIT Chennai Student Chapter**. Built to streamline chapter operations, boost member engagement, and showcase events, projects, and achievements — all in one place.

## Tech Stack

| Layer        | Technology                        |
| ------------ | --------------------------------- |
| Framework    | [Next.js](https://nextjs.org)     |
| Backend/Auth | [Firebase](https://firebase.google.com) (Auth, Firestore) |
| Styling      | [Tailwind CSS](https://tailwindcss.com) |
| Animations   | [Framer Motion](https://www.framer.com/motion/) |
| Deployment   | [Vercel](https://vercel.com)      |

## Features

1. **Landing Page** — Animated hero, chapter highlights, and quick-access navigation.
2. **Authentication** — Secure login/signup powered by Firebase Auth.
3. **Member Dashboard** — Personalized dashboard with activity overview and announcements.
4. **Admin Panel** — Manage members, events, projects, and site content.
5. **Events** — Browse upcoming and past events with details, dates, and registration.
6. **Hackathons** — Dedicated hackathon listings with timelines and team info.
7. **Workshops** — Workshop catalog with schedules, topics, and registration.
8. **Projects** — Showcase of member and chapter projects with descriptions.
9. **Community** — Discussion and collaboration space for members.
10. **Resources** — Curated learning materials, guides, and reference links.
11. **Leaderboard** — Gamified member rankings based on participation and contributions.
12. **Certificates** — Generate and download participation/achievement certificates.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18 or later)
- A Firebase project with Firestore and Authentication enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-org>/csi-website.git
cd csi-website

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Open .env.local and fill in your Firebase config values

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

Copy `.env.example` to `.env.local` and populate the values from your Firebase project settings:

| Variable | Description |
| -------- | ----------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Cloud Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Google Analytics measurement ID |

> **Note:** Never commit `.env.local` — it is git-ignored by default.

## Deployment

This project is optimized for **[Vercel](https://vercel.com)**:

1. Push your repo to GitHub.
2. Import the project in the Vercel dashboard.
3. Add the environment variables listed above in **Settings → Environment Variables**.
4. Deploy — Vercel will auto-build and serve your Next.js app.

## License

This project is maintained by the CSI VIT Chennai Student Chapter.
