# Habit Tracker

A beautiful, minimalist habit tracking application built with Next.js, Supabase, and Tailwind CSS.

## Features

- 📝 Track unlimited habits daily
- 🔥 Build and maintain streaks
- 📊 View monthly completion statistics
- 📅 Calendar heatmap visualization
- 🎨 Beautiful, modern UI with dark mode
- 🔐 Secure authentication with Supabase
- 📱 Fully responsive design

## Quick Start

### Prerequisites

- Node.js 18.17 or higher
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd habit-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your values from the Supabase dashboard.

4. **Set up the database**

   Go to your Supabase project dashboard:
   - Navigate to SQL Editor
   - Run the SQL script from `SETUP_GUIDE.md` to create tables and policies

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Documentation

For detailed setup instructions, tech stack information, and deployment guide, see [SETUP_GUIDE.md](./SETUP_GUIDE.md).

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Hosting:** Vercel

## Project Structure

```
habit-tracker/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions
├── types/           # TypeScript types
├── public/          # Static assets
└── SETUP_GUIDE.md   # Detailed documentation
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

Deploy to Vercel with one click:

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
