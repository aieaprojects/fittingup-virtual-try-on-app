# Clozet - Virtual Try-On App

A Doppl-style virtual try-on application that allows users to upload photos and try on garments virtually using AI.

## Features

- **User Authentication**: Email/password and Google OAuth
- **Avatar Creation**: Upload full-body photos for virtual try-on
- **Garment Management**: Upload garment images or product URLs
- **AI Try-On**: Identity-preserving virtual try-on using Nano Banana API
- **Content Library**: Manage avatars, garments, and try-on results
- **Moderation**: Automatic content moderation and rate limiting
- **Admin Dashboard**: Monitor jobs, errors, and usage metrics

## Tech Stack

- **Backend**: Encore.ts with PostgreSQL
- **Frontend**: React with TypeScript and Tailwind CSS
- **Storage**: Cloud object storage with signed URLs
- **AI**: Nano Banana (Gemini 2.5 Flash Image) API
- **Auth**: Clerk for authentication
- **Deployment**: AWS/GCP with staging and production environments

## Quick Start

1. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Fill in your API keys and secrets
   ```

2. **Install dependencies and run:**
   ```bash
   encore run
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Admin Dashboard: http://localhost:4000/admin

## Environment Variables

Create a `.env` file with the following variables:

```env
# Nano Banana API
NANO_BANANA_API_KEY=your_nano_banana_api_key
NANO_BANANA_ENDPOINT=https://api.nanobanana.ai/v1

# Clerk Authentication (Production)
CLERK_SECRET_KEY=sk_live_hBigNa1U5cZXbOXHaxm8tiWk4xm9k6R7jTSt0IwOtz
CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuZml0dnVlYXBwLmNvbSQ
CLERK_FRONTEND_API=https://clerk.fitvueapp.com
CLERK_BACKEND_API=https://api.clerk.com

# Storage
STORAGE_BUCKET_NAME=clozet-storage

# Database (automatically configured by Encore in development)
# Production: Set via Encore dashboard
```

## API Documentation

### Authentication
- `POST /auth/login` - Email/password login
- `POST /auth/register` - User registration
- `DELETE /auth/data` - Delete all user data (GDPR)

### Avatars
- `POST /api/avatar` - Upload and process full-body photo
- `GET /api/avatar/:id` - Get avatar details

### Garments
- `POST /api/garments` - Upload garment image or URL
- `GET /api/garments/:id` - Get garment details

### Try-On
- `POST /api/tryon` - Start virtual try-on job
- `GET /api/tryon/:job_id` - Get try-on job status and result

### Library
- `GET /api/library/avatars` - List user's avatars
- `GET /api/library/garments` - List user's garments
- `GET /api/library/results` - List user's try-on results

### Admin
- `GET /admin/jobs` - Monitor job queue
- `GET /admin/metrics` - Usage statistics
- `GET /admin/moderation` - Flagged content

## Rate Limits

- Try-on jobs: 10 per user per day
- Avatar uploads: 5 per user per day
- Garment uploads: 20 per user per day

## Content Moderation

The app automatically rejects:
- Explicit or revealing content
- Public figures (celebrities)
- Mirror selfies or partial body shots
- Low-quality or blurry images

## Deployment

### Staging
```bash
encore deploy --env staging
```

### Production
```bash
encore deploy --env prod
```

## Test Account

For testing, use the seed route to create demo content:
```bash
curl -X POST http://localhost:4000/admin/seed
```

Test credentials:
- Email: test@clozet.com
- Password: TestUser123!

## Architecture

```
├── backend/
│   ├── auth/           # Authentication service
│   ├── avatar/         # Avatar management
│   ├── garment/        # Garment management
│   ├── tryon/          # Virtual try-on processing
│   ├── library/        # Content library
│   ├── moderation/     # Content moderation
│   ├── admin/          # Admin dashboard
│   └── shared/         # Shared utilities
├── frontend/           # React frontend
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   └── utils/         # Frontend utilities
└── docs/              # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
