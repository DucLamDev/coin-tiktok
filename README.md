# TikTok Coin Recharge Frontend

Frontend application for TikTok coin recharge system built with Next.js and React.

## Features

- 🎨 **Exact TikTok UI Design** - Pixel-perfect recreation of TikTok's coin recharge interface
- 🔐 **Authentication System** - Login and registration with JWT tokens
- 💰 **Coin Recharge** - Multiple coin packages with custom amounts
- 💳 **Payment Integration** - Support for MoMo, ZaloPay, and Credit/Debit cards
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🔍 **User Search** - Search and validate TikTok IDs
- 📊 **Transaction History** - Complete transaction tracking and history
- 🎯 **Real-time Updates** - Live transaction status updates
- 🎉 **Success Notifications** - Beautiful toast notifications for user feedback

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: React Icons
- **Authentication**: JWT with cookies
- **Form Handling**: React Hook Form + Yup validation

## Setup Instructions

1. **Install dependencies:**
```bash
npm install
```

2. **Environment Configuration:**
Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── components/           # Reusable UI components
│   ├── Layout/          # Layout components (Header, Layout)
│   └── Coins/           # Coin-related components
├── pages/               # Next.js pages
│   ├── auth/           # Authentication pages
│   ├── coins/          # Coin recharge pages
│   └── transactions/   # Transaction history
├── lib/                # Utility libraries
│   ├── api.js          # API client configuration
│   ├── auth.js         # Authentication utilities
│   └── utils.js        # Helper functions
└── styles/             # Global styles
```

## Key Components

### Layout Components
- **Header**: Navigation bar with search, user menu, and notifications
- **Layout**: Main layout wrapper with toast notifications

### Coin Components
- **CoinPackageCard**: Individual coin package selection cards
- **PaymentMethodCard**: Payment method selection interface
- **OrderSummaryModal**: Checkout modal with payment confirmation

### Pages
- **Login/Register**: Authentication forms with validation
- **Coins**: Main coin recharge interface (matches TikTok design exactly)
- **Transactions**: Transaction history with pagination and filtering

## Features Implementation

### Authentication
- JWT token-based authentication
- Automatic token refresh and validation
- Protected routes with redirect logic
- User session management with cookies

### Coin Recharge System
- Multiple predefined coin packages
- Custom coin amount support
- Real-time price calculation
- Special offers and discounts
- Target user validation and search

### Payment Processing
- Multiple payment method support
- Secure checkout flow
- Transaction status tracking
- Payment confirmation and receipts

### UI/UX Features
- Exact TikTok design recreation
- Responsive mobile-first design
- Loading states and error handling
- Toast notifications for user feedback
- Form validation with real-time feedback

## API Integration

The frontend integrates with the backend API for:
- User authentication and management
- Coin package retrieval
- Transaction creation and processing
- Payment processing and confirmation
- Transaction history and status tracking

## Responsive Design

The application is fully responsive and provides an optimal experience on:
- Desktop computers (1024px+)
- Tablets (768px - 1023px)
- Mobile phones (320px - 767px)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

The project follows:
- ESLint configuration for code quality
- Prettier for code formatting
- Tailwind CSS for consistent styling
- Component-based architecture

## Deployment

The application can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any static hosting service

Make sure to set the `NEXT_PUBLIC_API_URL` environment variable to point to your production API.
