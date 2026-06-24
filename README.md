# Text-to-Extension Platform

> 🚀 Transform text descriptions into fully functional Chrome extensions using AI

## 🎯 Project Overview

Text-to-Extension Platform is a full-stack web application that allows users to generate, manage, and download Chrome extensions from simple text descriptions. The platform features a freemium model with three subscription tiers and integrates Google OAuth and Stripe for payments.

## ✨ Key Features

### User Management
- 🔐 Email/Password authentication with JWT tokens
- 🔑 Google OAuth integration for one-click login
- 👤 User profiles with subscription management
- 📧 Plan-based access control

### Extension Generation
- 🤖 AI-powered extension code generation (Builder/Pro plans)
- 📝 Template-based creation (Starter plan)
- 👀 Live code preview
- 💾 Save extensions to account
- 📥 One-click ZIP download (Pro plan only)

### Subscription Management
- 💳 Stripe payment integration
- 📊 Three pricing tiers (Starter/Builder/Pro)
- 🔄 Subscription management
- 📈 Feature gating by plan

### Dashboard
- 📋 View all user extensions
- ✏️ Edit extension details
- 🗑️ Delete extensions
- 📊 Usage statistics

## 🏗️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Passport.js** - Authentication middleware
- **JWT** - Token-based authentication
- **Stripe** - Payment processing
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool
- **CSS3** - Styling (no framework - pure CSS)
- **Stripe.js** - Payment UI

## 📦 Installation

### Prerequisites
- Node.js 16+
- MongoDB
- Git

### Backend Setup

```bash
# Clone repository
git clone <repo-url>
cd texttoextensionplatform

# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# - MongoDB URI
# - JWT Secret
# - Google OAuth credentials
# - Stripe API keys

# Start server
npm run dev
```

### Frontend Setup

```bash
# In project root
npm install

# Create .env file
echo 'VITE_STRIPE_PUBLIC_KEY=pk_test_...' > .env

# Start development server
npm run dev
```

## 🔐 Environment Variables

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/texttoextension

# Authentication
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/google-auth/google/callback

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_BUILDER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### Extensions Endpoints

#### Create Extension
```http
POST /api/extensions
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My Extension",
  "description": "A useful extension",
  "templateType": "popup",
  "generatedBy": "ai",
  "aiPrompt": "Create a todo list"
}
```

#### Get User Extensions
```http
GET /api/extensions
Authorization: Bearer {token}
```

#### Get Extension Details
```http
GET /api/extensions/{id}
```

#### Update Extension
```http
PUT /api/extensions/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

#### Delete Extension
```http
DELETE /api/extensions/{id}
Authorization: Bearer {token}
```

#### Download Extension (Pro only)
```http
POST /api/extensions/{id}/download
Authorization: Bearer {token}
```

### Subscription Endpoints

#### Create Checkout Session
```http
POST /api/subscription/create-checkout-session
Authorization: Bearer {token}
Content-Type: application/json

{
  "plan": "Pro"
}
```

## 🎨 UI Components

### Pages
- **HomePage** - Landing page with features overview
- **LoginPage** - Email/password and OAuth login
- **SignupPage** - User registration form
- **PricingPage** - Subscription plans display
- **GeneratorPage** - Extension creation interface
- **DashboardPage** - User's extensions management
- **UpgradePage** - Plan upgrade interface
- **AuthCallback** - OAuth callback handler

### Components
- **Header** - Navigation with user menu
- **PlanGate** - Feature access control based on plan
- **GoogleAuthButton** - Styled Google OAuth button

## 💳 Subscription Plans

### Starter (Free)
- ✓ Templates only
- ✓ Basic support
- ✗ No AI generation
- ✗ No download

### Builder ($9.99/month)
- ✓ Custom AI generation
- ✓ Code preview
- ✓ Priority support
- ✗ No zip download

### Pro ($29.99/month)
- ✓ Everything in Builder
- ✓ Zip download
- ✓ Save to account
- ✓ Unlimited extensions
- ✓ 24/7 support

## 🚀 Deployment

### Backend (Heroku Example)
```bash
# Create Heroku app
heroku create texttoextension-api

# Set environment variables
heroku config:set JWT_SECRET=...
heroku config:set MONGODB_URI=...
# ... set all other env vars

# Deploy
git push heroku main
```

### Frontend (Vercel Example)
```bash
# Deploy with Vercel CLI
vercel

# Set environment variables in Vercel dashboard
# VITE_STRIPE_PUBLIC_KEY=...
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
npm test
```

## 📋 Project Structure

```
text-to-extension-platform/
├── backend/
│   ├── config/
│   │   ├── passport.js
│   │   └── stripe.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Extension.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── extensions.js
│   │   ├── google-auth.js
│   │   └── subscription.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── styles/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🆘 Support

- 📧 Email: support@texttoextension.com
- 💬 Discord: [Join Community](#)
- 📖 Docs: [Full Documentation](#)

## 🎯 Roadmap

- [ ] AI code generation integration
- [ ] Advanced code editor
- [ ] Extension publishing to Chrome Web Store
- [ ] Team collaboration features
- [ ] Version history and rollback
- [ ] Custom templates
- [ ] API for third-party integrations
- [ ] Mobile app

## 🙏 Acknowledgments

- Stripe for payment processing
- Google for OAuth
- MongoDB for database
- React community

---

**Made with ❤️ by the Text-to-Extension Team**
