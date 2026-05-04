# ExtGen — Text-to-Extension Developer Platform

A web-based developer platform that converts natural language descriptions into fully structured browser extensions. Built with React and Java Spring Boot.

---

## Overview

ExtGen removes the boilerplate from browser extension development. Describe what you want your extension to do, select a target browser, and the platform generates a ready-to-load package — manifest, content scripts, popup UI, and background service worker included.

The project is split into a React frontend and a Java REST API backend, designed to be run locally or deployed independently.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite |
| Styling | CSS3 (custom properties, no framework) |
| Backend | Java 17, Spring Boot 3 |
| API | REST (JSON) |
| Build | Maven |
| Version Control | Git, GitHub |

---

## Project Structure

```
texttoextension/
│
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
│
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   └── components/
│       ├── Header.jsx        # Navigation bar
│       ├── Header.css
│       ├── Hero.jsx          # Landing section
│       ├── Hero.css
│       ├── Generator.jsx     # Core extension builder UI
│       ├── Generator.css
│       ├── Features.jsx      # Platform feature overview
│       ├── Features.css
│       ├── Dashboard.jsx     # Generated extensions list
│       ├── Dashboard.css
│       ├── Footer.jsx
│       └── Footer.css
│
└── backend/
    ├── pom.xml
    └── src/main/
        ├── java/com/extgen/platform/
        │   ├── ExtGenApplication.java
        │   ├── controller/
        │   │   └── ExtensionController.java
        │   ├── service/
        │   │   └── ExtensionGeneratorService.java
        │   └── model/
        │       ├── GenerateRequest.java
        │       └── GenerateResponse.java
        └── resources/
            └── application.properties
```

---

## API Endpoints

Base URL: `http://localhost:8080/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/extensions/generate` | Generate extension from prompt |
| `GET` | `/extensions` | List all generated extensions |
| `GET` | `/extensions/{id}` | Get extension by ID |
| `DELETE` | `/extensions/{id}` | Delete an extension |

### Sample Request

```json
POST /api/extensions/generate
{
  "prompt": "dark mode toggle for any website",
  "browser": "Chrome",
  "category": "Accessibility"
}
```

### Sample Response

```json
{
  "id": "a3f9c12b-...",
  "name": "Dark Mode Toggle Extension",
  "browser": "Chrome",
  "category": "Accessibility",
  "status": "Draft",
  "files": {
    "manifest.json": "...",
    "content.js": "...",
    "popup.html": "...",
    "popup.js": "...",
    "background.js": "..."
  },
  "createdAt": "2024-01-15T10:30:00"
}
```

---

## Running Locally

**Frontend**
```bash
npm install
npm run dev
# → http://localhost:3000
```

**Backend**
```bash
cd backend
./mvnw spring-boot:run
# → http://localhost:8080
```

Both servers need to be running for full functionality. The Vite dev server proxies `/api` requests to port `8080`.

---

## Supported Browsers

- Google Chrome (Manifest V3)
- Mozilla Firefox (Manifest V2)
- Microsoft Edge (Manifest V3)

---

## Generated Extension Output

Every generation produces a complete, loadable extension package:

- `manifest.json` — permissions, metadata, script declarations
- `content.js` — injected page script
- `popup.html` — extension popup UI
- `popup.js` — popup interaction logic
- `background.js` — service worker / event handling

---

*Internship project — ExtGen.dev*