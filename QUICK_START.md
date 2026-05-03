# Quick Start - No localStorage, All Database!

## 🚀 Fast Setup (3 Steps)

### 1. Start LAMPP & Setup Database
```bash
# Start LAMPP
sudo /opt/lampp/lampp start

# Run setup script
cd /home/judah-king/Documents/seagate_backup/ANGULAR/Myportfolio
./setup-database.sh
```

### 2. Start PHP Backend
```bash
cd /opt/lampp/htdocs/myportfolio
php -S localhost:8000 -t php
```

### 3. Start Angular App
```bash
cd /home/judah-king/Documents/seagate_backup/ANGULAR/Myportfolio
npm start
```

## ✅ What's Different Now

### NO localStorage Anywhere!
- ❌ `localStorage.getItem('darkMode')` → ✅ Database API call
- ❌ `localStorage.setItem('darkMode')` → ✅ Database API call  
- ❌ `localStorage.getItem('admin_projects_cache')` → ✅ Direct database query
- ❌ All browser storage → ✅ MySQL database

### Everything is Now in the Database:
- 🌙 Dark mode preferences → `user_preferences` table
- 📁 Projects → `projects` table
- 🛠️ Skills → `skills` table
- 💬 Testimonials → `testimonials` table
- 📧 Contact forms → `contact_submissions` table
- 📰 Newsletter → `newsletter_subscribers` table

## 🔍 Verify It's Working

1. Open browser DevTools (F12)
2. Go to: Application → Local Storage
3. Should be EMPTY (no portfolio data!)
4. All data is in MySQL database at `/opt/lampp/htdocs/myportfolio/php`

## 📊 Check Database

```bash
mysql -u root -p
```

```sql
USE myportfolio;

-- See user preferences (dark mode, etc.)
SELECT * FROM user_preferences;

-- See all projects
SELECT * FROM projects;

-- See contact submissions
SELECT * FROM contact_submissions;
```

## 🎯 Key Changes Made

| File | Change |
|------|--------|
| `header.ts` | Load/save dark mode to database via API |
| `app.ts` | Load dark mode from database on init |
| `admin-dashboard.ts` | Removed localStorage cache, load from DB |
| `api.service.ts` | Added `getUserPreferences()` and `updateUserPreferences()` |
| `php/preferences.php` | NEW: API for user preferences |
| `php/database.sql` | NEW: Complete database schema |

## 🔧 Troubleshooting

**Database not found?**
```bash
mysql -u root -p < php/database.sql
```

**PHP not starting?**
```bash
# Make sure LAMPP is running
sudo /opt/lampp/lampp status

# Try different port
php -S localhost:8001 -t php
# Update proxy.conf.json target to 8001
```

**Angular proxy not working?**
```bash
ng serve --proxy-config proxy.conf.json
```

## 📝 Files Location

- **Angular App**: `/home/judah-king/Documents/seagate_backup/ANGULAR/Myportfolio`
- **PHP Backend**: `/opt/lampp/htdocs/myportfolio/php`
- **Database**: MySQL (accessible via phpMyAdmin at http://localhost/phpmyadmin)

## 🎉 Done!

Your portfolio now uses `/opt/lampp/htdocs/myportfolio/php` for everything with ZERO localStorage!
