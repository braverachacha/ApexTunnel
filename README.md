<div align="center">
  <img src="assets/logo.svg" alt="ApexTunnel" width="380"/>
  <br/>
  <br/>

[![MIT](https://img.shields.io/badge/license-MIT-00D4FF?style=flat-square)](../LICENSE)
[![Beta](https://img.shields.io/badge/status-beta-00D4FF?style=flat-square)]()
[![SCSS](https://img.shields.io/badge/styles-SCSS-cc6699?style=flat-square&logo=sass&logoColor=white)]()

</div>

---

Frontend for [ApexTunnel](https://github.com/braverachacha/ExposureApp) — a self-hosted reverse tunnel. Vanilla JS, SCSS, no frameworks.

---

## Pages

| File | Description |
|---|---|
| `index.html` | Landing page |
| `auth.html` | Login & registration |
| `verify.html` | Email verification |
| `dashboard.html` | User dashboard |
| `admin.html` | Admin panel |

---

## Structure

```
frontend/
├── scripts/
│   ├── auth/
│   │   ├── auth.js          # Login & register logic
│   │   ├── verify.js        # Email verification logic
│   │   ├── dashboard.js     # Dashboard logic
│   │   └── guard.js         # Auth route protection
│   ├── config/
│   │   └── config.js        # API URL, cookie helpers
│   ├── utils/
│   │   ├── alert.js         # Alert display helper
│   │   └── sendData.js      # Fetch wrapper
│   └── index.js             # Shared UI (tabs, theme, animations)
└── styles/
    └── scss/
        ├── _variables.scss  # Colors, fonts, tokens
        ├── _base.scss       # Reset & globals
        ├── _auth.scss
        ├── _dashboard.scss
        ├── _verify.scss
        ├── _index.scss
        ├── _admin.scss
        ├── _responsive.scss
        └── main.scss        # Imports all partials
```

---

## Setup

```bash
cd ApexTunnel/frontend

# compile SCSS
sass styles/scss/main.scss styles/css/main.css --watch

# serve
npx serve .
# or just open index.html in a browser
```

Make sure the API is running at `http://localhost:3000` — see `scripts/config/config.js` to update the base URL.

---

## Auth Flow

```
Register → verification email → verify.html?token=xxx → login → dashboard
```

Token is stored in `~/.apextunnel` via the CLI:

```bash
node client.js authtoken <your_token>
node client.js --port 8000
```

---

## Built With

- Vanilla JS (ES modules)
- SCSS with `oklch` color tokens
- Font Awesome 6
- No build step required beyond SCSS compilation

---

<div align="center">
<sub>MIT · <a href="https://github.com/braverachacha">BraveraTech</a></sub>
</div>
