# Astro - Professional Node.js Application

A robust, production-ready Node.js application built with modern JavaScript and Express, providing a clean foundation for API development.

## Features

- 🚀 **Modern JavaScript** - ES6+ features with module support
- 🛡️ **Security** - Helmet, CORS, and security best practices
- 🧪 **Testing** - Jest with comprehensive test coverage
- 📝 **Code Quality** - ESLint, Prettier, and pre-commit hooks
- 🔧 **Developer Experience** - Hot reload with nodemon and VS Code integration
- 📦 **Production Ready** - Environment configuration and error handling
- 🎯 **Clean Foundation** - Minimal setup ready for your features

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd astro

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm start            # Start production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run lint         # Check code style
npm run lint:fix     # Fix code style issues
npm run format       # Format code with Prettier
```

## Project Structure

```
src/
├── config/          # Configuration files
├── middleware/      # Custom middleware
├── routes/          # API routes
├── utils/           # Utility functions
├── test/            # Test setup and utilities
└── index.js         # Application entry point
```

## API Documentation

The API follows RESTful conventions and includes:

- **GET** `/api/v1/health` - Health check endpoint

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `NODE_ENV` - Environment (development/production/test)
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - JWT signing secret

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Code Quality

This project enforces code quality through:

- **ESLint** - Static code analysis for JavaScript
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks
- **Environment Configuration** - Secure configuration management

## Getting Started

This is a clean foundation for building APIs. To add your own features:

1. Create routes in `src/routes/`
2. Add controllers in `src/controllers/` (create directory)
3. Implement business logic in `src/services/` (create directory)
4. Add validation schemas in `src/validation/` (create directory)
5. Update `src/index.js` to register new routes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
