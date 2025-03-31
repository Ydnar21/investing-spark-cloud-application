# Stock Portfolio Tracker

A modern web application for tracking stock portfolios, built with React, TypeScript, and Supabase. Features include real-time portfolio tracking, investment goal setting, and options calculations.

## Features

- 📈 Real-time portfolio tracking
- 🎯 Investment goal setting and progress monitoring
- 📊 Portfolio analytics and sector allocation
- 💹 Options calculator with profit/loss visualization
- 🔐 Secure authentication system
- 📱 Responsive design for all devices

## Prerequisites

Before you begin, ensure you have installed:

- Node.js (v20 or later)
- npm (v10 or later)
- Docker and Docker Compose (optional, for containerized deployment)

## Local Development Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd stock-portfolio-tracker
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase**

- Create a new project at [Supabase](https://supabase.com)
- Copy your project URL and anon key
- Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Database Setup

The application uses Supabase as its database. The schema includes:

- `portfolios` table for storing user portfolios
- Built-in authentication system

The migrations are located in `supabase/migrations/` and will be automatically applied when connecting to Supabase.

## Test Users

The following test accounts are available:

- Username: `test` / Password: `test`
- Username: `randy` / Password: `admin`
- Username: `karl` / Password: `karl`

## Google Cloud Deployment

1. **Install the Google Cloud SDK**

Follow the instructions at [Google Cloud SDK Installation](https://cloud.google.com/sdk/docs/install)

2. **Initialize your project**

```bash
gcloud init
```

3. **Set environment variables**

```bash
gcloud secrets create VITE_SUPABASE_URL --data-file=- <<< "your_supabase_url"
gcloud secrets create VITE_SUPABASE_ANON_KEY --data-file=- <<< "your_supabase_anon_key"
```

4. **Deploy the application**

```bash
gcloud app deploy
```

### Docker Configuration Details

- Multi-stage build process for optimal image size
- Nginx server for static file serving
- Security hardening with non-root user
- Health checks and automatic restarts
- Resource limits and monitoring

## Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

For production deployment, ensure these are properly set in your environment or Docker configuration.

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── lib/           # Utility functions and configurations
│   ├── types/         # TypeScript type definitions
│   └── App.tsx        # Main application component
├── supabase/
│   └── migrations/    # Database migrations
├── public/            # Static assets
├── docker/           # Docker configuration files
└── ...               # Configuration files
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Common Issues and Solutions

### Authentication Issues

1. **"Invalid login credentials" error**
   - Verify username and password are correct
   - Check if the account exists
   - Ensure Supabase connection is properly configured

2. **Session not persisting**
   - Clear browser cache and cookies
   - Check if localStorage is enabled
   - Verify Supabase configuration

### Database Connection Issues

1. **"Connection refused" error**
   - Verify Supabase URL and anon key are correct
   - Check if Supabase service is running
   - Ensure firewall allows the connection

2. **"Row level security violation" error**
   - Verify user is authenticated
   - Check RLS policies in Supabase dashboard
   - Ensure user has correct permissions

### Deployment Issues

1. **Google Cloud deployment fails**
   - Verify gcloud CLI is properly configured
   - Check if all required environment variables are set
   - Review deployment logs using `gcloud app logs tail`

2. **Application not loading after deployment**
   - Check if build process completed successfully
   - Verify static files are being served correctly
   - Review server logs for any errors

## Security Features

- Row Level Security (RLS) policies for data protection
- Secure authentication system
- CORS and security headers configuration
- Non-root Docker user
- Content Security Policy (CSP) headers

## Performance Optimizations

- Code splitting and lazy loading
- Static asset caching
- Gzip compression
- Docker multi-stage builds
- Optimized Nginx configuration

## Browser Support

The application supports all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.