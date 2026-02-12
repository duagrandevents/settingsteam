# Navigate to team-portal-export
cd C:\Users\shabe\OneDrive\Documents\apps\settings\team-portal-export

# Initialize git
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Team Portal separated from monorepo"

# Add remote
git remote add origin https://github.com/duagrandevents/settingsteam.git

# Push to main branch
git branch -M main
git push -u origin main --force
