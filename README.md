# Hotel Management System (HMS) - Frontend Only

A modern, frontend-only Hotel Management System dashboard built for a university final year project. 
It uses **React**, **TypeScript**, and **Tailwind CSS**.

**NO BACKEND IS USED.** Data is persisted in the browser's `localStorage`.

## 🚀 Quick Start

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```

## 💾 Data Management (IMPORTANT)

This app simulates a backend using `src/services/dataService.ts`.

-   **Initial Data**: On the very first load, the app fetches JSON files from `/public/data/` and saves them to your browser's `localStorage`.
-   **Runtime Data**: All subsequent changes (bookings, room status) are saved to `localStorage`.
-   **Resetting Data**: If you want to reset the app to its default state:
    1.  Open the browser console (F12).
    2.  Run the command: `localStorage.clear()`
    3.  Refresh the page.
    4.  Alternatively, call `DataService.resetToPublicData()` in your code.

## 🛠 Tech Stack

-   **Framework**: React (Vite)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Charts**: Recharts
-   **Animations**: Framer Motion
-   **Routing**: React Router DOM (HashRouter)

## 📁 Project Structure

-   `public/data/`: Static JSON files acting as the "database".
-   `src/components/`: Reusable UI components (Sidebar, StatsCard, etc.).
-   `src/pages/`: Application screens (Dashboard, Login).
-   `src/services/`: Logic for data handling and storage.
