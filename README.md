<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/SCSS-Modules-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="SCSS" />
  <img src="https://img.shields.io/badge/Socket.IO-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

# 🎬 CFlix Frontend — Nền tảng Xem Phim Trực Tuyến

> Giao diện người dùng cho nền tảng xem phim **CFlix** — xây dựng bằng React 18 + Vite, thiết kế responsive, hỗ trợ video player chuyên nghiệp và real-time features.

---

## 📑 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
- [Biến môi trường](#-biến-môi-trường)
- [Routing](#-routing)
- [Scripts](#-scripts)
- [Deployment](#-deployment)

---

## 🌟 Tổng quan

CFlix Frontend là Single Page Application (SPA) cung cấp trải nghiệm xem phim mượt mà với:

- 🎥 Video player chuyên nghiệp (Artplayer + HLS.js)
- 🤖 AI Chatbot gợi ý phim thông minh
- 💬 Bình luận & đánh giá real-time
- 🔍 Tìm kiếm phim với debounce
- 📱 Responsive trên mọi thiết bị
- 🔐 Xác thực Google OAuth 2.0
- 🛡️ Phân quyền admin dashboard

---

## ✨ Tính năng chính

| Tính năng | Mô tả |
|---|---|
| **Trang chủ** | Slider banner, phim mới, phim đề xuất (recommendation engine) |
| **Xem phim** | Artplayer + HLS streaming, chuyển tập prev/next |
| **Tìm kiếm** | Search với debounce, kết quả real-time |
| **Phân loại** | Phim lẻ, phim bộ, hoạt hình, thuyết minh, lồng tiếng |
| **Thể loại & Quốc gia** | Lọc phim theo thể loại và quốc gia |
| **Chủ đề** | Bộ sưu tập phim theo chủ đề |
| **Chi tiết phim** | Thông tin, trailer, đánh giá, bình luận |
| **Đánh giá** | Rating 1–10 sao |
| **Bình luận** | Comment real-time qua Socket.IO |
| **Đề xuất phim** | Hệ thống recommendation đa tín hiệu |
| **Tài khoản** | Đăng ký, đăng nhập, Google OAuth, quên mật khẩu |
| **Hồ sơ** | Avatar, yêu thích, lịch sử xem |
| **Thông báo** | Notification real-time |
| **AI Chatbot** | Gợi ý phim bằng AI |
| **Báo cáo** | Báo cáo phim lỗi/vi phạm |
| **Admin Dashboard** | Quản lý slider, user, report, traffic (Recharts) |
| **Splash Screen** | Màn hình chào animated |
| **Disclaimer Modal** | Xác thực access key trước khi vào trang |

---

## 🛠 Công nghệ sử dụng

| Công nghệ | Mô tả |
|---|---|
| **React** 18.3 | UI Library (Hooks, Context) |
| **Vite** 7.x | Build tool + Dev server |
| **React Router** 7.x | Client-side routing |
| **SCSS Modules** | Scoped styling (sass-embedded) |
| **Axios** | HTTP client |
| **Socket.IO Client** | Real-time WebSocket |
| **Artplayer** 5.x | Video player chuyên nghiệp |
| **HLS.js** | HTTP Live Streaming |
| **Swiper** 12.x | Touch slider/carousel |
| **React Hook Form** + **Yup** | Form management + validation |
| **React Toastify** | Toast notifications |
| **Recharts** | Biểu đồ cho Admin dashboard |
| **Tippy.js** | Tooltip |
| **Day.js** | Date formatting |
| **Font Awesome** 7.x | Icon library |
| **Google OAuth** | Đăng nhập Google |
| **classnames** | Conditional CSS classes |
| **normalize.css** | CSS reset |

---

## 📂 Cấu trúc thư mục

```
frontend/cflix-vite/
├── index.html                # HTML entry point
├── vite.config.js            # Vite config (port 5000)
├── vercel.json               # Vercel SPA rewrite rules
├── package.json
├── .env                      # Biến môi trường (không commit)
├── .prettierrc               # Prettier config
├── eslint.config.js          # ESLint config
├── public/                   # Static assets (images, icons)
└── src/
    ├── index.jsx             # React entry point
    ├── App.jsx               # Root component + routing
    ├── config/
    │   ├── index-config.js   # Export configs
    │   └── routes.js         # Định nghĩa route paths
    ├── routes/
    │   └── index-routes.js   # Map routes → components
    ├── layout/
    │   ├── DefaultLayout/    # Layout mặc định (Header + Footer)
    │   └── components/       # Layout sub-components
    ├── pages/
    │   ├── Home/             # Trang chủ
    │   ├── Watch/            # Trang xem phim
    │   ├── MovieInfo/        # Chi tiết phim
    │   ├── Find/             # Tìm kiếm
    │   ├── SingleMovie/      # Phim lẻ
    │   ├── SeriesMovie/      # Phim bộ
    │   ├── Cartoons/         # Hoạt hình
    │   ├── DubbedMovie/      # Phim thuyết minh
    │   ├── Voiceover/        # Phim lồng tiếng
    │   ├── Genres/           # Thể loại
    │   ├── Nations/          # Quốc gia
    │   ├── Topics/           # Chủ đề
    │   ├── FullLatestMovies/ # Xem thêm phim mới
    │   ├── UserPage/         # Trang cá nhân
    │   ├── Admin/            # Admin Dashboard
    │   ├── AboutCflix/       # Giới thiệu & Liên hệ
    │   └── ErorrPage/        # Trang 404
    ├── components/
    │   ├── Player/           # Artplayer video player
    │   ├── MovieItem/        # Card phim
    │   ├── MovieList/        # Danh sách phim
    │   ├── ChatBot/          # AI Chatbot component
    │   ├── DisclaimerModal/  # Modal xác thực truy cập
    │   ├── SplashScreen/     # Màn hình chào
    │   ├── ProtectedRoute/   # Route guard (admin)
    │   ├── ReportModal/      # Modal báo cáo
    │   ├── Button/           # Reusable button
    │   ├── Input/            # Reusable input
    │   ├── Dropdown/         # Dropdown menu
    │   ├── Popper/           # Popper/tooltip wrapper
    │   ├── CensoredText/     # Lọc từ ngữ
    │   └── GlobalStyles/     # Global CSS
    ├── features/
    │   ├── auth/             # Auth flow (Login, Register, Forgot)
    │   └── report/           # Report feature
    ├── services/             # API service layer (Axios)
    │   ├── authServices.js
    │   ├── moviesServices.js
    │   ├── commentServices.js
    │   ├── ratingService.js
    │   ├── userServices.js
    │   ├── sliderServices.js
    │   ├── chatbotService.js
    │   ├── searchService.js
    │   ├── notificationServices.js
    │   ├── viewsService.js
    │   ├── reportService.js
    │   ├── trafficService.js
    │   └── movieBlockService.js
    ├── hooks/
    │   ├── useDebounce.js         # Debounce custom hook
    │   └── useRecommendations.js  # Recommendation engine hook
    └── utils/                # Utility functions
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- Backend server đang chạy tại `http://localhost:5001`

### Cài đặt

```bash
# 1. Clone repository
git clone <repository-url>
cd cflix-v2/frontend/cflix-vite

# 2. Cài đặt dependencies
npm install

# 3. Tạo file .env (xem mục bên dưới)
cp .env.example .env

# 4. Chạy development server
npm run dev
```

App chạy tại: **http://localhost:5000**

---

## 🔐 Biến môi trường

Tạo file `.env` tại thư mục `frontend/cflix-vite/`:

```env
# ─── Backend API ────────────────────────
VITE_BACKEND_URL_ENDPOINT=http://localhost:5001/v1/
VITE_BACKEND_URL=http://localhost:5001/

# ─── Cloudinary (Upload ảnh) ────────────
VITE_CLOUD_NAME=<your-cloudinary-cloud-name>
VITE_UPLOAD_PRESET=<your-upload-preset>

# ─── Google OAuth ───────────────────────
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>

# ─── Access Key ─────────────────────────
VITE_ACCESS_KEY=<6-digit-access-key>
```

> ⚠️ Tất cả biến phải bắt đầu bằng `VITE_` để Vite expose ra client-side.

---

## 🗺 Routing

| Path | Trang | Mô tả |
|---|---|---|
| `/` | Home | Trang chủ |
| `/tim-kiem` | Find | Tìm kiếm phim |
| `/phim-le` | SingleMovie | Danh sách phim lẻ |
| `/phim-bo` | SeriesMovie | Danh sách phim bộ |
| `/hoat-hinh` | Cartoons | Danh sách hoạt hình |
| `/phim-thuyet-minh` | DubbedMovie | Phim thuyết minh |
| `/phim-long-tieng` | Voiceover | Phim lồng tiếng |
| `/the-loai/:slug` | Genres | Phim theo thể loại |
| `/quoc-gia/:slug` | Nations | Phim theo quốc gia |
| `/chu-de` | Topics | Danh sách chủ đề |
| `/chu-de/:slug` | TopicsDetail | Chi tiết chủ đề |
| `/phim/:slug` | MovieInfo | Thông tin phim |
| `/xem-phim/:slug/:episode` | Watch | Xem phim |
| `/f/:slug` | FullLatestMovies | Xem thêm |
| `/user/:slug` | UserPage | Trang cá nhân |
| `/dashboard` | Admin | Admin Dashboard 🔒 |
| `/quen-mat-khau` | ForgotPass | Quên mật khẩu |
| `/gioi-thieu` | Introduce | Giới thiệu CFlix |
| `/lien-he` | Contact | Liên hệ |
| `*` | NotFound404 | Trang 404 |

> 🔒 Route `/dashboard` yêu cầu role `admin`.

---

## 📜 Scripts

| Script | Mô tả |
|---|---|
| `npm run dev` | Dev server (Vite, port 5000, `--host`) |
| `npm run build` | Build production (→ `dist/`) |
| `npm run preview` | Preview production build |
| `npm run lint` | Kiểm tra ESLint |

---

## 🚢 Deployment

### Vercel (Recommended)

Project đã cấu hình `vercel.json` cho SPA routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Các bước deploy:**

1. Push code lên GitHub
2. Import project trên [Vercel Dashboard](https://vercel.com)
3. Set root directory: `frontend/cflix-vite`
4. Cấu hình Environment Variables trên Vercel
5. Deploy 🚀

### Build thủ công

```bash
npm run build    # Output: dist/
npm run preview  # Preview local
```

---

<p align="center">
  <sub>Built with ❤️ by C0bra — CFlix Frontend v2.0</sub>
</p>
