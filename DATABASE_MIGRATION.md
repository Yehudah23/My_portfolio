# Database Migration Complete - No More localStorage!

## What Changed

All localStorage usage has been completely removed and replaced with database storage via PHP API:

### 1. ✅ Dark Mode Preferences
- **Before**: Stored in browser localStorage
- **Now**: Stored in `user_preferences` table in MySQL database
- **API Endpoint**: `preferences.php`

### 2. ✅ Admin Project Cache
- **Before**: Cached in localStorage for performance
- **Now**: Always fetched fresh from database (projects table)
- Projects are stored in MySQL database with full CRUD operations

### 3. ✅ User Tracking
- Each user gets a unique ID stored in a cookie
- Preferences are associated with this user ID
- No localStorage dependencies whatsoever

## Database Schema

The following tables have been created:

1. **user_preferences** - Stores user settings (dark mode, etc.)
2. **projects** - All portfolio projects
3. **skills** - Your skills and proficiencies
4. **testimonials** - Client testimonials
5. **contact_submissions** - Contact form submissions
6. **newsletter_subscribers** - Newsletter email list
7. **rate_limits** - API rate limiting
8. **admin_sessions** - Admin authentication sessions

## Setup Instructions

### Step 1: Start LAMPP/XAMPP
```bash
sudo /opt/lampp/lampp start
```

### Step 2: Run Database Setup Script
```bash
cd /home/judah-king/Documents/seagate_backup/ANGULAR/Myportfolio
chmod +x setup-database.sh
./setup-database.sh
```

Or manually:
```bash
# Copy PHP files
sudo mkdir -p /opt/lampp/htdocs/myportfolio/php
sudo cp -r php/* /opt/lampp/htdocs/myportfolio/php/
sudo chmod -R 755 /opt/lampp/htdocs/myportfolio/php

# Create database
mysql -u root -p < php/database.sql
```

### Step 3: Configure Email (Optional)
Edit `/opt/lampp/htdocs/myportfolio/php/config.php`:
```php
define('CONTACT_EMAIL', 'your-email@example.com');
define('FROM_EMAIL', 'noreply@yourdomain.com');
```

### Step 4: Start PHP Server
```bash
cd /opt/lampp/htdocs/myportfolio
php -S localhost:8000 -t php
```

### Step 5: Start Angular with Proxy
```bash
cd /home/judah-king/Documents/seagate_backup/ANGULAR/Myportfolio
npm start
```

or

```bash
ng serve --proxy-config proxy.conf.json
```

## What Was Removed

### Files Modified:
1. ✅ [src/app/header/header.ts](src/app/header/header.ts)
   - Removed `localStorage.getItem('darkMode')`
   - Removed `localStorage.setItem('darkMode', ...)`
   - Added API calls to save/load preferences

2. ✅ [src/app/app.ts](src/app/app.ts)
   - Removed `localStorage.getItem('darkMode')`
   - Added API call to load preferences

3. ✅ [src/app/admin/admin-dashboard.ts](src/app/admin/admin-dashboard.ts)
   - Removed `localStorage.getItem('admin_projects_cache')`
   - Removed `localStorage.setItem('admin_projects_cache', ...)`
   - Projects now always loaded from database

4. ✅ [src/app/services/api.service.ts](src/app/services/api.service.ts)
   - Added `getUserPreferences()` method
   - Added `updateUserPreferences()` method

### PHP Files Created:
1. ✅ `php/config.php` - Database and app configuration
2. ✅ `php/utils.php` - Helper functions
3. ✅ `php/preferences.php` - User preferences API
4. ✅ `php/database.sql` - Complete database schema with sample data

## Testing

### Test Dark Mode
1. Open the app in your browser
2. Toggle dark mode using the header button
3. Check database:
   ```sql
   SELECT * FROM user_preferences;
   ```
4. Refresh the page - dark mode preference should persist

### Test Projects
1. Navigate to admin dashboard
2. Projects are loaded from database
3. No localStorage usage!

### Verify No localStorage
1. Open browser DevTools (F12)
2. Go to Application > Storage > Local Storage
3. You should see NO portfolio-related data
4. Only cookies for user_id and PHP session

## API Endpoints

All data now flows through these endpoints:

- `GET /api/preferences.php` - Get user preferences
- `POST /api/preferences.php` - Update user preferences
- `GET /api/projects.php` - Get all projects
- `POST /api/projects.php` - Create project (admin)
- `PUT /api/projects.php` - Update project (admin)
- `DELETE /api/projects.php` - Delete project (admin)
- `POST /api/contact.php` - Submit contact form
- `POST /api/newsletter.php` - Subscribe to newsletter
- `POST /api/auth.php` - Admin login
- `GET /api/auth.php` - Check auth / logout

## Security Features

- ✅ Rate limiting on all endpoints
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (prepared statements)
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Session management
- ✅ Error logging

## Troubleshooting

### Database Connection Error
- Make sure LAMPP/XAMPP is running
- Check MySQL service: `sudo /opt/lampp/lampp status`
- Verify database credentials in `config.php`

### API Not Working
- Make sure PHP server is running on port 8000
- Check proxy configuration in `proxy.conf.json`
- Look for errors in browser console and PHP logs

### Dark Mode Not Persisting
- Check if user_id cookie is set (DevTools > Application > Cookies)
- Verify preferences are being saved: `SELECT * FROM user_preferences;`
- Check PHP error logs: `/opt/lampp/htdocs/myportfolio/php/logs/`

## Success! 🎉

Your portfolio now uses a proper database backend with NO localStorage dependencies. All user preferences, projects, and data are stored securely in MySQL and accessed via PHP APIs.
