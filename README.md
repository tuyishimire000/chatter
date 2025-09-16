# Luxury Chat App

A clean, modern, luxury-minimal chat website built with Next.js 14, Supabase, and Mista API integration.

## Features

- **Phone Number Authentication**: Simple phone number-based login system
- **User Dashboard**: View past messages and send new messages to admin
- **Admin Dashboard**: Manage all users, view conversations, and send internal messages or SMS
- **SMS Integration**: Send one-way SMS messages using Mista API
- **Row Level Security**: Secure data access with Supabase RLS policies
- **Luxury Minimal UI**: Clean, elegant design with shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **SMS**: Mista API
- **UI Components**: shadcn/ui
- **Deployment**: Vercel

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd luxury-chat-app
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the schema from `supabase-schema.sql`
3. Get your project URL and anon key from Settings > API

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Configuration
NEXT_PUBLIC_ADMIN_PHONE=+1234567890

# Mista API Configuration
MISTA_API_KEY=your_mista_api_key
MISTA_SENDER_ID=LuxuryChat

# Website URL (for SMS links)
NEXT_PUBLIC_WEBSITE_URL=https://your-domain.vercel.app
```

### 4. Set up Mista API

1. Sign up at [Mista.io](https://mista.io)
2. Get your API key from the dashboard
3. Configure your sender ID

### 5. Add Admin User

In your Supabase dashboard, add an admin user to the profiles table:

```sql
INSERT INTO profiles (phone_number) VALUES ('+1234567890');
```

Replace `+1234567890` with your actual admin phone number.

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Database Schema

### Profiles Table
- `id` (UUID, Primary Key)
- `phone_number` (Text, Unique)
- `created_at` (Timestamp)

### Messages Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to profiles.id)
- `sender` (Enum: 'user' | 'admin')
- `content` (Text)
- `created_at` (Timestamp)

## Deployment to Vercel

### 1. Deploy to Vercel

```bash
npx vercel
```

### 2. Configure Environment Variables

In your Vercel dashboard, add all environment variables from your `.env.local` file.

### 3. Update Website URL

Update `NEXT_PUBLIC_WEBSITE_URL` in Vercel to your actual domain.

## Usage

### For Users
1. Visit the website
2. Enter your phone number (must exist in the database)
3. View your conversation history
4. Send messages to the admin

### For Admin
1. Login with the admin phone number
2. View all users and their unread message counts
3. Select a user to view their conversation
4. Send internal messages or SMS replies

## Security Features

- Row Level Security (RLS) policies ensure users can only access their own data
- Admin access controlled by environment variable
- Secure API routes for sensitive operations

## Customization

### Styling
The app uses a luxury minimal design with:
- Neutral color palette (slate grays)
- Generous whitespace
- Soft shadows and subtle borders
- Clean typography

### Components
Built with shadcn/ui components for consistency and accessibility.

## Troubleshooting

### Common Issues

1. **"Phone number not found"**: Make sure the phone number exists in the profiles table
2. **SMS not sending**: Check your Mista API key and sender ID
3. **Database errors**: Verify your Supabase connection and RLS policies

### Support

For issues and questions, please check the Supabase and Mista API documentation.

## License

MIT License