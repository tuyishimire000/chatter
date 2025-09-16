# 🚀 Deployment Guide

## Vercel Deployment

### 1. **Deploy to Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production deployment
vercel --prod
```

### 2. **Set Environment Variables**

After deployment, go to your Vercel dashboard and add these environment variables:

#### **Required Variables:**
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
NEXT_PUBLIC_ADMIN_PHONE = +1234567890
```

#### **Optional Variables:**
```
MISTA_API_KEY = your_mista_api_key
MISTA_SENDER_ID = LuxuryChat
NEXT_PUBLIC_WEBSITE_URL = https://your-domain.vercel.app
```

### 3. **Get Supabase Credentials**

1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. **Set Up Database**

1. In Supabase SQL Editor, run the schema:
   ```sql
   -- Copy and paste the contents of supabase-schema.sql
   ```

2. Add your admin user:
   ```sql
   INSERT INTO profiles (phone_number) VALUES ('+1234567890');
   ```

3. Add test users:
   ```sql
   INSERT INTO profiles (phone_number) VALUES 
   ('+15551234567'),
   ('+15551234568'),
   ('+15551234569'),
   ('+15551234570'),
   ('+15551234571');
   ```

### 5. **Test Deployment**

1. Visit your Vercel URL
2. Try logging in with your admin phone number
3. Test the user dashboard with test phone numbers

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_ADMIN_PHONE` | Admin phone number | `+1234567890` |
| `MISTA_API_KEY` | Mista SMS API key | `your_api_key_here` |
| `MISTA_SENDER_ID` | SMS sender name | `LuxuryChat` |
| `NEXT_PUBLIC_WEBSITE_URL` | Your website URL | `https://your-app.vercel.app` |

## Troubleshooting

### **"Secret does not exist" Error**
- Remove the `vercel.json` file or update it to not reference secrets
- Set environment variables directly in Vercel dashboard

### **"Phone number not found" Error**
- Make sure you've added users to the profiles table
- Check that the phone number format matches exactly

### **Build Errors**
- Check that all environment variables are set
- Verify Supabase connection
- Run `npm run build` locally to test

### **SMS Not Working**
- Verify Mista API key is correct
- Check that you have sufficient API credits
- Test with a real phone number

## Quick Commands

```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```
