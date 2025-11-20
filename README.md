
# Wing Man 💘 AI Dating Assistant

<div align="center">
  <img src="./assets/icon-512x512.svg" alt="Wing Man Logo" width="150">
</div>

<p align="center">
  <strong>Like having your best friend in your pocket.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/built%20with-React-61DAFB.svg" alt="Built with React">
  <img src="https://img.shields.io/badge/powered%20by-Gemini%20API-4285F4.svg" alt="Powered by Gemini API">
</p>

---

**Wing Man** is an AI-powered dating assistant designed to help you navigate the complexities of dating with confidence. From crafting the perfect reply to planning a memorable date, Wing Man has your back. This application is a powerful demonstration of the capabilities of the Google Gemini API.

## ✨ Features

*   **👤 Profile Manager**: Create detailed profiles for people you're interested in to get personalized advice.
*   **💬 Text Helper**: Never get stuck on "what to say next." Get AI-powered suggestions for your conversations.
*   **🗓️ Date Planner**: Generate unique date ideas based on personality profiles and save them to your calendar.
*   **🎁 Gift Lab**: Brainstorm thoughtful, personalized gift ideas and even generate custom AI art for print-on-demand items.
*   **💡 Dating Advice**: Get concise, actionable advice on what to wear, what to say, and how to act for any date scenario.
*   **🌐 Travel Interpreter**: Break language barriers with real-time text translation and natural-sounding text-to-speech.
*   **⚙️ User Settings**: Personalize your experience with a custom display name, avatar, and location-aware suggestions.

## 🚀 Getting Started

### Prerequisites
*   [**Node.js**](https://nodejs.org/) (Version 18 or higher recommended)
*   [**Git**](https://git-scm.com/downloads)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/coachmecochd/Wing-Man-.git
    cd Wing-Man-
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### 🔑 API Key Setup (Important!)

You need a Google Gemini API key for the AI features to work.

1.  **Get a Key:** Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and create a free API key.
2.  **Create Config File:**
    *   Create a new file in the root folder named `.env`
    *   Open it and add your key:
        ```
        API_KEY=AIzaSy...YourActualKeyHere
        ```
    *   *Note: Do not share this file or upload it to GitHub.*

### Running the App
1.  **Start the development server:**
    ```bash
    npm run dev
    ```
2.  **Open your browser:**
    *   Visit `http://localhost:5173` (or the URL shown in your terminal).

## 🌐 Deployment to GitHub Pages

1.  **Push your code to GitHub.**
2.  **Configure the Secret:**
    *   Go to your GitHub Repository.
    *   Click **Settings** > **Secrets and variables** > **Actions**.
    *   Click **New repository secret**.
    *   **Name:** `API_KEY`
    *   **Value:** Your Google Gemini API Key.
3.  **Enable GitHub Pages:**
    *   Go to **Settings** > **Pages**.
    *   Under **Source**, select **GitHub Actions**.
4.  **Watch it Build:**
    *   Go to the **Actions** tab to see the deployment progress.

## 🛠️ How It Works

Wing Man is a single-page application (SPA) built with:
*   **Vite**: For fast building and development.
*   **React**: For the user interface.
*   **@google/genai**: To communicate with Google's Gemini models.
*   **TailwindCSS**: For styling.

## 🔒 Privacy

Your privacy is paramount. All data (profiles, chats, etc.) is stored locally on your device using your browser's `localStorage`. This data is never sent to a server. Only the prompt data needed for AI responses is sent to the Google Gemini API.

## 📄 License

This project is licensed under the MIT License.
