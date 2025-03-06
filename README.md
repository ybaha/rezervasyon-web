# Rezervasyon - Whitelabel Reservation Platform

A customizable (whitelabel) reservation platform designed for barbers, car washes, and other appointment-based businesses. The platform can be tailored to each business and easily adapted to new industries.

## Features

- **Whitelabel Support**: Flexible structure suitable for multiple industries
- **Stripe Integration**: Secure payment processing
- **Membership Model**: Trial period for first-time users, followed by a paid subscription
- **Appointment Management**: Reservation tracking for business owners
- **User-Friendly Interface**: Easy booking and business discovery

## Tech Stack

- **Frontend**: Next.js (App Router) + Tailwind CSS + shadcn/ui
- **Backend**: Supabase / PostgreSQL
- **Authentication**: Supabase Auth
- **Payments**: Stripe

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/rezervasyon-web.git
cd rezervasyon-web
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
```
Then edit `.env.local` with your Supabase and Stripe credentials.

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js App Router pages and layouts
  - `/(marketing)` - Public-facing pages (homepage, search, etc.)
  - `/(auth)` - Authentication pages
  - `/(dashboard)` - Business owner dashboard
  - `/api` - API routes
- `/components` - React components
  - `/ui` - UI components from shadcn/ui
- `/config` - Configuration files
  - `/texts` - UI-facing texts for whitelabel
  - `/themes` - Theme configurations for different industries
- `/lib` - Utility functions and shared code
- `/public` - Static assets

## Customization

The application is designed to be easily customizable for different industries:

- Edit `/config/texts/en.ts` to change UI texts
- Modify themes in `/config/themes/` to adjust colors and styling
- Add new industry-specific configurations as needed

## License

[MIT](https://choosealicense.com/licenses/mit/)
