# Frontend Documentation

> MockTest Pro ka frontend **Next.js 16** (App Router) ke saath **React 19** aur **Tailwind CSS 4** use karta hai.

---

## Tech Stack

| Technology      | Version | Purpose                     |
|-----------------|---------|------------------------------|
| Next.js         | 16.1.6  | React framework (App Router) |
| React           | 19.2.3  | UI component library         |
| Tailwind CSS    | 4.x     | Utility-first styling        |
| Inter Font      | —       | Google Fonts typography      |

---

## Pages Overview

### 1. Landing Page (`/`)
**File**: `src/app/page.js`

Full marketing landing page with 5 sections:
- **Navigation** — Sticky navbar with logo, nav links, Student Login & Admin buttons
- **Hero** — Headline, CTA buttons, trusted badges, stats bar (50+ Tests, 5K+ Questions, etc.)
- **Features** — 6 feature cards (Timed Tests, Instant Results, Leaderboard, etc.)
- **Pricing** — 3 pricing plans (Free ₹0, Pro ₹499/month, Unlimited ₹1,999/year)
- **About** — "Why MockTest Pro?" section
- **Footer** — Logo, copyright, links

### 2. Admin Login (`/admin/login`)
**File**: `src/app/admin/login/page.js`

Split-screen layout:
- **Left Panel (2/3 width)** — Branding, animated headline, 4 feature cards, security badges
- **Right Panel (1/3 width)** — Login form with email + password fields, password toggle
- **Features**: Form validation, API error display, loading state, redirect to dashboard on success

### 3. Admin Dashboard (`/admin/dashboard`)
**File**: `src/app/admin/dashboard/page.js`

Protected page (redirects to login if not admin):
- **Header** — Logo, admin badge, user name, logout button
- **Quick Actions Grid** — 4 cards: Questions, Tests, Learning Materials, Packages
- **Placeholder** — "Full Admin Panel Coming Soon" message
- **Auth Check**: Uses `getAuth()` to verify admin role on mount

### 4. Student Login/Register (`/student/login`)
**File**: `src/app/student/login/page.js`

Centered card layout with toggle between Login/Register:
- **Login mode**: Email + Password fields
- **Register mode**: Name, Email, Phone (optional), Password fields
- **Status**: UI ready but backend auth not yet connected (shows preview message)

---

## Components

### `Button` (`src/components/ui/Button.js`)

Reusable button component with multiple variants and sizes.

**Props:**

| Prop      | Type    | Default    | Options                                    |
|-----------|---------|------------|---------------------------------------------|
| variant   | string  | "primary"  | `primary`, `secondary`, `outline`, `ghost`, `accent` |
| size      | string  | "md"       | `sm`, `md`, `lg`                            |
| loading   | boolean | false      | Shows spinner when true                     |
| disabled  | boolean | false      | Disables button                             |
| className | string  | ""         | Additional CSS classes                       |

**Variant Styles:**
- `primary` → Teal bg, white text
- `secondary` → Dark blue bg, white text
- `outline` → Teal border, teal text, fills on hover
- `ghost` → Transparent, gray text, light bg on hover
- `accent` → Amber bg, dark text

---

### `FloatingInput` (`src/components/ui/FloatingInput.js`)

Material Design-style input with floating label.

**Props:**

| Prop     | Type     | Default | Description                  |
|----------|----------|---------|------------------------------|
| id       | string   | —       | Input id (required for label)|
| label    | string   | —       | Label text                   |
| type     | string   | "text"  | Input type                   |
| value    | string   | —       | Controlled value             |
| onChange | function | —       | Change handler               |
| error    | string   | —       | Error message text           |
| required | boolean  | false   | Shows red * on label         |

**How it works:**
- CSS mein `floating-input` aur `floating-label` classes defined hain
- Jab input focused ya filled hota hai, label upar float karta hai
- Error state pe border red ho jata hai

---

### `Skeleton` (`src/components/ui/Skeleton.js`)

Loading placeholder component.

**Props:**

| Prop      | Type   | Default | Options                                          |
|-----------|--------|---------|--------------------------------------------------|
| variant   | string | "text"  | `text`, `title`, `avatar`, `card`, `button`, `thumbnail` |
| className | string | ""      | Additional CSS classes                            |

**Also exports**: `SkeletonCard` — Pre-composed skeleton card with title, text lines, and button skeleton

---

## API Helper (`src/lib/api.js`)

### Functions

#### `apiFetch(endpoint, options)`
Fetch wrapper with automatic JWT injection.
- Base URL: `NEXT_PUBLIC_API_URL` env variable (default: `http://localhost:8000`)
- Automatically adds `Content-Type: application/json`
- Reads JWT token from `localStorage` and adds `Authorization: Bearer <token>`
- Throws error with server's `detail` message on non-OK responses

#### `saveAuth(data)`
Login response data ko localStorage mein save karta hai:
- `token` → `data.access_token`
- `role` → `data.role`
- `userName` → `data.name`

#### `clearAuth()`
Logout ke liye auth data localStorage se remove karta hai.

#### `getAuth()`
Current auth state return karta hai ya `null` agar not logged in:
```js
{ token: "...", role: "admin", name: "Super Admin" }
```

---

## Design System

### Color Palette (defined in `globals.css`)

| CSS Variable          | Hex       | Usage                    |
|----------------------|-----------|--------------------------|
| `--color-primary`    | `#0F766E` | Main brand (teal)        |
| `--color-primary-dark`| `#0D5D56`| Hover states             |
| `--color-primary-light`| `#14B8A6`| Accent highlights       |
| `--color-secondary`  | `#1E3A5F` | Dark blue (headings)     |
| `--color-secondary-dark`| `#152B47`| Darker variant          |
| `--color-accent`     | `#F59E0B` | Amber (badges, warnings) |
| `--color-accent-light`| `#FCD34D`| Lighter amber            |
| `--color-surface`    | `#FFFFFF` | Card/component bg        |
| `--color-background` | `#F8FAFC` | Page background          |
| `--color-text-primary`| `#1E293B`| Main text color          |
| `--color-text-secondary`| `#64748B`| Muted text             |
| `--color-border`     | `#E2E8F0` | Borders                  |
| `--color-error`      | `#DC2626` | Error states             |
| `--color-success`    | `#16A34A` | Success states           |
| `--color-warning`    | `#F59E0B` | Warning states           |

### Animations

| Class            | Effect                    |
|------------------|---------------------------|
| `animate-fade-in`| Fade in + slide up (8px)  |
| `stagger-1` to `stagger-4` | Animation delay (0.1s - 0.4s) |
| `skeleton`       | Shimmer loading pulse     |

### Typography
- **Font**: Inter (Google Fonts)
- **CSS Variable**: `--font-sans`
- Loaded via `next/font/google` with `swap` display

---

## Folder Structure

```
frontend/src/
├── app/
│   ├── layout.js           # Root layout — Inter font, global metadata
│   ├── globals.css          # Theme colors, floating inputs, skeleton, animations
│   ├── page.js              # Landing page (/)
│   ├── admin/
│   │   ├── login/page.js    # Admin login (/admin/login)
│   │   └── dashboard/page.js # Admin dashboard (/admin/dashboard)
│   └── student/
│       └── login/page.js    # Student login (/student/login)
├── components/
│   └── ui/
│       ├── Button.js        # Button component (5 variants, 3 sizes)
│       ├── FloatingInput.js  # Floating label input
│       └── Skeleton.js       # Loading skeleton + SkeletonCard
└── lib/
    └── api.js               # API fetch wrapper + auth helpers
```

---

## SEO & Metadata

Root `layout.js` mein defined:

```js
{
  title: "MockTest Pro — Online Mock Test Platform",
  description: "Prepare for your exams with timed MCQ mock tests...",
  keywords: "mock test, online exam, MCQ, practice test, exam preparation"
}
```
