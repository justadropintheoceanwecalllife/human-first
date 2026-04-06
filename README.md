# human-first

> Work-life balance platform for GovTech - when AI is running, talk to humans; learn something new; touch grass

## About

**human-first** is a platform designed for GovTech Singapore to help employees maintain work-life balance in an AI-driven world. When your agents are executing, instead of doomscrolling, connect with real humans, complete hands-on tasks, and remember what it means to be human.

### Core Features

- 🌱 **Daily Challenges** - Prove you're human with hands-on tasks (photo of a plant, sunset, origami)
- 💬 **Live Chatroom** - Drop in anytime to share what you made and learn from others
- 🤖 **AI Facilitator** - An AI agent keeps the conversation flowing and connects people
- 🎨 **Nature-Inspired Design** - Water, jellyfish, clouds - calming aesthetics for mindful breaks

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create a `.env.local` file in the root directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tuvacldzwafkblbkgkdp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Anthropic (Claude API)
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-api03-...
```

Get your Claude API key from: https://console.anthropic.com/

### 3. Set up Supabase database
Follow the instructions in `SUPABASE_SETUP.md` to create the database tables.

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS v4** (nature-inspired design system)
- **Framer Motion** (fluid animations)
- **Socket.io** (real-time chat - coming soon)
- **Claude API** (AI facilitator - coming soon)

## Design System

Water/jellyfish/nature-inspired color palette:
- Water blues: `#A8D5E2`, `#5B9AA9`, `#B8E6D5`
- Jellyfish pink: `#FFB3D9`
- Sunset orange: `#FFD4A3`
- Organic shapes with floating animations

## Project Status

🚧 **In Development** - Built for GovTech Hackathon 2026

---

Built with 💙 for GovTech Singapore
