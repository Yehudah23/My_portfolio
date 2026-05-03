#!/bin/bash

# Simple copy script to move PHP files to LAMPP directory
# Run this as: sudo ./copy-to-lampp.sh

echo "Copying PHP files to /opt/lampp/htdocs/myportfolio/php..."

# Create directory if it doesn't exist
mkdir -p /opt/lampp/htdocs/myportfolio/php

# Copy all PHP files
cp -r php/* /opt/lampp/htdocs/myportfolio/php/

# Set permissions
chmod -R 755 /opt/lampp/htdocs/myportfolio/php

# Create logs directory
mkdir -p /opt/lampp/htdocs/myportfolio/php/logs
chmod -R 777 /opt/lampp/htdocs/myportfolio/php/logs

echo "✅ PHP files copied successfully!"
echo ""
echo "Files copied to: /opt/lampp/htdocs/myportfolio/php/"
echo ""
echo "Next steps:"
echo "1. Import database: mysql -u root -p < php/database.sql"
echo "2. Start PHP server: cd /opt/lampp/htdocs/myportfolio && php -S localhost:8000 -t php"
echo "3. Start Angular: npm start"
