# Luxury Chat App - Setup Guide

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in the root directory:

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

### 2. Database Setup

1. **Create Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project
2. **Run Schema**: In the Supabase SQL Editor, run the contents of `supabase-schema.sql`
3. **Add Admin User**: Insert your admin phone number:
   ```sql
   INSERT INTO profiles (phone_number) VALUES ('+1234567890');
   ```

### 3. Mista API Setup

1. **Sign up**: Go to [Mista.io](https://mista.io) and create an account
2. **Get API Key**: Copy your API key from the dashboard
3. **Configure Sender ID**: Set your preferred sender ID

### 4. Development

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. Deployment to Vercel

```bash
npm run deploy
```

Or connect your GitHub repo to Vercel for automatic deployments.

## 📱 Features

### User Experience
- **Phone Number Login**: Simple authentication with phone numbers
- **Message History**: View all past conversations
- **Send Messages**: Send messages to admin
- **Luxury UI**: Clean, minimal design with elegant typography

### Admin Experience
- **User Management**: View all users with unread message counts
- **Conversation View**: See individual user conversations
- **Dual Messaging**: Send internal messages or SMS
- **Real-time Updates**: Live message updates

### Technical Features
- **Row Level Security**: Secure data access with Supabase RLS
- **TypeScript**: Full type safety
- **Responsive Design**: Works on all devices
- **Modern UI**: Built with shadcn/ui components

## 🔧 Configuration

### Adding Users
Users are automatically created when they first log in with a valid phone number. To pre-populate users:

```sql
INSERT INTO profiles (phone_number) VALUES ('+1234567890');
```

### Admin Access
Set the `NEXT_PUBLIC_ADMIN_PHONE` environment variable to your admin phone number.

### SMS Configuration
- **API Key**: Get from Mista dashboard
- **Sender ID**: Customize the sender name
- **Message Format**: SMS messages include a link back to the website

## 🛡️ Security

- **RLS Policies**: Users can only access their own data
- **Admin Verification**: Admin access controlled by environment variable
- **Input Validation**: All inputs are validated and sanitized
- **Error Handling**: Graceful error handling throughout

## 📊 Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'admin')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎨 Customization

### Styling
The app uses a luxury minimal design with:
- Neutral color palette (slate grays)
- Generous whitespace
- Soft shadows and subtle borders
- Clean typography

### Components
Built with shadcn/ui for consistency and accessibility.

## 🚨 Troubleshooting

### Common Issues

1. **"Phone number not found"**
   - Ensure the phone number exists in the profiles table
   - Check the phone number format (include country code)

2. **SMS not sending**
   - Verify Mista API key is correct
   - Check sender ID configuration
   - Ensure sufficient API credits

3. **Build errors**
   - Check all environment variables are set
   - Verify Supabase connection
   - Run `npm run build` to test

### Support

For technical issues:
1. Check the browser console for errors
2. Verify environment variables
3. Test Supabase connection
4. Check Mista API status

## 📈 Next Steps

### Potential Enhancements
- **OTP Verification**: Add SMS-based OTP for secure login
- **Push Notifications**: Real-time notifications for new messages
- **File Attachments**: Support for image/file sharing
- **Message Status**: Read receipts and delivery status
- **User Management**: Admin interface for user management
- **Analytics**: Message and user analytics dashboard

### Production Considerations
- **Rate Limiting**: Implement rate limiting for API calls
- **Monitoring**: Add error tracking and performance monitoring
- **Backup**: Regular database backups
- **Scaling**: Consider connection pooling for high traffic

## 📄 License

MIT License - Feel free to use and modify as needed.
