# Rosetta – Language Learning App

Rosetta is a modern, mobile-first language learning app built with [Expo](https://expo.dev), [React Native](https://reactnative.dev/), and [Firebase](https://firebase.google.com/). It features a personalized onboarding, interactive exercises, user progress tracking, and a clean, modular codebase using file-based routing.

---

## Table of Contents

- Features
- Project Structure
- Setup & Installation
- Development Workflow
- Onboarding Flow
- Learning Experience
- Authentication & User Data
- Firebase Integration
- Assets & Fonts
- Scripts
- Testing & Linting
- Contributing
- License

---

## Features

- **Personalized Onboarding:** Collects user language, level, interests, and learning frequency.
- **Authentication:** Email/password sign-up and login using Firebase Auth.
- **Interactive Exercises:** Oral, written, fill-in-the-blank, and definition-matching exercises, fetched from an external API.
- **Progress Tracking:** User progress is tracked and stored in Firestore.
- **Premium & Rewards:** Dedicated screens for premium features and user rewards.
- **Modern UI:** Custom components, bottom navigation, and responsive design.
- **File-based Routing:** Powered by Expo Router for scalable navigation.
- **Persistent Storage:** Uses AsyncStorage for local data during onboarding and session management.

---

## Project Structure

```
app/
  _layout.tsx                # Root layout, handles auth and navigation
  components/                # Reusable UI components (Button, Input, etc.)
  controllers/               # Business logic (userController.ts)
  learn/                     # Main learning area (exercises, profile, premium, rewards)
    exercices/               # Individual exercise screens
  onboarding/                # Onboarding flow screens
assets/
  fonts/                     # Custom fonts (Outfit, SpaceMono)
  images/                    # App images and icons
firebaseConfig.js            # Firebase initialization and helpers
metro.config.js              # Metro bundler config
eslint.config.js             # ESLint config
tsconfig.json                # TypeScript config
package.json                 # Dependencies and scripts
```

---

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd rosetta
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```
   - Open the app in:
     - [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
     - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
     - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
     - [Expo Go](https://expo.dev/go) (for basic preview)

---

## Development Workflow

- **Edit screens** in the app directory. The project uses [file-based routing](https://docs.expo.dev/router/introduction/).
- **Custom components** are in components.
- **Business logic** (user profile, progress, etc.) is in controllers.
- **Assets** (fonts, images) are in the assets directory.

---

## Onboarding Flow

The onboarding process collects user preferences and creates a personalized experience:

1. **Welcome:** Introduction to Rosetta.
2. **Language Selection:** Choose the language to learn.
3. **Level Selection:** Select your proficiency level.
4. **Interests:** Pick topics of interest.
5. **Learning Frequency:** Set your learning goal.
6. **Identity & Signup:** Create an account or log in.
7. **Ready:** Confirmation and transition to the learning area.

All onboarding data is stored locally until account creation, then merged and saved in Firestore.

---

## Learning Experience

- **Home (`/learn`):** Dashboard with progress, recommended exercises, and premium upsell.
- **Exercises:** Four main types, each in its own file:
  - Oral comprehension (oral.tsx)
  - Written comprehension (write.tsx)
  - Fill-the-text (text-to-fill.tsx)
  - Definition matcher (matcher.tsx)
- **Profile:** View and edit user info, update preferences.
- **Rewards & Premium:** Dedicated screens for gamification and premium features.
- **Bottom Navigation:** Persistent navigation bar for quick access.

---

## Authentication & User Data

- **Firebase Auth:** Handles sign-up, login, and session management.
- **Firestore:** Stores user profiles, progress, and preferences.
- **AsyncStorage:** Used for temporary onboarding data and session persistence.

---

## Firebase Integration

- All Firebase configuration is in firebaseConfig.js.
- Uses `initializeAuth` with React Native persistence.
- User profile CRUD operations are in userController.ts.

---

## Assets & Fonts

- **Fonts:** Custom fonts (Outfit, SpaceMono) are loaded at startup.
- **Images:** All app images and icons are in images.

---

## Scripts

- `npm start` – Start the Expo development server.
- `npm run android` – Launch on Android emulator.
- `npm run ios` – Launch on iOS simulator.
- `npm run web` – Launch in web browser.
- `npm run lint` – Run ESLint.

---

## Testing & Linting

- **Linting:** ESLint is configured via eslint.config.js and can be run with `npm run lint`.
- **TypeScript:** Strict mode enabled via tsconfig.json.
- **Testing:** (Add your preferred testing setup here.)

---

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Commit your changes.
4. Push to your fork and submit a pull request.

---

## License

This project is licensed under the MIT License.

---

**Learn more:**

- [Expo documentation](https://docs.expo.dev/)
- [Firebase documentation](https://firebase.google.com/docs/)
- [React Native documentation](https://reactnative.dev/)

---

If you have any questions or want to join the community:

- [Expo on GitHub](https://github.com/expo/expo)
- [Expo Discord](https://chat.expo.dev)