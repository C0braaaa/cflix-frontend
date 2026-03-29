<div align="center">
  <img src="public/assets/images/logo.png" alt="CFLIX Logo" width="200" />
  <h1>CFLIX Frontend</h1>

  <p>
    A modern, high-performance web application for streaming movies and TV shows.
  </p>

  <div>
    <img src="https://img.shields.io/badge/vite-v7.2.4-646cff?logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/react-18.3.1-61DAFB?logo=react&logoColor=white" alt="React" />
    <img src="https://img.shields.io/badge/sass-1.93.3-CC6699?logo=sass&logoColor=white" alt="Sass" />
    <img src="https://img.shields.io/badge/socket.io-4.8.3-010101?logo=socket.io&logoColor=white" alt="Socket.io" />
  </div>
</div>

---

## 📖 Introduction

**CFLIX** is a responsive, feature-rich movie streaming platform. This repository contains the frontend application built as a Single Page Application (SPA) using **React 18** and **Vite**.

It provides an intuitive user interface for browsing movies, watching content via built-in video players, managing playlists and favorites, and interacting with other users through real-time comments and notifications.

## ✨ Key Features

- **🎬 Video Streaming**: Seamless playback using `plyr` and `artplayer` with `hls.js` support.
- **🔐 Authentication**: JWT-based authentication and Google OAuth integration.
- **💬 Real-time Interaction**: Live comments and notifications powered by `socket.io`.
- **📱 Responsive Design**: Fully responsive UI built with modular SCSS, optimized for desktop, tablet, and mobile.
- **⭐ User Features**: Favorites, watch history, playlists, and user profile management.
- **🛠️ Admin Dashboard**: Dedicated interfaces for content management and user reporting.
- **🤖 AI Chatbot**: Integrated AI assistant for movie recommendations and support.

## 🛠️ Tech Stack

- **Core**: React 18, Vite 7
- **Styling**: SCSS Modules (`sass-embedded`), Classnames
- **Routing**: React Router v7
- **Networking**: Axios (`httpRequest` for public API, `backendRequest` for internal API)
- **Real-time**: Socket.io Client
- **Forms & Validation**: React Hook Form, Yup
- **Players**: Plyr, Artplayer, HLS.js
- **Other Utilities**: Swiper (Carousels), Recharts (Charts), React-Toastify (Alerts), Tippy.js (Tooltips)

## 📂 Project Structure

```text
src/
├── components/      # Reusable UI components (Buttons, Modals, Cards)
├── config/          # Application configuration and constants
├── features/        # Feature-specific contexts (AuthContext, ReportModal)
├── hooks/           # Custom React hooks (e.g., useDebounce)
├── layout/          # Layout wrappers (Header, Footer, Sidebar)
├── pages/           # Page-level components (Home, Movie, Profile, Admin)
├── routes/          # Routing definitions and guards
├── services/        # API integration layers
├── utils/           # Helper functions, Axios instances, Socket setup
├── App.jsx          # Root component and route provider
└── index.jsx        # Application entry point
```

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **yarn** or **pnpm**

### 1. Clone the repository

```bash
git clone https://github.com/your-username/cflix-vite.git
cd cflix-vite
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
# API Configuration
VITE_BACKEND_URL=http://localhost:5001/v1/

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Cloudinary (For image uploads)
VITE_CLOUD_NAME=your_cloudinary_cloud_name
VITE_UPLOAD_PRESET=your_cloudinary_upload_preset
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

---

## 📦 Available Scripts

In the project directory, you can run:

- `npm run dev` - Runs the app in development mode.
- `npm run build` - Builds the app for production to the `dist` folder.
- `npm run preview` - Locally preview the production build.
- `npm run lint` - Runs ESLint to check for code quality and formatting issues.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the issues page if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Hieu C0bra Dev**

- GitHub: [@C0braaaa](https://github.com/C0braaaa)
