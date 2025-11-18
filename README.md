
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

**Wing Man** is an AI-powered dating assistant designed to help you navigate the complexities of dating with confidence. From crafting the perfect reply to planning a memorable date, Wing Man has your back. This application is a powerful demonstration of the capabilities of the Google Gemini API, running entirely in your browser with no backend server.

## ✨ Features

*   **👤 Profile Manager**: Create detailed profiles for people you're interested in to get personalized advice.
*   **💬 Text Helper**: Never get stuck on "what to say next." Get AI-powered suggestions for your conversations.
*   **🗓️ Date Planner**: Generate unique date ideas based on personality profiles and save them to your calendar.
*   **🎁 Gift Lab**: Brainstorm thoughtful, personalized gift ideas and even generate custom AI art for print-on-demand items.
*   **💡 Dating Advice**: Get concise, actionable advice on what to wear, what to say, and how to act for any date scenario.
*   **🌐 Travel Interpreter**: Break language barriers with real-time text translation and natural-sounding text-to-speech.
*   **⚙️ User Settings**: Personalize your experience with a custom profile picture and location-aware suggestions.

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have **Git** installed on your computer to manage the project files.
*   [**Download Git Here**](https://git-scm.com/downloads) - Choose the version for your operating system (Windows/Mac).

### Installation

#### Option A: Clone from GitHub (If starting empty)
If you have created the repository on GitHub and want to download it:
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/coachmecochd/Wing-Man-.git
    ```
2.  **Navigate to the directory:**
    ```bash
    cd Wing-Man-
    ```

#### Option B: Setup with Existing Files (If you have files locally)
If you already have the files on your computer and want to start tracking them:
1.  **Navigate to your folder** in the terminal:
    ```bash
    cd path/to/your/folder
    ```
    *(e.g., `cd E:\wing-man`)*
2.  **Initialize Git:**
    ```bash
    git init
    ```
3.  **Configure Identity (First time only):**
    If you see an "Author identity unknown" error, run these commands (replace with your info):
    ```bash
    git config --global user.email "you@example.com"
    git config --global user.name "Your Name"
    ```
4.  **Save your files:**
    ```bash
    git add .
    git commit -m "Initial setup"
    ```

### Running the App
1.  **Get a Google Gemini API Key:**
    *   Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to create your free API key. The execution environment must have this key available as the `API_KEY` environment variable.

2.  **Open the application:**
    *   Simply open the `index.html` file in a web browser.

## 🌐 Deployment & Updates

### Deploying to GitHub Pages
Since Wing Man runs entirely in the browser using Babel Standalone, deploying to GitHub Pages is simple:

1.  **Push to GitHub**: Ensure all your files are committed and pushed to your GitHub repository.
2.  **Enable GitHub Pages**:
    *   Go to your repository **Settings**.
    *   Navigate to the **Pages** section (under Code and automation).
    *   Under **Build and deployment**, select **Deploy from a branch**.
    *   Select your `main` (or `master`) branch and the `/ (root)` folder.
    *   Click **Save**.
3.  **Visit your site**: GitHub will provide a URL (usually `https://yourusername.github.io/Wing-Man-/`).

### 🔄 How to Update Your App
When you download new code from AI Studio, follow these steps to update your live site:

1.  **Replace Files**: Copy the new files you downloaded into your local folder (overwrite the old ones).
2.  **Open Terminal**: Open your terminal (Command Prompt/PowerShell) and navigate to your project folder.
3.  **Run these 3 commands**:
    ```bash
    git add .
    git commit -m "Update app features"
    git push origin main
    ```
4.  **Wait**: GitHub will automatically rebuild your site in about 1-2 minutes.

## 🛠️ How It Works

Wing Man is a pure front-end application built with React and TypeScript.

*   **AI Power**: All AI features are powered by the [Google Gemini API](https://ai.google.dev/).
*   **Local Storage**: All your data (profiles, dates) is stored securely in your browser's `localStorage`. No data is ever sent to a server owned by us.
*   **Offline First**: Thanks to the service worker, the app shell can be loaded even when you're offline.

## 🔒 Privacy

Your privacy is paramount. All data is stored locally on your device. Only the necessary, anonymized data is sent to the Google Gemini API for processing when you use an AI feature. For more details, please read our full [Privacy Policy](./privacy-policy.html).

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features or improvements, feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
