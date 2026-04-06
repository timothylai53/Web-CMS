# Catering Management System - Quick Start Guide

## Prerequisites
- Node.js (v20 or higher)
- MongoDB installed and running
- Git (optional)

## Backend Setup

### 1. Navigate to backend folder
```powershell
cd backend
```

### 2. Install dependencies
```powershell
npm install
```

### 3. Make sure MongoDB is running
- If MongoDB is installed as a service, it should be running automatically
- To check: Open MongoDB Compass or run `mongod` in a new terminal

### 4. Start the backend server
Development mode (recommended):
```powershell
npm run dev
```

Or production mode:
```powershell
npm start
```

✅ Backend should now be running on `http://localhost:5000`

## Frontend Setup

### 1. Open a new terminal and navigate to the root directory
```powershell
cd ..
```

### 2. Install axios (if not already installed)
```powershell
npm install
```

### 3. Start the frontend
```powershell
npm run dev
```

✅ Frontend should now be running on `http://localhost:5173`

## Testing the Connection

### 1. Create an admin account
You can use the API directly or create through the frontend:

Using PowerShell:
```powershell
$body = @{
    username = "admin"
    email = "admin@catering.com"
    password = "admin123"
    role = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

### 2. Test the API
Health check:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health"
```

### 3. Open the application
Navigate to `http://localhost:5173` in your browser

## Common Issues

### MongoDB connection error
- Make sure MongoDB is running
- Check the connection string in `backend/.env`
- Default: `mongodb://localhost:27017/catering_management`

### Port already in use
- Backend (5000): Change `PORT` in `backend/.env`
- Frontend (5173): Vite will automatically use the next available port

### CORS errors
- The backend is configured to accept requests from `http://localhost:5173`
- If you change the frontend port, update `server.js` CORS settings

## Next Steps

1. **Migrate existing data**: 
   - Your current localStorage data won't automatically migrate
   - You can create a migration script or manually re-enter initial data

2. **Update Pinia stores**:
   - Modify stores to use the API service instead of localStorage
   - Example available in `src/services/api.js`

3. **Add error handling**:
   - Implement proper error messages for API failures
   - Add loading states during API calls

4. **Deploy**:
   - Backend: Deploy to Heroku, Railway, or DigitalOcean
   - Frontend: Deploy to Vercel, Netlify, or GitHub Pages
   - Database: Use MongoDB Atlas (free tier available)

## Project Structure

```
Catering-Management-System/
├── backend/                    # Node.js + Express backend
│   ├── models/                # MongoDB models
│   ├── routes/                # API routes
│   ├── middleware/            # Authentication middleware
│   ├── .env                   # Environment variables
│   ├── server.js              # Main server file
│   └── package.json
├── src/                       # Vue.js frontend
│   ├── components/
│   ├── views/
│   ├── stores/
│   ├── router/
│   └── services/
│       └── api.js            # API service (NEW)
├── .env                       # Frontend environment variables
└── package.json
```

## API Integration Example

Update your Pinia store to use the API:

```javascript
import { menuAPI } from '@/services/api'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    packages: [],
    foods: []
  }),
  
  actions: {
    async fetchPackages() {
      try {
        const response = await menuAPI.getPackages()
        this.packages = response.data
      } catch (error) {
        console.error('Error fetching packages:', error)
      }
    },
    
    async addPackage(packageData) {
      try {
        const response = await menuAPI.createPackage(packageData)
        this.packages.push(response.data.package)
      } catch (error) {
        console.error('Error creating package:', error)
      }
    }
  }
})
```

## Support

For issues or questions, check:
- Backend logs in the terminal running `npm run dev`
- Browser console for frontend errors
- MongoDB logs for database issues
