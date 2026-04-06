# Supabase Setup Instructions

## Step 1: Run the SQL Schema

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/tuvacldzwafkblbkgkdp
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase-schema.sql` into the editor
5. Click **Run** (or press Cmd/Ctrl + Enter)

This will create:
- ✅ `users` table
- ✅ `submissions` table
- ✅ `chat_messages` table
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ Storage bucket for images/videos

## Step 2: Verify Tables Were Created

1. Click **Table Editor** in the left sidebar
2. You should see three tables: `users`, `submissions`, `chat_messages`

## Step 3: Verify Storage Bucket

1. Click **Storage** in the left sidebar
2. You should see a bucket named `submissions`
3. This bucket is **public** (anyone can view files)

## Step 4: Test the App

1. Restart your dev server: `npm run dev`
2. Go to http://localhost:3000
3. Click "Get Started"
4. Upload a photo
5. Check your Supabase dashboard:
   - **Table Editor** → `users` → You should see your anonymous user
   - **Table Editor** → `submissions` → You should see your submission
   - **Storage** → `submissions` → You should see your uploaded image

## Troubleshooting

### Error: "relation 'public.users' does not exist"
- Make sure you ran the SQL schema in the SQL Editor
- Refresh your browser

### Error: "Failed to upload"
- Check that the `submissions` storage bucket was created
- Go to Storage → Check if "submissions" exists
- If not, run the storage bucket creation part of the SQL again

### Error: "Row Level Security policy violation"
- This shouldn't happen with the current policies (all allow public access)
- If it does, go to Authentication → Policies and verify policies were created

### Can't see images in feed
- Check the Storage bucket settings
- Make sure the bucket is set to **public**
- Go to Storage → submissions → Settings → Make public

## Environment Variables

Your `.env.local` file should contain:
```
NEXT_PUBLIC_SUPABASE_URL=https://tuvacldzwafkblbkgkdp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_IPa9yKzAasmwo96jnILOyg_htsM9kwo
```

**Note:** This file is in `.gitignore` and won't be committed to GitHub.

## What's Next?

- ✅ Database is set up
- ✅ File uploads work
- ✅ Community feed shows everyone's submissions
- 🚧 Next: Build live chatroom with Socket.io + AI facilitator
