---
description: End-to-end Workout Tracking Flow
---

# Workout Tracking System Workflow

This document outlines the full end-to-end logic for the daily workout progress tracking system implemented in the V-10 Gym App.

## 1. Authentication & Security
- **Protected Routes**: All user frontend modules are wrapped in a `ProtectedRoute` component.
- **JWT Guard**: The component checks for `userToken` in `localStorage`. If missing, it force-redirects to `/login`.
- **Logout**: Clears `userToken` and `userData` to revoke access.

## 2. Smart Home Dashboard
- **Auto-Day Selection**: The system detects the current day (e.g., "Monday") and identifies the scheduled workout type from the user's active plan.
- **Dynamic Stats**: The backend calculates:
    - `completions`: Total sessions logged in the last 7 days.
    - `target`: Total number of active workout days in the assigned plan.
    - `progress`: Percentage based on `(completions / target) * 100`.
- **Progress Card**: Renders a circular SVG progress bar and a "Continue" button that deep-links to the active workout session.

## 3. Live Workout Tracking (Daily Session)
- **Automatic Day Focus**: When entering the workout details, the app auto-scrolls/selects the current day.
- **Local Progress Persistence**: 
    - As users mark exercises as done, the state is saved to `localStorage` under a key specific to the `planId` and `day`.
    - **Resume Capability**: If the app is closed, returning to this page restores the completion checkmarks instantly.
- **Interactive Checklist**: Clicking an exercise card toggles its completion status with visual/haptic-style feedback.

## 4. Completion & Synchronization
- **Finish Session**: Sending a POST request to `/api/user/workouts/log` with the IDs of completed exercises.
- **Cache Cleanup**: Upon success, the specific `localStorage` cache for that day is deleted.
- **Global Event**: A `workoutCompleted` custom event is dispatched. 
- **Auto-Refresh**: The Home dashboard listens for this event and silently re-fetches stats from the API to show the updated progress bar without a page reload.

## 5. Data Architecture
- **Workout Plan**: Static weekly schedule (Blueprint).
- **Workout Log**: Timestamped record of an actual performed session (Occurrence).
- **Backend Correlation**: The backend aggregates logs over a rolling 7-day window to provide the "Weekly Goal" status.
