<div align="center">
  <img src="public/assets/images/logo_mau_den.png" alt="CFLIX Logo" width="220" />
  <h1>🌟 CFLIX Web Application</h1>

  <p align="center">
    <strong>A next-generation, cinematic streaming interface built for speed, immersion, and real-time interaction.</strong>
  </p>

  <p align="center">
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Sass-1.93-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="Sass" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Socket.io_Client-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" /></a>
  </p>
</div>

<br />

## 📖 Overview

The **CFLIX Frontend** is a cutting-edge Single Page Application (SPA) engineered to deliver a flawless video-on-demand experience. Built on top of **React 18** and ultra-fast **Vite**, it boasts a highly responsive, cinematic UI that rivals industry leaders.

From hardware-accelerated video playback and real-time social features to an intelligent AI chatbot assistant, this frontend is meticulously crafted to ensure maximum user engagement, accessibility, and performance across all devices.

---

## ✨ Premium User Experience

*   **🎬 Cinematic Video Engineering:**
    *   Seamless Adaptive Bitrate Streaming via `hls.js`.
    *   Dual-player architecture utilizing `plyr` and `artplayer` for unmatched cross-browser compatibility and custom UI controls.
*   **⚡ Real-Time Ecosystem:**
    *   Live, synchronized comments section.
    *   Instant push notifications for system updates and social interactions, powered by a persistent `socket.io` connection.
*   **🎨 Pixel-Perfect UI/UX:**
    *   Modular, highly maintainable architecture using `SCSS Modules` and modern CSS variables.
    *   Fluid animations, skeleton loaders, and a fully responsive grid system optimized for Mobile, Tablet, and Desktop environments.
*   **🤖 Integrated AI Assistant:**
    *   Built-in smart chatbot designed to help users discover new content based on their mood, preferences, and viewing history.
*   **🛡️ Secure & State-Driven:**
    *   JWT-secured routes, Google OAuth integration, and robust state management via custom Context Providers and Hooks.

---

## 🛠️ Technology Arsenal

| Domain | Technologies Utilized |
| :--- | :--- |
| **Core Framework** | React 18, Vite 7 |
| **Routing Architecture**| React Router v7 |
| **Styling & Theming** | SCSS Modules (`sass-embedded`), Classnames |
| **API Client & Networking**| Axios (Configured instances with interceptors) |
| **Real-Time Data** | Socket.io Client |
| **Media Playback** | Plyr, Artplayer, HLS.js |
| **Form Management** | React Hook Form, Yup Validation |
| **UI Enhancements** | Swiper (Touch sliders), Recharts, React-Toastify, Tippy.js |

---

## 📂 Directory Architecture

Designed for scalability and developer ergonomics:

```text
cflix-vite/
├── public/              # Static assets (images, fonts, raw files)
├── src/
│   ├── components/      # Global atomic & molecular UI components (Cards, Modals)
│   ├── config/          # Application-wide constants and environment mappings
│   ├── features/        # Domain-driven contexts (Auth, Reporting, Modals)
│   ├── hooks/           # Custom React hooks (useDebounce, useClickOutside)
│   ├── layout/          # Structural wrappers (Sidebar, Header, Footer)
│   ├── pages/           # High-level route views (Home, Movie, Profile, Admin)
│   ├── routes/          # Centralized route definitions & Protected Guards
│   ├── services/        # Abstraction layer for Axios API requests
│   ├── utils/           # Formatting, date parsing, Socket initialization
│   ├── App.jsx          # Root component & Routing Provider
│   └── index.jsx        # React DOM injection point
├── vite.config.js       # Vite bundler configuration
└── package.json         # Dependencies and NPM scripts
```

---

## 🚀 Development Setup

Get the application running locally in under 2 minutes.

### 1. Prerequisites

*   **Node.js**: `v18.0.0` or higher
*   A running instance of the **CFLIX Backend API**.

### 2. Clone & Install

```bash
git clone https://github.com/C0braaaa/cflix-vite.git
cd cflix-vite
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root of the project and populate it with your specific keys:

```env
# API Gateway
VITE_BACKEND_URL=http://localhost:5001/v1/

# Authentication Configuration
VITE_GOOGLE_CLIENT_ID=your_google_cloud_oauth_client_id

# Cloud Storage (Media Uploads)
VITE_CLOUD_NAME=your_cloudinary_cloud_name
VITE_UPLOAD_PRESET=your_cloudinary_upload_preset
```

### 4. Ignite the Development Server

Start the Vite dev server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Navigate to `http://localhost:5000` (or the port specified in your console) to view the application.

---

## 📦 Build & Deployment

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Spins up the local development server with HMR. |
| `npm run build` | Compiles and minifies the application for production deployment into the `dist/` directory. |
| `npm run preview` | Serves the production build locally to test performance and routing before deployment. |
| `npm run lint` | Executes ESLint to maintain code quality and adherence to project standards. |

---

## 👨‍💻 Architect

Crafted with passion by **Hieu C0bra Dev**.

*   **GitHub:** [@C0braaaa](https://github.com/C0braaaa)
