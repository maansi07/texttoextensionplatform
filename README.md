# Extensio.ai — No-Code Extension Factory

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![Gemini](https://img.shields.io/badge/AI-Gemini%202.0-orange)
![License](https://img.shields.io/badge/License-MIT-purple)

> Generate production-ready browser extensions from plain English
> descriptions using Gemini AI. Download as .zip and install instantly.

**Built for Zaalima Development — Q4 AI Engineering Roadmap.**

---

## Project Overview

Extensio.ai is an AI-powered no-code browser extension factory.
The user types a description, selects a browser, and the platform
uses Gemini 2.0 Flash to generate all required extension files —
manifest, content scripts, popup UI, and background worker —
then packages them into a downloadable .zip file.

---

## Tech Stack

|    Layer       |    Technology         |       Purpose             |
|----------------|-----------------------|---------------------------|
| Frontend       | React 18 + Vite       | Component UI&dev server   |
| Styling        | CSS3 custom properties| Theming and layout        |
| Backend        | Node.js + Express     | REST API server           |
| AI             | Gemini 2.0 Flash      | Extension code generation |
| Packaging      | Archiver npm          | .zip file creation        |
| Version Control| Git + GitHub          | Source control            |

---

## API Endpoints

Base URL: `http://localhost:8080/api`

| Method |          Endpoint          |               Description      |
|--------|----------------------------|--------------------------------|
| POST   | `/extensions/generate`     | Generate extension from prompt |
| GET    | `/extensions`              | Get all generated extensions   |
| GET    | `/extensions/:id`          | Get one extension by ID        |
| GET    | `/extensions/:id/download` | Download extension as .zip     |
| DELETE | `/extensions/:id`          | Delete an extension            |
| GET    | `/health`                  | Server health check            |

---

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
│   │   ├── Footer.jsx
│   │   └── ErrorBoundary.jsx
│   └── pages/
│       └── TemplatesPage.jsx
└── backend-node/
├── server.js
├── routes/extensions.js
├── controllers/extensionController.js
└── services/
├── aiService.js
└── zipService.js

---

## Environment Setup

1. Clone the repository
```bash
   git clone https://github.com/maansi07/texttoextensionplatform.git
   cd texttoextensionplatform
```

2. Install frontend dependencies
```bash
   npm install
```

3. Install backend dependencies
```bash
   cd backend-node
   npm install
```

4. Set up environment variables
```bash
   cp backend-node/.env.example backend-node/.env
   # Add your Gemini API key to backend-node/.env
```

5. Run the project
```bash
   # Terminal 1 - Backend
   cd backend-node
   npm run dev

   # Terminal 2 - Frontend
   npm run dev
```

---

## Deployment

### Frontend — Vercel
1. Push code to GitHub
2. Go to vercel.com and import the repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy

### Backend — Railway
1. Go to railway.app
2. Create new project from GitHub repo
3. Set root directory to `backend-node`
4. Add environment variable: `GEMINI_API_KEY`
5. Deploy

---

## Contributing

This project follows a feature branch workflow.

- All changes are made on `feat/extensio-ai-rebuild` branch
- One commit per person per day minimum
- Always pull before starting work
- Use descriptive commit messages

### Commit Message Format

type(scope): description

Types: feat, fix, docs, style, chore
Examples:
feat(ui): add login page component
fix(backend): handle empty prompt error
docs: update README with API reference

---

## License

MIT License — free to use, modify and distribute.

---

## Acknowledgements

- Google Gemini AI for extension code generation
- Zaalima Development for project scope and direction
- Archiver npm package for zip file creation

---

## Team

|    Name   |                Role                 |                     GitHub                |
|-----------|-------------------------------------|-------------------------------------------|
| Maansi    | Lead  — Backend + Frontend          | [@maansi07](https://github.com/maansi07)  |
| Vaibhavi  | UI Developer — Components + Styling | collaborator                              |
| Priyanshu | Documentation + Configuration       | collaborator                              |
| Uday      | QA + Fixes + Cleanup                | collaborator                              |

---

## FAQ

**Is Extensio.ai free to use?**
Yes, the platform is free during development. AI generation
uses the Gemini free tier.

**Which browsers are supported?**
Chrome (MV3), Firefox (MV2), and Microsoft Edge (MV3).

**Can I install the generated extension directly?**
Yes. Download the .zip, extract it, and load it in Chrome
via chrome://extensions → Developer Mode → Load Unpacked.

**Do I need coding knowledge?**
No. Just describe what you want in plain English.

---

## Performance Notes

- AI generation typically takes 3-8 seconds depending
  on prompt complexity and Gemini API response time
- Generated .zip files are automatically cleaned up
  after download to save server storage
- The in-memory store resets on server restart —
  a database integration is planned for v2.0

---

## Weekly Progress Log

|  Week  |               Focus                      |     Status      |
|--------|------------------------------------------|-----------------|
| Week 1 | Backend setup, AI service, zip service   | ✅ Complete    |
| Week 2 | Routes, controller, frontend connection  | ✅ Complete    |
| Week 3 | Dashboard, search, filter, UI polish     | ✅ Complete    |
| Week 4 | Error handling, final polish, deployment | 🔄 In Progress |

---

## Known Issues

- Generated extensions are stored in memory only —
  they will be lost if the backend server restarts
- Very complex prompts may occasionally produce
  invalid JSON — the retry logic handles most cases
- Firefox MV2 support is functional but not fully
  tested across all extension types

---

## API Rate Limiting

The Gemini free tier allows approximately 60 requests
per minute. For production use, implement rate limiting
on the `/api/extensions/generate` endpoint using the
`express-rate-limit` package.

```bash
npm install express-rate-limit
```