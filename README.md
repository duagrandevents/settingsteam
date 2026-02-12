# DUA Settings Team Portal

Team Portal for DUA Grande Events - Site management, payments, and contacts.

## Setup

1. Clone repository:
```bash
git clone https://github.com/duagrandevents/settingsteam.git
cd settingsteam
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials.

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Deployment

Deployed on Vercel: https://settingsteam.vercel.app

## Environment Variables

Required in Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Features

- **Team Landing**: View assigned sites and workflows
- **Site Workflows**: Godown to Site (Outbound) & Site to Godown (Inbound)
- **Contacts**: Team contact directory
- **Payments**: Payment history
- **PIN Lock**: PIN-based authentication

## Tech Stack

- React 19
- Vite 7
- Supabase
- React Router
- Lucide Icons
