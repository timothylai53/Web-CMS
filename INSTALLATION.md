# 📦 Installation & Setup Guide

## System Requirements

### Required Software
- **Node.js**: Version 20.19.0 or higher
- **npm**: Version 10.0.0 or higher (comes with Node.js)
- **Modern Web Browser**: Chrome, Firefox, Edge, or Safari

### Check Your Current Versions
```bash
node --version
npm --version
```

If you need to install/update Node.js, download from: https://nodejs.org/

---

## Installation Steps

### 1. Navigate to Project Directory
```bash
cd "c:\Users\Timothy\Desktop\UUM\SEM 5\FINAL YEAR PROJECT 1\Catering-Management-System\Catering-Management-System"
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- Vue 3
- Vite
- Pinia
- Vue Router
- And all other dependencies

**Expected time**: 1-3 minutes

### 3. Verify Installation
After installation completes, verify your `node_modules` folder exists and contains packages.

---

## Running the Application

### Development Mode (Recommended for Testing)

```bash
npm run dev
```

**What happens:**
- Vite dev server starts
- Application available at `http://localhost:5173`
- Hot Module Replacement (HMR) enabled
- Changes auto-reload in browser

**Console output should show:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Production Build

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

**What happens:**
- Creates optimized production files in `dist/` folder
- Minified and bundled code
- Ready for deployment

---

## First Time Setup

### 1. Open Your Browser
Navigate to: `http://localhost:5173`

### 2. You Should See
The login page with:
- Logo
- Username and password fields
- "Forgot Password?" link
- "Register Account" link

### 3. Test Admin Login
```
Username: admin
Password: admin123
```

Should redirect to: `http://localhost:5173/admin/dashboard`

### 4. Test Customer Registration
1. Click "Register Account"
2. Fill in the form:
   - Full Name: Test User
   - Username: testuser
   - Email: test@example.com
   - Phone: 012-3456789
   - Address: Test Address
   - Password: test123
   - Confirm Password: test123
3. Click "Register"

Should redirect to: `http://localhost:5173/dashboard`

---

## Project Structure After Installation

```
Catering-Management-System/
├── node_modules/          # Dependencies (auto-generated)
├── public/                # Static assets
├── src/                   # Source code
│   ├── assets/           # Images, CSS
│   ├── components/       # Reusable components
│   ├── router/           # Vue Router config
│   ├── stores/           # Pinia stores
│   ├── views/            # Page components
│   ├── App.vue           # Root component
│   └── main.js           # Entry point
├── .gitignore
├── index.html            # HTML template
├── jsconfig.json         # JavaScript config
├── package.json          # Dependencies list
├── package-lock.json     # Locked versions
├── vite.config.js        # Vite configuration
├── README.md
├── QUICK_START.md
├── SYSTEM_DOCUMENTATION.md
├── PROJECT_SUMMARY.md
├── FEATURES_LIST.md
└── INSTALLATION.md       # This file
```

---

## Common Issues & Solutions

### Issue 1: Port 5173 Already in Use

**Error:**
```
Port 5173 is in use, trying another one...
```

**Solution 1:** Use different port
```bash
npm run dev -- --port 3000
```

**Solution 2:** Kill process using port 5173
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process

# Or find and close manually
netstat -ano | findstr :5173
```

### Issue 2: Module Not Found

**Error:**
```
Cannot find module '@/...'
```

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: Vite Not Recognized

**Error:**
```
'vite' is not recognized as an internal or external command
```

**Solution:**
```bash
# Install dependencies first
npm install

# Or run with npx
npx vite
```

### Issue 4: Vue DevTools Not Working

**Solution:**
1. Install Vue DevTools browser extension
2. Reload page
3. Open DevTools (F12)
4. Look for "Vue" tab

### Issue 5: Blank Page After Build

**Solution:**
Check `vite.config.js` base path:
```javascript
export default defineConfig({
  base: './', // Use relative paths
  // ... other config
})
```

---

## Development Tools Setup

### Recommended VS Code Extensions
1. **Vue - Official** (Vue.volar)
2. **ESLint**
3. **Prettier**
4. **Auto Rename Tag**
5. **Auto Close Tag**

### Install Extensions
```bash
# Via VS Code Command Palette (Ctrl+P)
ext install Vue.volar
```

### Browser Extensions
1. **Vue.js devtools** - For debugging
   - Chrome: https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/

---

## Testing the Installation

### Quick Test Checklist

- [ ] Run `npm run dev` successfully
- [ ] Navigate to `http://localhost:5173`
- [ ] See login page
- [ ] Login as admin (admin/admin123)
- [ ] See admin dashboard
- [ ] Logout
- [ ] Register new customer account
- [ ] See customer dashboard
- [ ] Navigate to Menu
- [ ] Add item to cart
- [ ] View cart
- [ ] No console errors (F12)

### Performance Check
Open browser DevTools (F12) → Network tab:
- Initial load should be < 2 seconds
- Hot reload should be < 1 second

---

## Environment Configuration

### Current Configuration
The system uses default Vite configuration with:
- Dev server port: 5173
- Build output: `dist/`
- Public assets: `public/`

### Custom Configuration (Optional)
Edit `vite.config.js` for custom settings:

```javascript
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,        // Change dev server port
    open: true,        // Auto-open browser
    host: true         // Expose to network
  },
  build: {
    outDir: 'dist',    // Output directory
    sourcemap: false   // Disable source maps
  }
})
```

---

## Data Reset Instructions

### Clear All Data
To reset the system to initial state:

**Method 1: Browser Console**
```javascript
localStorage.clear()
location.reload()
```

**Method 2: DevTools**
1. F12 → Application tab
2. Storage → Local Storage
3. Right-click → Clear
4. Refresh page (F5)

### Clear Specific Data

**Clear Cart Only:**
```javascript
localStorage.removeItem('cart')
```

**Clear Orders Only:**
```javascript
localStorage.removeItem('orders')
```

**Clear Auth Only (Logout):**
```javascript
localStorage.removeItem('auth_token')
localStorage.removeItem('user')
```

---

## Deployment Preparation

### Build for Production
```bash
npm run build
```

This creates a `dist/` folder with:
- Optimized HTML, CSS, JS
- Minified code
- Asset hashing
- Ready for static hosting

### Deploy to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Configure in repo settings
- **Any Static Host**: Upload `dist/` contents

---

## Troubleshooting Guide

### Check Installation
```bash
# Verify packages installed
npm list --depth=0

# Should show:
# vue@3.5.22
# vue-router@4.5.1
# pinia@3.0.3
# vite@7.1.7
```

### Reinstall from Scratch
```bash
# Delete everything
rm -rf node_modules package-lock.json dist

# Reinstall
npm install

# Test
npm run dev
```

### Check for Updates
```bash
# Check outdated packages
npm outdated

# Update all packages (optional)
npm update
```

---

## Getting Help

### Documentation Files
1. `QUICK_START.md` - Quick setup guide
2. `SYSTEM_DOCUMENTATION.md` - Full feature documentation
3. `PROJECT_SUMMARY.md` - Project overview
4. `FEATURES_LIST.md` - Complete features list

### Resources
- Vue 3 Docs: https://vuejs.org/
- Vite Docs: https://vitejs.dev/
- Pinia Docs: https://pinia.vuejs.org/
- Vue Router Docs: https://router.vuejs.org/

---

## Next Steps

After successful installation:

1. ✅ Read `QUICK_START.md` for usage guide
2. ✅ Explore admin features with admin account
3. ✅ Test customer flow with new registration
4. ✅ Review `FEATURES_LIST.md` for all capabilities
5. ✅ Check `SYSTEM_DOCUMENTATION.md` for details

---

**Installation Complete! 🎉**

Your Catering Management System is ready to use.  
Start with: `npm run dev`
