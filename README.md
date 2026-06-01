## Contributing
This project follows a feature branch workflow.
- All changes are made on `feat/extensio-ai-rebuild` branch
- One commit per person per day minimum
- Always pull before starting work
- Use descriptive commit messages

### Commit Message Format

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