# Personnel Management System

## 🚀 Deploy on Render

### 1. Connect GitHub Repository
- Go to [Render Dashboard](https://dashboard.render.com/)
- Click "New +" → "Web Service"
- Connect GitHub: `https://github.com/naiyachonponthong/school-systemPK`

### 2. Configure Web Service
- **Name**: `personnel-system`
- **Region**: Singapore (or nearest)
- **Branch**: `main`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 3. Environment Variables
Add these in Render Dashboard:

```env
NODE_ENV=production
PORT=3000
DB_HOST=119.59.100.50
DB_PORT=3306
DB_NAME=pornsiri_personnel_db
DB_USER=pornsiri_personnel_db
DB_PASSWORD=%7g3ILP3navza^sz
JWT_SECRET=xK9anM2$pL7
JWT_EXPIRES_IN=24h
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
SESSION_TIMEOUT=86400000
```

### 4. Deploy
- Click "Create Web Service"
- Wait for deployment (2-3 minutes)
- Access at: `https://personnel-system.onrender.com`

### 5. Database Setup (First Time)
After deployment, run database sync:
```bash
# Open Render Shell
# Run: node -e "
const sequelize = require('./config/database');
require('./models');
sequelize.sync({ force: true }).then(() => {
  console.log('Database synced!');
  process.exit(0);
});
"
```

### 6. Login
- URL: `https://personnel-system.onrender.com`
- Username: `admin`
- Password: `admin123`

## 📋 Features
- ✅ User Management
- ✅ Portfolio System
- ✅ Meeting Management
- ✅ Duty Management
- ✅ QR Code Check-in
- ✅ File Uploads
- ✅ Audit Logs

## 🔧 Technical Stack
- **Backend**: Node.js + Express
- **Database**: MySQL (Remote)
- **Frontend**: HTML/CSS/JavaScript
- **Authentication**: JWT
- **File Upload**: Multer

## 💡 Notes
- Free tier available
- Auto-deploy from GitHub
- SSL certificate included
- Custom domain supported
