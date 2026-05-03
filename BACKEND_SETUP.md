# Backend Connection Setup

## What was changed:

1. **Updated API Service** (`src/app/services/api.service.ts`)
   - Added proper HTTP methods for all backend endpoints
   - Added error handling with proper error messages
   - Changed base URL to use proxy (`/api`) to avoid CORS issues
   - Added methods for: contact form, newsletter, projects, skills, testimonials

2. **Updated Contact Component** (`src/app/contact/contact.ts`)
   - Injected ApiService
   - Connected form submission to PHP backend
   - Added proper error handling and success messages
   - Enhanced form validation (min/max lengths)

3. **PHP Backend is Ready** (`php/` folder)
   - `contact.php` - Handles contact form submissions with email sending
   - `api.php` - Provides endpoints for projects, skills, testimonials
   - `newsletter.php` - Handles newsletter subscriptions
   - All files include security features (rate limiting, validation, sanitization)

## How to Test:

### 1. Start PHP Backend Server
```bash
# Open a new terminal and run:
npm run php

# Or manually:
php -S localhost:8000 -t php
```

### 2. Start Angular Dev Server with Proxy
```bash
# Open another terminal and run:
npm run start:proxy

# Or manually:
ng serve --proxy-config proxy.conf.json
```

### 3. Test the Contact Form
1. Navigate to http://localhost:4200/contact
2. Fill out the form with valid data
3. Submit the form
4. Check the terminal for PHP logs
5. Check `php/logs/contact.log` for submission details

## Configuration:

### Update Email Settings
Edit `php/config.php` and change:
```php
define('CONTACT_EMAIL', 'your-email@example.com'); // Your email
define('FROM_EMAIL', 'noreply@yourdomain.com');    // Sender email
```

### Proxy Configuration
The proxy is already configured in `proxy.conf.json`:
- Angular requests to `/api/*` are forwarded to `http://localhost:8000/`
- This avoids CORS issues during development

## Testing API Endpoints:

### Test Contact Form
```bash
curl -X POST http://localhost:8000/contact.php \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "This is a test message from the API"
  }'
```

### Test Projects API
```bash
curl http://localhost:8000/api.php?resource=projects
```

### Test Skills API
```bash
curl http://localhost:8000/api.php?resource=skills
```

## Security Features Enabled:

✅ Rate limiting (5 requests per hour per IP)
✅ Input validation and sanitization
✅ CORS headers configured
✅ Honeypot anti-spam
✅ Detailed logging
✅ Error handling

## Production Deployment:

1. Update `php/config.php` with production settings
2. Update API base URL in `api.service.ts` to your production API URL
3. Ensure PHP mail is configured on your server
4. Set proper file permissions on PHP files
5. Enable HTTPS

## Troubleshooting:

**Contact form not working?**
- Make sure PHP server is running on port 8000
- Check Angular is using proxy: `npm run start:proxy`
- Check browser console for errors
- Check `php/logs/contact.log` for PHP errors

**Emails not sending?**
- Check PHP mail configuration
- Verify email address in `php/config.php`
- Check sendmail is installed: `which sendmail`
- Consider using SMTP instead of PHP mail()

**CORS errors?**
- Make sure you're using the proxy (start:proxy)
- Verify proxy.conf.json is configured correctly
- Check PHP CORS headers in `php/utils.php`
