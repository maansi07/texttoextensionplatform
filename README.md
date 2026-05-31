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