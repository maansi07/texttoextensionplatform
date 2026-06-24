# Text-to-Extension Platform - Complete Implementation Guide

## Project Structure

```
text-to-extension-platform/
├── backend/
│   ├── config/
│   │   ├── passport.js (Google OAuth config)
│   │   └── stripe.js (Stripe config)
│   ├── middleware/
│   │   └── auth.js (JWT & plan authorization)
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
│   │   ├── Header.jsx
│   │   ├── PlanGate.jsx
│   │   └── GoogleAuthButton.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── PricingPage.jsx
│   │   ├── GeneratorPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── UpgradePage.jsx
│   │   └── AuthCallback.jsx
│   ├── styles/
│   │   ├── AuthPages.css
│   │   ├── Header.css
│   │   ├── HomePage.css
│   │   ├── PricingPage.css
│   │   ├── GeneratorPage.css
│   │   ├── DashboardPage.css
│   │   └── UpgradePage.css
│   ├── App.jsx (with routing)
│   ├── main.jsx (with router & auth provider)
│   └── index.css
└── package.json
```

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables** (`.env`)
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/texttoextension
   JWT_SECRET=your_long_random_secret_key
   JWT_EXPIRE=7d
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/google-auth/google/callback
   
   # Stripe
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_BUILDER_PRICE_ID=price_...
   STRIPE_PRO_PRICE_ID=price_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start MongoDB**
   ```bash
   mongod
   ```

4. **Run Server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install react-router-dom @stripe/react-js @stripe/js
   ```

2. **Environment Variables** (`.env`)
   ```
   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   ```

3. **Run Frontend**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout
- `GET /api/google-auth/google` - Google OAuth login
- `GET /api/google-auth/google/callback` - Google OAuth callback

### Extensions
- `POST /api/extensions` - Create extension (protected)
- `GET /api/extensions` - Get user's extensions (protected)
- `GET /api/extensions/:id` - Get extension details
- `PUT /api/extensions/:id` - Update extension (protected)
- `DELETE /api/extensions/:id` - Delete extension (protected)
- `POST /api/extensions/:id/download` - Download ZIP (Pro only)

### Subscriptions
- `POST /api/subscription/create-checkout-session` - Create Stripe checkout (protected)
- `POST /api/subscription/webhook` - Stripe webhook (public)

## Subscription Plans

### Starter (Free)
- Templates only
- No AI generation
- No download

### Builder ($9.99/month)
- Custom AI generation
- Code preview
- No zip download

### Pro ($29.99/month)
- Everything in Builder
- Zip download
- Save to account
- Unlimited extensions

## Key Features Implemented

✅ User authentication (email/password & Google OAuth)
✅ JWT token-based authorization
✅ Plan-based access control (PlanGate component)
✅ Stripe payment integration
✅ User profile with plan management
✅ Extension CRUD operations
✅ Responsive UI design
✅ Error handling
✅ Loading states

## Next Steps for Completion

1. **AI Generation Integration**
   - Connect to OpenAI or similar API
   - Implement extension code generation

2. **Zip Download Feature**
   - Create manifest.json
   - Generate ZIP file with extension files
   - Setup download endpoint

3. **Email Notifications**
   - Welcome email on signup
   - Subscription confirmation
   - Password reset

4. **Testing**
   - Unit tests for backend
   - Integration tests
   - E2E tests with Cypress

5. **Deployment**
   - Setup MongoDB Atlas
   - Deploy backend to Heroku/Vercel
   - Deploy frontend to Vercel
   - Configure Stripe webhooks for production

## Important Notes

- Store sensitive keys in environment variables
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Add input validation on frontend and backend
- Setup CORS properly for production
- Test Stripe integration thoroughly before launch
