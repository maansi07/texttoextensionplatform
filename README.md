# 🚀 ExtGen.dev — Text-to-Extension Developer Platform
### Complete Setup Guide for Interns (VS Code + Git + GitHub)

---

## 📁 Project Structure

```
text-to-extension-platform/
├── index.html                        ← React entry HTML
├── package.json                      ← Node/React dependencies
├── vite.config.js                    ← Vite bundler config
├── .gitignore                        ← Files to exclude from Git
├── README.md                         ← This file
│
├── src/                              ← React frontend source
│   ├── main.jsx                      ← App entry point
│   ├── App.jsx                       ← Root component + routing
│   ├── App.css                       ← Global styles + CSS variables
│   └── components/
│       ├── Header.jsx / Header.css
│       ├── Hero.jsx / Hero.css
│       ├── Generator.jsx / Generator.css   ← Main AI builder UI
│       ├── Features.jsx / Features.css
│       ├── Dashboard.jsx / Dashboard.css
│       └── Footer.jsx / Footer.css
│
└── backend/                          ← Java Spring Boot API
    ├── pom.xml                       ← Maven dependencies
    └── src/main/java/com/extgen/platform/
        ├── ExtGenApplication.java    ← Spring Boot main
        ├── controller/
        │   └── ExtensionController.java   ← REST endpoints
        ├── service/
        │   └── ExtensionGeneratorService.java
        ├── model/
        │   ├── GenerateRequest.java
        │   └── GenerateResponse.java
        └── resources/
            └── application.properties
```

---

## ✅ STEP 1 — Install Required Software

### 1A. Install Node.js
1. Go to https://nodejs.org
2. Download and install the **LTS version** (e.g. 20.x)
3. Verify: open a terminal and type:
   ```
   node -v
   npm -v
   ```

### 1B. Install Java JDK 17
1. Go to https://adoptium.net
2. Download **Eclipse Temurin JDK 17**
3. Install it and verify:
   ```
   java -version
   ```

### 1C. Install VS Code
1. Download from https://code.visualstudio.com
2. Install these extensions inside VS Code:
   - **ES7+ React/Redux/React-Native snippets**
   - **Prettier - Code formatter**
   - **Extension Pack for Java** (by Microsoft)
   - **GitLens** (optional but very helpful)

### 1D. Install Git
1. Download from https://git-scm.com
2. Install with default settings
3. Verify:
   ```
   git --version
   ```

---

## ✅ STEP 2 — Create Your GitHub Account

1. Go to https://github.com
2. Click **Sign Up** → create account with your email
3. Verify your email address
4. Go to your profile → Settings → **SSH and GPG Keys** (optional but recommended)

---

## ✅ STEP 3 — Create a New GitHub Repository

1. On GitHub, click the **+** icon (top-right) → **New repository**
2. Fill in:
   - **Repository name:** `text-to-extension-platform`
   - **Description:** `AI-powered browser extension generator`
   - **Visibility:** Public
   - ✅ Check **Add a README file**
3. Click **Create repository**
4. Copy the repository URL (looks like):
   ```
   https://github.com/YOUR-USERNAME/text-to-extension-platform.git
   ```

---

## ✅ STEP 4 — Set Up Git on Your Computer

Open a terminal (VS Code Terminal: `Ctrl+\``) and run:

```bash
# Set your identity (use same email as GitHub)
git config --global user.name "Your Name"
git config --global user.email "you@email.com"

# Verify
git config --list
```

---

## ✅ STEP 5 — Clone the Repository and Add Project Files

```bash
# 1. Clone your GitHub repository to your computer
git clone https://github.com/YOUR-USERNAME/text-to-extension-platform.git

# 2. Enter the folder
cd text-to-extension-platform

# 3. Open in VS Code
code .
```

Now copy all the project files (from this ZIP) into that folder.

---

## ✅ STEP 6 — Run the React Frontend

Open VS Code Terminal (`Ctrl+\``) and run:

```bash
# Install all React dependencies
npm install

# Start the development server
npm run dev
```

You should see:
```
VITE v5.x.x  ready in 300ms
➜  Local:   http://localhost:3000/
```

Open your browser at **http://localhost:3000** 🎉

---

## ✅ STEP 7 — Run the Java Spring Boot Backend

Open a **second terminal** in VS Code:

```bash
# Navigate to backend folder
cd backend

# Build and run the Spring Boot server
./mvnw spring-boot:run
# (On Windows use: mvnw.cmd spring-boot:run)
```

You should see:
```
Started ExtGenApplication in 2.3 seconds
Tomcat started on port(s): 8080
```

The API is now live at **http://localhost:8080/api/extensions**

---

## ✅ STEP 8 — Test the API (Optional)

You can test the backend API using VS Code's REST Client or curl:

```bash
# Test: Generate an extension
curl -X POST http://localhost:8080/api/extensions/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"dark mode toggle","browser":"Chrome","category":"Productivity"}'

# Test: Get all extensions
curl http://localhost:8080/api/extensions
```

---

## ✅ STEP 9 — Push Your Code to GitHub

```bash
# 1. Go to your project root
cd text-to-extension-platform

# 2. Check what files have changed
git status

# 3. Stage ALL files for commit
git add .

# 4. Create your first commit with a message
git commit -m "feat: initial project setup — React frontend + Java backend"

# 5. Push to GitHub
git push origin main
```

Your code is now on GitHub! 🎉

---

## ✅ STEP 10 — Everyday Git Workflow

Every time you make changes, use this cycle:

```bash
# 1. Check what changed
git status

# 2. See the diff (optional)
git diff

# 3. Stage your changes
git add .             # Stage everything
git add src/App.jsx   # Or stage one file

# 4. Commit with a descriptive message
git commit -m "feat: add download button to generator"

# 5. Push to GitHub
git push origin main

# 6. Pull latest changes (if working in a team)
git pull origin main
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/extensions/generate` | Generate a new extension |
| GET | `/api/extensions` | Get all extensions |
| GET | `/api/extensions/{id}` | Get one extension |
| DELETE | `/api/extensions/{id}` | Delete an extension |

### Request Body (POST /generate):
```json
{
  "prompt": "dark mode toggle for any website",
  "browser": "Chrome",
  "category": "Accessibility"
}
```

---

## 🛠 Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| `npm: command not found` | Reinstall Node.js from nodejs.org |
| `port 3000 already in use` | Run `npx kill-port 3000` |
| `java: command not found` | Add JDK to PATH, or reinstall |
| `git push` asks for password | Use a GitHub Personal Access Token |
| `CORS error` in browser | Check `@CrossOrigin` in ExtensionController.java |

---

## 🚀 Next Steps for Your Internship

- [ ] Connect the React Generator to the Java API (`fetch('/api/extensions/generate', ...)`)
- [ ] Add a real database (H2 or PostgreSQL with Spring Data JPA)
- [ ] Connect an AI API (OpenAI or Anthropic) to the backend service
- [ ] Implement real .zip file download
- [ ] Deploy frontend to Vercel, backend to Railway or Render
- [ ] Write unit tests (`@SpringBootTest`, `@WebMvcTest`)

---

*Built with React 18 + Java 17 + Spring Boot 3 | ExtGen.dev*
