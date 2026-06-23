# 🎯 Intent

> *Commit to one thing. Focus. Reflect. Build streaks.*

**Intent** is a Duolingo-style intentionality tracker for iOS and Android. Pick a single intention, focus on it for 10–60 minutes, reflect on how it went, and build daily streaks of intentional minutes.

---

## ✨ Features

- 📝 **Single Intention** — Set one clear intention before each session.
- ⏱️ **Live Focus Timer** — Animated circular progress ring during 10–60 minute sessions.
- 😊 **Post-Session Reflection** — Rate your mood and capture quick notes after each session.
- 🔥 **Daily Streaks** — Gamified fire and badge counters that reward consistent practice.
- 📅 **Calendar Heatmap** — Visualize intentional minutes per day at a glance.
- 📜 **Daily Review Timeline** — Scroll through past sessions to see what you focused on.
- 🔔 **Push Notifications** — Reminders for daily practice, session completion, and streak warnings.
- 📤 **Data Export** — Export your history as Markdown, CSV, or JSON.
- 🚀 **Animated Onboarding** — Friendly walkthrough to get started quickly.
- 📳 **Haptic Feedback** — Subtle tactile feedback throughout the app.

---

## 🛠️ Tech Stack

- **Expo** (React Native)
- **TypeScript**
- **Drizzle ORM** + `expo-sqlite`
- **Zustand** for state management
- **React Native Reanimated** for animations
- **React Native SVG** for custom icons

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

> **Note:** A native development build is required for push notifications. Use `expo prebuild` or run with a custom dev client.

---

## 📁 Project Structure

```
intent/
├── app/                 # Expo Router screens
│   ├── (tabs)/          # Main tab layout (Home, Review, Calendar, Settings)
│   └── ...              # Intent, Timer, Reflection, Onboarding, Day detail screens
├── components/          # Reusable UI components
├── stores/              # Zustand state stores
├── db/                  # Drizzle schema, migrations, and queries
├── assets/              # Images, fonts, and SVG assets
├── hooks/               # Custom React hooks
├── constants/           # Theme, colors, and app constants
└── utils/               # Helpers and formatters
```

---

## 📸 Screenshots

<!-- TODO: Add device screenshots here -->

---

## 📄 License

MIT © [aban-afk](https://github.com/aban-afk)
