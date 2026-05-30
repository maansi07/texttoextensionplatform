# Extensio.ai — No-Code Extension Factory

A web-based AI platform that converts plain English descriptions
into fully packaged, ready-to-install browser extensions.

## Project Overview

Extensio.ai is built for developers and non-technical users who
want to create browser extensions without writing code. The user
types a description, selects a browser, and the platform uses
Gemini AI to generate all required extension files — manifest,
content scripts, popup UI, and background worker — then packages
them into a downloadable .zip file.

Built as part of the Zaalima Development Q4 AI Engineering roadmap.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite | Component UI and dev server |
| Styling | CSS3 custom properties | Theming and layout |
| Backend | Node.js + Express | REST API server |
| AI | Gemini 2.0 Flash | Extension code generation |
| Packaging | Archiver npm | .zip file creation |
| Version Control | Git + GitHub | Source control |

## API Endpoints

Base URL: `http://localhost:8080/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/extensions/generate` | Generate extension from prompt |
| GET | `/extensions` | Get all generated extensions |
| GET | `/extensions/:id` | Get one extension by ID |
| GET | `/extensions/:id/download` | Download extension as .zip |
| DELETE | `/extensions/:id` | Delete an extension |
| GET | `/health` | Server health check |

## Project Structure


texttoextensionplatform/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Generator.jsx
│   │   ├── Features.jsx
│   │   ├── Dashboard.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   └── TemplatesPage.jsx
│   └── context/
│       └── AuthContext.jsx
└── backend-node/
    ├── server.js
    ├── routes/extensions.js
    ├── controllers/extensionController.js
    └── services/
        ├── aiService.js
        └── zipService.js
