<h1 align="center">cflix-vite</h1>

<p align="center">A modern, Vite + React frontend for a streaming/movie platform (CFLIX). Built with React 18, SCSS modules, Vite, and integrates with Cloudinary, Google OAuth and a separate backend API.</p>

<!-- Badges -->
<p align="center">
  <img alt="Vite" src="https://img.shields.io/badge/vite-v7.2.4-646cff?logo=vite&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/react-18.3.1-61DAFB?logo=react&logoColor=white" />
  <img alt="Sass" src="https://img.shields.io/badge/sass-1.93.3-CC6699?logo=sass&logoColor=white" />
  <img alt="Axios" src="https://img.shields.io/badge/axios-1.13.2-5A29E4?logo=axios&logoColor=white" />
  <img alt="Socket.io" src="https://img.shields.io/badge/socket.io-4.8.3-010101?logo=socket.io&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/license-Unlicensed-lightgrey" />
</p>

---

## 🚀 Introduction

A responsive, production-ready frontend for a streaming/movie site (CFLIX). This repository contains the Vite + React SPA, modular SCSS styles, client-side services that integrate with a public API and an optional authentication backend. The UI includes player integration, playlists/favorites, comments, reporting, notifications, and admin tooling.

---

## 🛠 Tech Stack

- **Framework:** `React` 18 (JSX + hooks)
- **Bundler:** `Vite` 7.x
- **Styling:** SCSS modules (`sass-embedded`)
- **HTTP / API:** `axios` (two axios instances: `httpRequest` -> public API, `backendRequest` -> authenticated backend)
- **Auth:** Google OAuth (`@react-oauth/google`)
- **State & Forms:** `react-hook-form`, `yup`
- **Realtime:** `socket.io-client`
- **Testing libs:** `@testing-library/react`, `jest-dom`
- **Other libs:** `recharts`, `swiper`, `plyr`, `hls.js`, `react-toastify`
- **Linting:** `ESLint` with `@eslint/js` and React plugins

(Detected versions come from `package.json`.)

---

## 📂 Project Structure

Below are the main folders and files with purpose and typical contents.

- `index.html` — SPA root HTML used by Vite.
- `package.json` — scripts & dependencies (dev: `vite`, build: `vite build`, preview: `vite preview`).
- `src/`
    - `App.jsx` — root application component and route mount.
    - `index.jsx` — app entry; Google OAuth provider is initialized using `VITE_GOOGLE_CLIENT_ID`.
    - `components/` — reusable UI components (Button, Player, Dropdown, Popper, etc.).
    - `config/` — app config and routes.
    - `features/` — feature-level contexts (auth, report modal).
    - `hooks/` — custom hooks (e.g., `useDebounce`).
    - `layout/` — layout components (DefaultLayout, Header, Footer).
    - `pages/` — top-level pages (Home, MovieInfo, UserPage, Admin, Watch, etc.).
    - `routes/` — route helper(s).
    - `services/` — client-side API wrappers (authServices, userServices, moviesServices, commentServices, reportService, chatbotService, etc.).
    - `utils/`
        - `httpRequest.js` — axios instance for public API (`https://phimapi.com/`).
        - `backendRequest.js` — axios instance for internal backend (default `http://localhost:5001/v1/`).
        - `socket.js` — socket initialization helper.
        - `backendRequest` also handles 401 token flows.
    - `styles/` or component-level `.module.scss` — modular styles for components.
    - `public/assets/images` — static assets.

Notes:

- The project is a frontend application that consumes both a public API (`https://phimapi.com/`) and an authenticated backend (`http://localhost:5001/v1/`). See `src/utils/httpRequest.js` and `src/utils/backendRequest.js`.

---

## ⚙️ Installation Guide

1. Clone the repo

```bash
git clone <repo-url>
cd cflix-vite
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Run development server

```bash
npm run dev
# open http://localhost:5173 (or Vite's reported host)
```

4. Build for production

```bash
npm run build
```

5. Preview production build locally

```bash
npm run preview
```

---

## 🔑 Environment Variables

Place environment variables in a `.env` file at project root (Vite requires keys prefixed with `VITE_`). The repository uses `import.meta.env` for access.

| Variable                |                             Required | Description                                                                         | Example                                        |
| ----------------------- | -----------------------------------: | ----------------------------------------------------------------------------------- | ---------------------------------------------- |
| `VITE_GOOGLE_CLIENT_ID` |                                  Yes | Google OAuth client ID used by `@react-oauth/google`                                | `1234567890-abcdef.apps.googleusercontent.com` |
| `VITE_CLOUD_NAME`       |              Yes (for avatar upload) | Cloudinary cloud name used when uploading avatars                                   | `my-cloud`                                     |
| `VITE_UPLOAD_PRESET`    | Yes (for Cloudinary unsigned upload) | Cloudinary upload preset name                                                       | `unsigned_preset`                              |
| `VITE_BACKEND_URL`      |                           Optional\* | Recommended: base URL for your backend (overrides hardcoded `backendRequest` value) | `http://localhost:5001/v1/`                    |

\*Note: The code currently uses a default `baseURL` in `src/utils/backendRequest.js` (set to `http://localhost:5001/v1/`). For production, update `backendRequest.js` to read `import.meta.env.VITE_BACKEND_URL` or set up a small change to allow overriding.

---

## 🔌 API Endpoints (Backend)

This project expects an authenticated backend (axios instance `backendRequest` base: `http://localhost:5001/v1/` by default). The frontend also uses a public API (`https://phimapi.com/`) for movie data.

Key backend endpoints used by `src/services/*`:

| Method | Path (relative to backend base) | Service (frontend)                       | Purpose                                   |
| -----: | ------------------------------- | ---------------------------------------- | ----------------------------------------- |
|   POST | `auth/login`                    | `authServices.loginAPI`                  | Login with credentials                    |
|   POST | `auth/login-google`             | `authServices.loginGoogleAPI`            | Google OAuth login                        |
|   POST | `auth/logout`                   | `authServices.logoutAPI`                 | Logout                                    |
|   POST | `auth/register`                 | `authServices.registerAPI`               | Register new user                         |
|   POST | `auth/forgot-password`          | `authServices.forgotPasswordAPI`         | Request password reset                    |
|    PUT | `auth/change-password`          | `authServices.changePasswordAPI`         | Change password                           |
|    GET | `user/me`                       | `userServices.getMeAPI`                  | Get current user                          |
|    PUT | `user/update`                   | `userServices.updateProfileAPI`          | Update profile (avatar, username, gender) |
|   POST | `user/favorite`                 | `userServices.toggleFavoriteAPI`         | Toggle favorite movie                     |
|   POST | `user/playlist`                 | `userServices.togglePlaylistAPI`         | Toggle playlist                           |
|   POST | `user/continue-watching`        | `userServices.saveProgressAPI`           | Save watching progress                    |
| DELETE | `user/continue-watching`        | `userServices.removeContinueWatchingAPI` | Remove continue watching                  |
|   POST | `comment/add`                   | `commentServices.addCommentAPI`          | Add comment to a movie                    |
|    GET | `comment/{slug}`                | `commentServices.getCommentBySlugAPI`    | Get comments for movie                    |
|    PUT | `comment/vote/{id}`             | `commentServices.toggleVoteCommentAPI`   | Up/Down vote comment                      |
|   POST | `rating/like`                   | `ratingService.toggleLikeAPI`            | Like movie                                |
|   POST | `rating/dislike`                | `ratingService.toggleDislikeAPI`         | Dislike movie                             |
|    GET | `rating/{slug}`                 | `ratingService.getRatingAPI`             | Get rating for a movie                    |
|   POST | `report`                        | `reportService.createReportAPI`          | Create a user report                      |
|    GET | `report`                        | `reportService.getReportsAPI`            | List reports                              |
|    PUT | `report/{id}/status`            | `reportService.updateStatusAPI`          | Update report status                      |
|   POST | `chatbot`                       | `chatbotService.chatWithAI_API`          | Chatbot AI interaction                    |
|   POST | `trending/views`                | `viewsService.increaseViewAPI`           | Increase view count                       |
|    GET | `trending/views`                | `viewsService.getTopViewedAPI`           | Get top viewed                            |

Note: The project also consumes endpoints on the public API base `https://phimapi.com/` via `src/utils/httpRequest.js`. Examples include `v1/api/danh-sach/*`, `phim/{slug}`, `v1/api/tim-kiem`, and more — see `src/services/moviesServices.js` and `src/services/searchService.js`.

---

## 🔎 Example API Request / Response

1. Login (example)

```bash
curl -X POST 'http://localhost:5001/v1/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"s3cureP@ss"}'
```

Response (200):

```json
{
    "token": "eyJhbGciOi...",
    "user": {
        "id": "user-id-123",
        "username": "john_doe",
        "email": "user@example.com",
        "role": "user",
        "avatar_url": "https://..."
    }
}
```

2. Update Profile (example)

```bash
curl -X PUT 'http://localhost:5001/v1/user/update' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{"username":"newname","gender":"male","avatar_url":"https://..."}'
```

Response (200):

```json
{
    "success": true,
    "user": {
        /* updated user object */
    }
}
```

---

## 📸 Screenshots

(Placeholders — replace with real screenshots)

- Screenshot: Desktop Home view
- Screenshot: Movie player page
- Screenshot: Profile / Admin dashboard

Add images to `public/assets/images` and reference them here:

```md
![Home](/public/assets/images/screenshot-home.png)
```

---

## 🚀 Deployment

Production build:

```bash
npm run build
# Deploy contents of `dist/` to any static host (Vercel, Netlify, Surge, S3+CloudFront)
```

Recommended providers:

- Vercel: connect the repo, set `Build Command: npm run build` and `Output Directory: dist`.
- Netlify: same build command and publish directory.
- GitHub Pages: use a static host or a small GitHub Action to push `dist/` to `gh-pages`.

Optional: if you want Docker for the static build, create a simple `Dockerfile` (example):

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

(There is no Dockerfile in this repo — add the above to containerize the static site.)

---

## 🤝 Contributing

- Fork the repo and create a topic branch.
- Keep commits small, documented, and use meaningful messages.
- Open a PR and include screenshots or gifs for visual changes.
- Run `npm run lint` and ensure no obvious console warnings.
- For breaking changes, open an issue first to discuss.

---

## 📜 License

No `LICENSE` file detected in this repository. If you plan to publish this as open-source, add a license file (e.g., MIT) in the project root:

```text
MIT License
...
```

---

## 👨‍💻 Author

- Project: `cflix-vite`
- Maintainer: Add your name and contact / GitHub profile here.

---

Thank you for using this project — if you'd like, I can:

- Add a `LICENSE` file,
- Create a `.env.example` with the `VITE_` keys,
- Add a simple Dockerfile to the repo,
- Or generate badges linked to the actual GitHub repo (if you provide the repo URL).
