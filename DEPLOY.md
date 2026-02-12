# DUA Settings Team Portal - Push to GitHub

## Steps to Push to settingsteam Repository

### 1. Navigate to the team-portal-export directory
```bash
cd C:\Users\shabe\OneDrive\Documents\apps\settings\team-portal-export
```

### 2. Initialize Git repository
```bash
git init
git add .
git commit -m "Initial commit: Team Portal separated from monorepo"
```

### 3. Add remote repository
```bash
git remote add origin https://github.com/duagrandevents/settingsteam.git
```

### 4. Push to GitHub
```bash
git branch -M main
git push -u origin main --force
```

> **Note**: Use `--force` only if the repository is empty or you want to overwrite existing content.

### 5. Set up environment variables
Create a `.env` file in the root:
```bash
cp .env.example .env
```

Then edit `.env` and add your Supabase credentials from the main settings project.

### 6. Install dependencies and test
```bash
npm install
npm run dev
```

### 7. Deploy to Vercel
- Go to https://vercel.com
- Import the `settingsteam` repository
- Add environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Deploy!

---

## Project Structure

```
team-portal-export/
├── public/
│   ├── manifest.json
│   ├── icon-192.png
│   └── icon-512.png
├── src/
│   ├── components/
│   │   ├── TeamHeader.jsx
│   │   └── PinLock.jsx
│   ├── context/
│   │   └── AppContext.jsx
│   ├── pages/
│   │   ├── TeamLanding.jsx
│   │   ├── TeamContacts.jsx
│   │   ├── TeamPayments.jsx
│   │   ├── GodownToSite.jsx
│   │   └── SiteToGodown.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

---

## All Set! 🚀

The team-portal-export directory contains everything needed for the Team Portal to run independently.
