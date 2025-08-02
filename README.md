# MariKaya - Complete Digital Lending Platform

![MariKaya Logo](./assets/marikaya-logo.png)

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/marikaya/lending-platform)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-18.x-green.svg)](https://nodejs.org/)
[![React Native](https://img.shields.io/badge/react--native-0.72.6-blue.svg)](https://reactnative.dev/)
[![MongoDB](https://img.shields.io/badge/mongodb-7.x-green.svg)](https://www.mongodb.com/)

## 🚀 Overview

MariKaya is a comprehensive digital lending platform designed for the Indonesian market, providing quick and secure personal loans through a modern mobile application. The platform features advanced risk assessment, automated loan processing, multiple payment options, and comprehensive admin management tools.

## ✨ Key Features

### 🎯 Core Features
- **Digital Loan Application**: Complete loan application process through mobile app
- **Real-time Risk Assessment**: Advanced credit scoring and risk evaluation
- **Multiple Payment Methods**: Bank transfer, e-wallets, virtual accounts, QRIS
- **KYC Verification**: Multi-level identity verification with document scanning
- **Biometric Security**: Fingerprint and Face ID authentication
- **Real-time Notifications**: SMS, email, and push notifications
- **Admin Dashboard**: Comprehensive loan and user management
- **Multi-language Support**: Indonesian and English

### 🔐 Security Features
- **JWT Authentication**: Secure token-based authentication
- **End-to-end Encryption**: All sensitive data encrypted
- **Fraud Detection**: Real-time fraud monitoring and prevention
- **Device Fingerprinting**: Enhanced security through device tracking
- **Secure Document Storage**: Encrypted document storage with Cloudinary
- **PCI DSS Compliance**: Payment card data security standards

### 📱 Mobile App Features
- **Modern UI/UX**: Clean, intuitive interface designed for Indonesian users
- **Offline Capability**: Core features work without internet connection
- **Progressive Web App**: Web version for desktop access
- **Push Notifications**: Real-time updates on loan status
- **Document Scanner**: Built-in camera for document verification
- **Location Services**: GPS verification for fraud prevention

## 🏗️ Architecture

### Backend (Node.js/Express)
```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Authentication, validation, logging
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   ├── config/         # Database and app configuration
│   └── scripts/        # Database seeding and maintenance
├── package.json
└── .env.example
```

### Mobile App (React Native/Expo)
```
mobile/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens
│   ├── navigation/     # Navigation configuration
│   ├── services/       # API services
│   ├── store/          # Redux store and slices
│   ├── utils/          # Helper functions
│   ├── constants/      # App constants and theme
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript type definitions
├── assets/             # Images, fonts, animations
├── package.json
└── app.json
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18.x
- **Framework**: Express.js 4.x
- **Database**: MongoDB 7.x with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **File Storage**: Cloudinary for document management
- **Payment Processing**: Stripe, Midtrans, Xendit
- **Real-time Communication**: Socket.IO
- **Logging**: Winston with structured logging
- **Caching**: Redis for session management
- **Email Service**: Nodemailer with SMTP
- **SMS Service**: Twilio for OTP verification

### Mobile App
- **Framework**: React Native 0.72.6 with Expo 49.x
- **State Management**: Redux Toolkit with Redux Persist
- **Navigation**: React Navigation 6.x
- **UI Components**: React Native Paper + custom components
- **Forms**: Formik with Yup validation
- **HTTP Client**: Axios with interceptors
- **Local Storage**: AsyncStorage + Expo SecureStore
- **Permissions**: Expo Permissions for camera, location, etc.
- **Charts**: React Native Chart Kit
- **Animations**: React Native Reanimated 3.x

### DevOps & Deployment
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose for development
- **CI/CD**: GitHub Actions for automated deployment
- **Monitoring**: Application performance monitoring
- **Cloud Provider**: AWS/Google Cloud Platform
- **CDN**: CloudFront for static asset delivery

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- MongoDB 7.x
- Redis (optional, for caching)
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/marikaya/lending-platform.git
cd marikaya-lending-platform
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7

# Or use your local MongoDB installation
mongod
```

5. **Seed the database (optional)**
```bash
npm run seed
```

6. **Start the backend server**
```bash
# Development
npm run dev

# Production
npm start
```

The backend API will be available at `http://localhost:5000`

### Mobile App Setup

1. **Install mobile dependencies**
```bash
cd mobile
npm install
```

2. **Start the development server**
```bash
# Start Expo development server
npm start

# For Android
npm run android

# For iOS (macOS only)
npm run ios
```

3. **Install Expo Go app** on your mobile device and scan the QR code

### Full Stack Development

Run both backend and mobile app simultaneously:
```bash
# From the root directory
npm run install:all
npm run dev
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh authentication token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-otp` - Verify OTP

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/documents` - Upload documents
- `GET /api/users/verification-status` - Get verification status
- `POST /api/users/verify-identity` - Submit identity verification

### Loan Management
- `GET /api/loans` - Get user loans
- `POST /api/loans` - Apply for a loan
- `GET /api/loans/:id` - Get loan details
- `PUT /api/loans/:id` - Update loan application
- `POST /api/loans/:id/calculate` - Calculate loan terms
- `GET /api/loans/:id/schedule` - Get repayment schedule

### Payment Processing
- `GET /api/payments` - Get payment history
- `POST /api/payments` - Create payment
- `GET /api/payments/:id` - Get payment details
- `POST /api/payments/:id/confirm` - Confirm payment
- `POST /api/payments/webhook` - Payment gateway webhook

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Manage users
- `GET /api/admin/loans` - Manage loans
- `POST /api/admin/loans/:id/approve` - Approve loan
- `POST /api/admin/loans/:id/reject` - Reject loan
- `GET /api/admin/reports` - Generate reports

Full API documentation is available at `/api-docs` when running in development mode.

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/marikaya
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# Payment Gateways
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
MIDTRANS_SERVER_KEY=your_midtrans_server_key
XENDIT_SECRET_KEY=your_xendit_secret_key

# File Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Communication
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:19006
```

**Mobile App**
Configure the API base URL in `mobile/src/constants/config.js`:
```javascript
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://your-production-api.com/api';
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test                # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage
```

### Mobile App Testing
```bash
cd mobile
npm test              # Run Jest tests
npm run test:e2e      # Run end-to-end tests
```

## 📱 Mobile App Features

### User Authentication
- Email/phone registration and login
- OTP verification via SMS
- Biometric authentication (fingerprint/face)
- PIN-based quick login
- Social media login integration

### Loan Application Process
1. **Personal Information**: Basic details and contact information
2. **Employment Details**: Job information and income verification
3. **Document Upload**: KTP, salary slips, bank statements
4. **Loan Configuration**: Amount, tenure, and purpose selection
5. **Review & Submit**: Final review before submission
6. **Real-time Status**: Track application progress

### Payment Features
- Multiple payment methods (bank transfer, e-wallets, QRIS)
- Payment reminders and notifications
- Payment history and receipts
- Early payment options
- Automatic payment scheduling

### Security Features
- Device registration and verification
- Location-based fraud detection
- Secure document storage
- End-to-end encryption
- Biometric authentication

## 👨‍💼 Admin Dashboard Features

### Dashboard Overview
- Real-time statistics and KPIs
- Loan application metrics
- Payment collection rates
- User growth analytics
- Revenue and profitability reports

### User Management
- User registration and verification
- KYC document review and approval
- User risk assessment
- Account suspension and management
- Communication history

### Loan Management
- Loan application review and approval
- Risk assessment dashboard
- Loan disbursement management
- Collection and recovery tools
- Restructuring and settlements

### Financial Management
- Payment processing and reconciliation
- Revenue and expense tracking
- Profit and loss statements
- Cash flow management
- Regulatory reporting

## 🔐 Security Implementation

### Data Protection
- **Encryption at Rest**: All sensitive data encrypted in database
- **Encryption in Transit**: TLS 1.3 for all API communications
- **PII Protection**: Personal information masked in logs
- **Document Security**: Secure document storage with access controls
- **Payment Security**: PCI DSS compliant payment processing

### Authentication & Authorization
- **Multi-factor Authentication**: SMS OTP and biometric verification
- **Role-based Access Control**: Granular permissions system
- **Session Management**: Secure session handling with Redis
- **Token Security**: JWT with short expiration and refresh tokens
- **Device Fingerprinting**: Enhanced security through device tracking

### Fraud Prevention
- **Real-time Monitoring**: Automated fraud detection algorithms
- **Risk Scoring**: Machine learning-based risk assessment
- **Behavioral Analysis**: User behavior pattern analysis
- **Geographic Verification**: Location-based fraud detection
- **Device Intelligence**: Device reputation and risk assessment

## 📊 Monitoring & Analytics

### Application Monitoring
- **Performance Metrics**: Response times, throughput, error rates
- **Error Tracking**: Comprehensive error logging and alerting
- **User Analytics**: User behavior and app usage analytics
- **Business Metrics**: Loan conversion rates, payment success rates
- **Infrastructure Monitoring**: Server health and resource usage

### Logging
- **Structured Logging**: JSON-formatted logs with correlation IDs
- **Audit Trails**: Complete audit log for sensitive operations
- **Error Aggregation**: Centralized error tracking and reporting
- **Performance Logging**: API response times and database queries
- **Security Logging**: Authentication attempts and security events

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Build production images
docker build -t marikaya-backend ./backend
docker build -t marikaya-mobile ./mobile
```

### Cloud Deployment
The application is designed for cloud deployment with:
- **Auto-scaling**: Horizontal scaling based on load
- **Load Balancing**: Distribute traffic across multiple instances
- **Database Clustering**: MongoDB replica sets for high availability
- **CDN Integration**: CloudFront for global content delivery
- **Backup Strategy**: Automated database backups and disaster recovery

### CI/CD Pipeline
GitHub Actions workflow for automated deployment:
- Code quality checks and linting
- Automated testing (unit, integration, e2e)
- Security vulnerability scanning
- Docker image building and scanning
- Deployment to staging and production environments

## 🤝 Contributing

We welcome contributions to the MariKaya platform! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Guidelines
- Follow the established code style and conventions
- Write comprehensive tests for new features
- Update documentation for any changes
- Ensure all tests pass before submitting PR
- Follow semantic versioning for releases

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](https://api-docs.marikaya.com)
- [Mobile App Guide](./docs/mobile-app-guide.md)
- [Admin Dashboard Manual](./docs/admin-dashboard.md)
- [Security Guidelines](./docs/security.md)

### Getting Help
- **Bug Reports**: [GitHub Issues](https://github.com/marikaya/lending-platform/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/marikaya/lending-platform/discussions)
- **Email Support**: support@marikaya.com
- **Developer Community**: [Discord](https://discord.gg/marikaya)

### Troubleshooting

**Common Issues:**

1. **Database Connection Error**
   ```bash
   # Check MongoDB status
   mongod --version
   # Verify connection string in .env
   ```

2. **Mobile App Not Loading**
   ```bash
   # Clear Expo cache
   expo r -c
   # Reinstall dependencies
   npm install
   ```

3. **API Authentication Issues**
   ```bash
   # Check JWT secret configuration
   # Verify token expiration settings
   ```

## 🔄 Changelog

### Version 1.0.0 (Current)
- Initial release with core lending features
- Mobile app for Android and iOS
- Admin dashboard for loan management
- Multiple payment gateway integrations
- Comprehensive security implementation
- Real-time notifications and updates

### Upcoming Features
- AI-powered credit scoring
- Open banking integration
- Merchant lending platform
- International expansion support
- Advanced analytics dashboard

## 🏢 About MariKaya

MariKaya is a fintech company focused on democratizing access to financial services in Indonesia. Our mission is to provide fast, secure, and affordable lending solutions through innovative technology.

**Contact Information:**
- Website: https://marikaya.com
- Email: info@marikaya.com
- Phone: +62-21-MARIKAYA
- Address: Jakarta, Indonesia

---

**Built with ❤️ by the MariKaya Team**